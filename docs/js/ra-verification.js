import parseCertChain from './parse-cert-chain.js';
import iasRootCACertPEM from './ias_root_ca_cert_pem.js';
import { arrayBufferToHex, hexToArrayBuffer } from './hex.js';
import { base64ToArrayBuffer } from './base64.js';
import { parseQuoteBody } from './quote.js';
import { dvsEqual, arrayBuffersEqual } from './bytes.js';
const strict = false; // FOR TESTING
const win = window;
const trustedCerts = parseCertChain(iasRootCACertPEM);
export const PRODUCTION_MRSIGNER = hexToArrayBuffer('463be517c1f292e2cf5a328d865f03e7cbcc4355e201484c39fedbd55534e849');
export const PRODUCTION_MRENCLAVES = [
    'f279a7b3f8c804339c0bd9c159e2371c2c29f7040bce1f9731c09def887e0f8b',
].map(hexToArrayBuffer);
function commonName(cert) {
    const subjectName = cert.getSubjectString();
    const splitSubject = subjectName.split('CN=');
    if (splitSubject.length !== 2) {
        return '';
    }
    return splitSubject[1];
}
function validateCertificate(cert, trustedChain) {
    let validated = false;
    for (let i = 0; i < trustedChain.length; i = i + 1) {
        const pubKey = trustedChain[i].getPublicKey();
        if (cert.verifySignature(pubKey)) {
            validated = true;
        }
    }
    return validated;
}
// Verify IAS remote attestation verification evidence
export async function verifyRemoteAttestationReport(proof) {
    const certs = parseCertChain(proof.iasCertChain);
    // Check common name is what we expect
    if (commonName(certs[0]) !== 'Intel SGX Attestation Report Signing') {
        return false;
    }
    // Verify certificate chain with trusted certs
    if (!validateCertificate(certs[certs.length - 1], trustedCerts)) {
        return false;
    }
    // Get public key from certificate
    const pubKey = certs[0].getPublicKey();
    // Verify signature of report
    if (!pubKey.verify(proof.iasReport, arrayBufferToHex(proof.iasSignature))) {
        return false;
    }
    // Construct report data from enclave public keys
    const raResponse = JSON.parse(proof.iasReport);
    const quoteBodyBuf = base64ToArrayBuffer(raResponse.isvEnclaveQuoteBody);
    const quoteBody = parseQuoteBody(new DataView(quoteBodyBuf));
    const reportDataInput = new Uint8Array(384 + 64);
    reportDataInput.set(new Uint8Array(proof.sigModulus), 0);
    reportDataInput.set(new Uint8Array(proof.encModulus), 384);
    // Compare reconstructed report data with IAS report data
    const hash = await crypto.subtle.digest('SHA-256', reportDataInput);
    const expectedReportDataUints = new Uint8Array(64);
    const expectedReportData = new DataView(expectedReportDataUints.buffer);
    expectedReportDataUints.set(new Uint8Array(hash), 0);
    if (!dvsEqual(new DataView(quoteBody.report_body.report_data), expectedReportData)) {
        return false;
    }
    // Check the remote attestation result
    if (raResponse.isvEnclaveQuoteStatus !== 'OK') {
        const swHardeningNeeded = raResponse.isvEnclaveQuoteStatus === 'SW_HARDENING_NEEDED';
        const lvi = raResponse.advisoryIDs.length === 1 && raResponse.advisoryIDs[0] === 'INTEL-SA-00334';
        console.log(raResponse.advisoryIDs);
        if (!(swHardeningNeeded && lvi)) {
            if (strict) {
                return false;
            }
            else {
                console.log('RA failed: ', raResponse.isvEnclaveQuoteStatus, raResponse.advisoryIDs);
            }
        }
    }
    // Check MRSIGNER
    if (!arrayBuffersEqual(quoteBody.report_body.mr_signer, PRODUCTION_MRSIGNER)) {
        const hex = arrayBufferToHex(quoteBody.report_body.mr_signer);
        const expected = arrayBufferToHex(PRODUCTION_MRSIGNER);
        if (strict) {
            return false;
        }
        else {
            console.log(`Invalid MRSIGNER value in remote attestation report (is ${hex}, expected ${expected})`);
        }
    }
    // Check MRENCLAVE
    let mrEnclaveOK = false;
    for (const mrEnclave of PRODUCTION_MRENCLAVES) {
        if (arrayBuffersEqual(quoteBody.report_body.mr_enclave, mrEnclave)) {
            mrEnclaveOK = true;
            break;
        }
    }
    if (!mrEnclaveOK) {
        const hex = arrayBufferToHex(quoteBody.report_body.mr_enclave);
        if (strict) {
            return false;
        }
        else {
            console.log(`Invalid MRENCLAVE value in remote attestation report: ${hex}`);
        }
    }
    // Check for debug enclave
    if (quoteBody.report_body.attributes.flags.DEBUG) {
        if (strict) {
            return false;
        }
        else {
            console.log('DEBUG enclave');
        }
    }
    return true;
}

import { parseCertChain, commonName, validateCertificate } from './parse-cert-chain.js';
import iasRootCACertPEM from './ias_root_ca_cert_pem.js';
import { arrayBufferToHex, hexToArrayBuffer } from './hex.js';
import { base64ToArrayBuffer } from './base64.js';
import { parseQuoteBody } from './quote.js';
import { dvsEqual, arrayBuffersEqual } from './bytes.js';
const trustedCerts = parseCertChain(iasRootCACertPEM);
const PRODUCTION_MRSIGNER = hexToArrayBuffer('463be517c1f292e2cf5a328d865f03e7cbcc4355e201484c39fedbd55534e849');
const PRODUCTION_MRENCLAVES = [
    'f279a7b3f8c804339c0bd9c159e2371c2c29f7040bce1f9731c09def887e0f8b',
    '0d28ec3b1054ce02526c84c50fd119243188a0a871f309d45212a44ba51eeb43',
    '3a96a65b0c58c092b9e63ab4005d841c441be7fe48c712d492f8fb2fa7eb9d85',
].map(hexToArrayBuffer);
// Verify IAS remote attestation verification evidence
export async function verifyRemoteAttestationReport(proof) {
    const certs = parseCertChain(proof.iasCertChain);
    // Check common name is what we expect
    if (commonName(certs[0]) !== 'Intel SGX Attestation Report Signing') {
        throw new Error(`Unexpected certificate name: ${commonName(certs[0])}`);
    }
    // Verify certificate chain with trusted certs
    if (!validateCertificate(certs[certs.length - 1], trustedCerts)) {
        throw new Error('Certificate not signed by Intel root CA');
    }
    // Get public key from certificate
    const pubKey = certs[0].getPublicKey();
    // Verify signature of report
    if (!pubKey.verify(proof.iasReport, arrayBufferToHex(proof.iasSignature))) {
        throw new Error('Report data does not match signature');
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
        throw new Error('Enclave keys do not match report');
    }
    // Check the remote attestation result
    if (raResponse.isvEnclaveQuoteStatus !== 'OK') {
        const swHardeningNeeded = raResponse.isvEnclaveQuoteStatus === 'SW_HARDENING_NEEDED';
        const lvi = raResponse.advisoryIDs.length === 1 && raResponse.advisoryIDs[0] === 'INTEL-SA-00334';
        if (!(swHardeningNeeded && lvi)) {
            throw new Error('Enclave platform was not secure');
        }
    }
    // Check MRSIGNER
    if (!arrayBuffersEqual(quoteBody.report_body.mr_signer, PRODUCTION_MRSIGNER)) {
        throw new Error('Invalid MRSIGNER');
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
        throw new Error('Invalid MRENCLAVE');
    }
    // Check for debug enclave
    if (quoteBody.report_body.attributes.flags.DEBUG) {
        throw new Error('Enclave in debug mode');
    }
    return true;
}

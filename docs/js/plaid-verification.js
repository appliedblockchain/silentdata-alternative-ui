import { parseCertChain, commonName, validateCertificate } from './parse-cert-chain.js';
// Verify the Plaid certificate returned by the enclave
export async function verifyPlaidCertificate(proof) {
    const res = await fetch('../cacert.pem');
    const rootCACertPEM = await res.text();
    const trustedCerts = parseCertChain(rootCACertPEM);
    const certs = parseCertChain(proof.typeSpecificData.certificateChain);
    // Check common name is what we expect
    if (commonName(certs[0]) !== 'production.plaid.com') {
        throw new Error(`Unexpected certificate name: ${commonName(certs[0])}`);
    }
    // Verify certificate chain with trusted certs
    if (!validateCertificate(certs[certs.length - 1], trustedCerts)) {
        throw new Error('Certificate not signed by root CA');
    }
    return true;
}

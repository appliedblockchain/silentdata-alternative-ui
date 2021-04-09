const win = window;
export function parseCertChain(pem) {
    const certs = [];
    const lines = pem.split('\n');
    let certBase64 = '';
    let read = false;
    for (let i = 0; i < lines.length; i = i + 1) {
        const line = lines[i];
        if (line === '-----BEGIN CERTIFICATE-----') {
            if (certBase64 !== '') {
                throw new Error('Invalid cert chain format (begin)');
            }
            certBase64 = line;
            read = true;
        }
        else if (line === '-----END CERTIFICATE-----') {
            if (certBase64 === '') {
                throw new Error('Invalid cert chain format (end)');
            }
            certBase64 += line;
            var c = new win.X509();
            c.readCertPEM(certBase64);
            certs.push(c);
            certBase64 = '';
            read = false;
        }
        else if (read) {
            certBase64 += line;
        }
    }
    return certs;
}
export function commonName(cert) {
    const subjectName = cert.getSubjectString();
    const splitSubject = subjectName.split('CN=');
    if (splitSubject.length !== 2) {
        return '';
    }
    return splitSubject[1];
}
export function validateCertificate(cert, trustedChain) {
    let validated = false;
    for (let i = 0; i < trustedChain.length; i = i + 1) {
        const pubKey = trustedChain[i].getPublicKey();
        if (cert.verifySignature(pubKey)) {
            validated = true;
        }
    }
    return validated;
}

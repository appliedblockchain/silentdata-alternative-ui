const win = window;
export default function parseCertChain(pem) {
    const certs = [];
    const lines = pem.split('\n');
    let certBase64 = '';
    for (let i = 0; i < lines.length; i = i + 1) {
        const line = lines[i];
        if (line === '') {
            // ignore
        }
        else if (line === '-----BEGIN CERTIFICATE-----') {
            if (certBase64 !== '') {
                throw new Error('Invalid cert chain format (begin)');
            }
            certBase64 = line;
        }
        else if (line === '-----END CERTIFICATE-----') {
            if (certBase64 === '') {
                throw new Error('Invalid cert chain format (end)');
            }
            certBase64 += line;
            //console.log(certBase64)
            //console.log(base64ToArrayBuffer(certBase64))
            //const asn1 = win.fromBER(base64ToArrayBuffer(certBase64))
            console.log(win.X509);
            var c = new win.X509();
            c.readCertPEM(certBase64);
            console.log(c.getSubjectString());
            certs.push(c);
            certBase64 = '';
        }
        else {
            certBase64 += line;
        }
    }
    return certs;
}

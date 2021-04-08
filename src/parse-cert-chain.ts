const win = window as any
type X509 = typeof win.X509

export function parseCertChain(pem: string): X509[] {
  const certs: X509[] = []
  const lines = pem.split('\n')

  let certBase64 = ''
  for (let i = 0; i < lines.length; i = i + 1) {
    const line = lines[i]
    if (line === '') {
      // ignore
    } else if (line === '-----BEGIN CERTIFICATE-----') {
      if (certBase64 !== '') {
        throw new Error('Invalid cert chain format (begin)')
      }
      certBase64 = line
    } else if (line === '-----END CERTIFICATE-----') {
      if (certBase64 === '') {
        throw new Error('Invalid cert chain format (end)')
      }
      certBase64 += line
      var c = new win.X509()
      c.readCertPEM(certBase64)
      certs.push(c)
      certBase64 = ''
    } else {
      certBase64 += line
    }
  }
  return certs
}

export function commonName(cert: X509): string {
  const subjectName = cert.getSubjectString()
  const splitSubject = subjectName.split('CN=')
  if (splitSubject.length !== 2) {
    return ''
  }
  return splitSubject[1]
}

export function validateCertificate(cert: X509, trustedChain: X509[]): boolean {
  let validated = false
  for (let i = 0; i < trustedChain.length; i = i + 1) {
    const pubKey = trustedChain[i].getPublicKey();
    if (cert.verifySignature(pubKey)) {
      validated = true
    }
  }
  return validated
}
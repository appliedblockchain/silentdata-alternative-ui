import { arrayBufferToHex } from './hex.js';
// Creates an RSA signature verification public key from a modulus (public exponent fixed to 65537)
export function rsaSignatureVerificationPublicKey(modulus) {
    const jsonWebKey = {
        kty: "RSA",
        n: arrayBufferToHex(modulus),
        e: "AQAB",
        use: "sig",
        alg: "RS256"
    };
    return window.crypto.subtle.importKey('jwk', jsonWebKey, {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
    }, true, ['verify']);
}
// Verifies an RSA signature against a message using a public key
export function rsaVerify(pubKey, message, signature) {
    return window.crypto.subtle.verify('RSASSA-PKCS1-v1_5', pubKey, signature, message);
}

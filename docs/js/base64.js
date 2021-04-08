export function arrayBufferToBase64UrlEncode(ab, littleEndian) {
    let binary = '';
    const bytes = new Uint8Array(ab);
    if (littleEndian) {
        for (var i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
    }
    else {
        for (var i = bytes.byteLength - 1; i >= 0; i--) {
            binary += String.fromCharCode(bytes[i]);
        }
    }
    return window.btoa(binary)
        .replace(/\//g, '_')
        .replace(/=/g, '')
        .replace(/\+/g, '-');
}
export function base64ToArrayBuffer(base64) {
    const byteString = atob(base64);
    const buf = new ArrayBuffer(byteString.length);
    const uints = new Uint8Array(buf);
    for (let i = 0; i < byteString.length; i = i + 1) {
        uints[i] = byteString.codePointAt(i);
    }
    return buf;
}

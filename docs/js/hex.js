export function fillWithDataFromHex(bytes, hexString) {
    if (bytes.length * 2 !== hexString.length) {
        throw new Error('Lengths of buffer and hex string not compatible');
    }
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hexString.substr(i * 2, 2), 16); // eslint-disable-line no-param-reassign
    }
}
export function hexToArrayBuffer(input) {
    const uints = new Uint8Array(input.length / 2);
    fillWithDataFromHex(uints, input);
    return uints.buffer;
}
const byteToHex = [];
for (let n = 0; n <= 0xff; ++n) {
    const hexOctet = n.toString(16).padStart(2, '0');
    byteToHex.push(hexOctet);
}
export function dataViewToHex(view) {
    const hexOctets = [];
    for (let i = 0; i < view.byteLength; ++i)
        hexOctets.push(byteToHex[view.getUint8(i)]);
    return hexOctets.join('');
}
export function arrayBufferToHex(ab) {
    return dataViewToHex(new DataView(ab));
}
export function arrayBufferToBase64UrlEncode(ab) {
    let binary = '';
    const bytes = new Uint8Array(ab);
    for (var i = bytes.byteLength - 1; i >= 0; i--) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary)
        .replace(/\//g, '_')
        .replace(/=/g, '')
        .replace(/\+/g, '-');
}
export function hexToBase64(str) {
    return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
}

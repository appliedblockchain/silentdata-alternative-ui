export function arrayBufferToBase64UrlEncode(ab: ArrayBuffer, littleEndian: boolean): string {
  let binary = '';
  const bytes = new Uint8Array(ab);
  if (littleEndian) {
    for (var i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
  } else {
    for (var i = bytes.byteLength - 1; i >= 0; i--) {
      binary += String.fromCharCode(bytes[i]);
    }
  }
  return window.btoa(binary)
    .replace(/\//g, '_')
    .replace(/=/g, '')
    .replace(/\+/g, '-');
}

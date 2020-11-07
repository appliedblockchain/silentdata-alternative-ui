export function fillWithDataFromHex(bytes: Uint8Array, hexString: string): void {
  if (bytes.length * 2 !== hexString.length) {
    throw new Error('Lengths of buffer and hex string not compatible')
  }
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hexString.substr(i * 2, 2), 16) // eslint-disable-line no-param-reassign
  }
}

export function hexToArrayBuffer(input: string): ArrayBuffer {
  const uints = new Uint8Array(input.length / 2)
  fillWithDataFromHex(uints, input)
  return uints.buffer
}

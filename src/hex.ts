export function fillWithDataFromHex(bytes: Uint8Array, hexString: string): void {
  if (bytes.length * 2 !== hexString.length) {
    throw new Error('Lengths of buffer and hex string not compatible')
  }
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hexString.substr(i * 2, 2), 16)
  }
}

export function hexToArrayBuffer(input: string): ArrayBuffer {
  const uints = new Uint8Array(input.length / 2)
  fillWithDataFromHex(uints, input)
  return uints.buffer
}

const byteToHex: string[] = []
for (let n = 0; n <= 0xff; ++n) {
  const hexOctet = n.toString(16).padStart(2, '0')
  byteToHex.push(hexOctet)
}

export function dataViewToHex(view: DataView): string {
  const hexOctets = []
  for (let i = 0; i < view.byteLength; ++i) hexOctets.push(byteToHex[view.getUint8(i)])
  return hexOctets.join('')
}

export function arrayBufferToHex(ab: ArrayBuffer): string {
  return dataViewToHex(new DataView(ab))
}

// Check if the contents of two DataViews are equal
export function dvsEqual(a, b) {
    if (a.byteLength !== b.byteLength) {
        return false;
    }
    for (let i = 0; i < a.byteLength; i = i + 1) {
        if (a.getUint8(i) !== b.getUint8(i)) {
            return false;
        }
    }
    return true;
}
// Check if the contents of two ArrayBuffers are equal
export function arrayBuffersEqual(a, b) {
    return dvsEqual(new DataView(a), new DataView(b));
}
// Create a new ArrayBuffer from a range of bytes in a DataView
export function arrayBufferFromDataView(dv, offset, length) {
    const result = new ArrayBuffer(length);
    const resultDV = new DataView(result);
    for (let i = 0; i < length; i = i + 1) {
        resultDV.setUint8(i, dv.getUint8(offset + i));
    }
    return result;
}

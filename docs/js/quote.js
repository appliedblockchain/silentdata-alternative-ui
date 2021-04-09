import { arrayBufferFromDataView } from './bytes.js';
// /* Enclave Flags Bit Masks */
const SGX_FLAGS_INITTED = 0x00000001; /* If set, then the enclave is initialized */
const SGX_FLAGS_DEBUG = 0x00000002; /* If set, then the enclave is debug */
const SGX_FLAGS_MODE64BIT = 0x00000004; /* If set, then the enclave is 64 bit */
const SGX_FLAGS_PROVISION_KEY = 0x00000010; /* If set, then the enclave has access to provision key */
const SGX_FLAGS_EINITTOKEN_KEY = 0x00000020; /* If set, then the enclave has access to EINITTOKEN key */
const SGX_FLAGS_KSS = 0x00000080; /* If set enclave uses KSS */
function checkLength(dv, expectedInputLength) {
    if (dv.byteLength !== expectedInputLength) {
        throw new Error(`SGX quote DataView length ${dv.byteLength} instead of ${expectedInputLength}`);
    }
}
function parseAttributes(dv) {
    // These are 64bits in the (C) data structure, but small enough to fit in 32 bits, so we don't
    // need BigInts, which aren't available everywhere (e.g. Safari < version 14)
    const flags = dv.getUint32(0, true);
    const xfrm = dv.getUint32(8, true);
    return {
        flags: {
            INITTED: (flags & SGX_FLAGS_INITTED) > 0,
            DEBUG: (flags & SGX_FLAGS_DEBUG) > 0,
            MODE64BIT: (flags & SGX_FLAGS_MODE64BIT) > 0,
            PROVISION_KEY: (flags & SGX_FLAGS_PROVISION_KEY) > 0,
            EINITTOKEN_KEY: (flags & SGX_FLAGS_EINITTOKEN_KEY) > 0,
            KSS: (flags & SGX_FLAGS_KSS) > 0,
        },
        xfrm,
    };
}
function parseReportBody(dv) {
    checkLength(dv, 384);
    return {
        cpu_svn: arrayBufferFromDataView(dv, 0, 16),
        misc_select: dv.getUint32(16, true),
        isv_ext_prod_id: arrayBufferFromDataView(dv, 32, 16),
        attributes: parseAttributes(new DataView(dv.buffer, dv.byteOffset + 48, 16)),
        mr_enclave: arrayBufferFromDataView(dv, 64, 32),
        mr_signer: arrayBufferFromDataView(dv, 128, 32),
        config_id: arrayBufferFromDataView(dv, 192, 64),
        isv_prod_id: dv.getUint16(256, true),
        isv_svn: dv.getUint16(258, true),
        config_svn: dv.getUint16(260, true),
        isv_family_id: arrayBufferFromDataView(dv, 304, 16),
        report_data: arrayBufferFromDataView(dv, 320, 64),
    };
}
export function parseQuoteBody(dv) {
    checkLength(dv, 432);
    return {
        version: dv.getUint16(0, true),
        sign_type: dv.getUint16(2, true),
        epid_group_id: arrayBufferFromDataView(dv, 4, 4),
        qe_svn: dv.getUint16(8, true),
        pce_svn: dv.getUint16(10, true),
        xeid: dv.getUint32(12, true),
        basename: arrayBufferFromDataView(dv, 16, 32),
        report_body: parseReportBody(new DataView(dv.buffer, dv.byteOffset + 48, 384)),
    };
}

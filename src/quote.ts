import { arrayBufferFromDataView } from './bytes.js'

// typedef struct _quote_t
// {
//     uint16_t            version;        /* 0   */
//     uint16_t            sign_type;      /* 2   */
//     sgx_epid_group_id_t epid_group_id;  /* 4   */
//     sgx_isv_svn_t       qe_svn;         /* 8   */
//     sgx_isv_svn_t       pce_svn;        /* 10  */
//     uint32_t            xeid;           /* 12  */
//     sgx_basename_t      basename;       /* 16  */
//     sgx_report_body_t   report_body;    /* 48  */
//     uint32_t            signature_len;  /* 432 */
//     uint8_t             signature[];    /* 436 */
// } sgx_quote_t;
type SGXQuoteBody = {
  version: number
  sign_type: number
  epid_group_id: ArrayBuffer
  qe_svn: number
  pce_svn: number
  xeid: number
  basename: ArrayBuffer
  report_body: SGXReportBody
}

// typedef struct _report_body_t
// {
//     sgx_cpu_svn_t           cpu_svn;        /* (  0) Security Version of the CPU */
//     sgx_misc_select_t       misc_select;    /* ( 16) Which fields defined in SSA.MISC */
//     uint8_t                 reserved1[SGX_REPORT_BODY_RESERVED1_BYTES];  /* ( 20) */
//     sgx_isvext_prod_id_t    isv_ext_prod_id;/* ( 32) ISV assigned Extended Product ID */
//     sgx_attributes_t        attributes;     /* ( 48) Any special Capabilities the Enclave possess */
//     sgx_measurement_t       mr_enclave;     /* ( 64) The value of the enclave's ENCLAVE measurement */
//     uint8_t                 reserved2[SGX_REPORT_BODY_RESERVED2_BYTES];  /* ( 96) */
//     sgx_measurement_t       mr_signer;      /* (128) The value of the enclave's SIGNER measurement */
//     uint8_t                 reserved3[SGX_REPORT_BODY_RESERVED3_BYTES];  /* (160) */
//     sgx_config_id_t         config_id;      /* (192) CONFIGID */
//     sgx_prod_id_t           isv_prod_id;    /* (256) Product ID of the Enclave */
//     sgx_isv_svn_t           isv_svn;        /* (258) Security Version of the Enclave */
//     sgx_config_svn_t        config_svn;     /* (260) CONFIGSVN */
//     uint8_t                 reserved4[SGX_REPORT_BODY_RESERVED4_BYTES];  /* (262) */
//     sgx_isvfamily_id_t      isv_family_id;  /* (304) ISV assigned Family ID */
//     sgx_report_data_t       report_data;    /* (320) Data provided by the user */
// } sgx_report_body_t;
type SGXReportBody = {
  cpu_svn: ArrayBuffer
  misc_select: number
  isv_ext_prod_id: ArrayBuffer
  attributes: SGXAttributes
  mr_enclave: ArrayBuffer
  mr_signer: ArrayBuffer
  config_id: ArrayBuffer
  isv_prod_id: number
  isv_svn: number
  config_svn: number
  isv_family_id: ArrayBuffer
  report_data: ArrayBuffer
}

// /* Enclave Flags Bit Masks */
const SGX_FLAGS_INITTED = 0x00000001 /* If set, then the enclave is initialized */
const SGX_FLAGS_DEBUG = 0x00000002 /* If set, then the enclave is debug */
const SGX_FLAGS_MODE64BIT = 0x00000004 /* If set, then the enclave is 64 bit */
const SGX_FLAGS_PROVISION_KEY = 0x00000010 /* If set, then the enclave has access to provision key */
const SGX_FLAGS_EINITTOKEN_KEY = 0x00000020 /* If set, then the enclave has access to EINITTOKEN key */
const SGX_FLAGS_KSS = 0x00000080 /* If set enclave uses KSS */

type SGXAttributes = {
  flags: {
    INITTED: boolean
    DEBUG: boolean
    MODE64BIT: boolean
    PROVISION_KEY: boolean
    EINITTOKEN_KEY: boolean
    KSS: boolean
  }
  xfrm: number
}

function checkLength(dv: DataView, expectedInputLength: number) {
  if (dv.byteLength !== expectedInputLength) {
    throw new Error(`SGX quote DataView length ${dv.byteLength} instead of ${expectedInputLength}`)
  }
}

function parseAttributes(dv: DataView): SGXAttributes {
  // These are 64bits in the (C) data structure, but small enough to fit in 32 bits, so we don't
  // need BigInts, which aren't available everywhere (e.g. Safari < version 14)
  const flags = dv.getUint32(0, true)
  const xfrm = dv.getUint32(8, true)
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
  }
}

function parseReportBody(dv: DataView): SGXReportBody {
  checkLength(dv, 384)
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
  }
}

export function parseQuoteBody(dv: DataView): SGXQuoteBody {
  checkLength(dv, 432)
  return {
    version: dv.getUint16(0, true),
    sign_type: dv.getUint16(2, true),
    epid_group_id: arrayBufferFromDataView(dv, 4, 4),
    qe_svn: dv.getUint16(8, true),
    pce_svn: dv.getUint16(10, true),
    xeid: dv.getUint32(12, true),
    basename: arrayBufferFromDataView(dv, 16, 32),
    report_body: parseReportBody(new DataView(dv.buffer, dv.byteOffset + 48, 384)),
  }
}

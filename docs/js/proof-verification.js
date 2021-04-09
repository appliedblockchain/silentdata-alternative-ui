import { hexToArrayBuffer } from './hex.js';
import { rsaSignatureVerificationPublicKey, rsaVerify } from './crypto.js';
const encoder = new TextEncoder();
const uuidBytes = (uuid) => hexToArrayBuffer(uuid.replace(/-/g, ''));
function minimumBalanceBinaryAttestationData(proof) {
    const data = new ArrayBuffer(346 + proof.typeSpecificData.certificateChain.length);
    const uints = new Uint8Array(data);
    const dataView = new DataView(data);
    // From byte w/ index 0: Attestation type (1 = minimum balance, 2 bytes)
    dataView.setUint16(0, proof.typeSpecificData.attestationType, true);
    // From byte w/ index 2: ID (16 bytes)
    uints.set(new Uint8Array(uuidBytes(proof.typeSpecificData.processId)), 2);
    // From byte w/ index 18: Server timestamp as a zero-delimited string
    uints.set(encoder.encode(proof.typeSpecificData.serverTimestamp), 18);
    // From byte w/ index 82: account holder as a zero-delimited string
    uints.set(encoder.encode(proof.typeSpecificData.accountHolderName), 82);
    // From byte w/ index 210: institution as a zero-delimited string
    uints.set(encoder.encode(proof.typeSpecificData.institutionName), 210);
    // From byte w/ index 338: Min. balance as a 32bit little-endian signed integer (4 bytes)
    dataView.setInt32(338, proof.typeSpecificData.attestationData.minimumBalance, true);
    // From byte w/ index 342: Request timestamp as a 32bit little-endian signed integer (4 bytes)
    dataView.setInt32(342, proof.typeSpecificData.requestTimestamp, true);
    // From byte w/ index 346: Cert chain
    uints.set(encoder.encode(proof.typeSpecificData.certificateChain), 346);
    return data;
}
function consistentIncomeBinaryAttestationData(proof) {
    const data = new ArrayBuffer(346 + proof.typeSpecificData.certificateChain.length);
    const uints = new Uint8Array(data);
    const dataView = new DataView(data);
    // From byte w/ index 0: Attestation type (2 = consistent income, 4 = stable income, 2 bytes)
    dataView.setUint16(0, proof.typeSpecificData.attestationType, true);
    // From byte w/ index 2: ID (16 bytes)
    uints.set(new Uint8Array(uuidBytes(proof.typeSpecificData.processId)), 2);
    // From byte w/ index 18: Server timestamp as a zero-delimited string
    uints.set(encoder.encode(proof.typeSpecificData.serverTimestamp), 18);
    // From byte w/ index 82: account holder as a zero-delimited string
    uints.set(encoder.encode(proof.typeSpecificData.accountHolderName), 82);
    // From byte w/ index 210: institution as a zero-delimited string
    uints.set(encoder.encode(proof.typeSpecificData.institutionName), 210);
    // From byte w/ index 338: Consistent income as a 32bit little-endian signed integer (4 bytes)
    dataView.setInt32(338, proof.typeSpecificData.attestationData.consistentIncome, true);
    // From byte w/ index 342: Request timestamp as a 32bit little-endian signed integer (4 bytes)
    dataView.setInt32(342, proof.typeSpecificData.requestTimestamp, true);
    // From byte w/ index 346: Cert chain
    uints.set(encoder.encode(proof.typeSpecificData.certificateChain), 346);
    return data;
}
function accountOwnershipBinaryAttestationData(proof) {
    const data = new ArrayBuffer(387 + proof.typeSpecificData.certificateChain.length);
    const uints = new Uint8Array(data);
    const dataView = new DataView(data);
    // From byte w/ index 0: Attestation type (3 = account ownership, 2 bytes)
    dataView.setUint16(0, proof.typeSpecificData.attestationType, true);
    // From byte w/ index 2: ID (16 bytes)
    uints.set(new Uint8Array(uuidBytes(proof.typeSpecificData.processId)), 2);
    // From byte w/ index 18: Server timestamp as a zero-delimited string
    uints.set(encoder.encode(proof.typeSpecificData.serverTimestamp), 18);
    // From byte w/ index 82: account holder as a zero-delimited string
    uints.set(encoder.encode(proof.typeSpecificData.accountHolderName), 82);
    // From byte w/ index 210: institution as a zero-delimited string
    uints.set(encoder.encode(proof.typeSpecificData.institutionName), 210);
    // From byte w/ index 338: Supported bank info (1 = BOTH, 2 = NO_BACS, 3 = NO_IBAN, 2 bytes)
    dataView.setInt32(338, proof.typeSpecificData.attestationData.supportedBankInfo, true);
    // From byte w/ index 340: Account number as a 32bit little-endian unsigned integer (4 bytes)
    dataView.setUint32(340, proof.typeSpecificData.attestationData.accountNumber, true);
    // From byte w/ index 344: Sort code as a 32bit little-endian unsigned integer (4 bytes)
    dataView.setUint32(344, proof.typeSpecificData.attestationData.sortCode, true);
    // From byte w/ index 348: IBAN as a zero-delimited string (max. 34 bytes)
    uints.set(encoder.encode(proof.typeSpecificData.attestationData.iban), 348);
    // From byte w/ index 383: Request timestamp as a 32bit little-endian signed integer (4 bytes)
    dataView.setInt32(383, proof.typeSpecificData.requestTimestamp, true);
    // From byte w/ index 387: Cert chain
    uints.set(encoder.encode(proof.typeSpecificData.certificateChain), 387);
    return data;
}
export async function verifyProofSignature(proof) {
    let attestationData;
    if (proof.type === 'minimumBalance') {
        attestationData = minimumBalanceBinaryAttestationData(proof);
    }
    else if (proof.type === 'consistentIncome') {
        attestationData = consistentIncomeBinaryAttestationData(proof);
    }
    else if (proof.type === 'accountOwnership') {
        attestationData = accountOwnershipBinaryAttestationData(proof);
    }
    const pubKey = await rsaSignatureVerificationPublicKey(proof.sigModulus);
    const verificationResult = await rsaVerify(pubKey, attestationData, proof.signature);
    if (!verificationResult) {
        throw new Error("Proof data doesn't match signature");
    }
    return true;
}

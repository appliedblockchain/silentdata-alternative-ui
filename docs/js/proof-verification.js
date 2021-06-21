import { hexToArrayBuffer } from './hex.js';
import { rsaSignatureVerificationPublicKey, rsaVerify } from './crypto.js';
const encoder = new TextEncoder();
const uuidBytes = (uuid) => hexToArrayBuffer(uuid.replace(/-/g, ''));
function minimumBalanceBinaryAttestationData(proof) {
    let versionSize = 0;
    let currencyCodeSize = 0;
    if (proof.version) {
        versionSize = 6;
        currencyCodeSize = 4;
    }
    const data = new ArrayBuffer(346 + versionSize + currencyCodeSize + proof.typeSpecificData.certificateChain.length);
    const uints = new Uint8Array(data);
    const dataView = new DataView(data);
    if (proof.version) {
        // Proof data serialization version string (5 bytes + zero delimiter)
        uints.set(encoder.encode(proof.version), 0);
    }
    // Process type (1 = minimum balance, 2 bytes)
    dataView.setUint16(0 + versionSize, 1, true);
    // ID (16 bytes)
    uints.set(new Uint8Array(uuidBytes(proof.typeSpecificData.processId)), 2 + versionSize);
    // Server timestamp as a zero-delimited string
    uints.set(encoder.encode(proof.typeSpecificData.serverTimestamp), 18 + versionSize);
    // Account holder as a zero-delimited string
    uints.set(encoder.encode(proof.typeSpecificData.accountHolderName), 82 + versionSize);
    // Institution as a zero-delimited string
    uints.set(encoder.encode(proof.typeSpecificData.institutionName), 210 + versionSize);
    if (proof.version) {
        // Currency code as a zero-delimited string
        uints.set(encoder.encode(proof.typeSpecificData.proofData.currencyCode), 338 + versionSize);
    }
    // Min. balance as a 32bit little-endian signed integer (4 bytes)
    dataView.setUint32(338 + versionSize + currencyCodeSize, proof.typeSpecificData.proofData.minimumBalance, true);
    // Request timestamp as a 32bit little-endian signed integer (4 bytes)
    dataView.setInt32(342 + versionSize + currencyCodeSize, proof.typeSpecificData.requestTimestamp, true);
    // Cert chain
    uints.set(encoder.encode(proof.typeSpecificData.certificateChain), 346 + versionSize + currencyCodeSize);
    return data;
}
function consistentIncomeBinaryAttestationData(proof) {
    let versionSize = 0;
    let currencyCodeSize = 0;
    if (proof.version) {
        versionSize = 6;
        currencyCodeSize = 4;
    }
    const data = new ArrayBuffer(346 + versionSize + currencyCodeSize + proof.typeSpecificData.certificateChain.length);
    const uints = new Uint8Array(data);
    const dataView = new DataView(data);
    if (proof.version) {
        // Proof data serialization version string (5 bytes + zero delimiter)
        uints.set(encoder.encode(proof.version), 0);
    }
    // Process type (2 = consistent income, 4 = stable income, 2 bytes)
    dataView.setUint16(0 + versionSize, proof.typeSpecificData.proofType, true);
    // ID (16 bytes)
    uints.set(new Uint8Array(uuidBytes(proof.typeSpecificData.processId)), 2 + versionSize);
    // Server timestamp as a zero-delimited string
    uints.set(encoder.encode(proof.typeSpecificData.serverTimestamp), 18 + versionSize);
    // Account holder as a zero-delimited string
    uints.set(encoder.encode(proof.typeSpecificData.accountHolderName), 82 + versionSize);
    // Institution as a zero-delimited string
    uints.set(encoder.encode(proof.typeSpecificData.institutionName), 210 + versionSize);
    if (proof.version) {
        // Currency code as a zero-delimited string
        uints.set(encoder.encode(proof.typeSpecificData.proofData.currencyCode), 338 + versionSize);
    }
    // Min. income as a 32bit little-endian signed integer (4 bytes)
    dataView.setUint32(338 + versionSize + currencyCodeSize, proof.typeSpecificData.proofData.consistentIncome, true);
    // Request timestamp as a 32bit little-endian signed integer (4 bytes)
    dataView.setInt32(342 + versionSize + currencyCodeSize, proof.typeSpecificData.requestTimestamp, true);
    // Cert chain
    uints.set(encoder.encode(proof.typeSpecificData.certificateChain), 346 + versionSize + currencyCodeSize);
    return data;
}
function accountOwnershipBinaryAttestationData(proof) {
    let versionSize = 0;
    if (proof.version) {
        versionSize = 6;
    }
    const data = new ArrayBuffer(387 + versionSize + proof.typeSpecificData.certificateChain.length);
    const uints = new Uint8Array(data);
    const dataView = new DataView(data);
    if (proof.version) {
        // Proof data serialization version string (5 bytes + zero delimiter)
        uints.set(encoder.encode(proof.version), 0);
    }
    // From byte w/ index 0: Proof type (3 = account ownership, 2 bytes)
    dataView.setUint16(0 + versionSize, 3, true);
    // From byte w/ index 2: ID (16 bytes)
    uints.set(new Uint8Array(uuidBytes(proof.typeSpecificData.processId)), 2 + versionSize);
    // From byte w/ index 18: Server timestamp as a zero-delimited string
    uints.set(encoder.encode(proof.typeSpecificData.serverTimestamp), 18 + versionSize);
    // From byte w/ index 82: account holder as a zero-delimited string
    uints.set(encoder.encode(proof.typeSpecificData.accountHolderName), 82 + versionSize);
    // From byte w/ index 210: institution as a zero-delimited string
    uints.set(encoder.encode(proof.typeSpecificData.institutionName), 210 + versionSize);
    // From byte w/ index 338: Supported bank info (1 = BOTH, 2 = NO_BACS, 3 = NO_IBAN, 2 bytes)
    dataView.setUint16(338 + versionSize, proof.typeSpecificData.proofData.supportedBankInfo, true);
    // From byte w/ index 340: Account number as a 32bit little-endian unsigned integer (4 bytes)
    dataView.setUint32(340 + versionSize, proof.typeSpecificData.proofData.accountNumber, true);
    // From byte w/ index 344: Sort code as a 32bit little-endian unsigned integer (4 bytes)
    dataView.setUint32(344 + versionSize, proof.typeSpecificData.proofData.sortCode, true);
    // From byte w/ index 348: IBAN as a zero-delimited string (max. 34 bytes)
    uints.set(encoder.encode(proof.typeSpecificData.proofData.iban), 348 + versionSize);
    // From byte w/ index 383: Request timestamp as a 32bit little-endian signed integer (4 bytes)
    dataView.setInt32(383 + versionSize, proof.typeSpecificData.requestTimestamp, true);
    // From byte w/ index 387: Cert chain
    uints.set(encoder.encode(proof.typeSpecificData.certificateChain), 387 + versionSize);
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

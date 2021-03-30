import { hexToArrayBuffer } from './hex.js';
import { rsaSignatureVerificationPublicKey, rsaVerify } from './crypto.js';
const encoder = new TextEncoder();
const uuidBytes = (uuid) => hexToArrayBuffer(uuid.replace(/-/g, ''));
function balanceBinaryAttestationData(proof) {
    const data = new ArrayBuffer(346 + proof.typeSpecificData.certificateChain.length);
    const uints = new Uint8Array(data);
    const dataView = new DataView(data);
    // From byte w/ index 0: Attestation type (1 = minimum balance, 2 bytes)
    dataView.setUint16(0, 1, true);
    // From byte w/ index 2: ID (16 bytes)
    uints.set(new Uint8Array(uuidBytes(proof.typeSpecificData.processId)), 2);
    // From byte w/ index 18: Server timestamp as a zero-delimited string
    uints.set(encoder.encode(proof.typeSpecificData.serverTimestamp), 18);
    // From byte w/ index 82: account holder as a zero-delimited string
    uints.set(encoder.encode(proof.typeSpecificData.accountHolderName), 82);
    // From byte w/ index 210: institution as a zero-delimited string
    uints.set(encoder.encode(proof.typeSpecificData.institutionName), 210);
    // From byte w/ index 338: Min. balance as a 32bit little-endian signed integer (4 bytes)
    dataView.setInt32(338, proof.typeSpecificData.minimumBalance, true);
    // From byte w/ index 342: Request timestamp as a 32bit little-endian signed integer (4 bytes)
    dataView.setInt32(342, proof.typeSpecificData.requestTimestamp, true);
    // From byte w/ index 346: Cert chain
    uints.set(encoder.encode(proof.typeSpecificData.certificateChain), 346);
    return data;
}
export async function verifyProofSignature(proof) {
    let attestationData;
    if (proof.type === 'minimumBalance') {
        attestationData = balanceBinaryAttestationData(proof);
    }
    const pubKey = await rsaSignatureVerificationPublicKey(proof.sigModulus);
    console.log(attestationData);
    const verificationResult = await rsaVerify(pubKey, attestationData, proof.signature);
    console.log(verificationResult);
    return verificationResult;
}

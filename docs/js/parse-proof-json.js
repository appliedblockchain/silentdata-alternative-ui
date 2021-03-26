import { hexToArrayBuffer } from './hex.js';
function parseMinimumBankBalanceProof(rawProof) {
    return {
        type: "minimumBalance",
        typeSpecificData: {
            attestationType: rawProof.typeSpecificData.attestationType,
            processId: rawProof.typeSpecificData.processId,
            serverTimestamp: rawProof.typeSpecificData.serverTimestamp,
            accountHolderName: rawProof.typeSpecificData.accountHolderName,
            institutionName: rawProof.typeSpecificData.institutionName,
            minimumBalance: rawProof.typeSpecificData.minimumBalance,
            requestTimestamp: rawProof.typeSpecificData.requestTimestamp,
            certificateChain: rawProof.typeSpecificData.certificateChain,
        },
        iasReport: rawProof.iasReport,
        iasSignature: hexToArrayBuffer(rawProof.iasSignature),
        iasCertChain: rawProof.iasCertChain,
        sigModulus: hexToArrayBuffer(rawProof.sigModulus),
        encModulus: hexToArrayBuffer(rawProof.encModulus),
        signature: hexToArrayBuffer(rawProof.signature)
    };
}
export default function parseProofJSON(json) {
    const rawProof = JSON.parse(json);
    if (rawProof.type === 'minimumBalance') {
        return parseMinimumBankBalanceProof(rawProof);
    }
    else {
        throw new Error('Invalid or unsupported proof type');
    }
}

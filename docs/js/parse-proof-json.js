import { hexToArrayBuffer } from './hex.js';
function parseMinimumBankBalanceProof(rawProof) {
    return {
        type: "minimumBankBalance",
        typeSpecificData: {
            serverTimestamp: rawProof.typeSpecificData.serverTimestamp,
            certificateChain: rawProof.typeSpecificData.certificateChain,
            accountHolderName: rawProof.typeSpecificData.accountHolderName,
            minimumBalance: rawProof.typeSpecificData.minimumBalance
        },
        iasReport: rawProof.iasReport,
        iasSignature: rawProof.iasSignature,
        sigModulus: hexToArrayBuffer(rawProof.sigModulus),
        encModulus: hexToArrayBuffer(rawProof.encModulus)
    };
}
export default function parseProofJSON(json) {
    const rawProof = JSON.parse(json);
    if (rawProof.type === 'minimumBankBalance') {
        return parseMinimumBankBalanceProof(rawProof);
    }
    else {
        throw new Error('Invalid or unsupported proof type');
    }
}

import { hexToArrayBuffer } from './hex.js';
function parseMinimumBalanceProof(rawProof) {
    return {
        type: "minimumBalance",
        typeSpecificData: {
            attestationType: rawProof.typeSpecificData.attestationType,
            attestationData: {
                minimumBalance: rawProof.typeSpecificData.attestationData.minimumBalance,
            },
            processId: rawProof.typeSpecificData.processId,
            serverTimestamp: rawProof.typeSpecificData.serverTimestamp,
            accountHolderName: rawProof.typeSpecificData.accountHolderName,
            institutionName: rawProof.typeSpecificData.institutionName,
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
function parseConsistentIncomeProof(rawProof) {
    return {
        type: "consistentIncome",
        typeSpecificData: {
            attestationType: rawProof.typeSpecificData.attestationType,
            attestationData: {
                consistentIncome: rawProof.typeSpecificData.attestationData.consistentIncome,
            },
            processId: rawProof.typeSpecificData.processId,
            serverTimestamp: rawProof.typeSpecificData.serverTimestamp,
            accountHolderName: rawProof.typeSpecificData.accountHolderName,
            institutionName: rawProof.typeSpecificData.institutionName,
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
function parseAccountOwnershipProof(rawProof) {
    return {
        type: "accountOwnership",
        typeSpecificData: {
            attestationType: rawProof.typeSpecificData.attestationType,
            attestationData: {
                supportedBankInfo: rawProof.typeSpecificData.attestationData.supportedBankInfo,
                accountNumber: rawProof.typeSpecificData.attestationData.accountNumber,
                sortCode: rawProof.typeSpecificData.attestationData.sortCode,
                iban: rawProof.typeSpecificData.attestationData.iban,
            },
            processId: rawProof.typeSpecificData.processId,
            serverTimestamp: rawProof.typeSpecificData.serverTimestamp,
            accountHolderName: rawProof.typeSpecificData.accountHolderName,
            institutionName: rawProof.typeSpecificData.institutionName,
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
        return parseMinimumBalanceProof(rawProof);
    }
    else if (rawProof.type == 'consistentIncome') {
        return parseConsistentIncomeProof(rawProof);
    }
    else if (rawProof.type == 'accountOwnership') {
        return parseAccountOwnershipProof(rawProof);
    }
    else {
        throw new Error('Invalid or unsupported proof type');
    }
}

import { hexToArrayBuffer } from './hex.js';
function parseMinimumBalanceProof(rawProof) {
    const data = rawProof.typeSpecificData.proofData ? rawProof.typeSpecificData.proofData : rawProof.typeSpecificData.attestationData;
    return {
        version: rawProof.version,
        type: "minimumBalance",
        typeSpecificData: {
            proofType: rawProof.typeSpecificData.attestationType || rawProof.typeSpecificData.proofType,
            proofData: {
                currencyCode: data.currencyCode,
                minimumBalance: data.minimumBalance,
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
    const data = rawProof.typeSpecificData.proofData ? rawProof.typeSpecificData.proofData : rawProof.typeSpecificData.attestationData;
    return {
        version: rawProof.version,
        type: "consistentIncome",
        typeSpecificData: {
            proofType: rawProof.typeSpecificData.attestationType || rawProof.typeSpecificData.proofType,
            proofData: {
                currencyCode: data.currencyCode,
                consistentIncome: data.consistentIncome,
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
    const data = rawProof.typeSpecificData.proofData ? rawProof.typeSpecificData.proofData : rawProof.typeSpecificData.attestationData;
    return {
        version: rawProof.version,
        type: "accountOwnership",
        typeSpecificData: {
            proofType: rawProof.typeSpecificData.attestationType || rawProof.typeSpecificData.proofType,
            proofData: {
                supportedBankInfo: data.supportedBankInfo,
                accountNumber: data.accountNumber,
                sortCode: data.sortCode,
                iban: data.iban,
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

import { Proof } from './types.js'
import { hexToArrayBuffer } from './hex.js'

type RawMinimumBalanceTypeSpecificData = {
  currencyCode: undefined | string,
  minimumBalance: number
}

type RawConsistentIncomeTypeSpecificData = {
  currencyCode: undefined | string,
  consistentIncome: number
}

type RawAccountOwnershipTypeSpecificData = {
  supportedBankInfo: number,
  accountNumber: number,
  sortCode: number,
  iban: string
}

type RawPlaidProof<T> = {
  attestationType: undefined | number,
  attestationData: undefined | T,
  proofType: undefined | number,
  proofData: undefined | T,
  processId: string,
  serverTimestamp: string,
  accountHolderName: string,
  institutionName: string,
  requestTimestamp: number,
  certificateChain: string
}

type GenericRawProof<T> = {
  version: undefined | string,
  type: string,
  typeSpecificData: T,
  iasReport: string,
  iasSignature: string,
  iasCertChain: string,
  sigModulus: string,
  encModulus: string,
  signature: string
}

type RawMinimumBalanceProof = GenericRawProof<RawPlaidProof<RawMinimumBalanceTypeSpecificData>>
type RawConsistentIncomeProof = GenericRawProof<RawPlaidProof<RawConsistentIncomeTypeSpecificData>>
type RawAccountOwnershipProof = GenericRawProof<RawPlaidProof<RawAccountOwnershipTypeSpecificData>>

function parseMinimumBalanceProof(rawProof: RawMinimumBalanceProof) {
  const data = rawProof.typeSpecificData.proofData ? rawProof.typeSpecificData.proofData : rawProof.typeSpecificData.attestationData
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
  }
}

function parseConsistentIncomeProof(rawProof: RawConsistentIncomeProof) {
  const data = rawProof.typeSpecificData.proofData ? rawProof.typeSpecificData.proofData : rawProof.typeSpecificData.attestationData
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
  }
}

function parseAccountOwnershipProof(rawProof: RawAccountOwnershipProof) {
  const data = rawProof.typeSpecificData.proofData ? rawProof.typeSpecificData.proofData : rawProof.typeSpecificData.attestationData
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
  }
}

export default function parseProofJSON(json: string): Proof {
  const rawProof = JSON.parse(json)
  if (rawProof.type === 'minimumBalance') {
    return parseMinimumBalanceProof(rawProof)
  } else if (rawProof.type == 'consistentIncome') {
    return parseConsistentIncomeProof(rawProof)
  } else if (rawProof.type == 'accountOwnership') {
    return parseAccountOwnershipProof(rawProof)
  } else {
    throw new Error('Invalid or unsupported proof type')
  }
}

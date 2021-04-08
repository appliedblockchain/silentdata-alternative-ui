import { Proof } from './types.js'
import { hexToArrayBuffer } from './hex.js'

type RawMinimumBalanceTypeSpecificData = {
  attestationType: number,
  processId: string,
  serverTimestamp: string,
  accountHolderName: string,
  institutionName: string,
  minimumBalance: number,
  requestTimestamp: number,
  certificateChain: string
}

type RawConsistentIncomeTypeSpecificData = {
  attestationType: number,
  processId: string,
  serverTimestamp: string,
  accountHolderName: string,
  institutionName: string,
  consistentIncome: number,
  requestTimestamp: number,
  certificateChain: string
}

type RawAccountOwnershipTypeSpecificData = {
  attestationType: number,
  processId: string,
  serverTimestamp: string,
  accountHolderName: string,
  institutionName: string,
  supportedBankInfo: number,
  accountNumber: number,
  sortCode: number,
  iban: string,
  requestTimestamp: number,
  certificateChain: string
}

type GenericRawProof<T> = {
  type: string,
  typeSpecificData: T,
  iasReport: string,
  iasSignature: string,
  iasCertChain: string,
  sigModulus: string,
  encModulus: string,
  signature: string
}

type RawMinimumBalanceProof = GenericRawProof<RawMinimumBalanceTypeSpecificData>
type RawConsistentIncomeProof = GenericRawProof<RawConsistentIncomeTypeSpecificData>
type RawAccountOwnershipProof = GenericRawProof<RawAccountOwnershipTypeSpecificData>

function parseMinimumBalanceProof(rawProof: RawMinimumBalanceProof) {
  return {
    type: "minimumBalance",
    typeSpecificData: {
      attestationType: rawProof.typeSpecificData.attestationType,
      attestationData: {
        minimumBalance: rawProof.typeSpecificData.minimumBalance,
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
  return {
    type: "consistentIncome",
    typeSpecificData: {
      attestationType: rawProof.typeSpecificData.attestationType,
      attestationData: {
        consistentIncome: rawProof.typeSpecificData.consistentIncome,
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
  return {
    type: "accountOwnership",
    typeSpecificData: {
      attestationType: rawProof.typeSpecificData.attestationType,
      attestationData: {
        supportedBankInfo: rawProof.typeSpecificData.supportedBankInfo,
        accountNumber: rawProof.typeSpecificData.accountNumber,
        sortCode: rawProof.typeSpecificData.sortCode,
        iban: rawProof.typeSpecificData.iban,
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

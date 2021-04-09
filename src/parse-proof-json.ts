import { Proof } from './types.js'
import { hexToArrayBuffer } from './hex.js'

type RawMinimumBalanceTypeSpecificData = {
  minimumBalance: number
}

type RawConsistentIncomeTypeSpecificData = {
  consistentIncome: number
}

type RawAccountOwnershipTypeSpecificData = {
  supportedBankInfo: number,
  accountNumber: number,
  sortCode: number,
  iban: string
}

type RawPlaidProof<T> = {
  attestationType: number,
  attestationData: T,
  processId: string,
  serverTimestamp: string,
  accountHolderName: string,
  institutionName: string,
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

type RawMinimumBalanceProof = GenericRawProof<RawPlaidProof<RawMinimumBalanceTypeSpecificData>>
type RawConsistentIncomeProof = GenericRawProof<RawPlaidProof<RawConsistentIncomeTypeSpecificData>>
type RawAccountOwnershipProof = GenericRawProof<RawPlaidProof<RawAccountOwnershipTypeSpecificData>>

function parseMinimumBalanceProof(rawProof: RawMinimumBalanceProof) {
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
  }
}

function parseConsistentIncomeProof(rawProof: RawConsistentIncomeProof) {
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
  }
}

function parseAccountOwnershipProof(rawProof: RawAccountOwnershipProof) {
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

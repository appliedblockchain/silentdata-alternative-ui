import { Proof, MinimumBankBalanceProof } from './types.js'
import { hexToArrayBuffer } from './hex.js'

type RawMinimumBankBalanceTypeSpecificData = {
  attestationType: number,
  processId: string,
  serverTimestamp: string,
  accountHolderName: string,
  institutionName: string,
  minimumBalance: number,
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


type RawMinimumBankBalanceProof = GenericRawProof<RawMinimumBankBalanceTypeSpecificData>

function parseMinimumBankBalanceProof(rawProof: RawMinimumBankBalanceProof) {
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
  }
}

export default function parseProofJSON(json: string): Proof {
  const rawProof = JSON.parse(json)
  if (rawProof.type === 'minimumBalance') {
    return parseMinimumBankBalanceProof(rawProof)
  } else {
    throw new Error('Invalid or unsupported proof type')
  }
}

import { Proof, MinimumBankBalanceProof } from './types.js'
import { hexToArrayBuffer } from './hex.js'

type RawMinimumBankBalanceTypeSpecificData = {
  serverTimestamp: string,
  certificateChain: string,
  accountHolderName: string,
  minimumBalance: number
}

type GenericRawProof<T> = {
  type: string,
  typeSpecificData: T,
  iasReport: string,
  iasSignature: string,
  sigModulus: string,
  encModulus: string
}


type RawMinimumBankBalanceProof = GenericRawProof<RawMinimumBankBalanceTypeSpecificData>

function parseMinimumBankBalanceProof(rawProof: RawMinimumBankBalanceProof) {
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
  }
}

export default function parseProofJSON(json: string): Proof {
  const rawProof = JSON.parse(json)
  if (rawProof.type === 'minimumBankBalance') {
    return parseMinimumBankBalanceProof(rawProof)
  } else {
    throw new Error('Invalid or unsupported proof type')
  }
}

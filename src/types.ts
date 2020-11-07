type MinimumBankBalanceTypeSpecificData = {
  serverTimestamp: string,
  certificateChain: string,
  accountHolderName: string,
  minimumBalance: number
}

type GenericProof<T> = {
  type: string,
  typeSpecificData: T,
  iasReport: string,
  iasSignature: string,
  sigModulus: ArrayBuffer,
  encModulus: ArrayBuffer
}

export type MinimumBankBalanceProof = GenericProof<MinimumBankBalanceTypeSpecificData>

export type Proof = MinimumBankBalanceProof

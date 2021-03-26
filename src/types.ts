type MinimumBankBalanceTypeSpecificData = {
  attestationType: number,
  processId: string,
  serverTimestamp: string,
  accountHolderName: string,
  institutionName: string,
  minimumBalance: number,
  requestTimestamp: number,
  certificateChain: string
}

type GenericProof<T> = {
  type: string,
  typeSpecificData: T,
  iasReport: string,
  iasSignature: ArrayBuffer,
  iasCertChain: string,
  sigModulus: ArrayBuffer,
  encModulus: ArrayBuffer,
  signature: ArrayBuffer
}

export type MinimumBankBalanceProof = GenericProof<MinimumBankBalanceTypeSpecificData>

export type Proof = MinimumBankBalanceProof

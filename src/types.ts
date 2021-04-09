type MinimumBalanceTypeSpecificData = {
  minimumBalance: number
}

type ConsistentIncomeTypeSpecificData = {
  consistentIncome: number
}

type AccountOwnershipTypeSpecificData = {
  supportedBankInfo: number,
  accountNumber: number,
  sortCode: number,
  iban: string
}

type PlaidProof<T> = {
  attestationType: number,
  attestationData: T,
  processId: string,
  serverTimestamp: string,
  accountHolderName: string,
  institutionName: string,
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

export type MinimumBalanceProof = GenericProof<PlaidProof<MinimumBalanceTypeSpecificData>>
export type ConsistentIncomeProof = GenericProof<PlaidProof<ConsistentIncomeTypeSpecificData>>
export type AccountOwnershipProof = GenericProof<PlaidProof<AccountOwnershipTypeSpecificData>>

export type Proof =
  | MinimumBalanceProof
  | ConsistentIncomeProof
  | AccountOwnershipProof

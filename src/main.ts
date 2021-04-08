import parseProofJSON from './parse-proof-json.js'
import { Proof, MinimumBalanceProof, ConsistentIncomeProof, AccountOwnershipProof } from './types.js'
import { verifyProofSignature } from './proof-verification.js'
import { verifyPlaidCertificate } from './plaid-verification.js'
import { verifyRemoteAttestationReport } from './ra-verification.js'
import { td, tr } from './dom.js'

const proofDataTextArea: HTMLTextAreaElement = document.querySelector('textarea#proof_data')
const proofFile: HTMLInputElement = document.querySelector('input#proof_file')
const verifyProofButton: HTMLButtonElement = document.querySelector('button#verify_proof')
const readableDataTable: HTMLTableElement = document.querySelector('table#readable_data')
const verificationStatusTable: HTMLTableElement = document.querySelector('table#verification_status')

function clear(el: HTMLElement) {
  el.innerHTML = ''
}

async function verifyProof(proof: Proof) {
  clear(verificationStatusTable)
  // Verify signature
  const proofVerified = await verifyProofSignature(proof)
  verificationStatusTable.append(tr([
    td('Proof signature verified:'),
    proofVerified ? td('True') : td('False')
  ]))
  // Verify plaid certificate
  const plaidVerified = await verifyPlaidCertificate(proof)
  verificationStatusTable.append(tr([
    td('Plaid certificate verified:'),
    plaidVerified ? td('True') : td('False')
  ]))
  // Verify remote attestation report
  const raVerified = await verifyRemoteAttestationReport(proof)
  verificationStatusTable.append(tr([
    td('Secure enclave verified:'),
    raVerified ? td('True') : td('False')
  ]))
}

async function displayCommonData(proof: Proof) {
  readableDataTable.append(tr([
    td('Account holder name:'),
    td(proof.typeSpecificData.accountHolderName)
  ]))
  readableDataTable.append(tr([
    td('Institution name:'),
    td(proof.typeSpecificData.institutionName)
  ]))
  readableDataTable.append(tr([
    td('Timestamp:'),
    td(proof.typeSpecificData.serverTimestamp)
  ]))
}

async function handleMinimumBalanceProof(proof: MinimumBalanceProof) {
  clear(readableDataTable)
  readableDataTable.append(tr([
    td('Minimum balance:'),
    td(proof.typeSpecificData.attestationData.minimumBalance.toString())
  ]))
  displayCommonData(proof)
  verifyProof(proof)
}

async function handleConsistentIncomeProof(proof: ConsistentIncomeProof) {
  clear(readableDataTable)
  readableDataTable.append(tr([
    td('Consistent income:'),
    td(proof.typeSpecificData.attestationData.consistentIncome.toString())
  ]))
  displayCommonData(proof)
  verifyProof(proof)
}

async function handleAccountOwnershipProof(proof: AccountOwnershipProof) {
  clear(readableDataTable)
  readableDataTable.append(tr([
    td('Account number:'),
    td(proof.typeSpecificData.attestationData.accountNumber.toString())
  ]))
  readableDataTable.append(tr([
    td('Sort code:'),
    td(proof.typeSpecificData.attestationData.sortCode.toString())
  ]))
  readableDataTable.append(tr([
    td('IBAN:'),
    td(proof.typeSpecificData.attestationData.iban)
  ]))
  displayCommonData(proof)
  verifyProof(proof)
}

function handleProofDataUpdate() {
  let proof
  try {
    proof = parseProofJSON(proofDataTextArea.value)
  } catch (e) {
    alert(e.name + ': ' + e.message)
    return
  }
  if (proof.type === 'minimumBalance') {
    handleMinimumBalanceProof(proof)
  } else if (proof.type === 'consistentIncome') {
    handleConsistentIncomeProof(proof)
  } else if (proof.type === 'accountOwnership') {
    handleAccountOwnershipProof(proof)
  } else {
    alert('Invalid or unsupported proof type')
  }
}

async function uploadProof() {
  console.log("Uploading proof")
  const file = proofFile.files[0]
  if (file) {
    const data = await new Response(file).text()
    proofDataTextArea.value = data
  }
}

async function init() {
  uploadProof()
}

proofFile.addEventListener('change', uploadProof)
verifyProofButton.addEventListener('click', handleProofDataUpdate)

init()

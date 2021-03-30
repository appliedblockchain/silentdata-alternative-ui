import parseProofJSON from './parse-proof-json.js'
import { MinimumBankBalanceProof } from './types.js'
import { td, tr } from './dom.js'
import { verifyProofSignature } from './verification.js'

const proofDataTextarea: HTMLTextAreaElement = document.querySelector('textarea#proof_data')
const loadProofButton: HTMLButtonElement = document.querySelector('button#load_proof')
const readableDataTable: HTMLTableElement = document.querySelector('table#readable_data')

function clear(el: HTMLElement) {
  el.innerHTML = ''
}
async function handleMinimumBalanceProof(proof: MinimumBankBalanceProof) {
  clear(readableDataTable)
  readableDataTable.append(tr([
    td('Minimum balance:'),
    td(proof.typeSpecificData.minimumBalance.toString())
  ]))
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
  // Verify signature
  const verified = await verifyProofSignature(proof)
  if (verified) {
    readableDataTable.append(tr([
      td('Proof signature verified:'),
      td('True')
    ]))
  } else {
    readableDataTable.append(tr([
      td('Proof signature verified:'),
      td('False')
    ]))
  }
}

function handleProofDataUpdate() {
  let proof
  try {
    proof = parseProofJSON(proofDataTextarea.value)
  } catch (e) {
    alert(e.name + ': ' + e.message)
    return
  }
  if (proof.type === 'minimumBalance') {
    handleMinimumBalanceProof(proof)
  } else {
    alert('Invalid or unsupported proof type')
  }

}

async function init() {
  const res = await fetch('proof.json')
  proofDataTextarea.value = await res.text()
  handleProofDataUpdate()
}

loadProofButton.addEventListener('click', handleProofDataUpdate)

init()

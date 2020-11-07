import parseProofJSON from './parse-proof-json.js'
import { MinimumBankBalanceProof } from './types.js'
import { td, tr } from './dom.js'

const proofDataTextarea: HTMLTextAreaElement = document.querySelector('textarea#proof_data')
const loadProofButton: HTMLButtonElement = document.querySelector('button#load_proof')
const readableDataTable: HTMLTableElement = document.querySelector('table#readable_data')

function clear(el: HTMLElement) {
  el.innerHTML = ''
}
function handleMinimumBalanceProof(proof: MinimumBankBalanceProof) {
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
    td('Server timestamp:'),
    td(proof.typeSpecificData.serverTimestamp)
  ]))
}

function handleProofDataUpdate() {
  let proof
  try {
    proof = parseProofJSON(proofDataTextarea.value)
  } catch (e) {
    alert(e.name + ': ' + e.message)
    return
  }
  if (proof.type === 'minimumBankBalance') {
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

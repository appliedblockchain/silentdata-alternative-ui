import sleep from './sleep.js'

const proofDataTextarea: HTMLTextAreaElement = document.querySelector('textarea#proof_data')
const loadProofButton: HTMLButtonElement = document.querySelector('button#load_proof')
const readableDataTable: HTMLTableElement = document.querySelector('table#readable_data')

type Proof = {
  configuration: {
    minBalance: number
  }
}

function td(content: string): HTMLTableCellElement {
  const td = document.createElement('td')
  td.innerText = content
  return td
}

function tr(tds: HTMLTableCellElement[]): HTMLTableRowElement {
  const tr = document.createElement('tr')
  for (const td of tds) {
    tr.appendChild(td)
  }
  return tr
}

function handleProofDataUpdate() {
  let proof: Proof
  try {
    proof = JSON.parse(proofDataTextarea.value)
  } catch (e) {
    alert('Cannot parse proof data')
  }
  readableDataTable.append(tr([
    td('Minimum balance'),
    td(proof.configuration.minBalance.toString())
  ]))
}

async function init() {
  const res = await fetch('proof.json')
  proofDataTextarea.value = await res.text()
  handleProofDataUpdate()
}

loadProofButton.addEventListener('click', handleProofDataUpdate)

init()

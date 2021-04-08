import parseProofJSON from './parse-proof-json.js';
import { td, tr } from './dom.js';
import { verifyProofSignature } from './proof-verification.js';
import { verifyPlaidCertificate } from './plaid-verification.js';
import { verifyRemoteAttestationReport } from './ra-verification.js';
const proofDataTextarea = document.querySelector('textarea#proof_data');
const loadProofButton = document.querySelector('button#load_proof');
const readableDataTable = document.querySelector('table#readable_data');
function clear(el) {
    el.innerHTML = '';
}
async function handleMinimumBalanceProof(proof) {
    clear(readableDataTable);
    readableDataTable.append(tr([
        td('Minimum balance:'),
        td(proof.typeSpecificData.minimumBalance.toString())
    ]));
    readableDataTable.append(tr([
        td('Account holder name:'),
        td(proof.typeSpecificData.accountHolderName)
    ]));
    readableDataTable.append(tr([
        td('Institution name:'),
        td(proof.typeSpecificData.institutionName)
    ]));
    readableDataTable.append(tr([
        td('Timestamp:'),
        td(proof.typeSpecificData.serverTimestamp)
    ]));
    // Verify signature
    const proofVerified = await verifyProofSignature(proof);
    readableDataTable.append(tr([
        td('Proof signature verified:'),
        proofVerified ? td('True') : td('False')
    ]));
    const plaidVerified = await verifyPlaidCertificate(proof);
    readableDataTable.append(tr([
        td('Plaid certificate verified:'),
        plaidVerified ? td('True') : td('False')
    ]));
    // Verify plaid certificate
    // Verify remote attestation report
    const raVerified = await verifyRemoteAttestationReport(proof);
    readableDataTable.append(tr([
        td('Secure enclave verified:'),
        raVerified ? td('True') : td('False')
    ]));
}
function handleProofDataUpdate() {
    let proof;
    try {
        proof = parseProofJSON(proofDataTextarea.value);
    }
    catch (e) {
        alert(e.name + ': ' + e.message);
        return;
    }
    if (proof.type === 'minimumBalance') {
        handleMinimumBalanceProof(proof);
    }
    else {
        alert('Invalid or unsupported proof type');
    }
}
async function init() {
    const res = await fetch('proof.json');
    proofDataTextarea.value = await res.text();
    handleProofDataUpdate();
}
loadProofButton.addEventListener('click', handleProofDataUpdate);
init();

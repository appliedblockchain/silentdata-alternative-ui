import parseProofJSON from './parse-proof-json.js';
import { verifyMinimumBalanceProofSignature, verifyConsistentIncomeProofSignature, verifyAccountOwnershipProofSignature } from './proof-verification.js';
import { verifyPlaidCertificate } from './plaid-verification.js';
import { verifyRemoteAttestationReport } from './ra-verification.js';
import { td, tr } from './dom.js';
const proofDataTextarea = document.querySelector('textarea#proof_data');
const loadProofButton = document.querySelector('button#load_proof');
const readableDataTable = document.querySelector('table#readable_data');
function clear(el) {
    el.innerHTML = '';
}
async function verifyProof(proof) {
}
async function handleMinimumBalanceProof(proof) {
    clear(readableDataTable);
    readableDataTable.append(tr([
        td('Minimum balance:'),
        td(proof.typeSpecificData.attestationData.minimumBalance.toString())
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
    const proofVerified = await verifyMinimumBalanceProofSignature(proof);
    readableDataTable.append(tr([
        td('Proof signature verified:'),
        proofVerified ? td('True') : td('False')
    ]));
    // Verify plaid certificate
    const plaidVerified = await verifyPlaidCertificate(proof);
    readableDataTable.append(tr([
        td('Plaid certificate verified:'),
        plaidVerified ? td('True') : td('False')
    ]));
    // Verify remote attestation report
    const raVerified = await verifyRemoteAttestationReport(proof);
    readableDataTable.append(tr([
        td('Secure enclave verified:'),
        raVerified ? td('True') : td('False')
    ]));
}
async function handleConsistentIncomeProof(proof) {
    clear(readableDataTable);
    readableDataTable.append(tr([
        td('Consistent income:'),
        td(proof.typeSpecificData.attestationData.consistentIncome.toString())
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
    const proofVerified = await verifyConsistentIncomeProofSignature(proof);
    readableDataTable.append(tr([
        td('Proof signature verified:'),
        proofVerified ? td('True') : td('False')
    ]));
    // Verify plaid certificate
    const plaidVerified = await verifyPlaidCertificate(proof);
    readableDataTable.append(tr([
        td('Plaid certificate verified:'),
        plaidVerified ? td('True') : td('False')
    ]));
    // Verify remote attestation report
    const raVerified = await verifyRemoteAttestationReport(proof);
    readableDataTable.append(tr([
        td('Secure enclave verified:'),
        raVerified ? td('True') : td('False')
    ]));
}
async function handleAccountOwnershipProof(proof) {
    clear(readableDataTable);
    readableDataTable.append(tr([
        td('Account number:'),
        td(proof.typeSpecificData.attestationData.accountNumber.toString())
    ]));
    readableDataTable.append(tr([
        td('Sort code:'),
        td(proof.typeSpecificData.attestationData.sortCode.toString())
    ]));
    readableDataTable.append(tr([
        td('IBAN:'),
        td(proof.typeSpecificData.attestationData.iban)
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
    const proofVerified = await verifyAccountOwnershipProofSignature(proof);
    readableDataTable.append(tr([
        td('Proof signature verified:'),
        proofVerified ? td('True') : td('False')
    ]));
    // Verify plaid certificate
    const plaidVerified = await verifyPlaidCertificate(proof);
    readableDataTable.append(tr([
        td('Plaid certificate verified:'),
        plaidVerified ? td('True') : td('False')
    ]));
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
    else if (proof.type === 'consistentIncome') {
        handleConsistentIncomeProof(proof);
    }
    else if (proof.type === 'accountOwnership') {
        handleAccountOwnershipProof(proof);
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

import parseProofJSON from './parse-proof-json.js';
import { verifyProofSignature } from './proof-verification.js';
import { verifyPlaidCertificate } from './plaid-verification.js';
import { verifyRemoteAttestationReport } from './ra-verification.js';
import { td, tr } from './dom.js';
const proofDataTextArea = document.querySelector('textarea#proof_data');
const proofFile = document.querySelector('input#proof_file');
const verifyProofButton = document.querySelector('button#verify_proof');
const readableDataTable = document.querySelector('table#readable_data');
const verificationStatusTable = document.querySelector('table#verification_status');
function clear(el) {
    el.innerHTML = '';
}
function currencySymbol(code) {
    if (code === 'USD') {
        return '$';
    }
    else {
        return '£';
    }
}
async function verifyProof(proof) {
    clear(verificationStatusTable);
    // Verify signature
    let proofVerified = false;
    let proofVerifiedError;
    try {
        proofVerified = await verifyProofSignature(proof);
    }
    catch (e) {
        proofVerifiedError = ' (' + e.message + ')';
    }
    verificationStatusTable.append(tr([
        td('Proof signature verified:', 'td_head'),
        proofVerified ? td('True', 'td_success') : td('False' + proofVerifiedError, 'td_error')
    ]));
    // Verify plaid certificate
    let plaidVerified = false;
    let plaidVerifiedError;
    try {
        plaidVerified = await verifyPlaidCertificate(proof);
    }
    catch (e) {
        plaidVerifiedError = ' (' + e.message + ')';
    }
    verificationStatusTable.append(tr([
        td('Plaid certificate verified:', 'td_head'),
        plaidVerified ? td('True', 'td_success') : td('False' + plaidVerifiedError, 'td_error')
    ]));
    // Verify remote attestation report
    let raVerified = false;
    let raVerifiedError;
    try {
        raVerified = await verifyRemoteAttestationReport(proof);
    }
    catch (e) {
        raVerifiedError = ' (' + e.message + ')';
    }
    verificationStatusTable.append(tr([
        td('Secure enclave verified:', 'td_head'),
        raVerified ? td('True', 'td_success') : td('False' + raVerifiedError, 'td_error')
    ]));
}
async function displayCommonData(proof) {
    readableDataTable.append(tr([
        td('Account holder name:', 'td_head'),
        td(proof.typeSpecificData.accountHolderName, 'td_body')
    ]));
    readableDataTable.append(tr([
        td('Institution name:', 'td_head'),
        td(proof.typeSpecificData.institutionName, 'td_body')
    ]));
    readableDataTable.append(tr([
        td('Timestamp:', 'td_head'),
        td(proof.typeSpecificData.serverTimestamp, 'td_body')
    ]));
}
async function handleMinimumBalanceProof(proof) {
    clear(readableDataTable);
    readableDataTable.append(tr([
        td('Minimum balance:', 'td_head'),
        td(currencySymbol(proof.typeSpecificData.proofData.currencyCode)
            + proof.typeSpecificData.proofData.minimumBalance.toString(), 'td_body')
    ]));
    displayCommonData(proof);
}
async function handleConsistentIncomeProof(proof) {
    clear(readableDataTable);
    readableDataTable.append(tr([
        td('Consistent income:', 'td_head'),
        (proof.typeSpecificData.proofType === 4)
            ? td(currencySymbol(proof.typeSpecificData.proofData.currencyCode) + proof.typeSpecificData.proofData.consistentIncome.toString() + ' (Only stable sources)', 'td_body')
            : td(currencySymbol(proof.typeSpecificData.proofData.currencyCode) + proof.typeSpecificData.proofData.consistentIncome.toString(), 'td_body')
    ]));
    displayCommonData(proof);
}
async function handleAccountOwnershipProof(proof) {
    clear(readableDataTable);
    readableDataTable.append(tr([
        td('Account number:', 'td_head'),
        (proof.typeSpecificData.proofData.supportedBankInfo === 2)
            ? td(proof.typeSpecificData.proofData.accountNumber.toString() + '(Not supported by bank)', 'td_disabled')
            : td(proof.typeSpecificData.proofData.accountNumber.toString(), 'td_body')
    ]));
    readableDataTable.append(tr([
        td('Sort code:', 'td_head'),
        (proof.typeSpecificData.proofData.supportedBankInfo === 2)
            ? td(proof.typeSpecificData.proofData.sortCode.toString() + '(Not supported by bank)', 'td_disabled')
            : td(proof.typeSpecificData.proofData.sortCode.toString(), 'td_body')
    ]));
    readableDataTable.append(tr([
        td('IBAN:', 'td_head'),
        (proof.typeSpecificData.proofData.supportedBankInfo === 3)
            ? td(proof.typeSpecificData.proofData.iban + '(Not supported by bank)', 'td_disabled')
            : td(proof.typeSpecificData.proofData.iban, 'td_body')
    ]));
    displayCommonData(proof);
}
function handleProofDataUpdate() {
    let proof;
    try {
        proof = parseProofJSON(proofDataTextArea.value);
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
function handleVerifyProofDataUpdate() {
    let proof;
    try {
        proof = parseProofJSON(proofDataTextArea.value);
    }
    catch (e) {
        alert(e.name + ': ' + e.message);
        return;
    }
    verifyProof(proof);
}
async function uploadProof() {
    console.log("Uploading proof");
    const file = proofFile.files[0];
    if (file) {
        const data = await new Response(file).text();
        proofDataTextArea.value = data;
        handleProofDataUpdate();
    }
}
async function init() {
    uploadProof();
}
proofFile.addEventListener('change', uploadProof);
verifyProofButton.addEventListener('click', handleVerifyProofDataUpdate);
init();

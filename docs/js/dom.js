export function td(content) {
    const td = document.createElement('td');
    td.innerText = content;
    return td;
}
export function tr(tds) {
    const tr = document.createElement('tr');
    for (const td of tds) {
        tr.appendChild(td);
    }
    return tr;
}

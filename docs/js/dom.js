export function td(content, className) {
    const td = document.createElement('td');
    if (className) {
        td.className = className;
    }
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

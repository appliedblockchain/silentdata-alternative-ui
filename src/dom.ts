export function td(content: string): HTMLTableCellElement {
  const td = document.createElement('td')
  td.innerText = content
  return td
}

export function tr(tds: HTMLTableCellElement[]): HTMLTableRowElement {
  const tr = document.createElement('tr')
  for (const td of tds) {
    tr.appendChild(td)
  }
  return tr
}

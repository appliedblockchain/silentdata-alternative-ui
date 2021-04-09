export function td(content: string, className?: string): HTMLTableCellElement {
  const td = document.createElement('td')
  if (className) {
    td.className = className
  }
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

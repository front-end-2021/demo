export const aTyp = {
    1: 'Hauptziel',
    2: 'Etappenziel',
    3: 'Massnahme',
    4: 'Epic',
    5: 'Feature',
    6: 'User Story',
    7: 'Task',
    8: 'Szenario',
    9: 'Initiative',
    10: 'Strategisches Ziel',
    11: 'Aktion',
    12: 'Ordner',
    13: 'Signal',
    14: 'Organisation',
    15: 'OKR'
}
export function filterMap(map, fnc, result, field) {
    if (result instanceof Array) {
        for (let [k, value] of map) {
            if (fnc(value)) {
                result.push(field ? value[field] : value)
            }
        }
    } else if (result instanceof Set) {
        for (let [k, value] of map) {
            if (fnc(value)) {
                result.push(field ? value[field] : value)
            }
        }
    }
    return result
}
export function mapFind(map, fnc) {
    for (let [k, value] of map) { if (fnc(value)) { return value } }
}
export const icType = {
    1: `<svg class="icon-geo geo-1" fill="black" stroke="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /></svg>`,
    2: `<svg class="icon-geo geo-2" fill="black" viewBox="0 0 24 24"><rect x="4.5" y="4.5" width="15" height="15" transform="rotate(45 12 12)" /></svg>`,
    3: `<svg class="icon-geo geo-3" fill="black" stroke="none" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="3" /></svg>`,
    4: `<svg class="icon-geo geo-4" stroke="black" fill="none" viewBox="0 0 24 24"><rect x="4.5" y="4.5" width="15" height="15" transform="rotate(45 12 12)" /></svg>`,
    5: `<svg class="geo-5" fill="none" stroke="black" stroke-width="2" viewBox="0 0 24 24" width="18" height="18"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,
    6: `<svg class="geo-6" fill="none" stroke="black" stroke-width="2" viewBox="0 0 24 24" width="18" height="18"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
    7: `<svg class="icon-geo geo-7" stroke="black" fill="none" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="3" /></svg>`,
    8: `<svg class="geo-8" fill="none" stroke="black" stroke-width="2" viewBox="0 0 24 24" width="18" height="18"><path d="M6,5 C10,5 13,8 14,12 H22 M6,19 C10,19 13,16 14,12 M18,8 L22,12 L18,16" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    9: `<svg class="geo-9" fill="none" stroke="black" stroke-width="2" viewBox="0 0 24 24" width="18" height="18"><circle cx="5" cy="19" r="2"/><path d="M7 19 C7 12, 12 12, 14 8"/><polyline points="13 5 17 8 13 11"/><line x1="4" y1="4" x2="8" y2="8"/><line x1="8" y1="4" x2="4" y2="8"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="20" y1="16" x2="16" y2="20"/></svg>`,
    10: `<svg class="icon-geo geo-10" stroke="black" fill="none" viewBox="0 0 24 24"><rect x="4.5" y="4.5" width="15" height="15" transform="rotate(45 12 12)" /></svg>`,
    11: `<svg class="icon-geo geo-11" stroke="black" fill="none" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="3" /></svg>`,
    12: `<svg class="geo-12" fill="none" stroke="black" stroke-width="2" viewBox="0 0 24 24" width="18" height="18"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><path d="M2 9L22 9"></path></svg>`,
    13: `<svg class="geo-13" fill="none" stroke="black" stroke-width="2" viewBox="0 0 24 24" width="18" height="18"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><ellipse cx="12" cy="16" rx="2" ry="2"></ellipse><path d="M12 18v3"></path></svg>`,
    14: `<svg class="geo-14" fill="none" stroke="black" stroke-width="2" viewBox="0 0 24 24" width="18" height="18"><rect x="4" y="3" width="16" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line></svg>`,
}
export function styleSvgColor(itemIcon, c) {
    let svg = itemIcon.value.querySelector('svg')
    if (svg && svg.hasAttribute('stroke')) {
        svg.setAttribute('stroke', c)
    }
    if (svg && svg.hasAttribute('fill') && 'none' != svg.getAttribute('fill')) {
        svg.setAttribute('fill', c)
    }
}
export function dateFrom(txt, sep = '.', indexes = [0, 1, 2]) {
    const parts = txt.split(sep);
    let day = parseInt(parts[indexes[0]])
    let month = parseInt(parts[indexes[1]])
    let year = parseInt(parts[indexes[2]])
    return new Date(year, month - 1, day)
}
export function clickTag(t, item, krStore) {
  switch (t) {
    case 'okr':
      krStore.setKrForm(item.id)
      debugger
      break;
    case 'kc':

      break;
  }
}
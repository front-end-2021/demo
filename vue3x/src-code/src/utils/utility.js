import { ITEM_TYPES, TAG_TYPES } from '../constants.js'

/**
 * Maps item type IDs to their German labels
 * @type {Object<number, string>}
 */
export const aTyp = {
    [ITEM_TYPES.HAUPTZIEL]: 'Hauptziel',
    [ITEM_TYPES.ETAPPENZIEL]: 'Etappenziel',
    [ITEM_TYPES.MASSNAHME]: 'Massnahme',
    [ITEM_TYPES.EPIC]: 'Epic',
    [ITEM_TYPES.FEATURE]: 'Feature',
    [ITEM_TYPES.USER_STORY]: 'User Story',
    [ITEM_TYPES.TASK]: 'Task',
    [ITEM_TYPES.SZENARIO]: 'Szenario',
    [ITEM_TYPES.INITIATIVE]: 'Initiative',
    [ITEM_TYPES.STRATEGISCHES_ZIEL]: 'Strategisches Ziel',
    [ITEM_TYPES.AKTION]: 'Aktion',
    [ITEM_TYPES.ORDNER]: 'Ordner',
    [ITEM_TYPES.SIGNAL]: 'Signal',
    [ITEM_TYPES.ORGANISATION]: 'Organisation',
    [ITEM_TYPES.OKR]: 'OKR'
}

/**
 * Filters a Map and collects results into an Array or Set
 * @param {Map} map - The map to filter
 * @param {Function} fnc - Filter function that receives map values
 * @param {Array|Set} result - Collection to accumulate results
 * @param {string} [field] - Optional field name to extract from values
 * @returns {Array|Set} The populated result collection
 */
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
                result.add(field ? value[field] : value)
            }
        }
    }
    return result
}

/**
 * Finds the first value in a Map matching the predicate
 * @param {Map} map - The map to search
 * @param {Function} fnc - Predicate function that receives map values
 * @returns {*} The first matching value or undefined
 */
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
    try {
        if (!itemIcon) {
            console.warn('itemIcon is null or undefined')
            return
        }
        let svg = itemIcon.querySelector ? itemIcon.querySelector('svg') : itemIcon.value?.querySelector('svg')
        if (svg && svg.hasAttribute('stroke')) {
            svg.setAttribute('stroke', c)
        }
        if (svg && svg.hasAttribute('fill') && 'none' != svg.getAttribute('fill')) {
            svg.setAttribute('fill', c)
        }
    } catch (error) {
        console.error('Failed to style SVG color:', error)
    }
}
/**
 * Parses a date string into a JavaScript Date object
 * @param {string} txt - Date string in format "DD.MM.YYYY" or custom separator
 * @param {string} [sep='.'] - Date component separator
 * @param {number[]} [indexes=[0,1,2]] - Indexes for [day, month, year] components
 * @returns {Date} Parsed date object
 */
export function dateFrom(txt, sep = '.', indexes = [0, 1, 2]) {
    const parts = txt.split(sep);
    let day = parseInt(parts[indexes[0]])
    let month = parseInt(parts[indexes[1]])
    let year = parseInt(parts[indexes[2]])
    return new Date(year, month - 1, day)
}

/**
 * Handles tag click events by delegating to appropriate store actions
 * @param {string} t - Tag type ('okr' or 'kc')
 * @param {Object} item - The item object containing tag metadata
 * @param {Object} krStore - KR store reference for handling OKR tags
 */
export function clickTag(t, item, krStore) {
  switch (t) {
    case TAG_TYPES.OKR.toLowerCase():
      krStore.setKrForm(item.id)
      break;
    case TAG_TYPES.KEY_CHANGE.toLowerCase():
      // Handle key change tag
      break;
  }
}
export const icArl = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>`
export const icArr = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>`
export const icAdd = `<svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`
export const icDel = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>`

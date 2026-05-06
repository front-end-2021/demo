/**
 * Item type constants
 */
export const ITEM_TYPES = {
    HAUPTZIEL: 1,
    ETAPPENZIEL: 2,
    MASSNAHME: 3,
    EPIC: 4,
    FEATURE: 5,
    USER_STORY: 6,
    TASK: 7,
    SZENARIO: 8,
    INITIATIVE: 9,
    STRATEGISCHES_ZIEL: 10,
    AKTION: 11,
    ORDNER: 12,
    SIGNAL: 13,
    ORGANISATION: 14,
    OKR: 15,
}

/**
 * Menu keys for popup menus
 */
export const MENU_KEYS = {
    ADD_ITEM: 'menu-add',
    ITEM_COLOR: (itemId) => `item-${itemId}`,
}

/**
 * Default colors palette
 */
export const COLORS = ['#3f3f41', '#b9c1a5', '#256b3a', '#adcc44', '#80afd7', '#965c6c', '#e99371', '#fde178']

/**
 * Tag types
 */
export const TAG_TYPES = {
    OKR: 'OKR',
    KEY_CHANGE: 'KC',
}

/**
 * Unit types for KR metrics
 */
export const UNITS = {
    PERCENT: 1,
    NUMBER: 2,
    EFFECTIVE: 3,
}

/**
 * Unit labels and symbols
 */
export const UNIT_LABELS = {
    [UNITS.PERCENT]: { label: '%', symbol: '%' },
    [UNITS.NUMBER]: { label: 'Zahl', symbol: '' },
    [UNITS.EFFECTIVE]: { label: 'effektiv', symbol: '' },
}

/**
 * Kennzahl (metric) types for KR
 */
export const KENNZAHL_OPTIONS = {
    percent: { value: 'percent', label: '%' },
    absolute: { value: 'absolute', label: 'Absolut' },
    index: { value: 'index', label: 'Index' },
}

import { ITEM_TYPES, TAG_TYPES, LOCAL_STORE_KEY } from '../constants.js'
/**
 * Creates an empty item template with default values
 * @returns {Object} Empty item object with all required properties
 */
export function emptyItem() {
    return {
        id: 0, parentId: null, type: ITEM_TYPES.HAUPTZIEL, title: '', regions: [], lsresp: '',
        progress: '', progressColor: '', dateStart: '', dateEnd: '', tags: [], expanded: true,
        done: false, pinned: 0, team: [], category: [], anspruch: [], color: '',
    }
}
export function localX(x, type = 1) {
    if (1 == type) return [x.id, x.type, x.parentId, x.title, x.regions, x.lsresp, x.progress,
    x.progressColor, x.dateStart, x.dateEnd, x.tags, x.expanded, x.done, x.color,
    x.category, x.team, x.pinned, x.anspruch];
    if (2 == type) {
        let [id, type, parentId, title, regions, lsresp, progress, progressColor, dateStart,
            dateEnd, tags, expanded, done, color, category, team, pinned, anspruch] = x
        return {
            id, type, parentId, title, regions, lsresp, progress, progressColor, dateStart,
            dateEnd, tags, expanded, done, color, category, team, pinned, anspruch
        }
    }
    return x
};
/**
 * Loads items from local Storage or returns default mock data
 * Creates a Map structure for efficient item lookups by ID
 * @returns {Map<number, Object>} Map of items indexed by ID
 */
export function getItems() {
    try {
        let ls_ = localStorage.getItem(LOCAL_STORE_KEY.Items)
        if (ls_) {
            ls_ = JSON.parse(ls_)
            ls_ = ls_.map(x => localX(x, 2))
        } else {
            ls_ = [
                Object.assign(emptyItem(), {
                    id: 1, type: ITEM_TYPES.INITIATIVE,
                    title: 'Initiative: Softwarelösungen für kleine Unternehmen',
                    regions: ['Führungsteam'],
                    lsresp: 'S. Fischer',
                    progress: '+50%',
                    progressColor: 'orange',
                    dateStart: '23.12.2025', dateEnd: '23.12.2025',
                    color: 'blue',
                }),
                Object.assign(emptyItem(), {
                    id: 2, parentId: 1,
                    title: 'Hauptziel: Erfolgreiche Einführung eines neuen Softwareprodukts auf dem Markt',
                    regions: ['Produktionsleitung', 'Marketing', 'Verkauf'],
                    lsresp: 'J. Depont',
                    progress: '+85%',
                    progressColor: 'green',
                    dateStart: '23.12.2025', dateEnd: '23.12.2025',
                    tags: [TAG_TYPES.KEY_CHANGE, TAG_TYPES.OKR],
                    done: true,
                    pinned: 5,
                    color: 'green',
                }),
                Object.assign(emptyItem(), {
                    id: 3, parentId: 2, type: ITEM_TYPES.ETAPPENZIEL,
                    title: 'Etappenziel 1: Marktforschung',
                    regions: ['Verkauf'],
                    lsresp: 'I. Horvat',
                    progress: '+50%',
                    progressColor: 'orange',
                    dateStart: '23.12.2025', dateEnd: '23.12.2025',
                    color: 'orange',
                }),
                Object.assign(emptyItem(), {
                    id: 4, parentId: 3, type: ITEM_TYPES.MASSNAHME,
                    title: 'Design und Prototyping des Produkts',
                    regions: ['Logistik'],
                    lsresp: 'M. Benedetto',
                    progress: '+85%',
                    progressColor: 'green',
                    dateStart: '', dateEnd: '23.12.2025',
                    tags: [TAG_TYPES.KEY_CHANGE],
                    expanded: false,
                    color: 'purple',
                }),
                Object.assign(emptyItem(), {
                    id: 5, parentId: 3, type: ITEM_TYPES.USER_STORY,
                    title: 'Erstellung der Marketingstrategie',
                    regions: ['Qualiätssicherung'],
                    lsresp: 'K. Schneider',
                    progress: '-10%',
                    progressColor: 'red',
                    dateStart: '23.12.2025', dateEnd: '23.12.2025',
                    tags: [TAG_TYPES.OKR],
                    expanded: false,
                    done: true,
                    color: 'red',
                }),
                Object.assign(emptyItem(), {
                    id: 6, parentId: 2, type: ITEM_TYPES.EPIC,
                    title: 'Etappenziel 2: Produktentwicklung und Usability-Tests',
                    regions: ['Social Media', 'Verkauf', 'Marketing'],
                    lsresp: 'S. Fischer',
                    progress: '-10%',
                    progressColor: 'red',
                    dateStart: '', dateEnd: '23.12.2025',
                    color: 'cyan',
                }),
                Object.assign(emptyItem(), {
                    id: 7, parentId: 6, type: ITEM_TYPES.FEATURE,
                    title: 'Erarbeitung des ersten Softwareprototyps...',
                    regions: ['Marketing', 'Verkauf'],
                    lsresp: 'J. Depont',
                    progress: '+50%',
                    progressColor: 'orange',
                    dateStart: '6.6.2025', dateEnd: '23.12.2025',
                    expanded: false,
                    color: 'blue',
                }),
                Object.assign(emptyItem(), {
                    id: 8, parentId: 6, type: ITEM_TYPES.TASK,
                    title: 'Durchführung von Usability-Tests',
                    regions: ['Support'],
                    lsresp: 'I. Horvat',
                    progress: '+85%',
                    progressColor: 'green',
                    dateStart: '3.1.2025', dateEnd: '23.12.2025',
                    expanded: false,
                    done: true,
                    color: 'green',
                }),
                Object.assign(emptyItem(), {
                    id: 9, parentId: 2, type: ITEM_TYPES.ETAPPENZIEL,
                    title: 'Etappenziel 3: Marketing- und Vertriebskampagne vorbereiten',
                    regions: ['Service', 'Logistik'],
                    lsresp: 'M. Benedetto',
                    progress: '+85%',
                    progressColor: 'green',
                    dateStart: '23.12.2025', dateEnd: '12.12.2025',
                    expanded: false,
                    done: true,
                    color: 'green',
                }),
                Object.assign(emptyItem(), {
                    id: 10, parentId: 2, type: ITEM_TYPES.ETAPPENZIEL,
                    title: 'Etappenziel 4: Launch und Post-Launch-Support',
                    regions: ['Verkauf', 'Marketing'],
                    lsresp: 'K. Schneider',
                    progress: '+50%',
                    progressColor: 'orange',
                    dateStart: '12.3.2025', dateEnd: '23.12.2025',
                    expanded: false,
                    color: 'orange',
                }),
                Object.assign(emptyItem(), {
                    id: 11, parentId: 1, type: ITEM_TYPES.SZENARIO,
                    title: 'Hauptziel: Optimierung der internen Kommunikation und Steigerung der Zusammenarbeit implement long name check lorem ipslump',
                    regions: ['Führungsteam'],
                    lsresp: 'S. Fischer',
                    progress: '+85%',
                    progressColor: 'green',
                    dateStart: '23.2.2025', dateEnd: '23.12.2025',
                    expanded: false,
                    done: true,
                    color: 'cyan',
                }),
                Object.assign(emptyItem(), {
                    id: 12, parentId: 1,
                    title: 'Hauptziel: Expansion in internationale Märkte und Aufbau einer globalen Markenpräsenz',
                    regions: ['Produktionsleitung'],
                    lsresp: 'J. Depont',
                    progress: '-10%',
                    progressColor: 'red',
                    dateStart: '23.12.2025', dateEnd: '23.12.2025',
                    expanded: false,
                    color: 'purple',
                }),
                Object.assign(emptyItem(), {
                    id: 13, type: ITEM_TYPES.EPIC,
                    title: 'Steigerung der Kundenzufriedenheit und Bindung durch außergewöhnlichen Service',
                    regions: ['Führungsteam'],
                    lsresp: 'I. Horvat',
                    progress: '+50%',
                    progressColor: 'orange',
                    dateStart: '23.12.2025', dateEnd: '23.12.2025',
                    expanded: false,
                    color: 'orange',
                }),
                Object.assign(emptyItem(), {
                    id: 14, type: ITEM_TYPES.ORGANISATION,
                    title: 'Markenbekanntheit erhöhen und die Marktführerschaft im internationalen Umfeld ausbauen',
                    regions: ['Führungsteam'],
                    lsresp: 'M. Benedetto',
                    expanded: false,
                    color: 'purple',
                }),
                Object.assign(emptyItem(), {
                    id: 15, type: ITEM_TYPES.ORDNER,
                    title: 'Thema 01',
                    regions: ['Produktionsleitung'],
                    expanded: false,
                    color: 'violet',
                }),
                Object.assign(emptyItem(), {
                    id: 16, type: ITEM_TYPES.SIGNAL,
                    title: 'Signal 001',
                    regions: ['Verkauf'],
                    expanded: false,
                    color: 'violet',
                }),
            ]
        }
        return new Map(ls_.map(x => [x.id, x]))
    }
    catch (error) {
        console.error('Failed to load items:', error) // Return empty map with single default item on error
        const defaultItem = emptyItem()
        defaultItem.id = 1
        defaultItem.title = 'Error Loading Items'
        return new Map([[defaultItem.id, defaultItem]])
    }
}

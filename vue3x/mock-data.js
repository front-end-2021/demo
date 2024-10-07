import { getRandomInt } from './common.js'
const nameList = [
    'Time', 'Past', 'Future', 'Dev', 'Fly', 'Flying', 'Soar', 'Soaring', 'Power', 'Falling', 'Fall', 'Jump', 'Cliff',
    'Mountain', 'Rend', 'Red', 'Blue', 'Green', 'Yellow', 'Gold', 'Demon', 'Demonic', 'Panda', 'Cat', 'Kitty',
    'Kitten', 'Zero', 'Memory', 'Trooper', 'XX', 'Bandit', 'Fear', 'Light', 'Glow', 'Tread', 'Deep', 'Deeper',
    'Deepest', 'Mine', 'Your', 'Worst', 'Enemy', 'Hostile', 'Force', 'Video', 'Game', 'Donkey', 'Mule', 'Colt',
    'Cult', 'Cultist', 'Magnum', 'Gun', 'Assault', 'Recon', 'Trap', 'Trapper', 'Redeem', 'Code', 'Script', 'Writer',
    'Near', 'Close', 'Open', 'Cube', 'Circle', 'Geo', 'Genome', 'Germ', 'Spaz', 'Shot', 'Echo', 'Beta', 'Alpha',
    'Gamma', 'Omega', 'Seal', 'Squid', 'Money', 'Cash', 'Lord', 'King', 'Duke', 'Rest', 'Fire', 'Flame', 'Morrow',
    'Break', 'Breaker', 'Numb', 'Ice', 'Cold', 'Rotten', 'Sick', 'Sickly', 'Janitor', 'Camel', 'Rooster', 'Sand',
    'Desert', 'Dessert', 'Hurdle', 'Racer', 'Eraser', 'Erase', 'Big', 'Small', 'Short', 'Tall', 'Sith', 'Bounty',
    'Hunter', 'Cracked', 'Broken', 'Sad', 'Happy', 'Joy', 'Joyful', 'Crimson', 'Destiny', 'Deceit', 'Lies', 'Lie',
    'Honest', 'Destined', 'Bloxxer', 'Hawk', 'Eagle', 'Hawker', 'Walker', 'Zombie', 'Sarge', 'Capt', 'Captain',
    'Punch', 'One', 'Two', 'Uno', 'Slice', 'Slash', 'Melt', 'Melted', 'Melting', 'Fell', 'Wolf', 'Hound', 'Legacy',
    'Sharp', 'Dead', 'Mew', 'Chuckle', 'Bubba', 'Bubble', 'Sandwich', 'Smasher', 'Extreme', 'Multi', 'Universe',
    'Ultimate', 'Death', 'Ready', 'Monkey', 'Elevator', 'Wrench', 'Grease', 'Head', 'Theme', 'Grand', 'Cool', 'Kid',
    'Boy', 'Girl', 'Vortex', 'Paradox', 'John', 'Leo', 'Larry', 'Page', 'Bill', 'Gate', 'Elon', 'Musk', 'ZukerBerg'
];
const projectList = [
    `Community Connector`, `Tranquil Trails`, `Local Link`, `Unity Hub`, `Social Circle`, `Harmonious Haven`,
    `Civic Connect`, `Neighborly Nexus`, `Harmony Zone`, `Unified Society`, `Insightful Ideas`, `Opinion Tracker`
]
const ListPrj = [{ Id: 1, Name: 'Demo' }, { Id: 2, Name: 'Local Storage' }, { Id: 3, Name: 'Clear Local' }]
const PLen = 6
for (let pp = 5; pp < PLen + 5; pp++) {
    let name = genRandName(projectList)
    while (ListPrj.find(x => name == x.Name)) {
        name = genRandName(projectList)
    }
    ListPrj.push({ Id: pp, Name: name })
}

const Mains = []
for (let mm = 1; mm < 19; mm++) {
    const main = newItem()
    main.ProjectId = getRandomInt(1, PLen)
    main.Subs = []
    const Slen = getRandomInt(1, 6)
    for (let ss = 1; ss <= Slen; ss++) {
        const sub = newItem()
        sub.Actions = []
        const Alen = getRandomInt(1, 9)
        for (let aa = 1; aa <= Alen; aa++) {
            const action = newItem()
            action.Costs = []
            const Clen = getRandomInt(1, 5)
            for (let cc = 1; cc <= Clen; cc++) {
                const activity = newItem()
                action.Costs.push(activity)
            }
            action.Todos = []
            const Tlen = getRandomInt(1, 5)
            for (let tt = 1; tt <= Tlen; tt++) {
                const todo = newItem()
                action.Todos.push(todo)
            }
            sub.Actions.push(action)
        }
        main.Subs.push(sub)
    }
    Mains.push(main)
}

const Langs = [
    { Key: 'en', Name: 'English' },
    { Key: 'de', Name: 'German' },
    { Key: 'pm', Name: 'PM' }
]
const DemoLands = [
    { Id: 1, Name: 'Mien bac', IsNew: false, ASort: 2, Description: '' },
    { Id: 3, Name: 'Hanoi', IsNew: false, ASort: 1, Description: '' },
    { Id: 4, Name: 'Mien trung', IsNew: false, ASort: 3, Description: '' },
    { Id: 5, Name: 'Mien nam', IsNew: false, ASort: 5, Description: '' },
    { Id: 6, Name: 'TP.HoChiMinh', IsNew: false, ASort: 4, Description: '' },
]
const DemoRegions = [
    { Id: 1, Name: 'TP.Hanoi', LandId: 3, Currency: 'VND', ASort: 1, Description: '' },
    { Id: 3, Name: 'Haiphong', LandId: 1, Currency: 'USD', ASort: 3, Description: '' },
    { Id: 4, Name: 'TP.Can Tho', LandId: 6, Currency: 'CHF', ASort: 5, Description: '' },
    { Id: 5, Name: 'Hue', LandId: 4, ASort: 4, Currency: 'VND', Description: '' },
    { Id: 7, Name: 'Quang Ninh', LandId: 1, Currency: 'VND', ASort: 2, Description: '' },
]
const DemoMarkets = [
    { Id: 2, Name: 'Dong Xuan', LandId: 3, ASort: 3, Description: '' },
    { Id: 3, Name: 'Sapa market', LandId: 1, ASort: 1, Description: '' },
    { Id: 4, Name: 'Quang Ninh market', LandId: 1, ASort: 2, Description: '' },
    { Id: 5, Name: 'Hue market', LandId: 4, ASort: 4, Description: '' },
    { Id: 6, Name: 'Cai Rang market', LandId: 6, ASort: 5, Description: '' },
]
const DemoSubmarkets = [
    { Id: 7, Name: 'Square 1', MarketId: 2, Description: '' },
    { Id: 3, Name: 'Cho Tinh', MarketId: 3, Description: '' },
    { Id: 4, Name: 'Hue submarket 1', MarketId: 5, Description: '' },
    { Id: 5, Name: 'Quangninh submarket 2', MarketId: 4, Description: '' },
    { Id: 6, Name: 'Cairang submarket 3', MarketId: 6, Description: '' },
]
const DemoPrdGroups = [
    { Id: 3, Name: `Truyen trinh tham`, RegionId: 1, ASort: 2, Description: '' },
    { Id: 2, Name: `Truyen thieu nhi`, RegionId: 7, ASort: 3, Description: '' },
    { Id: 4, Name: `Sach khoa hoc`, RegionId: 5, ASort: 1, Description: '' },
    { Id: 1, Name: `The thao`, RegionId: 7, ASort: 5, Description: '' },
    { Id: 5, Name: `Sach giao khoa`, RegionId: 1, ASort: 4, Description: '' },
]
function getMessCompare(item, mItem) {
    let mess = ''
    let ii = 1
    mItem = JSON.parse(JSON.stringify(mItem))
    item = JSON.parse(JSON.stringify(item))
    for (const [key, value] of Object.entries(mItem)) {
        if (value !== item[key]) {
            mess += `${ii++}. ${key}: ${item[key]} => ${value} \n`
        }
    }
    if (!mess) return
    return `Something changes: \n${mess}`
}
function overrideItem(mItem) {
    const item = this
    mItem = JSON.parse(JSON.stringify(mItem))
    for (const [key, value] of Object.entries(mItem)) {
        item[key] = value
    }
}
export {
    Mains, ListPrj, Langs,
    DemoLands, DemoRegions, DemoPrdGroups,
    DemoMarkets, DemoSubmarkets,
    getMessCompare,
    overrideItem
}

function newItem() {
    let start = Math.random() < 0.21 ? null : genRandomDateStr()
    let end = !start ? null : (Math.random() < 0.314 ? null : genRandomDateStr(start))
    return {
        Name: `${genRandName(nameList)} ${genRandName(nameList)}`,
        Des: genRandomDes(),
        Start: start,
        End: end,
    }
}
function genRandName(names) { return names[Math.floor(Math.random() * names.length)] }
function genRandomDes() {
    let txt = genRandName(nameList)
    const N = getRandomInt(3, 9)
    for (let ii = 0; ii < N; ii++) txt += ` ${genRandName(nameList)}`
    return `${txt}.`
}
function genRandomDateStr(start) {
    if (typeof start == 'string') start = new Date(start)
    let sYear = !start ? 2000 : start.getFullYear()
    let year = getRandomInt(sYear, 2030)
    let sMonth = !start ? 1 : start.getMonth() + 1
    let month = sYear < year ? getRandomInt(1, 13) : getRandomInt(sMonth, 13)
    let date = !start ? 1 : start.getDate()
    if (28 < date) date = 28
    let day = getRandomInt(date, 29)
    return `${year}-${month}-${day}T00:00:00.000Z`   //YYYY-MM-DDTHH:mm:ss.sssZ
}

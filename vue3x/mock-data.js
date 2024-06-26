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
const ListPrj = []
const PLen = 6
for (let pp = 1; pp < PLen + 1; pp++) {
    let name = genRandName(projectList)
    while(ListPrj.find(x => name == x.Name)) {
        name = genRandName(projectList)
    }
    ListPrj.push({
        Id: pp,
        Name: name,
    })
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
export {
    Mains, ListPrj, Langs
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
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
    { Id: 1, Name: 'Ha luu song Hong', IsNew: false, ASort: 5 },
    { Id: 3, Name: 'Hanoi', IsNew: false, ASort: 1 },
    { Id: 4, Name: 'Mien trung', IsNew: false, ASort: 6 },
    { Id: 5, Name: 'Mien nam', IsNew: false, ASort: 7 },
    { Id: 6, Name: 'TP.HoChiMinh', IsNew: false, ASort: 8 },
    { Id: 9, Name: 'Dong Bac Bo', IsNew: false, ASort: 2 },
    { Id: 8, Name: 'Tay Bac', IsNew: false, ASort: 3 },
    { Id: 7, Name: 'Trung du mien nui phia Bac', IsNew: false, ASort: 4 },
    { Id: 10, Name: 'Dong bang song Hong', IsNew: false, ASort: 9 },
]
const DemoRegions = [
    { Id: 1, Name: 'TP.Hanoi', LandId: 3, Currency: 'VND', ASort: 1 },
    { Id: 3, Name: 'TP.Haiphong', LandId: 10, Currency: 'USD', ASort: 3 },
    { Id: 5, Name: 'Hue', LandId: 4, Currency: 'VND', ASort: 4 },
    { Id: 10, Name: 'Quang Ninh', LandId: 9, Currency: 'VND', ASort: 2 },
    { Id: 9, Name: 'Hai Duong', LandId: 10, Currency: 'VND', ASort: 7 },
    { Id: 8, Name: 'Bac Ninh', LandId: 3, Currency: 'VND', ASort: 6 },
    { Id: 7, Name: 'Hung Yen', LandId: 10, Currency: 'VND', ASort: 8 },
    { Id: 11, Name: 'Thai Binh', LandId: 10, Currency: 'VND', ASort: 9 },
    { Id: 12, Name: 'Q. Bình Tân', LandId: 6, Currency: 'VND', ASort: 10 },
    { Id: 4, Name: 'Q. Tân Phú', LandId: 6, Currency: 'CHF', ASort: 11 },
]
const DemoMarkets = [
    { Id: 2, Name: 'Thanh Xuan', LandId: 3, ASort: 9, },
    { Id: 7, Name: 'Hoang Mai', LandId: 3, ASort: 6, },
    { Id: 8, Name: 'Long Bien', LandId: 3, ASort: 7, },
    { Id: 10, Name: 'Ha Dong', LandId: 3, ASort: 8, },
    { Id: 9, Name: 'Hoan Kiem', LandId: 3, ASort: 10, },
    { Id: 3, Name: 'Sapa market', LandId: 8, ASort: 1, },
    { Id: 14, Name: 'Cốc Ly market', LandId: 8, ASort: 2, },
    { Id: 15, Name: 'Sín Chéng market', LandId: 8, ASort: 3, },
    { Id: 16, Name: 'Cao Sơn market', LandId: 8, ASort: 4, },
    { Id: 4, Name: 'Quang Ninh market', LandId: 1, ASort: 5, },
    { Id: 5, Name: 'Hue market', LandId: 4, ASort: 15, },
    { Id: 6, Name: 'Ben Thanh market', LandId: 6, ASort: 13, },
    { Id: 1, Name: 'Bình Tây market', LandId: 6, ASort: 14, },
    { Id: 12, Name: 'Bình Điền market', LandId: 6, ASort: 11, },
    { Id: 13, Name: 'Bà Chiểu market', LandId: 6, ASort: 12, },
]
const DemoSubmarkets = [
    { Id: 1, Name: 'Square 1', MarketId: 2, },
    { Id: 3, Name: 'Cho Tinh', MarketId: 3, },
    { Id: 4, Name: 'Cho Hue', MarketId: 5, },
    { Id: 2, Name: 'Hue submarket 1', MarketId: 5, },
    { Id: 5, Name: 'Cho Bai Chay', MarketId: 4, },
    { Id: 7, Name: 'Cho Uong Bi', MarketId: 4, },
    { Id: 8, Name: 'Cho Cam Pha', MarketId: 4, },
    { Id: 6, Name: 'Saigon Centre', MarketId: 6, },
    { Id: 18, Name: 'Vincom Center Đồng Khởi', MarketId: 6, },
    { Id: 19, Name: 'Crescent Mall', MarketId: 6, },
    { Id: 20, Name: 'Diamond Plaza', MarketId: 6, },
    { Id: 21, Name: 'Union Square', MarketId: 6, },
    { Id: 22, Name: 'Trung tâm mua sắm SC Vivo', MarketId: 6, },
    { Id: 9, Name: 'Vincom Mega Mall Times City', MarketId: 7, },
    { Id: 12, Name: 'Vincom Mega Mall Royal City', MarketId: 2, },
    { Id: 10, Name: 'Aeon Mall Long Biên', MarketId: 8, },
    { Id: 14, Name: 'Savico Mega Mall', MarketId: 8, },
    { Id: 15, Name: 'Vincom Plaza Long Biên', MarketId: 8, },
    { Id: 11, Name: 'Aeon Mall Hà Đông', MarketId: 10, },
    { Id: 16, Name: 'Melinh Plaza Hà Đông', MarketId: 10, },
    { Id: 17, Name: 'TTTM Mac Plaza', MarketId: 10, },
    { Id: 13, Name: 'Tràng Tiền Plaza', MarketId: 9, },
]
const DemoPrdGroups = [
    { Id: 3, Name: `Truyen trinh tham`, RegionId: 1, ASort: 2, },
    { Id: 2, Name: `Truyen thieu nhi`, RegionId: 7, ASort: 3, },
    { Id: 4, Name: `Sach khoa hoc`, RegionId: 5, ASort: 1, },
    { Id: 1, Name: `The thao`, RegionId: 7, ASort: 5, },
    { Id: 5, Name: `Sach giao khoa`, RegionId: 1, ASort: 4, },
]
const DemoProducts = [
    { Id: 5, Name: `Conan - Chap 1`, PrdGroupId: 3, ASort: 3, },
    { Id: 3, Name: `Conan - Chap 2`, PrdGroupId: 3, ASort: 2, },
    { Id: 4, Name: `Conan - Chap 3`, PrdGroupId: 3, ASort: 1, },
    { Id: 6, Name: `Tieng Viet Lop 2`, PrdGroupId: 5, ASort: 4, },
    { Id: 9, Name: `Toan Lop 1`, PrdGroupId: 5, ASort: 5, },
    { Id: 7, Name: `De men phieu luu ky - Chap 1`, PrdGroupId: 2, ASort: 6, },
]
function getMessCompare(item, mItem) {
    let mess = ''
    mItem = JSON.parse(JSON.stringify(mItem))
    item = JSON.parse(JSON.stringify(item))
    for (const [key, value] of Object.entries(mItem)) {
        if (typeof item[key] == 'undefined') continue;
        if (value !== item[key]) {
            mess += `${key}: ${item[key]} => ${value} \n`
        }
    }
    if (!mess) return
    return `Something changes: \n${mess}`
}
function overrideItem(mItem) {
    const item = this
    mItem = JSON.parse(JSON.stringify(mItem))
    for (const [key, value] of Object.entries(mItem)) {
        if (typeof item[key] == 'undefined') continue;
        item[key] = value
    }
}
function getCopyItem(item) {
    const vueApp = this;
    const cpyItem = JSON.parse(JSON.stringify(item))
    cpyItem.Description = vueApp.$store.getters.Des(item)
    return cpyItem
}
function deleteDes() { delete this.Description }
export {
    Mains, ListPrj, Langs,
    DemoLands, DemoRegions,
    DemoPrdGroups, DemoProducts,
    DemoMarkets, DemoSubmarkets,
    getMessCompare,
    overrideItem, getCopyItem, deleteDes
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

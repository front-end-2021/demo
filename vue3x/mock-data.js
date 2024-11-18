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
    { Id: 10, Name: 'TP.Quang Ninh', LandId: 9, Currency: 'VND', ASort: 2 },
    { Id: 6, Name: 'TP.Uong Bi', LandId: 9, Currency: 'VND', ASort: 4 },
    { Id: 9, Name: 'TP.Hai Duong', LandId: 10, Currency: 'VND', ASort: 17 },
    { Id: 13, Name: 'H.Thanh Ha', LandId: 10, Currency: 'VND', ASort: 18 },
    { Id: 14, Name: 'H.Nam Sach', LandId: 10, Currency: 'VND', ASort: 19 },
    { Id: 15, Name: 'H.Kinh Mon', LandId: 10, Currency: 'VND', ASort: 20 },
    { Id: 2, Name: 'TP.Bac Ninh', LandId: 3, Currency: 'VND', ASort: 6 },
    { Id: 7, Name: 'Hung Yen', LandId: 10, Currency: 'VND', ASort: 8 },
    { Id: 11, Name: 'Thai Binh', LandId: 10, Currency: 'VND', ASort: 9 },
    { Id: 12, Name: 'Q. Bình Tân', LandId: 6, Currency: 'VND', ASort: 10 },
    { Id: 4, Name: 'Q. Tân Phú', LandId: 6, Currency: 'CHF', ASort: 11 },
    { Id: 5, Name: 'Hue', LandId: 4, Currency: 'VND', ASort: 5 },
]
const DemoMarkets = [
    { Id: 2, Name: 'Thanh Xuan', LandId: 3, ASort: 9, },
    { Id: 7, Name: 'Hoang Mai', LandId: 3, ASort: 6, },
    { Id: 8, Name: 'Long Bien', LandId: 3, ASort: 7, },
    { Id: 10, Name: 'Ha Dong', LandId: 3, ASort: 8, },
    { Id: 9, Name: 'Hoan Kiem', LandId: 3, ASort: 10, },
    { Id: 3, Name: 'Chợ Phiên Bắc Hà', LandId: 8, ASort: 1, },
    { Id: 14, Name: 'Cốc Ly market', LandId: 8, ASort: 2, },
    { Id: 15, Name: 'Sín Chéng market', LandId: 8, ASort: 3, },
    { Id: 16, Name: 'Cao Sơn market', LandId: 8, ASort: 4, },
    { Id: 4, Name: 'Quang Ninh market', LandId: 1, ASort: 5, },
    { Id: 5, Name: 'Chợ Đông Ba', LandId: 4, ASort: 15, },
    { Id: 6, Name: 'Ben Thanh market', LandId: 6, ASort: 13, },
    { Id: 1, Name: 'Bình Tây market', LandId: 6, ASort: 14, },
    { Id: 12, Name: 'Bình Điền market', LandId: 6, ASort: 11, },
    { Id: 13, Name: 'Bà Chiểu market', LandId: 6, ASort: 12, },
]
const DemoSubmarkets = getSubmarkets()
function getSubmarkets() {
    const lst = [
        { Id: 1, Name: 'Thuong Dinh Market', MarketId: 2, ASort: 1, IsXY: false, },
        { Id: 2, Name: 'Vincom Mega Mall Royal City', MarketId: 2, ASort: 2, IsXY: true, },
        { Id: 3, Name: 'Chợ Cốc Ly', MarketId: 3, ASort: 1, IsXY: false, },
        { Id: 4, Name: 'Chợ Bến Ngự Huế', MarketId: 5, ASort: 1, IsXY: true, },
        { Id: 6, Name: 'Chợ phiên Nam Đông', MarketId: 5, ASort: 2, IsXY: false, },
        { Id: 5, Name: 'Cho Bai Chay', MarketId: 4, ASort: 1, IsXY: false, },
        { Id: 7, Name: 'Cho Uong Bi', MarketId: 4, ASort: 2, IsXY: true, },
        { Id: 8, Name: 'Cho Cam Pha', MarketId: 4, ASort: 3, IsXY: false, },
        { Id: 15, Name: 'Saigon Centre', MarketId: 6, ASort: 1, IsXY: false, },
        { Id: 14, Name: 'Vincom Center Đồng Khởi', MarketId: 6, ASort: 2, IsXY: false, },
        { Id: 13, Name: 'Crescent Mall', MarketId: 6, ASort: 3, IsXY: true, },
        { Id: 12, Name: 'Diamond Plaza', MarketId: 6, ASort: 4, IsXY: true, },
        { Id: 11, Name: 'Union Square', MarketId: 6, ASort: 5, IsXY: false, },
        { Id: 10, Name: 'Trung tâm mua sắm SC Vivo', MarketId: 6, ASort: 6, IsXY: false, },
        { Id: 9, Name: 'Vincom Mega Mall Times City', MarketId: 7, ASort: 1, IsXY: false, },
        { Id: 16, Name: 'Aeon Mall Long Biên', MarketId: 8, ASort: 1, IsXY: false, },
        { Id: 17, Name: 'Savico Mega Mall', MarketId: 8, ASort: 2, IsXY: false, },
        { Id: 20, Name: 'Vincom Plaza Long Biên', MarketId: 8, ASort: 3, IsXY: true, },
        { Id: 19, Name: 'Aeon Mall Hà Đông', MarketId: 10, ASort: 1, IsXY: true, },
        { Id: 18, Name: 'Melinh Plaza Hà Đông', MarketId: 10, ASort: 2, IsXY: false, },
        { Id: 21, Name: 'TTTM Mac Plaza', MarketId: 10, ASort: 3, IsXY: false, },
        { Id: 22, Name: 'Tràng Tiền Plaza', MarketId: 9, ASort: 1, IsXY: false, },
    ]
    lst.forEach(item => {
        Object.defineProperty(item, 'Id', {
            writable: false, // Không thể thay đổi giá trị
            configurable: false // Không thể xóa hoặc thay đổi thuộc tính
        })
        Object.defineProperty(item, 'MarketId', {
            configurable: false
        })
    })
    return lst
}
const DemoPrdGroups = [
    { Id: 3, Name: `Truyen trinh tham`, RegionId: 1, ASort: 2, },
    { Id: 2, Name: `Truyen thieu nhi`, RegionId: 7, ASort: 3, },
    { Id: 4, Name: `Sach khoa hoc`, RegionId: 5, ASort: 1, },
    { Id: 1, Name: `The thao`, RegionId: 7, ASort: 5, },
    { Id: 5, Name: `Sach giao khoa`, RegionId: 1, ASort: 4, },
]
const DemoProducts = getProducts()
function getProducts() {
    const lst = [
        { Id: 3, Name: `Conan - Section 1`, PrdGroupId: 3, ASort: 3, },
        { Id: 2, Name: `Conan - Section 2`, PrdGroupId: 3, ASort: 2, },
        { Id: 1, Name: `Conan - Section 3`, PrdGroupId: 3, ASort: 1, },
        { Id: 5, Name: `Tieng Viet Lop 2`, PrdGroupId: 5, ASort: 4, },
        { Id: 4, Name: `Toan Lop 1`, PrdGroupId: 5, ASort: 5, },
        { Id: 6, Name: `De men phieu luu ky - Chap 1`, PrdGroupId: 2, ASort: 6, },
    ]
    lst.forEach(item => {
        Object.defineProperty(item, 'Id', {
            writable: false, // Không thể thay đổi giá trị
            configurable: false // Không thể xóa hoặc thay đổi thuộc tính
        })
    })
    return lst
}

const DemoGoals = getGoals()
function getGoals() {
    const lst = [
        {
            Id: 3, Name: 'Bán 1200 cuốn Conan Section 1 trong quý 3', SubmPrdId: '6-3',
            Start: 'Tue Oct 01 2024', End: new Date('Tue Dec 31 2024').toDateString(),
            ASort: 4,
        },
        {
            Id: 2, Name: 'Bán 900 cuốn Toan Lop 1 trong tháng 8', SubmPrdId: '12-9',
            Start: `Thu Aug 01 2024`, End: `Sat Aug 31 2024`,
            ASort: 5,
        },
        {
            Id: 4, Name: 'Bán 600 cuốn Tieng Viet Lop 2 trong tháng 8', SubmPrdId: '12-6',
            Start: `Thu Aug 01 2024`, End: `Sat Aug 31 2024`,
            ASort: 3,
        },
        {
            Id: 1, Name: 'Bán 300 cuốn Tieng Viet Lop 2 trong tháng 8', SubmPrdId: '3-6',
            Start: `Thu Aug 01 2024`, End: `Sat Aug 31 2024`,
            ASort: 2,
        },
        {
            Id: 5, Name: 'Bán 100 cuốn Conan - Section 2 trong tháng 8', SubmPrdId: '3-6',
            Start: `Thu Aug 01 2024`, End: `Sat Aug 31 2024`,
            ASort: 1,
        },
    ]
    lst.forEach(item => {
        Object.defineProperty(item, 'Id', {
            writable: false, // Không thể thay đổi giá trị
            configurable: false // Không thể xóa hoặc thay đổi thuộc tính
        })
        Object.defineProperty(item, 'SubmPrdId', {
            configurable: false
        })
    })
    //  return lst;
    const arr = lst.map(x => x.ASort)
    let maxIndex = arr.reduce((a, b) => Math.max(a, b), -Infinity);
    let goalId = 6
    let name = 'Test perfomance main'
    for (let smId, prId; goalId < 15; goalId++) {
        smId = getRandomInt(1, 23)
        prId = getRandomInt(1, 7)
        lst.push({
            Id: goalId, Name: `${genRandName(nameList)}(${name})`,
            SubmPrdId: `${smId}-${prId}`, ASort: ++maxIndex,
            Start: `Thu Aug 01 2024`, End: `Sat Aug 31 2024`,
        })
    }
    return lst
}
const DemoSubs = getSubs()
function getSubs() {
    const lst = [
        {
            Id: 2, Name: 'Bán 600 cuốn Conan Section 1 trong tháng 10', GoalId: 3, ASort: 1,
            Start: 'Tue Oct 01 2024', End: new Date('Thu Oct 31 2024').toDateString(),
        },
        {
            Id: 1, Name: 'Bán 500 cuốn Conan Section 1 trong tháng 11', GoalId: 3,
            Start: 'Fri Nov 01 2024', End: 'Sat Nov 30 2024', ASort: 2,
        },
        {
            Id: 3, Name: 'Bán 600 cuốn Toan Lop 1 trong tuan 1', GoalId: 2,
            Start: 'Thu Aug 01 2024', End: 'Sun Aug 11 2024', ASort: 3,
        },
        {
            Id: 4, Name: 'Bán 300 cuốn Toan Lop 1 trong tuan 2, 3, 4', GoalId: 2,
            Start: 'Mon Aug 12 2024', End: 'Sat Aug 31 2024', ASort: 4,
        },
    ]
     return lst;
    let arr = DemoGoals.map(x => x.Id)
    const maxId = arr.reduce((a, b) => Math.max(a, b), -Infinity);
    arr = lst.map(x => x.ASort)
    let maxIndex = arr.reduce((a, b) => Math.max(a, b), -Infinity);
    let name = 'Test perfomance sub'
    let subId = maxId + 1
    for (let prId; subId < maxId + 50; subId++) {
        prId = getRandomInt(1, maxId + 1)
        lst.push({
            Id: subId, Name: `${genRandName(nameList)}(${name})`, GoalId: prId,
            Start: `Thu Aug 01 2024`, End: `Sat Aug 31 2024`, ASort: ++maxIndex,
        })
    }
    return lst;
}
const DemoTasks = getTaks()
function getTaks() {
    const lst = [
        {
            Id: 2, Name: 'Bán 30 cuốn Conan Section 1 trong tuan 1', SubId: 2, ASort: 1,
            Start: 'Tue Oct 01 2024', End: new Date('Thu Oct 31 2024').toDateString(),
        },
        {
            Id: 1, Name: 'Bán 40 cuốn Conan Section 1 trong tuan 2', SubId: 2,
            Start: 'Fri Nov 01 2024', End: 'Sat Nov 30 2024', ASort: 2,
        },
        {
            Id: 3, Name: 'Bán 30 cuốn Conan Section 1 trong tuan 3', SubId: 2,
            Start: 'Thu Aug 01 2024', End: 'Sun Aug 11 2024', ASort: 3,
        },
        {
            Id: 4, Name: 'Bán 50 cuốn Conan Section 1 trong tuan 4', SubId: 2,
            Start: 'Mon Aug 12 2024', End: 'Sat Aug 31 2024', ASort: 4,
        },
    ]
    // return lst;
    let arr = DemoSubs.map(x => x.Id)
    const maxId = arr.reduce((a, b) => Math.max(a, b), -Infinity);
    arr = lst.map(x => x.ASort)
    let maxIndex = arr.reduce((a, b) => Math.max(a, b), -Infinity);
    let name = 'Test perfomance task'
    let taskId = maxId + 1
    for (let prId; taskId < maxId + 50; taskId++) {
        prId = getRandomInt(1, maxId + 1)
        lst.push({
            Id: taskId, Name: `${genRandName(nameList)}(${name})`, SubId: prId,
            Start: `Thu Aug 01 2024`, End: `Sat Aug 31 2024`, ASort: ++maxIndex,
        })
    }
    return lst;
}
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
    DemoGoals, DemoSubs, DemoTasks,
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

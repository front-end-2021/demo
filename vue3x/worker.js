
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
function genRandName(names) { return names[Math.floor(Math.random() * names.length)] }
const getRandomInt = (min, max) => {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    // The maximum is exclusive and the minimum is inclusive
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}

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
    ];
    const arr = lst.map(x => x.ASort)
    let maxIndex = arr.reduce((a, b) => Math.max(a, b), -Infinity);
    let goalId = 6
    let name = 'Test perfomance main'
    for (let smId, prId; goalId < 60; goalId++) {
        smId = getRandomInt(1, 23)
        prId = getRandomInt(1, 7)
        lst.push({
            Id: goalId, Name: `${genRandName(nameList)}(${name})`,
            SubmPrdId: `${smId}-${prId}`, ASort: ++maxIndex,
            Start: `Thu Aug 01 2024`, End: `Sat Aug 31 2024`,
        })
    }
    lst.forEach(item => {
        Object.defineProperty(item, 'Id', {
            writable: false, // Không thể thay đổi giá trị
            configurable: false // Không thể xóa hoặc thay đổi thuộc tính
        })
        Object.defineProperty(item, 'SubmPrdId', {
            configurable: false
        })
    })
    return lst
}

function getSubs(goals) {
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
    let arr = goals.map(x => x.Id)
    const maxId = arr.reduce((a, b) => Math.max(a, b), -Infinity);
    arr = lst.map(x => x.ASort)
    let maxIndex = arr.reduce((a, b) => Math.max(a, b), -Infinity);
    let name = 'Test perfomance sub'
    let subId = maxId + 1
    for (let prId; subId < maxId + 210; subId++) {
        prId = getRandomInt(1, maxId + 1)
        lst.push({
            Id: subId, Name: `${genRandName(nameList)} (${name})`, GoalId: prId,
            Start: `Thu Aug 01 2024`, End: `Sat Aug 31 2024`, ASort: ++maxIndex,
        })
    }
    return lst;
}

function getTaks(subs) {
    const lst = [
        {
            Id: 2, Name: 'Bán 30 cuốn Conan Section 1 trong tuan 1', SubId: 2, ASort: 1,
            Start: 'Tue Oct 01 2024', End: new Date('Thu Oct 31 2024').toDateString(),
            Todos: [],
        },
        {
            Id: 1, Name: 'Bán 40 cuốn Conan Section 1 trong tuan 2', SubId: 2,
            Start: 'Fri Nov 01 2024', End: 'Sat Nov 30 2024', ASort: 2,
            Todos: [],
        },
        {
            Id: 3, Name: 'Bán 30 cuốn Conan Section 1 trong tuan 3', SubId: 2,
            Start: 'Thu Aug 01 2024', End: 'Sun Aug 11 2024', ASort: 3,
            Todos: [],
        },
        {
            Id: 4, Name: 'Bán 50 cuốn Conan Section 1 trong tuan 4', SubId: 2,
            Start: 'Mon Aug 12 2024', End: 'Sat Aug 31 2024', ASort: 4,
            Todos: [],
        },
    ]
    let arr = subs.map(x => x.Id)
    const maxId = arr.reduce((a, b) => Math.max(a, b), -Infinity);
    arr = lst.map(x => x.ASort)
    let maxIndex = arr.reduce((a, b) => Math.max(a, b), -Infinity);
    let name = 'Test perfomance task'
    let taskId = maxId + 1
    for (let prId; taskId < maxId + 1500; taskId++) {
        prId = getRandomInt(1, maxId + 1)
        lst.push({
            Id: taskId, Name: `${genRandName(nameList)} (${name})`, SubId: prId,
            Start: `Thu Aug 01 2024`, End: `Sat Aug 31 2024`, ASort: ++maxIndex,
            Todos: [],
        })
    }
    return lst;
}
// self.onmessage = function (event) { // console.log('event ', event)
//     const eData = event.data
//     switch (eData.type) {
//         case 'get goals, subs, tasks':
//             const Goals = getGoals()
//             const Subs = getSubs(Goals)
//             const Tasks = getTaks(Subs)
//             self.postMessage({ Goals, Subs, Tasks })
//             return;
//         case 'get sorted in range':
//             self.postMessage(getItems(eData.Items, eData.ItemType, eData.ParentIds, eData.i0, eData.ie))
//             return;
//         case 'count main sub task':
//             self.postMessage(getCountMainSubTask(eData))
//             return;
//         default: self.postMessage(0)
//             return;
//     }

// }
self.addEventListener('connect', (e) => {
    const port = e.ports[0];
    port.addEventListener("message", (event) => {
        const eData = event.data
        switch (eData.type) {
            case 'get goals, subs, tasks':
                const Goals = getGoals()
                const Subs = getSubs(Goals)
                const Tasks = getTaks(Subs)
                port.postMessage({ Goals, Subs, Tasks })
                return;
            case 'get sorted in range':
                port.postMessage(getItems(eData.Items, eData.ItemType, eData.ParentIds, eData.i0, eData.ie))
                return;
            case 'count main sub task':
                port.postMessage(getCountMainSubTask(eData))
                return;
            default: port.postMessage(0)
                return;
        }
    });
    port.start(); // Required when using addEventListener. Otherwise called implicitly by onmessage setter.
})
// self.onconnect = (e) => {
//     const port = e.ports[0];
//     port.addEventListener("message", (event) => {
//         const eData = event.data
//         switch (eData.type) {
//             case 'get goals, subs, tasks':
//                 const Goals = getGoals()
//                 const Subs = getSubs(Goals)
//                 const Tasks = getTaks(Subs)
//                 port.postMessage({ Goals, Subs, Tasks })
//                 return;
//             case 'get sorted in range':
//                 port.postMessage(getItems(eData.Items, eData.ItemType, eData.ParentIds, eData.i0, eData.ie))
//                 return;
//             case 'count main sub task':
//                 port.postMessage(getCountMainSubTask(eData))
//                 return;
//             default: port.postMessage(0)
//                 return;
//         }
//     });
//     port.start(); // Required when using addEventListener. Otherwise called implicitly by onmessage setter.
// };
function getItems(items, type, parentIds, i0, ie) {
    let lst = []
    switch (type) {
        case 9:     // Goals 
            for (let ii = items.length - 1, item; -1 < ii; ii--) {
                item = items[ii]
                if (!parentIds.includes(item.SubmPrdId)) items.splice(ii, 1)
            }
            for (let ii = 0, item; ii < items.length; ii++) {
                item = items[ii]
                if (parentIds.includes(item.SubmPrdId)) lst.push(item)
            }
            break;
        case 10:      // Subs 
            for (let ii = items.length - 1, item; -1 < ii; ii--) {
                item = items[ii]
                if (!parentIds.includes(item.GoalId)) items.splice(ii, 1)
            }
            for (let ii = 0, item; ii < items.length; ii++) {
                item = items[ii]
                if (parentIds.includes(item.GoalId)) lst.push(item)
            }
            break;
        case 11:      // Tasks 
            for (let ii = items.length - 1, item; -1 < ii; ii--) {
                item = items[ii]
                if (!parentIds.includes(item.SubId)) items.splice(ii, 1)
            }
            for (let ii = 0, item; ii < items.length; ii++) {
                item = items[ii]
                if (parentIds.includes(item.SubId)) lst.push(item)
            }
            break;
        default: return lst;
    }
    if (1 < lst.length) lst.sort((a, b) => a.ASort - b.ASort)
    const len = lst.length
    lst.splice(0, i0)
    lst.splice(ie + 1, len - ie)
    return {
        type, listId: lst.map(x => x.Id)
    }
}
function getCountMainSubTask(eData) {
    const smpdid = eData.smpdid
    const goals = eData.goals.filter(x => smpdid == x.SubmPrdId);
    const setGoal = new Set(goals.map(x => x.Id))
    const subs = eData.subs.filter(s => setGoal.has(s.GoalId))
    const setSub = new Set(subs.map(x => x.Id))
    const tasks = eData.tasks.filter(t => setSub.has(t.SubId))
    setGoal.clear()
    setSub.clear()
    return {
        GoalIds: goals.map(x => x.Id),
        SubIds: subs.map(x => x.Id),
        TaskIds: tasks.map(x => x.Id),
    }
}
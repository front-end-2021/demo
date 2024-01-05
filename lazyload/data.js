function getDataMains() {
    const dataMains = []
    //    for (let i = 0; i < 30000; i++) {
    for (let i = 0; i < 1500; i++) {
        const row = {
            Id: i,      // snow flake
            Name: `Action ${i}`,
            IsDone: Math.random() < 0.5,
            Responsibilities: [],
            Regions: [],
            Index: i + 1,
            Note: null,
            Start: getRandomYYYYmmDD(),
            End: null,

        }
        dataMains.push(row)
    }
    return dataMains
}

function getRandomYYYYmmDD() {
    const yyyy = getRandomInt(2017, 2023)
    let mm = getRandomInt(1, 12)
    if (mm < 10) mm = `0${mm}`
    let dd = getRandomInt(1, 28)
    if (dd < 10) dd = `0${dd}`
    return `${yyyy}-${mm}-${dd}`
}
function getRandomInt(min, max) {
    // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

var glbApp = {
    mains: getDataMains(),
    viewIndex: 0,
    // #region functions
    getMains(pos) {
        const countItem = getCountItem()
        const minI = countItem * pos + pos
        if (minI > this.mains.length) return []
        const maxI = minI + countItem
        return this.mains.filter(x => minI <= x.Id && x.Id <= maxI)
    },
    setMainDone(id, isDone) {
        const main = this.mains.find(x => x.Id == id)
        if (!main) return
        main.IsDone = !!isDone
    },
    setMainStartDate(id, dateStr) {
        const main = this.mains.find(x => x.Id == id)
        if (!main) return
        main.Start = dateStr
    },
    setMainNote(id, txt) {
        const main = this.mains.find(x => x.Id == id)
        if (!main) return
        main.Note = txt
    },
    // #endregion
    set currentIndex(pos) {
        const oldPos = this.viewIndex
        if (oldPos == pos) return

        const tblView = document.querySelectorAll(`[t-pos]`)
        let isGenNewView = pos > 0 && tblView.length - 1 == pos

        if (isGenNewView) {
            const newI = tblView.length
            renderGrpTable(newI)
        }
        hideTbodyContent(pos)

        this.viewIndex = pos
    },
}
function hideTbodyContent(pos) {
    const grpTables = document.querySelectorAll(`[t-pos]`)
    if (1 < pos) {
        // hide items above current pos
        const currentV = grpTables[pos]
        let maxPos = pos - 1
        const prevV = grpTables[maxPos]

        if (currentV.offsetHeight < prevV.offsetHeight) {
            maxPos = pos - 2
        }

        let minPos = Math.ceil(window.outerHeight / currentV.offsetHeight)
        
        for (let i = minPos; i < maxPos; i++) {
            const grpTable = grpTables[i]
            const tHide = grpTable.getAttribute('t-hide')
            if (tHide != 'true') grpTable.setAttribute('t-hide', true)
        }
    }
    if (pos + 2 < grpTables.length) {
        // hide items under current pos
        for (let i = pos + 2; i < grpTables.length; i++) {
            const grpTable = grpTables[i]
            const tHide = grpTable.getAttribute('t-hide')
            if (tHide != 'true') grpTable.setAttribute('t-hide', true)
        }
    }
}
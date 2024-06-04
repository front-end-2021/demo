Array.prototype.distinct = function () {
    const rs = [];
    let rIndex;
    for (let i = this.length - 1; -1 < i; i--) {
        const item = this[i]
        if (typeof item === 'object') {
            rIndex = rs.findIndex(x => Object.is(x, item))
            if (rIndex < 0) rs.push(item)
            else this.splice(i, 1)
            continue
        }
        // value type
        rIndex = rs.indexOf(item)
        if (rIndex < 0) rs.push(item)
        else this.splice(i, 1)
    }
    return this
}
Array.prototype.GroupBy = function (keyGetter) {
    const map = new Map()
    this.forEach(item => {
        const key = keyGetter(item)
        if (map.has(key)) {
            map.get(key).push(item)
        } else {
            map.set(key, [item])
        }
    })
    return map  // {key: SubmarketProductId, value: items}
}
Map.prototype.FilterGoals = function (submarketIds, productIds) {
    if (submarketIds.includes(0) && productIds.includes(0)) return this    
    const map = new Map()
    if(submarketIds.includes(0)) {
        this.forEach((lstGoal, tSmpIds) => {
            const lstSmkPrdId = tSmpIds.split('-')
            const pId = parseInt(lstSmkPrdId[1])
            if (productIds.includes(pId) && !map.has(tSmpIds)) {
                map.set(tSmpIds, lstGoal)
            }
        })
        return map
    }
    if(productIds.includes(0)) {
        this.forEach((lstGoal, tSmpIds) => {
            const lstSmkPrdId = tSmpIds.split('-')
            const sId = parseInt(lstSmkPrdId[0])
            if (submarketIds.includes(sId) && !map.has(tSmpIds)) {
                map.set(tSmpIds, lstGoal)
            }
        })
        return map
    }
    this.forEach((lstGoal, tSmpIds) => {
        const lstSmkPrdId = tSmpIds.split('-')
        const sId = parseInt(lstSmkPrdId[0])
        const pId = parseInt(lstSmkPrdId[1])
        let hasSpId = submarketIds.includes(sId) && productIds.includes(pId)
        if (hasSpId && !map.has(tSmpIds)) { map.set(tSmpIds, lstGoal) }
    })
    return map
}
function getBrowser() {
    let userAgent = navigator.userAgent;
    let browser = "Unknown";
    // Detect Chrome
    if (/Chrome/.test(userAgent) && !/Chromium/.test(userAgent)) {
        return "Google Chrome";
    }
    // Detect Chromium-based Edge
    else if (/Edg/.test(userAgent)) {
        return "Microsoft Edge";
    }
    // Detect Firefox
    else if (/Firefox/.test(userAgent)) {
        return "Mozilla Firefox";
    }
    // Detect Safari
    else if (/Safari/.test(userAgent)) {
        return "Apple Safari";
    }
    // Detect Internet Explorer
    else if (/Trident/.test(userAgent)) {
        return "Internet Explorer";
    }
    return browser;
}
// Use the function
//console.log("You are using " + getBrowser());
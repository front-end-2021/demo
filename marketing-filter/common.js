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
Array.prototype.getGoalsBy = function (submarketIds, productIds) {
    if (submarketIds.includes(0) && productIds.includes(0)) return this
    const lstI = new Array(this.length)
    for (let i = 0; i < this.length; i++) lstI.fill(i, i);
    const lstG = []
    let ii = -1, goal
    if (submarketIds.includes(0)) {
        let smkPrdId, pId
        for (let i = 0; i < lstI.length; i++) {
            ii = lstI[i]
            goal = this[ii]
            smkPrdId = goal.SubmarketProductId.split('-')
            pId = parseInt(smkPrdId[1])
            if (productIds.includes(pId)) {
                lstG.push(this[ii])
                lstI.splice(i, 1)
                i--
            }
        }
        return lstG
    }
    if (productIds.includes(0)) {
        let smkPrdId, sId
        for (let i = 0; i < lstI.length; i++) {
            ii = lstI[i]
            goal = this[ii]
            smkPrdId = goal.SubmarketProductId.split('-')
            sId = parseInt(smkPrdId[0])
            if (submarketIds.includes(sId)) {
                lstG.push(this[ii])
                lstI.splice(i, 1)
                i--
            }
        }
        return lstG
    }
    const sPids = []
    submarketIds.forEach(sid => {
        productIds.forEach(pid => { sPids.push(`${sid}-${pid}`) })
    })
    for (let i = 0; i < lstI.length; i++) {
        ii = lstI[i]
        goal = this[ii]
        if (sPids.includes(goal.SubmarketProductId)) {
            lstG.push(this[ii])
            lstI.splice(i, 1)
            i--
        }
    }
    return lstG
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
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
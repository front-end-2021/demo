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

const MaxId = 123
const GaStatus = {
    Default: 0,
    Finished: 1,
    Visible: 2,
    FinishVisible: 12,
    Mix: 3,
    FinishMix: 13,
    VisibleMix: 23
}

const regionPrefix = ["Ash", "Birch", "Cress", "Elm", "Fern", "Fair", "Ficus", "Gale", "Harmony", "Heritage", "Hickory", "Magnolia", "Maple", "Oak", "Old", "Pebble", "Placid", "Pleasant", "Red", "Rocky", "Rolling", "Rose", "Sleepy", "Stony", "Sunny", "Sycamore", "Tranquil", "Walnut", "Willow", "Whispering", "Winding"];
const regionSuffix = ["Acres", "Bluff", "Brook", "Canyon", "Commons", "Chase", "Creek", "Crossing", "Estates", "Gardens", "Glen", "Greens", "Grove", "Heights", "Hill", "Knolls", "Meadow", "Mill", "Park", "Place", "Plains", "Point", "Ridge", "Rock", "Run", "Terrace", "View", "Way", "Woods"];
function getRegionName() {
    var randomPrefix = Math.floor(Math.random() * (regionPrefix.length));
    var randomSuffix = Math.floor(Math.random() * (regionSuffix.length));
    return `${regionPrefix[randomPrefix]} ${regionSuffix[randomSuffix]}`
}
function getRandomCategory() {
    const i = getRandomInt(0, 13)
    switch (i) {
        case 1: return 'Health and Fitness';
        case 2: return `Personal Development`;
        case 3: return `Social and Relationship`;
        case 4: return `Food`;
        case 5: return `Cool`;
        case 6: return `Travel`;
        case 7: return `Social and Relationship`;
        case 8: return `Creative`;
        case 9: return `Adventure`;
        case 10: return `Crazy`;
        case 11: return `Learning and Education`;
        case 12: return `Financial`;
        default: return 'Random Tasks';
    }
}

function getRandomTask() {
    const i = getRandomInt(0, 16)
    switch (i) {
        case 1: return 'Go Deep Sea Diving';
        case 2: return 'Donate Things to the Animal Shelter';
        case 3: return 'Kiss Someone at a Concert';
        case 4: return 'Eat Snails in Paris';
        case 5: return 'Bake a Layered Cake';
        case 6: return 'Have a Headbanging Competition';
        case 7: return 'Ride a Double Decker Bus in England';
        case 8: return 'Meet my Favorite YouTuber';
        case 9: return `Create a Children's Book`;
        case 10: return `Participate in Nanowrimo`;
        case 11: return 'Circumnavigate the Globe By Sail';
        case 12: return `Say "No" and Don't Feel Bad About It`;
        case 13: return `Take a Photo of Me Carrying a Photo of Me Carrying a Photo of Me`;
        case 14: return `Learn to Use Both Sets of Vocal Cords Individually`;
        case 15: return `Make Loans to Entrepreneurs Through Kiva.Com`;
        default: return 'Random Tasks'
    }
}

function getRandomLName(i) {
    i = typeof i == 'number' ? i : getRandomInt(0, 21)
    switch (i) {
        case 1: return 'Stone';
        case 2: return 'Priya';
        case 3: return 'Wong';
        case 4: return 'Stanbridge';
        case 5: return 'Lee-Walsh';
        case 6: return 'Li';
        case 7: return 'Ithya';
        case 8: return 'French';
        case 9: return 'Simoes';
        case 10: return 'Virtueone';
        case 11: return 'Campbell-Gillies';
        case 12: return 'Anders';
        case 13: return 'Kazantzis';
        case 14: return 'Blair';
        case 15: return 'Meldrum';
        case 16: return 'M. Smith';
        case 17: return 'Burch';
        case 18: return 'Harry';
        case 19: return 'Andrews';
        case 20: return 'Ellawala';
        default: return 'LastName'
    }
}

function getEmail(name, lastName) {
    name = typeof name == 'string' ? name : 'first'
    lastName = typeof lastName == 'string' ? lastName : 'last'
    let nm = name.toLowerCase()
    nm = nm.replace(/\s/g, "")
    let ln = lastName.toLowerCase()
    ln = ln.replace(/\s/g, "")
    return `${nm}.${ln}@email.com`
}
function getRandomFName(i) {
    i = typeof i == 'number' ? i : getRandomInt(0, 21)
    switch (i) {
        case 1: return 'John';
        case 2: return 'Ponnappa';
        case 3: return 'Mia';
        case 4: return 'Peter';
        case 5: return 'Natalie';
        case 6: return 'Ang';
        case 7: return 'Nguta';
        case 8: return 'Tamzyn';
        case 9: return 'Salome';
        case 10: return 'STrevor';
        case 11: return 'Tarryn';
        case 12: return 'Eugenia';
        case 13: return 'Andrew';
        case 14: return 'Verona';
        case 15: return 'Jane';
        case 16: return 'Maureen';
        case 17: return 'Desiree';
        case 18: return 'Daly';
        case 19: return 'Hayman';
        case 20: return 'Ruveni';
        default: return 'FirstName'
    }
}
function getRandomInt(min, max) {
    // The maximum is exclusive and the minimum is inclusive
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
function getRandomDate(days, start) {
    if (typeof start == 'object' && start == null) return null       // get end

    days = typeof days != 'number' ? 0 : days
    if (start == undefined) {
        // get start
        const i = Math.random()
        const cDate = new Date()
        if (i < 0.5) return new Date(cDate.getTime() + days * 24000 * 3600)
        return null
    }
    if (start instanceof Date) {
        const sTime = start.getTime()
        const eTime = sTime + days * 24000 * 3600
        return new Date(eTime)      // get end
    }
}
function getRandStart(bStart) {
    if (bStart instanceof Date) {
        const dayPlus = getRandomInt(0, 15)
        const dTime = dayPlus * 3600 * 24000    // milisec
        return new Date(bStart.getTime() + dTime)
    }
    if (Math.random() < 0.6) return null
    const year = getRandomInt(2021, 2024)
    const month = getRandomInt(1, 13)
    const day = getRandomInt(1, 28)
    return new Date(year, month - 1, day)
}
function getRandomEnd(start, days) {
    if (!(start instanceof Date)) return null
    if (Math.random() < 0.5) return null
    days = typeof days != 'number' ? 29 : days
    const timeE = start.getTime()           // mili sec
    const delDay = getRandomInt(days, 90)        // day
    return new Date(timeE + delDay * 3600 * 24000)
}

function sortDate(d1, d2) {
    if (!d1.Start) return 1
    if (!d2.Start) return -1
    return d1.Start.getTime() - d2.Start.getTime()
}
function newGuid() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

Date.prototype.stringFormat = function (formatStr) {
    let opt
    switch (formatStr) {
        case 'dd/MM':
            const dd = this.getDate()
            const mm = this.getMonth()
            return `${dd}/${mm + 1}`;
        case 'wek, dd MM YYYY':
            opt = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
            const dtFormat = new Intl.DateTimeFormat('en-GB', opt)
            return dtFormat.format(this) // output: "Fri, 1 Sep 2023"
        case 'nd/nM/YYYY':      //date formatting for language with a fallback language Indonesian
            opt = ['ban', 'id']
            return new Intl.DateTimeFormat(opt).format(this)    // output: "2/1/2024"
        case 'nM/nd/YYYY':
            opt = 'en-US'
            return new Intl.DateTimeFormat(opt).format(this)    // output: "1/2/2024"
        case 'dd/MM/YYYY':
            return new Intl.DateTimeFormat("en-GB").format(this)    // output: "02/01/2023"
        case 'YYYY-MM-dd': return this.toISOString().split('T')[0]
    }
}
function dateTimeFormatRange(formatStr, dt1, dt2) {
    const isD1 = dt1 instanceof Date
    const isD2 = dt2 instanceof Date
    if (!isD1 && !isD2) return

    let opt
    switch (formatStr) {
        case 'wek, dd MM YYYY':
            opt = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
            const dtFormat = new Intl.DateTimeFormat('en-GB', opt)
            if (isD1 && !isD2) return dtFormat.format(dt1)
            if (!isD1 && isD2) return dtFormat.format(dt2)
            return dtFormat.formatRange(dt1, dt2) // "Fri, 1 Sep 2023 – Tue, 2 Jan 2024"

    }
}
function getDataMains() {
    const dataMains = []
//    for (let i = 0; i < 30000; i++) {
    for (let i = 0; i < 300; i++) {
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
    if(mm < 10) mm = `0${mm}`
    let dd = getRandomInt(1, 28)
    if(dd < 10) dd = `0${dd}`
    return `${yyyy}-${mm}-${dd}`
}
function getRandomInt(min, max) {
    // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function getDay(date, format) {
    format = format || 'ddd';
    switch(date.getDay()){
        case 0: return format.length == 3 ? 'Sun' : 'Sunday';
        case 1: return format.length == 3 ? 'Mon' : 'Monday';
        case 2: return format.length == 3 ? 'Tue' : 'Tueday';
        case 3: return format.length == 3 ? 'Wed' : 'Wednesday';
        case 4: return format.length == 3 ? 'Thu' : 'Thusday';
        case 5: return format.length == 3 ? 'Fri' : 'Friday';
        case 6: return format.length == 3 ? 'Sat' : 'Satuday';
    }
}

export function getDate (dateStr) {
    if(typeof dateStr == 'string')
        if(!dateStr.includes('GMT')) {
            dateStr += ' GMT';
            return new Date(dateStr)
        }
    return new Date()
}
export function toString(date, format) {
    format = format || 'ddd MM/dd/YYYY';
    if(!format.includes(':')) {
        format += ' hh:mm:ss'
    }
    format = format.toLowerCase();

    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = date.getFullYear();
    var HH = date.getHours();
    (HH < 10) && (HH = `0${HH}`)
    var MM = date.getMinutes();
    (MM < 10) && (MM = `0${MM}`)
    var ss = date.getSeconds();
    (ss < 10) && (ss = `0${ss}`)

    var dStr = format.replace('mm', mm);
    if(format.includes('ddd')) {
        const ddd = getDay(date)
        dStr = dStr.replace('ddd', ddd)
    }
    dStr = dStr.replace('dd', dd);
    dStr = dStr.replace('yyyy', yyyy);
    dStr = dStr.replace('hh', HH);
    dStr = dStr.replace('mm', MM);
    dStr = dStr.replace('ss', ss);
    return dStr;
}

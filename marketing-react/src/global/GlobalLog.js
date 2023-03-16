export function logItem(item, title) {
    if(title) {
        return console.log(title, JSON.parse(JSON.stringify(item)))    
    }
    return console.log(JSON.parse(JSON.stringify(item)))
}
export function getListCls() {
    let lstCls = []
    let name = 'Account'
    let id = getId(name)
    lstCls.push({
        id: id, type: 'instant class', Name: name, 
        top: 30, left: 90, width: 220, height: 100,
        Fields: [
            { AcModify: '#', Name: 'name', Type: 'String' },
            { AcModify: '#', Name: 'emailAddress', Type: 'String' },
        ], Properties: [
            ['+', 'GetName()', 'String', 'get', `return this.Name`],
            ['+', 'SetName(String)', 'void', 'set', `this.Name = string`],
            ['+', 'GetEmailAddress()', 'String', 'get'],
            ['+', 'SetEmailAddress(String)', 'void', 'set'],
        ]
    })
    let tIds = [id]
    name = 'Contact'
    id = getId(name)
    lstCls.push({
        id: id, type: 'instant class', Name: name, toIds: tIds,
        top: 70, left: 580, width: 210, height: 100,
        Fields: [
            { AcModify: '#', Name: 'name', Type: 'String' },
            { AcModify: '#', Name: 'emailAddress', Type: 'String' },
            { AcModify: '', Name: 'faxNumber', Type: 'String' },
        ], Properties: [
            ['+', 'GetName()', 'String', 'get'],
            ['+', 'SetName(String)', 'void', 'set'],
            ['+', 'GetEmailAddress()', 'String', 'get'],
            ['+', 'SetEmailAddress(String)', 'void', 'set'],
            ['+', 'GetFaxNumber()', 'Int', 'get'],
            ['+', 'SetFaxNumber(Int)', 'void', 'set'],
        ]
    })
    name = 'Animal'
    id = getId(name)
    tIds = [id]
    lstCls.push({
        id: id, type: 'abstract class', Name: name, 
        top: 70, left: 1024, width: 150, height: 100,
        Fields: [
            { AcModify: '+', Name: 'age', Type: 'Int' },
            { AcModify: '+', Name: 'gender', Type: 'String' },
        ], Properties: [
            ['+', 'IsMammal()', 'Bool', 'get'],
            ['+', 'Mate()', 'Int', 'get'],
        ]
    })
    name = 'Zebra'
    id = getId(name)
    lstCls.push( {
        id: id, type: 'instant class', Name: name, toIds: tIds,
        top: 270, left: 1280, width: 150, height: 100,
        Fields: [
            { AcModify: '+', Name: 'isWild', Type: 'String' },
        ], Properties: [
            ['+', 'Run()', 'void', 'set'],
        ]
    })
    tIds = [...tIds]
    name = 'iFly'
    id = getId(name)
    tIds.push(id)
    lstCls.push({
        id: id, type: 'interface', Name: name, 
        top: 500, left: 1200, width: 150, height: 100,
        Fields: [], Properties: [
            ['+', 'Fly()', 'void', 'set'],
        ]
    })
    name = 'iQuack'
    id = getId(name)
    tIds.push(id)
    lstCls.push({
        id: id, type: 'interface', Name: name, 
        top: 500, left: 1400, width: 150, height: 100,
        Fields: [], Properties: [
            ['+', 'Quack()', 'void', 'set'],
        ]
    })
    name = 'Duck'
    id = getId(name)
    lstCls.push({
        id: id, type: 'instant class', Name: name, toIds: tIds,
        top: 270, left: 880, width: 150, height: 100,
        Fields: [
            { AcModify: '+', Name: 'beakColor', Type: 'String' },
        ], Properties: [
            ['+', 'Swim()', 'void', 'set'],
        ]
    })
    return lstCls
}
function getId(name) {
    let lwName = name.toLowerCase()
    lwName = lwName.replaceAll(' ', '_')
    return `cls-${lwName}`
}
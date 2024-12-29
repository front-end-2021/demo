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
            ['+', 'SetName(String n)', 'void', 'set', `this.Name = n`],
            ['+', 'GetEmailAddress()', 'String', 'get', `return emailAddress`],
            ['+', 'SetEmailAddress(String e)', 'void', 'set', `emailAddress = e`],
        ]
    })
    let tIds = [id]
    name = 'Contact'
    id = getId(name)
    lstCls.push({
        id: id, type: 'instant class', Name: name, toIds: tIds,
        top: 30, left: 380, width: 210, height: 100,
        Fields: [
            { AcModify: '-', Name: 'faxNumber', Type: 'String' },
        ], Properties: [
            ['+', 'GetFaxNumber()', 'Int', 'get'],
            ['+', 'SetFaxNumber(Int f)', 'void', 'set', `faxNumber = f`],
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
    name = 'Size'
    id = getId(name)
    lstCls.push({
        id: id, type: 'enum', Name: name, 
        top: 370, left: 90, width: 220, height: 250,
        Fields: [
            { Name: 'VENTI' },
            { Name: 'GRANDE' },
            { Name: 'TALL' },
        ], Properties: []
    })
    name = 'Beverage'
    id = getId(name)
    lstCls.push({
        id: id, type: 'abstract class', Name: name, 
        top: 290, left: 480, width: 220, height: 120,
        Fields: [
            { AcModify: '#', Name: 'description', Type: 'String' },
            { AcModify: '#', Name: 'size', Type: 'Size' },
        ], Properties: [
            ['+ virtual', 'getDescription()', 'Bool', 'get', `return new List<String>() { description }`],
            ['+ abstract', 'cost()', 'double', 'get', ],
            ['+', 'getSize()', 'Size', 'get', 'return size'],
            ['+', 'SetSize(Size s)', 'void', 'set', 'size = s'],
        ]
    })
    tIds = [id]
    name = 'Decaf'
    id = getId(name)
    lstCls.push({
        id: id, type: 'instant class', Name: name, toIds: tIds,
        top: 480, left: 90, width: 220, height: 120,
        Fields: [], Properties: [
            ['+', 'Decaf()', '', 'init', `description = "Decaf"`],
            ['+ override', 'cost()', 'double', 'get', 'return 1.05'],
        ]
    })
    name = 'Espresso'
    id = getId(name)
    lstCls.push({
        id: id, type: 'instant class', Name: name, toIds: tIds,
        top: 480, left: 290, width: 220, height: 120,
        Fields: [], Properties: [
            ['+', 'Espresso()', '', 'init', `description = "Espresso"`],
            ['+ override', 'cost()', 'double', 'get', 'return 1.99'],
        ]
    })
    name = 'DarkRoast'
    id = getId(name)
    lstCls.push({
        id: id, type: 'instant class', Name: name, toIds: tIds,
        top: 480, left: 510, width: 220, height: 120,
        Fields: [], Properties: [
            ['+', 'DarkRoast()', '', 'init', `description = "DarkRoast"`],
            ['+ override', 'cost()', 'double', 'get', 'return 0.99'],
        ]
    })
    name = 'HouseBlend'
    id = getId(name)
    lstCls.push({
        id: id, type: 'instant class', Name: name, toIds: tIds,
        top: 480, left: 750, width: 220, height: 120,
        Fields: [], Properties: [
            ['+', 'HouseBlend()', '', 'init', `description = "House Blend Coffee"`],
            ['+ override', 'cost()', 'double', 'get', 'return 0.89'],
        ]
    })
    name = 'CondimentDecorator'
    id = getId(name)
    lstCls.push({
        id: id, type: 'abstract class', Name: name, toIds: tIds,
        top: 660, left: 90, width: 220, height: 120,
        Fields: [
            { AcModify: '+', Name: 'beverage', Type: 'Beverage' },
        ],
        Properties: [
            ['#', 'CountDes(String des)', 'List<String>', 'set'],
        ]
    })
    tIds = [id]
    name = 'Soy'
    id = getId(name)
    lstCls.push({
        id: id, type: 'instant class', Name: name, toIds: tIds,
        top: 660, left: 450, width: 220, height: 120,
        Fields: [
            { AcModify: '+', Name: 'beverage', Type: 'Beverage' },
        ],
        Properties: [
            ['+', 'Soy(Beverage b)', '', 'init', `beverage = b`],
            ['+ override', 'getDescription()', 'List<String>', 'get'],
            ['+ override', 'cost()', 'double', 'get'],
        ]
    })
    return lstCls
}
function getId(name) {
    let lwName = name.toLowerCase()
    lwName = lwName.replaceAll(' ', '_')
    return `cls-${lwName}`
}
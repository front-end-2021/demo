import { StructTypes, AccessInit } from "./common.js"
export function getListCls() {
    let lstCls = []
    let name = 'Account'
    let id = 1; //getId(name)
    let type = StructTypes[2][0]    //'instant class'
    lstCls.push({
        id: id++, Name: name, type, toIds: [],
        top: 30, left: 90, width: 220, height: 100,
        Fields: [
            { AcModify: '#', Name: 'name', Type: 'String' },
            { AcModify: '#', Name: 'emailAddress', Type: 'String' },
        ], Properties: [
            ['+', 'GetName()', 'string', AccessInit[0][0], `return this.Name`],
            ['+', 'SetName(String n)', 'void', AccessInit[1][0], `this.Name = n`],
            ['+', 'GetEmailAddress()', 'string', AccessInit[0][0], `return emailAddress`],
            ['+', 'SetEmailAddress(string e)', 'void', AccessInit[1][0], `emailAddress = e`],
        ]
    })
    let tIds = [id]
    name = 'Contact'
    id++// = getId(name)
    lstCls.push({
        id: id, Name: name, toIds: tIds, type,
        top: 30, left: 380, width: 210, height: 100,
        Fields: [
            { AcModify: '-', Name: 'faxNumber', Type: 'string' },
        ], Properties: [
            ['+', 'GetFaxNumber()', 'int', AccessInit[0][0]],
            ['+', 'SetFaxNumber(int f)', 'void', AccessInit[1][0], `faxNumber = f`],
        ]
    })
    name = 'Animal'
    id++// = getId(name)
    tIds = [id]
    type = StructTypes[1][0]    //'abstract class'
    lstCls.push({
        id: id, type, Name: name, toIds: [],
        top: 70, left: 1024, width: 150, height: 100,
        Fields: [
            { AcModify: '+', Name: 'age', Type: 'int' },
            { AcModify: '+', Name: 'gender', Type: 'string' },
        ], Properties: [
            ['+', 'IsMammal()', 'bool', AccessInit[0][0]],
            ['+', 'Mate()', 'int', AccessInit[0][0]],
        ]
    })
    name = 'Zebra'
    id++// = getId(name)
    type = StructTypes[2][0]    //'instant class'
    lstCls.push( {
        id: id, type, Name: name, toIds: tIds,
        top: 270, left: 1280, width: 150, height: 100,
        Fields: [
            { AcModify: '+', Name: 'isWild', Type: 'string' },
        ], Properties: [
            ['+', 'Run()', 'void', AccessInit[1][0]],
        ]
    })
    tIds = [...tIds]
    name = 'iFly'
    id++// = getId(name)
    tIds.push(id)
    type = StructTypes[0][0]    //'interface'
    lstCls.push({
        id: id, type, Name: name, toIds: [],
        top: 500, left: 1200, width: 150, height: 100,
        Fields: [], Properties: [
            ['+', 'Fly()', 'void', AccessInit[1][0]],
        ]
    })
    name = 'iQuack'
    id++// = getId(name)
    tIds.push(id)
    lstCls.push({
        id: id, type, Name: name, toIds: [],
        top: 500, left: 1400, width: 150, height: 100,
        Fields: [], Properties: [
            ['+', 'Quack()', 'void', AccessInit[1][0]],
        ]
    })
    name = 'Duck'
    id++// = getId(name)
    type = StructTypes[2][0]    //'instant class'
    lstCls.push({
        id: id, type, Name: name, toIds: tIds,
        top: 270, left: 880, width: 150, height: 100,
        Fields: [
            { AcModify: '+', Name: 'beakColor', Type: 'string' },
        ], Properties: [
            ['+', 'Swim()', 'void', AccessInit[1][0]],
        ]
    })
    name = 'Size'
    id++// = getId(name)
    type = StructTypes[3][0]    //'enum'
    lstCls.push({
        id: id, type, Name: name, 
        top: 370, left: 90, width: 220, height: 250,
        Fields: [
            { Name: 'VENTI' },
            { Name: 'GRANDE' },
            { Name: 'TALL' },
        ], Properties: []
    })
    name = 'Beverage'
    id++// = getId(name)
    type = StructTypes[1][0]    //'abstract class'
    lstCls.push({
        id: id, type, Name: name, toIds: [],
        top: 290, left: 480, width: 220, height: 120,
        Fields: [
            { AcModify: '#', Name: 'description', Type: 'string' },
            { AcModify: '#', Name: 'size', Type: 'Size' },
        ], Properties: [
            ['+ virtual', 'getDescription()', 'bool', AccessInit[0][0], `return new List<string>() { description }`],
            ['+ abstract', 'cost()', 'double', AccessInit[0][0], ],
            ['+', 'getSize()', 'Size', AccessInit[0][0], 'return size'],
            ['+', 'SetSize(Size s)', 'void', AccessInit[1][0], 'size = s'],
        ]
    })
    tIds = [id]
    name = 'Decaf'
    id++// = getId(name)
    type = StructTypes[2][0]    //'instant class'
    lstCls.push({
        id: id, type, Name: name, toIds: tIds,
        top: 480, left: 90, width: 220, height: 120,
        Fields: [], Properties: [
            ['+', 'Decaf()', '', AccessInit[2][0], `description = "Decaf"`],
            ['+ override', 'cost()', 'double', AccessInit[0][0], 'return 1.05'],
        ]
    })
    name = 'Espresso'
    id++// = getId(name)
    lstCls.push({
        id: id, type, Name: name, toIds: tIds,
        top: 480, left: 290, width: 220, height: 120,
        Fields: [], Properties: [
            ['+', 'Espresso()', '', AccessInit[2][0], `description = "Espresso"`],
            ['+ override', 'cost()', 'double', AccessInit[0][0], 'return 1.99'],
        ]
    })
    name = 'DarkRoast'
    id++// = getId(name)
    lstCls.push({
        id: id, type, Name: name, toIds: tIds,
        top: 480, left: 510, width: 220, height: 120,
        Fields: [], Properties: [
            ['+', 'DarkRoast()', '', AccessInit[2][0], `description = "DarkRoast"`],
            ['+ override', 'cost()', 'double', AccessInit[0][0], 'return 0.99'],
        ]
    })
    name = 'HouseBlend'
    id++// = getId(name)
    lstCls.push({
        id: id, type, Name: name, toIds: tIds,
        top: 480, left: 750, width: 220, height: 120,
        Fields: [], Properties: [
            ['+', 'HouseBlend()', '', AccessInit[2][0], `description = "House Blend Coffee"`],
            ['+ override', 'cost()', 'double', AccessInit[0][0], 'return 0.89'],
        ]
    })
    name = 'CondimentDecorator'
    id++// = getId(name)
    type = StructTypes[1][0]    //'abstract class'
    lstCls.push({
        id: id, type, Name: name, toIds: tIds,
        top: 660, left: 90, width: 220, height: 120,
        Fields: [
            { AcModify: '+', Name: 'beverage', Type: 'Beverage' },
        ],
        Properties: [
            ['#', 'CountDes(string des)', 'List<string>', AccessInit[1][0]],
        ]
    })
    tIds = [id]
    name = 'Soy'
    id++// = getId(name)
    type = StructTypes[2][0]    //'instant class'
    lstCls.push({
        id: id, type, Name: name, toIds: tIds,
        top: 660, left: 490, width: 220, height: 120,
        Fields: [ ],
        Properties: [
            ['+', 'Soy(Beverage b)', '', AccessInit[2][0], `beverage = b`],
            ['+ override', 'getDescription()', 'List<string>', AccessInit[0][0]],
            ['+ override', 'cost()', 'double', AccessInit[0][0]],
        ]
    })
    return lstCls
}
function getId(name) {
    let lwName = name.toLowerCase()
    lwName = lwName.replaceAll(' ', '_')
    return `cls-${lwName}`
}
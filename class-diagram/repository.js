import { StructTypes, AccessInit } from "./common.js"
export function getListCls() {
    let lstCls = []
    let name = 'Account'
    let id = 1;
    let type = StructTypes[2][0]    //'instant class'
    let tIds = [id]
    let top = 30
    let left = 90
    let dItm = {
        id: id++, Name: name, type, toIds: [],
        top, left, width: 220, height: 100,
    }
    setFilds(dItm, [
        { Visible: '#', Name: 'name', Type: 'String' },
        { Visible: '#', Name: 'emailAddress', Type: 'String' },
    ])
    setFunctions(dItm, [
        ['+', 'GetName', '', 'string', AccessInit[0][0], `return this.Name`],
        ['+', 'SetName', 'String n', 'void', AccessInit[1][0], `this.Name = n`],
        ['+', 'GetEmailAddress', '', 'string', AccessInit[0][0], `return emailAddress`],
        ['+', 'SetEmailAddress', 'string e', 'void', AccessInit[1][0], `emailAddress = e`],
    ])
    lstCls.push(dItm)
    name = 'Contact'
    id++
    left = 380
    dItm = {
        id: id, Name: name, toIds: tIds, type,
        top, left, width: 210, height: 100,
    }
    setFilds(dItm, [
        { Visible: '-', Name: 'faxNumber', Type: 'string' },
    ])
    setFunctions(dItm, [
        ['+', 'GetFaxNumber', '', 'int', AccessInit[0][0]],
        ['+', 'SetFaxNumber', 'int f', 'void', AccessInit[1][0], `faxNumber = f`],
    ])
    lstCls.push(dItm)
    name = 'Animal'
    id++
    tIds = [id]
    type = StructTypes[1][0]    //'abstract class'
    top = 70
    left = 1024
    dItm = {
        id: id, type, Name: name, toIds: [],
        top, left, width: 150, height: 100,
    }
    setFilds(dItm, [
        { Visible: '+', Name: 'age', Type: 'int' },
        { Visible: '+', Name: 'gender', Type: 'string' },
    ])
    setFunctions(dItm, [
        ['+', 'IsMammal', '', 'bool', AccessInit[0][0]],
        ['+', 'Mate', '', 'int', AccessInit[0][0]],
    ])
    lstCls.push(dItm)
    name = 'Zebra'
    id++
    type = StructTypes[2][0]    //'instant class'
    top = 30
    left = 1390
    dItm = {
        id: id, type, Name: name, toIds: tIds,
        top, left, width: 150, height: 100,
    }
    setFilds(dItm, [
        { Visible: '+', Name: 'isWild', Type: 'string' },
    ])
    setFunctions(dItm, [
        ['+', 'Run', '', 'void', AccessInit[1][0]],
    ])
    lstCls.push(dItm)
    tIds = [...tIds]
    name = 'iFly'
    id++
    tIds.push(id)
    type = StructTypes[0][0]    //'interface'
    top = 290
    left = 1460
    dItm = {
        id: id, type, Name: name, toIds: [],
        top, left, width: 150, height: 100,
    }
    setFilds(dItm, [])
    setFunctions(dItm, [
        ['+', 'Fly', '', 'void', AccessInit[1][0]],
    ])
    lstCls.push(dItm)
    name = 'iQuack'
    id++
    tIds.push(id)
    top = 210
    left = 1460
    dItm = {
        id: id, type, Name: name, toIds: [],
        top, left, width: 150, height: 100,
    }
    setFilds(dItm, [])
    setFunctions(dItm, [
        ['+', 'Quack', '', 'void', AccessInit[1][0]],
    ])
    lstCls.push(dItm)
    name = 'Duck'
    id++
    type = StructTypes[2][0]    //'instant class'
    top = 240
    left = 1062
    dItm = {
        id: id, type, Name: name, toIds: tIds,
        top, left, width: 150, height: 100,
    }
    setFilds(dItm, [
        { Visible: '+', Name: 'beakColor', Type: 'string' },
    ])
    setFunctions(dItm, [
        ['+', 'Swim', '', 'void', AccessInit[1][0]],
    ])
    lstCls.push(dItm)
    name = 'Size'
    id++
    type = StructTypes[3][0]    //'enum'
    top = 370
    left = 90
    dItm = {
        id: id, type, Name: name,
        top, left, width: 220, height: 250,
    }
    setFilds(dItm, [
        { Name: 'VENTI' },
        { Name: 'GRANDE' },
        { Name: 'TALL' },
    ])
    setFunctions(dItm, [])
    lstCls.push(dItm)
    name = 'Beverage'
    id++
    type = StructTypes[1][0]    //'abstract class'
    top = 290
    left = 480
    dItm = {
        id: id, type, Name: name, toIds: [],
        top, left, width: 220, height: 120,
    }
    setFilds(dItm, [
        { Visible: '#', Name: 'description', Type: 'string' },
        { Visible: '#', Name: 'size', Type: 'Size' },
    ])
    setFunctions(dItm, [
        ['+ virtual', 'getDescription', '', 'bool', AccessInit[0][0], `return new List<string>() { description }`],
        ['+ abstract', 'cost', '', 'double', AccessInit[0][0],],
        ['+', 'getSize', '', 'Size', AccessInit[0][0], 'return size'],
        ['+', 'SetSize', 'Size s', 'void', AccessInit[1][0], 'size = s'],
    ])
    lstCls.push(dItm)
    tIds = [id]
    name = 'Decaf'
    id++
    type = StructTypes[2][0]    //'instant class'
    top = 480
    left = 90
    dItm = {
        id: id, type, Name: name, toIds: tIds,
        top, left, width: 220, height: 120,
    }
    setFilds(dItm, [])
    setFunctions(dItm, [
        ['+', 'Decaf', '', '', AccessInit[2][0], `description = "Decaf"`],
        ['+ override', 'cost', '', 'double', AccessInit[0][0], 'return 1.05'],
    ])
    lstCls.push(dItm)
    name = 'Espresso'
    id++
    top = 480
    left = 452
    dItm = {
        id: id, type, Name: name, toIds: tIds,
        top, left, width: 220, height: 120,
    }
    setFilds(dItm, [])
    setFunctions(dItm, [
        ['+', 'Espresso', '', '', AccessInit[2][0], `description = "Espresso"`],
        ['+ override', 'cost', '', 'double', AccessInit[0][0], 'return 1.99'],
    ])
    lstCls.push(dItm)
    name = 'DarkRoast'
    id++
    top = 480
    left = 800
    dItm = {
        id: id, type, Name: name, toIds: tIds,
        top, left, width: 220, height: 120,
    }
    setFilds(dItm, [])
    setFunctions(dItm, [
        ['+', 'DarkRoast', '', '', AccessInit[2][0], `description = "DarkRoast"`],
        ['+ override', 'cost', '', 'double', AccessInit[0][0], 'return 0.99'],
    ])
    lstCls.push(dItm)
    name = 'HouseBlend'
    id++
    top = 480
    left = 1160
    dItm = {
        id: id, type, Name: name, toIds: tIds,
        top, left, width: 220, height: 120,
    }
    setFilds(dItm, [])
    setFunctions(dItm, [
        ['+', 'HouseBlend', '', '', AccessInit[2][0], `description = "House Blend Coffee"`],
        ['+ override', 'cost', '', 'double', AccessInit[0][0], 'return 0.89'],
    ])
    lstCls.push(dItm)
    name = 'CondimentDecorator'
    id++
    type = StructTypes[1][0]    //'abstract class'
    top = 660
    left = 90
    dItm = {
        id: id, type, Name: name, toIds: tIds,
        top, left, width: 220, height: 120,
    }
    setFilds(dItm, [
        { Visible: '+', Name: 'beverage', Type: 'Beverage' },
    ])
    setFunctions(dItm, [
        ['#', 'CountDes', 'string des', 'List<string>', AccessInit[1][0]],
    ])
    lstCls.push(dItm)
    tIds = [id]
    name = 'Soy'
    id++
    type = StructTypes[2][0]    //'instant class'
    top = 660
    left = 710
    dItm = {
        id: id, type, Name: name, toIds: tIds,
        top, left, width: 220, height: 120,
    }
    setFilds(dItm, [])
    setFunctions(dItm, [
        ['+', 'Soy', 'Beverage b', '', AccessInit[2][0], `beverage = b`],
        ['+ override', 'getDescription', '', 'List<string>', AccessInit[0][0]],
        ['+ override', 'cost', '', 'double', AccessInit[0][0]],
    ])
    lstCls.push(dItm)
    return lstCls
    function setFunctions(item, lst) {
        item.Methods = lst
    }
    function setFilds(item, lst) {
        item.Fields = lst
    }
}

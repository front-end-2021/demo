import { StructTypes, AccessInit } from "./common.js"
export function getListCls() {
    let lstCls = []
    let id = 1
    let top = 10
    let left = 10
    let toIds = []
    lstCls.push(
        {
            id: id, Name: 'Account', TypeDeclaration: 'class', AccessModify: 'public',
            Fields: [
                { Name: 'name', DataType: 'string', AccessModify: 'protected' },
                { Name: 'emailAddress', DataType: 'string', AccessModify: 'protected' }
            ],
            Properties: [
                { Name: 'GetName', params: [], DataType: 'string', FuncBody: 'return name', specialMe: 'get', AccessModify: 'public' },
                { Name: 'SetName', params: [['n', 'string'], ['t', 'int']], DataType: 'void', FuncBody: 'name = n', specialMe: 'set', AccessModify: 'public' },
                { Name: 'GetEmailAddress', params: [], DataType: 'string', FuncBody: 'return emailAddress', specialMe: 'get', AccessModify: 'public' },
                { Name: 'SetEmailAddress', params: [['e', 'string']], DataType: 'void', FuncBody: 'emailAddress = e', specialMe: 'get', AccessModify: 'public' },
            ],
            top, left, width: 220, height: 100, toIds
        }
    )
    toIds = [id]
    left = 380
    lstCls.push(
        {
            id: ++id, Name: 'Contact', TypeDeclaration: 'class', AccessModify: 'public',
            Fields: [
                { Name: 'faxNumber', DataType: 'string', AccessModify: 'private' }
            ],
            Properties: [
                { Name: 'GetFaxNumber', params: [], DataType: 'int', FuncBody: 'return faxNumber', specialMe: 'get', AccessModify: 'public' },
                { Name: 'SetFaxNumber', params: [['f', 'int']], DataType: 'void', FuncBody: 'faxNumber = f', specialMe: 'set', AccessModify: 'public' },
            ],
            top, left, width: 210, height: 100, toIds
        }
    )
    top = 460
    left = 1460
    toIds = []
    lstCls.push(
        {
            id: ++id, Name: 'Animal', TypeDeclaration: 'class', AccessModify: 'public',
            Fields: [
                { Name: 'age', DataType: 'int', AccessModify: 'public' },
                { Name: 'gender', DataType: 'string', AccessModify: 'public' },
            ],
            Properties: [
                { Name: 'IsMammal', params: [], DataType: 'bool', FuncBody: '', specialMe: 'get', AccessModify: 'public' },
                { Name: 'Mate', params: [], DataType: 'int', FuncBody: '', specialMe: 'get', AccessModify: 'public' },
            ],
            top, left, width: 150, height: 100, toIds
        }
    )
    toIds = [id]
    top = 30
    left = 1390
    lstCls.push(
        {
            id: ++id, Name: 'Zebra', TypeDeclaration: 'class', AccessModify: 'public',
            Fields: [
                { Name: 'isWild', DataType: 'string', AccessModify: 'public' },
            ],
            Properties: [
                { Name: 'Run', params: [], DataType: 'void', FuncBody: '', specialMe: 'set', AccessModify: 'public' },
            ],
            top, left, width: 150, height: 100, toIds
        }
    )
    toIds = [...toIds]
    top = 290
    left = 1460
    lstCls.push(
        {
            id: ++id, Name: 'iFly', TypeDeclaration: 'interface', AccessModify: 'public',
            Fields: [],
            Properties: [
                { Name: 'Fly', params: [], DataType: 'void', FuncBody: '', specialMe: 'set', AccessModify: 'public' },
            ],
            top, left, width: 150, height: 100, toIds: []
        }
    )
    top = 210
    left = 1460
    toIds.push(id)
    lstCls.push(
        {
            id: ++id, Name: 'iQuack', TypeDeclaration: 'interface', AccessModify: 'public',
            Fields: [],
            Properties: [
                { Name: 'Quack', params: [], DataType: 'void', FuncBody: '', specialMe: 'set', AccessModify: 'public' },
            ],
            top, left, width: 150, height: 100, toIds: []
        }
    )
    top = 240
    left = 1062
    toIds.push(id)
    lstCls.push(
        {
            id: ++id, Name: 'Duck', TypeDeclaration: 'class', AccessModify: 'public',
            Fields: [
                { Name: 'beakColor', DataType: 'string', AccessModify: 'public' },
            ],
            Properties: [
                { Name: 'Swim', params: [], DataType: 'void', FuncBody: '', specialMe: 'set', AccessModify: 'public' },
            ],
            top, left, width: 150, height: 100, toIds
        }
    )
    top = 370
    left = 1460
    toIds = []
    lstCls.push(
        {
            id: ++id, Name: 'Size', TypeDeclaration: 'enum', AccessModify: 'public',
            Fields: [
                { Name: 'VENTI', DataType: 'int', AccessModify: 'public' },
                { Name: 'GRANDE', DataType: 'int', AccessModify: 'public' },
                { Name: 'TALL', DataType: 'int', AccessModify: 'public' },
            ],
            Properties: [],
            top, left, width: 220, height: 250, toIds
        }
    )
    top = 290
    left = 480
    toIds = []
    lstCls.push(
        {
            id: ++id, Name: 'Beverage', TypeDeclaration: 'abstract class', AccessModify: 'public',
            Fields: [
                { Name: 'description', DataType: 'string', AccessModify: 'protected' },
                { Name: 'size', DataType: 'Size', AccessModify: 'protected' },
            ],
            Properties: [
                { Name: 'GetDescription', params: [], DataType: 'List<string>', FuncBody: 'return new List<string>() { description }', specialMe: 'get', AccessModify: 'public virtual' },
                { Name: 'Cost', params: [], DataType: 'double', FuncBody: '', specialMe: 'get', AccessModify: 'public abstract' },
                { Name: 'GetSize', params: [], DataType: 'Size', FuncBody: 'return size', specialMe: 'get', AccessModify: 'public' },
                { Name: 'SetSize', params: [['s', 'Size']], DataType: 'void', FuncBody: 'size = s', specialMe: 'set', AccessModify: 'public' },
            ],
            top, left, width: 220, height: 120, toIds
        }
    )
    top = 480
    left = 90
    toIds = [id]
    lstCls.push(
        {
            id: ++id, Name: 'Decaf', TypeDeclaration: 'class', AccessModify: 'public',
            Fields: [],
            Properties: [
                { Name: 'Decaf', params: [], DataType: '', FuncBody: 'description = "Decaf"', specialMe: 'constructor', AccessModify: 'public' },
                { Name: 'Cost', params: [], DataType: 'double', FuncBody: 'return 1.05', specialMe: 'get', AccessModify: 'public override' },
            ],
            top, left, width: 220, height: 120, toIds
        }
    )
    top = 480
    left = 452
    toIds = [...toIds]
    lstCls.push(
        {
            id: ++id, Name: 'Espresso', TypeDeclaration: 'class', AccessModify: 'public',
            Fields: [],
            Properties: [
                { Name: 'Espresso', params: [], DataType: '', FuncBody: 'description = "Espresso"', specialMe: 'constructor', AccessModify: 'public' },
                { Name: 'Cost', params: [], DataType: 'double', FuncBody: 'return 1.99', specialMe: 'get', AccessModify: 'public override' },
            ],
            top, left, width: 220, height: 120, toIds
        }
    )
    top = 480
    left = 800
    toIds = [...toIds]
    lstCls.push(
        {
            id: ++id, Name: 'DarkRoast', TypeDeclaration: 'class', AccessModify: 'public',
            Fields: [],
            Properties: [
                { Name: 'DarkRoast', params: [], DataType: '', FuncBody: 'description = "Dark Roast"', specialMe: 'constructor', AccessModify: 'public' },
                { Name: 'Cost', params: [], DataType: 'double', FuncBody: 'return 0.99', specialMe: 'get', AccessModify: 'public override' },
            ],
            top, left, width: 220, height: 120, toIds
        }
    )
    top = 30
    left = 680
    toIds = [...toIds]
    lstCls.push(
        {
            id: ++id, Name: 'HouseBlend', TypeDeclaration: 'class', AccessModify: 'public',
            Fields: [],
            Properties: [
                { Name: 'HouseBlend', params: [], DataType: 'void', FuncBody: 'description = "House Blend Coffee"', specialMe: 'constructor', AccessModify: 'public' },
                { Name: 'Cost', params: [], DataType: 'double', FuncBody: 'return 0.89', specialMe: 'get', AccessModify: 'public override' },
            ],
            top, left, width: 220, height: 120, toIds
        }
    )
    top = 260
    left = 10
    toIds = [...toIds]
    lstCls.push(
        {
            id: ++id, Name: 'CondimentDecorator', TypeDeclaration: 'class', AccessModify: 'public',
            Fields: [
                { Name: 'beverage', DataType: 'Beverage', AccessModify: 'public' },
            ],
            Properties: [
                { Name: 'CountDes', params: [['des', 'string']], DataType: 'List<string>', FuncBody: '', specialMe: 'set', AccessModify: 'public' },
            ],
            top, left, width: 220, height: 120, toIds
        }
    )
    top = 660
    left = 710
    toIds = [id]
    lstCls.push(
        {
            id: ++id, Name: 'Soy', TypeDeclaration: 'class', AccessModify: 'public',
            Fields: [],
            Properties: [
                { Name: 'Soy', params: [['b', 'Beverage']], DataType: '', FuncBody: 'beverage = b', specialMe: 'constructor', AccessModify: 'public' },
                { Name: 'getDescription', params: [], DataType: 'List<string>', FuncBody: '', specialMe: 'get', AccessModify: 'public override' },
                { Name: 'Cost', params: [], DataType: 'double', FuncBody: 'return 0.89', specialMe: 'get', AccessModify: 'public override' },
            ],
            top, left, width: 220, height: 120, toIds
        }
    )
    return lstCls
}

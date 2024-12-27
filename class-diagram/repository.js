export function getListCls() {
    let lstCls = [
        {
            id: 'cls-account', type: 'instant class',
            top: 30, left: 90, width: 220, height: 100,
            Name: 'Account', Fields: [
                { AcModify: '#', Name: 'name', Type: 'String' },
                { AcModify: '#', Name: 'emailAddress', Type: 'String' },
            ], Properties: [
                ['+', 'GetName()', 'String', 'get', `return this.Name`],
                ['+', 'SetName(String)', 'void', 'set', `this.Name = string`],
                ['+', 'GetEmailAddress()', 'String', 'get'],
                ['+', 'SetEmailAddress(String)', 'void', 'set'],
            ]
        },
        {
            id: 'cls-contact', type: 'instant class',
            idTos: [['cls-account', 'extend']],
            top: 70, left: 580, width: 210, height: 100,
            Name: 'Contact', Fields: [
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
        },
        {
            id: 'cls-animal', type: 'abstract class',
            top: 70, left: 1024, width: 150, height: 100,
            Name: 'Animal', Fields: [
                { AcModify: '+', Name: 'age', Type: 'Int' },
                { AcModify: '+', Name: 'gender', Type: 'String' },
            ], Properties: [
                ['+', 'IsMammal()', 'Bool', 'get'],
                ['+', 'Mate()', 'Int', 'get'],
            ]
        },
        {
            id: 'cls-duck', type: 'instant class',
            idTos: [['cls-animal', 'extend'], ['cls-ifly', 'implement'], ['cls-quack', 'implement']],
            top: 270, left: 880, width: 150, height: 100,
            Name: 'Duck', Fields: [
                { AcModify: '+', Name: 'beakColor', Type: 'String' },
            ], Properties: [
                ['+', 'Swim()', 'void', 'set'],
            ]
        },
        {
            id: 'cls-zebra', type: 'instant class',
            idTos: [['cls-animal', 'extend']],
            top: 270, left: 1280, width: 150, height: 100,
            Name: 'Zebra', Fields: [
                { AcModify: '+', Name: 'isWild', Type: 'String' },
            ], Properties: [
                ['+', 'Run()', 'void', 'set'],
            ]
        },
        {
            id: 'cls-ifly', type: 'interface',
            top: 500, left: 1200, width: 150, height: 100,
            Name: 'iFly', Fields: [], Properties: [
                ['+', 'Fly()', 'void', 'set'],
            ]
        },
        {
            id: 'cls-quack', type: 'interface',
            top: 500, left: 1400, width: 150, height: 100,
            Name: 'iQuack', Fields: [], Properties: [
                ['+', 'Quack()', 'void', 'set'],
            ]
        },
    ]
    return lstCls
}
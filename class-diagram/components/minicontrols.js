import { StructTypes, AccessInit, setHeight } from "../common.js"
import { MenuList } from "./vw-diagram.js"
export const PopDropdownSearch = {
    template: `#tmp-drp-search`,
    name: "Drop_Search",
    display: "Drop.Search",
    props: ['ids', 'sources'],
    emits: ['select:id', 'remove:id'],
    data() {
        return {
            TxtSearch: '',
            ListSrc: this.sources
        }
    },
    created() {

    },
    methods: {
        bgSelect(item) {
            if (this.ids.includes(item.id)) return {
                backgroundColor: '#d1d1d1'
            }
        },
        inSearch(e) {
            console.log('in search ', e.target)
            const target = e.target
            let str = target.value
            str = str.trim()
            this.ListSrc = this.getLstSrc(str)
        },
        getLstSrc(str) {
            if (!str.length) return this.sources
            const lst = []
            for (let ii = 0, src; ii < this.sources.length; ii++) {
                src = this.sources[ii]
                if (src.Name.includes(str)) lst.push(src)
            }
            return lst
        },
        selectItem(item) { this.$emit('select:id', item.id) },
        removeItem(item) { this.$emit('remove:id', item.id) },
    },
}
const MxForm = {
    props: ['entry'],
    computed: {
        IsSelectTyp() {
            if ('cls-classname' == this.entry.item.id)
                return true; // add new

            const type = this.entry.type
            if (typeof type != 'string') return false
            if (!type.includes('class')) return false
            const idsTo = this.entry.item.toIds
            if (idsTo && idsTo.length) return false
            return true
        },
        TxtType() {
            const type = this.entry.type
            if (typeof type != 'string') return
            const ii = this.$root.PLang
            if (StructTypes[1][0] == type) return StructTypes[1][ii]
            if (type.includes('class')) return StructTypes[2][ii]
            return type
        },
        HasCode() {
            const type = this.entry.type
            if (type.includes('class')) return true
            return false
        },
        HasPropers() {
            const type = this.entry.type
            if (type.includes('class')) return true
            if (type.includes('interface')) return true
            if (type.includes('struct')) return true
            return false
        },
    },
    methods: {

    }
}
export const FormEdit = {
    template: `#tmp-form-edit`,
    name: "Form_Edit",
    display: "Form.Edit",
    components: {
        'menu-list': MenuList,
        'drplst-search': PopDropdownSearch,
    },
    mixins: [MxForm],
    data() {
        return {
            AccessInit: AccessInit,
            IsDrpExtend: false,
        }
    },
    computed: {
        StrucTypes() {
            const root = this.$root
            let lst = StructTypes
            if ('cls-classname' == this.entry.item.id)
                return lst.map(x => x[root.PLang]);

            lst = lst.filter(x => x[0].includes('class'))
            return lst.map(x => x[root.PLang])
        },
        ViewExtend() { return this.$root.getExtend(this.entry) },
        ListExtend() {
            let isClass = this.$root.canExtend(this.entry.item)
            if (!isClass) return []
            const idsTo = this.entry.toIds
            if (!idsTo) return []
            const lst = []
            const lstSrc = this.$root.ListClass
            let lsEx = []
            const itemId = this.entry.item.id
            for (let ii = 0, src; ii < lstSrc.length; ii++) {
                src = lstSrc[ii]
                if (itemId == src.id) continue;
                if (src.type.includes('enum')) continue
                if (src.type.includes('struct')) continue
                if (src.toIds && src.toIds.includes(itemId)) continue
                if (idsTo.includes(src.id) && src.type.includes('class'))
                    lsEx.push(src.id)
                lst.push(src)
            }
            if (this.entry.type.includes('abstract')) {
                if (lsEx.length) {
                    for (let ii = lst.length - 1, src; -1 < ii; ii--) {
                        src = lst[ii]
                        if (src.type.includes('interface')) continue
                        if (src.type.includes('abstract')) {
                            if (lsEx.includes(src.id)) continue
                        }
                        lst.splice(ii, 1)
                    }
                }
                for (let ii = lst.length - 1, src; -1 < ii; ii--) {
                    src = lst[ii]
                    if (src.type.includes('abstract')) continue
                    if (src.type.includes('interface')) continue
                    lst.splice(ii, 1)
                }
                return lst
            }
            if ('class' == isClass) {
                if (lsEx.length) {
                    for (let ii = lst.length - 1, src; -1 < ii; ii--) {
                        src = lst[ii]
                        if (lsEx.includes(src.id)) continue
                        if (src.type.includes('class')) lst.splice(ii, 1)
                    }
                }
                return lst
            }
            if ('itf_' == isClass) {
                for (let ii = lst.length - 1, src; -1 < ii; ii--) {
                    src = lst[ii]
                    if (src.type.includes('interface')) continue
                    lst.splice(ii, 1)
                }
                return lst
            }
        },
    },
    methods: {
        changeTypeObject(val) {
            console.log('change type object ', val)
            const frmCode = this.$root.DynamicVar.get('FrameCode')
            const ii = this.$root.PLang
            switch (val) {
                case StructTypes[0][ii]:
                    this.entry.type = StructTypes[0][0]
                    break;
                case StructTypes[1][ii]:
                    this.entry.type = StructTypes[1][0]
                    break;
                case StructTypes[2][ii]:
                    this.entry.type = StructTypes[2][0]
                    break;
                case StructTypes[3][ii]:
                    this.entry.type = StructTypes[3][0]
                    break;
                default: return;
            }
        },
        onChange(e, type, ii) {
            const frmCode = this.$root.DynamicVar.get('FrameCode')
            const target = e.target
            let mItem = frmCode.MItem || {}
            let fAcMd = mItem.FdAcM || new Map()
            let fName = mItem.FdName || new Map()
            let fType = mItem.FdType || new Map()
            let amKey = mItem.PrpAmKey || new Map()
            let amName = mItem.PrpAmName || new Map()
            let amType = mItem.PrpAmType || new Map()
            let ctCode = mItem.PrpAmCode || new Map()
            switch (type) {
                case 'class name':
                    mItem.Name = target.textContent
                    break;
                case 'field acmodify':
                    fAcMd.set(ii, target.textContent)
                    break;
                case 'field name':
                    fName.set(ii, target.textContent)
                    break;
                case 'field type':
                    fType.set(ii, target.textContent)
                    break;
                case 'access modify key':
                    amKey.set(ii, target.textContent)
                    break;
                case 'access modify name':
                    amName.set(ii, target.textContent)
                    break;
                case 'access modify type':
                    amType.set(ii, target.textContent)
                    break;
                case 'code context':
                    ctCode.set(ii, target.value)
                    setHeight(target, target.value)
                    break;
                default: break;
            }
            if (!mItem.FdAcM) mItem.FdAcM = fAcMd
            if (!mItem.FdName) mItem.FdName = fName
            if (!mItem.FdType) mItem.FdType = fType
            if (!mItem.PrpAmKey) mItem.PrpAmKey = amKey
            if (!mItem.PrpAmName) mItem.PrpAmName = amName
            if (!mItem.PrpAmType) mItem.PrpAmType = amType
            if (!mItem.PrpAmCode) mItem.PrpAmCode = ctCode
            if (!frmCode.MItem) frmCode.MItem = mItem
            // console.log('on change ', type, target.textContent, e)
        },
        onBlurEditable(e, type, ii) {
            const frmCode = this.$root.DynamicVar.get('FrameCode')
            const eItem = frmCode.eItem
            const target = e.target
            let prpF
            switch (type) {
                case 'class name':
                    eItem.Name = target.textContent
                    break;
                case 'field acmodify':
                    prpF = eItem.Fields[ii]
                    prpF.AcModify = target.textContent
                    break;
                case 'field name':
                    prpF = eItem.Fields[ii]
                    prpF.Name = target.textContent
                    break;
                case 'field type':
                    prpF = eItem.Fields[ii]
                    prpF.Type = target.textContent
                    break;
                case 'access modify key':
                    prpF = eItem.Properties[ii]
                    prpF[0] = target.textContent
                    break;
                case 'access modify name':
                    prpF = eItem.Properties[ii]
                    prpF[1] = target.textContent
                    break;
                case 'access modify type':
                    prpF = eItem.Properties[ii]
                    prpF[2] = target.textContent
                    break;
                case 'code context':
                    prpF = eItem.Properties[ii]
                    prpF[4] = target.value
                    setHeight(target, target.value)
                    break;
                default: break;
            }
        },
        getTxtAcModify(symb, isStr) {   // AccessModifiers
            if (typeof symb != 'string') return
            if (isStr) {
                symb = symb.toLowerCase()
                if (symb.includes('public')) return symb.replace('public', '+')
                if (symb.includes('private')) return symb.replace('private', '-')
                if (symb.includes('protected')) return symb.replace('protected', '#')
                return
            }
            if (symb.includes('+')) return symb.replace('+', 'public')
            if (symb.includes('-')) return symb.replace('-', 'private')
            if (symb.includes('#')) return symb.replace('#', 'protected')
        },
        removeField(ii, isNew) {
            const frmCode = this.$root.DynamicVar.get('FrameCode')
            let fields = frmCode.Fields
            if (isNew) {
                if (fields) {
                    fields = JSON.parse(JSON.stringify(fields))
                    fields.splice(ii, 1)
                    if (!fields.length) delete frmCode.Fields
                    else frmCode.Fields = fields
                }
                return
            }
            fields = frmCode.iFields
            fields.splice(ii, 1)
            const mItem = frmCode.MItem
            if (mItem) {
                const fAcMd = mItem.FdAcM
                if (fAcMd && fAcMd.has(ii)) fAcMd.delete(ii)
                const fName = mItem.FdName
                if (fName && fName.has(ii)) fName.delete(ii)
                const fType = mItem.FdType
                if (fType && fType.has(ii)) fType.delete(ii)
            }
        },
        onEditNewField(e, type, ii) {
            const target = e.target
            const frmCode = this.$root.DynamicVar.get('FrameCode')
            switch (type) {
                case 'field acmodify':
                    frmCode.Fields[ii].AcModify = target.textContent
                    break;
                case 'field name':
                    frmCode.Fields[ii].Name = target.textContent
                    break;
                case 'field type':
                    frmCode.Fields[ii].Type = target.textContent
                    break;
                default: break;
            }
        },
        addField() {
            const frmCode = this.$root.DynamicVar.get('FrameCode')
            if (!frmCode.Fields) {
                frmCode.Fields = [{
                    ii: 0,
                    AcModify: 'private', Name: 'fieldName', Type: 'String'
                }]
            } else {
                if (frmCode.Fields.filter(x => 'fieldName' == x.Name).length) {
                    return;
                }
                let ii = frmCode.Fields.length
                frmCode.Fields.push({
                    ii: ii,
                    AcModify: 'private', Name: 'fieldName', Type: 'String'
                })
            }
        },
        getAccessors(acs) {
            let txt = acs
            const il = this.$root.PLang
            if (acs.includes(this.AccessInit[2][0]))
                txt = this.AccessInit[2][il]
            return txt
        },
        changeAccessor(ii, txt) {
            let acs = txt
            const frmCode = this.$root.DynamicVar.get('FrameCode')
            const prp = frmCode.item.Properties[ii]
            const il = this.$root.PLang
            switch (txt) {
                case AccessInit[2][il]: // init
                    acs = this.AccessInit[2][0]
                    let a0 = prp[0].split(' ')
                    prp[0] = a0[0]
                    if (prp[2].length) prp[2] = ''
                    break;
                case AccessInit[1][il]: // set
                    prp[2] = 'void'
                    break;
                case AccessInit[0][il]: // get
                    if ('void' == prp[2]) prp[2] = 'string'
                    if (!prp[2].length) prp[2] = 'string'
                    break;
                default: break;
            }
            prp[3] = acs
        },
        getReturnType(acs) {
            if (typeof acs != 'string') return false;
            if (acs.includes('get')) return true
            return false
        },
        removeProperty(ii, isNew) {
            const frmCode = this.$root.DynamicVar.get('FrameCode')
            let lstNwPr = frmCode.Propers
            if (isNew) {
                if (lstNwPr) {
                    if (-1 < ii) lstNwPr.splice(ii, 1)
                    if (!lstNwPr.length) delete frmCode.Propers
                }
                return
            }
            lstNwPr = frmCode.iPropes
            lstNwPr.splice(ii, 1)
            const mItem = frmCode.MItem
            if (mItem) {
                const amKey = mItem.PrpAmKey
                if (amKey && amKey.has(ii)) amKey.delete(ii)
                const aName = mItem.PrpAmName
                if (aName && aName.has(ii)) aName.delete(ii)
                const aType = mItem.PrpAmType
                if (aType && aType.has(ii)) aType.delete(ii)
                const amCode = mItem.PrpAmCode
                if (amCode && amCode.has(ii)) amCode.delete(ii)
            }
        },
        changeNewProp(e, type, ii) {
            const frmCode = this.$root.DynamicVar.get('FrameCode')
            const prop = frmCode.Propers[ii]
            if ('acmtp' == type) {
                const il = this.$root.PLang
                let acs = e
                switch (e) {
                    case AccessInit[2][il]: // init
                        acs = this.AccessInit[2][0]
                        let a0 = prop[0].split(' ')
                        prop[0] = a0[0]
                        if (prop[2].length) prop[2] = ''
                        break;
                    case AccessInit[1][il]: // set
                        prop[2] = 'void'
                        break;
                    case AccessInit[0][il]: // get
                        if ('void' == prop[2]) prop[2] = 'string'
                        if (!prop[2].length) prop[2] = 'string'
                        break;
                    default: break;
                }
                prop[3] = acs
                return
            }
            const target = e.target
            let txt = target.textContent
            switch (type) {
                case 'access modify key': prop[0] = txt
                    break;
                case 'access modify name': prop[1] = txt
                    break;
                case 'access modify type': prop[2] = txt
                    break;
                case 'code context':
                    txt = target.value
                    prop[4] = txt
                    setHeight(target, target.value)
                    break;
                default: break;
            }
        },
        keyUpTxtArea(e) {
            let target = e.target
            let txt = target.value
            setHeight(target, txt)
        },
        pasteTxtArea(e) {
            setTimeout(() => {
                let target = e.target
                let txt = target.value
                setHeight(target, txt)
            }, 111)
        },
        addProperty() {
            const frmCode = this.$root.DynamicVar.get('FrameCode')
            if (!frmCode.Propers) {
                frmCode.Propers = [
                    ['public', 'ProperName()', 'string', AccessInit[0][0], '']
                ]
            } else {
                if (frmCode.Propers.filter(x => 'ProperName()' == x[1]).length) {
                    return;
                }
                frmCode.Propers.push(['public', 'ProperName()', 'string', AccessInit[0][0], ''])
            }
        },
        onCloseEdit() {
            this.$root.DynamicVar.delete('FrameCode')
        },
        onSaveChange() {
            const frmCode = this.$root.DynamicVar.get('FrameCode')
            const mItem = frmCode.MItem
            const item = frmCode.item
            item.toIds = frmCode.toIds
            if (!mItem) {
                item.Fields = frmCode.iFields
                addNewFields.call(this)
                item.Properties = frmCode.iPropes
                addNewPropes.call(this)
                this.$root.DynamicVar.delete('FrameCode')
                return
            }
            let name = mItem.Name
            name = clearSpace(name, item.Name)
            let arrChange = []
            if (name != item.Name) {
                item.Name = name
                arrChange.push('Name')
            }
            const fAcMd = mItem.FdAcM
            for (const [ii, txt] of fAcMd) {
                const field = frmCode.iFields[ii]
                name = txt.trim()
                name = name.toLowerCase()
                name = this.getTxtAcModify(name, true)
                if (field.AcModify != name) {
                    arrChange.push(`Field.AcModify ${field.AcModify}`)
                    field.AcModify = name
                }
            }
            const fName = mItem.FdName
            for (const [ii, txt] of fName) {
                const field = frmCode.iFields[ii]
                name = clearSpace(txt, field.Name)
                if (field.Name != name) {
                    arrChange.push(`Field.Name ${field.Name}`)
                    field.Name = name
                }
            }
            const fType = mItem.FdType
            for (const [ii, txt] of fType) {
                const field = frmCode.iFields[ii]
                name = clearSpace(txt, field.Type)
                if (field.Type != name) {
                    arrChange.push(`Field.Type ${field.Type}`)
                    field.Type = name
                }
            }
            item.Fields = frmCode.iFields
            addNewFields.call(this)
            const amKey = mItem.PrpAmKey
            for (const [ii, txt] of amKey) {
                const prp = frmCode.iPropes[ii]
                name = txt
                if (typeof name != 'string') continue
                name = name.trim()
                if (!name.length) continue
                name = name.split(' ')
                name = name.map(x => x.replaceAll(' ', ''))
                name = name.filter(x => x.length)
                if (!name.length) continue
                name = name.map(x => {
                    let xx = x.toLowerCase()
                    if (xx.includes('public')) return '+'
                    if (xx.includes('protected')) return '#'
                    if (xx.includes('private')) return '-'
                    return x
                })
                name = name.join(' ')
                const pKey = prp[0]
                if (pKey != name) {
                    prp[0] = name
                    arrChange.push(`Accessor Fuction ${pKey}`)
                }
            }
            const amName = mItem.PrpAmName
            for (const [ii, txt] of amName) {
                const prp = frmCode.iPropes[ii]
                const pName = prp[1]
                name = txt.trim()
                if (pName != name) {
                    prp[1] = name
                    arrChange.push(`Fuction ${pName}`)
                }
            }
            const amType = mItem.PrpAmType
            for (const [ii, txt] of amType) {
                const prp = frmCode.iPropes[ii]
                const pType = prp[2]
                name = clearSpace(txt, pType)
                if (pType != name) {
                    prp[2] = name
                    arrChange.push(`Return Fuction ${pType}`)
                }
            }
            const ctCode = mItem.PrpAmCode
            for (const [ii, txt] of ctCode) {
                const prp = frmCode.iPropes[ii]
                const pType = prp[4]
                name = txt
                if (!this.$root.equalHas(name, pType)) {
                    prp[4] = name
                    arrChange.push(`Return Fuction ${pType}`)
                }
            }
            item.Properties = frmCode.iPropes
            addNewPropes.call(this)
            if (arrChange.length) {
                //  console.log('changes ', arrChange)
            }
            this.$root.DynamicVar.delete('FrameCode')
            function clearSpace(str, nm) {
                if (typeof str != 'string') return nm
                str = str.trim()
                return str.replaceAll(' ', '')
            }
            function addNewFields() {
                if (!frmCode.Fields) return
                if (!frmCode.Fields.length) return
                for (let ff = 0, fld; ff < frmCode.Fields.length; ff++) {
                    fld = frmCode.Fields[ff]
                    fld.AcModify = this.getTxtAcModify(fld.AcModify, true)
                    item.Fields.push(fld)
                }
            }
            function addNewPropes() {
                if (!frmCode.Propers) return
                if (!frmCode.Propers.length) return
                for (let ff = 0, prp; ff < frmCode.Propers.length; ff++) {
                    prp = frmCode.Propers[ff]
                    prp[0] = this.getTxtAcModify(prp[0], true)
                    item.Properties.push(prp)
                }
            }
        },
        addExtend(id) {
            const idsTo = this.entry.toIds
            idsTo.push(id)
            this.IsDrpExtend = false
        },
        removeExtend(id) {
            const idsTo = this.entry.toIds
            let ii = idsTo.indexOf(id)
            if (-1 < ii) idsTo.splice(ii, 1)
            this.IsDrpExtend = false
        },
        showDrpSearch() {
            this.IsDrpExtend = true
        },
    }
}
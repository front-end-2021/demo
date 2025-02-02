import {
    StructTypes, AccessInit, setHeight, objNewCls,
    isAbstract, isInterface, isClass, isEnum,
    clearSpace, verifySave, convertAccessors,
    PropName,
} from "../common.js"
import { MenuList } from "./vw-diagram.js"
export const PopDropdownSearch = {
    template: `#tmp-drp-search`,
    name: "Drop_Search",
    display: "Drop.Search",
    props: ['ids', 'sources', 'type'],
    emits: ['select:id', 'remove:id', 'on:exit'],
    data() {
        return {
            TxtSearch: '',
            ListSrc: this.sources
        }
    },
    mounted() {
        document.addEventListener('keyup', this.pressEscKey)
    },
    methods: {
        bgSelect(item) {
            if (this.ids.includes(item.id)) return {
                backgroundColor: '#d1d1d1'
            }
        },
        inSearch(e) {
            //  console.log('in search ', e.target)
            const target = e.target
            let str = target.value
            str = str.trim()
            this.ListSrc = this.getLstSrc(str)
        },
        getLstSrc(str, sources) {
            if (!sources) sources = this.sources
            if (typeof str != 'string') return sources
            if (!str.length) return sources
            const lst = []
            for (let ii = 0, src; ii < this.sources.length; ii++) {
                src = this.sources[ii]
                if (src.Name.includes(str)) lst.push(src)
            }
            return lst
        },
        selectItem(item) {
            this.$emit('select:id', item.id)
        },
        removeItem(item) {
            this.$emit('remove:id', item.id)
        },
        pressEscKey(event) {
            if ('Escape' == event.key) {
                this.$emit('on:exit')
            }
        },
    },
    beforeUnmount() {
        document.removeEventListener('keyup', this.pressEscKey)
    },
    watch: {
        sources(vals) {
            this.ListSrc = this.getLstSrc(this.TxtSearch, vals)
        },
    },
}

export const FormEdit = {
    template: `#tmp-form-edit`,
    name: "Form_Edit",
    display: "Form.Edit",
    components: {
        'menu-list': MenuList,
        'drplst-search': PopDropdownSearch,
    },
    props: ['entry'],
    data() {
        return {
            AccessInit: AccessInit,
            IsDrpExtend: false,
        }
    },
    computed: {
        IsSelectTyp() {
            const mItem = this.entry
            if (typeof mItem.id != 'number') return true
            if (typeof mItem.type != 'string') return false
            if (!isClass(mItem.type)) return false
            if (mItem.toIds && mItem.toIds.length) return false
            return true
        },
        TxtType() {
            const mItem = this.entry
            if (typeof mItem.type != 'string') return
            const ii = this.$root.PLang
            if (StructTypes[1][0] == mItem.type) return StructTypes[1][ii]
            if (isClass(mItem.type)) return StructTypes[2][ii]
            return mItem.type
        },
        HasCode() {
            const mItem = this.entry
            if (isClass(mItem.type)) return true
            return false
        },
        HasPropers() {
            const mItem = this.entry
            if (isClass(mItem.type)) return true      // class/abstrac
            if (isInterface(mItem.type)) return true
            if (mItem.type.includes('struct')) return true
            return false
        },
        StrucTypes() {
            const root = this.$root
            let lst = StructTypes
            const mItem = this.entry
            if (typeof mItem.id != 'number') return lst.map(x => x[root.PLang])
            lst = lst.filter(x => isClass(x[0]))
            return lst.map(x => x[root.PLang])
        },
        ViewExtend() { return this.$root.getExtend(this.entry) },
        Extendable() {
            const mItem = this.entry
            if (isClass(mItem.type)) return 1
            if (isInterface(mItem.type)) return 2
            return 0
        },
        ListExtend() {
            const mItem = this.entry
            if (!this.Extendable) return []
            const idsTo = mItem.toIds
            if (!idsTo) return []
            const lst = []
            const lstSrc = this.$root.ListClass
            let lsEx = []
            const itemId = mItem.id
            for (let ii = 0, src; ii < lstSrc.length; ii++) {
                src = lstSrc[ii]
                if (itemId == src.id) continue;
                if (isEnum(src.type)) continue
                if (src.type.includes('struct')) continue
                if (src.toIds && src.toIds.includes(itemId)) continue
                if (idsTo.includes(src.id) && isClass(src.type))
                    lsEx.push(src.id)
                lst.push(src)
            }
            if (isAbstract(mItem.type)) {
                if (lsEx.length) {
                    for (let ii = lst.length - 1, src; -1 < ii; ii--) {
                        src = lst[ii]
                        if (isInterface(src.type)) continue
                        if (isAbstract(src.type)) {
                            if (lsEx.includes(src.id)) continue
                        }
                        lst.splice(ii, 1)
                    }
                }
                for (let ii = lst.length - 1, src; -1 < ii; ii--) {
                    src = lst[ii]
                    if (isAbstract(src.type)) continue
                    if (isInterface(src.type)) continue
                    lst.splice(ii, 1)
                }
                return lst
            }
            if (isClass(mItem.type)) {
                if (lsEx.length) {
                    for (let ii = lst.length - 1, src; -1 < ii; ii--) {
                        src = lst[ii]
                        if (lsEx.includes(src.id)) continue
                        if (isClass(src.type)) lst.splice(ii, 1)
                    }
                }
                return lst
            }
            if (isInterface(mItem.type)) {
                for (let ii = lst.length - 1, src; -1 < ii; ii--) {
                    src = lst[ii]
                    if (isInterface(src.type)) continue
                    lst.splice(ii, 1)
                }
                return lst
            }
        },
    },
    methods: {
        changeTypeObject(val) { //console.log('change type object ', val)
            const frmCode = this.$root.DynamicVar.get('FrameCode')
            const mItem = frmCode.cItem
            const ii = this.$root.PLang
            switch (val) {
                case StructTypes[0][ii]:
                    mItem.type = StructTypes[0][0]
                    break;
                case StructTypes[1][ii]:
                    mItem.type = StructTypes[1][0]
                    break;
                case StructTypes[2][ii]:
                    mItem.type = StructTypes[2][0]
                    break;
                case StructTypes[3][ii]:
                    mItem.type = StructTypes[3][0]
                    break;
                default: return;
            }
        },
        onBlurEditable(e, type, ii) {
            const frmCode = this.$root.DynamicVar.get('FrameCode')
            const mItem = frmCode.cItem
            const target = e.target
            let prpF
            let txtC = target.textContent
            txtC = txtC.trim()
            if (!txtC.length) return;
            console.log(txtC)
            debugger
            switch (type) {
                case 'class name':
                    mItem.Name = txtC
                    break;
                case 'field acmodify':
                    prpF = mItem.Fields[ii]
                    prpF.AcModify = txtC
                    break;
                case 'field name':
                    prpF = mItem.Fields[ii]
                    prpF.Name = txtC
                    break;
                case 'field type':
                    prpF = mItem.Fields[ii]
                    prpF.Type = txtC
                    break;
                case 'access modify key':
                    prpF = mItem.Properties[ii]
                    prpF[0] = txtC
                    break;
                case 'access modify name':
                    prpF = mItem.Properties[ii]
                    prpF[1] = txtC
                    break;
                case 'access modify type':
                    prpF = mItem.Properties[ii]
                    prpF[2] = txtC
                    break;
                case 'code context':
                    prpF = mItem.Properties[ii]
                    prpF[4] = target.value
                    setHeight(target, target.value)
                    break;
                default: break;
            }
        },
        removeField(ii) {
            const frmCode = this.$root.DynamicVar.get('FrameCode')
            const fields = frmCode.cItem.Fields
            if (!fields || !fields.length) return;
            fields.splice(ii, 1)
        },
        addField() {
            const frmCode = this.$root.DynamicVar.get('FrameCode')
            const mItem = frmCode.cItem
            let fld = { Name: 'fieldName' }
            if (this.HasPropers) {
                fld = { AcModify: 'private', Name: 'fieldName', Type: 'String' }
            }
            if (!mItem.Fields) mItem.Fields = [fld]
            else {
                if (mItem.Fields.find(x => 'fieldName' == x.Name)) return;
                mItem.Fields.push(fld)
            }
        },
        changeAccessor(ii, txt) {
            let acs = txt
            const frmCode = this.$root.DynamicVar.get('FrameCode')
            const mItem = frmCode.cItem
            const prp = mItem.Properties[ii]
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
            prp[3] = convertAccessors(acs, il)
        },
        isReturnType(acs) {
            if (typeof acs != 'string') return false;
            if (acs.includes('get')) return true
            return false
        },
        removeProperty(ii) {
            const frmCode = this.$root.DynamicVar.get('FrameCode')
            const mItem = frmCode.cItem
            if (!mItem.Properties || !mItem.Properties.length) return;
            mItem.Properties.splice(ii, 1)
        },
        onInput(e, type, ii) {
            const target = e.target
            switch (type) {
                case 'code context':
                    setHeight(target, target.value)
                    break;
                default: return;
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
            const mItem = frmCode.cItem
            if (!mItem.Properties) {
                mItem.Properties = [
                    ['public', PropName, 'string', AccessInit[0][0], '']
                ]
            } else {
                if (mItem.Properties.find(x => PropName == x[1])) return;
                mItem.Properties.push(['public', PropName, 'string', AccessInit[0][0], ''])
            }
        },
        onCloseEdit() {
            this.$root.DynamicVar.delete('FrameCode')
            this.$root.NewClassName = null
        },
        onSaveChange() {
            const frmCode = this.$root.DynamicVar.get('FrameCode')
            const mItem = frmCode.cItem
            if (typeof mItem.id != 'number') {
                let nItem = onNewItem.call(this, mItem)
                this.$root.NewClassName = null
                this.onCloseEdit()
                if (nItem && nItem.toIds && nItem.toIds.length) {
                    this.$root.drawLines(this.$root.getPoints())
                }
                return
            }
            const item = frmCode.item
            item.type = mItem.type
            let name = mItem.Name
            name = clearSpace(name, item.Name)
            if (!name.length) {
                this.onCloseEdit()
                return
            }
            item.Name = name
            const changeToids = item.toIds.length != mItem.toIds.length
            item.toIds = mItem.toIds
            verifySave(mItem, this.$root.PLang, true)

            item.Fields = mItem.Fields
            item.Properties = mItem.Properties

            this.onCloseEdit()
            if (changeToids) {
                this.$root.drawLines(this.$root.getPoints())
            }
            function onNewItem(newItem) {
                let nItem = objNewCls(newItem)
                if (!nItem) {
                    this.$root.NewClassName = null
                    return;
                }
                if (!nItem.Name.length) {
                    this.$root.NewClassName = null
                    return;
                }
                const lstCls = this.$root.ListClass;
                nItem = verifyNewItem.call(this, nItem)
                verifySave(nItem, this.$root.PLang, true)
                // if (isAbstract(nItem.type)) { }
                // if (isClass(nItem.type)) { }
                lstCls.push(nItem)
                return nItem
                function verifyNewItem(item) {
                    let newName = item.Name
                    if (!newName.length) return item
                    const maxId = Math.max(...lstCls.map(x => x.id))
                    const lstN = lstCls.filter(x => newName === x.Name)
                    if (lstN.length) {
                        item.Name = `${newName}${lstN.length}`
                    }
                    item.id = maxId + 1
                    return item
                }
            }
        },
        addExtend(id) {
            const idsTo = this.entry.toIds
            idsTo.push(id)
        },
        removeExtend(id) {
            const idsTo = this.entry.toIds
            let ii = idsTo.indexOf(id)
            if (-1 < ii) idsTo.splice(ii, 1)
        },
        showDrpSearch() {
            this.IsDrpExtend = true
        },
        hideDrpSearch() {
            this.IsDrpExtend = false
        },
    }
}

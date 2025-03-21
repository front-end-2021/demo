import {
    StructTypes, AccessInit, setHeight, objNewCls,
    isAbstract, isInterface, isClass, isEnum,
    clearSpace, verifySave, convertAccessors,
    PropName, hasnMethod, removeExtraSpaces, isStruct,
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
            for (let ii = 0, src, name; ii < this.sources.length; ii++) {
                src = this.sources[ii]
                name = src.Name
                name = name.toLowerCase()
                if (name.includes(str)) lst.push(src)
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
            if (isClass(mItem.type)) return true
            return false
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
        ViewExtends() {
            const tIds = this.entry.toIds
            if (!tIds || !tIds.length) return ''
            let lst = this.$root.ListClass
            const itemId = this.entry.id
            const lsCls = []
            const lstItf = []
            for (let ii = 0, cls; ii < lst.length; ii++) {
                cls = lst[ii]
                if (itemId == cls.id) continue;  // it-self
                if (!tIds.includes(cls.id)) continue;
                if (isInterface(cls.type)) lstItf.push(cls)
                else lsCls.push(cls)
            }
            return this.$root.getLsExtends(lsCls, lstItf, this.$root.PLang)
        },
        Extendable() {
            const mItem = this.entry
            if (isClass(mItem.type)) return 1
            if (isInterface(mItem.type)) return 2
            return 0
        },
        ListExtend() {                  // source search dropdown list
            const mItem = this.entry
            if (!this.Extendable) return []
            const idsTo = mItem.toIds
            if (!idsTo) return []
            let lst = []
            const itemId = mItem.id
            let lstSrc = this.$root.ListClass
            lstSrc = lstSrc.filter(src => src.id != itemId)
            lstSrc = lstSrc.filter(src => !isEnum(src.type))
            lstSrc = lstSrc.filter(src => !isStruct(src.type))
            lstSrc = lstSrc.filter(src => !src.toIds || !src.toIds.includes(itemId))
            let lsEx = []
            for (let ii = 0, src; ii < lstSrc.length; ii++) {
                src = lstSrc[ii]
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
            switch (type) {
                case 'methd body code':
                    txtC = target.value
                    break;
                case 'class name':
                case 'field acmodify':
                default: break;
            }
            switch (type) {
                case 'class name':
                    if (checkRevertHtml(mItem.Name)) return
                    mItem.Name = txtC
                    break;
                case 'field acmodify':
                    prpF = mItem.Fields[ii]
                    if (checkRevertHtml(prpF.Visible)) return
                    prpF.Visible = txtC
                    break;
                case 'field name':
                    prpF = mItem.Fields[ii]
                    if (checkRevertHtml(prpF.Name)) return
                    prpF.Name = txtC
                    break;
                case 'field type':
                    prpF = mItem.Fields[ii]
                    if (checkRevertHtml(prpF.Type)) return
                    prpF.Type = txtC
                    break;
                case 'methd access type':
                    prpF = mItem.Methods[ii]    // acc-type
                    if (checkRevertHtml(prpF[0])) return
                    prpF[0] = txtC
                    break;
                case 'methd name':
                    prpF = mItem.Methods[ii]
                    if (checkRevertHtml(prpF[1])) return
                    prpF[1] = txtC
                    break;
                case 'methd params':
                    prpF = mItem.Methods[ii]
                    if (checkRevertHtml(prpF[2])) return
                    prpF[2] = removeExtraSpaces(txtC)
                    break;
                case 'methd return type':
                    prpF = mItem.Methods[ii]
                    if (checkRevertHtml(prpF[3])) return
                    prpF[3] = txtC
                    break;
                case 'methd body code':
                    prpF = mItem.Methods[ii]    // body_code
                    prpF[5] = txtC
                    setHeight(target, target.value)
                    break;
                default: break;
            }
            function checkRevertHtml(txt) {
                if (!txtC.length) {
                    target.innerHTML = txt
                    return true
                }
                return false
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
                fld = { Visible: 'private', Name: 'fieldName', Type: 'String' }
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
            const prp = mItem.Methods[ii]
            const il = this.$root.PLang
            switch (txt) {
                case AccessInit[2][il]: // init
                    acs = this.AccessInit[2][0]
                    let a0 = prp[0].split(' ')
                    prp[0] = a0[0]
                    if (prp[3].length) prp[3] = ''
                    break;
                case AccessInit[1][il]: // set
                    prp[3] = 'void'
                    break;
                case AccessInit[0][il]: // get
                    if ('void' == prp[3]) prp[3] = 'string'
                    if (!prp[3].length) prp[3] = 'string'
                    break;
                default: break;
            }
            prp[4] = convertAccessors(acs, il)
        },
        isReturnType(acs) {
            if (typeof acs != 'string') return false;
            if (acs.includes(AccessInit[0][0])) return true
            return false
        },
        removeProperty(ii) {
            const frmCode = this.$root.DynamicVar.get('FrameCode')
            const mItem = frmCode.cItem
            if (hasnMethod(mItem)) return;
            mItem.Methods.splice(ii, 1)
        },
        onInput(e, type, ii) {
            const target = e.target
            switch (type) {
                case 'methd body code':
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
        pasteTxtArea(e, ii) {
            const frmCode = this.$root.DynamicVar.get('FrameCode')
            const mItem = frmCode.cItem
            const target = e.target
            let txt = target.value
            let prpF = mItem.Methods[ii]
            prpF[5] = txt
            setTimeout(() => {
                setHeight(target, txt)
            }, 111)
        },
        addProperty() {
            const frmCode = this.$root.DynamicVar.get('FrameCode')
            const mItem = frmCode.cItem
            if (hasnMethod(mItem)) {
                mItem.Methods = [
                    ['public', PropName, '', 'void', AccessInit[1][0], '']
                ]
            } else {
                if (mItem.Methods.find(x => PropName == x[1])) return;
                mItem.Methods.push(['public', PropName, '', 'void', AccessInit[1][0], ''])
            }
        },
        onCloseEdit() {
            this.$root.DynamicVar.delete('FrameCode')
            this.$root.NewClassName = null
        },
        onSaveChange() {
            const root = this.$root
            const frmCode = root.DynamicVar.get('FrameCode')
            const mItem = frmCode.cItem
            const lstCls = root.ListClass;
            if (typeof mItem.id != 'number') {
                let nItem = onNewItem.call(this, mItem)
                root.NewClassName = null
                this.onCloseEdit()
                if (nItem) {
                    root.buildMapPoints(nItem)                // new item
                    root.buildAssociation()               // new item
                    if (nItem.toIds && nItem.toIds.length) {
                        root.updateSizeCanvas()               // new item
                        root.$nextTick(root.drawInCnvs) // new item

                    }
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

            root.MpPoints.clear()
            item.Name = name
            item.toIds = mItem.toIds
            verifySave(mItem, root.PLang, true)

            item.Fields = mItem.Fields
            item.Methods = mItem.Methods

            for (let ii = lstCls.length - 1; -1 < ii; ii--) {
                root.buildMapPoints(lstCls[ii])      // save change
            }
            root.buildAssociation()             // save change
            this.onCloseEdit()
            root.$nextTick(root.updateSizeCanvas) // save change
            root.$nextTick(root.drawInCnvs) // save change

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
                nItem = verifyNewItem.call(this, nItem)
                verifySave(nItem, this.$root.PLang, true)
                if (!lstCls.length) nItem.id = 1
                lstCls.push(nItem)
                return nItem
                function verifyNewItem(item) {
                    let newName = item.Name
                    if (!newName.length) return item
                    const maxId = Math.max(...lstCls.map(x => x.id))
                    let lstNo = lstCls.map(x => x.Name)
                    if (lstNo.includes(newName)) {
                        let index = 1
                        newName = `${item.Name}${index}`
                        while (lstNo.includes(newName)) {
                            index += 1
                            newName = `${item.Name}${index}`
                        }
                    }
                    item.Name = newName
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
            this.$root.DynamicVar.set('Drop-Search', this)
        },
        hideDrpSearch() {
            this.IsDrpExtend = false
            this.$root.DynamicVar.delete('Drop-Search')
        },
    },
    beforeUnmount() {
        this.$root.DynamicVar.delete('Drop-Search')
    },
}

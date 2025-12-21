<template>
    <div class="mformedit" style="z-index: 3;display: grid; grid-template-rows: 38px auto;">
        <div class="fhead" style="margin-bottom: 12px; display: flex;align-items: center;position: relative;">
            <menu-list v-if="IsSelectTyp" :value="TxtType" :isfix="true" :sources="StrucTypes"
                @change:value="$e => changeTypeObject($e)">
            </menu-list>
            <span v-else>{{ TxtType }}</span>
            <span class="p36 ceditable" contenteditable="true" data-placeholder="NameOfClass"
                @blur="e => onBlurEditable(e, 'class name')" style="min-width: 75px;"
                @keypress="e => $root.preventKeyPress(e, [13, 32])" v-html="entry.Name"></span>
            <i v-for="exv in ViewExtends">{{ exv[0] }}&nbsp;{{ exv[1] }}&nbsp;</i>
            <drplst-search v-if="IsDrpExtend" :sources="ListExtend" :ids="entry.toIds" :type="entry.TypeDeclaration"
                @select:id="$e => addExtend($e)" @remove:id="$e => removeExtend($e)"
                @on:exit="$e => hideDrpSearch()"></drplst-search>
            <i v-else-if="Extendable && ListExtend.length" @click.stop="showDrpSearch" class="bi bi-code-square"
                style="margin-left: 6px;"></i>
            <i class="btnsave bi bi-floppy cpoint" @click.stop="onSaveChange" style="right: 30px; top: -4px;"></i>
            <i class="btnexit bi bi-x-lg cpoint" @click.stop="onCloseEdit" style="right: -4px; top: -4px;"></i>
        </div>
        <div class="fbody">
            <div v-if="Extendable != 2">
                <div v-for="(field, ii) in entry.Fields" :key="'oldfield_' + field.AccessModify"
                    style="margin-bottom: 2px; display: flex;align-items: center;">
                    <span v-if="HasPropers" @keypress="e => $root.preventKeyPress(e, [13])"
                        @blur="e => onBlurEditable(e, 'field acmodify', ii)" data-placeholder="AccessoriOfField"
                        contenteditable="true" class="p36 ceditable">{{ field.AccessModify }}</span>
                    <span @keypress="e => $root.preventKeyPress(e, [13, 32])"
                        @blur="e => onBlurEditable(e, 'field name', ii)" data-placeholder="NameOfField"
                        class="p36 ceditable" contenteditable="true">{{ field.Name }}</span>
                    <span v-if="HasPropers" @keypress="e => $root.preventKeyPress(e, [13])"
                        @blur="e => onBlurEditable(e, 'field type', ii)" data-placeholder="TypeOfField"
                        class="p36 ceditable" contenteditable="true">{{ field.DataType }}</span>
                    <span style="margin-left: 12px;cursor: pointer;" @click.stop="e => removeField(ii)"><i
                            class="bi bi-trash3"></i></span>
                </div>
                <span v-if="2 != Extendable" style="cursor: pointer;display: inline-block;" @click.stop="addField">[new
                    Field]</span>
            </div>
            <div v-for="(prp, ii) in entry.Properties" :key="ii" style="margin-bottom: 2px;"
                :style="[0 == ii ? { marginTop: '10px' } : null]">
                <div v-if="HasPropers" style="display: flex;align-items: center;">
                    <span class="p36 ceditable" @keypress="e => $root.preventKeyPress(e, [13])"
                        @blur="e => onBlurEditable(e, 'methd access type', ii)" data-placeholder="MethodAccessType"
                        contenteditable="true">{{ prp.AccessModify }}</span>
                    <menu-list :value="prp.specialMe" :isfix="true" :sources="AccessInit.map(x => x[$root.PLang])"
                        @change:value="$event => changeAccessor(ii, $event)">
                    </menu-list>
                    <span @keypress="e => $root.preventKeyPress(e, [13, 32])"
                        @blur="e => onBlurEditable(e, 'methd name', ii)" class="p36 ceditable" contenteditable="true"
                        data-placeholder="NameOfMethod" v-html="prp.Name"></span>
                    (<span @keypress="e => $root.preventKeyPress(e, [13])"
                        @blur="e => onBlurEditable(e, 'methd params', ii)" class="p3-0 ceditable" contenteditable="true"
                        data-placeholder="type name, ...">{{prp.params.map(x => x[1] + ' ' + x[0]).join(', ')}}</span>)
                    <span v-if="isReturnType(prp.specialMe)" style="padding-left: 3px;"><i>return</i>
                        <span @blur="e => onBlurEditable(e, 'methd return type', ii)"
                            @keypress="e => $root.preventKeyPress(e, [13, 32])" data-placeholder="return type"
                            contenteditable="true" class="p36 ceditable">{{ prp.DataType }}</span>
                    </span>
                    <span style="margin-left: 12px;cursor: pointer;" @click.stop="e => removeProperty(ii)"><i
                            class="bi bi-trash3"></i></span>
                </div>
                <textarea v-if="HasCode" class="objedit-vwcode"
                    style="width: 100%; min-height: 90px;border-radius: 6px;border: none;"
                    placeholder="ContentCodeOfMethod" @paste="e => pasteTxtArea(e, ii)" @keyup.enter="keyUpTxtArea"
                    @keyup.delete="keyUpTxtArea" @blur="e => onBlurEditable(e, 'methd body code', ii)"
                    @change="e => onInput(e, 'methd body code', ii)">{{ prp.FuncBody }}</textarea>
            </div>
            <div v-if="HasPropers" style="cursor: pointer;display: inline-block;" @click.stop="addProperty">[new
                Property]
            </div>
        </div>
    </div>
</template>
<script>
import {
    StructTypes, AccessInit, setHeight, objNewCls,
    clearSpace, convertAccessors, PropName, hasnMethod, removeExtraSpaces,
} from "./common.js";
import { isAbstract, isInterface, isClass, isEnum, isStruct, filterItems, mapItems } from './Appmixin.js';
import MenuList from './Menulist.vue';
import PopDropdownSearch from './Dropdownsearch.vue';
export default {
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
            if (isClass(mItem.TypeDeclaration)) return true
            if (isAbstract(mItem.TypeDeclaration)) return true
            return false
        },
        TxtType() {
            const type = this.entry.TypeDeclaration
            if (typeof type != 'string') return
            const ii = this.$root.PLang
            if (StructTypes[1][0] == type) return StructTypes[1][ii]
            if (isClass(type)) return StructTypes[2][ii]
            return type
        },
        HasCode() {
            const type = this.entry.TypeDeclaration
            if (isClass(type)) return true
            if (isAbstract(type)) return true
            return false
        },
        HasPropers() {
            const type = this.entry.TypeDeclaration
            if (isClass(type)) return true
            if (isAbstract(type)) return true
            if (isInterface(type)) return true
            if (isStruct(type)) return true
            return false
        },
        StrucTypes() {
            const root = this.$root
            let lst = StructTypes
            const mItem = this.entry
            if (typeof mItem.id != 'number') return lst.map(x => x[root.PLang])
            lst = lst.filter(x => isClass(x[0]) || isInterface(x[0]))
            return lst.map(x => x[root.PLang])
        },
        ViewExtends() {
            const root = this.$root
            const tIds = this.entry.toIds
            if (!tIds || !tIds.length) return ''
            const itemId = this.entry.id
            const lsCls = []
            const lstItf = []
            for (let [id, cls] of root.MpClass) {
                if (itemId == id) continue;  // it-self
                if (!tIds.includes(id)) continue;
                if (isInterface(cls.TypeDeclaration)) lstItf.push(cls)
                else lsCls.push(cls)
            }
            return root.getLsExtends(lsCls, lstItf, root.PLang)
        },
        Extendable() {
            const type = this.entry.TypeDeclaration
            if (isClass(type)) return 1
            if (isInterface(type)) return 2
            return 0
        },
        ListExtend() {                  // source search dropdown list
            const mItem = this.entry
            if (!this.Extendable) return []
            const idsTo = mItem.toIds
            if (!idsTo) return []
            let lst = []
            const itemId = mItem.id
            const mType = mItem.TypeDeclaration
            let lstSrc = this.$root.MpClass
            lstSrc = filterItems(lstSrc, (src) => src.id != itemId && !isEnum(src.TypeDeclaration) && !isStruct(src.TypeDeclaration), 'set')
            if ('cls-classname' != itemId) lstSrc = filterItems(lstSrc, (src) => !src.toIds || !src.toIds.includes(itemId), 'set')

            let lsEx = new Set()
            for (let src of lstSrc) {
                if (idsTo.includes(src.id) && isClass(src.TypeDeclaration))
                    lsEx.add(src.id)
                lst.push(src)
            }
            if (isAbstract(mType)) {
                if (lsEx.size) {
                    for (let ii = lst.length - 1, src; -1 < ii; ii--) {
                        src = lst[ii]
                        if (isInterface(src.TypeDeclaration)) continue
                        if (isAbstract(src.TypeDeclaration) && lsEx.has(src.id)) {
                            continue
                        }
                        lst.splice(ii, 1)
                    }
                }
                for (let ii = lst.length - 1, src; -1 < ii; ii--) {
                    src = lst[ii]
                    if (isAbstract(src.TypeDeclaration)) continue
                    if (isInterface(src.TypeDeclaration)) continue
                    lst.splice(ii, 1)
                }
                return lst
            }
            if (isClass(mType)) {
                if (lsEx.size) {
                    for (let ii = lst.length - 1, src; -1 < ii; ii--) {
                        src = lst[ii]
                        if (lsEx.has(src.id)) continue
                        if (isClass(src.TypeDeclaration)) lst.splice(ii, 1)
                    }
                }
                return lst
            }
            if (isInterface(mType)) {
                for (let ii = lst.length - 1, src; -1 < ii; ii--) {
                    src = lst[ii]
                    if (isInterface(src.TypeDeclaration)) continue
                    lst.splice(ii, 1)
                }
                return lst
            }
        },
    },
    methods: {
        changeTypeObject(val) {
            const frmCode = this.$root.DynamicVar.get('FrameCode')
            const mItem = frmCode.cItem
            const ii = this.$root.PLang
            switch (val) {
                case StructTypes[0][ii]: setType(StructTypes[0][0])
                    break;
                case StructTypes[1][ii]: setType(StructTypes[1][0])
                    break;
                case StructTypes[2][ii]: setType(StructTypes[2][0])
                    break;
                case StructTypes[3][ii]: setType(StructTypes[3][0])
                    break;
                default: return;
            }
            function setType(type) { mItem.TypeDeclaration = type }
        },
        onBlurEditable(e, type, ii) {
            const frmCode = this.$root.DynamicVar.get('FrameCode')
            const mItem = frmCode.cItem
            const target = e.target
            let prpF
            let txtC = target.textContent
            txtC = txtC.trim()
            switch (type) {
                case 'methd body code': txtC = target.value
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
                    if (checkRevertHtml(prpF.AccessModify)) return
                    prpF.AccessModify = txtC
                    break;
                case 'field name':
                    prpF = mItem.Fields[ii]
                    if (checkRevertHtml(prpF.Name)) return
                    prpF.Name = txtC
                    break;
                case 'field type':
                    prpF = mItem.Fields[ii]
                    if (checkRevertHtml(prpF.DataType)) return
                    prpF.DataType = txtC
                    break;
                case 'methd access type':
                    prpF = mItem.Properties[ii]    // acc-type
                    if (checkRevertHtml(prpF.AccessModify)) return
                    prpF.AccessModify = txtC
                    break;
                case 'methd name':
                    prpF = mItem.Properties[ii]
                    if (checkRevertHtml(prpF.Name)) return
                    prpF.Name = txtC
                    break;
                case 'methd params':
                    prpF = mItem.Properties[ii];
                    let params = txtC.split(',').filter(x => !!x)
                    params = params.map(x => removeExtraSpaces(x))
                    params = params.map(x => x.split(' ').filter(t => !!t))
                    prpF.params = params.map(x => [x[1], x[0]])
                    break;
                case 'methd return type':
                    prpF = mItem.Properties[ii]
                    if (checkRevertHtml(prpF.DataType)) return
                    prpF.DataType = txtC
                    break;
                case 'methd body code':
                    prpF = mItem.Properties[ii]    // body_code
                    prpF.FuncBody = txtC
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
            let fld = { Name: 'fieldName', DataType: '', AccessModify: 'private' }
            if (this.HasPropers) fld.DataType = 'string'
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
                case AccessInit[1][il]: // set
                    prp.DataType = 'void'
                    break;
                case AccessInit[0][il]: // get
                    if (!prp.DataType || 'void' == prp.DataType) prp.DataType = 'string'
                    break;
                default: break;
            }
            prp.specialMe = convertAccessors(acs, il)
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
            mItem.Properties.splice(ii, 1)
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
            let prpF = mItem.Properties[ii]
            prpF[5] = txt
            setTimeout(() => {
                setHeight(target, txt)
            }, 111)
        },
        addProperty() {
            const frmCode = this.$root.DynamicVar.get('FrameCode')
            const mItem = frmCode.cItem
            if (!mItem.Properties) mItem.Properties = []
            if (mItem.Properties.find(x => PropName == x.Name)) return;
            mItem.Properties.push({ Name: '', params: [['a', 'int']], DataType: 'void', FuncBody: '', specialMe: 'set', AccessModify: 'public' },)
        },
        onCloseEdit() {
            const root = this.$root
            root.DynamicVar.delete('FrameCode')
            root.NewClassName = null
        },
        onSaveChange() {
            const root = this.$root
            const frmCode = root.DynamicVar.get('FrameCode')
            const mItem = frmCode.cItem
            let mapCls = root.MpClass;
            if (typeof mItem.id != 'number') {
                onNewItem.call(this, mItem)
                root.NewClassName = null
                this.onCloseEdit()
                root.MpClass = mapCls
                return
            }
            const item = frmCode.item
            item.TypeDeclaration = mItem.TypeDeclaration
            let name = mItem.Name
            name = clearSpace(name, item.Name)
            if (!name.length) {
                this.onCloseEdit()
                return
            }
            item.Name = name
            item.toIds = mItem.toIds.filter(id => !isNaN(id))

            item.Fields = verifyField(mItem.Fields)
            item.Properties = verifyProp(mItem.Properties)

            this.onCloseEdit()
            root.MpClass = new Map(mapCls)    // new ref

            function onNewItem(newItem) {
                const maxId = Math.max(...mapItems(mapCls, x => x.id))
                let nItem = objNewCls(newItem)
                if (!nItem) {
                    root.NewClassName = null
                    return;
                }
                if (!nItem.Name.length) {
                    root.NewClassName = null
                    return;
                }
                nItem = verifyNewItem.call(this, nItem)
                if (!mapCls.size) nItem.id = 1
                nItem.Fields = verifyField(nItem.Fields)
                nItem.Properties = verifyProp(nItem.Properties)
                mapCls.set(nItem.id, nItem)
                mapCls = new Map(mapCls)    // new ref
                return nItem
                function verifyNewItem(item) {
                    let newName = item.Name
                    if (!newName.length) return item

                    let lstNo = mapItems(mapCls, x => x.Name)
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
            function verifyField(f) { return f.filter(x => !!x.Name && 'fieldName' != x.Name) }
            function verifyProp(p) { return p.filter(x => !!x.Name) }
        },
        addExtend(id) {
            if (!id) return
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
        pressEscKey(e) { if ('Escape' == e.key) this.onCloseEdit(e) },
    },
    mounted() { window.addEventListener('keyup', this.pressEscKey) },
    beforeUnmount() {
        window.removeEventListener('keyup', this.pressEscKey)
        this.$root.DynamicVar.delete('Drop-Search')
    },
}
</script>
<style>
.mformedit {
    scrollbar-width: thin;
}

.btnsave,
.btnexit {
    width: 24px;
    height: 20px;
    display: inline-block;
    text-align: center;
    background-color: white;
    position: absolute;
    border-radius: 6px;
    padding-top: 4px;
}

.mformedit {
    min-width: calc(100vw / 3);
    max-width: calc(100vw - 60px);
    min-height: 320px;
    max-height: calc(100vh - 30px);
    display: inline-block;
    padding: 9px;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
    border-radius: 10px;
    position: fixed;
    overflow-y: hidden;
    background-color: #e5e5e5;
    top: 50%;
    left: 50%;
}
</style>
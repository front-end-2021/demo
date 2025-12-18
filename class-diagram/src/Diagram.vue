<script>
import { objNewCls, truncateIds, } from "./common.js";
import { isAbstract, isInterface, isClass, isEnum, isStruct } from './Appmixin.js';
import WrapRect from './Rectwrap.vue';
import MenuList from './Menulist.vue';
function verifyName(name, lstNo) {
    let vName = name
    let nms = lstNo.filter(x => vName === x)
    if (nms.length < 2) return vName
    let index = 1
    vName = `${name}${index}`
    while (lstNo.includes(vName)) {
        index += 1
        vName = `${name}${index}`
    }
    return vName
}
export default {
    name: "View_Diagram",
    display: "View.Diagram",
    components: {
        'rect-wrap': WrapRect,
        'menu-list': MenuList,
    },
    //inject: [''], props: [''],
    //data() { return {} },
    methods: {
        exportDiagram() {
            const root = this.$root
            let lstCls = []
            for (let [id, cls] of root.MpClass) {
                lstCls.push([
                    id, cls.Name, cls.TypeDeclaration, cls.AccessModify,
                    cls.Fields.map(f => [f.Name, f.DataType, f.AccessModify]),
                    cls.Properties.map(p => [
                        p.Name, p.params, p.DataType, p.FuncBody, p.specialMe, p.AccessModify
                    ]), cls.top, cls.left, cls.width, cls.height, cls.toIds
                ])
            }
            let Name = root.DiagName
            let entry = {
                Name,
                Classes: lstCls,
            }
            let name = Name.replaceAll(' ', '-')
            let target = document.getElementById('dnb-vw-main')
            html2canvas(target).then(canvas => {
                const zip = new JSZip();
                canvas.toBlob(function (data) {
                    zip.file(`${name}.txt`, JSON.stringify(entry));
                    zip.file(`${name}.jpg`, data);
                    zip.generateAsync({ type: "blob" }).then(function (content) {
                        saveAs(content, `${name}.zip`);
                    })
                })
            })
        },
        importDiagram(event) {
            const file = event.target.files[0];
            const root = this.$root
            root.clearDyVar()
            // Validate file existence and type
            if (!file) {
                showMessage("No file selected. Please choose a file.", "error");
                return;
            }
            if (!file.type.startsWith("text")) {
                showMessage("Unsupported file type. Please select a text file.", "error");
                return;
            }
            // Read the file
            const reader = new FileReader();
            reader.onload = () => {
                const txt = reader.result;
                let entry = JSON.parse(txt)
                root.DiagName = entry.Name
                const mapCls = new Map()
                for (let cls of entry.Classes) {
                    let [id, Name, TypeDeclaration, AccessModify, fields, props,
                        top, left, width, height, toIds] = cls
                    let Fields = fields.map(f => {
                        return { Name: f[0], DataType: f[1], AccessModify: f[2] }
                    })
                    let Properties = props.map(p => {
                        return {
                            Name: p[0], params: p[1], DataType: p[2],
                            FuncBody: p[3], specialMe: p[4], AccessModify: p[5]
                        }
                    })
                    mapCls.set(id, {
                        id, Name, TypeDeclaration, AccessModify, Fields,
                        Properties, top, left, width, height, toIds
                    })
                }
                root.MpClass = mapCls
                root.MpPoints.clear()
                for (let [id, cls] of mapCls) root.buildMapPoints(cls)   // import

                root.buildAssociation()        // import
                root.updateSizeCanvas()          // import
                root.$nextTick(root.drawInCnvs) // import
                event.target.value = ''
            };
            reader.onerror = () => {
                showMessage("Error reading the file. Please try again.", "error");
            };
            reader.readAsText(file);
            function showMessage(txt) { alert(txt) }
        },
        msDwnClssName(event) {
            const root = this.$root
            const dmVar = root.DynamicVar
            if (dmVar.has('DragElm')) return;
            if (dmVar.has('FrameCode')) return;
            dmVar.delete('FViewCode')
            let wrp = document.body.querySelector(`#dnb-vw-main`)
            if (!wrp) return
            document.addEventListener('keydown', root.disableSrollDown)
            const off = this.$el.querySelector('#cls-sample').getBoundingClientRect()
            let left = off.left
            let top = off.top
            const id = 'cls-classname'
            const tpNwItem = objNewCls(null, id, top, left)
            root.NewClassName = tpNwItem

            root.DynamicVar.set('DragElm', {
                Item: tpNwItem,
                offX: left - event.clientX,
                offY: top - event.clientY
            })
            this.$nextTick(() => {
                const itemEl = wrp.querySelector(`#cls_${id}`)
                itemEl.style.zIndex = '1'
                itemEl.style.backgroundColor = 'white'
            })
        },
        changeLanguage(val) {
            const root = this.$root
            root.closePopupForm()
            const langs = root.Langs
            for (let ii = 0; ii < langs.length; ii++) {
                if (langs[ii] == val) {
                    root.PLang = ii
                    root.updateSizeCanvas()         // change lang
                    root.$nextTick(root.drawInCnvs) // change lang
                    break;
                }
            }
        },
        newDiagram() {
            const root = this.$root
            root.MpClass = new Map()
            root.MpPoints.clear()
            root.DiagName = 'New Diagram'
            root.clearDyVar()
            root.drawInCnvs()
        },
    },
    computed: {
        VwHeight() { return `calc(100vh - 18px - ${this.$root.MinY}px)` },
    },
    //beforeUpdate() { },
    updated() {
        const root = this.$root
        root.drawInCnvs()
    },
}
</script>
<template>
    <div style="display: flex;" :minx="$root.MinX" :maxx="$root.MaxX" :miny="$root.MinY" :maxy="$root.MaxY">
        <aside id="dnb-vwtab-left" :style="[{ width: $root.MinX + 'px' }]">
            <div>
                <menu-list :value="$root.Langs[$root.PLang]" :isfix="true" :sources="$root.Langs"
                    @change:value="$e => changeLanguage($e)">
                </menu-list>
            </div>
            <div style="display: inline-block;border: 1px solid rgb(0, 0, 0);
                width: calc(100% - 10px);cursor: default;border-radius: 4px;" @mousedown="msDwnClssName"
                id="cls-sample">
                <div style="font-size: 16px;font-weight: bold;text-align: center;
                    border-bottom: 1px solid black;">ClassName</div>
                <div style="font-size: 14px; font-weight: 300;border-bottom: 1px solid black;">
                    <div>&nbsp;List Fields</div>
                </div>
                <div style="font-size: 12px;font-weight: 100;">
                    <div>&nbsp;List Property</div>
                </div>
            </div>
            <div style="display: inline-flex; width: 108px; height: 28px;
                background-color: rgb(77, 107, 254); align-items: center; justify-content: center;
                color: white; border-radius: 6px;cursor: pointer;" @click.stop="newDiagram">New Diagram
            </div>
            <div style="display: inline-flex; width: 108px; height: 28px;
                background-color: rgb(77, 107, 254); align-items: center; justify-content: center;
                color: white; border-radius: 6px; cursor: pointer;" @click.stop="exportDiagram">Save data
            </div>
            <div style="display: grid; width: 108px; height: 28px;
                    background-color: rgb(77, 107, 254); align-items: center; justify-content: center;
                color: white; border-radius: 6px; cursor: pointer; grid-template-columns: auto 0;">
                <label for="file-import" style="cursor: pointer;">Import data</label>
                <input type="file" id="file-import" style="opacity: 0;" accept=".txt" @change="importDiagram" />
            </div>
        </aside>
        <article id="dnb-vw-main" style="position: relative; border:1px solid #dedede; overflow: auto;
                width:calc(100vw - 32px);scrollbar-width: thin;" :style="{ height: VwHeight }">
            <canvas id="dnb-mcanvas" width="780" height="870">
                Your browser does not support the HTML canvas tag.
            </canvas>
            <div id="dnb-vwdiagrams" style="position: absolute;top: 0;left: 0; height: 870px;"
                :style="[{ width: ($root.MaxX - $root.MinX) + 'px' }]">
                <rect-wrap v-for="[id, wItm] in $root.MpClass" :item="wItm"
                    :key="'id=' + wItm.id + ',type=' + wItm.TypeDeclaration"></rect-wrap>
                <rect-wrap v-if="$root.NewClassName != null" :item="$root.NewClassName"
                    :key="'id=' + $root.NewClassName.id"></rect-wrap>
            </div>
            <div v-if="$root.ViewCode" id="dnb-viewcode" style="min-width: 360px; min-height: 250px; box-sizing: border-box;
                        position: fixed; left: calc(249px + 220px); top: calc(39px - 12px);
                        max-height: calc(100vh - 69px); overflow: auto; 
                        border-radius: 10px; background-color: #cde5f9; padding: 10px;" :style="[{
                            top: $root.ViewCode.top + 'px', left: $root.ViewCode.left + 'px',
                        }]">
                <pre style="margin-top: 10px;"><code class="language-csharp" v-html="$root.ViewCode.html"></code></pre>
                <i class="bi bi-x-lg cpoint" style="width: 24px;height: 20px;display: inline-block;text-align: center;
                        background-color: white; border-radius: 6px;padding-top: 4px;
                        position: absolute;right: 3px;top: 2px;"
                    @click.stop="e => { $root.DynamicVar.delete('FViewCode') }"></i>
            </div>
        </article>
    </div>
</template>

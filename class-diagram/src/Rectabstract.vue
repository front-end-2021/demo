<script>
import { MxRect, MxOjClass } from './Appmixin.js';
import CommonClss from './CommonClss.vue';
export default {
    name: "Rect_Abstract",
    display: "Rect.Abstract",
    mixins: [CommonClss, MxRect, MxOjClass],
    computed: {
        ClassName() { return `abstract ${this.item.Name}` },
    },
    methods: {
          getCsFormat(prp) {
            let txt = this.getAcModf(prp)
            if (!prp.specialMe) return `${txt};\n`
            return `${txt} {...}`
        },
    },
}
</script>
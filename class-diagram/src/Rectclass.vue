<script>
import { MxRect, MxOjClass } from './Appmixin.js';
import CommonClss from './CommonClss.vue';
export default {
    name: "Rect_Insclass",
    display: "Rect.Insclass",
    mixins: [CommonClss, MxRect, MxOjClass],
    methods: {
        getCsFormat(prp) { return `${this.getAcModf(prp)} {...}` },
    },
}
</script>
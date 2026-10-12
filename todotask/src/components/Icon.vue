<script setup>
// Icon lấy từ Bootstrap Icons (https://icons.getbootstrap.com/), nhúng trực tiếp dạng SVG.
// Muốn thêm icon: import file svg tương ứng rồi khai báo vào `icons`.
import check2Square from 'bootstrap-icons/icons/check2-square.svg?raw'
import grid from 'bootstrap-icons/icons/grid-1x2.svg?raw'
import chat from 'bootstrap-icons/icons/chat-dots.svg?raw'
import newspaper from 'bootstrap-icons/icons/newspaper.svg?raw'
import checklist from 'bootstrap-icons/icons/card-checklist.svg?raw'
import gear from 'bootstrap-icons/icons/gear.svg?raw'
import clock from 'bootstrap-icons/icons/clock.svg?raw'
import fileText from 'bootstrap-icons/icons/file-earmark-text.svg?raw'
import listTask from 'bootstrap-icons/icons/list-task.svg?raw'
import calendar from 'bootstrap-icons/icons/calendar3.svg?raw'
import people from 'bootstrap-icons/icons/people.svg?raw'
import search from 'bootstrap-icons/icons/search.svg?raw'
import plus from 'bootstrap-icons/icons/plus-lg.svg?raw'
import chevronDown from 'bootstrap-icons/icons/chevron-down.svg?raw'
import dots from 'bootstrap-icons/icons/three-dots.svg?raw'
import personPlus from 'bootstrap-icons/icons/person-plus.svg?raw'
import x from 'bootstrap-icons/icons/x-lg.svg?raw'
import arrowRight from 'bootstrap-icons/icons/arrow-right.svg?raw'
import trash from 'bootstrap-icons/icons/trash3.svg?raw'
import paperclip from 'bootstrap-icons/icons/paperclip.svg?raw'
import check from 'bootstrap-icons/icons/check-lg.svg?raw'
import checkCircle from 'bootstrap-icons/icons/check2-circle.svg?raw'
import history from 'bootstrap-icons/icons/clock-history.svg?raw'
import plusCircle from 'bootstrap-icons/icons/plus-circle.svg?raw'
import pencil from 'bootstrap-icons/icons/pencil.svg?raw'
import pencilSquare from 'bootstrap-icons/icons/pencil-square.svg?raw'
import textLeft from 'bootstrap-icons/icons/text-left.svg?raw'
import flag from 'bootstrap-icons/icons/flag.svg?raw'
import swap from 'bootstrap-icons/icons/arrow-left-right.svg?raw'
import person from 'bootstrap-icons/icons/person.svg?raw'
import calendarEvent from 'bootstrap-icons/icons/calendar-event.svg?raw'
import undo from 'bootstrap-icons/icons/arrow-counterclockwise.svg?raw'
import listCheck from 'bootstrap-icons/icons/list-check.svg?raw'
import filePlus from 'bootstrap-icons/icons/file-earmark-plus.svg?raw'
import fileX from 'bootstrap-icons/icons/file-earmark-x.svg?raw'
import diagram from 'bootstrap-icons/icons/diagram-3.svg?raw'
import codeSlash from 'bootstrap-icons/icons/code-slash.svg?raw'
import zoomIn from 'bootstrap-icons/icons/zoom-in.svg?raw'
import zoomOut from 'bootstrap-icons/icons/zoom-out.svg?raw'
import fit from 'bootstrap-icons/icons/arrows-angle-contract.svg?raw'
import magic from 'bootstrap-icons/icons/magic.svg?raw'

const icons = {
  'check-square': check2Square,
  grid,
  chat,
  newspaper,
  checklist,
  gear,
  clock,
  'file-text': fileText,
  'list-task': listTask,
  calendar,
  people,
  search,
  plus,
  'chevron-down': chevronDown,
  dots,
  'person-plus': personPlus,
  x,
  'arrow-right': arrowRight,
  trash,
  paperclip,
  check,
  'check-circle': checkCircle,
  history,
  'plus-circle': plusCircle,
  pencil,
  'pencil-square': pencilSquare,
  'text-left': textLeft,
  flag,
  'arrow-left-right': swap,
  person,
  'calendar-event': calendarEvent,
  undo,
  'list-check': listCheck,
  'file-plus': filePlus,
  'file-x': fileX,
  diagram,
  'code-slash': codeSlash,
  'zoom-in': zoomIn,
  'zoom-out': zoomOut,
  fit,
  magic,
}

defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 18 },
})
</script>

<template>
  <span
    class="icon"
    :style="{ width: size + 'px', height: size + 'px' }"
    aria-hidden="true"
    v-html="icons[name] || ''"
  />
</template>

<style scoped>
.icon {
  display: inline-flex;
  flex: none;
  line-height: 0;
}
.icon :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
  fill: currentColor;
}
</style>

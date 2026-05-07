<template>
  <div class="e" ref="el" contenteditable="true" 
	@beforeinput="onBeforeInput" @paste="onPaste" 
    @input="onInput" @blur="onBlur" @keyup="onKeyup"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ETYPE } from "../constants";
const emit = defineEmits(["mchange"]);
const el = ref(null);
const props = defineProps({
  txt: { type: [String, Number], default: null },
  type: { type: String, required: true, default: ETYPE.NUMBER }
})

// Helper: đặt caret về cuối
function setCaretToEnd(element) {
  const range = document.createRange();
  const sel = window.getSelection();

  range.selectNodeContents(element);
  range.collapse(false);

  sel.removeAllRanges();
  sel.addRange(range);
}

// Helper: insert text tại caret (KHÔNG dùng execCommand)
function insertTextAtCursor(text) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  const range = sel.getRangeAt(0);
  range.deleteContents();

  const textNode = document.createTextNode(text);
  range.insertNode(textNode);

  // move caret sau text vừa insert
  range.setStartAfter(textNode);
  range.setEndAfter(textNode);

  sel.removeAllRanges();
  sel.addRange(range);
}

// 1. Chặn ký tự không hợp lệ
function onBeforeInput(e) {
  const text = e.data;
  if (!text) return; // allow delete, backspace, etc.
  if (ETYPE.NUMBER == props.type && !/^\d+$/.test(text)) {
    e.preventDefault();
  }
}

function onPaste(e) {
  e.preventDefault();
  const paste = (e.clipboardData || window.clipboardData).getData("text");
  let clean = paste
  if(ETYPE.NUMBER == props.type) { clean = paste.replace(/\D/g, "") }

  insertTextAtCursor(clean);
}

// 3. Fallback sanitize 
function onInput() {
    if (ETYPE.NUMBER == props.type) {

    }
    const element = el.value;
    let cleaned = element.textContent
    if (ETYPE.NUMBER == props.type) { cleaned = element.textContent.replace(/\D/g, "") }

    if (element.textContent !== cleaned) {
        element.textContent = cleaned;
        setCaretToEnd(element);
    }
}
function onBlur() {
    const element = el.value;
    let cleaned = element.textContent
    if (ETYPE.NUMBER == props.type) {
        cleaned = cleaned ? parseFloat(cleaned) : 0
    }
    emit("mchange", cleaned);
}
function onKeyup(e) {
  if (ETYPE.NUMBER == props.type) {
    if("Tab" == e.key) {
        e.preventDefault();
        return;
    }
    if("Enter" == e.key) {
        e.preventDefault();
        el.value.blur();
    }
  }
}
onMounted(() => { el.value.textContent = props.txt || '' });
</script>

<style scoped>
.e { display: inline-block; }
</style>
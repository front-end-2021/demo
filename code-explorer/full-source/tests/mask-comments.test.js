import test from 'node:test'
import assert from 'node:assert/strict'
import { maskComments, stripComments } from '../src/core/mask-comments.js'

test('maskComments giữ nguyên độ dài và mọi dấu xuống dòng', () => {
  const src = 'a // c1\nb /* x\ny */ c\n"//keep" d'
  const out = maskComments(src)
  assert.equal(out.length, src.length)
  assert.deepEqual([...out].map((c) => c === '\n'), [...src].map((c) => c === '\n'))
  assert.equal(out, 'a      \nb     \n     c\n"//keep" d')
})

test('maskComments: maskStrings che ruột chuỗi nhưng giữ dấu nháy', () => {
  assert.equal(maskComments('x = "abc" // hi', { maskStrings: true }), 'x = "   "      ')
  assert.equal(maskComments('x = "abc"'), 'x = "abc"')
})

test('maskComments kiểu python: # và docstring bị che, chuỗi thường được giữ', () => {
  const src = 'def f():\n    """doc"""\n    return "a" # c\n'
  assert.equal(maskComments(src, { style: 'python' }), 'def f():\n             \n    return "a"    \n')
})

test('stripComments (C#): xoá comment, giữ nguyên chuỗi chứa //', () => {
  const out = stripComments('var s = "http://a"; // c\n/* x */\nvar t = 1;\n', 'cs')
  assert.equal(out, 'var s = "http://a";\nvar t = 1;\n')
})

test('stripComments (C#): chuỗi verbatim @"…" và raw string không bị cắt nhầm', () => {
  const src = 'var p = @"C:\\dir\\"; // c\nvar r = """a // not a comment""";\n'
  assert.equal(stripComments(src, 'cs'), 'var p = @"C:\\dir\\";\nvar r = """a // not a comment""";\n')
})

test('stripComments (JS): regex literal không làm hỏng việc quét', () => {
  const out = stripComments('const r = /\\/\\/x"/; // c\nconst a = 1\n', 'js')
  assert.equal(out, 'const r = /\\/\\/x"/;\nconst a = 1\n')
})

test('stripComments (Python): docstring bị xoá, đổi CRLF → LF', () => {
  const out = stripComments('def f():\r\n    """doc"""\r\n    return 1\r\n', 'py')
  assert.ok(!out.includes('doc') && !out.includes('\r'))
  assert.ok(out.includes('return 1'))
})

test('stripComments (Vue): xử lý riêng <script>, <style> và template; đuôi lạ chỉ đổi xuống dòng', () => {
  const out = stripComments('<template><!-- t --><div/></template>\n<script>\n// c\nlet a = 1\n</script>\n<style>\n/* s */\na{}\n</style>\n', 'vue')
  assert.ok(!/<!--|\/\/ c|\/\* s/.test(out))
  assert.ok(out.includes('let a = 1') && out.includes('<div/>') && out.includes('a{}'))
  assert.equal(stripComments('a // b\r\n', 'xyz'), 'a // b\n')
})

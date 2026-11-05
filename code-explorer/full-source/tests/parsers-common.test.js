import test from 'node:test'
import assert from 'node:assert/strict'
import { maskSource, balanced, splitTop, splitTopRanges, stripAnnotations, skipLeading, makeLineLookup } from '../src/features/diagram/parsers/common.js'

const JAVA = { line: '//', block: ['/*', '*/'], quotes: ['"', "'"], triple: ['"""'] }
const KOTLIN = { line: '//', block: ['/*', '*/'], nested: true, quotes: ['"', "'"], triple: ['"""'], rawTriple: true, templates: true }
const PY = { line: '#', quotes: ['"', "'"], triple: ['"""', "'''"] }

/** Mọi trường hợp: cùng độ dài và cùng vị trí xuống dòng với văn bản gốc. */
function assertShape(src, out) {
  assert.equal(out.length, src.length)
  assert.deepEqual([...out].map((c) => c === '\n'), [...src].map((c) => c === '\n'))
}

test('maskSource (Java): comment, chuỗi, ký tự và text block được che; dấu nháy giữ lại', () => {
  const src = 'int a = 1; // class X {\nString s = "}{ //"; char c = \'{\'; /* class Y\n{ */ String t = """\n  } text\n  """;'
  const out = maskSource(src, JAVA)
  assertShape(src, out)
  assert.ok(!/class|text|\/\//.test(out))
  assert.ok(out.includes('String s = "') && out.includes("char c = '"))
  assert.equal((out.match(/[{}]/g) ?? []).length, 0) // mọi ngoặc nhọn đều nằm trong comment hoặc chuỗi
})

test('maskSource (Kotlin): comment lồng nhau, ${…} chứa chuỗi lồng, raw string', () => {
  const src = '/* a /* b { */ c } */ val x = 1\nval s = "v ${ f("}") + 1 } { z"\nval r = """raw { "q" } \\"""\nval ok = 2'
  const out = maskSource(src, KOTLIN)
  assertShape(src, out)
  assert.equal((out.match(/[{}]/g) ?? []).length, 0)
  assert.ok(out.includes('val x = 1') && out.includes('val ok = 2'))
})

test('maskSource (Python): # trong chuỗi không phải comment; chuỗi ba nháy nhiều dòng; escape', () => {
  const src = 'x = "a # b"  # real comment { \ny = \'it\\\'s\'\ndef f():\n    """doc\n    class Fake: {\n    """\n    return x'
  const out = maskSource(src, PY)
  assertShape(src, out)
  assert.ok(!out.includes('real') && !out.includes('Fake') && !out.includes('doc'))
  assert.ok(out.includes('x = "') && out.includes('return x'))
  assert.equal((out.match(/[{}]/g) ?? []).length, 0)
})

test('maskSource: chuỗi không đóng và comment không đóng không làm hỏng phần còn lại', () => {
  for (const syn of [JAVA, KOTLIN, PY]) {
    assert.doesNotThrow(() => assertShape('a = "unterminated\nb = 2', maskSource('a = "unterminated\nb = 2', syn)))
    assert.doesNotThrow(() => maskSource('/* never closed', syn))
  }
  assert.equal(maskSource('a = "oops\nb = 2', PY).split('\n')[1], 'b = 2') // chuỗi một dòng không đóng dừng ở hết dòng
})

test('balanced / splitTop: bỏ qua nội dung trong ngoặc và generic, `->` không phải dấu đóng', () => {
  assert.equal(balanced('f(a(b)c)d', 1, '(', ')'), 8)
  assert.deepEqual(splitTop('Map<String, List<Int>> a, (Int) -> Unit b, c', ','), ['Map<String, List<Int>> a', '(Int) -> Unit b', 'c'])
  assert.deepEqual(splitTop('public static <T extends Foo<T>> List<T> run(A a, B b)', ' '), ['public', 'static', '<T extends Foo<T>>', 'List<T>', 'run(A a, B b)'])
  assert.deepEqual(splitTopRanges('a, b', ',').map(({ from, to }) => 'a, b'.slice(from, to)), ['a', ' b'])
})

test('stripAnnotations / skipLeading: annotation có tham số lồng, @interface được giữ', () => {
  assert.equal(stripAnnotations('@A(x = f(1)) @b.C public int x').replace(/\s+/g, ' ').trim(), 'public int x')
  assert.equal(stripAnnotations('@Target({A, B}) @interface Foo').replace(/\s+/g, ' ').trim(), '@interface Foo')
  assert.equal(stripAnnotations('@get:JsonIgnore val x'), ' val x')
  const s = '  @A(1)\n  @B  class X'
  assert.equal(s.slice(skipLeading(s)), 'class X')
})

test('makeLineLookup', () => {
  const at = makeLineLookup('a\nbb\n\nd')
  assert.deepEqual([0, 1, 2, 4, 5, 6].map(at), [1, 1, 2, 2, 3, 4])
})

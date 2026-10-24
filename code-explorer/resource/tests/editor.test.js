import test from 'node:test'
import assert from 'node:assert/strict'
import { languageOf } from '../src/features/editor/languages.js'
import { clampEditorWidth, clampExplorerWidth, EDITOR_MIN_WIDTH, EXPLORER_MIN_WIDTH, GRAPH_MIN_WIDTH } from '../src/features/editor/panel-width.js'
import { formatSize } from '../src/utils/format.js'
import { canStripComments } from '../src/core/mask-comments.js'

test('languageOf: theo đuôi file, không phân biệt hoa thường', () => {
  assert.equal(languageOf('src/Program.cs'), 'csharp')
  assert.equal(languageOf('src/App.VUE'), 'html')
  assert.equal(languageOf('a/b.csproj'), 'xml')
  assert.equal(languageOf('x/y.tsx'), 'typescript')
  assert.equal(languageOf('Dockerfile'), 'dockerfile')
  assert.equal(languageOf('notes.unknownext'), 'plaintext')
  assert.equal(languageOf('Makefile'), 'plaintext')
})

test('clampEditorWidth: không nhỏ hơn mức tối thiểu, luôn chừa chỗ cho sơ đồ', () => {
  assert.equal(clampEditorWidth(100, 1400), EDITOR_MIN_WIDTH)
  assert.equal(clampEditorWidth(600, 1400), 600)
  assert.equal(clampEditorWidth(5000, 1400), 1400 - GRAPH_MIN_WIDTH)
  assert.equal(clampEditorWidth(NaN, 1400), 560)
  assert.equal(clampEditorWidth(600, 500), EDITOR_MIN_WIDTH) // cửa sổ hẹp: ưu tiên mức tối thiểu của editor
})

test('formatSize', () => {
  assert.equal(formatSize(0), '0 B')
  assert.equal(formatSize(1023), '1023 B')
  assert.equal(formatSize(1024), '1 KB')
  assert.equal(formatSize(1536), '1.5 KB')
  assert.equal(formatSize(5 * 1024 * 1024), '5 MB')
  assert.equal(formatSize(undefined), '0 B')
})

test('canStripComments: chỉ bật cho ngôn ngữ stripComments hiểu', () => {
  for (const e of ['cs', 'java', 'js', 'ts', 'tsx', 'py', 'css', 'html', 'vue']) assert.equal(canStripComments(e), true, e)
  for (const e of ['md', 'json', 'xml', '', 'csproj']) assert.equal(canStripComments(e), false, e)
})

test('clampExplorerWidth / clampEditorWidth: panel bên kia được tính vào để sơ đồ luôn còn chỗ', () => {
  assert.equal(clampExplorerWidth(50, 1400), EXPLORER_MIN_WIDTH)
  assert.equal(clampExplorerWidth(NaN, 1400), 300)
  // editor đang rộng 600 → Explorer tối đa 1400 - 600 - 280 = 520
  assert.equal(clampExplorerWidth(9999, 1400, 600), 1400 - 600 - GRAPH_MIN_WIDTH)
  assert.equal(clampEditorWidth(9999, 1400, 300), 1400 - 300 - GRAPH_MIN_WIDTH)
  assert.equal(clampEditorWidth(9999, 1400), 1400 - GRAPH_MIN_WIDTH) // bên kia đóng: như cũ
})

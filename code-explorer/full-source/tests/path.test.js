import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizePath, extname, basename, dirname, stripExt, joinPath, commonRoot } from '../src/core/path.js'

test('normalizePath: gộp dấu phân cách, bỏ ./ và .., đổi \\ thành /', () => {
  assert.equal(normalizePath('a\\b/./c/../d.js'), 'a/b/d.js')
  assert.equal(normalizePath('/a//b/'), 'a/b')
  assert.equal(normalizePath(''), '')
  assert.equal(normalizePath(null), '')
})

test('extname / basename / dirname / stripExt', () => {
  assert.equal(extname('src/App.Vue'), '.vue')
  assert.equal(extname('.gitignore'), '')
  assert.equal(extname('Makefile'), '')
  assert.equal(basename('a/b/c.js'), 'c.js')
  assert.equal(dirname('a/b/c.js'), 'a/b')
  assert.equal(dirname('c.js'), '')
  assert.equal(stripExt('app.min.js'), 'app.min')
})

test('joinPath chuẩn hoá và bỏ phần rỗng', () => {
  assert.equal(joinPath('a', '', 'b/../c', null, 'd.js'), 'a/c/d.js')
})

test('commonRoot: chỉ trả về khi MỌI path nằm trong cùng một thư mục gốc', () => {
  assert.equal(commonRoot(['proj/a.js', 'proj/b/c.js']), 'proj')
  assert.equal(commonRoot(['proj/a.js', 'other/b.js']), '')
  assert.equal(commonRoot(['a.js']), '')
  assert.equal(commonRoot([]), '')
})

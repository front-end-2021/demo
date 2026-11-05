import test from 'node:test'
import assert from 'node:assert/strict'
import { createSource, createSourceFromFileList, createSourceFromDirectory, SourceError } from '../src/core/source.js'

// File giả lập kiểu <input webkitdirectory>
const webkitFile = (rel, text = '') => Object.defineProperty(new File([text], rel.split('/').pop()), 'webkitRelativePath', { value: rel })
// Handle giả lập kiểu showDirectoryPicker
const fileHandle = (name, text = '') => ({ kind: 'file', name, getFile: async () => new File([text], name) })
const dirHandle = (name, children) => ({ kind: 'directory', name, async *values() { yield* children } })

const rejectsWith = (promise, code) => assert.rejects(promise, (e) => e instanceof SourceError && e.code === code)

test('FileList (webkitdirectory): gỡ tên thư mục gốc → path khớp với analyzer', async () => {
  const source = createSourceFromFileList([webkitFile('proj/src/a.js', 'let a = 1'), webkitFile('proj/README.md', '# hi')])
  assert.equal(source.rootName, 'proj')
  assert.deepEqual(source.paths().sort(), ['README.md', 'src/a.js'])
  assert.equal(source.has('src/a.js'), true)
  assert.equal(source.has('proj/src/a.js'), false)
  assert.equal(await source.read('src/a.js'), 'let a = 1')
})

test('thư mục (showDirectoryPicker): bỏ node_modules, .git, file nhị phân ngay khi duyệt', async () => {
  const root = dirHandle('root', [
    dirHandle('src', [fileHandle('a.js', 'x')]),
    dirHandle('node_modules', [fileHandle('lib.js')]),
    dirHandle('.git', [fileHandle('config')]),
    fileHandle('logo.png'),
    fileHandle('readme.md', 'doc'),
  ])
  const counts = []
  const source = await createSourceFromDirectory(root, { onCount: (n) => counts.push(n) })
  assert.equal(source.rootName, 'root')
  assert.deepEqual(source.paths(), ['src/a.js', 'readme.md'])
  assert.equal(counts.at(-1), 2)
  assert.equal(await source.read('readme.md'), 'doc')
})

test('workerEntries: handle → { path, handle }, File → { path, file }', async () => {
  const h = fileHandle('a.js')
  const f = new File(['x'], 'b.js')
  const source = createSource([{ path: 'a.js', handle: h }, { path: 'b.js', file: f }])
  assert.deepEqual(source.workerEntries(), [{ path: 'a.js', handle: h }, { path: 'b.js', file: f }])
})

test('path được chuẩn hoá giống analyzer (\\ → /, ./, ..)', async () => {
  const source = createSource([{ path: 'src\\.\\x/../a.js', file: new File(['x'], 'a.js') }])
  assert.deepEqual(source.paths(), ['src/a.js'])
})

test('stat trả về kích thước và đuôi file', async () => {
  const source = createSource([{ path: 'src/Main.cs', file: new File(['hello'], 'Main.cs') }])
  const st = await source.stat('src/Main.cs')
  assert.deepEqual({ name: st.name, ext: st.ext, size: st.size }, { name: 'Main.cs', ext: '.cs', size: 5 })
})

test('read: các lỗi có .code rõ ràng', async () => {
  const source = createSource([
    { path: 'big.txt', file: new File(['hello world'], 'big.txt') },
    { path: 'pic.png', file: new File(['x'], 'pic.png') },
    { path: 'blob.dat2', file: new File(['ab\u0000cd'], 'blob.dat2') },
  ])
  await rejectsWith(source.read('nope.js'), 'not-found')
  await rejectsWith(source.read('pic.png'), 'binary') // đuôi nhị phân
  await rejectsWith(source.read('blob.dat2'), 'binary') // đuôi lạ nhưng chứa byte NUL
  await rejectsWith(source.read('big.txt', { maxSize: 5 }), 'too-large')
  assert.equal(await source.read('big.txt'), 'hello world')
  await assert.rejects(source.read('big.txt', { maxSize: 5 }), (e) => e.size === 11 && e.maxSize === 5)
})

test('handle hỏng → read-error (không làm sập bên gọi)', async () => {
  const source = createSource([{ path: 'a.js', handle: { getFile: async () => { throw new Error('NotFoundError') } } }])
  await rejectsWith(source.read('a.js'), 'read-error')
})

test('giữ nguyên kiểu xuống dòng gốc (CRLF)', async () => {
  const source = createSource([{ path: 'a.cs', file: new File(['a\r\nb\r\n'], 'a.cs') }])
  assert.equal(await source.read('a.cs'), 'a\r\nb\r\n')
})

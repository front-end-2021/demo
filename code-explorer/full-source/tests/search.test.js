import test from 'node:test'
import assert from 'node:assert/strict'
import { parseQuery, countByExt, filterByExt, rankPaths, findInText, searchContent, matchSymbols } from '../src/core/search.js'

const PATHS = ['src/App.vue', 'src/user/UserService.cs', 'src/user/UserController.cs', 'README.md', 'docs/user-guide.md', 'Makefile', 'src/util/helpers.js']

test('parseQuery: cắt khoảng trắng, tách từ, viết thường', () => {
  assert.deepEqual(parseQuery('  User  Service '), { text: 'User  Service', lower: 'user  service', tokens: ['user', 'service'] })
  assert.deepEqual(parseQuery(null).tokens, [])
})

test('countByExt: đếm theo đuôi, giảm dần; file không đuôi → ""', () => {
  assert.deepEqual(countByExt(PATHS), [['.cs', 2], ['.md', 2], ['', 1], ['.js', 1], ['.vue', 1]])
})

test('filterByExt: rỗng/null = tất cả; có tập đuôi thì chỉ lấy đuôi đó', () => {
  assert.equal(filterByExt(PATHS, null).length, PATHS.length)
  assert.equal(filterByExt(PATHS, new Set()).length, PATHS.length)
  assert.deepEqual(filterByExt(PATHS, new Set(['.md'])), [3, 4])
})

test('rankPaths: mọi từ phải khớp; tên file bắt đầu bằng từ khoá lên đầu', () => {
  const { indices, total } = rankPaths(PATHS, 'user')
  assert.equal(total, 3)
  // UserService/UserController (tên bắt đầu bằng "user", điểm 3) trước docs/user-guide.md (tên bắt đầu bằng "user" — cũng 3, giữ thứ tự gốc)
  assert.deepEqual(indices.map((i) => PATHS[i]), ['src/user/UserService.cs', 'src/user/UserController.cs', 'docs/user-guide.md'])
  assert.deepEqual(rankPaths(PATHS, 'user service').indices.map((i) => PATHS[i]), ['src/user/UserService.cs'])
  assert.deepEqual(rankPaths(PATHS, 'xyz').indices, [])
  assert.deepEqual(rankPaths(PATHS, '   ').indices, [])
})

test('rankPaths: khớp tên file xếp trên khớp chỉ ở đường dẫn; lọc theo đuôi; giới hạn số lượng', () => {
  const paths = ['user/readme.txt', 'a/b/c/UserCard.vue', 'x/MyUser.vue']
  assert.deepEqual(rankPaths(paths, 'user').indices.map((i) => paths[i]), ['a/b/c/UserCard.vue', 'x/MyUser.vue', 'user/readme.txt'])
  assert.deepEqual(rankPaths(paths, 'user', { exts: new Set(['.vue']) }).indices.map((i) => paths[i]), ['a/b/c/UserCard.vue', 'x/MyUser.vue'])
  const r = rankPaths(paths, 'user', { limit: 1 })
  assert.equal(r.indices.length, 1)
  assert.equal(r.total, 3) // total vẫn là tổng số khớp
})

test('findInText: số lần khớp, dòng đầu tiên, đoạn trích, không phân biệt hoa thường', () => {
  const text = 'first line\n    const FooBar = 1\nsecond foobar here\n'
  const r = findInText(text, 'foobar')
  assert.equal(r.count, 2)
  assert.equal(r.line, 2)
  assert.equal(r.before, 'const ')
  assert.equal(r.match, 'FooBar') // giữ nguyên hoa/thường của văn bản
  assert.equal(r.after, ' = 1')
  assert.equal(findInText(text, 'nope'), null)
  assert.equal(findInText('', 'a'), null)
  assert.equal(findInText(text, ''), null)
})

test('findInText: cắt gọn dòng dài nhưng từ khoá vẫn nằm trong đoạn trích; CRLF', () => {
  const long = `${'x'.repeat(300)}NEEDLE${'y'.repeat(300)}`
  const r = findInText(`a\r\n${long}\r\n`, 'needle')
  assert.equal(r.line, 2)
  assert.equal(r.match, 'NEEDLE')
  assert.ok(r.before.startsWith('…') && r.before.length <= 30)
  assert.ok(r.after.endsWith('…') && !r.after.includes('\r'))
})

test('findInText: ký tự Unicode làm đổi độ dài khi viết thường vẫn cho vị trí đúng', () => {
  const r = findInText('İstanbul và Foo', 'foo') // 'İ'.toLowerCase() dài 2 ký tự
  assert.equal(r.match, 'Foo')
  assert.equal(r.count, 1)
})

test('findInText: ký tự đặc biệt của regex được coi là chữ thường', () => {
  assert.equal(findInText('a.b(c)', '.b(c)').match, '.b(c)')
  assert.equal(findInText('a+b', 'a+b').count, 1)
})

test('searchContent: báo kết quả dần, đếm tiến độ, bỏ qua file đọc lỗi/nhị phân', async () => {
  const files = { 'a.js': 'let foo = 1', 'b.js': 'nothing', 'c.js': 'FOO foo', 'd.js': null }
  const paths = Object.keys(files)
  const batches = []
  const read = async (p) => { if (p === 'x.js') throw new Error('boom'); return files[p] }
  const res = await searchContent({ paths: [...paths, 'x.js'], read, query: 'foo', batchSize: 2, onBatch: (b) => batches.push(b) })
  const hits = batches.flatMap((b) => b.hits)
  assert.deepEqual(hits.map((h) => [h.path, h.count, h.line]), [['a.js', 1, 1], ['c.js', 2, 1]])
  assert.equal(res.scanned, 5)
  assert.equal(res.cancelled, false)
  assert.equal(batches.at(-1).done, true)
  assert.equal(batches.filter((b) => b.done).length, 1)
})

test('searchContent: huỷ giữa chừng thì dừng ngay và không báo "done"', async () => {
  const paths = Array.from({ length: 100 }, (_, i) => `f${i}.js`)
  let cancelled = false
  const batches = []
  const res = await searchContent({
    paths, query: 'x', batchSize: 10,
    read: async () => 'x',
    isCancelled: () => cancelled,
    onBatch: (b) => { batches.push(b); if (batches.length === 2) cancelled = true },
  })
  assert.equal(res.cancelled, true)
  assert.ok(res.scanned < 100)
  assert.ok(batches.every((b) => !b.done))
})

test('searchContent: dừng khi đủ số file tối đa và đánh dấu truncated', async () => {
  const paths = Array.from({ length: 50 }, (_, i) => `f${i}.js`)
  const batches = []
  const res = await searchContent({ paths, query: 'x', read: async () => 'x', batchSize: 8, maxFiles: 10, onBatch: (b) => batches.push(b) })
  assert.equal(res.truncated, true)
  assert.equal(batches.flatMap((b) => b.hits).length, 10)
  assert.equal(batches.at(-1).done, true)
  assert.equal(batches.at(-1).truncated, true)
})

test('matchSymbols: trùng hẳn > bắt đầu bằng > chứa; lọc đuôi; giới hạn', () => {
  const mk = (name, path = 'a.cs', kind = 'class') => ({ name, lname: name.toLowerCase(), kind, line: 1, path })
  const entries = [mk('MyUserService'), mk('UserService'), mk('User'), mk('UserServiceTests', 'b.js'), mk('other')]
  const r = matchSymbols(entries, 'user')
  assert.deepEqual(r.hits.map((h) => h.name), ['User', 'UserService', 'UserServiceTests', 'MyUserService'])
  assert.equal(r.total, 4)
  assert.deepEqual(matchSymbols(entries, 'user', { exts: new Set(['.js']) }).hits.map((h) => h.name), ['UserServiceTests'])
  assert.equal(matchSymbols(entries, 'user', { limit: 2 }).hits.length, 2)
  assert.deepEqual(matchSymbols(entries, '  '), { hits: [], total: 0 })
})

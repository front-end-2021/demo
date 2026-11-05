import test from 'node:test'
import assert from 'node:assert/strict'
import { buildOffsets, indexAt, visibleRange, scrollToReveal } from '../src/features/explorer/virtual-list.js'

const heights = [10, 20, 30, 40] // offsets: 0 10 30 60 100

test('buildOffsets: vị trí đầu mỗi hàng và tổng chiều cao', () => {
  assert.deepEqual([...buildOffsets(heights)], [0, 10, 30, 60, 100])
  assert.deepEqual([...buildOffsets([])], [0])
})

test('indexAt: hàng chứa vị trí y, giới hạn trong danh sách', () => {
  const o = buildOffsets(heights)
  assert.deepEqual([0, 9, 10, 29, 30, 59, 60, 99, 100, 500].map((y) => indexAt(o, y)), [0, 0, 1, 1, 2, 2, 3, 3, 3, 3])
  assert.equal(indexAt(buildOffsets([]), 5), 0)
})

test('visibleRange: hàng nhìn thấy cộng vùng đệm, end không gồm', () => {
  const o = buildOffsets(Array(1000).fill(20))
  assert.deepEqual(visibleRange(o, 0, 100, 0), { start: 0, end: 6 }) // y 0..100 chạm hàng 0..5
  assert.deepEqual(visibleRange(o, 400, 100, 2), { start: 18, end: 28 })
  assert.deepEqual(visibleRange(o, 99999999, 100, 4).end, 1000)
  assert.deepEqual(visibleRange(buildOffsets([]), 0, 100), { start: 0, end: 0 })
})

test('scrollToReveal: chỉ cuộn khi hàng chưa nằm trọn trong khung nhìn', () => {
  const o = buildOffsets(Array(100).fill(20))
  assert.equal(scrollToReveal(o, 5, 0, 200), 0) // đã thấy
  assert.equal(scrollToReveal(o, 20, 0, 200), 220) // dưới khung → kéo xuống vừa đủ
  assert.equal(scrollToReveal(o, 2, 400, 200), 40) // trên khung → kéo lên
})

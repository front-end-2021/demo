// adapters/clike.js — Helper dùng chung cho các parser "nhẹ" (regex) của Java, Kotlin, C#.
// Mọi hàm ở đây làm việc trên văn bản ĐÃ che comment (maskComments), nên vị trí ký tự
// vẫn trùng khớp với văn bản gốc.

import { stripGenerics, splitTopLevel } from '../utils.js'

/**
 * Tìm vị trí kết thúc phần "header" của khai báo kiểu (sau tên lớp):
 * dấu '{' hoặc ';' ở độ sâu 0. Với Kotlin, lớp có thể không có thân -> dừng ở xuống dòng
 * nếu dòng sau không phải phần tiếp nối (':', ',', '(', 'where'...).
 */
export function findHeaderEnd(src, i, { kotlin = false } = {}) {
  let depth = 0
  const limit = Math.min(src.length, i + 3000)
  for (; i < limit; i++) {
    const c = src[i]
    if (c === '(' || c === '<' || c === '[') depth++
    else if (c === ')' || c === ']' || (c === '>' && src[i - 1] !== '-')) depth = Math.max(0, depth - 1)
    else if (depth === 0 && (c === '{' || c === ';')) return i
    else if (depth === 0 && kotlin && c === '\n') {
      const rest = src.slice(i + 1, i + 200).trimStart()
      if (!/^([:,({<]|where\b)/.test(rest)) return i
    }
  }
  return i
}

/**
 * Đoạn văn bản ngay TRƯỚC một khai báo, nơi chứa annotation/attribute của nó.
 * Lùi lại tới '}', ';' hoặc '{' gần nhất (bỏ qua các ký tự đó nếu nằm trong (...) hoặc [...]).
 */
export function leadingSegment(src, start, minIndex = 0) {
  let depth = 0
  const from = Math.max(minIndex, start - 1500)
  for (let k = start - 1; k >= from; k--) {
    const c = src[k]
    if (c === ')' || c === ']') depth++
    else if (c === '(' || c === '[') depth--
    else if (depth <= 0 && (c === '}' || c === ';' || c === '{')) return src.slice(k + 1, start)
  }
  return src.slice(from, start)
}

/** Kiểu của các tham số: Java/C# "Type name", Kotlin "name: Type". Trả về tên kiểu đơn giản. */
export function paramTypes(params, { kotlin = false } = {}) {
  const out = new Set()
  for (let p of splitTopLevel(params, ',')) {
    p = p
      .replace(/@[\w.]+(\((?:[^()]|\([^()]*\))*\))?/g, ' ') // annotation Java/Kotlin
      .replace(/\[[^\]]*\]/g, ' ') // attribute C#, mảng
    p = stripGenerics(p).replace(/=[\s\S]*$/, '').trim()
    const m = kotlin ? /:\s*([A-Z][\w.]*)/.exec(p) : /([A-Z][\w.]*)\??\s+\w+$/.exec(p)
    if (m) out.add(m[1].split('.').pop())
  }
  return [...out]
}

/** "Base<T>(arg), IFoo, a.b.IBar" -> ['Base', 'IFoo', 'IBar'] */
export function typeNames(s) {
  const cleaned = stripGenerics(s ?? '').replace(/\((?:[^()]|\([^()]*\))*\)/g, '')
  return splitTopLevel(cleaned, ',')
    .map((p) => /([A-Za-z_][\w.]*)/.exec(p.trim())?.[1])
    .filter(Boolean)
    .map((n) => n.split('.').pop())
    .filter((n) => /^[A-Z]/.test(n))
}

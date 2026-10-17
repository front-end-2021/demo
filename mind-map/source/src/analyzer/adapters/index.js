// adapters/index.js — Danh sách language adapter.
//
// Interface của một adapter:
// {
//   id: string,                       // 'javascript', 'vue', 'java'...
//   extensions: string[],             // ['.vue']
//   match?: (sf) => boolean,          // lọc thêm (ví dụ bỏ .d.ts, file sinh tự động)
//   analyze: (sf, text, ctx) => Unit  // parse + thu thập symbol + ref (xem createUnit trong utils.js)
// }
//
// Muốn hỗ trợ ngôn ngữ mới (Go, PHP, Ruby...): viết adapter theo interface này rồi thêm vào mảng.
// Muốn thay parser regex bằng tree-sitter: chỉ cần viết lại hàm analyze của adapter tương ứng,
// miễn là vẫn trả về cùng dạng Unit -> các bước sau không phải sửa.

import { javascriptAdapter } from './javascript.js'
import { vueAdapter } from './vue.js'
import { htmlAdapter } from './html.js'
import { cssAdapter } from './css.js'
import { javaAdapter, kotlinAdapter } from './jvm.js'
import { csharpAdapter } from './csharp.js'
import { pythonAdapter } from './python.js'

export const defaultAdapters = [
  javascriptAdapter,
  vueAdapter,
  htmlAdapter,
  cssAdapter,
  javaAdapter,
  kotlinAdapter,
  csharpAdapter,
  pythonAdapter,
]

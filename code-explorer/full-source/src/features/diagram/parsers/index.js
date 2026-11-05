// features/diagram/parsers/index.js — Parser cho sơ đồ class, chọn theo đuôi file.
// Thêm ngôn ngữ mới = viết một parser trả về cùng mô hình { types, relations } rồi thêm một dòng vào PARSERS; phần còn lại không phải đổi.

import { extname } from '../../../core/path.js'
import { parseCSharpFiles } from './csharp.js'
import { parseJavaFiles } from './java.js'
import { parseKotlinFiles } from './kotlin.js'
import { parsePythonFiles } from './python.js'

/** parse([{ path, text }]) → { types, relations } — xem mô tả Type / Relation ở đầu csharp.js */
const PARSERS = [
  { language: 'csharp', label: 'C#', exts: ['.cs'], parse: parseCSharpFiles },
  { language: 'java', label: 'Java', exts: ['.java'], parse: parseJavaFiles },
  { language: 'kotlin', label: 'Kotlin', exts: ['.kt'], parse: parseKotlinFiles },
  { language: 'python', label: 'Python', exts: ['.py'], parse: parsePythonFiles },
]

export const parserFor = (path) => PARSERS.find((p) => p.exts.includes(extname(path))) ?? null
export const canDiagram = (path) => !!parserFor(path)
/** 'C# (.cs)' — để hiển thị trong thông báo. */
export const supportedLabel = () => PARSERS.map((p) => `${p.label} (${p.exts.join(', ')})`).join(', ')

/**
 * Parse một nhóm file. Mỗi ngôn ngữ được parse riêng — quan hệ chỉ nối trong cùng một ngôn ngữ.
 * @returns {{ types: object[], relations: object[], unsupported: string[] }}
 */
export function parseFiles(files) {
  const groups = new Map()
  const unsupported = []
  for (const f of files) {
    const parser = parserFor(f.path)
    if (!parser) unsupported.push(f.path)
    else groups.set(parser, [...(groups.get(parser) ?? []), f])
  }
  const types = []
  const relations = []
  for (const [parser, list] of groups) {
    const r = parser.parse(list)
    types.push(...r.types)
    relations.push(...r.relations)
  }
  return { types, relations, unsupported }
}

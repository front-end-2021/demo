// pipeline.js — Nối các bước lại với nhau.
//
//   01 collectFiles -> 02 readProjectConfig -> 03 assignAdapters
//   -> 04 runPass1 (parse + chỉ mục) -> 05 runPass2 (nối cạnh) -> 06 buildGraph
//
// Chạy trong Web Worker (analyzer.worker.js) để giao diện không bị treo với dự án lớn.

import { collectFiles } from './01-collect-files.js'
import { readProjectConfig } from './02-project-config.js'
import { assignAdapters } from './03-assign-adapters.js'
import { runPass1 } from './04-pass1-index.js'
import { runPass2 } from './05-pass2-resolve.js'
import { buildGraph } from './06-build-graph.js'
import { defaultAdapters } from './adapters/index.js'

/**
 * @param {FileList|{path: string, file?: File, handle?: FileSystemFileHandle}[]} input
 * @param {{ aliases?: {find: string, replacement: string}[], adapters?: object[], includeVendor?: boolean,
 *           collectOptions?: object, onProgress?: Function, isCancelled?: Function }} opts
 * @returns kết quả, hoặc null nếu bị huỷ giữa chừng
 */
export async function analyzeProject(input, {
  aliases = [], adapters = defaultAdapters, includeVendor = false, collectOptions = {},
  onProgress = () => {}, isCancelled = () => false,
} = {}) {
  const { files, skipped, rootName } = await collectFiles(input, { includeVendor, onProgress, ...collectOptions })
  if (isCancelled()) return null

  onProgress({ stage: 'config', files: files.size })
  const config = await readProjectConfig(files, { extraAliases: aliases, rootName })

  const { groups, unassigned } = assignAdapters(files, adapters)
  const pass1 = await runPass1({ groups, adapters, config, includeVendor, onProgress, isCancelled })
  if (!pass1) return null
  const { units, index, refs } = pass1
  const { edges, extraNodes, unresolved } = runPass2({ units, index, refs, files, config, onProgress })
  const graph = buildGraph({ units, extraNodes, edges })
//console.log(`Analyze xong các file`, files)
  onProgress({ stage: 'done' })
  return {
    graph,
    config,
    unresolved,
    skipped: [...skipped, ...pass1.skipped],
    unassigned,
    paths: [...files.keys()], // mọi file đã nhận (kể cả .csproj, package.json…) — dùng để chia project
    stats: { files: files.size, analyzed: units.length, refs: refs.length, edges: edges.length, nodes: graph.order },
  }
}

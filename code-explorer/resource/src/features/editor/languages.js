// features/editor/languages.js — đuôi file → mã ngôn ngữ của Monaco (chỉ dùng id có trong bộ ngôn ngữ cơ bản của Monaco).

import { basename, extname } from '../../core/path.js'

const BY_EXT = {
  '.cs': 'csharp', '.csx': 'csharp', '.vb': 'vb', '.fs': 'fsharp',
  '.java': 'java', '.kt': 'kotlin', '.kts': 'kotlin', '.scala': 'scala',
  '.py': 'python',
  '.js': 'javascript', '.mjs': 'javascript', '.cjs': 'javascript', '.jsx': 'javascript',
  '.ts': 'typescript', '.mts': 'typescript', '.cts': 'typescript', '.tsx': 'typescript',
  '.vue': 'html', '.html': 'html', '.htm': 'html', '.cshtml': 'razor', '.razor': 'razor',
  '.css': 'css', '.scss': 'scss', '.less': 'less',
  '.json': 'json', '.jsonc': 'json',
  '.xml': 'xml', '.csproj': 'xml', '.vbproj': 'xml', '.props': 'xml', '.targets': 'xml', '.config': 'xml',
  '.xaml': 'xml', '.resx': 'xml', '.xsd': 'xml', '.xsl': 'xml', '.nuspec': 'xml',
  '.yml': 'yaml', '.yaml': 'yaml',
  '.md': 'markdown',
  '.sh': 'shell', '.bash': 'shell', '.ps1': 'powershell', '.bat': 'bat', '.cmd': 'bat',
  '.ini': 'ini', '.cfg': 'ini', '.properties': 'ini', '.toml': 'ini',
  '.sql': 'sql', '.php': 'php', '.go': 'go', '.rs': 'rust', '.rb': 'ruby', '.swift': 'swift', '.dart': 'dart',
  '.c': 'cpp', '.h': 'cpp', '.cpp': 'cpp', '.cc': 'cpp', '.hpp': 'cpp',
  '.graphql': 'graphql', '.proto': 'protobuf',
}

const BY_NAME = { dockerfile: 'dockerfile' }

/** Mã ngôn ngữ Monaco cho một đường dẫn; 'plaintext' nếu không nhận ra. */
export function languageOf(path) {
  return BY_NAME[basename(path).toLowerCase()] || BY_EXT[extname(path)] || 'plaintext'
}

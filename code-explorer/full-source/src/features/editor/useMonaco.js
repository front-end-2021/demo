// features/editor/useMonaco.js — Nạp Monaco LƯỜI: chỉ tải khi người dùng mở file đầu tiên,
// nên màn hình sơ đồ vẫn nhẹ như mind-map cũ. Gọi nhiều lần vẫn chỉ tải một lần.

let loading = null

export function loadMonaco() {
  if (!loading) {
    loading = import('monaco-editor')
      .then((monaco) => {
        // Theme khớp với bảng màu sáng hiện tại của ứng dụng (sẽ chuyển sang bảng màu chung ở bước tokens.css)
        monaco.editor.defineTheme('explorer-light', {
          base: 'vs',
          inherit: true,
          rules: [],
          colors: {
            'editor.background': '#fbfcfd',
            'editorLineNumber.foreground': '#a3adbb',
            'editor.lineHighlightBackground': '#eef2f7',
          },
        })
        return monaco
      })
      .catch((err) => {
        loading = null // cho phép thử lại lần sau (vd. lỗi mạng khi tải chunk)
        throw err
      })
  }
  return loading
}

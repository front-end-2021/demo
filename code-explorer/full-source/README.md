# Code Explorer

Công cụ chạy hoàn toàn trên trình duyệt để **khám phá cấu trúc một dự án mã nguồn**: chọn thư mục dự án, Code Explorer sẽ phân tích các file, dựng **sơ đồ phụ thuộc giữa các file**, **sơ đồ class**, cho phép **tìm kiếm** (tên file, symbol, nội dung) và **đọc mã** trong editor Monaco, tất cả mà không cần gửi mã nguồn lên máy chủ nào.

> Phiên bản: `1.0.5` · Vue 3 + Pinia + Vite · Sigma.js (WebGL) + graphology · Monaco Editor

---

## Mục lục

- [Tính năng](#tính-năng)
- [Ngôn ngữ & framework được hỗ trợ](#ngôn-ngữ--framework-được-hỗ-trợ)
- [Bắt đầu nhanh](#bắt-đầu-nhanh)
- [Cách sử dụng](#cách-sử-dụng)
- [Kiến trúc](#kiến-trúc)
- [Pipeline phân tích](#pipeline-phân-tích)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Mở rộng](#mở-rộng)
- [Kiểm thử](#kiểm-thử)
- [Thuộc tính cho automation test](#thuộc-tính-cho-automation-test)
- [Giới hạn đã biết](#giới-hạn-đã-biết)

---

## Tính năng

**Sơ đồ file (mind-map)**
- Đồ thị có hướng giữa các file, vẽ bằng WebGL (Sigma.js), sắp xếp bằng ForceAtlas2 chạy dần trong Web Worker (có thể dừng / sắp xếp lại / vừa khung).
- Hai cấp nhìn: **Tổng quan** (mỗi node là một project) và **chi tiết từng project** (node của project khác có liên kết được hiện mờ).
- Tự chia project theo file đánh dấu: `*.csproj`, `package.json`, `pom.xml`, `build.gradle(.kts)`, `pyproject.toml`, `setup.py`, `go.mod`, `Cargo.toml`, `composer.json`…
- Node có loại (Component, JS/TS, Back-end, HTML, CSS, API endpoint, Route, Thư viện ngoài) với màu và **hình dạng tuỳ chỉnh** (tròn, vuông, tam giác, kim cương, elip, ngũ giác, lục giác; vẽ bằng shader SDF, lưu vào `localStorage`).
- Cạnh được tô màu theo nhóm: import/dùng, kế thừa, tiêm phụ thuộc, gọi API, sự kiện/emit, route, CSS, sang project khác. Cạnh **suy đoán** (khớp theo tên / mẫu URL) được phân biệt với cạnh **chắc chắn**.
- Bộ lọc 3 trạng thái: tất cả node → ẩn node độc lập → chỉ node độc lập.
- **Báo cáo cấu trúc** dạng Markdown (chép được vào clipboard).

**Sơ đồ class**
- Vẽ class / interface / record / enum… và quan hệ kế thừa, sử dụng cho **C#, Java, Kotlin, Python**.
- Chế độ *theo file đang chọn* hoặc *ghim* nhiều file (Ctrl + bấm trong danh sách file).
- Tự xếp theo tầng kế thừa, kéo thả, thu phóng; đường nối tránh vật cản (A\*). Giới hạn 60 class mỗi sơ đồ để giữ hiệu năng.

**Explorer & tìm kiếm** (`Ctrl/Cmd + K`)
- Một ô tìm, ba loại kết quả: **tên file** (tức thì), **symbol** (class, hàm, component… từ mô hình phân tích) và **nội dung** (quét theo lô trong Worker, huỷ được khi gõ tiếp).
- Lọc theo đuôi file, danh sách ảo hoá cho dự án lớn, kết quả được làm nổi bật trên sơ đồ.
- Tab **Lịch sử lọc**.

**Editor**
- Monaco Editor, mở đúng dòng khi chọn từ kết quả tìm kiếm / symbol và tô sáng từ khoá.
- **Dải quan hệ** của file đang xem: *Định nghĩa* · *Dùng* · *Được dùng bởi* (gọi API được nối tới file định nghĩa endpoint, kể cả ở project khác) · thư viện ngoài.
- Nút **Ẩn comment** (chỉ đổi cách hiển thị, không sửa file) và nút mở **Sơ đồ class** cho file.
- Panel Explorer / Editor kéo giãn được, độ rộng được nhớ.

**Riêng tư & hiệu năng**
- Mã nguồn chỉ được đọc cục bộ trong trình duyệt; toàn bộ phân tích chạy trong Web Worker nên giao diện không bị treo.
- File được đọc **theo yêu cầu** (chỉ giữ handle / `File`), không nạp cả dự án vào RAM.
- Mặc định bỏ qua thư viện & mã sinh tự động (jQuery, Bootstrap, `*.Designer.cs`, WCF Service References, `Migrations/`…), các thư mục như `node_modules`, `bin`, `obj`, `dist`, `build`, `target`, `venv`, `__pycache__`, thư mục bắt đầu bằng dấu chấm, file nhị phân, file > 3 MB và các mục trong `.gitignore`. Có thể bật lại bằng ô **"Gồm thư viện & mã sinh tự động"**.

---

## Ngôn ngữ & framework được hỗ trợ

| Ngôn ngữ | Đuôi file | Cách phân tích | Nhận diện thêm |
|---|---|---|---|
| JavaScript / TypeScript | `.js` `.jsx` `.ts` `.tsx` `.mjs` `.cjs` | AST (`@babel/parser`) | React (component, hook, context), Pinia / Zustand / Redux, Vue Router / React Router, Express / Fastify endpoint, lời gọi API (fetch / axios) |
| Vue SFC | `.vue` | `@vue/compiler-sfc` | component trong template, `emits` / `props`, `@event`, `<RouterLink>`, `<style scoped>` |
| HTML | `.html` `.htm` | `parse5` | `<script src>`, `<link>`, `onclick`, script & style inline |
| CSS / SCSS / Less | `.css` `.scss` `.sass` `.less` `.pcss` | PostCSS | class / id, CSS Modules, `@import` / `@use` / `@forward` |
| Java / Kotlin | `.java` `.kt` `.kts` | Regex (đã che comment) | **Spring**: controller, `@GetMapping`…, service, tiêm phụ thuộc, Feign client |
| C# | `.cs` | Regex (đã che comment) | **ASP.NET**: controller, `[HttpGet]`…, Minimal API, đăng ký DI, global using trong `.csproj` |
| Python | `.py` | Regex (đã che comment & docstring) | **Flask / FastAPI / Django**: route, router prefix, `include_router`, `urlpatterns` |

Cấu hình dự án cũng được đọc để giải quyết import: alias trong `tsconfig` / `jsconfig` / `vite.config`, `components.d.ts` (unplugin-vue-components), gốc import của Python, file entry (`index.html`, `main.ts`, `Program.cs`, `app.py`…).

---

## Bắt đầu nhanh

Yêu cầu: **Node.js 18+** (đã kiểm tra với Node 22).

```bash
npm install
npm run dev          # chạy môi trường phát triển (Vite)
```

| Lệnh | Mô tả |
|---|---|
| `npm run dev` | Server phát triển Vite. Ở chế độ này có biến `window.explorer` trong console để thử nhanh, ví dụ `await explorer.ws.readFile(explorer.sel.filePath)`. |
| `npm run build` | Build vào `dist/` (JS/CSS chính được inline vào `index.html`; worker của Monaco và analyzer là file riêng). |
| `npm run build:single` | Build vào `dist-single/` bằng `vite.config.single.js`, dùng để xem nhanh / gửi cho người khác. |
| `npm run preview` | Xem thử bản build. |
| `npm test` | Chạy bộ test bằng `node --test`. |

---

## Cách sử dụng

1. Bấm **📁 Folder dự án** và chọn thư mục gốc.
   - Chrome / Edge: dùng File System Access API (`showDirectoryPicker`), chỉ giữ handle nên rất nhẹ.
   - Firefox / Safari: tự chuyển sang `<input type="file" webkitdirectory>`.
2. Chờ phân tích; màn hình **Tổng quan** hiện các project. Chọn project ở thanh điều hướng `Tổng quan › …` để xem chi tiết.
3. Bấm một node để xem thông tin và mở file trong editor.
4. `Ctrl/Cmd + K` để tìm file, symbol hoặc nội dung.
5. Chuyển sang tab **Sơ đồ class**, hoặc Ctrl + bấm các file trong danh sách để ghim chúng vào sơ đồ.

---

## Kiến trúc

```
┌──────────────────────── Luồng chính (Vue + Pinia) ────────────────────────┐
│  TopBar   ExplorerPanel   GraphView (Sigma)   DiagramView   EditorPanel    │
│     │           │               │                  │             │         │
│  stores: workspace ── graph ── search ── selection ── diagram ── layout    │
│     │                                                                      │
│  useAnalyzer (composable) ── core/source.js (đọc file theo yêu cầu)        │
└─────┼──────────────────────────────────────────────────────────────────────┘
      │ postMessage (mỗi yêu cầu mang `job`; job mới huỷ job cũ)
┌─────▼──────────────────────── analyzer.worker.js ──────────────────────────┐
│  pipeline → graph đầy đủ → view-model (chia project) → layout ForceAtlas2  │
│  + tìm kiếm nội dung / symbol, tính quan hệ của một file (related)         │
└────────────────────────────────────────────────────────────────────────────┘
```

Một vài nguyên tắc thiết kế thể hiện trong mã:

- **Một nguồn sự thật cho việc "đang chọn gì"** (`stores/selection.js`): sơ đồ file, explorer, editor và sơ đồ class đều đọc/ghi vào đây.
- **Một quy ước đường dẫn** (`core/path.js`): dấu `/`, không có tên thư mục gốc, không `./` hay `..`. Analyzer, editor, tìm kiếm và sơ đồ class dùng chung làm khoá.
- **Một bộ quy tắc bỏ qua file** (`core/ignore-rules.js`) cho toàn ứng dụng.
- **Phụ thuộc một chiều** `graph → workspace`: store `workspace` không biết gì về Sigma, chỉ chuyển kết quả cho "graph sink" do `stores/graph.js` đăng ký.
- Đối tượng Sigma / graphology được giữ **ngoài** state phản ứng của Vue để tránh chậm.
- Giao diện chỉ nhận phần đồ thị đang xem; đồ thị đầy đủ nằm trong Worker.

### Giao thức Worker

| Gửi tới Worker | Nhận về |
|---|---|
| `load { entries, options }` | `progress` … `loaded { projects, stats, skipped, report }`, rồi tự hiện tổng quan |
| `show { view, relayout }` | `graph { nodes, edges, positions }` → `positions` … → `layout-done` |
| `stop { view }` | dừng sắp xếp, giữ bố cục hiện tại |
| `search { query, exts, symbols, content }` | `search-symbols`, `search-content` (về dần) |
| `search-cancel` | — |
| `related { path }` | `related { symbols, uses, usedBy, externals }` |

---

## Pipeline phân tích

Nằm trong `src/analyzer/`, nối bởi `pipeline.js`:

| Bước | File | Việc làm |
|---|---|---|
| 01 | `01-collect-files.js` | Lọc file theo đường dẫn / `.gitignore` / kích thước, đọc metadata (nội dung đọc lười) |
| 02 | `02-project-config.js` | Đọc cấu hình: framework, package, alias, global component, gốc Python, global using C#, file entry |
| 03 | `03-assign-adapters.js` | Gán mỗi file cho một language adapter theo đuôi |
| 04 | `04-pass1-index.js` | **Lượt 1**: parse mọi file, lập chỉ mục symbol, chạy bộ nhận diện framework |
| 05 | `05-pass2-resolve.js` | **Lượt 2**: biến tham chiếu thành cạnh (`imports`, `renders`, `emits`, `uses-store`, `calls-api`, `extends`, `injects`…), mỗi cạnh có độ tin cậy `certain` / `inferred` |
| 06 | `06-build-graph.js` | Dựng đồ thị graphology trung lập (node: `file`, `endpoint`, `route`, `external`) |
| 07 | `07-views.js` | Các phép chiếu: lọc đồ thị, gom theo thư mục, cây component, cầu nối front-end ↔ back-end, tìm vòng phụ thuộc (Tarjan), báo cáo Markdown, xuất Mermaid |
| 08 | `08-view-model.js` | Chia đồ thị theo project cho giao diện Tổng quan → chi tiết |

Phải chạy **hai lượt** vì khi file A tham chiếu tới B, B có thể chưa được parse; cần biết hết định nghĩa trước khi nối tham chiếu.

---

## Cấu trúc thư mục

```
├── index.html
├── package.json
├── vite.config.js            # build chính
├── vite.config.single.js     # build ra dist-single/
├── vite.plugins.js           # plugin dùng chung: vue, singlefile, monaco
├── src/
│   ├── main.js · App.vue · style.css
│   ├── analyzer/             # pipeline phân tích (chạy trong Worker)
│   │   ├── 01…08-*.js        # các bước pipeline
│   │   ├── adapters/         # parser theo ngôn ngữ (js, vue, html, css, jvm, csharp, python)
│   │   ├── frameworks/       # Spring, ASP.NET, Flask/FastAPI/Django
│   │   ├── analyzer.worker.js · useAnalyzer.js · pipeline.js
│   │   ├── layout.js         # ForceAtlas2 theo đợt
│   │   ├── node-shapes.js    # chương trình WebGL vẽ node nhiều hình dạng
│   │   └── related.js        # quan hệ của một file
│   ├── core/                 # logic thuần, dùng chung (có test)
│   │   ├── path.js · ignore-rules.js · source.js
│   │   ├── search.js · mask-comments.js
│   ├── features/
│   │   ├── graph/            # GraphView, chú thích, thông tin node, hằng số màu/hình
│   │   ├── diagram/          # sơ đồ class: parser C#/Java/Kotlin/Python, bố cục, ClassBox
│   │   ├── editor/           # Monaco, dải quan hệ
│   │   ├── explorer/         # danh sách file ảo hoá + tìm kiếm
│   │   └── report/           # báo cáo Markdown
│   ├── components/           # TopBar, SplitHandle, FilterLogs
│   ├── stores/               # Pinia: workspace, graph, search, selection, diagram, layout, settings
│   └── utils/
└── tests/                    # node --test (+ fixtures)
```

---

## Mở rộng

**Thêm ngôn ngữ cho sơ đồ file**: viết một adapter theo interface trong `src/analyzer/adapters/index.js` rồi thêm vào mảng `defaultAdapters`:

```js
export const goAdapter = {
  id: 'go',
  extensions: ['.go'],
  match: (sf) => !sf.name.endsWith('_test.go'), // tuỳ chọn
  analyze(sf, text, ctx) {
    const unit = createUnit(sf, 'go', 'go')
    // addSymbol(unit, …) / addRef(unit, …)
    return unit
  },
}
```

Chỉ cần trả về đúng dạng `Unit`, các bước sau không phải sửa. Có thể thay parser regex bằng tree-sitter theo cùng cách.

**Thêm framework**: thêm một detector `{ id, appliesTo(unit, config), run(unit, config) }` vào `frameworkDetectors` trong `src/analyzer/frameworks/index.js`.

**Thêm ngôn ngữ cho sơ đồ class**: viết parser trả về `{ types, relations }` rồi thêm một dòng vào `PARSERS` trong `src/features/diagram/parsers/index.js`.

---

## Kiểm thử

```bash
npm test
```

Bộ test dùng runner có sẵn của Node (`node --test`), không cần thư viện test ngoài. Hiện có **111 test, tất cả đều qua**, bao phủ: quy tắc bỏ qua file, che/xoá comment, đường dẫn, nguồn file, tìm kiếm, quan hệ file, view-model, danh sách ảo, editor, bố cục sơ đồ class và parser C# / Java / Kotlin / Python.

---

## Thuộc tính cho automation test

Mọi phần tử tương tác / hiển thị trạng thái đều có `data-testid` (không phụ thuộc class CSS hay chữ hiển thị tiếng Việt, nên không vỡ khi đổi giao diện hoặc đổi câu chữ).

**Quy ước**
- `kebab-case`; tiền tố cho biết loại phần tử: `btn-` nút, `chk-` checkbox, `select-` ô chọn, `input-` ô nhập, `tab-` tab; còn lại là vùng / nhãn / thông báo.
- Phần tử lặp (hàng danh sách, class, cạnh…) dùng **cùng một testid** và mang dữ liệu định danh trong `data-*` (`data-path`, `data-name`, `data-from`/`data-to`/`data-kind`…) để lọc: `[data-testid="file-item"][data-path="src/main.js"]`.
- Trạng thái đọc từ thuộc tính chứ không phải từ class: `aria-selected` (tab), `aria-pressed` (nút bật/tắt, chip lọc), `aria-expanded` (tab quan hệ), `aria-current` (file đang chọn).
- Testid có tham số được ghi dạng `{...}` trong bảng dưới.

**Thuộc tính trạng thái dùng để chờ (wait)**

| Phần tử | Thuộc tính | Ý nghĩa |
|---|---|---|
| `app` | `data-busy` | `true` khi đang đọc / phân tích dự án |
| `app` | `data-has-data` | `true` khi đã có dữ liệu phân tích |
| `app` | `data-view` | Tổng quan (`__overview__`) hoặc id project đang xem |
| `editor-panel` | `data-status` | `idle` · `loading` · `ready` · `error` |
| `editor-panel` | `data-path` | File đang mở (không có khi chưa mở file nào) |
| `diagram-view` | `data-types` · `data-edges` | Số class / số quan hệ đang vẽ |
| `status-message` | `data-error` | `true` khi là thông báo lỗi |
| `class-box` | `data-name` · `data-kind` · `data-selected` | Id, loại và trạng thái chọn của class |

**Danh sách `data-testid`**

| Khu vực | Testid |
|---|---|
| Khung chính (`App.vue`) | `app` · `main-split` · `center-panel` · `center-tabs` · `split-handle-explorer` · `split-handle-editor` · `tab-graph` · `tab-class-diagram` · `tab-class-diagram-count` · `tab-filter-logs` |
| Thanh công cụ sơ đồ file | `graph-actions` · `btn-graph-stop-layout` · `btn-graph-relayout` · `btn-graph-fit` · `btn-graph-visibility` |
| Thanh công cụ sơ đồ class | `diagram-actions` · `btn-diagram-arrange` · `btn-diagram-zoom-out` · `diagram-zoom-level` · `btn-diagram-zoom-in` · `btn-diagram-fit` |
| Thanh trên (`TopBar`) | `topbar` · `app-title` · `btn-select-folder` · `input-folder` · `chk-include-vendor` · `breadcrumbs` · `btn-overview` · `select-project` · `btn-toggle-explorer` · `btn-toggle-editor` · `btn-report` · `status-message` · `stats` |
| Lịch sử lọc | `filter-logs` · `filter-log-item` · `filter-log-select` · `filter-log-remove` · `filter-logs-empty` |
| Explorer: ô tìm | `explorer-panel` · `search-box` · `search-input` · `search-clear` · `search-shortcut-hint` · `search-progress` · `search-error` |
| Explorer: chip đuôi file | `ext-chips` · `ext-chip-all` · `ext-chip-{ext}` (đuôi bỏ dấu chấm, vd. `ext-chip-vue`; đuôi đầy đủ nằm ở `data-ext=".vue"`) · `ext-chip-none` (file không đuôi) |
| Explorer: kết quả | `result-head` · `result-head-label` · `explorer-body` · `file-list` · `result-section` · `file-item` · `file-badge` · `file-name` · `file-dir` · `file-match-count` · `file-in-diagram-mark` · `symbol-kind` · `symbol-name` · `content-snippet` · `explorer-empty` · `btn-reset-filters` |
| Editor | `editor-panel` · `editor-crumbs` · `editor-file-name` · `editor-meta` · `btn-editor-class-diagram` · `btn-hide-comments` · `btn-editor-close` · `editor-body` · `monaco-host` · `editor-msg-idle` · `editor-msg-loading` · `editor-msg-error` |
| Dải quan hệ | `relations-bar` · `relations-tabs` · `relations-tab-defs` · `relations-tab-uses` · `relations-tab-usedBy` · `relations-externals` · `relations-panel` · `relation-symbol-row` · `relation-row` · `relation-inferred` · `relation-usage-link` |
| Sơ đồ file | `graph-view` · `graph-canvas` · `graph-empty-state` · `busy-overlay` · `busy-spinner` |
| Chú thích | `graph-legend-overview` · `graph-legend-detail` · `legend-kind-{kind}` · `legend-shape-{kind}` (`kind`: `component` `module` `backend` `html` `css` `endpoint` `route` `external`) |
| Thông tin node | `node-info` · `node-info-label` · `node-info-line` · `node-info-symbols` · `btn-node-info-open` |
| Báo cáo | `report-panel` · `report-title` · `report-content` · `btn-report-copy` · `btn-report-close` |
| Sơ đồ class | `diagram-view` · `diagram-toolbar` · `btn-diagram-follow` · `btn-diagram-add-current` · `diagram-stats` · `btn-diagram-save-image` · `diagram-files` · `diagram-file-chip` · `btn-diagram-file-remove` · `diagram-notice-unsupported` · `diagram-notice-problem` · `diagram-notice-truncated` · `diagram-canvas` · `diagram-edges` · `diagram-edge` · `diagram-empty` · `diagram-status` · `diagram-selected-label` |
| Class trong sơ đồ | `class-box` · `class-name` · `class-bases` · `class-stereotype` · `class-member` (`data-sec="attrs"` hoặc `"ops"`) |

**Ví dụ (Playwright)**

```js
// Hộp thoại chọn thư mục của trình duyệt không điều khiển được → nạp thẳng vào <input webkitdirectory> ẩn.
await page.getByTestId('input-folder').setInputFiles('./fixtures/sample-project')
await expect(page.getByTestId('app')).toHaveAttribute('data-busy', 'false')

await page.getByTestId('search-input').fill('UserService')
await page.locator('[data-testid="file-item"][data-type="symbol"]').first().click()
await expect(page.getByTestId('editor-panel')).toHaveAttribute('data-status', 'ready')

await page.getByTestId('tab-class-diagram').click()
await expect(page.getByTestId('class-box')).not.toHaveCount(0)
```

**Lưu ý**
- Sơ đồ file được vẽ bằng **WebGL** (`graph-canvas` là một `<canvas>`), nên node / cạnh **không phải phần tử DOM** và không có testid. Để kiểm thử đồ thị, dùng các số liệu ở `stats`, `node-info` và `data-view`, hoặc ở chế độ `npm run dev` gọi `window.explorer` trong `page.evaluate`.
- Nội dung code nằm trong **Monaco** (`monaco-host`); đọc nội dung qua API của Monaco chứ không qua DOM, và dùng `data-status="ready"` để biết đã tải xong.
- Danh sách file là **danh sách ảo hoá**: chỉ các hàng đang nhìn thấy mới có trong DOM, nên `file-item` ít hơn số file thật. Hãy lọc / tìm trước rồi mới đếm, hoặc cuộn `file-list`.
- Các thuộc tính này là một phần của bản build thường; nếu muốn loại khỏi bản phát hành, bỏ chúng bằng `compilerOptions.nodeTransforms` của `@vitejs/plugin-vue` trong `vite.config.js`.

---

## Giới hạn đã biết

- Parser Java, Kotlin, C#, Python là **parser nhẹ dựa trên regex**, nên có thể bỏ sót cú pháp phức tạp; một số cạnh là **suy đoán** (khớp theo tên / URL) và được đánh dấu `≈`.
- Sơ đồ class chỉ nối quan hệ **trong cùng một ngôn ngữ**, tối đa 60 class mỗi sơ đồ.
- File > 3 MB không được phân tích / xem.
- Đồ thị từ 5.000 node trở lên: cạnh không có mũi tên, cạnh và nhãn bị ẩn khi kéo / zoom để giữ mượt.
- Cần trình duyệt hỗ trợ WebGL.
- `maskComments` và `stripComments` hiện vẫn là hai bộ quét riêng (tham chiếu tới `ROADMAP.md`).

Xem ROADMAP.md để biết trạng thái từng mốc, các quyết định kỹ thuật chi tiết và checklist thử tay theo từng giai đoạn.

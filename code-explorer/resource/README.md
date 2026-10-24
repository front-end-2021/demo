# Code Explorer (nền: Code Mindmap)

> Đang gộp mind-map + code-viewer + class-diagram thành một ứng dụng. Xem **ROADMAP.md** (trạng thái, bản đồ gộp, checklist thử). Phần dưới mô tả bộ phân tích và sơ đồ file.

Vẽ sơ đồ quan hệ giữa các **file** trong một thư mục dự án (C#, Java, Kotlin, Python, JS/TS, Vue, HTML, CSS) ngay trong trình duyệt. Mã nguồn chỉ được đọc cục bộ, không tải lên đâu cả.

Sơ đồ có hai cấp: **Tổng quan** (mỗi node là một project) và **Chi tiết project** (mỗi node là một file, cùng các endpoint / route liên quan). Các quan hệ được nhận diện gồm import, render component, emit sự kiện, dùng store / hook / context, gọi API ↔ endpoint, kế thừa, tiêm phụ thuộc (DI), route, dùng CSS…

## Chạy dự án

```bash
npm install
npm run dev       # phát triển
npm run build     # build ra dist/ (cấu hình hiện tại: một file index.html)
npm run preview   # xem thử bản build
```

**Build (từ M4.2):** `vite-plugin-singlefile` được bật lại (`useRecommendedBuildConfig`, `cssCodeSplit: false`, `assetsInlineLimit` lớn) cùng `vite-plugin-monaco-editor`; theo cấu hình này `npm run build` cho ra một file `index.html`. Nếu mở thẳng bằng file:// không chạy thì phục vụ qua http (`npm run preview`).
`vite.config.single.js` dùng cùng plugin và xuất ra `dist-single/`.

**Yêu cầu trình duyệt:** cần WebGL (Sigma.js) và Web Worker. Chrome / Edge dùng `showDirectoryPicker` (duyệt thư mục nhẹ, chỉ giữ handle); Firefox / Safari tự chuyển sang `<input webkitdirectory>`.

## Cách dùng

1. Bấm **📁 Folder dự án** và chọn thư mục. Có thể là cả solution lớn (hàng chục nghìn file); tiến độ hiện trên thanh điều khiển.
2. Màn hình **Tổng quan**: mỗi node là một project (to hơn = nhiều node hơn), số trên cạnh là số tham chiếu giữa hai project. Rê chuột để xem thống kê, bấm để mở project.
3. Màn hình **project**: các file của project đó, kèm node của project khác mà nó dùng hoặc được dùng (vẽ nhỏ, nhạt màu, gọi là *ghost*).
   - **Bấm** một node để làm nổi bật liên kết của nó (xanh = gọi đi, cam = được gọi); bảng thông tin hiện đường dẫn, loại, số liên kết và các ký hiệu (symbol) được định nghĩa trong file.
   - **Bấm đúp** node của project khác (hoặc nút "Mở … →" trong bảng thông tin) để nhảy sang project đó, node đó được chọn sẵn.
   - Chuyển nhanh giữa các project bằng ô chọn trên thanh điều khiển. Bố cục mỗi màn hình được giữ trong Worker, mở lại là hiện ngay.
4. Nếu thư mục chỉ có một project, app mở thẳng vào chi tiết project đó.

### Các nút điều khiển

| Nút | Tác dụng |
| --- | --- |
| **Gồm thư viện & mã sinh tự động** | Bật lại những file bị bỏ qua mặc định (xem bên dưới) rồi phân tích lại thư mục đang mở; đồng thời hiện thêm node *Thư viện ngoài* |
| **Tổng quan › [chọn project]** | Điều hướng giữa các màn hình |
| **Sắp xếp lại / ⏸ Dừng sắp xếp** | Chạy lại bố cục từ vị trí ban đầu mới, hoặc dừng và giữ bố cục hiện tại |
| **Vừa khung** | Đưa camera về toàn bộ sơ đồ |
| **Báo cáo** | Mở báo cáo cấu trúc dạng Markdown, có nút **Chép Markdown** |
| **Ẩn node độc lập / Ẩn node có liên kết / Hiện tất cả** | Xoay vòng 3 trạng thái lọc node (chỉ bật khi có cả hai loại node) |
| **Hình dạng node** (ở bảng chú thích) | Chọn hình riêng cho từng loại node; được lưu trong `localStorage` |

### Chú thích màn hình project

- **Loại node** (màu + hình dạng mặc định): Component (xanh lá, tròn), JS / TS (vàng, kim cương), Back-end (xanh da trời, vuông), HTML (cam, tam giác), CSS (xanh ngọc, elip), API endpoint (đỏ, vuông), Route (chàm, ngũ giác), Thư viện ngoài (xám, lục giác).
- **Nhóm cạnh** (màu): Import / dùng, Kế thừa, Tiêm phụ thuộc, Gọi API, Sự kiện / emit, Route, CSS, và cạnh sang project khác.
- **Nét nhạt** = quan hệ suy đoán (khớp theo tên / mẫu URL), không phải liên kết tường minh.

## Báo cáo cấu trúc

Nút **Báo cáo** sinh ra văn bản Markdown cho toàn bộ dự án: số file và ngôn ngữ, framework nhận diện được, các loại quan hệ, điểm khởi đầu (entry), file trung tâm (được tham chiếu nhiều nhất), file phụ thuộc nhiều nhất, vòng phụ thuộc (import vòng tròn), cầu nối front-end ↔ back-end (endpoint không ai gọi, lời gọi API không có back-end), và file không được ai tham chiếu (có thể là mã chết hoặc được framework gọi ngầm).

## Ngôn ngữ và framework hỗ trợ

| Ngôn ngữ | Đuôi file | Cách phân tích |
| --- | --- | --- |
| JavaScript / TypeScript | `.js .jsx .mjs .cjs .ts .tsx .mts .cts` | `@babel/parser` (React, Pinia, router, hook, context…) |
| Vue | `.vue` | `@vue/compiler-sfc` (component, emit, provide/inject…) |
| HTML | `.html .htm` | `parse5` |
| CSS | `.css .scss .sass .less .pcss` | `postcss`, `postcss-scss`, `postcss-selector-parser` (gợi ý class CSS không thấy nơi dùng) |
| Java / Kotlin | `.java .kt .kts` | Parser nhẹ dựa trên regex |
| C# | `.cs` | Parser nhẹ dựa trên regex |
| Python | `.py` | Parser nhẹ dựa trên regex |

Framework phía server được nhận diện **sau** khi parse (trong `frameworks/index.js`): **Spring** (controller / service / repository, `@Autowired`, Spring Data, `@FeignClient`), **ASP.NET** (controller, route, DI, minimal API) và **Flask / FastAPI / Django**. Framework front-end (Vue, React, Pinia, Router…) được nhận diện ngay trong adapter JS/Vue.

Cấu hình dự án được đọc để giải quyết import chính xác hơn: `package.json`, `tsconfig` / `jsconfig` (`paths`), `vite|vitest|webpack|vue.config` (alias, đọc bằng heuristic, không chạy file), `components.d.ts` (unplugin-vue-components), `pom.xml` / `build.gradle`, `.csproj` (`<Using>` toàn cục), `requirements.txt` / `pyproject.toml`… Alias `@` → `src` được thêm mặc định cho dự án Vite / Vue CLI nếu chưa khai báo.

## Project được nhận diện thế nào

- Thư mục chứa file đánh dấu **ngoài cùng** là một project: `.csproj` / `.vbproj` / `.fsproj` / `.sqlproj`, `package.json`, `pom.xml`, `build.gradle(.kts)`, `pyproject.toml`, `setup.py`, `go.mod`, `Cargo.toml`, `composer.json`. (Lấy ngoài cùng để `package.json` nằm trong `Scripts/` không tách project web làm đôi.)
- File không nằm trong thư mục đánh dấu nào: mỗi thư mục cấp 1 là một project; file ở thư mục gốc thuộc project `(thư mục gốc)`.
- Nếu thư mục gốc cũng có file đánh dấu, mọi file không thuộc project con sẽ thuộc project gốc (mang tên thư mục đã chọn).
- Endpoint / route thuộc project của file định nghĩa nó.

## Những gì bị bỏ qua

- **Luôn bỏ qua:**
  - Thư mục bắt đầu bằng dấu chấm (`.git`, `.vs`, `.idea`…) và `node_modules`, `bin`, `obj`, `dist`, `build`, `out`, `target`, `coverage`, `testresults`, `packages`, `__pycache__`, `venv`, `env`, `storybook-static`.
  - File nhị phân (ảnh, font, `.dll`, `.zip`, `.pdf`…), file khoá (`package-lock.json`, `yarn.lock`…), `*.min.js|css`, `*.map`, `*.d.ts`.
  - File lớn hơn **1 MB**.
  - File khớp `.gitignore` ở thư mục gốc (khi **không** bật *Gồm thư viện & mã sinh tự động*).
- **Bỏ qua mặc định** (bật lại bằng ô *Gồm thư viện & mã sinh tự động*):
  - Thư viện JS/CSS: theo tên (jquery, bootstrap, moment, lodash…), theo thư mục (`lib`, `libs`, `vendor`, `bower_components`, `third-party`…), hoặc nhận ra qua nội dung (banner bản quyền `/*!`, `@license`, khung UMD).
  - Mã sinh tự động: `Service References`, `Connected Services`, `*.Designer.cs`, `*.g.cs`, `*.generated.cs`, `Reference.cs`, `AssemblyInfo.cs`, `*.intellisense.js`, `*-vsdoc.js`, `*.bundle.js`, `*.chunk.js`…
  - Riêng C#: adapter luôn bỏ qua `*.Designer.cs`, `*.g.cs`, `AssemblyInfo.cs` và thư mục `Migrations/` (không phụ thuộc ô chọn này).
  - Danh sách nằm ở đầu `src/analyzer/01-collect-files.js` (`VENDOR_NAME`, `VENDOR_FOLDERS`, `GENERATED_NAME`…) nếu cần chỉnh.

Comment được che đi trước khi phân tích, nên tên hàm nằm trong comment không bị tính là lời gọi.

## Kiến trúc

```
src/
├── main.js, style.css, App.vue     khởi động + layout (TopBar + GraphView)
├── components/TopBar.vue           thanh điều khiển
├── stores/                         Pinia: workspace (phân tích), graph (Sigma), settings, selection, layout, search
├── core/                           lõi dùng chung (path, ignore-rules, source, mask-comments) — có test: npm test
├── features/explorer               danh sách file + tìm kiếm tên / symbol / nội dung (Ctrl K)
├── features/diagram                sơ đồ class (tab riêng): parser C# / Java / Kotlin / Python, hộp UML, đường nối, bấm để mở mã nguồn
├── features/editor                 panel mã nguồn chỉ đọc (Monaco, tải lười; nhảy dòng, tô sáng từ khoá; dải Định nghĩa · Dùng · Được dùng bởi)
├── features/graph, features/report giao diện sơ đồ (Sigma.js/WebGL) và báo cáo
└── analyzer/
    ├── useAnalyzer.js              composable: cầu nối giao diện ↔ Worker (job mới huỷ job cũ)
    ├── analyzer.worker.js          Web Worker: phân tích, chia project, tính bố cục, giữ toàn bộ mô hình
    ├── pipeline.js                 nối các bước 01 → 06
    ├── 01-collect-files.js         quét thư mục, lọc (thư mục, nhị phân, vendor, .gitignore, >1 MB)
    ├── 02-project-config.js        đọc cấu hình dự án: framework, alias, gốc Python, using C#…
    ├── 03-assign-adapters.js       gán mỗi file cho một language adapter theo đuôi file
    ├── 04-pass1-index.js           lượt 1: parse từng file, nhận diện framework, lập chỉ mục ký hiệu
    ├── 05-pass2-resolve.js         lượt 2: biến tham chiếu thành cạnh (có độ tin cậy certain / inferred)
    ├── 06-build-graph.js           dựng đồ thị graphology trung lập (file, endpoint, route, external)
    ├── 07-views.js                 báo cáo Markdown, lọc/gom nhóm, vòng phụ thuộc, Mermaid…
    ├── 08-view-model.js            chia theo project, dựng màn hình Tổng quan và vùng project
    ├── layout.js                   ForceAtlas2 theo từng đợt, huỷ được giữa chừng
    ├── node-shapes.js              chương trình WebGL vẽ node nhiều hình dạng
    ├── utils.js                    đường dẫn, id node, chuẩn hoá URL, tiện ích parse dùng chung
    ├── adapters/                   javascript, vue, html, css, jvm (Java/Kotlin), csharp, python (+ clike.js dùng chung)
    └── frameworks/index.js         Spring, ASP.NET, Flask/FastAPI/Django
```

### Luồng xử lý

```
Chọn thư mục ─► [luồng chính] liệt kê handle/file nhẹ
                     │
                     ▼  postMessage
              [Web Worker]
   01 collectFiles ► 02 projectConfig ► 03 assignAdapters
        ► 04 pass1 (parse + chỉ mục) ► 05 pass2 (nối cạnh) ► 06 buildGraph
        ► 08 viewModel (chia project) ► layout (ForceAtlas2)
                     │
                     ▼  graph / positions / layout-done
              Giao diện (Sigma.js)
```

- **Hai lượt** vì khi file A tham chiếu B thì B có thể chưa được parse: phải biết hết định nghĩa (lượt 1) rồi mới nối tham chiếu (lượt 2).
- **Tiết kiệm bộ nhớ:** luồng chính chỉ liệt kê file; Worker tự đọc từng file và giải phóng nội dung ngay sau khi parse. Giao diện chỉ nhận phần đồ thị của màn hình đang xem, không giữ cả mô hình.
- **Bố cục:** ForceAtlas2 chạy theo từng đợt, mỗi đợt gửi vị trí về giao diện để sơ đồ "chuyển động" dần; chuyển màn hình hoặc bấm *Dừng* sẽ huỷ ngay. Đồ thị ≥ 5.000 node: cạnh không có mũi tên, ẩn cạnh/nhãn khi kéo hoặc zoom.
- **Dùng lại một Sigma** cho mọi màn hình (chỉ thay đồ thị + cài đặt) để chuyển màn hình không chậm dần.

### Thêm ngôn ngữ / framework mới

- **Ngôn ngữ:** viết adapter theo interface `{ id, extensions, match?, analyze(sf, text, ctx) => Unit }` (xem `adapters/index.js`, tạo unit bằng `createUnit` trong `utils.js`) rồi thêm vào mảng `defaultAdapters`. Muốn thay regex bằng tree-sitter chỉ cần viết lại `analyze`, miễn là trả về cùng dạng Unit.
- **Framework phía server:** thêm detector `{ id, appliesTo(unit, config), run(unit, config) }` vào `frameworkDetectors` trong `frameworks/index.js`.

## Giới hạn

- Node là **file**, chưa phải từng class / hàm; ký hiệu định nghĩa trong file (tối đa 12 mục) chỉ hiện trong bảng thông tin khi chọn node. Quan hệ method C#/Java được tính cho file chứa nó.
- Bộ phân tích Java / Kotlin / C# / Python dựa trên biểu thức chính quy, không phải trình biên dịch, nên có thể sót hoặc nhầm trong các cú pháp phức tạp; các liên kết khớp theo tên / URL được đánh dấu *suy đoán* (nét nhạt).
- `vite.config` / `webpack.config` là mã thực thi nên không được chạy, chỉ đọc khối `alias` bằng heuristic. `tsconfig` dùng `extends` sang file khác chưa được xử lý.
- File lớn hơn 1 MB bị bỏ qua. Dự án cực lớn có thể hết bộ nhớ của Worker: hãy chọn thư mục nhỏ hơn hoặc bỏ chọn *Gồm thư viện & mã sinh tự động*.
- Giao diện hiện bằng tiếng Việt.

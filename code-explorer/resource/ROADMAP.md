# Code Explorer — lộ trình gộp 3 project

Gộp **mind-map** (nền), **code-viewer** và **class-diagram** thành một ứng dụng khám phá mã nguồn:

```
Tổng quan (project)  →  Project (file)  →  File (class + thành viên)
     mind-map              mind-map            class-diagram
                     Editor / tìm kiếm: code-viewer
```

## Trạng thái

| Mốc | Nội dung | Trạng thái |
| --- | --- | --- |
| **M0** | Tách `App.vue` của mind-map, dựng store | **Xong**, đã thử tay |
| **M1** | Lõi chung: `core/path.js`, `ignore-rules.js`, `source.js`, `mask-comments.js` | **Xong**, đã thử tay |
| **M2** | Editor chỉ đọc: bấm node → mở file trong panel bên phải (Monaco tải lười), kéo thanh chia đôi, "Ẩn comment" | **Xong**, đã thử tay (build đã được sửa — xem "Ghi chú build") |
| **M3** | Explorer (danh sách file, chip đuôi file) + tìm kiếm tên / symbol / nội dung (Worker), làm nổi bật node trên sơ đồ, nhảy dòng và tô sáng từ khoá trong editor | **Xong**, đã thử tay |
| **M4** | Dải quan hệ trong editor: **Định nghĩa · Dùng · Được dùng bởi**, nhảy tới dòng định nghĩa / dòng đang dùng, kể cả sang project khác và qua lời gọi API | **Xong**, đã thử tay (lỗi lệch số "Dùng / Được dùng bởi" giữa bảng thông tin node và dải quan hệ đã được bạn sửa ở M4.2) |
| **M5** | Sơ đồ class **C#** cho các file đang chọn: tab riêng, bấm class / thành viên nhảy tới đúng dòng, nhiều file, namespace | **Xong**, đã thử tay |
| **M5b** | Sơ đồ class **Java**, **Kotlin** và **Python** cho các file đang chọn (Kotlin có parser riêng, không dùng chung với Java) | **Xong phần mã** — 111 test qua; **chờ thử tay** (checklist M5b) |

**Đã bỏ khỏi phạm vi:** sửa và lưu file ra đĩa, phân tích lại từng file. Ứng dụng chỉ đọc.

## Bản đồ: mã của hai project kia sẽ vào đâu

| Nguồn | Đích | Thay đổi cần làm |
| --- | --- | --- |
| code-viewer `components/CodeEditor.vue` | `features/editor/EditorPanel.vue` (**đã làm ở M2**, bản chỉ đọc) | Bỏ sửa/lưu/tải về (không làm), nạp Monaco lười, đọc qua `workspace.readFile`. Tô sáng từ khoá và nhảy dòng đã làm ở M3 |
| code-viewer `App.vue` (sidebar, chip đuôi file, tìm kiếm) | `features/explorer/` + `stores/search.js` + `core/search.js` (**đã làm ở M3**) | Tìm nội dung chuyển sang Worker (quét theo lô, huỷ được); thêm tìm theo symbol và tên file xếp hạng; danh sách ảo hoá; làm nổi bật node trên sơ đồ |
| code-viewer `utils/stripComments.js` | `core/mask-comments.js` (**đã chuyển ở M1**) | Nối vào nút "Dọn comment" của editor ở M2 |
| code-viewer `utils/file.js` (`formatSize`…) | `utils/` | Lấy khi cần ở M2 |
| class-diagram `utils/csharp.js` | `features/diagram/parsers/csharp.js` | Thêm `line`, id theo namespace, nối kiểu theo `using`, nhiều file (đã làm ở M5); phần nối quan hệ chuyển sang `parsers/relations.js` dùng chung |
| class-diagram `utils/diagram.js` | `features/diagram/layout.js` | Giữ nguyên (hàm thuần) |
| class-diagram `ClassBox.vue`, `DiagramsView.vue`, `stores/diagram.js` | `features/diagram/` | Bỏ panel Source riêng; store đổi từ "một đoạn source" sang "tập file đang chọn"; khoá vị trí theo (file + class) |
| class-diagram `MonacoEditor.vue`, `Icon.vue` | (bỏ) | Dùng chung editor và bootstrap-icons |

## Quyết định đã chốt

- Làm trên bản sao mới, không sửa hai project gốc; JavaScript (không TypeScript).
- **Chỉ đọc**: không làm sửa/lưu file ra đĩa (đã bỏ khỏi phạm vi; trước đây là mốc M5).
- **Một bộ quy tắc lọc file** (`core/ignore-rules.js`) = bộ của analyzer. Danh sách trắng đuôi file của code-viewer **bỏ**: mọi thư mục nó loại đều đã được bộ chung loại, còn đuôi lạ (`.csproj`, `.ps1`…) giờ hiển thị như văn bản thường. Hai giới hạn kích thước tách rõ: phân tích (`MAX_ANALYZE_SIZE`) và xem trong editor (`MAX_VIEW_SIZE`) — hiện cùng đặt 3 MB (bạn chỉnh ở M4.2).
- **Path do `core/source.js` quyết định, ngay trên luồng chính**: chuẩn hoá và gỡ tên thư mục gốc rồi mới gửi sang Worker (Worker không gỡ nữa). Nhờ vậy `node.file` ≡ khoá của `source.read(path)` ở cả Chrome/Edge lẫn Firefox/Safari.
- **Bộ che comment: đã gom về một module + một bộ test, KHÔNG gộp vòng quét (quyết định cuối ở M5).** `maskComments` (giữ nguyên vị trí), `stripComments` (xoá hẳn) và `clean()` của parser class có hợp đồng khác nhau. Kế hoạch cũ là gộp ở M5; đã đổi: parser class giữ nguyên `clean()` và chỉ thêm **bản đồ vị trí** về văn bản gốc (để biết dòng thật), nên kết quả parse không đổi và được đối chiếu với parser gốc bằng test. Gộp bộ quét chỉ đổi rủi ro lấy lợi ích nội bộ, không thêm tính năng nào.
- **Editor (M2)**: chỉ đọc; Monaco nạp bằng `import()` ở lần mở file đầu tiên; mỗi file một model (tối đa 24, bỏ cái lâu chưa dùng) và nhớ vị trí cuộn; bỏ chọn trên sơ đồ thì panel **giữ file đang xem**; chọn lại đúng node đang chọn thì mở lại panel (`selection.tick`); mở thư mục khác thì panel đóng. Độ rộng panel luôn chừa tối thiểu 280 px cho sơ đồ.
- **Sơ đồ class (M5)** là một tab riêng ở giữa (**Sơ đồ file | Sơ đồ class**), vẽ bằng DOM + SVG (không vẽ trên Sigma); tab sơ đồ file được `v-show` nên Sigma giữ nguyên khi chuyển tab. Parser chọn theo đuôi file (`features/diagram/parsers/index.js`).
- **"Các file đang chọn"** có hai chế độ: *Theo file đang chọn* (mặc định: sơ đồ luôn vẽ file đang chọn nếu có parser; file chưa hỗ trợ thì giữ sơ đồ cũ và báo) và *ghim* (người dùng tự gom nhiều file bằng nút "+ Thêm file đang chọn", Ctrl/Cmd + bấm trong Explorer, hoặc nút "Sơ đồ class" ở header editor). Chỉ đọc và parse khi tab class đang mở, và không đọc lại khi tập file không đổi.
- **Parser C# được CHUYỂN từ class-diagram bằng cách vá file gốc** (không viết lại): id = tên đầy đủ có namespace (hai class `User` ở hai namespace không còn bị trộn — lỗi của bản gốc); nối kiểu theo thứ tự duy nhất trong tập → qualifier (`B.User`) → cùng namespace → namespace được `using`, mơ hồ thì **không vẽ** quan hệ; class `partial` ở nhiều file gộp thành một hộp, mỗi thành viên nhớ file và dòng của nó; số dòng tính trên file GỐC (kể cả khi có comment nhiều dòng, chuỗi verbatim, `#region`, attribute). Kiểu lồng `Outer.Inner` giờ chỉ nối tới `Inner` (bản gốc nối thêm tới `Outer`); kiểu lồng vẫn là hộp riêng như bản gốc.
- **Bấm class → mở mã nguồn tại dòng khai báo; bấm thành viên → tại dòng của thành viên** (qua `graph.openFile`, dùng lại cơ chế nhảy dòng từ M3). Dịch chuyển dưới 4px vẫn tính là bấm; kéo mới di chuyển hộp. Vị trí hộp được giữ trong phiên (theo id đầy đủ) nhưng không lưu qua lần tải lại. Tối đa 60 class mỗi sơ đồ (đường nối A* tính lại mỗi khi kéo); vượt thì vẽ 60 class đầu và báo.
- **Một nguồn cho số "Dùng / Được dùng bởi" (sửa ở M4.2)**: bảng thông tin node và dải quan hệ đều lấy từ `workspace.related`. Với node file số này là của TOÀN mô hình (không còn nhãn "trong màn hình này"); node endpoint / route / thư viện ngoài vẫn hiện bậc trong màn hình với nhãn đó. Kết quả bất đồng bộ chỉ được ghi nếu node đó vẫn đang được chọn.
- **Dải quan hệ (M4)** nằm ngay dưới tên file trong editor, ba tab dạng danh sách thả xuống phủ lên editor: **Định nghĩa** (symbol của file + dòng), **Dùng** (cạnh đi ra), **Được dùng bởi** (cạnh đi vào). Dữ liệu tính trong Worker từ đồ thị ĐẦY ĐỦ (`analyzer/related.js`; giao diện chỉ giữ đồ thị của màn hình hiện tại) qua message `related` có `requestId`, không mang `job`, trả lời ngay từ bộ nhớ.
- **Nhảy đúng dòng nhờ `locs` và `labels` của cạnh**: *Dùng* → mở file được dùng ở **dòng định nghĩa** của tên đang dùng (tra `labels` trong `symbols` của file đích) và liệt kê **các dòng dùng ngay trong file hiện tại**; *Được dùng bởi* → mở file kia ở **dòng nó dùng mình**. Hai chiều gộp mọi cạnh giữa hai file thành một mục (nhiều loại quan hệ, nhiều tên).
- **Gọi API xuyên project**: cạnh `calls-api` đi tới node endpoint; dải nối tiếp tới FILE định nghĩa endpoint (cạnh `exposes` đi vào endpoint, kèm dòng định nghĩa) — và chiều ngược lại cho file controller. Mục suy đoán (khớp theo tên / URL) có dấu ≈. Thư viện ngoài chỉ hiện số lượng.
- **Giới hạn của dữ liệu**: `import` của JS/TS không mang tên symbol (nhãn chỉ có `dynamic` / `type`) nên không tra được dòng định nghĩa — mở đầu file nhưng vẫn có "dùng ở dòng…". C# (`using`), render component, kế thừa, tiêm phụ thuộc có tên nên nhảy đúng. Mỗi danh sách tối đa 200 mục, 8 tên và 6 dòng mỗi mục.
- **Tìm kiếm (M3)**: một ô, ba loại kết quả xếp thành ba mục — *Tên file* (luồng chính, tức thì, mọi từ phải khớp, tên file bắt đầu bằng từ khoá xếp trên), *Symbol* (Worker, từ mô hình phân tích; bỏ symbol kiểu `variable`), *Nội dung* (Worker, đọc file theo lô 32, kết quả về dần, gõ tiếp thì huỷ). So khớp **chuỗi con, không phân biệt hoa thường** (chưa có regex / nguyên từ). Giới hạn: 500 file nội dung, 1000 lần khớp mỗi file, 200 symbol, 500 tên file hiển thị; chỉ quét file trong giới hạn phân tích (hiện 3 MB) và bỏ file nhị phân.
- **Tìm kiếm chạy trong CHÍNH Worker phân tích** (không tách worker riêng): tận dụng `entries` mà Worker đã nhận ở `load`, không phải clone handle lần nữa. Message tìm kiếm mang `searchId`, **không mang `job`** và được xử lý trước dòng `currentJob = msg.job` — vì mỗi message có `job` mới sẽ huỷ bố cục đang chạy. Nếu thấy bố cục chậm khi đang quét nội dung thì tách worker riêng.
- **Danh sách file** = chính các file analyzer đã nhận (`result.paths`), gồm cả file không có node (README, `.csproj`, `.json`…). Mỗi path kèm project của nó (`fileIndex`: `paths`, `projectIds`, `pidx`). Danh sách phẳng (như code-viewer), ảo hoá để chịu hàng chục nghìn file.
- **Mở file từ Explorer / kết quả = `graph.openFile`**: file ở project khác màn hình đang xem thì chuyển project trước, rồi chọn node và căn camera ngay khi sơ đồ dựng xong (`pendingOpen`); file không có node thì chỉ mở editor. Khi đang tìm, node có kết quả nổi lên và phần còn lại mờ đi (ở Tổng quan: các project có kết quả); chọn một node thì quy tắc "đang chọn" được ưu tiên.
- **Nhảy dòng và tô sáng**: `selection.line` / `selection.query`. Số dòng của kết quả theo bản **gốc**, nên nếu "Ẩn comment" đang bật thì tự tắt rồi mới nhảy. Chọn node thường (không qua tìm kiếm) xoá tô sáng.
- **Phím tắt**: Ctrl/Cmd + K (bắt ở pha capture nên dùng được cả khi con trỏ đang ở editor), ↑ ↓ chọn hàng, Enter mở (Enter ngay sau khi gõ = tìm ngay), Esc xoá ô tìm; chip đuôi file: Alt + bấm = chỉ chọn đuôi đó.
- **"Ẩn comment"** chỉ đổi cách hiển thị (`stripComments` với đuôi file thật — code-viewer cũ luôn truyền `'cs'` cho mọi file), không đổi file; bản đã ẩn comment dùng model riêng.
- **Theme editor đang cố định sáng** (cả ứng dụng còn ghi cứng màu sáng); chuyển sang bảng màu sáng/tối chung ở bước `styles/tokens.css`.
- **Không nạp nội dung file vào luồng chính.** Giữ handle/File, đọc theo yêu cầu (giữ khả năng chịu hàng chục nghìn file của mind-map).
- Một quy ước path duy nhất; `stores/selection.js` là nguồn sự thật cho "đang chọn gì" (sơ đồ file, editor, sơ đồ class cùng đọc/ghi).
- Sơ đồ class: **chỉ hiện class của các file đang chọn**, parse **theo yêu cầu** (không nhét vào pipeline toàn dự án), giới hạn ~50-60 class mỗi sơ đồ. Không làm "thêm lớp liên quan" ở bản đầu.
- Sơ đồ class là chế độ xem riêng (DOM + SVG, tab chuyển với sơ đồ file), không vẽ trên Sigma.
- Monaco và `features/diagram` tải lười để màn hình sơ đồ file vẫn nhẹ. Cấu hình Monaco = hợp của hai project (css/html/json/typescript + csharp/java/python).
- Một bộ màu sáng/tối chung (`styles/tokens.css`) — hiện mind-map còn ghi cứng màu sáng.
- **Parser Java / Kotlin / Python (M5b)** viết mới theo cùng mô hình dữ liệu với C# (`Type`, `Member`, `Relation`), đăng ký bằng một dòng trong `parsers/index.js`. Mỗi ngôn ngữ được parse riêng; quan hệ chỉ nối trong cùng một ngôn ngữ (cùng một sơ đồ có thể trộn nhiều ngôn ngữ).
- **Kotlin KHÔNG phải Java đổi đuôi `.kt`**: kiểu viết sau tên (`val a: Int`), `fun`/`val`/`var`, constructor chính tự tạo thuộc tính (chỉ `val`/`var`), kế thừa bằng `:` (có `(…)` = lớp cha, không có = interface), `data class`/`object`/`companion object`/`sealed`/`enum class`/`fun interface`, gần như không có `;` (thành viên được cắt theo dòng và theo `;` ngoài ngoặc). Vì vậy có `parsers/kotlin.js` riêng. Ánh xạ vào hộp UML: `data class` → «record», `object` → «static», `sealed` → abstract, `annotation class` → interface, thành viên `companion object` → static của lớp ngoài.
- **Bộ che chuỗi/comment dùng chung cho ba parser mới** (`parsers/common.js`, `maskSource`): trả về văn bản CÙNG ĐỘ DÀI nên số dòng khớp tuyệt đối với file gốc mà không cần bản đồ vị trí như C#. Mỗi ngôn ngữ một cấu hình: Java (`//`, `/* */`, text block), Kotlin (comment lồng nhau, `${…}` chứa chuỗi lồng, raw string không có escape), Python (`#`, chuỗi ba nháy, escape).
- **Nối quan hệ dùng chung** (`parsers/relations.js`, tách ra từ parser C# và vẫn được đối chiếu với parser gốc bằng test): duy nhất trong tập → qualifier → kiểu lồng trong chính nó → cùng namespace → mục được nạp; mơ hồ thì không vẽ. `extends` → kế thừa, `implements` → thực thi (Java đánh dấu rõ; Kotlin / C# suy ra từ loại của kiểu đích).
- **Namespace theo ngôn ngữ**: Java = `package` (kiểu lồng: `package.Outer`); Kotlin = `package`; Python = module suy ra từ đường dẫn (`pkg/mod.py` → `pkg.mod`, `__init__.py` → `pkg`). Python chỉ coi một tên là nhìn thấy khi được import đích danh (`from m import X`) hoặc `import *`; import tương đối (`from .x import Y`) được quy đổi theo vị trí file; `import a.b` được xử lý qua qualifier `a.b.Tên`.
- **Python**: khối theo thụt lề; `@dataclass`/`NamedTuple`/`TypedDict` → «record», `Enum` → enum (hằng số là giá trị), `Protocol` → interface, `ABC`/`@abstractmethod` → abstract; `@property` → thuộc tính, `setter` trùng tên bị bỏ; thuộc tính lấy từ annotation cấp lớp và từ `self.x = …` trong `__init__` / `__post_init__` (kiểu từ annotation, từ tham số cùng tên, hoặc từ `Foo(...)`); forward ref `'Foo'` được bỏ dấu nháy; `__x` → private, `_x` → protected.
- **Build (bạn chỉnh ở M2.2 → M4.2)**: ở M2.2 bạn tắt `viteSingleFile` để build chạy được; ở M4.2 bạn bật lại với `useRecommendedBuildConfig: true`, kèm `cssCodeSplit: false` và `assetsInlineLimit` rất lớn trong `vite.config.js`, vẫn giữ `vite-plugin-monaco-editor`. Theo cấu hình hiện tại `npm run build` cho ra một file `index.html`. Hướng nhúng worker bằng `?worker&inline` (M2.1) đã thử và bỏ.
- **Lưu trạng thái giao diện (M4.2)**: bạn đã tắt phần GHI `localStorage` cho độ rộng panel và hình dạng node; mã chỉ còn ĐỌC giá trị cũ (nếu có), nên các thiết lập này không được nhớ sau khi tải lại. Bấm đúp node ghost để sang project khác cũng đã bị tắt.

## Cấu trúc hiện tại (sau M5b)

```
src/
├── main.js, style.css        # style.css: kiểu nút dùng chung + kiểu decoration của Monaco (.find-hit, .jump-line)
├── App.vue                   # layout: TopBar + [Explorer | tab Sơ đồ file / Sơ đồ class | Editor]; phím Ctrl K
├── components/               # TopBar, SplitHandle (thanh kéo chia đôi)
├── stores/
│   ├── workspace.js          # thư mục đang mở, kết quả phân tích, cầu nối Worker; fileIndex, search(), related()
│   ├── graph.js              # Sigma/graphology: vẽ, làm nổi bật, lọc node; openFile, setHighlight
│   ├── settings.js           # includeVendor, hình dạng node
│   ├── selection.js          # file/node đang chọn (+ line, query, tick)
│   ├── layout.js             # Explorer + Editor: mở/đóng, độ rộng; tab ở giữa (centerTab); ẩn comment
│   ├── search.js             # ô tìm, kết quả (tên · symbol · nội dung), lọc đuôi file, làm nổi bật
│   └── diagram.js            # sơ đồ class: tập file (theo dõi / ghim), parse, vị trí và kích thước hộp
├── core/                     # lõi dùng chung, KHÔNG phụ thuộc Vue/DOM (chạy được trong Node → có test)
│   ├── path.js, ignore-rules.js, source.js, mask-comments.js, search.js
├── features/
│   ├── graph/                # GraphView, GraphLegend, NodeInfo, constants
│   ├── explorer/             # ExplorerPanel (Ctrl + bấm = thêm vào sơ đồ class), VirtualList, virtual-list.js
│   ├── editor/               # EditorPanel, RelationsBar, useMonaco, languages, panel-width
│   ├── diagram/              # DiagramView, ClassBox, layout.js (xếp tầng + đi dây A*), diagram-view.css
│   │   └── parsers/          #   index.js (chọn parser theo đuôi file), csharp.js, java.js, kotlin.js, python.js,
│   │                         #   common.js (che chuỗi/comment, đếm ngoặc), relations.js (nối quan hệ dùng chung)
│   └── report/ReportPanel.vue
├── utils/format.js           # fmt, formatSize
└── analyzer/                 # Worker phân tích + tìm kiếm + truy vấn quan hệ (related.js)
tests/                        # npm test (node:test); fixtures/ chứa parser GỐC của class-diagram để đối chiếu
vite.plugins.js               # plugin Vite dùng chung cho vite.config.js và vite.config.single.js
```

Phụ thuộc một chiều: `search → graph → workspace → settings`, `layout → workspace`, `graph/layout → selection`; `core/` không import gì ngoài chính nó. Store không import component.

Đọc nội dung file từ bất kỳ đâu: `workspace.readFile(path)` (ném `SourceError` với `.code` = `not-found` | `binary` | `too-large` | `read-error`), cùng `hasFile`, `statFile`, `filePaths`. Workspace không import graph; graph đăng ký "graph sink" qua `workspace.attachGraph()`.

## Checklist thử tay cho M0 (hành vi phải y như mind-map cũ)

```bash
npm install && npm run dev
```

1. Mở thư mục (Chrome/Edge: `showDirectoryPicker`; Firefox/Safari: hộp chọn thư mục) → thấy tiến độ, rồi màn hình Tổng quan.
2. Rê chuột vào node project → hiện bảng thông tin; bấm → vào chi tiết project.
3. Trong project: bấm node → làm nổi bật + bảng thông tin; bấm đúp node mờ (ghost) → nhảy sang project kia, node đó được chọn sẵn *(tính năng bấm đúp đã bị tắt ở M4.2)*.
4. Bật/tắt "Gồm thư viện & mã sinh tự động" → phân tích lại.
5. Đổi hình dạng một loại node ở chú thích → node đổi ngay; tải lại trang vẫn giữ.
6. "Dừng sắp xếp" / "Sắp xếp lại" / "Vừa khung"; nút lọc node 3 trạng thái.
7. "Báo cáo" → hiện Markdown, "Chép Markdown" hoạt động.
8. Mở thư mục thứ hai khi đang có sơ đồ → sơ đồ cũ được xoá sạch, không lỗi.

## Checklist thử tay cho M1

Lần này **bắt buộc thử cả hai chế độ mở thư mục** (Chrome/Edge và Firefox/Safari), vì thay đổi chính là chỗ gỡ tên thư mục gốc.

```bash
npm test          # 27 test cho core/
npm run dev
```

1. Chạy lại checklist M0 (8 bước) — mọi thứ phải y như cũ. Với cùng một thư mục, **số file / node / liên kết** ở thanh trên phải bằng số đã thấy ở M0.
2. Mở một thư mục, bấm một node file, rồi trong Console (chỉ có khi `npm run dev`):
   ```js
   explorer.sel.filePath                                   // vd. 'src/App.vue' — KHÔNG có tên thư mục gốc phía trước
   await explorer.ws.readFile(explorer.sel.filePath)       // trả về nội dung file
   explorer.ws.hasFile(explorer.sel.filePath)              // true
   await explorer.ws.statFile(explorer.sel.filePath)       // { name, ext, size, … }
   explorer.ws.filePaths().length                          // số file nguồn đang giữ
   ```
3. Các lỗi có mã rõ ràng:
   ```js
   await explorer.ws.readFile('khong-co.js').catch((e) => e.code)   // 'not-found'
   await explorer.ws.readFile('anh.png').catch((e) => e.code)       // 'binary'
   await explorer.ws.readFile(explorer.sel.filePath, { maxSize: 10 }).catch((e) => e.code) // 'too-large'
   ```
4. Làm lại bước 2 ở trình duyệt còn lại (đường dẫn kiểu `webkitRelativePath`): `filePath` vẫn phải không có tên thư mục gốc và `readFile` vẫn trả về nội dung.
5. Bật/tắt "Gồm thư viện & mã sinh tự động" → phân tích lại (dùng lại danh sách file của SourceFS), rồi `readFile` vẫn hoạt động.
6. Mở thư mục thứ hai: `explorer.ws.filePaths()` chỉ còn file của thư mục mới.

## Checklist thử tay cho M2

Đã thử tay và qua (lịch sử).

```bash
npm install
npm test
npm run dev
```

1. Chạy lại checklist M0 nhanh (mở thư mục → Tổng quan → vào project): sơ đồ phải y như cũ khi chưa mở editor.
2. Trong một project, **bấm một node file** → panel bên phải mở ra, hiện đường dẫn, "ngôn ngữ · kích thước" và mã có tô màu cú pháp. Lần đầu có thể thấy "Đang đọc file…" một lúc (đang tải Monaco), các lần sau gần như tức thì. Mở thử các loại: `.cs`, `.js`/`.ts`, `.vue`, `.css`, `.json`.
3. Bấm node khác → đổi file. Cuộn file A xuống giữa, sang file B, rồi quay lại A → **phải về đúng chỗ đã cuộn**.
4. **Kéo thanh chia đôi**: sơ đồ co giãn mượt, không bị méo hay trống; kéo hết cỡ vẫn còn một phần sơ đồ; tải lại trang thì độ rộng được nhớ.
5. **"Ẩn comment"**: bật thì comment biến mất, tắt thì trở lại; nút mờ đi với `.md`, `.json`, `.csproj`. File trên đĩa không đổi.
6. **Đóng/mở**: ✕ đóng panel (sơ đồ vẫn giữ node đang chọn và sơ đồ giãn ra lại đủ rộng); nút **Mã nguồn** trên thanh trên mở lại; bấm lại đúng node đang chọn cũng mở lại.
7. Bấm vào khoảng trống của sơ đồ (bỏ chọn) và đổi qua lại Tổng quan / project → panel **vẫn giữ file đang xem**.
8. Node của project khác (ghost, nét mờ) → mở được file; node endpoint / route / thư viện ngoài → **không** làm đổi panel.
9. Mở thư mục khác (hoặc đổi "Gồm thư viện…") → panel tự đóng.
10. Trình duyệt thứ hai (Firefox/Safari, kiểu `webkitdirectory`): bước 2 vẫn mở đúng file.
11. Mở Console (F12): không có lỗi đỏ, nhất là dạng *"Could not create web worker"* hay *"MonacoEnvironment"*.
12. **`npm run build` rồi `npm run build:single`**, mở file build ra và mở một file mã nguồn. Đây là chỗ rủi ro nhất (xem bên dưới).

## Ghi chú build

- Build do bạn tự chỉnh (xem mục "Quyết định" → Build). Tôi **chưa kiểm chứng kết quả build** ở phía tôi (máy tôi không cài được thư viện nên không build được).
- Nếu mở thẳng `index.html` bằng file:// không chạy, hãy phục vụ qua http (`npm run preview` hoặc một web server tĩnh).
- Sigma tự co giãn theo vùng chứa qua `gs.resize()` (ResizeObserver); khi tab "Sơ đồ class" đang mở, vùng vẽ của Sigma bị ẩn (rộng 0) nên `resize()` được bỏ qua và chạy lại khi quay về tab sơ đồ file.

## Checklist thử tay cho M3 (đã thử tay, qua — lịch sử)

```bash
npm install     # không có thư viện mới ở M3
npm test        # 52 test
npm run dev
```

**Danh sách file và bộ lọc**

1. Mở thư mục → **sidebar trái** hiện ra với số file ở đầu và các **chip đuôi file có đếm**; sơ đồ và editor vẫn như M2. Nút **Danh sách file** đóng/mở; kéo thanh chia đôi bên trái đổi độ rộng (nhớ sau khi tải lại, sơ đồ luôn còn chỗ).
2. Bấm chip: chọn thêm / bỏ đuôi; **Alt + bấm** = chỉ chọn đuôi đó; "Tất cả" đặt lại.
3. Bấm một file trong danh sách → editor mở file. Nếu đang ở Tổng quan hoặc project khác, sơ đồ **tự chuyển sang đúng project**, node được chọn và camera căn vào node. File không có node (`README.md`, `.csproj`, `.json`) → chỉ mở editor, sơ đồ giữ nguyên.
4. Bấm một node trên sơ đồ → danh sách **cuộn tới file đó**, hàng có viền xanh.

**Tìm kiếm** (gõ và đợi khoảng 0,25 giây, hoặc nhấn Enter)

5. Gõ tên file (vd. `app vue`): mục **Tên file** hiện tức thì, mọi từ phải khớp, tên bắt đầu bằng từ khoá xếp trên.
6. Gõ tên một class / hàm: mục **Symbol**; bấm → mở file và **nhảy đúng dòng khai báo** (dòng nhấp nháy vàng khoảng 2 giây).
7. Gõ một chuỗi có trong code: mục **Nội dung** hiện dần ("Đang quét x/y"), mỗi file có số lần khớp và dòng trích dẫn có chữ tô vàng; bấm → editor nhảy tới dòng khớp đầu tiên và **tô sáng mọi chỗ khớp** (cả trên thanh cuộn).
8. **Làm nổi bật trên sơ đồ**: khi có truy vấn, node có kết quả nổi lên, còn lại mờ đi; ở Tổng quan là các project có kết quả. Xoá truy vấn → trở lại bình thường.
9. Gõ tiếp khi đang quét → quét cũ dừng, kết quả không bị lẫn. **Quan trọng**: mở một project lớn và gõ tìm ngay khi sơ đồ còn đang sắp xếp — sơ đồ **không được đứng hình**.
10. Phím: **Ctrl+K** (cả khi con trỏ đang ở editor) mở Explorer và focus ô tìm; ↑ ↓ chọn hàng; Enter mở; Esc xoá ô tìm.
11. Bật "Ẩn comment", rồi bấm một kết quả có số dòng → tự tắt ẩn comment và vẫn nhảy đúng dòng.
12. Dự án lớn: danh sách cuộn mượt; mở thư mục khác → danh sách, bộ lọc và ô tìm được đặt lại.
13. Firefox / Safari (`webkitdirectory`): kết quả vẫn mở đúng file. Console (F12) không có lỗi đỏ.

## Ghi chú về M3 (đã thử tay, qua)

- Các API từng ghi là "chưa kiểm chứng" (`getNodeDisplayData` + `camera.animate`, `findMatches` + `createDecorationsCollection`) đã hoạt động khi thử tay.
- Tìm nội dung chạy chung Worker với bố cục; nếu sau này thấy bố cục chậm khi đang quét thì tách worker riêng.
- Chưa có: regex, tìm nguyên từ, phân biệt hoa thường, giới hạn phạm vi theo thư mục. Danh sách tên file chỉ hiện 500 kết quả tốt nhất.

## Checklist thử tay cho M4 (đã thử tay, qua — lịch sử)

```bash
npm test        # 62 test
npm run dev
```

1. Mở một file **có node** (một component, một class…). Dưới tên file xuất hiện **dải mới** với ba nút kèm số: *Định nghĩa · Dùng · Được dùng bởi* (nút có số 0 bị mờ). File không có node (README, `.json`, `.csproj`) → không có dải.
2. **Định nghĩa**: bấm → danh sách symbol của file kèm số dòng; bấm một mục → editor nhảy đúng dòng và dòng nhấp nháy vàng.
3. **Dùng**: bấm → các file mà file này dùng; mỗi mục có loại quan hệ (import, render, kế thừa, tiêm DI, gọi API…), tên được dùng và đường dẫn.
   - Bấm mục → mở file đó **đúng dòng định nghĩa** của tên được dùng, và tên đó được tô sáng. (Với `import` của JS/TS không có tên symbol → mở đầu file: đây là giới hạn của dữ liệu.)
   - Dưới mục có "dùng ở dòng 12 40": bấm số → nhảy tới dòng đó **ngay trong file đang xem**.
4. **Được dùng bởi**: bấm → các file đang dùng file này; bấm mục → mở file đó **đúng dòng nó dùng file này**. Thử với file ở project khác: sơ đồ tự chuyển project, chọn node, editor nhảy dòng.
5. **Gọi API**: mở một file front-end có gọi API → mục *Dùng* có file controller ở back-end (kể cả project khác) với tên kiểu `GET /…` và dấu ≈ (suy đoán); bấm → mở file back-end tại dòng định nghĩa endpoint. Mở chính file controller đó → *Được dùng bởi* liệt kê file front-end gọi nó.
6. Thư viện ngoài hiện dạng "+ n thư viện ngoài" (rê chuột để xem tên).
7. Đóng danh sách: bấm ra ngoài, nhấn Esc, hoặc chọn một mục. Danh sách phủ lên editor (không làm editor co giãn) và **không bị thanh cuộn / minimap của Monaco che**.
8. Chuyển nhanh qua lại nhiều file → dải luôn khớp với file đang xem, không hiện dữ liệu của file trước.
9. Bật "Ẩn comment" rồi bấm một mục có số dòng → tự tắt ẩn comment và nhảy đúng dòng.
10. Mở một project lớn khi sơ đồ còn đang sắp xếp rồi mở dải → dải vẫn phản hồi và **sơ đồ không bị đứng** (truy vấn quan hệ không huỷ bố cục).
11. Console (F12) không có lỗi đỏ.

## Ghi chú về M4 (đã thử tay, qua)

- **Dữ liệu thật của analyzer chưa chạy được ở phía tôi** (máy tôi không có các thư viện phân tích): test dùng đồ thị giả dựng theo đúng cấu trúc cạnh trong `05-pass2-resolve.js` / `06-build-graph.js` (`kind`, `labels`, `locs: { path, line }`, cạnh `exposes`). Nếu một quan hệ nhảy sai dòng, gửi tôi tên hai file và loại quan hệ.
- Quan hệ chỉ chính xác bằng bộ phân tích: nhiều cạnh là suy đoán (dấu ≈).
- Cạnh có hướng ngược (`emits`, `provides`) được liệt kê theo đúng hướng trong đồ thị, giống chữ "Dùng / Được dùng bởi" trên bảng thông tin của sơ đồ.

## Checklist thử tay cho M5 (đã thử tay, qua — lịch sử)

```bash
npm test
npm run dev
```

**Tab và sơ đồ**

1. Mở một thư mục có file C#: phía trên vùng giữa có hai tab **Sơ đồ file | Sơ đồ class**. Tab sơ đồ file chạy y như cũ, và khi quay lại từ tab kia sơ đồ **không bị dựng lại, không đứng hình, kích thước đúng**.
2. Chọn một file `.cs` (bấm node hoặc bấm trong danh sách) rồi sang tab **Sơ đồ class**: thấy hộp UML của các class trong file (tên, kế thừa, thuộc tính, phương thức), các mũi tên kế thừa / thực thi / kết hợp / tập hợp, xếp tầng (lớp cha ở trên).
3. Chế độ **Theo file đang chọn** (nút sáng): chọn file `.cs` khác → sơ đồ đổi theo. Chọn file không phải C# → hiện thông báo vàng và sơ đồ **giữ nguyên** file trước.

**Bấm để mở mã nguồn**

4. **Bấm một class** → editor mở file và nhảy đúng dòng khai báo class (tên được tô sáng). **Bấm một thuộc tính / phương thức** → nhảy đúng dòng của thành viên đó (kể cả khi phía trên có dòng `[Attribute]`). **Kéo** hộp vẫn di chuyển được; chỉ bấm (không kéo) mới mở. Phím Enter khi hộp đang được focus cũng mở.

**Nhiều file và namespace**

5. Bấm **+ Thêm file đang chọn** (hoặc **Ctrl/Cmd + bấm** một file `.cs` trong danh sách, hàng có dấu ◇): sơ đồ gồm class của nhiều file, **quan hệ nối xuyên file**; mỗi file là một chip có ✕ để bỏ; tab "Sơ đồ class" hiện số file. Class `partial` ở nhiều file hợp thành một hộp; bấm thành viên mở đúng file chứa nó. Nút "Theo file đang chọn" đưa về chế độ theo dõi.
6. Hai class cùng tên ở hai namespace hiện thành **hai hộp riêng**; quan hệ nối đúng theo cùng namespace / `using` / qualifier (`B.User`).
7. Nút **Sơ đồ class** ở header editor chuyển tab và thêm file nếu cần. Ctrl + bấm một file không phải `.cs` → mở như thường.

**Thao tác trên sơ đồ**

8. **Xếp tự động**, **Vừa khung**, `−` / `+`: hoạt động. Kéo hộp → đường nối cập nhật và không xuyên qua hộp. Chọn một hộp → các quan hệ của nó nổi lên, còn lại mờ đi. Vị trí đã kéo được **giữ** khi chuyển sang file khác rồi quay lại trong cùng phiên.
9. Chọn các file có tổng hơn 60 class → hiện dòng cảnh báo "Chỉ vẽ 60 / N class".
10. Mở thư mục khác → sơ đồ class và tập file được đặt lại.

**Lỗi đồng bộ đã sửa ở M4.2 (kiểm lại)**

11. Bấm một node file: dòng "Dùng n · Được dùng bởi m" ở bảng thông tin **trùng** với số trên dải quan hệ trong editor và không còn nhãn "(trong màn hình này)". Bấm node endpoint / route / thư viện ngoài vẫn hiện bậc trong màn hình với nhãn đó. Bấm lướt nhanh nhiều node → không hiện nhầm số của node trước.
12. Console (F12) không có lỗi đỏ.

## Ghi chú về M5 (đã thử tay, qua)

- **Parser giữ kết quả cũ**: test đối chiếu với parser GỐC của class-diagram (`tests/fixtures/`) trên 6 mẫu (mẫu của họ, cửa hàng có generic / record / struct / enum, chuỗi verbatim + `#region` + comment lồng, file-scoped namespace + partial + kiểu lồng, đầu vào rác, rỗng) cho kết quả giống hệt. Khác biệt CÓ CHỦ ĐÍCH: id theo namespace, qualifier được giữ, `using`, số dòng.
- **Hiệu năng**: parse chạy trên luồng chính; file ~26 KB mất ~8 ms, trường hợp cực đoan 3 MB (77 nghìn dòng, 4.500 class) khoảng 1,1 giây. Sau parse chỉ vẽ tối đa 60 class.
- **Phạm vi C#**: Thành viên enum chưa có dòng riêng (mở ở dòng khai báo enum). Ràng buộc generic (`where T : …`) không được vẽ thành quan hệ.
- **Chưa chạy giao diện thật ở phía tôi**: các điểm cần xem là phân biệt bấm với kéo (pointer capture), ResizeObserver khi tab sơ đồ file bị ẩn, và `ClassBox` đo kích thước thật trong tab vừa mở.

## Checklist thử tay cho M5b

```bash
npm test        # 111 test
npm run dev
```

Thử trên mã nguồn thật của bạn, mỗi ngôn ngữ một lần. Mọi thao tác bấm / nhiều file / Ctrl + bấm giống hệt M5; ở đây chỉ kiểm tra phần MỚI.

1. **Nhận diện đuôi file**: chọn một file `.java`, `.kt`, `.py` rồi sang tab *Sơ đồ class*: sơ đồ hiện ra (trước M5b sẽ báo "chưa hỗ trợ"). Thông báo vàng của file không hỗ trợ (vd. `.js`) giờ ghi "hiện hỗ trợ: C# (.cs), Java (.java), Kotlin (.kt), Python (.py)". Ctrl + bấm và nút "Sơ đồ class" ở header editor cũng dùng được cho cả ba.
2. **Java**: hộp có đúng loại (class / «interface» / «enum» / «record»); `abstract class` chữ nghiêng; vis `+ - # ~` đúng với `public/private/protected/(không ghi)`; trường tĩnh gạch chân; `int a, b[]` thành hai trường; phương thức generic hiện không kèm `<T …>`; enum liệt kê các hằng số; kiểu lồng nhau (`Outer.Inner`) là hộp riêng. Mũi tên: `extends` (kế thừa), `implements` (thực thi, nét đứt), trường kiểu `List<Foo>` (tập hợp, có `*`), trường kiểu `Foo` (kết hợp).
3. **Kotlin**: `data class` hiện «record» và **mỗi tham số `val`/`var` của constructor chính là một thuộc tính** (tham số thường thì không); `object` hiện «static»; `sealed class` chữ nghiêng; hàm hiện dạng `tên(tham số: Kiểu): KiểuTrảVề`; thành viên của `companion object` hiện như static; thuộc tính không ghi kiểu mà khởi tạo bằng `Foo()` hoặc `mutableListOf<Foo>()` vẫn có quan hệ tới `Foo`. Thử thêm một file có chuỗi mẫu `${…}` và raw string ba nháy chứa dấu `{ }` — sơ đồ không bị vỡ.
4. **Python**: `@dataclass` hiện «record», `Enum` hiện «enum» với các giá trị, `Protocol` hiện «interface», `ABC` chữ nghiêng; `@property` hiện như thuộc tính; `@staticmethod` gạch chân; `self.x` trong `__init__` thành thuộc tính (kiểu lấy từ annotation của tham số, vd. `def __init__(self, repo: Repo): self.repo = repo` → có quan hệ tới `Repo`); `'Foo'` (forward ref) vẫn nối được; `_x` là `#`, `__x` là `-`. Class định nghĩa BÊN TRONG hàm **không** hiện.
5. **Nhảy tới dòng**: bấm class và bấm một thành viên trong từng ngôn ngữ → editor mở đúng file và nhảy đúng dòng (sau decorator / annotation, tức dòng `def` / dòng khai báo, không phải dòng `@…`).
6. **Nhiều module / package**: chọn nhiều file Python hoặc Java, có `import` / `from .x import Y` giữa chúng → mũi tên nối xuyên file đúng; hai class trùng tên ở hai module mà file dùng không import đích danh → **không** có mũi tên (cố ý, tránh nối sai).
7. **Trộn ngôn ngữ**: ghim một file `.java` và một file `.py` vào cùng sơ đồ → cả hai hiện; không có quan hệ chéo giữa hai ngôn ngữ.
8. File Kotlin / Java / Python rất lớn hoặc đang gõ dở (thiếu ngoặc) → không treo, không có lỗi đỏ trong Console.

## Ghi chú về M5b

- **Kiểm chứng ở phía tôi**: 111 test (kèm đối chiếu parser C# với bản gốc sau khi tách phần nối quan hệ), 1.200 đầu vào bị cắt xén / chèn ký tự mở cho ba parser (0 lỗi, lần chậm nhất 49 ms), và đo hiệu năng: file ~3 MB (70–100 nghìn dòng, 14.000 kiểu) mất khoảng 1 giây ở cả ba ngôn ngữ; file điển hình vài chục ms. Chưa chạy trên mã nguồn thật của bạn và chưa chạy giao diện.
- **Đây là parser dựa trên regex và đếm ngoặc, không phải trình biên dịch**. Cố ý KHÔNG bao phủ: lớp cục bộ / ẩn danh trong thân hàm (Java, Kotlin, Python), hàm và thuộc tính mức file không thuộc class nào (Kotlin, Python), thuộc tính Python gán ở method khác ngoài `__init__` / `__post_init__`, alias import (`from m import A as B`), kiểu suy luận phức tạp. Nếu một file cho kết quả sai, gửi tôi đoạn khai báo gây lỗi.
- Kotlin `.kts` (script) và Python `.pyi` (stub) chưa được nhận diện.

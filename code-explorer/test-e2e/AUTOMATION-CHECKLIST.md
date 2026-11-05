# AUTOMATION-CHECKLIST.md — Checklist kiểm thử tự động Code Explorer

Tài liệu này chuyển các yêu cầu và hành vi trong `README.md`, `ROADMAP.md` và `CHECKLIST.md` thành các nhóm kiểm thử có thể tự động hóa. Phạm vi bao gồm unit test, integration test và browser E2E.

> **Phân biệt trạng thái:** repository hiện có script `npm test` chạy `node --test` và thư mục `tests/` với các test lõi/parser. `package.json` hiện chưa khai báo Playwright, Cypress hoặc script E2E. Vì vậy, các mục E2E bên dưới là đặc tả cần triển khai, không phải tuyên bố rằng chúng đã chạy hoặc đã có sẵn.

---

## 1. Mục tiêu và phạm vi

- [ ] Tự động xác minh logic lõi: chuẩn hóa đường dẫn, quy tắc bỏ qua file, đọc nguồn, che comment, tìm kiếm, quan hệ và parser sơ đồ class.
- [ ] Tự động xác minh tích hợp giữa analyzer, workspace, Worker, model dữ liệu và các parser.
- [ ] Tự động xác minh luồng giao diện chính trên trình duyệt: mở thư mục, Explorer, Editor, tìm kiếm, dải quan hệ và sơ đồ class.
- [ ] Tự động kiểm tra build mặc định và build single-file.
- [ ] Tạo dữ liệu fixture ổn định, kết quả kỳ vọng rõ ràng, không phụ thuộc mã nguồn thật bên ngoài.
- [ ] Giữ test chạy độc lập, có thể chạy lặp lại trên CI.

### Ngoài phạm vi tự động hóa hoàn toàn

- Chọn thư mục hệ thống thật bằng quyền truy cập của người dùng có thể cần E2E tương tác hoặc adapter test riêng; không nên để CI phụ thuộc hộp thoại native.
- Khả năng tương thích Firefox/Safari với `webkitdirectory` cần chạy trên browser matrix thực tế.
- Chất lượng quan hệ suy đoán phụ thuộc analyzer và heuristic; test phải dùng fixture xác định, không khẳng định mọi project thực tế đều được phân tích tuyệt đối.
- Không kiểm thử chức năng sửa/lưu mã nguồn vì ứng dụng được thiết kế chỉ đọc.

---

## 2. Cách chạy và tiêu chí CI

### 2.1. Các lệnh hiện có trong repository

```bash
npm ci
npm test
npm run build
npm run build:single
```

- [ ] `npm ci` cài đặt đúng dependency từ lockfile.
- [ ] `npm test` hoàn tất với exit code `0`.
- [ ] `npm run build` hoàn tất với exit code `0`.
- [ ] `npm run build:single` hoàn tất với exit code `0`.
- [ ] Artifact build mặc định được tạo trong `dist/`.
- [ ] Artifact build single-file được tạo trong `dist-single/`.
- [ ] Không có lỗi compile hoặc cảnh báo mới nghiêm trọng chưa được giải thích.

### 2.2. Nguyên tắc pass/fail

- **Pass:** kết quả thực tế khớp assertion, không có unhandled rejection / uncaught exception, tiến trình kết thúc đúng.
- **Fail:** sai dữ liệu, sai dòng, sai quan hệ, lỗi runtime, timeout, rò rỉ kết quả giữa hai request/workspace.
- **Skip:** chỉ dùng khi môi trường không hỗ trợ tính năng đã xác định; phải ghi rõ lý do, không dùng để che lỗi.
- Test hiệu năng nên dùng ngưỡng rộng và đo xu hướng; tránh assertion thời gian quá chặt khiến CI không ổn định.

### 2.3. Ma trận tầng kiểm thử

| Tầng | Mục đích | Công cụ hiện có / đề xuất | Bắt buộc |
| --- | --- | --- | --- |
| Unit | Hàm thuần, parser, chuẩn hóa, quy tắc lọc | `node:test` | Có |
| Integration | Nhiều module, workspace, quan hệ, Worker protocol | `node:test`, fixture, Worker mock/adapter | Có |
| Browser E2E | Luồng UI thực tế và tương tác người dùng | Playwright (đề xuất bổ sung) | Có cho release |
| Build smoke | Kiểm tra artifact chạy được | Vite build + browser smoke | Có |

---

## 3. Unit test — Core và dữ liệu

### AUTO-CORE-01 — Chuẩn hóa đường dẫn (M1)

- [ ] Đường dẫn tương đối được giữ đúng và không có tên thư mục gốc.
- [ ] Đường dẫn từ `webkitRelativePath` được chuẩn hóa về cùng dạng với `showDirectoryPicker`.
- [ ] Dấu phân cách `/` và `\` được chuẩn hóa nhất quán.
- [ ] Đường dẫn `.` / `..`, đường dẫn rỗng và đường dẫn bất thường được xử lý an toàn.
- [ ] Không tạo đường dẫn trùng sau chuẩn hóa.
- [ ] File path trả về có thể dùng nhất quán trong `hasFile`, `statFile`, `readFile`.

### AUTO-CORE-02 — Quy tắc bỏ qua file (M0/M1)

- [ ] Thư mục ẩn bắt đầu bằng `.` bị bỏ qua.
- [ ] Các thư mục luôn bỏ qua gồm `node_modules`, `bin`, `obj`, `dist`, `build`, `out`, `target`, `coverage`, `testresults`, `packages`, `__pycache__`, `venv`, `env`, `storybook-static`.
- [ ] File nhị phân, file lock, `*.min.js`, `*.min.css`, `*.map`, `*.d.ts` bị bỏ qua theo quy tắc.
- [ ] File lớn hơn 3 MB không được đưa vào phân tích.
- [ ] `.gitignore` được áp dụng khi tắt tùy chọn gồm thư viện / mã sinh tự động.
- [ ] Khi bật tùy chọn, các nhóm bị bỏ qua mặc định được xử lý theo đúng quy tắc bật lại.
- [ ] Không bỏ qua nhầm file mã nguồn thông thường.
- [ ] Quy tắc lọc được dùng nhất quán giữa analyzer và Explorer.

### AUTO-CORE-03 — SourceFS / Workspace (M1)

- [ ] `filePaths()` trả về danh sách đường dẫn tương đối của workspace.
- [ ] `hasFile(path)` trả `true` với file tồn tại và `false` với file không tồn tại.
- [ ] `statFile(path)` trả đúng tên, phần mở rộng và kích thước.
- [ ] `readFile(path)` trả đúng nội dung UTF-8.
- [ ] File không tồn tại trả lỗi `code = 'not-found'`.
- [ ] File nhị phân trả lỗi `code = 'binary'`.
- [ ] File vượt `maxSize` trả lỗi `code = 'too-large'`.
- [ ] Lỗi đọc thực tế trả lỗi `code = 'read-error'` khi điều kiện lỗi được mô phỏng.
- [ ] Workspace mới thay thế hoàn toàn danh sách và dữ liệu workspace cũ.
- [ ] Bật/tắt tùy chọn phân tích không làm mất khả năng đọc các file còn được giữ trong SourceFS.

### AUTO-CORE-04 — Che comment (M1/M2/M3)

- [ ] `maskComments` giữ nguyên chiều dài và vị trí ký tự để số dòng/cột không đổi.
- [ ] `stripComments` xóa comment theo hợp đồng riêng.
- [ ] Comment một dòng và nhiều dòng được xử lý đúng theo ngôn ngữ được hỗ trợ.
- [ ] Dấu comment nằm trong string/template/raw string không bị nhận nhầm là comment.
- [ ] Comment lồng nhau theo cú pháp hỗ trợ không làm lệch nội dung sau comment.
- [ ] Mã sau khi che comment vẫn giữ nguyên vị trí khai báo để nhảy dòng.
- [ ] Nội dung file gốc không bị mutate.

### AUTO-CORE-05 — Tìm kiếm tên file (M3)

- [ ] Tìm kiếm không phân biệt hoa thường.
- [ ] Mọi token trong truy vấn phải khớp.
- [ ] Tên bắt đầu bằng token được xếp hạng cao hơn kết quả chỉ chứa token.
- [ ] Kết quả không vượt giới hạn 500 file hiển thị.
- [ ] Truy vấn rỗng trả về trạng thái rỗng phù hợp.
- [ ] Kết quả có đường dẫn và metadata đúng.

### AUTO-CORE-06 — Tìm kiếm symbol (M3)

- [ ] Tìm được class, method/function và symbol được analyzer hỗ trợ.
- [ ] Kết quả chứa đúng file và dòng khai báo.
- [ ] Symbol loại `variable` bị loại khỏi nhóm theo đặc tả.
- [ ] Kết quả không vượt giới hạn 200 symbol.
- [ ] Nhiều symbol cùng tên được giữ phân biệt theo file / định danh.
- [ ] Không trả kết quả thuộc workspace cũ sau khi đổi workspace.

### AUTO-CORE-07 — Tìm kiếm nội dung (M3)

- [ ] Tìm chuỗi con không phân biệt hoa thường.
- [ ] Kết quả có số lần khớp và dòng trích dẫn đúng.
- [ ] Mọi vị trí khớp trong file được trả về.
- [ ] Tôn trọng giới hạn 500 file quét và 1000 lần khớp mỗi file.
- [ ] Bỏ qua file nhị phân và file vượt giới hạn phân tích.
- [ ] Quét theo lô 32 file theo thiết kế.
- [ ] Request mới hủy request cũ.
- [ ] Kết quả đến muộn của request đã hủy không được ghi đè kết quả mới.
- [ ] Lỗi đọc một file không làm hỏng toàn bộ lượt tìm kiếm.

### AUTO-CORE-08 — Mô hình quan hệ (M4)

- [ ] `related` trả danh sách định nghĩa của file hiện tại.
- [ ] Quan hệ đi ra được phân loại đúng trong nhóm **Dùng**.
- [ ] Quan hệ đi vào được phân loại đúng trong nhóm **Được dùng bởi**.
- [ ] Dòng sử dụng và dòng định nghĩa được giữ chính xác trong `locs`.
- [ ] Quan hệ sang project khác giữ đúng project / file đích.
- [ ] Quan hệ gọi API front-end ↔ endpoint back-end được trả về khi fixture có dữ liệu tương ứng.
- [ ] Thư viện ngoài được phân nhóm theo hợp đồng.
- [ ] Quan hệ suy đoán được đánh dấu riêng (ví dụ `≈`) nếu dữ liệu nguồn có đánh dấu.
- [ ] Node file dùng số liệu toàn mô hình; endpoint / route / thư viện ngoài dùng bậc trong màn hình theo đúng nhãn.
- [ ] Kết quả request cũ không được áp dụng khi node được chọn đã thay đổi.

### AUTO-CORE-09 — Parser class C# (M5)

- [ ] Parse class, interface, enum, struct và record.
- [ ] Parse member và dòng khai báo.
- [ ] Xử lý namespace, file-scoped namespace và `using`.
- [ ] Gộp các phần `partial` thành một type.
- [ ] Giữ phân biệt class trùng tên theo namespace.
- [ ] Parse kiểu lồng.
- [ ] Tạo quan hệ kế thừa, thực thi, kết hợp và tập hợp theo dữ liệu hỗ trợ.
- [ ] Đối chiếu fixture với parser gốc trong `tests/fixtures/` cho các mẫu hồi quy.
- [ ] Đầu vào rỗng, lỗi hoặc bị cắt xén không làm parser throw ngoài dự kiến.

### AUTO-CORE-10 — Parser Java (M5b)

- [ ] Nhận diện `.java`; không nhận diện nhầm `.kts` / định dạng ngoài phạm vi.
- [ ] Parse class, interface, enum, record và annotation interface theo hỗ trợ hiện tại.
- [ ] Parse modifier, visibility `+ - # ~` và static.
- [ ] Tách khai báo nhiều trường trên một dòng theo hành vi đã mô tả.
- [ ] Parse enum constants và kiểu lồng.
- [ ] Parse `extends` và `implements` thành đúng loại quan hệ.
- [ ] Parse trường kiểu `Foo` và `List<Foo>` thành quan hệ phù hợp.
- [ ] Parse package/import và nối quan hệ xuyên file khi đích được xác định duy nhất.
- [ ] Không nối quan hệ khi tên type mơ hồ.
- [ ] Đầu vào thiếu ngoặc / bị cắt xén không làm crash.

### AUTO-CORE-11 — Parser Kotlin (M5b)

- [ ] Nhận diện `.kt`; `.kts` chưa được nhận diện theo giới hạn hiện tại.
- [ ] Parse class, interface, object, `data class`, `sealed`, `enum class`.
- [ ] `data class` được phân loại record.
- [ ] Mỗi tham số `val` / `var` của primary constructor trở thành property.
- [ ] Tham số constructor thường không trở thành property.
- [ ] Parse companion object như static member của lớp ngoài.
- [ ] Parse chữ ký hàm theo dạng tên, tham số và kiểu trả về.
- [ ] Suy luận kiểu từ `Foo()` và `mutableListOf<Foo>()` theo hỗ trợ hiện tại.
- [ ] String template `${...}` và raw string ba nháy không làm hỏng parse.
- [ ] Comment lồng nhau được xử lý theo parser.
- [ ] Quan hệ chỉ nối khi xác định được đích duy nhất.

### AUTO-CORE-12 — Parser Python (M5b)

- [ ] Nhận diện `.py`; `.pyi` chưa được nhận diện theo giới hạn hiện tại.
- [ ] Parse class, class lồng ở phạm vi hỗ trợ, dataclass, Enum, Protocol và ABC.
- [ ] `@property` được phân loại như property.
- [ ] `@staticmethod` được đánh dấu static.
- [ ] Setter không tạo property trùng.
- [ ] Nhận diện `self.x` trong `__init__` / `__post_init__`.
- [ ] Lấy kiểu thuộc tính từ annotation tham số constructor.
- [ ] Forward reference `'Foo'` có thể tạo quan hệ khi đích xác định.
- [ ] Visibility `_x` là `#`, `__x` là `-`.
- [ ] Class định nghĩa bên trong hàm không xuất hiện.
- [ ] Alias import phức tạp `from m import A as B` không được khẳng định hỗ trợ.
- [ ] Đầu vào thiếu ngoặc / bị cắt xén không làm crash.

### AUTO-CORE-13 — Nối quan hệ parser dùng chung (M5/M5b)

- [ ] Thứ tự phân giải theo tập type duy nhất, qualifier, kiểu lồng, namespace và mục được nạp đúng thiết kế.
- [ ] `extends` tạo kế thừa.
- [ ] `implements` tạo thực thi.
- [ ] Quan hệ tập hợp có ký hiệu bội số `*` khi phù hợp.
- [ ] Hai type trùng tên không tạo cạnh mơ hồ.
- [ ] Không nối quan hệ chéo giữa các ngôn ngữ khác nhau.
- [ ] Kết quả parser không thay đổi ngoài các khác biệt có chủ đích đã ghi trong ROADMAP.

### AUTO-CORE-14 — Layout sơ đồ class (M5)

- [ ] Bố cục có thể tính toán với tập type không rỗng.
- [ ] Type cha được đặt trước type con theo hướng phân tầng khi có quan hệ.
- [ ] Kéo hộp làm cập nhật đường nối trong model/layout.
- [ ] Giới hạn output hiển thị 60 class.
- [ ] Khi đầu vào có hơn 60 class, metadata cảnh báo chứa tổng số và số hiển thị.
- [ ] Đầu vào rỗng hoặc toàn type lỗi không làm layout throw.

---

## 4. Integration test — Worker, workspace và luồng dữ liệu

### AUTO-INT-01 — Phân tích thư mục và dựng workspace (M0/M1)

- [ ] Input fixture có nhiều project marker tạo đúng project.
- [ ] File không nằm trong project marker được gom theo quy tắc thư mục cấp một.
- [ ] Trường hợp thư mục gốc có marker phân loại file còn lại đúng project gốc.
- [ ] Endpoint / route thuộc project của file định nghĩa.
- [ ] Tổng số file và node khớp fixture kỳ vọng.
- [ ] Bật/tắt include-library/generated tạo lại dữ liệu theo quy tắc.
- [ ] Mở workspace mới reset toàn bộ state của workspace trước.

### AUTO-INT-02 — Worker tìm kiếm (M3)

- [ ] Worker nhận request tên file / symbol / content và trả đúng loại kết quả.
- [ ] Nội dung trả về có request identifier để ghép đúng lượt tìm kiếm.
- [ ] Hủy tìm kiếm đang chạy dừng việc phát kết quả tiếp theo.
- [ ] Kết quả cũ đến sau khi hủy không được hiển thị.
- [ ] Worker xử lý file lỗi mà vẫn tiếp tục các file còn lại.
- [ ] Tìm kiếm trong lúc layout đang chạy không gửi lệnh hủy layout.

### AUTO-INT-03 — Worker quan hệ (M4)

- [ ] Request `related` dùng `requestId` và không phụ thuộc `job` layout.
- [ ] Có thể lấy kết quả từ đồ thị đầy đủ dù UI chỉ giữ đồ thị màn hình hiện tại.
- [ ] Request quan hệ không làm hủy hoặc restart layout.
- [ ] Hai request liên tiếp cho hai node trả đúng kết quả riêng.
- [ ] Chỉ response thuộc node còn đang được chọn được ghi vào state.

### AUTO-INT-04 — Parser registry (M5/M5b)

- [ ] Registry chọn parser theo phần mở rộng `.cs`, `.java`, `.kt`, `.py`.
- [ ] File `.js`, `.vue`, `.kts`, `.pyi` không bị chuyển nhầm vào parser class.
- [ ] Các parser trả về cùng mô hình dữ liệu `Type`, `Member`, `Relation`.
- [ ] Nhiều file trong cùng ngôn ngữ có thể được phân tích chung.
- [ ] Tập file trộn Java / Kotlin / Python / C# không tạo quan hệ chéo ngôn ngữ.

### AUTO-INT-05 — Giới hạn và lỗi dữ liệu

- [ ] Một file parser lỗi không làm hỏng kết quả của các file còn lại.
- [ ] File lớn hơn 3 MB bị loại khỏi phân tích theo chính sách.
- [ ] File nhị phân không được chuyển vào parser văn bản.
- [ ] Workspace rỗng tạo trạng thái UI/model hợp lệ.
- [ ] Thay workspace khi Worker còn tác vụ không cho phép tác vụ cũ ghi đè workspace mới.

---

## 5. Browser E2E — Luồng giao diện

> Đề xuất triển khai bằng Playwright. Repository hiện chưa có dependency hoặc script E2E; cần bổ sung cấu hình riêng và fixture được phục vụ qua test adapter. Không nên phụ thuộc quyền chọn thư mục hệ thống trong mọi test: ưu tiên inject fixture workspace qua adapter test; giữ một số smoke test riêng cho picker thật.

### AUTO-E2E-01 — Khởi động và mở workspace (M0)

- [ ] Mở ứng dụng từ server Vite.
- [ ] Nạp fixture workspace có nhiều project.
- [ ] Xác nhận tiến độ phân tích hoàn tất.
- [ ] Xác nhận màn hình Tổng quan có node project.
- [ ] Hover project node hiển thị thông tin.
- [ ] Click project node mở màn hình chi tiết.
- [ ] Với fixture chỉ có một project, app mở thẳng chi tiết project.
- [ ] Mở workspace khác và xác nhận sơ đồ cũ được thay thế.

### AUTO-E2E-02 — Điều khiển sơ đồ (M0)

- [ ] Nút **Sắp xếp lại** khởi động bố cục.
- [ ] Nút **Dừng sắp xếp** dừng bố cục.
- [ ] Nút **Vừa khung** đưa sơ đồ vào vùng nhìn.
- [ ] Bộ lọc node xoay vòng đúng ba trạng thái.
- [ ] Hình dạng node đổi ngay khi chọn cấu hình.
- [ ] Báo cáo mở nội dung Markdown.
- [ ] Nút **Chép Markdown** gọi clipboard theo hành vi ứng dụng.

### AUTO-E2E-03 — Mở file trong Editor (M2)

- [ ] Click node file mở panel Editor.
- [ ] Đường dẫn, ngôn ngữ và kích thước hiển thị đúng.
- [ ] Monaco được khởi tạo ở lần mở đầu tiên.
- [ ] Nội dung được syntax highlight.
- [ ] Chuyển file A → B → A giữ vị trí cuộn của A.
- [ ] Nút ✕ đóng panel.
- [ ] Nút **Mã nguồn** mở lại panel.
- [ ] Bỏ chọn node không làm mất file đang xem.
- [ ] Mở workspace mới reset / đóng Editor.
- [ ] Không có lỗi Monaco worker trong Console.

### AUTO-E2E-04 — Split pane và ẩn comment (M2)

- [ ] Kéo thanh chia đôi thay đổi kích thước Editor và sơ đồ.
- [ ] Không thể kéo khiến vùng sơ đồ nhỏ hơn giới hạn 280 px.
- [ ] Bật/tắt **Ẩn comment** thay đổi nội dung hiển thị.
- [ ] `.md`, `.json`, `.csproj` không cho bật tính năng nếu nút được thiết kế vô hiệu hóa.
- [ ] Chuỗi có ký tự comment không bị ẩn nhầm.
- [ ] Nội dung file nguồn không thay đổi.

### AUTO-E2E-05 — Explorer và filter (M3)

- [ ] Sidebar hiển thị số file và chip phần mở rộng có số lượng.
- [ ] Nút **Danh sách file** đóng/mở sidebar.
- [ ] Click chip lọc đúng phần mở rộng.
- [ ] Alt + click chỉ chọn phần mở rộng tương ứng.
- [ ] **Tất cả** xóa bộ lọc.
- [ ] Danh sách lớn cuộn ảo hóa và vẫn mở đúng file.
- [ ] Click node sơ đồ cuộn Explorer tới file tương ứng.
- [ ] Click file không có node chỉ mở Editor, không đổi sơ đồ.

### AUTO-E2E-06 — Tìm kiếm (M3)

- [ ] Ctrl/Cmd + K mở Explorer và focus ô tìm.
- [ ] Tìm tên file hiển thị nhóm **Tên file**.
- [ ] Tìm class/function hiển thị nhóm **Symbol**.
- [ ] Click symbol mở file và nhảy đúng dòng.
- [ ] Tìm nội dung hiển thị nhóm **Nội dung** và trạng thái quét.
- [ ] Click kết quả nội dung nhảy đúng dòng và tô sáng match.
- [ ] Node / project có kết quả được làm nổi bật.
- [ ] Xóa truy vấn khôi phục trạng thái sơ đồ.
- [ ] Gõ truy vấn mới trong lúc quét hủy lượt cũ.
- [ ] Arrow Up/Down đổi lựa chọn; Enter mở kết quả; Esc xóa truy vấn theo hành vi hiện tại.
- [ ] Bật ẩn comment rồi mở kết quả có dòng: chế độ ẩn comment tự tắt và dòng vẫn chính xác.

### AUTO-E2E-07 — Dải quan hệ (M4)

- [ ] File có node hiển thị ba mục **Định nghĩa · Dùng · Được dùng bởi**.
- [ ] File không có node không hiển thị dải quan hệ.
- [ ] Click **Định nghĩa** mở danh sách symbol và dòng.
- [ ] Click symbol nhảy đúng dòng khai báo.
- [ ] Click **Dùng** mở file đích đúng dòng định nghĩa khi có symbol.
- [ ] Click số dòng sử dụng nhảy đúng dòng trong file hiện tại.
- [ ] Click **Được dùng bởi** mở file gọi / tham chiếu đúng dòng.
- [ ] Quan hệ qua project khác chuyển đúng project.
- [ ] Quan hệ API front-end ↔ back-end mở đúng endpoint khi fixture có liên kết.
- [ ] Danh sách đóng khi click ngoài, nhấn Esc hoặc chọn mục.
- [ ] Chuyển file liên tục không hiển thị quan hệ cũ.
- [ ] Bảng thông tin node và dải quan hệ có số Dùng / Được dùng bởi khớp nhau.

### AUTO-E2E-08 — Sơ đồ class C# (M5)

- [ ] Có tab **Sơ đồ file | Sơ đồ class** khi phù hợp.
- [ ] Chọn `.cs` hiển thị class diagram.
- [ ] Chế độ theo file cập nhật khi chọn file C# khác.
- [ ] File không hỗ trợ hiện cảnh báo và giữ sơ đồ trước.
- [ ] Click class mở Editor tại dòng khai báo class.
- [ ] Click member mở Editor tại dòng khai báo member.
- [ ] Kéo hộp không kích hoạt click mở mã.
- [ ] Nút **+ Thêm file đang chọn** ghim file.
- [ ] Ctrl/Cmd + click file C# trong Explorer ghim file.
- [ ] Chip file có thể bỏ bằng nút ✕.
- [ ] Partial class được gộp; member mở đúng file nguồn.
- [ ] Class trùng tên khác namespace hiển thị riêng.
- [ ] Nút xếp tự động, vừa khung, zoom và lưu ảnh hoạt động.
- [ ] Hơn 60 class hiện cảnh báo giới hạn.

### AUTO-E2E-09 — Sơ đồ class Java / Kotlin / Python (M5b)

- [ ] `.java` mở được class diagram.
- [ ] `.kt` mở được class diagram.
- [ ] `.py` mở được class diagram.
- [ ] File không hỗ trợ hiển thị thông báo nêu danh sách định dạng hỗ trợ.
- [ ] Java: class/interface/enum/record, visibility, static và quan hệ hiển thị phù hợp fixture.
- [ ] Kotlin: data class, constructor `val`/`var`, object, sealed, companion object hiển thị phù hợp fixture.
- [ ] Python: dataclass, Enum, Protocol, ABC, property, staticmethod và thuộc tính `self.x` hiển thị phù hợp fixture.
- [ ] Click class / member của mỗi ngôn ngữ mở đúng file và dòng.
- [ ] Ghim nhiều file cùng ngôn ngữ tạo quan hệ xuyên file.
- [ ] Trộn Java và Python cùng sơ đồ không tạo quan hệ chéo.
- [ ] Đầu vào lỗi / thiếu ngoặc không làm UI crash.

### AUTO-E2E-10 — Workspace lifecycle và regression

- [ ] Mở A → tìm kiếm → mở Editor → mở class diagram.
- [ ] Mở workspace B khi tác vụ A đang chạy.
- [ ] Xác nhận dữ liệu, kết quả tìm kiếm, Editor, dải quan hệ và tập file diagram không còn dữ liệu A.
- [ ] Thực hiện thao tác nhanh liên tục giữa các file và project.
- [ ] Không có lỗi đỏ trong Console.
- [ ] Không có request/response cũ ghi đè dữ liệu mới.
- [ ] Sơ đồ file vẫn giữ trạng thái hợp lệ khi chuyển tab class diagram rồi quay lại.

---

## 6. Build smoke test

### AUTO-BUILD-01 — Build mặc định

- [ ] Chạy `npm run build`.
- [ ] Xác nhận `dist/index.html` tồn tại.
- [ ] Xác nhận build theo cấu hình hiện tại tạo index đơn file.
- [ ] Phục vụ artifact bằng `npm run preview`.
- [ ] Mở trang bằng browser automation.
- [ ] Nạp fixture workspace và mở một file trong Editor.
- [ ] Xác nhận Monaco worker và WebGL/Sigma hoạt động.
- [ ] Xác nhận không có lỗi tải tài nguyên quan trọng.

### AUTO-BUILD-02 — Build single-file

- [ ] Chạy `npm run build:single`.
- [ ] Xác nhận `dist-single/index.html` tồn tại.
- [ ] Phục vụ artifact bằng HTTP server.
- [ ] Mở trang và xác nhận UI khởi động.
- [ ] Nạp fixture workspace.
- [ ] Mở Editor và sơ đồ class.
- [ ] Xác nhận không có lỗi worker hoặc lỗi tài nguyên.

### AUTO-BUILD-03 — Browser matrix

- [ ] Chromium: chạy E2E smoke.
- [ ] Firefox: chạy smoke chọn thư mục / mở file qua `webkitdirectory` hoặc adapter tương ứng.
- [ ] WebKit: chạy smoke chọn thư mục / mở file qua `webkitdirectory` hoặc adapter tương ứng.
- [ ] Ghi nhận phiên bản browser và các test được skip vì giới hạn môi trường.
- [ ] Không dùng test adapter để thay thế toàn bộ kiểm tra picker thật; duy trì ít nhất một test picker trên browser hỗ trợ.

---

## 7. Kiểm thử hiệu năng và độ bền

### AUTO-PERF-01 — Workspace lớn

- [ ] Dùng fixture lớn có hàng nghìn file.
- [ ] Đo thời gian scan / phân tích và số file được nhận.
- [ ] Explorer virtual list không tạo DOM node cho toàn bộ file cùng lúc.
- [ ] Cuộn danh sách không làm UI treo.
- [ ] Ghi nhận bộ nhớ và thời gian tìm kiếm nội dung.

### AUTO-PERF-02 — Parser class

- [ ] Mỗi parser nhận file fixture nhỏ, vừa và lớn.
- [ ] Ghi nhận thời gian parse và số type/member/relation.
- [ ] Kiểm tra file gần 3 MB không làm crash.
- [ ] Kiểm tra đầu vào bị cắt xén / chèn ký tự mở không làm crash.
- [ ] Theo dõi xu hướng hiệu năng; ngưỡng CI nên có biên an toàn theo runner.

### AUTO-PERF-03 — Hủy và thay workspace

- [ ] Bắt đầu tìm kiếm nội dung rồi hủy nhiều lần liên tiếp.
- [ ] Đổi workspace trong lúc parse / search / layout đang chạy.
- [ ] Không có kết quả của workspace cũ xuất hiện trong workspace mới.
- [ ] Không có Worker message treo hoặc lỗi unhandled rejection.

---

## 8. Test data / fixtures cần duy trì

- [ ] `workspace-single-project/`: một project, nhiều loại file.
- [ ] `workspace-multi-project/`: nhiều project marker và quan hệ xuyên project.
- [ ] `workspace-front-back/`: front-end gọi API và back-end định nghĩa endpoint.
- [ ] `workspace-search/`: file có tên, symbol và nội dung dễ tìm; nhiều match trên nhiều dòng.
- [ ] `workspace-ignore/`: thư mục bị ignore, file nhị phân, file lock, file minified, file lớn.
- [ ] `workspace-comments/`: comment nhiều dạng và chuỗi chứa comment marker.
- [ ] `class-csharp/`: namespace, partial, generic, enum, record, struct, nested type.
- [ ] `class-java/`: interface, enum, record, annotation interface, extends/implements, generic field.
- [ ] `class-kotlin/`: data class, sealed, object, companion, raw string, template string.
- [ ] `class-python/`: dataclass, Enum, Protocol, ABC, property, staticmethod, forward reference.
- [ ] `class-ambiguous/`: class trùng tên trong nhiều namespace/module.
- [ ] `class-malformed/`: file rỗng, lỗi cú pháp, thiếu ngoặc và nội dung bị cắt.
- [ ] `workspace-large/`: số lượng file đủ lớn để kiểm tra virtual list và tìm kiếm theo lô.

Mỗi fixture nên có manifest mô tả file đầu vào, project mong đợi, số node / cạnh quan trọng, symbol và dòng mong đợi. Không nên chỉ assertion số lượng tổng nếu có thể assertion theo định danh cụ thể.

---

## 9. Gợi ý tổ chức test trong repository

Cấu trúc đề xuất (không phải cấu trúc hiện tại đã xác nhận):

```text
tests/
├── core/                 # unit test logic thuần
├── integration/          # workspace, Worker, analyzer và quan hệ
├── e2e/                  # browser E2E (Playwright nếu được bổ sung)
├── fixtures/
│   ├── workspaces/
│   ├── class-diagram/
│   └── expected/
└── helpers/
    ├── create-workspace.js
    ├── worker-harness.js
    └── assertions.js
```

Nguyên tắc:
- [ ] Unit test không phụ thuộc DOM hoặc browser.
- [ ] Integration test dùng fixture nhỏ, xác định và không đọc thư mục máy cá nhân.
- [ ] E2E test ưu tiên selector ổn định (`data-testid`) thay vì phụ thuộc text trang trí hoặc cấu trúc CSS.
- [ ] Có helper tạo workspace giả / adapter test thay vì mở native file picker trong mọi test.
- [ ] Test async luôn chờ trạng thái hoàn tất cụ thể; không dùng sleep cố định nếu có thể chờ event / locator.
- [ ] Test cleanup Worker, timer, listener và browser context sau mỗi test.
- [ ] Không chạy test song song nếu chúng dùng chung global state hoặc fixture mutable.
- [ ] Giữ fixture có kích thước nhỏ cho pull request; test tải lớn chạy theo lịch hoặc trước release.

---

## 10. Ưu tiên triển khai

| Ưu tiên | Nhóm | Nội dung |
| --- | --- | --- |
| P0 | Unit | Core path, ignore rules, SourceFS, comment masking, search, relation |
| P0 | Parser | C#, Java, Kotlin, Python; malformed input; ambiguous relation |
| P0 | Integration | Worker cancellation, requestId, workspace reset |
| P1 | Browser E2E | Open workspace, Editor, Explorer/search, relation bar |
| P1 | Browser E2E | Class diagram C#/Java/Kotlin/Python |
| P1 | Build | Build mặc định, build single-file, preview smoke |
| P2 | Browser matrix | Firefox / WebKit và picker thật |
| P2 | Performance | Workspace lớn, parser gần 3 MB, hủy tác vụ liên tục |

---

## 11. Báo cáo lần chạy automation

| Ngày | Commit | Node | Browser | `npm test` | Build | E2E | Người chạy / CI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | |
| | | | | | | | |

### Defect log

| ID | Test ID | Mô tả | Môi trường | Mức độ | Trạng thái |
| --- | --- | --- | --- | --- | --- |
| AUTO-BUG-001 | | | | | |
| AUTO-BUG-002 | | | | | |
| AUTO-BUG-003 | | | | | |

---

## 12. Điều kiện hoàn tất automation baseline

- [ ] Tất cả test hiện có trong `npm test` pass.
- [ ] Unit test bao phủ các nhóm P0 và có assertion theo dữ liệu cụ thể.
- [ ] Integration test xác minh hủy request, chống response cũ và reset workspace.
- [ ] Browser E2E chạy được luồng mở workspace, Explorer, Editor, tìm kiếm và quan hệ.
- [ ] Browser E2E chạy được sơ đồ class cho C#, Java, Kotlin và Python.
- [ ] Build mặc định và build single-file đều pass smoke test.
- [ ] Báo cáo CI lưu kết quả test và log lỗi.
- [ ] Mọi test skip đều có lý do và không che lỗi sản phẩm.

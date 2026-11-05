# CHECKLIST.md --- Checklist kiểm thử Code Explorer

Tài liệu tổng hợp các test case kiểm thử thủ công cho Code Explorer theo
các mốc M0--M5b trong `ROADMAP.md`, có đối chiếu với chức năng và kiến
trúc hiện tại được mô tả trong `README.md`.

## 1. Thông tin kiểm thử

-   **Ứng dụng:** Code Explorer
-   **Phạm vi:** M0, M1, M2, M3, M4, M5, M5b
-   **Loại kiểm thử:** Kiểm thử thủ công (UI, luồng thao tác, điều
    hướng, parser, khả năng chịu lỗi)
-   **Môi trường khuyến nghị:** Chrome/Edge; kiểm tra bổ sung
    Firefox/Safari cho luồng chọn thư mục
-   **Lệnh chuẩn bị:**

``` bash
npm install
npm test
npm run dev
```

-   **Build cần kiểm tra:**

``` bash
npm run build
npm run build:single
npm run preview
```

### 1.1. Quy ước ghi nhận kết quả

-   [ ] Chưa kiểm thử
-   [x] Đạt
-   \[!\] Không đạt
-   \[-\] Không áp dụng

Khi test không đạt, ghi lại: mã test case, trình duyệt, dữ liệu đầu vào,
các bước tái hiện, kết quả thực tế, kết quả mong đợi, lỗi Console (nếu
có) và ảnh chụp màn hình.

### 1.2. Dữ liệu kiểm thử đề xuất

Chuẩn bị một thư mục dự án có: - Nhiều project hoặc solution con; đồng
thời có trường hợp chỉ có một project. - File mã nguồn C#, Java, Kotlin,
Python, JavaScript/TypeScript, Vue, HTML, CSS. - File không có node
trong đồ thị như `README.md`, `.json`, `.csproj`. - Quan hệ import,
render component, kế thừa, DI, route và gọi API giữa front-end /
back-end. - File có comment nhiều dòng, chuỗi chứa ký tự giống comment,
namespace/package/module và class trùng tên. - Thư mục lớn có hàng nghìn
file; một số file lớn hơn 3 MB, file nhị phân, thư mục vendor /
generated. - Dữ liệu parser có cú pháp lỗi hoặc đang viết dở.

------------------------------------------------------------------------

## 2. M0 --- Nền tảng mind-map và luồng khám phá project

### M0-01 --- Mở thư mục dự án

-   [ ] Khởi động ứng dụng và bấm **Folder dự án**.
-   [ ] Chọn một thư mục dự án hợp lệ.
-   [ ] Xác nhận ứng dụng hiển thị tiến độ phân tích.
-   [ ] Sau khi phân tích hoàn tất, màn hình **Tổng quan** xuất hiện.
-   [ ] Trên Chrome/Edge, luồng chọn thư mục dùng `showDirectoryPicker`.
-   [ ] Trên Firefox/Safari, luồng chọn thư mục dùng hộp chọn thư mục
    (`webkitdirectory`).

**Kết quả mong đợi:** Thư mục được đọc cục bộ, tiến độ hiển thị và sơ đồ
Tổng quan được dựng thành công.

### M0-02 --- Khám phá sơ đồ Tổng quan

-   [ ] Rê chuột vào node project.
-   [ ] Xác nhận bảng thông tin project xuất hiện.
-   [ ] Bấm node project.
-   [ ] Xác nhận chuyển sang màn hình chi tiết project tương ứng.

### M0-03 --- Khám phá node trong project

-   [ ] Bấm một node file.
-   [ ] Xác nhận node được chọn và các liên kết liên quan được làm nổi
    bật.
-   [ ] Xác nhận bảng thông tin hiển thị đường dẫn, loại node, số liên
    kết và symbol (nếu có).
-   [ ] Kiểm tra node ghost của project khác được hiển thị mờ.
-   [ ] Không dùng thao tác bấm đúp ghost để chuyển project: hành vi này
    đã bị tắt ở M4.2.

### M0-04 --- Bật/tắt thư viện và mã sinh tự động

-   [ ] Bật **Gồm thư viện & mã sinh tự động**.
-   [ ] Xác nhận ứng dụng phân tích lại thư mục.
-   [ ] Xác nhận các file / node thư viện hoặc mã sinh tự động phù hợp
    được đưa vào kết quả.
-   [ ] Tắt tùy chọn và xác nhận ứng dụng phân tích lại.

### M0-05 --- Điều khiển sơ đồ

-   [ ] Bấm **Sắp xếp lại** và xác nhận bố cục được tính lại.
-   [ ] Bấm **Dừng sắp xếp** khi bố cục đang chạy.
-   [ ] Xác nhận sơ đồ dừng và giữ vị trí hiện tại.
-   [ ] Bấm **Vừa khung** và xác nhận toàn bộ sơ đồ nằm trong vùng nhìn.
-   [ ] Thử nút lọc node qua ba trạng thái: **Ẩn node độc lập**, **Ẩn
    node có liên kết**, **Hiện tất cả** (khi có đủ hai loại node).

### M0-06 --- Hình dạng node

-   [ ] Mở phần chú thích và đổi hình dạng của một loại node.
-   [ ] Xác nhận các node cùng loại thay đổi hình dạng ngay.
-   [ ] Tải lại ứng dụng và kiểm tra hình dạng được lưu theo cấu hình
    hiện tại.

### M0-07 --- Báo cáo cấu trúc

-   [ ] Bấm **Báo cáo**.
-   [ ] Xác nhận báo cáo Markdown xuất hiện.
-   [ ] Bấm **Chép Markdown**.
-   [ ] Dán vào trình soạn thảo và xác nhận nội dung được sao chép.

### M0-08 --- Mở thư mục khác

-   [ ] Khi đang có sơ đồ, mở một thư mục khác.
-   [ ] Xác nhận dữ liệu sơ đồ cũ được thay thế hoàn toàn.
-   [ ] Xác nhận không còn node, cạnh hoặc trạng thái chọn của thư mục
    trước.
-   [ ] Xác nhận không có lỗi đỏ trong Console.

------------------------------------------------------------------------

## 3. M1 --- Core, chuẩn hóa đường dẫn và đọc file nguồn

### M1-01 --- Hồi quy chức năng M0

-   [ ] Chạy lại các test case M0-01 đến M0-08.
-   [ ] So sánh số file, node và liên kết với kết quả mong đợi trên cùng
    bộ dữ liệu.
-   [ ] Xác nhận các thao tác sơ đồ vẫn hoạt động như trước.

### M1-02 --- Chuẩn hóa đường dẫn

-   [ ] Mở thư mục dự án và chọn một node file.
-   [ ] Trong Console môi trường development, kiểm tra
    `explorer.sel.filePath`.
-   [ ] Xác nhận đường dẫn tương đối không chứa tên thư mục gốc đã chọn.
-   [ ] Gọi `await explorer.ws.readFile(explorer.sel.filePath)`.
-   [ ] Xác nhận nội dung file được trả về.
-   [ ] Gọi `explorer.ws.hasFile(explorer.sel.filePath)` và xác nhận trả
    về `true`.
-   [ ] Gọi `await explorer.ws.statFile(explorer.sel.filePath)` và xác
    nhận có thông tin file.
-   [ ] Gọi `explorer.ws.filePaths()` và đối chiếu số lượng đường dẫn.

### M1-03 --- Mã lỗi khi đọc file

-   [ ] Đọc một đường dẫn không tồn tại: `readFile('khong-co.js')`.
-   [ ] Xác nhận lỗi có `code = 'not-found'`.
-   [ ] Đọc một file nhị phân, ví dụ `anh.png`.
-   [ ] Xác nhận lỗi có `code = 'binary'`.
-   [ ] Đọc file với giới hạn nhỏ hơn kích thước thật, ví dụ
    `{ maxSize: 10 }`.
-   [ ] Xác nhận lỗi có `code = 'too-large'`.
-   [ ] Nếu có file gặp lỗi đọc thực tế, xác nhận mã lỗi `read-error`
    được trả về.

### M1-04 --- Tương thích các cách chọn thư mục

-   [ ] Lặp lại M1-02 trên Chrome/Edge.
-   [ ] Lặp lại M1-02 trên Firefox/Safari.
-   [ ] Xác nhận đường dẫn không chứa tên thư mục gốc ở cả hai luồng.
-   [ ] Xác nhận `readFile` trả về đúng nội dung file ở cả hai luồng.

### M1-05 --- Đọc file sau khi đổi tùy chọn phân tích

-   [ ] Bật/tắt **Gồm thư viện & mã sinh tự động**.
-   [ ] Chờ ứng dụng phân tích lại.
-   [ ] Đọc một file trong danh sách mới bằng `workspace.readFile`.
-   [ ] Xác nhận nội dung đọc được tương ứng với file hiện tại.

### M1-06 --- Thay thư mục nguồn

-   [ ] Mở thư mục thứ nhất và ghi nhận số lượng `filePaths()`.
-   [ ] Mở thư mục thứ hai.
-   [ ] Xác nhận `filePaths()` chỉ chứa file của thư mục thứ hai.
-   [ ] Xác nhận không thể đọc nhầm file thuộc thư mục trước.

------------------------------------------------------------------------

## 4. M2 --- Editor chỉ đọc và Monaco

### M2-01 --- Mở editor

-   [ ] Mở thư mục và vào một project.
-   [ ] Bấm một node file có nội dung mã nguồn.
-   [ ] Xác nhận panel Editor bên phải xuất hiện.
-   [ ] Xác nhận đường dẫn, ngôn ngữ và kích thước file hiển thị.
-   [ ] Xác nhận mã nguồn được tô màu cú pháp.
-   [ ] Kiểm tra các loại file `.cs`, `.js`, `.ts`, `.vue`, `.css`,
    `.json`.

### M2-02 --- Monaco tải lười

-   [ ] Mở file đầu tiên sau khi tải ứng dụng.
-   [ ] Xác nhận trạng thái đang đọc / khởi tạo editor (nếu có) không bị
    treo.
-   [ ] Mở file tiếp theo.
-   [ ] Xác nhận editor tái sử dụng và mở nhanh.
-   [ ] Kiểm tra Console không có lỗi `Could not create web worker` hoặc
    `MonacoEnvironment`.

### M2-03 --- Chuyển file và lưu vị trí cuộn

-   [ ] Cuộn file A xuống một vị trí dễ nhận biết.
-   [ ] Mở file B.
-   [ ] Quay lại file A.
-   [ ] Xác nhận vị trí cuộn của A được khôi phục.
-   [ ] Mở nhiều file liên tiếp và xác nhận nội dung luôn khớp file đang
    chọn.

### M2-04 --- Kéo thanh chia đôi

-   [ ] Kéo thanh chia đôi để thay đổi độ rộng Editor.
-   [ ] Xác nhận sơ đồ co giãn theo vùng còn lại.
-   [ ] Kéo gần hết cỡ về một phía.
-   [ ] Xác nhận vùng sơ đồ vẫn còn tối thiểu khoảng không gian sử dụng
    được.
-   [ ] Xác nhận không có vùng trắng hoặc kích thước bị méo.
-   [ ] Kiểm tra giới hạn tối thiểu 280 px dành cho sơ đồ.

### M2-05 --- Ẩn comment

-   [ ] Mở file có comment một dòng và nhiều dòng.
-   [ ] Bật **Ẩn comment**.
-   [ ] Xác nhận comment bị ẩn trong editor.
-   [ ] Tắt **Ẩn comment** và xác nhận comment xuất hiện lại.
-   [ ] Thử với `.md`, `.json`, `.csproj` và xác nhận nút bị vô hiệu hóa
    / mờ theo thiết kế.
-   [ ] Xác nhận nội dung file nguồn không bị thay đổi.
-   [ ] Kiểm tra comment marker nằm trong chuỗi không bị xử lý nhầm.

### M2-06 --- Đóng và mở lại Editor

-   [ ] Bấm nút đóng (✕) của panel.
-   [ ] Xác nhận sơ đồ vẫn giữ node đang chọn và mở rộng vùng hiển thị.
-   [ ] Bấm **Mã nguồn** trên thanh trên để mở lại panel.
-   [ ] Bấm lại node đang chọn và xác nhận panel được mở lại.
-   [ ] Xác nhận file đang xem được giữ theo hành vi hiện tại.

### M2-07 --- Trạng thái khi bỏ chọn / đổi màn hình

-   [ ] Bấm vùng trống của sơ đồ để bỏ chọn node.
-   [ ] Xác nhận Editor vẫn giữ file đang xem.
-   [ ] Chuyển qua lại giữa Tổng quan và màn hình project.
-   [ ] Xác nhận file đang xem không bị đổi ngoài ý muốn.

### M2-08 --- Node không mở được Editor

-   [ ] Bấm node ghost thuộc project khác.
-   [ ] Xác nhận có thể mở file tương ứng trong Editor.
-   [ ] Bấm node endpoint, route và thư viện ngoài.
-   [ ] Xác nhận các node này không làm Editor chuyển sang một file
    không tồn tại.

### M2-09 --- Đổi nguồn

-   [ ] Mở một thư mục khác.
-   [ ] Xác nhận Editor tự đóng hoặc reset theo workspace mới.
-   [ ] Thay đổi tùy chọn thư viện / mã sinh tự động làm phân tích lại.
-   [ ] Xác nhận Editor không tiếp tục hiển thị nội dung thuộc workspace
    cũ.

### M2-10 --- Build và trình duyệt

-   [ ] Chạy `npm run build`.
-   [ ] Chạy `npm run build:single`.
-   [ ] Phục vụ bản build qua HTTP bằng `npm run preview` hoặc web
    server tĩnh.
-   [ ] Mở bản build và mở một file mã nguồn.
-   [ ] Xác nhận Monaco, worker và cú pháp hoạt động.
-   [ ] Lặp lại luồng mở file trên Firefox/Safari nếu có môi trường.

------------------------------------------------------------------------

## 5. M3 --- Explorer, danh sách file và tìm kiếm

### M3-01 --- Explorer và danh sách file

-   [ ] Mở thư mục dự án.
-   [ ] Xác nhận sidebar Explorer hiển thị số lượng file.
-   [ ] Xác nhận chip phần mở rộng file có số lượng tương ứng.
-   [ ] Bấm **Danh sách file** để đóng/mở sidebar.
-   [ ] Kéo thanh chia đôi bên trái để thay đổi độ rộng Explorer.
-   [ ] Xác nhận vùng sơ đồ vẫn còn đủ không gian hiển thị.

### M3-02 --- Lọc theo phần mở rộng

-   [ ] Bấm một chip phần mở rộng.
-   [ ] Xác nhận danh sách chỉ còn file có phần mở rộng đó.
-   [ ] Bấm lại chip để bỏ chọn.
-   [ ] Dùng **Alt + bấm** một chip.
-   [ ] Xác nhận chỉ phần mở rộng đó được chọn.
-   [ ] Bấm **Tất cả** và xác nhận bộ lọc được đặt lại.

### M3-03 --- Mở file từ Explorer

-   [ ] Bấm một file trong danh sách.
-   [ ] Xác nhận Editor mở đúng file.
-   [ ] Khi đang ở Tổng quan, bấm file thuộc một project.
-   [ ] Xác nhận ứng dụng chuyển sang đúng project và chọn node tương
    ứng nếu file có node.
-   [ ] Xác nhận camera căn vào node được mở.
-   [ ] Bấm file không có node như `README.md`, `.csproj`, `.json`.
-   [ ] Xác nhận chỉ Editor mở file, sơ đồ không bị thay đổi.

### M3-04 --- Đồng bộ lựa chọn Explorer và sơ đồ

-   [ ] Bấm một node trên sơ đồ.
-   [ ] Xác nhận danh sách Explorer cuộn tới file tương ứng.
-   [ ] Xác nhận hàng file được làm nổi bật.
-   [ ] Chọn file khác trong Explorer và xác nhận trạng thái chọn được
    đồng bộ.

### M3-05 --- Tìm tên file

-   [ ] Nhập một phần tên file.
-   [ ] Xác nhận nhóm **Tên file** xuất hiện gần như tức thì.
-   [ ] Nhập nhiều từ khóa, ví dụ `app vue`.
-   [ ] Xác nhận mọi từ đều phải khớp.
-   [ ] Xác nhận file có tên bắt đầu bằng từ khóa được xếp hạng cao hơn.
-   [ ] Bấm một kết quả và xác nhận file được mở đúng.

### M3-06 --- Tìm symbol

-   [ ] Nhập tên class, hàm hoặc symbol có trong dự án.
-   [ ] Xác nhận nhóm **Symbol** xuất hiện.
-   [ ] Bấm một kết quả.
-   [ ] Xác nhận Editor mở đúng file và nhảy tới dòng khai báo.
-   [ ] Xác nhận dòng đích được tô sáng / nhấp nháy trong khoảng thời
    gian ngắn.
-   [ ] Kiểm tra symbol kiểu `variable` không xuất hiện trong nhóm nếu
    thuộc loại bị loại trừ.

### M3-07 --- Tìm nội dung

-   [ ] Nhập chuỗi có trong nội dung một file.
-   [ ] Xác nhận nhóm **Nội dung** bắt đầu quét và tiến độ
    `Đang quét x/y` được cập nhật.
-   [ ] Xác nhận kết quả có số lần khớp và trích đoạn nội dung.
-   [ ] Xác nhận từ khóa được tô sáng trong trích đoạn.
-   [ ] Bấm kết quả.
-   [ ] Xác nhận Editor nhảy tới dòng khớp đầu tiên.
-   [ ] Xác nhận mọi vị trí khớp trong file được tô sáng, bao gồm thanh
    cuộn (nếu có).
-   [ ] Thử tìm chuỗi không tồn tại và xác nhận trạng thái không có kết
    quả.

### M3-08 --- Làm nổi bật kết quả trên sơ đồ

-   [ ] Nhập từ khóa có kết quả trong một hoặc nhiều file.
-   [ ] Xác nhận node có kết quả được làm nổi bật.
-   [ ] Xác nhận node không liên quan bị làm mờ.
-   [ ] Ở Tổng quan, xác nhận project có kết quả được làm nổi bật.
-   [ ] Xóa truy vấn và xác nhận sơ đồ trở lại bình thường.
-   [ ] Chọn node thủ công và xác nhận trạng thái chọn được ưu tiên.

### M3-09 --- Hủy tìm kiếm cũ và hiệu năng

-   [ ] Nhập truy vấn có nhiều kết quả để bắt đầu quét nội dung.
-   [ ] Khi đang quét, nhập truy vấn mới.
-   [ ] Xác nhận quét cũ bị hủy và kết quả không trộn lẫn.
-   [ ] Mở project lớn trong lúc sơ đồ đang sắp xếp.
-   [ ] Thực hiện tìm kiếm nội dung ngay khi bố cục đang chạy.
-   [ ] Xác nhận sơ đồ không đứng hình và vẫn tiếp tục phản hồi.

### M3-10 --- Phím tắt tìm kiếm

-   [ ] Nhấn **Ctrl/Cmd + K** khi đang ở sơ đồ.
-   [ ] Xác nhận Explorer mở và ô tìm được focus.
-   [ ] Lặp lại Ctrl/Cmd + K khi con trỏ đang ở Editor.
-   [ ] Dùng phím ↑ / ↓ để đổi hàng kết quả được chọn.
-   [ ] Nhấn Enter để mở kết quả.
-   [ ] Nhấn Enter ngay sau khi nhập truy vấn và xác nhận tìm kiếm được
    kích hoạt.
-   [ ] Nhấn Esc và xác nhận ô tìm được xóa theo hành vi hiện tại.

### M3-11 --- Tương tác với Ẩn comment

-   [ ] Bật **Ẩn comment** trong Editor.
-   [ ] Tìm nội dung hoặc symbol có số dòng.
-   [ ] Bấm kết quả.
-   [ ] Xác nhận chế độ ẩn comment tự tắt trước khi nhảy dòng.
-   [ ] Xác nhận vị trí nhảy vẫn đúng với số dòng của file gốc.

### M3-12 --- Dự án lớn và đổi workspace

-   [ ] Mở dự án có hàng nghìn hoặc hàng chục nghìn file.
-   [ ] Cuộn danh sách liên tục.
-   [ ] Xác nhận danh sách ảo hóa hoạt động mượt, không cần render toàn
    bộ file cùng lúc.
-   [ ] Mở thư mục khác.
-   [ ] Xác nhận danh sách, chip lọc và ô tìm được reset.
-   [ ] Kiểm tra trên Firefox/Safari.
-   [ ] Xác nhận Console không có lỗi đỏ.

------------------------------------------------------------------------

## 6. M4 --- Dải quan hệ Định nghĩa / Dùng / Được dùng bởi

### M4-01 --- Hiển thị dải quan hệ

-   [ ] Mở một file có node và có symbol.
-   [ ] Xác nhận dưới tên file có ba mục **Định nghĩa**, **Dùng**,
    **Được dùng bởi** kèm số lượng.
-   [ ] Mục có số 0 được hiển thị ở trạng thái vô hiệu hóa / mờ.
-   [ ] Mở file không có node như `README.md`, `.json`, `.csproj`.
-   [ ] Xác nhận file không có dải quan hệ.

### M4-02 --- Định nghĩa

-   [ ] Bấm **Định nghĩa**.
-   [ ] Xác nhận danh sách symbol của file và số dòng xuất hiện.
-   [ ] Bấm một symbol.
-   [ ] Xác nhận Editor nhảy tới đúng dòng định nghĩa.
-   [ ] Xác nhận dòng đích được làm nổi bật.

### M4-03 --- Dùng

-   [ ] Mở file có quan hệ đi ra tới file khác.
-   [ ] Bấm **Dùng**.
-   [ ] Xác nhận danh sách file được dùng xuất hiện cùng loại quan hệ,
    tên symbol và đường dẫn.
-   [ ] Bấm một mục có tên symbol.
-   [ ] Xác nhận Editor mở file đích tại dòng định nghĩa của symbol.
-   [ ] Xác nhận symbol được tô sáng.
-   [ ] Bấm các số dòng trong phần **dùng ở dòng...**.
-   [ ] Xác nhận Editor nhảy tới đúng dòng sử dụng trong file hiện tại.
-   [ ] Với import JS/TS không mang tên symbol, xác nhận có thể mở đầu
    file đích nhưng vẫn hiển thị dòng sử dụng trong file hiện tại.

### M4-04 --- Được dùng bởi

-   [ ] Mở file được các file khác tham chiếu.
-   [ ] Bấm **Được dùng bởi**.
-   [ ] Xác nhận danh sách file tham chiếu tới file hiện tại xuất hiện.
-   [ ] Bấm một mục.
-   [ ] Xác nhận Editor mở file kia tại dòng nó sử dụng file hiện tại.
-   [ ] Lặp lại với file thuộc project khác.
-   [ ] Xác nhận ứng dụng chuyển đúng project, chọn node và nhảy dòng.

### M4-05 --- Quan hệ gọi API xuyên project

-   [ ] Mở file front-end có lời gọi API.
-   [ ] Trong **Dùng**, xác nhận endpoint / file controller tương ứng
    xuất hiện khi analyzer nhận diện được.
-   [ ] Xác nhận quan hệ suy đoán có dấu `≈`.
-   [ ] Bấm mục và xác nhận Editor mở file back-end tại dòng định nghĩa
    endpoint.
-   [ ] Mở file controller.
-   [ ] Trong **Được dùng bởi**, xác nhận file front-end gọi endpoint
    được liệt kê.

### M4-06 --- Thư viện ngoài

-   [ ] Mở dải quan hệ của file có dùng thư viện ngoài.
-   [ ] Xác nhận thư viện ngoài được gộp thành mục `+ n thư viện ngoài`.
-   [ ] Rê chuột vào mục.
-   [ ] Xác nhận tên thư viện được hiển thị.

### M4-07 --- Đóng danh sách quan hệ

-   [ ] Mở một danh sách quan hệ.
-   [ ] Bấm ra ngoài danh sách.
-   [ ] Mở lại và nhấn Esc.
-   [ ] Mở lại và chọn một mục.
-   [ ] Xác nhận danh sách đóng trong cả ba trường hợp.
-   [ ] Xác nhận danh sách phủ lên Editor, không làm Editor co giãn.
-   [ ] Xác nhận danh sách không bị thanh cuộn hoặc minimap của Monaco
    che khuất.

### M4-08 --- Đồng bộ khi chuyển file

-   [ ] Mở dải quan hệ của file A.
-   [ ] Chuyển nhanh qua file B, C và D.
-   [ ] Xác nhận số lượng và nội dung dải luôn thuộc file đang xem.
-   [ ] Xác nhận không hiển thị dữ liệu trả về muộn của file trước.

### M4-09 --- Ẩn comment và nhảy dòng

-   [ ] Bật **Ẩn comment**.
-   [ ] Mở danh sách quan hệ có số dòng.
-   [ ] Bấm một dòng.
-   [ ] Xác nhận chế độ ẩn comment tự tắt.
-   [ ] Xác nhận Editor nhảy đúng dòng trong file gốc.

### M4-10 --- Không làm gián đoạn Worker / bố cục

-   [ ] Mở project lớn trong lúc sơ đồ đang sắp xếp.
-   [ ] Mở dải quan hệ và chuyển qua các tab.
-   [ ] Xác nhận dải vẫn phản hồi.
-   [ ] Xác nhận sơ đồ tiếp tục sắp xếp, không bị hủy hoặc đứng hình.
-   [ ] Kiểm tra Console không có lỗi đỏ.

### M4-11 --- Đồng bộ số lượng quan hệ (hồi quy M4.2)

-   [ ] Bấm một node file.
-   [ ] So sánh số **Dùng / Được dùng bởi** ở bảng thông tin node với số
    trên dải quan hệ.
-   [ ] Xác nhận hai vị trí hiển thị cùng số liệu.
-   [ ] Xác nhận node file không mang nhãn **trong màn hình này** cho số
    liệu toàn mô hình.
-   [ ] Bấm node endpoint / route / thư viện ngoài.
-   [ ] Xác nhận bậc quan hệ trong màn hình được ghi nhãn phù hợp.
-   [ ] Bấm nhanh nhiều node liên tiếp.
-   [ ] Xác nhận không hiển thị số liệu của node được chọn trước đó.

------------------------------------------------------------------------

## 7. M5 --- Sơ đồ class C

### M5-01 --- Tab và trạng thái sơ đồ file

-   [ ] Mở thư mục có file C#.
-   [ ] Xác nhận có hai tab **Sơ đồ file \| Sơ đồ class**.
-   [ ] Chuyển sang tab **Sơ đồ class**.
-   [ ] Quay lại tab **Sơ đồ file**.
-   [ ] Xác nhận Sigma không bị dựng lại, không đứng hình và kích thước
    vùng vẽ chính xác.

### M5-02 --- Parse file C# và hiển thị UML

-   [ ] Chọn file `.cs`.
-   [ ] Mở tab **Sơ đồ class**.
-   [ ] Xác nhận hộp UML hiển thị class, thuộc tính, phương thức và quan
    hệ.
-   [ ] Xác nhận class cha nằm phía trên theo bố cục phân tầng.
-   [ ] Kiểm tra mũi tên kế thừa, thực thi, kết hợp và tập hợp.

### M5-03 --- Chế độ theo file đang chọn

-   [ ] Bật chế độ **Theo file đang chọn**.
-   [ ] Chọn file `.cs` thứ nhất và xác nhận sơ đồ hiển thị class của
    file đó.
-   [ ] Chọn file `.cs` thứ hai và xác nhận sơ đồ cập nhật.
-   [ ] Chọn file không hỗ trợ parser.
-   [ ] Xác nhận thông báo vàng xuất hiện và sơ đồ trước đó được giữ
    nguyên.

### M5-04 --- Bấm class / thành viên để mở mã

-   [ ] Bấm một hộp class.
-   [ ] Xác nhận Editor mở đúng file và nhảy tới dòng khai báo class.
-   [ ] Xác nhận tên class được tô sáng.
-   [ ] Bấm một thuộc tính.
-   [ ] Xác nhận nhảy tới dòng khai báo thuộc tính.
-   [ ] Bấm một phương thức.
-   [ ] Xác nhận nhảy tới dòng khai báo phương thức.
-   [ ] Thử class / thành viên có attribute ở dòng phía trên.
-   [ ] Xác nhận vị trí nhảy là dòng khai báo thật, không phải dòng
    attribute.
-   [ ] Focus một hộp và nhấn Enter; xác nhận mở mã nguồn.
-   [ ] Kéo hộp và xác nhận thao tác kéo không bị hiểu nhầm thành thao
    tác bấm.

### M5-05 --- Ghim nhiều file

-   [ ] Bấm **+ Thêm file đang chọn**.
-   [ ] Xác nhận file được thêm vào tập file của sơ đồ.
-   [ ] Dùng **Ctrl/Cmd + bấm** một file `.cs` trong Explorer.
-   [ ] Xác nhận file được ghim và hàng có dấu nhận biết.
-   [ ] Xác nhận sơ đồ có class từ nhiều file và quan hệ xuyên file.
-   [ ] Xác nhận mỗi file có chip và nút ✕ để bỏ.
-   [ ] Bỏ một file bằng nút ✕.
-   [ ] Xác nhận class của file đó được loại khỏi sơ đồ.
-   [ ] Kiểm tra số file trên tab **Sơ đồ class**.
-   [ ] Bấm **Theo file đang chọn** và xác nhận quay về chế độ theo dõi.
-   [ ] Bấm nút **Sơ đồ class** ở header Editor và xác nhận tab mở /
    file được thêm khi cần.
-   [ ] Ctrl/Cmd + bấm file không phải `.cs` và xác nhận file vẫn được
    mở bình thường.

### M5-06 --- Namespace, partial và kiểu lồng

-   [ ] Chọn hai file có class `partial`.
-   [ ] Xác nhận các phần của cùng class được gộp thành một hộp.
-   [ ] Bấm một thành viên thuộc file thứ hai.
-   [ ] Xác nhận Editor mở đúng file chứa thành viên đó.
-   [ ] Kiểm tra hai class trùng tên ở hai namespace.
-   [ ] Xác nhận chúng xuất hiện thành hai hộp riêng.
-   [ ] Kiểm tra quan hệ theo cùng namespace, `using` và qualifier như
    `B.User`.
-   [ ] Xác nhận quan hệ mơ hồ không được vẽ.
-   [ ] Kiểm tra kiểu lồng `Outer.Inner` và xác nhận quan hệ trỏ tới
    kiểu lồng phù hợp.

### M5-07 --- Tương tác và bố cục sơ đồ class

-   [ ] Bấm **Xếp tự động** và xác nhận bố cục được tính lại.
-   [ ] Bấm **Vừa khung** và xác nhận sơ đồ nằm gọn trong vùng nhìn.
-   [ ] Thử nút `−` / `+` để thu phóng.
-   [ ] Kéo một hộp class.
-   [ ] Xác nhận đường nối được cập nhật và không xuyên qua hộp.
-   [ ] Chọn một hộp.
-   [ ] Xác nhận quan hệ của hộp được làm nổi bật, phần còn lại mờ đi.
-   [ ] Chuyển sang file khác rồi quay lại.
-   [ ] Xác nhận vị trí hộp đã kéo được giữ trong cùng phiên.
-   [ ] Tải lại trang và xác nhận không kỳ vọng vị trí kéo được lưu qua
    lần tải lại.

### M5-08 --- Giới hạn số class

-   [ ] Chọn tập file có tổng số class lớn hơn 60.
-   [ ] Xác nhận sơ đồ chỉ vẽ tối đa 60 class đầu.
-   [ ] Xác nhận cảnh báo có dạng **Chỉ vẽ 60 / N class**.

### M5-09 --- Đồng bộ số quan hệ

-   [ ] Bấm node file và so sánh số **Dùng / Được dùng bởi** ở bảng
    thông tin với dải quan hệ Editor.
-   [ ] Xác nhận hai số khớp nhau.
-   [ ] Kiểm tra node endpoint / route / thư viện ngoài và nhãn bậc
    trong màn hình.
-   [ ] Chuyển nhanh qua nhiều node và xác nhận không có dữ liệu cũ.
-   [ ] Mở thư mục khác và xác nhận sơ đồ class / tập file được reset.

### M5-10 --- Console

-   [ ] Mở DevTools.
-   [ ] Thực hiện các thao tác tab, bấm, kéo, ghim nhiều file và đổi
    workspace.
-   [ ] Xác nhận không có lỗi đỏ trong Console.

------------------------------------------------------------------------

## 8. M5b --- Sơ đồ class Java, Kotlin và Python

> Thử trên mã nguồn thực tế, mỗi ngôn ngữ ít nhất một lần. Các thao tác
> tab, bấm class / thành viên, kéo hộp, ghim nhiều file và Ctrl/Cmd +
> bấm kế thừa các test case M5.

### M5B-01 --- Nhận diện phần mở rộng

-   [ ] Chọn file `.java` và mở tab **Sơ đồ class**.
-   [ ] Xác nhận sơ đồ class xuất hiện, không báo chưa hỗ trợ.
-   [ ] Lặp lại với file `.kt`.
-   [ ] Lặp lại với file `.py`.
-   [ ] Chọn file không hỗ trợ, ví dụ `.js`.
-   [ ] Xác nhận thông báo vàng nêu các định dạng hỗ trợ: C# (`.cs`),
    Java (`.java`), Kotlin (`.kt`), Python (`.py`).
-   [ ] Dùng Ctrl/Cmd + bấm để ghim file Java, Kotlin và Python.
-   [ ] Dùng nút **Sơ đồ class** ở header Editor với từng định dạng.

### M5B-02 --- Java: loại class và modifier

-   [ ] Kiểm tra class thường được hiển thị đúng loại.
-   [ ] Kiểm tra `interface` hiển thị «interface».
-   [ ] Kiểm tra `enum` hiển thị «enum».
-   [ ] Kiểm tra `record` hiển thị «record».
-   [ ] Kiểm tra `abstract class` được hiển thị chữ nghiêng.
-   [ ] Kiểm tra visibility: `public` → `+`, `private` → `-`,
    `protected` → `#`, không ghi modifier → `~`.
-   [ ] Kiểm tra trường `static` được gạch chân.
-   [ ] Kiểm tra khai báo `int a, b[]` được tách thành hai trường.
-   [ ] Kiểm tra phương thức generic không hiển thị phần `<T …>` theo
    giới hạn parser.
-   [ ] Kiểm tra enum liệt kê các hằng số.
-   [ ] Kiểm tra kiểu lồng `Outer.Inner` được hiển thị thành hộp riêng.

### M5B-03 --- Java: quan hệ

-   [ ] Kiểm tra `extends` tạo quan hệ kế thừa.
-   [ ] Kiểm tra `implements` tạo quan hệ thực thi bằng nét đứt.
-   [ ] Kiểm tra trường kiểu `List<Foo>` tạo quan hệ tập hợp và có ký
    hiệu `*`.
-   [ ] Kiểm tra trường kiểu `Foo` tạo quan hệ kết hợp.
-   [ ] Chọn nhiều file Java có import / tham chiếu giữa chúng.
-   [ ] Xác nhận quan hệ xuyên file được nối đúng.

### M5B-04 --- Kotlin: loại class và thuộc tính constructor

-   [ ] Kiểm tra `data class` hiển thị «record».
-   [ ] Kiểm tra từng tham số `val` / `var` của primary constructor được
    hiển thị là thuộc tính.
-   [ ] Kiểm tra tham số constructor thông thường (không có `val` /
    `var`) không được hiển thị thành thuộc tính.
-   [ ] Kiểm tra `object` hiển thị «static».
-   [ ] Kiểm tra `sealed class` được hiển thị chữ nghiêng.
-   [ ] Kiểm tra hàm hiển thị theo dạng `tên(tham số: Kiểu): KiểuTrảVề`.
-   [ ] Kiểm tra thành viên trong `companion object` được hiển thị như
    static của lớp ngoài.
-   [ ] Kiểm tra quan hệ kế thừa / thực thi theo cú pháp `:`.

### M5B-05 --- Kotlin: suy luận kiểu và xử lý chuỗi

-   [ ] Kiểm tra thuộc tính không ghi kiểu nhưng khởi tạo bằng `Foo()`
    vẫn tạo quan hệ tới `Foo`.
-   [ ] Kiểm tra thuộc tính khởi tạo bằng `mutableListOf<Foo>()` vẫn tạo
    quan hệ tới `Foo`.
-   [ ] Tạo / chọn file có chuỗi mẫu `${…}`.
-   [ ] Tạo / chọn file có raw string ba nháy chứa dấu `{` và `}`.
-   [ ] Xác nhận sơ đồ không bị vỡ cấu trúc hoặc phát sinh class /
    member giả do nội dung chuỗi.
-   [ ] Kiểm tra comment lồng nhau không làm sai kết quả parse.

### M5B-06 --- Python: loại class và decorator

-   [ ] Kiểm tra `@dataclass` hiển thị «record».
-   [ ] Kiểm tra class kế thừa `Enum` hiển thị «enum» và các giá trị
    enum được liệt kê.
-   [ ] Kiểm tra class kế thừa `Protocol` hiển thị «interface».
-   [ ] Kiểm tra class kế thừa `ABC` được hiển thị chữ nghiêng.
-   [ ] Kiểm tra `@property` hiển thị như thuộc tính.
-   [ ] Kiểm tra `@staticmethod` được gạch chân.
-   [ ] Kiểm tra setter trùng tên property không tạo thuộc tính trùng
    lặp.

### M5B-07 --- Python: thuộc tính và visibility

-   [ ] Kiểm tra `self.x = …` trong `__init__` được nhận diện là thuộc
    tính.
-   [ ] Kiểm tra kiểu thuộc tính lấy từ annotation của tham số, ví dụ
    `def __init__(self, repo: Repo): self.repo = repo`.
-   [ ] Kiểm tra forward reference `'Foo'` vẫn tạo được quan hệ tới
    `Foo`.
-   [ ] Kiểm tra tên `_x` hiển thị visibility `#`.
-   [ ] Kiểm tra tên `__x` hiển thị visibility `-`.
-   [ ] Kiểm tra class định nghĩa bên trong hàm không xuất hiện trên sơ
    đồ.
-   [ ] Kiểm tra thuộc tính trong `__post_init__` nếu có dữ liệu phù
    hợp.

### M5B-08 --- Nhảy tới dòng khai báo

-   [ ] Bấm một class Java và xác nhận Editor mở đúng file / dòng khai
    báo.
-   [ ] Bấm một member Java và xác nhận nhảy đúng dòng.
-   [ ] Lặp lại với Kotlin.
-   [ ] Lặp lại với Python.
-   [ ] Với member có decorator / annotation ở dòng phía trên, xác nhận
    vị trí nhảy là dòng khai báo (`def` / khai báo member), không phải
    dòng decorator / annotation.

### M5B-09 --- Nhiều module / package

-   [ ] Chọn nhiều file Java có `package` và import giữa các file.
-   [ ] Xác nhận quan hệ xuyên file được nối đúng.
-   [ ] Chọn nhiều file Python có import giữa các module.
-   [ ] Kiểm tra `from .x import Y` được giải quyết theo vị trí module.
-   [ ] Kiểm tra `from m import X` tạo quan hệ tới đúng kiểu `X`.
-   [ ] Kiểm tra hai class trùng tên ở hai module mà file sử dụng không
    import đích danh.
-   [ ] Xác nhận không tạo mũi tên mơ hồ giữa hai class trùng tên đó.

### M5B-10 --- Trộn ngôn ngữ trong sơ đồ

-   [ ] Ghim một file `.java` và một file `.py` vào cùng sơ đồ.
-   [ ] Xác nhận class của cả hai file cùng hiển thị.
-   [ ] Xác nhận không có quan hệ chéo giữa hai ngôn ngữ.
-   [ ] Có thể bổ sung file `.kt` và xác nhận sơ đồ vẫn hiển thị đúng.

### M5B-11 --- Đầu vào lỗi và hiệu năng

-   [ ] Mở file Kotlin đang gõ dở / thiếu ngoặc.
-   [ ] Xác nhận ứng dụng không treo và không có lỗi đỏ trong Console.
-   [ ] Lặp lại với Java.
-   [ ] Lặp lại với Python.
-   [ ] Thử file lớn gần giới hạn phân tích.
-   [ ] Xác nhận UI vẫn phản hồi; nếu thời gian parse lâu, ghi nhận kích
    thước file và thời gian.
-   [ ] Xác nhận dữ liệu lỗi không làm hỏng sơ đồ của file khác.

------------------------------------------------------------------------

## 9. Kiểm thử hồi quy toàn ứng dụng

### REG-01 --- Luồng sử dụng xuyên suốt

-   [ ] Mở thư mục dự án.
-   [ ] Chọn project từ Tổng quan.
-   [ ] Tìm một file trong Explorer.
-   [ ] Mở file trong Editor.
-   [ ] Tìm symbol / nội dung và nhảy tới dòng.
-   [ ] Mở dải quan hệ và điều hướng sang file liên quan.
-   [ ] Mở sơ đồ class của file được hỗ trợ.
-   [ ] Bấm class / member để quay lại mã nguồn.
-   [ ] Quay về sơ đồ file và xác nhận trạng thái hoạt động bình thường.

### REG-02 --- Đổi workspace liên tục

-   [ ] Mở thư mục A, thực hiện tìm kiếm và mở Editor.
-   [ ] Mở thư mục B.
-   [ ] Xác nhận dữ liệu của A được reset.
-   [ ] Mở thư mục C ngay sau đó.
-   [ ] Xác nhận không có kết quả bất đồng bộ từ A/B ghi đè lên
    workspace C.

### REG-03 --- Khả năng tương thích trình duyệt

-   [ ] Chrome/Edge: chọn thư mục, phân tích, mở file và tìm kiếm.
-   [ ] Firefox/Safari: chọn thư mục qua `webkitdirectory`, phân tích và
    mở file.
-   [ ] Kiểm tra Monaco worker, Web Worker và WebGL.
-   [ ] Ghi nhận trình duyệt / phiên bản nếu có khác biệt.

### REG-04 --- Kiểm tra giới hạn và thông báo

-   [ ] File lớn hơn 3 MB không được đưa vào phân tích theo quy tắc hiện
    tại.
-   [ ] File nhị phân không được hiển thị như mã nguồn văn bản.
-   [ ] Thư mục bị ignore không xuất hiện trong danh sách file.
-   [ ] Bật **Gồm thư viện & mã sinh tự động** và kiểm tra các nhóm được
    phép đưa trở lại.
-   [ ] File không có node vẫn có thể được mở từ Explorer.
-   [ ] File không được parser sơ đồ class hỗ trợ hiển thị thông báo rõ
    ràng, không làm mất sơ đồ đang có.

### REG-05 --- Kiểm tra tự động và build

-   [ ] Chạy `npm test` và ghi nhận tổng số test pass / fail.
-   [ ] Xác nhận không có test bị treo.
-   [ ] Chạy `npm run build`.
-   [ ] Chạy `npm run build:single`.
-   [ ] Chạy `npm run preview` và thử luồng mở file / Editor.
-   [ ] Kiểm tra Console và Network không có lỗi tải tài nguyên quan
    trọng.

------------------------------------------------------------------------

## 10. Những giới hạn cần lưu ý khi đánh giá kết quả

Các điểm dưới đây là giới hạn đã nêu trong `ROADMAP.md` / `README.md`;
không tự động xem là lỗi nếu ứng dụng xử lý đúng theo phạm vi hiện tại:

-   Parser Java, Kotlin, C# và Python là parser nhẹ dựa trên regex / đếm
    ngoặc, không phải trình biên dịch.
-   Java / Kotlin / Python chưa hỗ trợ đầy đủ class cục bộ hoặc class ẩn
    danh trong thân hàm.
-   Kotlin `.kts` và Python `.pyi` chưa được nhận diện.
-   Python không bao phủ thuộc tính được gán trong method bất kỳ ngoài
    `__init__` / `__post_init__`; alias import phức tạp như
    `from m import A as B` chưa được hỗ trợ.
-   Kotlin / Python không đưa hàm và thuộc tính mức file không thuộc
    class lên sơ đồ class.
-   Sơ đồ class chỉ vẽ tối đa 60 class trong một lần hiển thị.
-   Quan hệ mơ hồ không được vẽ để tránh nối sai; quan hệ suy đoán có
    thể được đánh dấu `≈`.
-   Import JS/TS không mang tên symbol nên dải quan hệ có thể mở đầu
    file đích thay vì dòng định nghĩa cụ thể.
-   Tìm kiếm là chuỗi con, không phân biệt hoa thường; chưa có regex /
    tìm nguyên từ. Danh sách tên file và các nhóm kết quả có giới hạn số
    lượng theo thiết kế.
-   Ứng dụng chỉ đọc; không hỗ trợ sửa và lưu file ra đĩa.
-   Độ rộng panel và hình dạng node không được đảm bảo lưu qua lần tải
    lại theo quyết định hiện tại; kiểm tra hành vi trong phiên, không
    đánh giá là lỗi nếu không được lưu sau reload.

------------------------------------------------------------------------

## 11. Nhật ký kiểm thử

  ---------------------------------------------------------------------------
  Ngày     Người    Phiên    Trình    Nhóm           Pass       Fail Ghi chú
           kiểm thử bản /    duyệt    test                           
                    commit                                           
  -------- -------- -------- -------- -------- ---------- ---------- --------
                                                                     

                                                                     

                                                                     
  ---------------------------------------------------------------------------

### Danh sách lỗi phát hiện

  ID        Test case   Mô tả lỗi   Các bước tái hiện   Mức độ   Trạng thái
  --------- ----------- ----------- ------------------- -------- ------------
  BUG-001                                                        
  BUG-002                                                        
  BUG-003

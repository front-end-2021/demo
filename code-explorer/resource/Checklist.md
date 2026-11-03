## Checklist

**Mở thư mục và đọc file**

1. Mở thư mục (Chrome/Edge: `showDirectoryPicker`; Firefox/Safari: hộp chọn thư mục) → thấy tiến độ, rồi màn hình Tổng quan.
2. Rê chuột vào node project → hiện bảng thông tin; bấm → vào chi tiết project.
3. Trong project: bấm node → làm nổi bật + bảng thông tin; bấm đúp node mờ (ghost) → nhảy sang project kia, node đó được chọn sẵn *(tính năng bấm đúp đã bị tắt ở M4.2)*.
4. Bật/tắt "Gồm thư viện & mã sinh tự động" → phân tích lại.
5. Đổi hình dạng một loại node ở chú thích → node đổi ngay; tải lại trang vẫn giữ.
6. "Dừng sắp xếp" / "Sắp xếp lại" / "Vừa khung"; nút lọc node 3 trạng thái.
7. "Báo cáo" → hiện Markdown, "Chép Markdown" hoạt động.
8. Mở thư mục thứ hai khi đang có sơ đồ → sơ đồ cũ được xoá sạch, không lỗi.
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

**Monaco editor cho các ngôn ngữ lập trình**

1. Trong một project, **bấm một node file** → panel bên phải mở ra, hiện đường dẫn, "ngôn ngữ · kích thước" và mã có tô màu cú pháp. Lần đầu có thể thấy "Đang đọc file…" một lúc (đang tải Monaco), các lần sau gần như tức thì. Mở thử các loại: `.cs`, `.js`/`.ts`, `.vue`, `.css`, `.json`.
3. Bấm node khác → đổi file. Cuộn file A xuống giữa, sang file B, rồi quay lại A → **phải về đúng chỗ đã cuộn**.
4. **Kéo thanh chia đôi**: sơ đồ co giãn mượt, không bị méo hay trống; kéo hết cỡ vẫn còn một phần sơ đồ; tải lại trang thì độ rộng được nhớ.
5. **"Ẩn comment"**: bật thì comment biến mất, tắt thì trở lại; nút mờ đi với `.md`, `.json`, `.csproj`. File trên đĩa không đổi.
6. **Đóng/mở**: ✕ đóng panel (sơ đồ vẫn giữ node đang chọn và sơ đồ giãn ra lại đủ rộng); nút **Mã nguồn** trên thanh trên mở lại; bấm lại đúng node đang chọn cũng mở lại.
7. Bấm vào khoảng trống của sơ đồ (bỏ chọn) và đổi qua lại Tổng quan / project → panel **vẫn giữ file đang xem**.
8. Node của project khác (ghost, nét mờ) → mở được file; node endpoint / route / thư viện ngoài → **không** làm đổi panel.
9. Mở thư mục khác (hoặc đổi "Gồm thư viện…") → panel tự đóng.
10. Trình duyệt thứ hai (Firefox/Safari, kiểu `webkitdirectory`): bước 2 vẫn mở đúng file.
11. Mở Console (F12): không có lỗi đỏ, nhất là dạng *"Could not create web worker"* hay *"MonacoEnvironment"*.

**Danh sách file và bộ lọc**

1. Mở thư mục → **sidebar trái** hiện ra với số file ở đầu và các **chip đuôi file có đếm**; sơ đồ và editor vẫn như M2. Nút **Danh sách file** đóng/mở; kéo thanh chia đôi bên trái đổi độ rộng (nhớ sau khi tải lại, sơ đồ luôn còn chỗ).
2. Bấm chip: chọn thêm / bỏ đuôi; **Alt + bấm** = chỉ chọn đuôi đó; "Tất cả" đặt lại.
3. Bấm một file trong danh sách → editor mở file. Nếu đang ở Tổng quan hoặc project khác, sơ đồ **tự chuyển sang đúng project**, node được chọn và camera căn vào node. File không có node (`README.md`, `.csproj`, `.json`) → chỉ mở editor, sơ đồ giữ nguyên.
4. Bấm một node trên sơ đồ → danh sách **cuộn tới file đó**, hàng có viền xanh.

**Tìm kiếm** (gõ và đợi khoảng 0,25 giây, hoặc nhấn Enter)

1. Gõ tên file (vd. `app vue`): mục **Tên file** hiện tức thì, mọi từ phải khớp, tên bắt đầu bằng từ khoá xếp trên.
6. Gõ tên một class / hàm: mục **Symbol**; bấm → mở file và **nhảy đúng dòng khai báo** (dòng nhấp nháy vàng khoảng 2 giây).
7. Gõ một chuỗi có trong code: mục **Nội dung** hiện dần ("Đang quét x/y"), mỗi file có số lần khớp và dòng trích dẫn có chữ tô vàng; bấm → editor nhảy tới dòng khớp đầu tiên và **tô sáng mọi chỗ khớp** (cả trên thanh cuộn).
8. **Làm nổi bật trên sơ đồ**: khi có truy vấn, node có kết quả nổi lên, còn lại mờ đi; ở Tổng quan là các project có kết quả. Xoá truy vấn → trở lại bình thường.
9. Gõ tiếp khi đang quét → quét cũ dừng, kết quả không bị lẫn. **Quan trọng**: mở một project lớn và gõ tìm ngay khi sơ đồ còn đang sắp xếp — sơ đồ **không được đứng hình**.
10. Phím: **Ctrl+K** (cả khi con trỏ đang ở editor) mở Explorer và focus ô tìm; ↑ ↓ chọn hàng; Enter mở; Esc xoá ô tìm.
11. Bật "Ẩn comment", rồi bấm một kết quả có số dòng → tự tắt ẩn comment và vẫn nhảy đúng dòng.
12. Dự án lớn: danh sách cuộn mượt; mở thư mục khác → danh sách, bộ lọc và ô tìm được đặt lại.
13. Firefox / Safari (`webkitdirectory`): kết quả vẫn mở đúng file. Console (F12) không có lỗi đỏ.
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

**Lỗi đồng bộ đã sửa, kiểm lại**

11. Bấm một node file: dòng "Dùng n · Được dùng bởi m" ở bảng thông tin **trùng** với số trên dải quan hệ trong editor và không còn nhãn "(trong màn hình này)". Bấm node endpoint / route / thư viện ngoài vẫn hiện bậc trong màn hình với nhãn đó. Bấm lướt nhanh nhiều node → không hiện nhầm số của node trước.
12. Console (F12) không có lỗi đỏ.
1. **Nhận diện đuôi file**: chọn một file `.java`, `.kt`, `.py` rồi sang tab *Sơ đồ class*: sơ đồ hiện ra (trước M5b sẽ báo "chưa hỗ trợ"). Thông báo vàng của file không hỗ trợ (vd. `.js`) giờ ghi "hiện hỗ trợ: C# (.cs), Java (.java), Kotlin (.kt), Python (.py)". Ctrl + bấm và nút "Sơ đồ class" ở header editor cũng dùng được cho cả ba.
2. **Java**: hộp có đúng loại (class / «interface» / «enum» / «record»); `abstract class` chữ nghiêng; vis `+ - # ~` đúng với `public/private/protected/(không ghi)`; trường tĩnh gạch chân; `int a, b[]` thành hai trường; phương thức generic hiện không kèm `<T …>`; enum liệt kê các hằng số; kiểu lồng nhau (`Outer.Inner`) là hộp riêng. Mũi tên: `extends` (kế thừa), `implements` (thực thi, nét đứt), trường kiểu `List<Foo>` (tập hợp, có `*`), trường kiểu `Foo` (kết hợp).
3. **Kotlin**: `data class` hiện «record» và **mỗi tham số `val`/`var` của constructor chính là một thuộc tính** (tham số thường thì không); `object` hiện «static»; `sealed class` chữ nghiêng; hàm hiện dạng `tên(tham số: Kiểu): KiểuTrảVề`; thành viên của `companion object` hiện như static; thuộc tính không ghi kiểu mà khởi tạo bằng `Foo()` hoặc `mutableListOf<Foo>()` vẫn có quan hệ tới `Foo`. Thử thêm một file có chuỗi mẫu `${…}` và raw string ba nháy chứa dấu `{ }` — sơ đồ không bị vỡ.
4. **Python**: `@dataclass` hiện «record», `Enum` hiện «enum» với các giá trị, `Protocol` hiện «interface», `ABC` chữ nghiêng; `@property` hiện như thuộc tính; `@staticmethod` gạch chân; `self.x` trong `__init__` thành thuộc tính (kiểu lấy từ annotation của tham số, vd. `def __init__(self, repo: Repo): self.repo = repo` → có quan hệ tới `Repo`); `'Foo'` (forward ref) vẫn nối được; `_x` là `#`, `__x` là `-`. Class định nghĩa BÊN TRONG hàm **không** hiện.
5. **Nhảy tới dòng**: bấm class và bấm một thành viên trong từng ngôn ngữ → editor mở đúng file và nhảy đúng dòng (sau decorator / annotation, tức dòng `def` / dòng khai báo, không phải dòng `@…`).
6. **Nhiều module / package**: chọn nhiều file Python hoặc Java, có `import` / `from .x import Y` giữa chúng → mũi tên nối xuyên file đúng; hai class trùng tên ở hai module mà file dùng không import đích danh → **không** có mũi tên (cố ý, tránh nối sai).
7. **Trộn ngôn ngữ**: ghim một file `.java` và một file `.py` vào cùng sơ đồ → cả hai hiện; không có quan hệ chéo giữa hai ngôn ngữ.
8. File Kotlin / Java / Python rất lớn hoặc đang gõ dở (thiếu ngoặc) → không treo, không có lỗi đỏ trong Console.
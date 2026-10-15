# Code Mindmap

Vẽ sơ đồ liên kết giữa class / hàm / file của một thư mục dự án (C#, Java, Python, JS/TS, Vue, HTML, CSS) ngay trong trình duyệt. Mã nguồn chỉ được đọc cục bộ, không tải lên đâu cả.

```bash
npm install
npm run dev      # phát triển
npm run build    # build ra dist/
```

## Cách dùng

1. **Chọn thư mục dự án**: có thể là cả solution lớn (hàng chục nghìn file).
2. Màn hình **Tổng quan**: mỗi node là một project, số trên cạnh là số tham chiếu giữa hai project. Rê chuột để xem thống kê, bấm để mở project.
3. Màn hình **project**: class / hàm của project đó, kèm các node của project khác mà nó dùng hoặc được dùng (vẽ nhỏ, nhạt màu ở rìa).
   - Bấm một node để làm nổi bật liên kết của nó (xanh = gọi đi, cam = được gọi).
   - **Bấm đúp** node của project khác (hoặc nút "Mở …" trong bảng thông tin) để nhảy sang project đó, node đó được chọn sẵn.
   - Chuyển nhanh giữa các project bằng ô chọn trên thanh điều khiển; bố cục mỗi màn hình được lưu, mở lại là hiện ngay.
4. Nếu chỉ chọn một project (vd. riêng `MarketingStrategy.BLL`), app mở thẳng vào chi tiết.

Các nút khác: **Sắp xếp lại / Dừng sắp xếp**, **Vừa khung**, **lọc node** (ẩn node độc lập → ẩn node có liên kết → hiện tất cả), chọn **hình dạng node** theo loại ở bảng chú thích.

## Project được nhận diện thế nào

- Thư mục chứa `.csproj` / `.vbproj` / `package.json` / `pom.xml` / `build.gradle` / `pyproject.toml`… ngoài cùng là một project.
- Thư mục không có file đánh dấu nào: mỗi thư mục cấp 1 là một project.

## Những gì bị bỏ qua

- **Luôn bỏ qua**: thư mục bắt đầu bằng dấu chấm (`.git`, `.vs`…), `bin`, `obj`, `packages`, `node_modules`, `dist`, `build`…, và file > 1 MB.
- **Bỏ qua mặc định** (bật lại bằng ô *Gồm thư viện & mã sinh tự động*):
  - Thư viện JS/CSS: theo tên (jquery, bootstrap, moment…), theo thư mục (`lib`, `vendor`, `bower_components`…), theo banner bản quyền (`/*!`, `@license`) hoặc khung UMD.
  - Mã sinh tự động: `Service References`, `*.Designer.cs`, `*.g.cs`, `Reference.cs`, `AssemblyInfo.cs`, `*.intellisense.js`, `*.min.js`, `*.d.ts`…
  - Danh sách nằm ở đầu `src/utils/sourceFiles.js` nếu cần chỉnh.

Comment và dòng trống được xoá trước khi phân tích, nên tên hàm nằm trong comment không bị tính là lời gọi.

## Kiến trúc

```
src/
├── App.vue                  giao diện, vẽ bằng Sigma.js (WebGL), điều hướng tổng quan ↔ project
├── parser.worker.js         Web Worker: đọc + phân tích + tách project + tính bố cục (giữ toàn bộ mô hình)
└── utils/
    ├── sourceFiles.js       liệt kê file, nhận diện project, lọc thư viện / mã sinh tự động, đọc + làm sạch
    ├── stripComments.js     xoá comment & dòng trống thừa (hiểu chuỗi ký tự, theo từng ngôn ngữ)
    ├── codeParser.js        tìm định nghĩa và lời gọi → node + cạnh (ưu tiên định nghĩa cùng project)
    ├── layout.js            ForceAtlas2 theo từng đợt, huỷ được giữa chừng
    └── nodeShapes.js        chương trình WebGL vẽ node tròn / vuông / tam giác
```

Luồng chính chỉ liệt kê file. Worker tự đọc từng file, làm sạch ngay và bỏ nội dung gốc, nên dự án lớn không bị giữ hai bản trong bộ nhớ. Giao diện chỉ nhận phần đồ thị của màn hình đang xem.

Giới hạn: bộ phân tích dựa trên biểu thức chính quy (không phải trình biên dịch). Method trùng tên trong các class khác nhau của cùng một project được gộp lại; method C#/Java chưa tách thành node riêng, lời gọi được tính cho class chứa nó.

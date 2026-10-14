Dưới đây là hướng dẫn chi tiết và đoạn code mẫu hoàn chỉnh viết bằng Vue 3 (Composition API / <script setup>) tích hợp đầy đủ tính năng: lọc bỏ thư mục rác sinh ra khi build (bin, target, venv), nhận diện loại ngôn ngữ, sử dụng Debounce để tìm kiếm không lag và hiển thị đoạn trích (snippet) kết quả.

### 1. Cài đặt thư viện bổ sung (Khuyến nghị)

Để tính năng Debounce hoạt động chính xác và giao diện đọc code có màu sắc chuẩn dev, bạn mở terminal của project Vue 3 và cài đặt:
bash
npm install lodash-es prismjs
Hãy thận trọng khi sử dụng mã.
(Lưu ý: Bạn cũng có thể dùng highlight.js thay cho prismjs tùy sở thích).

### 2. Code mẫu hoàn chỉnh (App.vue)


### 3. Những điểm mấu chốt được giải quyết trong Code mẫu:

1. **`BLACKLIST_FOLDERS` thực tế:** Loại ngay các folder sinh ra khi compile ứng dụng mã nguồn lớn. Bạn thử nạp một project `.NET` nó sẽ tự động lờ đi hàng nghìn file trong folder `obj` và `bin`, giúp app chạy cực mượt.
2. **`ALLOWED_EXTENSIONS` chọn lọc:** Giới hạn chỉ đọc file code thuần văn bản. Nếu người dùng vô tình để các file ảnh (`.png`, `.jpg`) hay file cấu hình nặng dạng nhị phân, hệ thống sẽ bỏ qua không cố nạp vào `file.text()` nhằm tiết kiệm RAM tối đa.
3. **Debounce (Trễ thông minh):** Sử dụng hàm `debounce` từ `lodash-es` giúp ích rất lớn. Khi gõ từ khóa "Controller", trình duyệt sẽ không thực hiện tìm kiếm liên tục sau mỗi chữ "C", "o", "n"... mà nó đợi bạn gõ xong hẳn, dừng 300ms rồi mới quét đồng loạt các file.
4. **Snippet & Highlight:** Hiển thị vị trí xuất hiện của từ khóa cùng một đoạn ký tự trước/sau nó để người dùng biết nhanh bối cảnh dòng code đó là gì trước khi click xem toàn bộ file.

<FollowUp>
Bạn có muốn tôi hỗ trợ thêm về phần nào dựa trên đoạn code này không?
* Cách cấu hình **PrismJS** để tự động tô màu code (Syntax Highlighting) cho chuyên nghiệp.
* Cách tạo thêm tính năng **nhấp đúp chuột để tải xuống (download)** file đã chỉnh sửa ngược lại máy tính.
</FollowUp>


code-viewer-project/
├── node_modules/             # Thư mục chứa các thư viện npm đã cài đặt
├── public/                   # Thư mục chứa tài nguyên tĩnh (favicon, v.v...)
├── src/                      # Thư mục chứa mã nguồn chính
│   ├── assets/               # Chứa các file css, hình ảnh dùng chung
│   ├── components/           # (Tùy chọn) Nơi chứa các component nhỏ tách rời
│   ├── App.vue               # Component gốc chứa toàn bộ mã nguồn tôi đã cung cấp
│   └── main.js               # File khởi tạo ứng dụng Vue 3
├── .gitignore                # File cấu hình bỏ qua khi đẩy lên GitHub
├── index.html                # File HTML chính (nơi Vue mount ứng dụng vào)
├── package.json              # File quản lý thông tin dự án và các thư viện cài đặt
└── vite.config.js            # File cấu hình của Vite

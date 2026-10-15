# Code Viewer

Xem, tìm kiếm và chỉnh sửa nhanh mã nguồn của một thư mục dự án ngay trong trình duyệt (Vue 3 + Monaco). File chỉ được đọc cục bộ, không tải lên máy chủ.

## Chạy

```bash
npm install
npm run dev          # phát triển
npm run build        # build ra dist/
```

## Tính năng

- Mở thư mục bằng nút hoặc **kéo thả** thư mục vào cửa sổ. Tự bỏ qua `bin`, `obj`, `node_modules`, `.git`, `venv`… và file > 5 MB.
- Tìm trong tên và nội dung file (debounce 250 ms): hiện số lần khớp và dòng đầu tiên chứa từ khoá; mở file sẽ tô sáng mọi vị trí khớp và cuộn tới vị trí đầu.
- Lọc theo đuôi file (kèm số lượng), kéo cạnh sidebar để đổi độ rộng.
- Mỗi file giữ bản nháp và lịch sử hoàn tác riêng; file có thay đổi chưa lưu được đánh dấu chấm cam.
- `Dọn comment` cho file `.cs` (hoàn tác được bằng Ctrl Z), tải file về máy.
- Giao diện sáng/tối theo hệ điều hành, co giãn trên màn hình hẹp.

## Phím tắt

| Phím | Tác dụng |
| --- | --- |
| Ctrl/⌘ K | Tìm kiếm |
| ↑ ↓ / Enter | Di chuyển và mở file trong kết quả |
| Esc | Xoá từ khoá |
| Ctrl/⌘ S | Lưu file đang mở (vào phiên làm việc) |

## Cấu trúc

```
src/
├── App.vue                   # thanh trên, sidebar kết quả, đọc thư mục, tìm kiếm
├── components/CodeEditor.vue # Monaco editor + thanh công cụ của file
├── styles.css                # toàn bộ CSS (token màu + class dùng chung)
├── utils/csharp.js           # xoá comment C#
└── utils/file.js             # tính / định dạng kích thước
```
# Taskflow (Vue 3 + Pinia + Vite)

Giao diện quản lý task: topbar full-width, sidebar kéo giãn được, màn Overview và form edit trượt từ phải sang.

## Chạy

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # build ra dist/
npm run build:single # build ra 1 file HTML: dist-single/index.html
```

## Chức năng đã có

- **Topbar** (cao 48px): logo + tên app bên trái, tab điều hướng ở giữa, nút Settings và avatar bên phải.
- **Sidebar** (rộng 52px, cao đến hết màn): My tasks, Dashboard, Messages, News, Todos.
  - Đưa chuột vào **mép phải** để kéo giãn (52–280px). Từ ~132px trở lên sẽ hiện nhãn chữ. Double-click mép để thu về 52px. Độ rộng được nhớ lại.
- **Overview**: nhóm To-do / On Progress / In Review (thu gọn/mở rộng được), checkbox, deadline, assignee, priority.
- **Double-click một hàng** → form edit (rộng 560px) trượt từ phải sang trái. Nút **+ New Task** và nút **+** ở mỗi nhóm cũng mở form theo cách này.
- Trong form, mọi thay đổi **ghi thẳng vào store** nên hiện ngay trên bảng: tên task, priority, status (đổi status sẽ chuyển task sang nhóm khác), assignee, deadline, mô tả, sub-task, file đính kèm, bình luận.
- **History** (icon đồng hồ trong form): ghi lại thao tác theo từng task — Deadline, Assignee, Priority, Status, tiêu đề, mô tả, Done, sub-task, file, bình luận. Các lần gõ liên tiếp được gộp, sửa về như cũ thì bỏ entry, thêm rồi xoá ngay thì triệt tiêu.
  Task không còn lưu `createdAt`/`modifiedAt`: ngày tạo = entry `created`, lần sửa gần nhất = entry cuối của `history` (dự án cũng vậy, lấy từ các task). Dữ liệu cũ trong localStorage tự được chuyển sang history.
- **`v-in-view`** (`src/directives/inView.js`): directive theo dõi phần tử có đang trong vùng nhìn thấy hay không, dựa trên IntersectionObserver (giống vue-observe-visibility). Mọi phần tử đang theo dõi được lưu trong một `Map` tạo ở `main.js` (`inject(IN_VIEW_KEY)` hoặc `$inView`). Đang áp dụng cho các hàng `.row.item` của Overview, kết quả ghi vào `data-in-view="true|false"`.

  ```html
  <div v-in-view="{ callback: inViewport, throttle: TmThrotte, intersection: OjIntersec }" />
  ```

  `callback(isVisible, entry)`; `throttle` là số ms tối thiểu giữa 2 lần gọi (leading + trailing, luôn báo trạng thái cuối); `intersection` là `{ root, rootMargin, threshold }`. Đổi `intersection` thì observer tự tạo lại, gỡ phần tử khỏi DOM thì tự dọn khỏi Map.
- **Diagrams** (tab sau Timeline): đọc mã nguồn **C#** và vẽ sơ đồ UML các class.
  - Khung *Source* bên trái chứa mã C# (có sẵn mã mẫu, nút **Sample** để nạp lại); gõ xong khoảng 0,3s là sơ đồ tự vẽ lại. Hỗ trợ class / abstract class / interface / struct / record / enum, class lồng nhau, partial, generic, property, constructor, operator.
  - Ô class hiển thị stereotype, lớp cha / interface, thuộc tính và phương thức với ký hiệu `+ - # ~` (abstract in nghiêng, static gạch chân).
  - Quan hệ tự động: kế thừa (mũi tên tam giác rỗng), hiện thực interface (nét đứt), association (field có kiểu là class khác) và aggregation (field kiểu danh sách `List<T>`, `T[]`...).
  - **Kéo thả** từng ô (bám lưới 10px), phím mũi tên dịch ô đang chọn (Shift = 50px). Chọn một ô thì quan hệ của nó được tô nổi bật.
  - Đường nối được **vẽ tự động và né các ô class** (thuật toán A* trên lưới, ưu tiên ít khúc rẽ, hạn chế chạy trùng nhau); đi theo ngay khi kéo.
  - **Auto layout** xếp lớp cha ở trên, lớp con ở dưới. Zoom −/+ và Fit. Mã nguồn và vị trí được lưu trong `localStorage` (key `taskflow.diagram.v1`).
- Phím `Esc` đóng form. Task mới mà chưa nhập gì sẽ tự bỏ khi đóng form.
- Dữ liệu task lưu trong `localStorage` (key `taskflow.tasks.v1`); xoá key này để về dữ liệu mẫu.

## Cấu trúc

```
src/
  stores/
    tasks.js   # Pinia: danh sách task, nhóm theo status, thêm/sửa/xoá, sub-task, file, comment
    diagram.js # Pinia: mã C#, vị trí các class, class đang chọn (lưu localStorage)
    ui.js      # Pinia: độ rộng sidebar, tab đang chọn, trạng thái form edit, nhóm thu gọn
  components/
    TopBar.vue  SideBar.vue  OverviewView.vue  TaskDrawer.vue
    DiagramsView.vue  ClassBox.vue # tab Diagrams: sơ đồ UML, ô class kéo thả
    HistoryMenu.vue # icon History + popover timeline các thao tác của task
    Dropdown.vue # dropdown dùng chung (animation + shadow + phím tắt): Assignee, Priority, Status
    Icon.vue    # icon từ Bootstrap Icons (https://icons.getbootstrap.com/)
    Avatar.vue  FileIcon.vue
  directives/inView.js # v-in-view + Map registry ở root app
  utils/format.js
  utils/csharp.js   # đọc mã C# → class, thành viên, quan hệ
  utils/diagram.js  # bố cục tự động + đi dây trực giao né ô class
  data/sampleCSharp.js # mã C# mẫu
  utils/history.js  # chuyển entry history thành icon/tiêu đề/giá trị trước → sau
```

Thêm icon mới: `npm i bootstrap-icons` đã có sẵn, chỉ cần import file `.svg?raw` tương ứng trong `Icon.vue` và khai báo vào object `icons`.

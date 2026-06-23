# Game 2.5D – PixiJS Demo
Game demo 2.5D dùng **PixiJS v8** + **Vite**, không cần asset hình ảnh (nhân vật/vật cản/nhà được vẽ bằng code – `PIXI.Graphics`).

## Tính năng
1. **Điều khiển nhân vật bằng chuột** – Click chọn nhân vật (vòng sáng vàng hiện ra) → Click vào mặt đất để nhân vật di chuyển tới đó. Giữ **Shift** khi click để chạy (run) thay vì đi bộ (walk).
2. **Vật cản (đá 🪨, cây 🌲) + Pathfinding A\*** – Nhân vật tự động tìm đường vòng qua vật cản. Nếu điểm đến bị vật cản bao kín hoàn toàn (không có đường tới), nhân vật sẽ **dừng lại tại chỗ** và hiện thông báo.
3. **NPC lính canh (vòng đỏ)** – Tuần tra ngẫu nhiên giữa các waypoint được gán riêng cho từng NPC, đi vòng qua vật cản như nhân vật chính. Khi phát hiện người chơi trong tầm nhìn, NPC sẽ đuổi theo (chạy) và tấn công khi đủ gần. Nếu người chơi thoát khỏi tầm nhìn, NPC quay lại tuần tra.
4. **State machine đầy đủ 6 trạng thái**: `idle`, `walk`, `run`, `attack`, `dead`, `respawn` – áp dụng cho cả nhân vật chính và NPC. NPC/người chơi chết sẽ tự động hồi sinh sau vài giây tại vị trí xuất phát.
5. **Kéo-thả object (nhà 🏠)** – Click chọn nhà (vòng sáng vàng) → giữ chuột và kéo để di chuyển nhà tới vị trí mới. Vị trí vật cản trên bản đồ (dùng cho pathfinding) được cập nhật lại theo thời gian thực.

## Cài đặt & chạy
Yêu cầu: **Node.js 18+** đã cài trên máy.

```bash
# 1. Giải nén / vào thư mục project
cd pixi-game

# 2. Cài dependencies
npm install

# 3. Chạy dev server (tự mở trình duyệt tại http://localhost:5173)
npm run dev
```

Để build bản production (file tĩnh trong thư mục `dist/`):

```bash
npm run build
npm run preview   # xem thử bản build
```

## Cấu trúc thư mục
```
pixi-game/
├── index.html              # Trang HTML chính + HUD hướng dẫn
├── package.json
├── vite.config.js
└── src/
    ├── main.js                  # Khởi tạo PIXI.Application, fit màn hình, game loop
    ├── core/
    │   ├── Grid.js              # Lưới logic + thuật toán A* pathfinding (8 hướng, có làm trơn đường đi)
    │   └── StateMachine.js      # State machine dùng chung (idle/walk/run/attack/dead/respawn)
    ├── entities/
    │   ├── CharacterView.js     # Vẽ + animate nhân vật bằng Graphics (không cần ảnh)
    │   ├── Character.js         # Logic nhân vật: di chuyển theo path, HP, attack, state machine
    │   ├── GuardNPC.js          # Kế thừa Character: AI tuần tra waypoint + phát hiện + đuổi đánh
    │   ├── Obstacle.js          # Đá / cây (vật cản tĩnh)
    │   └── DraggableProp.js     # Nhà (object chọn + kéo-thả được)
    └── systems/
        └── GameWorld.js         # Điều phối scene, input chuột, selection, update loop
```

## Cách chơi nhanh
| Hành động | Cách thực hiện |
|---|---|
| Chọn nhân vật | Click vào nhân vật của bạn (thân màu xanh, viền vàng mũ) |
| Di chuyển | Click vào mặt đất sau khi đã chọn nhân vật |
| Chạy thay vì đi bộ | Giữ **Shift** khi click vào mặt đất |
| Tấn công lính canh | Chọn nhân vật của bạn → click vào lính canh (thân đỏ). Nếu chưa đủ gần, nhân vật sẽ tự chạy tới rồi đánh |
| Di chuyển nhà | Click chọn nhà → giữ chuột và **kéo** tới vị trí mới rồi thả |
| Bỏ chọn | Click một lần (không kéo) ra vùng đất trống khi đang chọn nhà |


## Ghi chú kỹ thuật
- **Pathfinding**: A* trên lưới ô vuông (cell size 28px), 8 hướng di chuyển, có chặn "cắt góc" qua 2 vật cản chéo nhau, và làm trơn đường đi (loại bỏ điểm trung gian thẳng hàng) để di chuyển tự nhiên hơn.
- **Chiều sâu 2.5D**: được tạo bằng bóng đổ (shadow ellipse) dưới chân mỗi nhân vật/vật cản, cùng với z-order sắp xếp theo toạ độ Y (đối tượng ở Y lớn hơn vẽ đè lên đối tượng ở Y nhỏ hơn).
- **Toàn bộ logic cốt lõi** (A* pathfinding, state machine, AI tuần tra/phát hiện, cập nhật lưới khi kéo-thả) đã được viết unit test và xác minh hoạt động đúng trước khi đóng gói.
- Có thể thêm nhiều NPC/vật cản/nhà bằng cách chỉnh trực tiếp trong `GameWorld.js` (`_buildObstacles`, `_buildGuards`, `_buildProps`).

Đã làm gì:
core/Grid.js — A* pathfinding 8 hướng, có làm trơn đường đi, trả null khi đích bị vật cản bao kín hoàn toàn
core/StateMachine.js — 6 trạng thái: idle/walk/run/attack/dead/respawn
entities/Character.js, GuardNPC.js — logic di chuyển theo path, tấn công, AI tuần tra waypoint ngẫu nhiên + phát hiện/đuổi theo
entities/Obstacle.js, DraggableProp.js — đá/cây và nhà kéo-thả được, tự cập nhật lại Grid khi di chuyển
systems/GameWorld.js — điều phối toàn bộ input chuột, selection, update loop
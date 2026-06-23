/**
 * Grid.js
 * ---------------------------------------------------------------
 * Quản lý lưới (grid) logic cho pathfinding kiểu A*.
 * Thế giới game là 2.5D (góc nhìn isometric giả lập bằng cách vẽ
 * theo trục Y để tạo độ sâu), nhưng pathfinding chạy trên lưới 2D
 * thông thường (x, y) ánh xạ trực tiếp từ toạ độ thế giới.
 * ---------------------------------------------------------------
 */

export class Grid {
    /**
     * @param {number} worldWidth
     * @param {number} worldHeight
     * @param {number} cellSize  kích thước 1 ô lưới (px)
     */
    constructor(worldWidth, worldHeight, cellSize = 32) {
        this.cellSize = cellSize;
        this.cols = Math.ceil(worldWidth / cellSize);
        this.rows = Math.ceil(worldHeight / cellSize);
        // true = đi được, false = vật cản
        this.walkable = new Array(this.cols * this.rows).fill(true);
    }
    index(cx, cy) { return cy * this.cols + cx }
    inBounds(cx, cy) { return 0 <= cx && 0 <= cy && cx < this.cols && cy < this.rows }
    worldToCell(x, y) {
        return {
            cx: Math.floor(x / this.cellSize),
            cy: Math.floor(y / this.cellSize)
        }
    }
    cellToWorld(cx, cy) {
        return {
            x: cx * this.cellSize + this.cellSize / 2,
            y: cy * this.cellSize + this.cellSize / 2
        }
    }
    setWalkable(cx, cy, value) {
        if (this.inBounds(cx, cy)) {
            this.walkable[this.index(cx, cy)] = value;
        }
    }

    isWalkable(cx, cy) {
        if (!this.inBounds(cx, cy)) return false;
        return this.walkable[this.index(cx, cy)];
    }

    /**
     * Đánh dấu một vùng tròn (tâm world x,y, bán kính px) là vật cản.
     * Dùng khi đặt đá / cây xuống bản đồ.
     */
    markCircleObstacle(worldX, worldY, radius) {
        const { cx: centerCx, cy: centerCy } = this.worldToCell(worldX, worldY);
        const cellRadius = Math.ceil(radius / this.cellSize) + 1;
        for (let dy = -cellRadius; dy <= cellRadius; dy++) {
            for (let dx = -cellRadius; dx <= cellRadius; dx++) {
                const cx = centerCx + dx;
                const cy = centerCy + dy;
                if (!this.inBounds(cx, cy)) continue;
                const { x, y } = this.cellToWorld(cx, cy);
                const dist = Math.hypot(x - worldX, y - worldY);
                if (dist <= radius) {
                    this.setWalkable(cx, cy, false);
                }
            }
        }
    }

    /** Xoá toàn bộ vật cản đã đánh dấu trong 1 vùng tròn (dùng khi kéo nhà đi nơi khác) */
    clearCircleObstacle(worldX, worldY, radius) {
        const { cx: centerCx, cy: centerCy } = this.worldToCell(worldX, worldY);
        const cellRadius = Math.ceil(radius / this.cellSize) + 1;
        for (let dy = -cellRadius; dy <= cellRadius; dy++) {
            for (let dx = -cellRadius; dx <= cellRadius; dx++) {
                const cx = centerCx + dx;
                const cy = centerCy + dy;
                if (!this.inBounds(cx, cy)) continue;
                const { x, y } = this.cellToWorld(cx, cy);
                const dist = Math.hypot(x - worldX, y - worldY);
                if (dist <= radius) {
                    this.setWalkable(cx, cy, true);
                }
            }
        }
    }

    /** Tìm cell đi được gần nhất với 1 cell cho trước (xoắn ốc tìm xung quanh) */
    findNearestWalkable(cx, cy, maxRadius = 12) {
        if (this.isWalkable(cx, cy)) return { cx, cy };
        for (let r = 1; r <= maxRadius; r++) {
            for (let dy = -r; dy <= r; dy++) {
                for (let dx = -r; dx <= r; dx++) {
                    if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
                    const nx = cx + dx;
                    const ny = cy + dy;
                    if (this.isWalkable(nx, ny)) return { cx: nx, cy: ny };
                }
            }
        }
        return null;
    }
}

/**
 * A* pathfinding trên lưới với 8 hướng di chuyển.
 * Trả về danh sách điểm world-space [{x,y}, ...] hoặc null nếu không tìm được đường đi tới đích (đích bị vật cản bao kín hoàn toàn).
 */
export function findPath(grid, startWorld, endWorld) {
    const start = grid.worldToCell(startWorld.x, startWorld.y);
    let end = grid.worldToCell(endWorld.x, endWorld.y);
    // Toạ độ world chính xác sẽ dùng cho điểm cuối cùng của path (snap chính xác tới nơi người chơi click, thay vì luôn là tâm ô lưới).
    let exactEndWorld = { x: endWorld.x, y: endWorld.y };

    if (!grid.inBounds(start.cx, start.cy)) return null;

    // Nếu đích nằm đúng trên vật cản, thử kéo về cell đi được gần nhất
    if (!grid.isWalkable(end.cx, end.cy)) {
        const nearest = grid.findNearestWalkable(end.cx, end.cy, 6);
        if (!nearest) return null; // đích bị vật cản bao kín hoàn toàn -> không có đường
        end = nearest;
        exactEndWorld = grid.cellToWorld(end.cx, end.cy); // không còn world gốc hợp lệ, dùng tâm cell mới
    }

    const startIdx = grid.index(start.cx, start.cy);
    const endIdx = grid.index(end.cx, end.cy);
    if (startIdx === endIdx) {
        return [exactEndWorld];
    }

    const open = new Map(); // idx -> node
    const closed = new Set();
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();

    const heuristic = (cx, cy) => {
        const dx = Math.abs(cx - end.cx);
        const dy = Math.abs(cy - end.cy);
        // Octile distance (phù hợp 8 hướng)
        return (dx + dy) + (Math.SQRT2 - 2) * Math.min(dx, dy);
    };

    gScore.set(startIdx, 0);
    fScore.set(startIdx, heuristic(start.cx, start.cy));
    open.set(startIdx, { cx: start.cx, cy: start.cy });

    const neighborsOf = [
        { dx: 1, dy: 0, cost: 1 }, { dx: -1, dy: 0, cost: 1 },
        { dx: 0, dy: 1, cost: 1 }, { dx: 0, dy: -1, cost: 1 },
        { dx: 1, dy: 1, cost: Math.SQRT2 }, { dx: -1, dy: -1, cost: Math.SQRT2 },
        { dx: 1, dy: -1, cost: Math.SQRT2 }, { dx: -1, dy: 1, cost: Math.SQRT2 }
    ];

    let iterations = 0;
    const MAX_ITERATIONS = 8000; // an toàn, tránh treo trên bản đồ lớn

    while (open.size > 0) {
        iterations++;
        if (iterations > MAX_ITERATIONS) return null;

        // Lấy node có fScore nhỏ nhất trong open set
        let currentIdx = null;
        let currentNode = null;
        let bestF = Infinity;
        for (const [idx, node] of open) {
            const f = fScore.get(idx) ?? Infinity;
            if (f < bestF) {
                bestF = f;
                currentIdx = idx;
                currentNode = node;
            }
        }

        if (currentIdx === endIdx) {
            // Dựng lại đường đi
            const path = [];
            let traceIdx = currentIdx;
            while (cameFrom.has(traceIdx)) {
                const node = open.get(traceIdx) || cameFrom.get(traceIdx).node;
                path.push(node);
                traceIdx = cameFrom.get(traceIdx).from;
            }
            path.push({ cx: start.cx, cy: start.cy });
            path.reverse();
            const worldPath = path.map(n => grid.cellToWorld(n.cx, n.cy));
            // Snap điểm cuối cùng về toạ độ world chính xác đã click (UX chính xác hơn)
            worldPath[worldPath.length - 1] = exactEndWorld;
            return worldPath;
        }

        open.delete(currentIdx);
        closed.add(currentIdx);

        for (const n of neighborsOf) {
            const ncx = currentNode.cx + n.dx;
            const ncy = currentNode.cy + n.dy;
            if (!grid.inBounds(ncx, ncy)) continue;
            if (!grid.isWalkable(ncx, ncy)) continue;

            // Chặn cắt góc chéo qua 2 vật cản (tránh xuyên tường khi đi chéo)
            if (n.dx !== 0 && n.dy !== 0) {
                if (!grid.isWalkable(currentNode.cx + n.dx, currentNode.cy) ||
                    !grid.isWalkable(currentNode.cx, currentNode.cy + n.dy)) {
                    continue;
                }
            }

            const nIdx = grid.index(ncx, ncy);
            if (closed.has(nIdx)) continue;

            const tentativeG = (gScore.get(currentIdx) ?? Infinity) + n.cost;
            if (tentativeG < (gScore.get(nIdx) ?? Infinity)) {
                cameFrom.set(nIdx, { from: currentIdx, node: { cx: ncx, cy: ncy } });
                gScore.set(nIdx, tentativeG);
                fScore.set(nIdx, tentativeG + heuristic(ncx, ncy));
                if (!open.has(nIdx)) {
                    open.set(nIdx, { cx: ncx, cy: ncy });
                }
            }
        }
    }
    return null; // không tìm được đường -> nhân vật sẽ dừng lại
}

/**
 * Làm trơn đường đi bằng cách loại bỏ các điểm trung gian thẳng hàng (line-of-sight smoothing đơn giản) để di chuyển tự nhiên hơn,
 * tránh việc nhân vật "lắc lư" theo từng ô lưới nhỏ.
 */
export function smoothPath(grid, path) {
    if (!path || path.length <= 2) return path;

    const hasLineOfSight = (a, b) => {
        // Bresenham-like sampling theo px để kiểm tra có cắt vật cản không
        const steps = Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / (grid.cellSize / 2));
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = a.x + (b.x - a.x) * t;
            const y = a.y + (b.y - a.y) * t;
            const { cx, cy } = grid.worldToCell(x, y);
            if (!grid.isWalkable(cx, cy)) return false;
        }
        return true;
    };

    const result = [path[0]];
    let anchorIdx = 0;
    for (let i = 1; i < path.length; i++) {
        if (i === path.length - 1) {
            result.push(path[i]);
            break;
        }
        if (!hasLineOfSight(path[anchorIdx], path[i + 1])) {
            result.push(path[i]);
            anchorIdx = i;
        }
    }
    return result;
}
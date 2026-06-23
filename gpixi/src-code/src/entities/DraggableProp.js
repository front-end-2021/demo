/**
 * DraggableProp.js
 * ---------------------------------------------------------------
 * Object tĩnh trên bản đồ có thể được CHỌN rồi KÉO-THẢ tới vị trí
 * mới (ví dụ: nhà). Khi kéo thả, nó cũng là vật cản trên Grid nên
 * cần cập nhật lại Grid (xoá obstacle cũ, đánh dấu obstacle mới)
 * mỗi khi vị trí thay đổi — việc này được GameWorld xử lý thông
 * qua callback onMoved.
 * ---------------------------------------------------------------
 */
import { Container, Graphics } from 'pixi.js';

export class DraggableProp extends Container {
    constructor(opts = {}) {
        super();
        this.x = opts.x ?? 0;
        this.y = opts.y ?? 0;
        this.collisionRadius = opts.collisionRadius ?? 44;
        this.isDragging = false;

        this.shadow = new Graphics();
        this.shadow.ellipse(0, 10, this.collisionRadius * 1.05, this.collisionRadius * 0.4);
        this.shadow.fill({ color: 0x000000, alpha: 0.35 });

        this.body = new Graphics();
        this._drawHouse();

        this.selectionRing = new Graphics();
        this.selectionRing.ellipse(0, 14, this.collisionRadius * 1.15, this.collisionRadius * 0.5);
        this.selectionRing.stroke({ color: 0xffd866, width: 3 });
        this.selectionRing.visible = false;

        this.addChild(this.shadow, this.body, this.selectionRing);

        this.eventMode = 'static';
        this.cursor = 'pointer';
    }

    _drawHouse() {
        const g = this.body;
        g.clear();
        // tường
        g.rect(-32, -10, 64, 46);
        g.fill({ color: 0xd9b48f });
        g.stroke({ color: 0x8a6240, width: 2 });
        // mái
        g.poly([-40, -10, 0, -48, 40, -10]);
        g.fill({ color: 0xa33b3b });
        g.stroke({ color: 0x6e2424, width: 2 });
        // cửa
        g.roundRect(-9, 10, 18, 26, 3);
        g.fill({ color: 0x5a3d22 });
        // cửa sổ
        g.rect(-26, 0, 12, 12);
        g.fill({ color: 0x9fd6e8 });
        g.rect(14, 0, 12, 12);
        g.fill({ color: 0x9fd6e8 });
        // ống khói
        g.rect(20, -40, 8, 18);
        g.fill({ color: 0x8a6240 });
    }

    setSelected(selected) { this.selectionRing.visible = selected }

    setGhostMode(isGhost) {
        // Khi đang kéo, làm mờ + bỏ alpha bóng để biết là đang "preview" vị trí
        this.alpha = isGhost ? 0.7 : 1;
    }
}
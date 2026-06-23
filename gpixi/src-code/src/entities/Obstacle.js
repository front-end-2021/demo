/**
 * Obstacle.js
 * ---------------------------------------------------------------
 * Vật cản tĩnh trên bản đồ: đá hoặc cây. Mỗi obstacle có 1
 * collisionRadius dùng để đánh dấu vùng "không đi được" lên Grid
 * cho pathfinding A*.
 * ---------------------------------------------------------------
 */
import { Container, Graphics } from 'pixi.js';

export class Obstacle extends Container {
    /**
     * @param {object} opts
     * @param {'rock'|'tree'} opts.type
     * @param {number} opts.x
     * @param {number} opts.y
     * @param {number} opts.scale
     */
    constructor(opts = {}) {
        super();
        this.type = opts.type ?? 'rock';
        this.x = opts.x ?? 0;
        this.y = opts.y ?? 0;
        this.zIndex = this.y;

        const g = new Graphics();
        this.shadow = new Graphics();

        if (this.type === 'rock') {
            this.collisionRadius = 22 * (opts.scale ?? 1);
            this.shadow.ellipse(0, 6, this.collisionRadius * 0.9, this.collisionRadius * 0.35);
            this.shadow.fill({ color: 0x000000, alpha: 0.3 });

            g.poly([
                -18, 6,
                -22, -8,
                -8, -22,
                6, -24,
                20, -10,
                22, 6,
                10, 14,
                -6, 16
            ]);
            g.fill({ color: 0x7d7d7d });
            g.stroke({ color: 0x4a4a4a, width: 2 });
            // vài vết nứt / highlight
            g.moveTo(-8, -10).lineTo(2, 0);
            g.stroke({ color: 0x5a5a5a, width: 2 });
            g.circle(-4, -10, 4);
            g.fill({ color: 0x969696 });
        } else {
            // tree
            this.collisionRadius = 18 * (opts.scale ?? 1);
            this.shadow.ellipse(0, 6, this.collisionRadius * 1.1, this.collisionRadius * 0.4);
            this.shadow.fill({ color: 0x000000, alpha: 0.3 });

            // thân cây
            g.roundRect(-5, -10, 10, 30, 3);
            g.fill({ color: 0x6b4423 });
            // lá (3 tầng tròn xếp lên)
            g.circle(0, -38, 24);
            g.fill({ color: 0x2f7d32 });
            g.circle(-14, -24, 18);
            g.fill({ color: 0x3a8d3e });
            g.circle(14, -24, 18);
            g.fill({ color: 0x3a8d3e });
            g.circle(0, -16, 19);
            g.fill({ color: 0x357f3a });
        }

        this.addChild(this.shadow, g);
        if (opts.scale) this.scale.set(opts.scale);
    }
}
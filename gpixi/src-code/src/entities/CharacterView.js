/**
 * CharacterView.js
 * ---------------------------------------------------------------
 * Vẽ nhân vật bằng PIXI.Graphics theo phong cách "billboard 2.5D":
 * thân được vẽ với độ rộng/cao 2D nhưng có bóng đổ (shadow ellipse)
 * dưới chân để tạo cảm giác chiều sâu/độ cao trên mặt đất.
 *
 * Hỗ trợ animate đơn giản theo state: idle (lắc nhẹ), walk/run (lắc tay
 * chân + bước), attack (vươn vũ khí), dead (ngã xuống), respawn (mờ dần hiện ra).
 * ---------------------------------------------------------------
 */
import { Container, Graphics, Text } from 'pixi.js';

export class CharacterView extends Container {
    /**
     * @param {object} opts
     * @param {number} opts.bodyColor
     * @param {number} opts.accentColor
     * @param {number} opts.radius  bán kính thân nhân vật
     * @param {string} opts.label   tên hiển thị phía trên đầu
     * @param {boolean} opts.isEnemy
     */
    constructor(opts = {}) {
        super();
        this.bodyColor = opts.bodyColor ?? 0x4fa3ff;
        this.accentColor = opts.accentColor ?? 0xffffff;
        this.radius = opts.radius ?? 16;
        this.isEnemy = !!opts.isEnemy;

        this.shadow = new Graphics();
        this.addChild(this.shadow);

        this.bodyRoot = new Container();
        this.addChild(this.bodyRoot);

        this.legL = new Graphics();
        this.legR = new Graphics();
        this.torso = new Graphics();
        this.armL = new Graphics();
        this.armR = new Graphics();
        this.head = new Graphics();
        this.weapon = new Graphics();

        this.bodyRoot.addChild(this.legL, this.legR, this.armL, this.armR, this.torso, this.head, this.weapon);

        this.selectionRing = new Graphics();
        this.selectionRing.visible = false;
        this.addChildAt(this.selectionRing, 0);

        this.hpBarBg = new Graphics();
        this.hpBarFg = new Graphics();
        this.hpBarBg.y = -this.radius * 2 - 16;
        this.hpBarFg.y = this.hpBarBg.y;
        this.addChild(this.hpBarBg, this.hpBarFg);

        if (opts.label) {
            this.nameText = new Text({
                text: opts.label,
                style: {
                    fontSize: 12,
                    fill: this.isEnemy ? 0xff8a8a : 0xbfe3ff,
                    fontWeight: 'bold',
                    stroke: { color: 0x000000, width: 3 }
                }
            });
            this.nameText.anchor.set(0.5, 1);
            this.nameText.y = -this.radius * 2 - 20;
            this.addChild(this.nameText);
        }

        this._animTime = 0;
        this._walkCycle = 0;
        this.facing = 1; // 1 = phải, -1 = trái

        this.redraw();
        this.setSelected(false);
        this.setHpRatio(1);
    }

    redraw() {
        const r = this.radius;

        // Bóng đổ dưới chân — đặc trưng của view 2.5D, tạo cảm giác đứng trên mặt đất
        this.shadow.clear();
        this.shadow.ellipse(0, 4, r * 0.95, r * 0.4);
        this.shadow.fill({ color: 0x000000, alpha: 0.35 });

        // Chân (2 thanh nhỏ)
        this.legL.clear();
        this.legL.roundRect(-r * 0.35, -r * 0.1, r * 0.28, r * 0.9, 4);
        this.legL.fill({ color: 0x2b2b2b });
        this.legR.clear();
        this.legR.roundRect(r * 0.07, -r * 0.1, r * 0.28, r * 0.9, 4);
        this.legR.fill({ color: 0x2b2b2b });

        // Thân
        this.torso.clear();
        this.torso.roundRect(-r * 0.55, -r * 1.5, r * 1.1, r * 1.5, 6);
        this.torso.fill({ color: this.bodyColor });
        this.torso.stroke({ color: 0x000000, alpha: 0.25, width: 2 });

        // Tay
        this.armL.clear();
        this.armL.roundRect(-r * 0.78, -r * 1.35, r * 0.26, r * 0.95, 4);
        this.armL.fill({ color: this.bodyColor });
        this.armR.clear();
        this.armR.roundRect(r * 0.52, -r * 1.35, r * 0.26, r * 0.95, 4);
        this.armR.fill({ color: this.bodyColor });

        // Đầu
        this.head.clear();
        this.head.circle(0, -r * 1.85, r * 0.55);
        this.head.fill({ color: 0xffd9ab });
        this.head.circle(-r * 0.18, -r * 1.85, r * 0.07);
        this.head.fill({ color: 0x222222 });
        this.head.circle(r * 0.18, -r * 1.85, r * 0.07);
        this.head.fill({ color: 0x222222 });

        // Mũ / dải màu accent để phân biệt nhân vật
        this.head.roundRect(-r * 0.6, -r * 2.25, r * 1.2, r * 0.35, 3);
        this.head.fill({ color: this.accentColor });

        // Vũ khí (kiếm/giáo) — ẩn mặc định, hiện khi attack
        this.weapon.clear();
        this.weapon.roundRect(0, -r * 1.6, r * 0.16, r * 1.3, 2);
        this.weapon.fill({ color: this.isEnemy ? 0xcccccc : 0xe0c068 });
        this.weapon.x = r * 0.75;
        this.weapon.rotation = 0.3;
        this.weapon.visible = this.isEnemy; // lính canh luôn lộ vũ khí

        this.selectionRing.clear();
        this.selectionRing.ellipse(0, r * 0.55, r * 1.15, r * 0.5);
        this.selectionRing.stroke({ color: this.isEnemy ? 0xff5050 : 0xffd866, width: 3, alpha: 0.95 });
    }

    setSelected(selected) { this.selectionRing.visible = selected }

    setHpRatio(ratio) {
        const w = this.radius * 1.8;
        this.hpBarBg.clear();
        this.hpBarBg.roundRect(-w / 2, 0, w, 5, 2);
        this.hpBarBg.fill({ color: 0x222222, alpha: 0.8 });
        this.hpBarFg.clear();
        const clamped = Math.max(0, Math.min(1, ratio));
        const color = clamped > 0.5 ? 0x6fe06f : (clamped > 0.2 ? 0xe0c068 : 0xe05a5a);
        this.hpBarFg.roundRect(-w / 2, 0, w * clamped, 5, 2);
        this.hpBarFg.fill({ color });
        this.hpBarBg.x = 0;
        this.hpBarFg.x = 0;
    }

    setFacing(dir) {
        if (dir === 0) return;
        this.facing = dir > 0 ? 1 : -1;
        this.bodyRoot.scale.x = this.facing;
    }

    /**
     * Gọi mỗi frame để cập nhật animation theo state hiện tại.
     * @param {string} state
     * @param {number} dt giây
     * @param {object} extra { attackElapsed, deadElapsed, respawnElapsed }
     */
    animate(state, dt, extra = {}) {
        this._animTime += dt;

        switch (state) {
            case 'idle': {
                this.bodyRoot.y = Math.sin(this._animTime * 2) * 1.2;
                this.armL.rotation = Math.sin(this._animTime * 1.5) * 0.05;
                this.armR.rotation = -Math.sin(this._animTime * 1.5) * 0.05;
                this.legL.rotation = 0;
                this.legR.rotation = 0;
                this.bodyRoot.rotation = 0;
                break;
            }
            case 'walk': {
                this._walkCycle += dt * 7;
                this.bodyRoot.y = Math.abs(Math.sin(this._walkCycle)) * -2;
                this.legL.rotation = Math.sin(this._walkCycle) * 0.5;
                this.legR.rotation = -Math.sin(this._walkCycle) * 0.5;
                this.armL.rotation = -Math.sin(this._walkCycle) * 0.4;
                this.armR.rotation = Math.sin(this._walkCycle) * 0.4;
                this.bodyRoot.rotation = 0;
                break;
            }
            case 'run': {
                this._walkCycle += dt * 13;
                this.bodyRoot.y = Math.abs(Math.sin(this._walkCycle)) * -4;
                this.legL.rotation = Math.sin(this._walkCycle) * 0.8;
                this.legR.rotation = -Math.sin(this._walkCycle) * 0.8;
                this.armL.rotation = -Math.sin(this._walkCycle) * 0.7;
                this.armR.rotation = Math.sin(this._walkCycle) * 0.7;
                this.bodyRoot.rotation = 0.06;
                break;
            }
            case 'attack': {
                this.weapon.visible = true;
                const t = Math.min(1, (extra.attackElapsed ?? 0) * 2.2);
                const swing = Math.sin(Math.min(Math.PI, t * Math.PI));
                this.armR.rotation = -1.2 * swing;
                this.weapon.rotation = 0.3 - swing * 1.4;
                this.bodyRoot.rotation = 0.08 * swing;
                break;
            }
            case 'dead': {
                const t = extra.deadElapsed ?? 0;
                this.bodyRoot.rotation = (Math.PI / 2) * Math.min(1, t * 3);
                this.bodyRoot.y = Math.min(this.radius * 0.6, t * 30);
                this.alpha = Math.max(0.35, 1 - t * 0.3);
                break;
            }
            case 'respawn': {
                const t = extra.respawnElapsed ?? 0;
                this.alpha = Math.min(1, t * 1.5);
                this.bodyRoot.rotation = 0;
                this.bodyRoot.y = 0;
                this.scale.set(Math.min(1, t * 1.5));
                break;
            }
            default:
                break;
        }
    }
    resetPose() {
        this.bodyRoot.rotation = 0;
        this.bodyRoot.y = 0;
        this.alpha = 1;
        this.scale.set(1, 1);
        this.weapon.visible = this.isEnemy;
    }
}
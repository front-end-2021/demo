/**
 * GuardNPC.js
 * ---------------------------------------------------------------
 * NPC lính canh: di chuyển ngẫu nhiên giữa các waypoint được giao
 * (mô phỏng "canh gác một khu vực"), dùng A* để né vật cản khi đi
 * giữa các waypoint. Nếu phát hiện Player trong tầm nhìn -> đuổi
 * theo và tấn công. Nếu Player ra khỏi tầm -> quay lại tuần tra.
 * ---------------------------------------------------------------
 */
import { Character } from './Character.js';
import { findPath, smoothPath } from '../core/Grid.js';
import { CharacterState } from '../core/StateMachine.js';

export class GuardNPC extends Character {
    /**
     * @param {object} opts kế thừa Character opts, thêm:
     * @param {Array<{x:number,y:number}>} opts.waypoints  các điểm tuần tra
     * @param {number} opts.visionRange  tầm nhìn phát hiện player
     * @param {number} opts.idleTimeMin/Max  thời gian đứng nghỉ giữa các lượt đi
     */
    constructor(opts = {}) {
        super({
            ...opts,
            isEnemy: true,
            bodyColor: opts.bodyColor ?? 0x963b3b,
            accentColor: opts.accentColor ?? 0x2b2b2b,
            label: opts.label ?? 'Lính canh'
        });
        this.waypoints = opts.waypoints ?? [];
        this.visionRange = opts.visionRange ?? 160;
        this.loseSightRange = opts.visionRange ? opts.visionRange * 1.4 : 220;
        this.idleTimeMin = opts.idleTimeMin ?? 1.0;
        this.idleTimeMax = opts.idleTimeMax ?? 2.5;
        this._idleTimer = 0;
        this._chasing = false;
        this._lastWaypointIdx = -1;
        this.respawnDelay = opts.respawnDelay ?? 4.0;
        this._respawnCountdown = 0;
        this._repathTimer = 0;
    }

    /** Chọn ngẫu nhiên 1 waypoint khác điểm vừa đi, tìm path tới đó */
    _pickNextWaypoint(grid) {
        if (this.waypoints.length === 0) return;
        let idx;
        if (this.waypoints.length === 1) {
            idx = 0;
        } else {
            do {
                idx = Math.floor(Math.random() * this.waypoints.length);
            } while (idx === this._lastWaypointIdx);
        }
        this._lastWaypointIdx = idx;
        const wp = this.waypoints[idx];
        const rawPath = findPath(grid, { x: this.x, y: this.y }, wp);
        if (rawPath) {
            const path = smoothPath(grid, rawPath);
            this.setPath(path, false);
        } else {
            // Không tìm được đường tới waypoint này -> đứng yên 1 lúc rồi thử điểm khác
            this._idleTimer = 0.5;
        }
    }

    /**
     * Cập nhật AI tuần tra + phát hiện player.
     * @param {number} dt
     * @param {Grid} grid
     * @param {Character[]} potentialTargets  danh sách player có thể bị phát hiện
     */
    updateAI(dt, grid, potentialTargets) {
        if (this.isDead) {
            this._respawnCountdown -= dt;
            if (this._respawnCountdown <= 0) {
                this.respawn();
            }
            return;
        }
        if (this.isBusy) return; // đang attack/respawn

        // Tìm target gần nhất trong tầm nhìn
        let nearest = null;
        let nearestDist = Infinity;
        for (const t of potentialTargets) {
            if (t.isDead) continue;
            const d = this.distanceTo(t);
            if (d < nearestDist) {
                nearestDist = d;
                nearest = t;
            }
        }

        const seeRange = this._chasing ? this.loseSightRange : this.visionRange;
        if (nearest && nearestDist <= seeRange) {
            this._chasing = true;
            if (nearestDist <= this.attackRange) {
                this.performAttack(nearest);
            } else {
                // Đuổi theo: tìm path mới mỗi ~0.4s để bám theo player di chuyển
                this._repathTimer -= dt;
                if (this._repathTimer <= 0) {
                    const rawPath = findPath(grid, { x: this.x, y: this.y }, { x: nearest.x, y: nearest.y });
                    if (rawPath) {
                        this.setPath(smoothPath(grid, rawPath), true);
                    }
                    this._repathTimer = 0.4;
                }
            }
            return;
        }

        // Không thấy player -> quay lại hành vi tuần tra ngẫu nhiên
        if (this._chasing) {
            this._chasing = false;
            this.path = null;
            this._idleTimer = 0.3;
        }

        if (this.path && this.path.length > 0 && this.pathIndex < this.path.length) {
            return; // đang trên đường tới waypoint, để _followPath (gọi trong update gốc) xử lý
        }

        // Đang đứng nghỉ giữa 2 lượt tuần tra
        if (this._idleTimer > 0) {
            this._idleTimer -= dt;
            if (this.sm.currentName !== CharacterState.IDLE && !this.isBusy) {
                this.sm.transitionTo(CharacterState.IDLE);
            }
            return;
        }

        // Hết giờ nghỉ -> chọn waypoint kế tiếp
        this._pickNextWaypoint(grid);
        this._idleTimer = this.idleTimeMin + Math.random() * (this.idleTimeMax - this.idleTimeMin);
    }

    respawn() {
        super.respawn();
        this._chasing = false;
        this.path = null;
    }

    /** Gọi khi NPC chết để lên lịch hồi sinh sau respawnDelay giây */
    scheduleRespawn() { this._respawnCountdown = this.respawnDelay }
}
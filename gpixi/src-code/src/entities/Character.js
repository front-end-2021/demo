/**
 * Character.js
 * ---------------------------------------------------------------
 * Lớp cơ sở cho Player và NPC: chứa view (CharacterView), vị trí
 * world, vận tốc di chuyển, state machine (idle/walk/run/attack/
 * dead/respawn) và logic di chuyển theo một path (mảng điểm) được
 * pathfinding (A*) cung cấp.
 * ---------------------------------------------------------------
 */
import { CharacterState, StateMachine } from '../core/StateMachine.js';
import { CharacterView } from './CharacterView.js';

let _idCounter = 0;

export class Character {
    /**
     * @param {object} opts
     * @param {number} opts.x
     * @param {number} opts.y
     * @param {number} opts.walkSpeed px/s
     * @param {number} opts.runSpeed px/s
     * @param {number} opts.maxHp
     * @param {boolean} opts.isEnemy
     * @param {string} opts.label
     */
    constructor(opts = {}) {
        this.id = `char_${++_idCounter}`;
        this.x = opts.x ?? 0;
        this.y = opts.y ?? 0;
        this.spawnX = this.x;
        this.spawnY = this.y;
        this.walkSpeed = opts.walkSpeed ?? 90;
        this.runSpeed = opts.runSpeed ?? 190;
        this.maxHp = opts.maxHp ?? 100;
        this.hp = this.maxHp;
        this.isEnemy = !!opts.isEnemy;
        this.attackRange = opts.attackRange ?? 42;
        this.attackDamage = opts.attackDamage ?? 12;
        this.attackCooldown = opts.attackCooldown ?? 1.0;
        this._attackTimer = 0;

        this.path = null;       // mảng các điểm world {x,y} cần đi qua
        this.pathIndex = 0;
        this.currentSpeed = this.walkSpeed;
        this.shouldRun = false;
        this.onArrive = null;   // callback khi đến đích
        this.attackTarget = null;
        this._attackElapsed = 0;
        this._deadElapsed = 0;
        this._respawnElapsed = 0;
        this.collisionRadius = opts.collisionRadius ?? 16;

        this.view = new CharacterView({
            bodyColor: opts.bodyColor,
            accentColor: opts.accentColor,
            radius: opts.radius ?? 16,
            label: opts.label,
            isEnemy: this.isEnemy
        });
        this.view.x = this.x;
        this.view.y = this.y;

        this.sm = new StateMachine(this, this._buildStates(), CharacterState.IDLE);
    }

    _buildStates() {
        const self = this;
        return {
            [CharacterState.IDLE]: {
                canInterrupt: true,
                onEnter() { self.path = null; },
                onUpdate(owner, dt) { self.view.animate('idle', dt); }
            },
            [CharacterState.WALK]: {
                canInterrupt: true,
                onUpdate(owner, dt) {
                    self.view.animate('walk', dt);
                    self._followPath(dt, self.walkSpeed);
                }
            },
            [CharacterState.RUN]: {
                canInterrupt: true,
                onUpdate(owner, dt) {
                    self.view.animate('run', dt);
                    self._followPath(dt, self.runSpeed);
                }
            },
            [CharacterState.ATTACK]: {
                canInterrupt: false,
                onEnter() { self._attackElapsed = 0; },
                onUpdate(owner, dt) {
                    self._attackElapsed += dt;
                    self.view.animate('attack', dt, { attackElapsed: self._attackElapsed });
                    // Tại đúng giữa pha đánh, gây damage 1 lần
                    if (!self._didHit && self._attackElapsed >= 0.25) {
                        self._didHit = true;
                        if (self.onPerformHit) self.onPerformHit();
                    }
                    if (self._attackElapsed >= 0.5) {
                        self._didHit = false;
                        self.sm.forceTransitionTo(CharacterState.IDLE);
                    }
                },
                onExit() { self._didHit = false; }
            },
            [CharacterState.DEAD]: {
                canInterrupt: false,
                onEnter() {
                    self._deadElapsed = 0;
                    self.path = null;
                    self.view.setSelected(false);
                },
                onUpdate(owner, dt) {
                    self._deadElapsed += dt;
                    self.view.animate('dead', dt, { deadElapsed: self._deadElapsed });
                }
            },
            [CharacterState.RESPAWN]: {
                canInterrupt: false,
                onEnter() {
                    self._respawnElapsed = 0;
                    self.hp = self.maxHp;
                    self.x = self.spawnX;
                    self.y = self.spawnY;
                    self.view.x = self.x;
                    self.view.y = self.y;
                    self.view.resetPose();
                    self.view.alpha = 0;
                    self.view.setHpRatio(1);
                },
                onUpdate(owner, dt) {
                    self._respawnElapsed += dt;
                    self.view.animate('respawn', dt, { respawnElapsed: self._respawnElapsed });
                    if (self._respawnElapsed >= 0.7) {
                        self.view.resetPose();
                        self.sm.forceTransitionTo(CharacterState.IDLE);
                    }
                }
            }
        };
    }

    get isDead() { return this.sm.is(CharacterState.DEAD) }

    get isBusy() {
        return this.sm.is(CharacterState.ATTACK) || this.sm.is(CharacterState.DEAD) || this.sm.is(CharacterState.RESPAWN);
    }

    /** Gán đường đi mới (từ A*) và bắt đầu di chuyển. run=true để chạy. */
    setPath(path, run = false) {
        if (this.isBusy) return;
        if (!path || path.length === 0) return;
        this.path = path;
        this.pathIndex = 0;
        this.shouldRun = run;
        this.sm.transitionTo(run ? CharacterState.RUN : CharacterState.WALK);
    }

    stopMoving() {
        this.path = null;
        if (!this.isBusy) this.sm.transitionTo(CharacterState.IDLE);
    }

    _followPath(dt, speed) {
        if (!this.path || this.pathIndex >= this.path.length) {
            this.path = null;
            this.sm.transitionTo(CharacterState.IDLE);
            if (this.onArrive) {
                const cb = this.onArrive;
                this.onArrive = null;
                cb();
            }
            return;
        }
        const target = this.path[this.pathIndex];
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.hypot(dx, dy);
        const step = speed * dt;

        if (dist <= step || dist < 1.5) {
            this.x = target.x;
            this.y = target.y;
            this.pathIndex++;
            if (this.pathIndex >= this.path.length) {
                // Đã tới điểm cuối của path ngay trong frame này -> chuyển trạng thái
                // và gọi callback ngay, không đợi thêm 1 frame nữa.
                this.path = null;
                this.view.x = this.x;
                this.view.y = this.y;
                this.sm.transitionTo(CharacterState.IDLE);
                if (this.onArrive) {
                    const cb = this.onArrive;
                    this.onArrive = null;
                    cb();
                }
                return;
            }
        } else {
            const nx = dx / dist;
            const ny = dy / dist;
            this.x += nx * step;
            this.y += ny * step;
            this.view.setFacing(nx);
        }

        this.view.x = this.x;
        this.view.y = this.y;
    }

    /** Bắt đầu đòn tấn công nhắm vào target (Character khác) */
    performAttack(target) {
        if (this.isBusy) return false;
        if (this._attackTimer > 0) return false;
        this.path = null;
        this.attackTarget = target;
        const dx = target.x - this.x;
        if (Math.abs(dx) > 0.01) this.view.setFacing(dx);
        this.onPerformHit = () => {
            if (target && !target.isDead) {
                target.takeDamage(this.attackDamage);
            }
        };
        this._attackTimer = this.attackCooldown;
        this.sm.transitionTo(CharacterState.ATTACK);
        return true;
    }

    takeDamage(amount) {
        if (this.isDead) return;
        this.hp = Math.max(0, this.hp - amount);
        this.view.setHpRatio(this.hp / this.maxHp);
        if (this.hp <= 0) {
            this.sm.forceTransitionTo(CharacterState.DEAD);
        }
    }

    /** Gọi sau khoảng thời gian để hồi sinh tại điểm spawn ban đầu */
    respawn() { this.sm.forceTransitionTo(CharacterState.RESPAWN) }

    distanceTo(other) { return Math.hypot(other.x - this.x, other.y - this.y) }

    update(dt) {
        if (this._attackTimer > 0) this._attackTimer = Math.max(0, this._attackTimer - dt);
        this.sm.update(dt);

        // Sắp xếp z-order giả lập độ sâu: nhân vật ở y lớn hơn (gần camera) vẽ sau (trên)
        if (this.view.parent) {
            this.view.zIndex = this.y;
        }
    }
}
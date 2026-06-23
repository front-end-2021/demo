/**
 * GameWorld.js
 * ---------------------------------------------------------------
 * Điều phối toàn bộ thế giới game:
 *  - Vẽ mặt đất (ground) theo phong cách 2.5D (perspective nhẹ qua
 *    gradient + grid texture).
 *  - Đặt vật cản (đá, cây) và đánh dấu lên Grid pathfinding.
 *  - Tạo Player (do người chơi điều khiển bằng chuột).
 *  - Tạo GuardNPC tuần tra waypoints.
 *  - Tạo DraggableProp (nhà) có thể chọn + kéo-thả.
 *  - Xử lý toàn bộ input chuột:
 *      click chọn entity -> click ground để di chuyển / kéo để dời nhà
 *      click NPC địch rồi click player gần đó -> tấn công
 *  - Update loop: cập nhật state machine, AI, sắp xếp z-order theo y.
 * ---------------------------------------------------------------
 */
import { Container, Graphics, Text } from 'pixi.js';
import { Grid, findPath, smoothPath } from '../core/Grid.js';
import { Character } from '../entities/Character.js';
import { GuardNPC } from '../entities/GuardNPC.js';
import { Obstacle } from '../entities/Obstacle.js';
import { DraggableProp } from '../entities/DraggableProp.js';

const WORLD_W = 1400;
const WORLD_H = 900;
const CELL_SIZE = 28;

export class GameWorld {
    constructor(app) {
        this.app = app;
        this.root = new Container();
        this.root.sortableChildren = true;
        app.stage.addChild(this.root);

        this.grid = new Grid(WORLD_W, WORLD_H, CELL_SIZE);

        this.groundLayer = new Container();
        this.obstacleLayer = new Container();
        this.obstacleLayer.sortableChildren = true;
        this.propLayer = new Container();
        this.charLayer = new Container();
        this.charLayer.sortableChildren = true;
        this.fxLayer = new Container();

        this.root.addChild(
            this.groundLayer,
            this.obstacleLayer,
            this.propLayer,
            this.charLayer,
            this.fxLayer
        );

        this.obstacles = [];
        this.props = [];
        this.characters = []; // tất cả Character (player + npc)
        this.players = [];
        this.npcs = [];

        this.selected = null; // entity hiện đang được chọn (Character hoặc DraggableProp)
        this.draggingProp = null;
        this.dragPointerId = null;
        this._dragMoved = false;

        this._buildGround();
        this._buildObstacles();
        this._buildProps();
        this._buildPlayer();
        this._buildGuards();
        this._setupInput();

        this.statusEl = document.getElementById('status');
    }

    _setStatus(text) { if (this.statusEl) this.statusEl.textContent = text }

    // ---------------------------------------------------------------
    // GROUND
    // ---------------------------------------------------------------
    _buildGround() {
        const g = new Graphics();
        // Nền cỏ
        g.rect(0, 0, WORLD_W, WORLD_H);
        g.fill({ color: 0x3f6b3a });

        // Lưới ô nhẹ để tạo cảm giác chiều sâu / mặt đất 2.5D
        const step = CELL_SIZE * 2;
        for (let x = 0; x <= WORLD_W; x += step) {
            g.moveTo(x, 0).lineTo(x, WORLD_H);
        }
        for (let y = 0; y <= WORLD_H; y += step) {
            g.moveTo(0, y).lineTo(WORLD_W, y);
        }
        g.stroke({ color: 0x355c31, width: 1, alpha: 0.4 });

        // Vài đốm cỏ đậm/nhạt ngẫu nhiên để bớt đơn điệu
        for (let i = 0; i < 140; i++) {
            const x = Math.random() * WORLD_W;
            const y = Math.random() * WORLD_H;
            const r = 6 + Math.random() * 14;
            g.circle(x, y, r);
            g.fill({ color: Math.random() > 0.5 ? 0x466b3f : 0x375c33, alpha: 0.35 });
        }

        // viền bản đồ
        g.rect(0, 0, WORLD_W, WORLD_H);
        g.stroke({ color: 0x1f3a1c, width: 6 });

        this.groundLayer.addChild(g);

        // Vùng nền tương tác để bắt sự kiện click "đi tới đây"
        const hit = new Graphics();
        hit.rect(0, 0, WORLD_W, WORLD_H);
        hit.fill({ color: 0xffffff, alpha: 0.0001 });
        hit.eventMode = 'static';
        hit.cursor = 'default';
        this.groundHit = hit;
        this.groundLayer.addChild(hit);
    }

    // ---------------------------------------------------------------
    // OBSTACLES (đá, cây)
    // ---------------------------------------------------------------
    _buildObstacles() {
        const layout = [
            { type: 'rock', x: 420, y: 300, scale: 1.1 },
            { type: 'rock', x: 470, y: 340, scale: 0.9 },
            { type: 'rock', x: 520, y: 290, scale: 1.0 },
            { type: 'tree', x: 700, y: 220, scale: 1.0 },
            { type: 'tree', x: 750, y: 260, scale: 1.1 },
            { type: 'tree', x: 660, y: 300, scale: 0.95 },
            { type: 'tree', x: 800, y: 320, scale: 1.0 },
            { type: 'rock', x: 950, y: 480, scale: 1.2 },
            { type: 'rock', x: 1000, y: 520, scale: 1.0 },
            { type: 'tree', x: 300, y: 550, scale: 1.05 },
            { type: 'tree', x: 350, y: 600, scale: 0.9 },
            { type: 'tree', x: 250, y: 620, scale: 1.0 },
            { type: 'rock', x: 600, y: 650, scale: 1.0 },
            { type: 'rock', x: 650, y: 690, scale: 0.85 },
            { type: 'tree', x: 1100, y: 200, scale: 1.0 },
            { type: 'tree', x: 1150, y: 240, scale: 1.1 },
            { type: 'rock', x: 850, y: 700, scale: 1.0 },
            { type: 'tree', x: 480, y: 480, scale: 1.0 }
        ];

        for (const item of layout) {
            const obstacle = new Obstacle(item);
            this.obstacleLayer.addChild(obstacle);
            this.obstacles.push(obstacle);
            this.grid.markCircleObstacle(obstacle.x, obstacle.y, obstacle.collisionRadius);
        }
    }

    // ---------------------------------------------------------------
    // PROPS (nhà - kéo thả được)
    // ---------------------------------------------------------------
    _buildProps() {
        const house = new DraggableProp({ x: 1080, y: 650 });
        this.propLayer.addChild(house);
        this.props.push(house);
        this.grid.markCircleObstacle(house.x, house.y, house.collisionRadius);

        house.on('pointerdown', (e) => this._onPropPointerDown(e, house));
    }

    // ---------------------------------------------------------------
    // PLAYER
    // ---------------------------------------------------------------
    _buildPlayer() {
        const player = new Character({
            x: 200,
            y: 200,
            bodyColor: 0x3f8ce0,
            accentColor: 0xffe28a,
            label: 'Anh hùng',
            walkSpeed: 95,
            runSpeed: 200,
            maxHp: 100,
            attackDamage: 18,
            attackRange: 46
        });
        this.charLayer.addChild(player.view);
        player.view.eventMode = 'static';
        player.view.cursor = 'pointer';
        player.view.on('pointerdown', (e) => this._onCharacterPointerDown(e, player));
        this.characters.push(player);
        this.players.push(player);
        this.player = player;
    }

    // ---------------------------------------------------------------
    // NPC GUARDS
    // ---------------------------------------------------------------
    _buildGuards() {
        const guardConfigs = [
            {
                x: 880, y: 420,
                waypoints: [
                    { x: 880, y: 420 }, { x: 1020, y: 420 },
                    { x: 1020, y: 560 }, { x: 880, y: 560 }
                ],
                label: 'Lính canh A',
                visionRange: 170
            },
            {
                x: 350, y: 750,
                waypoints: [
                    { x: 350, y: 750 }, { x: 550, y: 780 },
                    { x: 550, y: 850 }, { x: 200, y: 830 }
                ],
                label: 'Lính canh B',
                visionRange: 150
            }
        ];

        for (const cfg of guardConfigs) {
            const guard = new GuardNPC({
                x: cfg.x,
                y: cfg.y,
                waypoints: cfg.waypoints,
                label: cfg.label,
                visionRange: cfg.visionRange,
                walkSpeed: 70,
                runSpeed: 160,
                maxHp: 80,
                attackDamage: 10
            });
            this.charLayer.addChild(guard.view);
            guard.view.eventMode = 'static';
            guard.view.cursor = 'pointer';
            guard.view.on('pointerdown', (e) => this._onCharacterPointerDown(e, guard));
            this.characters.push(guard);
            this.npcs.push(guard);
        }
    }

    // ---------------------------------------------------------------
    // INPUT HANDLING
    // ---------------------------------------------------------------
    _setupInput() {
        this.groundHit.on('pointerdown', (e) => this._onGroundPointerDown(e));

        this.app.stage.eventMode = 'static';
        this.app.stage.hitArea = this.app.screen;
        this.app.stage.on('pointermove', (e) => this._onStagePointerMove(e));
        this.app.stage.on('pointerup', () => this._onStagePointerUp());
        this.app.stage.on('pointerupoutside', () => this._onStagePointerUp());
    }

    _clearSelection() {
        if (this.selected instanceof Character) {
            this.selected.view.setSelected(false);
        } else if (this.selected instanceof DraggableProp) {
            this.selected.setSelected(false);
        }
        this.selected = null;
    }

    _selectEntity(entity) {
        this._clearSelection();
        this.selected = entity;
        if (entity instanceof Character) {
            entity.view.setSelected(true);
            const who = entity.isEnemy ? 'lính canh' : 'nhân vật';
            this._setStatus(`Đã chọn ${who}. Click vào đất để di chuyển, hoặc click mục tiêu để tấn công.`);
        } else if (entity instanceof DraggableProp) {
            entity.setSelected(true);
            this._setStatus('Đã chọn nhà. Giữ chuột và kéo để di chuyển nhà tới vị trí mới.');
        }
    }

    _onCharacterPointerDown(e, character) {
        e.stopPropagation();

        // Nếu đang có 1 Character được chọn (player) và click vào 1 NPC địch khác -> tấn công
        if (this.selected instanceof Character && this.selected !== character &&
            !this.selected.isEnemy && character.isEnemy) {
            this._tryAttack(this.selected, character);
            return;
        }
        // Nếu đang chọn 1 NPC địch và click vào player gần đó -> tấn công (cho phép test cả 2 chiều)
        if (this.selected instanceof Character && this.selected !== character &&
            this.selected.isEnemy && !character.isEnemy) {
            this._tryAttack(this.selected, character);
            return;
        }

        this._selectEntity(character);
    }

    _tryAttack(attacker, target) {
        if (attacker.isDead || target.isDead) return;
        const dist = attacker.distanceTo(target);
        if (dist <= attacker.attackRange + 6) {
            attacker.performAttack(target);
            this._setStatus('Tấn công!');
        } else {
            // Di chuyển lại gần rồi mới đánh: chạy tới gần target, sau đó tự attack khi đến
            const rawPath = findPath(this.grid, { x: attacker.x, y: attacker.y }, { x: target.x, y: target.y });
            if (rawPath) {
                const path = smoothPath(this.grid, rawPath);
                attacker.setPath(path, true);
                attacker.onArrive = () => {
                    if (!target.isDead && attacker.distanceTo(target) <= attacker.attackRange + 30) {
                        attacker.performAttack(target);
                    }
                };
                this._setStatus('Đang tiếp cận mục tiêu để tấn công...');
            } else {
                this._setStatus('Không thể tiếp cận mục tiêu (bị vật cản chặn hoàn toàn).');
            }
        }
    }

    _onPropPointerDown(e, prop) {
        e.stopPropagation();
        if (this.selected === prop) {
            // Đã chọn rồi -> bắt đầu kéo
            this._startDragProp(e, prop);
            return;
        }
        this._selectEntity(prop);
    }

    _startDragProp(e, prop) {
        this.draggingProp = prop;
        this.dragPointerId = e.pointerId;
        this._dragMoved = false;
        prop.setGhostMode(true);
        // Xoá obstacle cũ khỏi grid trong lúc kéo (để pathfinding không bị chặn bởi vị trí cũ)
        this.grid.clearCircleObstacle(prop.x, prop.y, prop.collisionRadius);
    }

    _onGroundPointerDown(e) {
        const pos = e.getLocalPosition(this.groundLayer);

        if (this.selected instanceof DraggableProp) {
            // Click ra ngoài nhà trong khi đã chọn nhà: bắt đầu kéo nếu giữ chuột,
            // nhưng nếu chỉ là click thường (không kéo) thì bỏ chọn.
            this._startDragProp(e, this.selected);
            return;
        }

        if (this.selected instanceof Character) {
            if (this.selected.isBusy) {
                this._setStatus(this.selected.isDead ? 'Nhân vật đã gục, đợi hồi sinh.' : 'Nhân vật đang bận, vui lòng đợi.');
                return;
            }
            const shouldRun = e.shiftKey || (e.originalEvent && e.originalEvent.shiftKey);
            const rawPath = findPath(this.grid, { x: this.selected.x, y: this.selected.y }, pos);
            if (rawPath) {
                const path = smoothPath(this.grid, rawPath);
                this.selected.setPath(path, !!shouldRun);
                this.selected.onArrive = null;
                this._setStatus(shouldRun ? 'Đang chạy tới điểm đích...' : 'Đang đi tới điểm đích...');
            } else {
                this._setStatus('Không tìm được đường tới đó — bị vật cản chặn hoàn toàn. Nhân vật giữ nguyên vị trí.');
            }
            return;
        }

        this._setStatus('Hãy click chọn nhân vật hoặc nhà trước.');
    }

    _onStagePointerMove(e) {
        if (!this.draggingProp) return;
        if (this.dragPointerId !== null && e.pointerId !== this.dragPointerId) return;
        this._dragMoved = true;
        const pos = e.getLocalPosition(this.groundLayer);
        const clampedX = Math.max(40, Math.min(WORLD_W - 40, pos.x));
        const clampedY = Math.max(40, Math.min(WORLD_H - 40, pos.y));
        this.draggingProp.x = clampedX;
        this.draggingProp.y = clampedY;
        this.draggingProp.zIndex = clampedY;
    }

    _onStagePointerUp() {
        if (!this.draggingProp) return;
        const prop = this.draggingProp;
        prop.setGhostMode(false);
        // Đánh dấu lại obstacle ở vị trí mới
        this.grid.markCircleObstacle(prop.x, prop.y, prop.collisionRadius);
        this.draggingProp = null;
        this.dragPointerId = null;
        if (this._dragMoved) {
            this._setStatus('Đã di chuyển nhà tới vị trí mới.');
        } else {
            // Chỉ click (không kéo) ra ngoài nhà -> coi như bỏ chọn để chọn đối tượng khác
            this._clearSelection();
            this._setStatus('Đã bỏ chọn nhà. Hãy click chọn nhân vật hoặc nhà.');
        }
    }

    // ---------------------------------------------------------------
    // UPDATE LOOP
    // ---------------------------------------------------------------
    update(dt) {
        for (const npc of this.npcs) {
            const wasDead = npc.isDead;
            npc.updateAI(dt, this.grid, this.players);
            npc.update(dt);
            if (!wasDead && npc.isDead) {
                npc.scheduleRespawn();
                this._setStatus('Lính canh đã bị hạ! Sẽ hồi sinh sau vài giây...');
            }
        }
        for (const player of this.players) {
            const wasDead = player.isDead;
            player.update(dt);
            if (!wasDead && player.isDead) {
                this._setStatus('Nhân vật của bạn đã gục ngã! Đang hồi sinh...');
                setTimeout(() => {
                    if (player.isDead) player.respawn();
                }, 2000);
            }
        }

        // Sắp xếp z-order theo y để tạo cảm giác chiều sâu (2.5D depth sorting)
        for (const obstacle of this.obstacles) {
            obstacle.zIndex = obstacle.y;
        }
        for (const prop of this.props) {
            if (prop !== this.draggingProp) prop.zIndex = prop.y;
        }
        this.obstacleLayer.sortChildren();
        this.charLayer.sortChildren();
    }
}
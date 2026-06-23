/**
 * StateMachine.js
 * ---------------------------------------------------------------
 * Một state machine nhỏ, tái sử dụng được cho Player/NPC.
 * Mỗi state có 3 hook: onEnter, onUpdate(dt), onExit.
 * ---------------------------------------------------------------
 */

export const CharacterState = Object.freeze({
  IDLE: 1, //'idle',
  WALK: 2, //'walk',
  RUN: 3, //'run',
  ATTACK: 4, //'attack',
  DEAD: 5,  //'dead',
  RESPAWN: 6, //'respawn'
});

export class StateMachine {
  /**
   * @param {object} owner - entity sở hữu state machine (Player/NPC)
   * @param {object} states - map { stateName: { onEnter, onUpdate, onExit, canInterrupt } }
   * @param {string} initial - state khởi đầu
   */
  constructor(owner, states, initial) {
    this.owner = owner;
    this.states = states;
    this.current = null;
    this.currentName = null;
    this.transitionTo(initial);
  }

  /**
   * Chuyển trạng thái. State ATTACK/DEAD/RESPAWN có thể đặt canInterrupt=false để chặn các lệnh chuyển trạng thái khác
   * cho tới khi state đó tự kết thúc (gọi this.transitionTo từ bên trong).
   */
  transitionTo(name, payload) {
    if (this.currentName === name) return;
    if (this.current && this.current.canInterrupt === false) {
      return; // đang trong state không cho phép gián đoạn (ví dụ đang attack/dead)
    }
    if (this.current && this.current.onExit) {
      this.current.onExit(this.owner);
    }
    const next = this.states[name];
    if (!next) {
      console.warn(`[StateMachine] Unknown state: ${name}`);
      return;
    }
    this.currentName = name;
    this.current = next;
    if (this.current.onEnter) {
      this.current.onEnter(this.owner, payload);
    }
  }

  /** Cho phép force chuyển trạng thái bất kể canInterrupt (dùng khi chết) */
  forceTransitionTo(name, payload) {
    if (this.current && this.current.onExit) {
      this.current.onExit(this.owner);
    }
    const next = this.states[name];
    this.currentName = name;
    this.current = next;
    if (this.current.onEnter) {
      this.current.onEnter(this.owner, payload);
    }
  }

  update(dt) {
    if (this.current && this.current.onUpdate) {
      this.current.onUpdate(this.owner, dt);
    }
  }

  is(name) { return this.currentName === name }
}
import { inject } from 'vue'

/**
 * v-in-view — directive theo dõi phần tử có đang nằm trong viewport hay không
 * (ý tưởng giống vue-observe-visibility, dựa trên IntersectionObserver).
 *
 *   <div v-in-view="{ callback: inViewport, throttle: TmThrotte, intersection: OjIntersec }" />
 *
 *   callback     (isVisible: boolean, entry: IntersectionObserverEntry) => void
 *   throttle     số ms tối thiểu giữa 2 lần gọi callback (0 / bỏ trống = không giới hạn)
 *   intersection { root, rootMargin, threshold } — đúng như tham số của IntersectionObserver
 *
 * Mọi phần tử đang được theo dõi được lưu trong MỘT Map duy nhất ở root của app
 * (tạo trong main.js, truy cập bằng `inject(IN_VIEW_KEY)` hoặc `this.$inView`):
 *   Map<Element, { callback, throttle, options, observer, visible, ... }>
 * Nhờ vậy có thể xem / dọn dẹp / debug toàn bộ phần tử đang theo dõi từ một chỗ.
 */

export const IN_VIEW_KEY = Symbol('in-view-registry')
export const useInViewRegistry = () => inject(IN_VIEW_KEY)

// ---------- Chuẩn hoá giá trị binding ----------

function normalize(value) {
  // cho phép viết tắt: v-in-view="fn"
  const v = typeof value === 'function' ? { callback: value } : value || {}
  const i = v.intersection || {}
  return {
    callback: typeof v.callback === 'function' ? v.callback : null,
    throttle: Math.max(0, Number(v.throttle) || 0),
    options: {
      root: i.root ?? null,
      rootMargin: i.rootMargin ?? '0px',
      threshold: i.threshold ?? 0,
    },
  }
}

const sameOptions = (a, b) =>
  a.root === b.root &&
  a.rootMargin === b.rootMargin &&
  JSON.stringify(a.threshold) === JSON.stringify(b.threshold)

// Với threshold dạng mảng thì lấy ngưỡng nhỏ nhất làm mốc "đang thấy"
const minThreshold = (t) => (Array.isArray(t) ? Math.min(...t, 1) : t)

// ---------- Throttle (leading + trailing) ----------
// Lần gọi đầu chạy ngay; các thay đổi tới trong khoảng `throttle` ms sau đó được dồn lại
// và chỉ lần cuối cùng được gọi khi hết khoảng chờ → cuộn nhanh không bị gọi dồn dập,
// nhưng trạng thái cuối cùng luôn được báo.

function flush(state) {
  clearTimeout(state.timer)
  state.timer = null
  const entry = state.pending
  state.pending = null
  if (!entry || state.dead) return

  state.lastCall = performance.now()
  const visible = entry.isIntersecting && entry.intersectionRatio >= minThreshold(state.options.threshold)
  if (visible === state.visible) return // vào rồi ra trong lúc chờ → không có gì thay đổi
  state.visible = visible
  state.callback?.(visible, entry)
}

function schedule(state, entry) {
  state.pending = entry
  const elapsed = performance.now() - state.lastCall
  if (elapsed >= state.throttle) flush(state)
  else if (state.timer == null) state.timer = setTimeout(() => flush(state), state.throttle - elapsed)
}

// ---------- Observer ----------

function observe(state, el) {
  const { root, rootMargin, threshold } = state.options
  state.observer = new IntersectionObserver(
    (entries) => schedule(state, entries[entries.length - 1]), // entry mới nhất mới đáng quan tâm
    { root, rootMargin, threshold },
  )
  state.observer.observe(el)
}

function release(state) {
  state.observer?.disconnect()
  state.observer = null
  clearTimeout(state.timer)
  state.timer = null
  state.pending = null
}

// ---------- Directive ----------

export function createInViewDirective(registry) {
  return {
    mounted(el, binding) {
      const { callback, throttle, options } = normalize(binding.value)
      if (!callback && import.meta.env?.DEV) console.warn('[v-in-view] thiếu `callback`', el)

      const state = {
        callback,
        throttle,
        options,
        observer: null,
        timer: null,
        pending: null,
        lastCall: -Infinity,
        visible: undefined, // trạng thái gần nhất đã báo cho callback
        dead: false,
      }
      registry.set(el, state)
      observe(state, el)
    },

    // Chạy mỗi khi component render lại: callback/throttle cập nhật ngay,
    // observer chỉ được tạo lại khi intersection thật sự đổi (vd. root vừa có giá trị).
    updated(el, binding) {
      const state = registry.get(el)
      if (!state) return
      const next = normalize(binding.value)
      state.callback = next.callback
      state.throttle = next.throttle
      if (!sameOptions(state.options, next.options)) {
        release(state)
        state.options = next.options
        observe(state, el)
      }
    },

    unmounted(el) {
      const state = registry.get(el)
      if (!state) return
      state.dead = true
      release(state)
      registry.delete(el)
    },
  }
}

// ---------- Plugin ----------
// app.use(inViewPlugin, registry) — registry là Map do root app tạo và sở hữu.

export const inViewPlugin = {
  install(app, registry = new Map()) {
    app.provide(IN_VIEW_KEY, registry)
    app.config.globalProperties.$inView = registry
    app.directive('in-view', createInViewDirective(registry))
  },
}

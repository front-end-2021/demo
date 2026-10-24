/**
 * Chương trình WebGL vẽ node theo hình dạng: tròn, vuông, tam giác, kim cương, elip, ngũ giác, lục giác.
 *
 * Cách làm giống NodeCircleProgram của Sigma: mỗi node là 1 tam giác đều bao ngoài,
 * fragment shader dùng hàm khoảng cách có dấu (SDF) để quyết định điểm ảnh nào thuộc hình.
 * Shader dùng chung cho cả chế độ "picking" (xác định node được bấm) nên vùng bấm khớp đúng hình dạng.
 *
 * Dùng: node có thuộc tính `type` = một khoá của SHAPES ('circle', 'square', 'diamond', 'hexagon'…).
 */
import { NodeProgram, drawDiscNodeLabel } from 'sigma/rendering'
import { floatColor } from 'sigma/utils'

export const SHAPES = {
  circle: 'Tròn',
  square: 'Vuông',
  triangle: 'Tam giác',
  diamond: 'Kim cương',
  ellipse: 'Elip',
  pentagon: 'Ngũ giác',
  hexagon: 'Lục giác',
}

// Kích thước mỗi hình được chọn để diện tích gần bằng hình tròn bán kính R → các hình trông "to như nhau".
// (Mọi hình phải nằm gọn trong bán kính 2R — vòng tròn nội tiếp của tam giác bao ngoài trong vertex shader.)
const SQUARE_HALF = 0.886 // nửa cạnh hình vuông / R
const TRIANGLE_HALF = 1.35 // nửa cạnh tam giác đều / R
const DIAMOND_HALF = [1.05, 1.5] // nửa đường chéo ngang, dọc / R  (2·1,05·1,5 ≈ π)
const ELLIPSE_RADII = [1.4, 0.72] // bán trục ngang, dọc / R      (1,4·0,72 ≈ 1)
const PENTAGON_APOTHEM = 0.93 // khoảng cách tâm → cạnh / R
const HEXAGON_APOTHEM = 0.952
const f = (x) => x.toFixed(3)

// Hàm SDF (âm = bên trong hình, đơn vị cùng với v_radius). Trục y hướng LÊN.
// Công thức theo Inigo Quilez (iquilezles.org/articles/distfunctions2d).
const SDF = {
  circle: 'return length(p) - r;',
  square: `vec2 d = abs(p) - vec2(r * ${f(SQUARE_HALF)});
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);`,
  // Tam giác đều đỉnh hướng lên, trọng tâm tại gốc
  triangle: `const float k = 1.7320508;
    float h = r * ${f(TRIANGLE_HALF)};
    p.x = abs(p.x) - h;
    p.y = p.y + h / k;
    if (p.x + k * p.y > 0.0) p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
    p.x -= clamp(p.x, -2.0 * h, 0.0);
    return -length(p) * sign(p.y);`,
  // Hình thoi, đỉnh trên / dưới / trái / phải
  diamond: `vec2 b = vec2(r * ${f(DIAMOND_HALF[0])}, r * ${f(DIAMOND_HALF[1])});
    p = abs(p);
    float h = clamp(((b.x - 2.0 * p.x) * b.x - (b.y - 2.0 * p.y) * b.y) / dot(b, b), -1.0, 1.0);
    float d = length(p - 0.5 * b * vec2(1.0 - h, 1.0 + h));
    return d * sign(p.x * b.y + p.y * b.x - b.x * b.y);`,
  // Elip nằm ngang (SDF xấp xỉ — đủ chính xác ở gần mép, nơi quyết định hình dạng)
  ellipse: `vec2 ab = vec2(r * ${f(ELLIPSE_RADII[0])}, r * ${f(ELLIPSE_RADII[1])});
    float k1 = length(p / (ab * ab));
    if (k1 < 1e-6) return -min(ab.x, ab.y);
    float k0 = length(p / ab);
    return k0 * (k0 - 1.0) / k1;`,
  // Ngũ giác đều, đỉnh hướng lên
  pentagon: `const vec3 k = vec3(0.809016994, 0.587785252, 0.726542528);
    float a = r * ${f(PENTAGON_APOTHEM)};
    p.y = -p.y;
    p.x = abs(p.x);
    p -= 2.0 * min(dot(vec2(-k.x, k.y), p), 0.0) * vec2(-k.x, k.y);
    p -= 2.0 * min(dot(vec2(k.x, k.y), p), 0.0) * vec2(k.x, k.y);
    p -= vec2(clamp(p.x, -a * k.z, a * k.z), a);
    return length(p) * sign(p.y);`,
  // Lục giác đều, cạnh trên / dưới nằm ngang
  hexagon: `const vec3 k = vec3(-0.866025404, 0.5, 0.577350269);
    float a = r * ${f(HEXAGON_APOTHEM)};
    p = abs(p);
    p -= 2.0 * min(dot(k.xy, p), 0.0) * k.xy;
    p -= vec2(clamp(p.x, -k.z * a, k.z * a), a);
    return length(p) * sign(p.y);`,
}

// Hình học cùng các hình trên, cho canvas 2D / SVG (bán kính 1, trục y hướng XUỐNG).
// Dùng chung cho viền hover và icon chú thích → luôn khớp với hình WebGL.
const regular = (n, apothem, startDeg) => {
  const R = apothem / Math.cos(Math.PI / n)
  return Array.from({ length: n }, (_, i) => {
    const t = ((startDeg + (360 / n) * i) * Math.PI) / 180
    return [R * Math.cos(t), R * Math.sin(t)]
  })
}
const GEOMETRY = {
  circle: { ellipse: [1, 1] },
  ellipse: { ellipse: ELLIPSE_RADII },
  square: { points: [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([x, y]) => [x * SQUARE_HALF, y * SQUARE_HALF]) },
  triangle: {
    points: [[0, -(2 * TRIANGLE_HALF) / Math.sqrt(3)], [TRIANGLE_HALF, TRIANGLE_HALF / Math.sqrt(3)], [-TRIANGLE_HALF, TRIANGLE_HALF / Math.sqrt(3)]],
  },
  diamond: { points: [[0, -DIAMOND_HALF[1]], [DIAMOND_HALF[0], 0], [0, DIAMOND_HALF[1]], [-DIAMOND_HALF[0], 0]] },
  pentagon: { points: regular(5, PENTAGON_APOTHEM, -90) },
  hexagon: { points: regular(6, HEXAGON_APOTHEM, 0) },
}

const VERTEX_SHADER = /* glsl */ `
attribute vec4 a_id;
attribute vec4 a_color;
attribute vec2 a_position;
attribute float a_size;
attribute float a_angle;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;

varying vec4 v_color;
varying vec2 v_diffVector;
varying float v_radius;

const float bias = 255.0 / 254.0;

void main() {
  // Tam giác bao ngoài lớn gấp đôi của Sigma (hệ số 8 thay vì 4) để chứa trọn hình vuông / tam giác
  float size = a_size * u_correctionRatio / u_sizeRatio * 8.0;
  vec2 diffVector = size * vec2(cos(a_angle), sin(a_angle));
  vec2 position = a_position + diffVector;
  gl_Position = vec4((u_matrix * vec3(position, 1)).xy, 0, 1);

  v_diffVector = diffVector;
  v_radius = size / 4.0;

  #ifdef PICKING_MODE
  v_color = a_id;
  #else
  v_color = a_color;
  #endif
  v_color.a *= bias;
}
`

const fragmentShader = (shape) => /* glsl */ `
precision highp float;

varying vec4 v_color;
varying vec2 v_diffVector;
varying float v_radius;

uniform float u_correctionRatio;

const vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);

float sdf(vec2 p, float r) {
  ${SDF[shape]}
}

void main(void) {
  float border = u_correctionRatio * 2.0;
  float dist = sdf(v_diffVector, v_radius) + border;

  #ifdef PICKING_MODE
  gl_FragColor = dist > border ? transparent : v_color;
  #else
  // khử răng cưa ở mép
  float t = dist > border ? 1.0 : dist > 0.0 ? dist / border : 0.0;
  gl_FragColor = mix(v_color, transparent, t);
  #endif
}
`

const { UNSIGNED_BYTE, FLOAT } = WebGLRenderingContext
const ANGLES = [[0], [(2 * Math.PI) / 3], [(4 * Math.PI) / 3]]

function createShapeProgram(shape) {
  const FRAGMENT_SHADER = fragmentShader(shape)
  return class NodeShapeProgram extends NodeProgram {
    getDefinition() {
      return {
        VERTICES: 3,
        VERTEX_SHADER_SOURCE: VERTEX_SHADER,
        FRAGMENT_SHADER_SOURCE: FRAGMENT_SHADER,
        METHOD: WebGLRenderingContext.TRIANGLES,
        UNIFORMS: ['u_sizeRatio', 'u_correctionRatio', 'u_matrix'],
        ATTRIBUTES: [
          { name: 'a_position', size: 2, type: FLOAT },
          { name: 'a_size', size: 1, type: FLOAT },
          { name: 'a_color', size: 4, type: UNSIGNED_BYTE, normalized: true },
          { name: 'a_id', size: 4, type: UNSIGNED_BYTE, normalized: true },
        ],
        CONSTANT_ATTRIBUTES: [{ name: 'a_angle', size: 1, type: FLOAT }],
        CONSTANT_DATA: ANGLES,
      }
    }

    processVisibleItem(nodeIndex, startIndex, data) {
      const array = this.array
      array[startIndex++] = data.x
      array[startIndex++] = data.y
      array[startIndex++] = data.size
      array[startIndex++] = floatColor(data.color)
      array[startIndex++] = nodeIndex
    }

    setUniforms(params, { gl, uniformLocations }) {
      gl.uniform1f(uniformLocations.u_correctionRatio, params.correctionRatio)
      gl.uniform1f(uniformLocations.u_sizeRatio, params.sizeRatio)
      gl.uniformMatrix3fv(uniformLocations.u_matrix, false, params.matrix)
    }
  }
}

/** Truyền vào setting `nodeProgramClasses` của Sigma. */
export const nodeProgramClasses = Object.fromEntries(Object.keys(SHAPES).map((s) => [s, createShapeProgram(s)]))

/** Vẽ đường viền theo hình dạng lên canvas 2D (dùng cho viền hover / node đang chọn). */
export function traceShape(ctx, shape, x, y, r) {
  const g = GEOMETRY[shape] ?? GEOMETRY.circle
  ctx.beginPath()
  if (g.ellipse) {
    ctx.ellipse(x, y, g.ellipse[0] * r, g.ellipse[1] * r, 0, 0, Math.PI * 2)
  } else {
    g.points.forEach(([px, py], i) => (i ? ctx.lineTo : ctx.moveTo).call(ctx, x + px * r, y + py * r))
  }
  ctx.closePath()
}

/**
 * Icon SVG cho bảng chú thích: { tag: 'ellipse' | 'polygon', attrs } vừa khít ô size×size (cách mép `pad`).
 * Dùng trong template: <component :is="icon.tag" v-bind="icon.attrs" :fill="color" /> bên trong <svg>.
 */
export function shapeIcon(shape, size = 12, pad = 0.8) {
  const g = GEOMETRY[shape] ?? GEOMETRY.circle
  const pts = g.ellipse
    ? [[-g.ellipse[0], -g.ellipse[1]], [g.ellipse[0], g.ellipse[1]]]
    : g.points
  const xs = pts.map((p) => p[0])
  const ys = pts.map((p) => p[1])
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
  const k = (size - 2 * pad) / Math.max(maxX - minX, maxY - minY)
  const ox = size / 2 - ((minX + maxX) / 2) * k
  const oy = size / 2 - ((minY + maxY) / 2) * k
  if (g.ellipse) {
    return { tag: 'ellipse', attrs: { cx: ox, cy: oy, rx: g.ellipse[0] * k, ry: g.ellipse[1] * k } }
  }
  return { tag: 'polygon', attrs: { points: g.points.map(([x, y]) => `${(ox + x * k).toFixed(2)},${(oy + y * k).toFixed(2)}`).join(' ') } }
}

/** Thay cho hover mặc định (luôn vẽ hình tròn): nền trắng có bóng theo đúng hình dạng node + nhãn. */
export function drawNodeHover(ctx, data, settings) {
  const pad = 3
  ctx.fillStyle = '#ffffff'
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  ctx.shadowBlur = 8
  ctx.shadowColor = 'rgba(15, 23, 42, 0.35)'
  traceShape(ctx, data.type, data.x, data.y, data.size + pad)
  ctx.fill()

  if (typeof data.label === 'string' && data.label) {
    const size = settings.labelSize
    ctx.font = `${settings.labelWeight} ${size}px ${settings.labelFont}`
    const w = ctx.measureText(data.label).width
    const x = data.x + data.size + 3
    ctx.beginPath()
    ctx.roundRect?.(x - 2, data.y - size / 2 - 4, w + 10, size + 8, 4) ?? ctx.rect(x - 2, data.y - size / 2 - 4, w + 10, size + 8)
    ctx.fill()
  }
  ctx.shadowBlur = 0
  drawDiscNodeLabel(ctx, data, settings)
}

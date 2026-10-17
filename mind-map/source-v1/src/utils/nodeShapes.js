/**
 * Chương trình WebGL vẽ node theo hình dạng: tròn, vuông, tam giác.
 *
 * Cách làm giống NodeCircleProgram của Sigma: mỗi node là 1 tam giác đều bao ngoài,
 * fragment shader dùng hàm khoảng cách có dấu (SDF) để quyết định điểm ảnh nào thuộc hình.
 * Shader dùng chung cho cả chế độ "picking" (xác định node được bấm) nên vùng bấm khớp đúng hình dạng.
 *
 * Dùng: node có thuộc tính `type` = 'circle' | 'square' | 'triangle'.
 */
import { NodeProgram, drawDiscNodeLabel } from 'sigma/rendering'
import { floatColor } from 'sigma/utils'

export const SHAPES = {
  circle: 'Tròn',
  square: 'Vuông',
  triangle: 'Tam giác',
}

// Kích thước mỗi hình được chọn để diện tích gần bằng hình tròn bán kính R → các hình trông "to như nhau".
const SQUARE_HALF = 0.886 // nửa cạnh hình vuông / R
const TRIANGLE_HALF = 1.35 // nửa cạnh tam giác đều / R

// Hàm SDF (âm = bên trong hình, đơn vị cùng với v_radius)
const SDF = {
  circle: 'return length(p) - r;',
  square: `vec2 d = abs(p) - vec2(r * ${SQUARE_HALF.toFixed(3)});
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);`,
  // Tam giác đều đỉnh hướng lên, trọng tâm tại gốc (theo SDF của Inigo Quilez)
  triangle: `const float k = 1.7320508;
    float h = r * ${TRIANGLE_HALF.toFixed(3)};
    p.x = abs(p.x) - h;
    p.y = p.y + h / k;
    if (p.x + k * p.y > 0.0) p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
    p.x -= clamp(p.x, -2.0 * h, 0.0);
    return -length(p) * sign(p.y);`,
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

/** Vẽ đường viền theo hình dạng lên canvas 2D (dùng cho viền hover / node đang chọn và icon chú thích). */
export function traceShape(ctx, shape, x, y, r) {
  ctx.beginPath()
  if (shape === 'square') {
    const h = r * SQUARE_HALF
    ctx.rect(x - h, y - h, h * 2, h * 2)
  } else if (shape === 'triangle') {
    const h = r * TRIANGLE_HALF
    const k = Math.sqrt(3)
    ctx.moveTo(x, y - (2 * h) / k) // đỉnh trên (trục y của canvas hướng xuống)
    ctx.lineTo(x + h, y + h / k)
    ctx.lineTo(x - h, y + h / k)
  } else {
    ctx.arc(x, y, r, 0, Math.PI * 2)
  }
  ctx.closePath()
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

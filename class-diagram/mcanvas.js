export function drawAssociation(p0, p1, color) {
    const ctx = this
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.setLineDash([]);
    let [x0, y0, x1, y1] = computeXY(p0, p1)
    fillCirle(ctx, x0, y0, 1, color)
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}
export function drawImplement(p0, p1, width, color) {
    const ctx = this
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.setLineDash([9]);
    let [x0, y0, x1, y1] = computeXY(p0, p1)
    fillCirle(ctx, x0, y0, 1, color)

    let [a, b] = linearCoeffict([x0, y0], [x1, y1]);    // phuong trinh duong thang (p0, p1)
    let [xx0, yy0] = getOpPoint([x0, y0], [x1, y1], a, b, width * 2)

    ctx.moveTo(x0, y0);
    ctx.lineTo(xx0, yy0);
    ctx.stroke();

    ctx.beginPath();
    ctx.setLineDash([]);
    let [xx1, yy1, xx2, yy2] = poitsArg90([xx0, yy0], [a, b], width)

    ctx.moveTo(xx0, yy0);
    ctx.lineTo(x1, y1);
    ctx.moveTo(x1, y1);
    ctx.lineTo(xx1, yy1);
    ctx.moveTo(x1, y1);
    ctx.lineTo(xx2, yy2);

    ctx.stroke();
}
export function drawComposition(p0, p1, width, height, color, lsTxt) {
    const ctx = this
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.setLineDash([]);
    let [x0, y0, x1, y1] = computeXY(p0, p1)
    fillCirle(ctx, x0, y0, 1, color)

    let [a, b] = linearCoeffict([x0, y0], [x1, y1]);    // phuong trinh duong thang (p0, p1)
    let [xhf, yhf] = getOpPoint([x0, y0], [x1, y1], a, b, Math.round(height / 2))
    let [xx1, yy1, xx2, yy2] = poitsArg90([xhf, yhf], [a, b], width)

    let [xx0, yy0] = getOpPoint([x0, y0], [x1, y1], a, b, height)
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.moveTo(xx0, yy0);
    ctx.stroke();

    ctx.beginPath();
    ctx.setLineDash([]);
    // Create path
    let region = new Path2D();
    region.moveTo(xx0, yy0);
    region.lineTo(xx1, yy1);
    region.lineTo(x1, y1);
    region.lineTo(xx2, yy2);
    region.closePath();
    // Fill path
    ctx.fillStyle = color;
    ctx.fill(region, "evenodd");
    if (lsTxt.length) {
        ctx.font = "11px sans-serif"
        let str = lsTxt.join(', ')
        let tx = xx0 + width
        if (x0 < x1) tx = xx0 - 3 * width - 3 * str.length
        let ty = yy0 + height
        if (y0 < y1) ty = yy0 - width
        ctx.fillText(str, tx, ty);
    }
}
export function drawAggregation(p0, p1, width, height, color, lsTxt) {
    const ctx = this
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.setLineDash([]);
    let [x0, y0, x1, y1] = computeXY(p0, p1)
    fillCirle(ctx, x0, y0, 1, color)

    let [a, b] = linearCoeffict([x0, y0], [x1, y1]);    // phuong trinh duong thang (p0, p1)
    let [xhf, yhf] = getOpPoint([x0, y0], [x1, y1], a, b, Math.round(height / 2))
    let [xx1, yy1, xx2, yy2] = poitsArg90([xhf, yhf], [a, b], width)

    let [xx0, yy0] = getOpPoint([x0, y0], [x1, y1], a, b, height)

    ctx.moveTo(x0, y0);
    ctx.lineTo(xx0, yy0);
    ctx.stroke();

    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.moveTo(xx0, yy0);
    ctx.lineTo(xx1, yy1);
    ctx.moveTo(xx1, yy1);
    ctx.lineTo(x1, y1);
    ctx.moveTo(x1, y1);
    ctx.lineTo(xx2, yy2);
    ctx.lineTo(xx0, yy0);
    ctx.stroke();
    if (lsTxt.length) {
        ctx.font = "11px sans-serif"
        let str = lsTxt.join(', ')
        let tx = xx0 + width
        if (x0 < x1) tx = xx0 - 3 * width - 3 * str.length
        let ty = yy0 + height
        if (y0 < y1) ty = yy0 - width
        ctx.fillText(str, tx, ty);
    }
}
function poitsArg90(pp0, ab, width) {
    let [xx0, yy0] = pp0
    let [a, b] = ab
    let [xx1, yy1] = [xx0, yy0 - width]
    let [xx2, yy2] = [xx0, yy0 + width]
    if (-0.003 < a && a < 0.003) return [xx1, yy1, xx2, yy2]
    let [a1, b1] = perpendiLine([xx0, yy0], a, b);      // phuong trinh duong thang vuog goc (p0, p1)
    [xx1, xx2] = directToD([xx0, yy0], width, a1, b1);
    yy1 = a1 * xx1 + b1;
    yy2 = a1 * xx2 + b1;
    return [xx1, yy1, xx2, yy2]
}
function getOpPoint(p0, p1, a, b, d) {
    let [x1, y1] = p1
    let [xx0, yy0] = [x1 - d, y1]
    if (-0.003 < a && a < 0.003) {
        if (!inRangeXY([xx0, yy0], p0, p1)) xx0 = x1 + d
        return [xx0, yy0]
    }
    let posE = directToD([x1, y1], d, a, b);
    xx0 = posE[0]
    let xx1 = posE[1]
    yy0 = a * xx0 + b
    if (inRangeXY([xx0, yy0], p0, p1)) return [xx0, yy0]
    return [xx1, a * xx1 + b]
}
function inRangeXY(p, p0, p1) {
    const [x0, y0] = p0
    const [x1, y1] = p1
    const [x, y] = p
    if (x0 < x1) {
        if (x < x0) return false
        if (x1 < x) return false
        return isInY(y, y0, y1)
    } else if (x0 == x1) {
        if (x != x0) return false
        return isInY(y, y0, y1)
    } else {
        if (x0 < x) return false
        if (x < x1) return false
        return isInY(y, y0, y1)
    }
    function isInY(y, y0, y1) {
        if (y0 < y1) {
            if (y1 < y) return false
            if (y < y0) return false
        } else if (y0 == y1) {
            if (y != y0) return false
        } else {
            if (y0 < y) return false
            if (y < y1) return false
        }
        return true
    }
}
export function computeXY(p0, p1) {
    let x1 = p1[0], y1 = p1[1];
    let w1 = p1[2], h1 = p1[3]
    let x0 = p0[0], y0 = p0[1]
    let w0 = p0[2], h0 = p0[3]
    let isLefX0 = x1 < x0
    let isBotY0 = y0 + h0 < y1

    let isCenY = (y0 <= y1 && y1 <= y0 + h0) || (y1 <= y0 && y0 <= y1 + h1)
    let isCenX = (x0 <= x1 && x1 <= x0 + w0) || (x1 <= x0 && x0 <= x1 + w1)

    let isLefX1 = x0 < x1
    let isBotY1 = y1 + h1 / 6 < y0

    if (isCenX) x0 += w0 / 2
    else if (!isLefX0) x0 += w0;
    if (isCenY) y0 += h0 / 2
    else if (isBotY0) y0 += (h0 - 1)

    if (isCenX) x1 += w1 / 2
    else if (!isLefX1) x1 += w1;
    if (isCenY) y1 += h1 / 2
    else if (isBotY1) y1 += (h1 - 1);
    return [x0, y0, x1, y1]
}
export function fillCirle(ctx, x0, y0, r, color) {
    ctx.beginPath();
    ctx.arc(x0, y0, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}
export function drawExtension(p0, p1, width, color) {
    const ctx = this
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.setLineDash([]);
    let [x0, y0, x1, y1] = computeXY(p0, p1)
    fillCirle(ctx, x0, y0, 1, color)

    let [a, b] = linearCoeffict([x0, y0], [x1, y1]);    // phuong trinh duong thang (p0, p1)
    let [xx0, yy0] = getOpPoint([x0, y0], [x1, y1], a, b, Math.ceil(width * 2.7))

    ctx.moveTo(x0, y0);
    ctx.lineTo(xx0, yy0);
    ctx.stroke();

    let [xx1, yy1, xx2, yy2] = poitsArg90([xx0, yy0], [a, b], width)
    ctx.beginPath();
    ctx.setLineDash([]);
    // Create path
    let region = new Path2D();
    region.moveTo(xx0, yy0);    // mid
    region.lineTo(xx1, yy1);    // left
    region.lineTo(x1, y1);      // top
    region.lineTo(xx2, yy2);    // right
    region.closePath();
    // Fill path
    ctx.fillStyle = color;
    ctx.fill(region, "evenodd");
}
function linearCoeffict(p0, p1) {
    let x0 = p0[0], y0 = p0[1];
    let x1 = p1[0], y1 = p1[1];
    let a = y1 - y0;
    if (x1 - x0 != 0) a = a / (x1 - x0);
    return [a, y0 - a * x0]
}
function perpendiLine(p, a, b) {
    let x = p[0], y = p[1];
    let a1 = 0;
    if (a != 0) a1 = -1 / a;
    return [a1, y - x * a1]
}
function directToD(p, d, a, b) {
    let x = p[0], y = p[1];
    let A = 1 + a * a;
    let B = 2 * (a * b - x - a * y);
    let C = x * x + y * y + b * b - d * d - 2 * y * b;
    let x1 = (-B + Math.sqrt(B * B - 4 * A * C)) / (2 * A);
    let x2 = (-B - Math.sqrt(B * B - 4 * A * C)) / (2 * A);
    return [x1, x2]
}
export function drawGrid(bw, bh, size, color) {
    const ctx = this
    ctx.beginPath();
    ctx.setLineDash([]);
    const p = 0
    for (let x = 0; x <= bw; x += size) {
        ctx.moveTo(0.5 + x + p, p);
        ctx.lineTo(0.5 + x + p, bh + p);
    }
    for (let x = 0; x <= bh; x += size) {
        ctx.moveTo(p, 0.5 + x + p);
        ctx.lineTo(bw + p, 0.5 + x + p);
    }
    ctx.strokeStyle = color;
    ctx.stroke();
}
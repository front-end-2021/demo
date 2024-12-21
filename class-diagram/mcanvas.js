
export function drawImplement(p0, p1, width) {
    const ctx = this
    ctx.beginPath();
    ctx.setLineDash([9]);
    let [x0, y0, x1, y1] = computeXY(p0, p1)
    fillCirle(ctx, x0, y0, 1, 'black')

    let [a, b] = linearCoeffict([x0, y0], [x1, y1]);    // phuong trinh duong thang (p0, p1)
    let [xx0, yy0] = getPoint(x0, x1, y1, a, b, width * 2)

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
function poitsArg90(pp0, ab, width) {
    let [xx0, yy0] = pp0
    let [a, b] = ab
    let [a1, b1] = perpendiLine([xx0, yy0], a, b);      // phuong trinh duong thang T (p0, p1)
    let [xx1, xx2] = directToD([xx0, yy0], width, a1, b1);
    let yy1 = a1 * xx1 + b1;
    let yy2 = a1 * xx2 + b1;
    return [xx1, yy1, xx2, yy2]
}
function getPoint(x0, x1, y1, a, b, d) {
    let posE = directToD([x1, y1], d, a, b);
    let xx0 = posE[0]
    if (x0 < x1 && x1 < xx0) xx0 = posE[1]
    return [xx0, a * xx0 + b]
}
function computeXY(p0, p1) {
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
function fillCirle(ctx, x0, y0, r, color) {
    ctx.beginPath();
    ctx.arc(x0, y0, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}
export function drawExtension(p0, p1, width) {
    const ctx = this
    ctx.beginPath();
    ctx.setLineDash([]);
    let [x0, y0, x1, y1] = computeXY(p0, p1)
    fillCirle(ctx, x0, y0, 1, 'black')

    let [a, b] = linearCoeffict([x0, y0], [x1, y1]);    // phuong trinh duong thang (p0, p1)
    let [xx0, yy0] = getPoint(x0, x1, y1, a, b, width * 3)

    ctx.moveTo(x0, y0);
    ctx.lineTo(xx0, yy0);

    let [xx1, yy1, xx2, yy2] = poitsArg90([xx0, yy0], [a, b], width)

    ctx.moveTo(xx1, yy1);
    ctx.lineTo(xx2, yy2);
    ctx.moveTo(xx2, yy2);

    ctx.lineTo(x1, y1);
    ctx.moveTo(x1, y1);
    ctx.lineTo(xx1, yy1);
    ctx.stroke();

}
function linearCoeffict(p0, p1) {
    let x0 = p0[0], y0 = p0[1];
    let x1 = p1[0], y1 = p1[1];
    let a = (y1 - y0) / (x1 - x0);
    return [a, y0 - a * x0]
}
function perpendiLine(p, a, b) {
    let x = p[0], y = p[1];
    let a1 = -1 / a;
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
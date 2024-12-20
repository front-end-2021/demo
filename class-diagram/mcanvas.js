

export function drawExtension(p0, p1, width) {
    const ctx = this
    let x1 = p1[0], y1 = p1[1];
    let [a, b] = linearCoeffict(p0, p1);
    let x0 = p0[0], y0 = p0[1]
    let posE = directToD(p1, width * 3, a, b);
    let xx0 = posE[0]
    if (x0 < x1 && x1 < xx0) xx0 = posE[1]
    let yy0 = a * xx0 + b;

    ctx.beginPath();
    ctx.arc(x0, y0, 1, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();

    ctx.moveTo(x0, y0);
    ctx.lineTo(xx0, yy0);

    let [a1, b1] = perpendiLine([xx0, yy0], a, b);

    let [xx1, xx2] = directToD([xx0, yy0], width, a1, b1);
    let yy1 = a1 * xx1 + b1;
    let yy2 = a1 * xx2 + b1;

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
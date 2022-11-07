const abs = Math.abs;
const atan2 = Math.atan2;
const cos = Math.cos;
const max = Math.max;
const min = Math.min;
const sin = Math.sin;
const sqrt = Math.sqrt;

const epsilon = 1e-12;
const pi = Math.PI;
const halfPi = pi / 2;
const tau = 2 * pi;

function acos(x) {
  return x > 1 ? 0 : x < -1 ? pi : Math.acos(x);
}

function asin(x) {
  return x >= 1 ? halfPi : x <= -1 ? -halfPi : Math.asin(x);
}

export { sqrt as a, abs as b, cos as c, atan2 as d, epsilon as e, asin as f, acos as g, halfPi as h, max as i, min as m, pi as p, sin as s, tau as t };
//# sourceMappingURL=math-24162d65.js.map

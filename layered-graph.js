import { s as select, x as creator, z as Selection, A as root$1, B as array$2, C as SCHEDULED, T as Transition, D as rgbBasis, E as rgb, v as dispatch, F as identity$3, G as Transform, H as interrupt, m as color, I as hsl, J as cubicInOut, K as cubicIn, M as cubicOut, N as basis, O as basisClosed, l as interpolateNumber, o as interpolateString, P as interpolateTransformCss, Q as interpolateTransformSvg, n as interpolateRgb, R as rgbBasisClosed, U as matcher, V as namespace, W as namespaces, X as selection, Y as selector, Z as selectorAll, _ as styleValue, $ as defaultView, a0 as now, u as timer, a1 as timerFlush, a2 as timeout, a3 as transition, a4 as transform$1, S as Stanza, d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem, f as appendCustomCss, g as defineStanzaElement } from './index-b37241ec.js';
import { b as brush, a as brushX, c as brushY, d as brushSelection } from './brush-4d2a9838.js';
import { s as sort, q as quantile, d as deviation, a as ascendingDefined, c as compareDefined, m as minIndex, b as maxIndex, e as clipRectangle, A as Adder, g as geoStream, n as noop$1, f as atan2, h as sqrt, i as sin, j as cos, r as radians, k as abs, l as epsilon2, p as polygonContains, o as asin, t as haversin, u as degrees, v as cubehelixLong, w as cubehelix$1, x as area$2, y as interpolateZoom, z as fsum, B as fcumsum, C as mean, D as median, E as medianIndex, F as merge, G as permute, H as quantileIndex, I as quantileSorted, J as quickselect, K as greatest, L as variance, M as lab, N as hcl, O as lch, P as gray, Q as Delaunay, V as Voronoi, R as forceX, S as forceY, T as geoArea$1, U as geoBounds$1, W as geoCentroid$1, X as geoCircle, Y as clipAntimeridian, Z as clipCircle, _ as graticule, $ as graticule10, a0 as geoPath, a1 as geoAlbers, a2 as geoAlbersUsa, a3 as geoAzimuthalEqualArea, a4 as azimuthalEqualAreaRaw, a5 as geoAzimuthalEquidistant, a6 as azimuthalEquidistantRaw, a7 as geoConicConformal, a8 as conicConformalRaw, a9 as geoConicEqualArea, aa as conicEqualAreaRaw, ab as geoConicEquidistant, ac as conicEquidistantRaw, ad as geoEqualEarth, ae as equalEarthRaw, af as geoEquirectangular, ag as equirectangularRaw, ah as geoGnomonic, ai as gnomonicRaw, aj as geoIdentity, ak as projection, al as projectionMutator, am as geoMercator, an as mercatorRaw, ao as geoNaturalEarth1, ap as naturalEarth1Raw, aq as geoOrthographic, ar as orthographicRaw, as as geoStereographic, at as stereographicRaw, au as geoTransverseMercator, av as transverseMercatorRaw, aw as rotation, ax as transform, ay as pack, az as siblings, aA as enclose, aB as treemapBinary, aC as treemapSliceDice, aD as treemapResquarify, aE as discrete, aF as hue, aG as hsl$1, aH as hslLong, aI as lab$1, aJ as hcl$1, aK as hclLong, aL as cubehelix$2, aM as piecewise, aN as quantize, aO as identity$4, aP as symlog, aQ as quantile$1, aR as quantize$1, aS as threshold, aT as utcTime, aU as sequential, aV as sequentialLog, aW as sequentialPow, aX as sequentialSqrt, aY as sequentialSymlog, aZ as diverging$1, a_ as divergingLog, a$ as divergingPow, b0 as divergingSqrt, b1 as divergingSymlog, b2 as curveBasisClosed, b3 as curveBasisOpen, b4 as curveBundle, b5 as curveCardinalClosed, b6 as curveCardinalOpen, b7 as curveCardinal, b8 as curveCatmullRomClosed, b9 as curveCatmullRomOpen, ba as curveCatmullRom, bb as curveLinearClosed, bc as monotoneX, bd as monotoneY, be as curveNatural, bf as curveStep, bg as stepAfter, bh as stepBefore, bi as interval } from './step-9de5062e.js';
import { s as sourceEvent, p as pointer, d as dragDisable, y as yesdrag } from './nodrag-ae00e796.js';
import { h as ascending$2, j as tickIncrement, a as ticks, k as bisect, I as InternMap, m as InternSet, n as tickStep, p as continuous, q as number, i as initRange, g as linearish, r as initInterpolator, e as identity$2, s as bisectRight, u as bisectLeft, v as bisectCenter, w as bisector, d as descending$2, x as defaultLocale, f as format, y as formatPrefix, z as formatLocale, b as formatSpecifier, F as FormatSpecifier, A as precisionFixed, B as precisionPrefix, C as precisionRound, D as interpolate$1, E as array$4, G as date, H as numberArray, J as object$1, K as interpolateRound, l as linear$1, o as ordinal, L as implicit, M as tickFormat } from './linear-13370298.js';
import { r as rollup, g as group, i as identity$1, n as none, a as none$1, f as flatGroup, b as flatRollup, c as groups, d as index, e as indexes, h as rollups, s as stack } from './stack-8c19205e.js';
import { e as extent$1 } from './extent-14a1e8e9.js';
import { m as min, c as cluster, t as tree } from './tree-0236e2eb.js';
import { t as text, d as dsvFormat, c as csvParse, a as csvParseRows, b as csvFormat, e as csvFormatBody, f as csvFormatRows, g as csvFormatRow, h as csvFormatValue, i as tsvParse, j as tsvParseRows, k as tsvFormat, m as tsvFormatBody, n as tsvFormatRows, o as tsvFormatRow, p as tsvFormatValue, q as dsv, r as csv, s as tsv, l as loadData } from './load-data-0ddebadb.js';
import { u as utcFormat, a as utcParse, t as time, S as Symbol$1, s as symbolsStroke, b as symbolsFill, c as asterisk, d as circle, e as cross$2, f as diamond, g as diamond2, p as plus, h as square$1, i as square2, j as star, k as triangle$1, l as triangle2, w as wye, m as times, n as timeInterval, o as millisecond, q as milliseconds, r as second, v as seconds, x as timeMinute, y as timeMinutes, z as utcMinute, A as utcMinutes, B as timeHour, C as timeHours, D as utcHour, E as utcHours, F as timeDay, G as timeDays, H as utcDay, I as utcDays, J as unixDay, K as unixDays, L as timeSunday, M as timeSundays, N as timeMonday, O as timeMondays, P as timeTuesday, Q as timeTuesdays, R as timeWednesday, T as timeWednesdays, U as timeThursday, V as timeThursdays, W as timeFriday, X as timeFridays, Y as timeSaturday, Z as timeSaturdays, _ as utcSunday, $ as utcSundays, a0 as utcMonday, a1 as utcMondays, a2 as utcTuesday, a3 as utcTuesdays, a4 as utcWednesday, a5 as utcWednesdays, a6 as utcThursday, a7 as utcThursdays, a8 as utcFriday, a9 as utcFridays, aa as utcSaturday, ab as utcSaturdays, ac as timeMonth, ad as timeMonths, ae as utcMonth, af as utcMonths, ag as timeYear, ah as timeYears, ai as utcYear, aj as utcYears, ak as utcTicks, al as utcTickInterval, am as timeTicks, an as timeTickInterval, ao as defaultLocale$1, ap as timeFormat, aq as timeParse, ar as formatLocale$1 } from './symbol-80b0bd22.js';
import { m as max } from './max-2c042256.js';
import { r as range } from './range-e15c6861.js';
import { s as sum$1 } from './sum-44e7480e.js';
import { c as axisTop, d as axisRight, a as axisBottom, b as axisLeft } from './axis-3dba94d9.js';
import { a as chord, b as chordTranspose, c as chordDirected, d as ribbon, r as ribbonArrow } from './ribbon-368f465b.js';
import { d as drag } from './drag-3fddc0d5.js';
import { e as constant$3, b as forceCenter, d as forceCollide, c as forceLink, a as forceManyBody, f as forceSimulation, q as quadtree } from './manyBody-adf18816.js';
import { h as hierarchy, N as Node, s as stratify } from './stratify-7050dfd9.js';
import { p as partition } from './partition-e955ad6c.js';
import { t as treemap, a as treemapSlice, b as treemapSquarify } from './index-c76c1b89.js';
import { t as treemapDice } from './dice-7bdb0652.js';
import { P as Path, p as path, a as pathRound } from './path-f2817c20.js';
import { b as band, p as point$1 } from './band-d0e670ee.js';
import { l as log } from './log-4dfecd56.js';
import { p as pow, s as sqrt$1 } from './pow-b36a5b29.js';
import { a as arc$2 } from './arc-b062fe01.js';
import { c as curveLinear, l as line$2 } from './line-fbadf484.js';
import { a as array$3 } from './array-80a7907a.js';
import { c as constant$4 } from './constant-c49047a5.js';
import { t as tau$1 } from './math-24162d65.js';
import { p as pointRadial, l as link, a as linkHorizontal, b as linkVertical, c as linkRadial, d as bumpX, e as bumpY } from './link-6b6edf98.js';
import { c as curveBasis } from './basis-0dde91c7.js';
import { T as ToolTip } from './ToolTip-8932448c.js';
import { S as StanzaColorGenerator } from './ColorGenerator-8b50b614.js';
import { p as prepareGraphData, g as get3DEdges, a as getGroupPlanes } from './prepareGraphData-edbe3e03.js';
import './point-7945b9d0.js';
import './ref-3a8fb5e8.js';
import './v4-1d7bfe79.js';

function blur(values, r) {
  if (!((r = +r) >= 0)) throw new RangeError("invalid r");
  let length = values.length;
  if (!((length = Math.floor(length)) >= 0)) throw new RangeError("invalid length");
  if (!length || !r) return values;
  const blur = blurf(r);
  const temp = values.slice();
  blur(values, temp, 0, length, 1);
  blur(temp, values, 0, length, 1);
  blur(values, temp, 0, length, 1);
  return values;
}

const blur2 = Blur2(blurf);

const blurImage = Blur2(blurfImage);

function Blur2(blur) {
  return function(data, rx, ry = rx) {
    if (!((rx = +rx) >= 0)) throw new RangeError("invalid rx");
    if (!((ry = +ry) >= 0)) throw new RangeError("invalid ry");
    let {data: values, width, height} = data;
    if (!((width = Math.floor(width)) >= 0)) throw new RangeError("invalid width");
    if (!((height = Math.floor(height !== undefined ? height : values.length / width)) >= 0)) throw new RangeError("invalid height");
    if (!width || !height || (!rx && !ry)) return data;
    const blurx = rx && blur(rx);
    const blury = ry && blur(ry);
    const temp = values.slice();
    if (blurx && blury) {
      blurh(blurx, temp, values, width, height);
      blurh(blurx, values, temp, width, height);
      blurh(blurx, temp, values, width, height);
      blurv(blury, values, temp, width, height);
      blurv(blury, temp, values, width, height);
      blurv(blury, values, temp, width, height);
    } else if (blurx) {
      blurh(blurx, values, temp, width, height);
      blurh(blurx, temp, values, width, height);
      blurh(blurx, values, temp, width, height);
    } else if (blury) {
      blurv(blury, values, temp, width, height);
      blurv(blury, temp, values, width, height);
      blurv(blury, values, temp, width, height);
    }
    return data;
  };
}

function blurh(blur, T, S, w, h) {
  for (let y = 0, n = w * h; y < n;) {
    blur(T, S, y, y += w, 1);
  }
}

function blurv(blur, T, S, w, h) {
  for (let x = 0, n = w * h; x < w; ++x) {
    blur(T, S, x, x + n, w);
  }
}

function blurfImage(radius) {
  const blur = blurf(radius);
  return (T, S, start, stop, step) => {
    start <<= 2, stop <<= 2, step <<= 2;
    blur(T, S, start + 0, stop + 0, step);
    blur(T, S, start + 1, stop + 1, step);
    blur(T, S, start + 2, stop + 2, step);
    blur(T, S, start + 3, stop + 3, step);
  };
}

// Given a target array T, a source array S, sets each value T[i] to the average
// of {S[i - r], …, S[i], …, S[i + r]}, where r = ⌊radius⌋, start <= i < stop,
// for each i, i + step, i + 2 * step, etc., and where S[j] is clamped between
// S[start] (inclusive) and S[stop] (exclusive). If the given radius is not an
// integer, S[i - r - 1] and S[i + r + 1] are added to the sum, each weighted
// according to r - ⌊radius⌋.
function blurf(radius) {
  const radius0 = Math.floor(radius);
  if (radius0 === radius) return bluri(radius);
  const t = radius - radius0;
  const w = 2 * radius + 1;
  return (T, S, start, stop, step) => { // stop must be aligned!
    if (!((stop -= step) >= start)) return; // inclusive stop
    let sum = radius0 * S[start];
    const s0 = step * radius0;
    const s1 = s0 + step;
    for (let i = start, j = start + s0; i < j; i += step) {
      sum += S[Math.min(stop, i)];
    }
    for (let i = start, j = stop; i <= j; i += step) {
      sum += S[Math.min(stop, i + s0)];
      T[i] = (sum + t * (S[Math.max(start, i - s1)] + S[Math.min(stop, i + s1)])) / w;
      sum -= S[Math.max(start, i - s0)];
    }
  };
}

// Like blurf, but optimized for integer radius.
function bluri(radius) {
  const w = 2 * radius + 1;
  return (T, S, start, stop, step) => { // stop must be aligned!
    if (!((stop -= step) >= start)) return; // inclusive stop
    let sum = radius * S[start];
    const s = step * radius;
    for (let i = start, j = start + s; i < j; i += step) {
      sum += S[Math.min(stop, i)];
    }
    for (let i = start, j = stop; i <= j; i += step) {
      sum += S[Math.min(stop, i + s)];
      T[i] = sum / w;
      sum -= S[Math.max(start, i - s)];
    }
  };
}

function count(values, valueof) {
  let count = 0;
  if (valueof === undefined) {
    for (let value of values) {
      if (value != null && (value = +value) >= value) {
        ++count;
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index, values)) != null && (value = +value) >= value) {
        ++count;
      }
    }
  }
  return count;
}

function length$3(array) {
  return array.length | 0;
}

function empty(length) {
  return !(length > 0);
}

function arrayify(values) {
  return typeof values !== "object" || "length" in values ? values : Array.from(values);
}

function reducer(reduce) {
  return values => reduce(...values);
}

function cross$1(...values) {
  const reduce = typeof values[values.length - 1] === "function" && reducer(values.pop());
  values = values.map(arrayify);
  const lengths = values.map(length$3);
  const j = values.length - 1;
  const index = new Array(j + 1).fill(0);
  const product = [];
  if (j < 0 || lengths.some(empty)) return product;
  while (true) {
    product.push(index.map((j, i) => values[i][j]));
    let i = j;
    while (++index[i] === lengths[i]) {
      if (i === 0) return reduce ? product.map(reduce) : product;
      index[i--] = 0;
    }
  }
}

function cumsum(values, valueof) {
  var sum = 0, index = 0;
  return Float64Array.from(values, valueof === undefined
    ? v => (sum += +v || 0)
    : v => (sum += +valueof(v, index++, values) || 0));
}

function groupSort(values, reduce, key) {
  return (reduce.length !== 2
    ? sort(rollup(values, reduce, key), (([ak, av], [bk, bv]) => ascending$2(av, bv) || ascending$2(ak, bk)))
    : sort(group(values, key), (([ak, av], [bk, bv]) => reduce(av, bv) || ascending$2(ak, bk))))
    .map(([key]) => key);
}

var array$1 = Array.prototype;

var slice$1 = array$1.slice;

function constant$2(x) {
  return () => x;
}

function nice(start, stop, count) {
  let prestep;
  while (true) {
    const step = tickIncrement(start, stop, count);
    if (step === prestep || step === 0 || !isFinite(step)) {
      return [start, stop];
    } else if (step > 0) {
      start = Math.floor(start / step) * step;
      stop = Math.ceil(stop / step) * step;
    } else if (step < 0) {
      start = Math.ceil(start * step) / step;
      stop = Math.floor(stop * step) / step;
    }
    prestep = step;
  }
}

function thresholdSturges(values) {
  return Math.ceil(Math.log(count(values)) / Math.LN2) + 1;
}

function bin() {
  var value = identity$1,
      domain = extent$1,
      threshold = thresholdSturges;

  function histogram(data) {
    if (!Array.isArray(data)) data = Array.from(data);

    var i,
        n = data.length,
        x,
        step,
        values = new Array(n);

    for (i = 0; i < n; ++i) {
      values[i] = value(data[i], i, data);
    }

    var xz = domain(values),
        x0 = xz[0],
        x1 = xz[1],
        tz = threshold(values, x0, x1);

    // Convert number of thresholds into uniform thresholds, and nice the
    // default domain accordingly.
    if (!Array.isArray(tz)) {
      const max = x1, tn = +tz;
      if (domain === extent$1) [x0, x1] = nice(x0, x1, tn);
      tz = ticks(x0, x1, tn);

      // If the domain is aligned with the first tick (which it will by
      // default), then we can use quantization rather than bisection to bin
      // values, which is substantially faster.
      if (tz[0] <= x0) step = tickIncrement(x0, x1, tn);

      // If the last threshold is coincident with the domain’s upper bound, the
      // last bin will be zero-width. If the default domain is used, and this
      // last threshold is coincident with the maximum input value, we can
      // extend the niced upper bound by one tick to ensure uniform bin widths;
      // otherwise, we simply remove the last threshold. Note that we don’t
      // coerce values or the domain to numbers, and thus must be careful to
      // compare order (>=) rather than strict equality (===)!
      if (tz[tz.length - 1] >= x1) {
        if (max >= x1 && domain === extent$1) {
          const step = tickIncrement(x0, x1, tn);
          if (isFinite(step)) {
            if (step > 0) {
              x1 = (Math.floor(x1 / step) + 1) * step;
            } else if (step < 0) {
              x1 = (Math.ceil(x1 * -step) + 1) / -step;
            }
          }
        } else {
          tz.pop();
        }
      }
    }

    // Remove any thresholds outside the domain.
    // Be careful not to mutate an array owned by the user!
    var m = tz.length, a = 0, b = m;
    while (tz[a] <= x0) ++a;
    while (tz[b - 1] > x1) --b;
    if (a || b < m) tz = tz.slice(a, b), m = b - a;

    var bins = new Array(m + 1),
        bin;

    // Initialize bins.
    for (i = 0; i <= m; ++i) {
      bin = bins[i] = [];
      bin.x0 = i > 0 ? tz[i - 1] : x0;
      bin.x1 = i < m ? tz[i] : x1;
    }

    // Assign data to bins by value, ignoring any outside the domain.
    if (isFinite(step)) {
      if (step > 0) {
        for (i = 0; i < n; ++i) {
          if ((x = values[i]) != null && x0 <= x && x <= x1) {
            bins[Math.min(m, Math.floor((x - x0) / step))].push(data[i]);
          }
        }
      } else if (step < 0) {
        for (i = 0; i < n; ++i) {
          if ((x = values[i]) != null && x0 <= x && x <= x1) {
            const j = Math.floor((x0 - x) * step);
            bins[Math.min(m, j + (tz[j] <= x))].push(data[i]); // handle off-by-one due to rounding
          }
        }
      }
    } else {
      for (i = 0; i < n; ++i) {
        if ((x = values[i]) != null && x0 <= x && x <= x1) {
          bins[bisect(tz, x, 0, m)].push(data[i]);
        }
      }
    }

    return bins;
  }

  histogram.value = function(_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : constant$2(_), histogram) : value;
  };

  histogram.domain = function(_) {
    return arguments.length ? (domain = typeof _ === "function" ? _ : constant$2([_[0], _[1]]), histogram) : domain;
  };

  histogram.thresholds = function(_) {
    return arguments.length ? (threshold = typeof _ === "function" ? _ : constant$2(Array.isArray(_) ? slice$1.call(_) : _), histogram) : threshold;
  };

  return histogram;
}

function thresholdFreedmanDiaconis(values, min, max) {
  return Math.ceil((max - min) / (2 * (quantile(values, 0.75) - quantile(values, 0.25)) * Math.pow(count(values), -1 / 3)));
}

function thresholdScott(values, min, max) {
  return Math.ceil((max - min) * Math.cbrt(count(values)) / (3.49 * deviation(values)));
}

function mode(values, valueof) {
  const counts = new InternMap();
  if (valueof === undefined) {
    for (let value of values) {
      if (value != null && value >= value) {
        counts.set(value, (counts.get(value) || 0) + 1);
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index, values)) != null && value >= value) {
        counts.set(value, (counts.get(value) || 0) + 1);
      }
    }
  }
  let modeValue;
  let modeCount = 0;
  for (const [value, count] of counts) {
    if (count > modeCount) {
      modeCount = count;
      modeValue = value;
    }
  }
  return modeValue;
}

function pairs(values, pairof = pair) {
  const pairs = [];
  let previous;
  let first = false;
  for (const value of values) {
    if (first) pairs.push(pairof(previous, value));
    previous = value;
    first = true;
  }
  return pairs;
}

function pair(a, b) {
  return [a, b];
}

function rank(values, valueof = ascending$2) {
  if (typeof values[Symbol.iterator] !== "function") throw new TypeError("values is not iterable");
  let V = Array.from(values);
  const R = new Float64Array(V.length);
  if (valueof.length !== 2) V = V.map(valueof), valueof = ascending$2;
  const compareIndex = (i, j) => valueof(V[i], V[j]);
  let k, r;
  Uint32Array
    .from(V, (_, i) => i)
    .sort(valueof === ascending$2 ? (i, j) => ascendingDefined(V[i], V[j]) : compareDefined(compareIndex))
    .forEach((j, i) => {
      const c = compareIndex(j, k === undefined ? j : k);
      if (c >= 0) {
        if (k === undefined || c > 0) k = j, r = i;
        R[j] = r;
      } else {
        R[j] = NaN;
      }
    });
  return R;
}

function least(values, compare = ascending$2) {
  let min;
  let defined = false;
  if (compare.length === 1) {
    let minValue;
    for (const element of values) {
      const value = compare(element);
      if (defined
          ? ascending$2(value, minValue) < 0
          : ascending$2(value, value) === 0) {
        min = element;
        minValue = value;
        defined = true;
      }
    }
  } else {
    for (const value of values) {
      if (defined
          ? compare(value, min) < 0
          : compare(value, value) === 0) {
        min = value;
        defined = true;
      }
    }
  }
  return min;
}

function leastIndex(values, compare = ascending$2) {
  if (compare.length === 1) return minIndex(values, compare);
  let minValue;
  let min = -1;
  let index = -1;
  for (const value of values) {
    ++index;
    if (min < 0
        ? compare(value, value) === 0
        : compare(value, minValue) < 0) {
      minValue = value;
      min = index;
    }
  }
  return min;
}

function greatestIndex(values, compare = ascending$2) {
  if (compare.length === 1) return maxIndex(values, compare);
  let maxValue;
  let max = -1;
  let index = -1;
  for (const value of values) {
    ++index;
    if (max < 0
        ? compare(value, value) === 0
        : compare(value, maxValue) > 0) {
      maxValue = value;
      max = index;
    }
  }
  return max;
}

function scan(values, compare) {
  const index = leastIndex(values, compare);
  return index < 0 ? undefined : index;
}

var shuffle = shuffler(Math.random);

function shuffler(random) {
  return function shuffle(array, i0 = 0, i1 = array.length) {
    let m = i1 - (i0 = +i0);
    while (m) {
      const i = random() * m-- | 0, t = array[m + i0];
      array[m + i0] = array[i + i0];
      array[i + i0] = t;
    }
    return array;
  };
}

function transpose(matrix) {
  if (!(n = matrix.length)) return [];
  for (var i = -1, m = min(matrix, length$2), transpose = new Array(m); ++i < m;) {
    for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n;) {
      row[j] = matrix[j][i];
    }
  }
  return transpose;
}

function length$2(d) {
  return d.length;
}

function zip() {
  return transpose(arguments);
}

function every(values, test) {
  if (typeof test !== "function") throw new TypeError("test is not a function");
  let index = -1;
  for (const value of values) {
    if (!test(value, ++index, values)) {
      return false;
    }
  }
  return true;
}

function some(values, test) {
  if (typeof test !== "function") throw new TypeError("test is not a function");
  let index = -1;
  for (const value of values) {
    if (test(value, ++index, values)) {
      return true;
    }
  }
  return false;
}

function filter(values, test) {
  if (typeof test !== "function") throw new TypeError("test is not a function");
  const array = [];
  let index = -1;
  for (const value of values) {
    if (test(value, ++index, values)) {
      array.push(value);
    }
  }
  return array;
}

function map(values, mapper) {
  if (typeof values[Symbol.iterator] !== "function") throw new TypeError("values is not iterable");
  if (typeof mapper !== "function") throw new TypeError("mapper is not a function");
  return Array.from(values, (value, index) => mapper(value, index, values));
}

function reduce(values, reducer, value) {
  if (typeof reducer !== "function") throw new TypeError("reducer is not a function");
  const iterator = values[Symbol.iterator]();
  let done, next, index = -1;
  if (arguments.length < 3) {
    ({done, value} = iterator.next());
    if (done) return;
    ++index;
  }
  while (({done, value: next} = iterator.next()), !done) {
    value = reducer(value, next, ++index, values);
  }
  return value;
}

function reverse$1(values) {
  if (typeof values[Symbol.iterator] !== "function") throw new TypeError("values is not iterable");
  return Array.from(values).reverse();
}

function difference(values, ...others) {
  values = new InternSet(values);
  for (const other of others) {
    for (const value of other) {
      values.delete(value);
    }
  }
  return values;
}

function disjoint(values, other) {
  const iterator = other[Symbol.iterator](), set = new InternSet();
  for (const v of values) {
    if (set.has(v)) return false;
    let value, done;
    while (({value, done} = iterator.next())) {
      if (done) break;
      if (Object.is(v, value)) return false;
      set.add(value);
    }
  }
  return true;
}

function intersection(values, ...others) {
  values = new InternSet(values);
  others = others.map(set);
  out: for (const value of values) {
    for (const other of others) {
      if (!other.has(value)) {
        values.delete(value);
        continue out;
      }
    }
  }
  return values;
}

function set(values) {
  return values instanceof InternSet ? values : new InternSet(values);
}

function superset(values, other) {
  const iterator = values[Symbol.iterator](), set = new Set();
  for (const o of other) {
    const io = intern(o);
    if (set.has(io)) continue;
    let value, done;
    while (({value, done} = iterator.next())) {
      if (done) return false;
      const ivalue = intern(value);
      set.add(ivalue);
      if (Object.is(io, ivalue)) break;
    }
  }
  return true;
}

function intern(value) {
  return value !== null && typeof value === "object" ? value.valueOf() : value;
}

function subset(values, other) {
  return superset(other, values);
}

function union(...others) {
  const set = new InternSet();
  for (const other of others) {
    for (const o of other) {
      set.add(o);
    }
  }
  return set;
}

function create(name) {
  return select(creator(name).call(document.documentElement));
}

var nextId = 0;

function local() {
  return new Local;
}

function Local() {
  this._ = "@" + (++nextId).toString(36);
}

Local.prototype = local.prototype = {
  constructor: Local,
  get: function(node) {
    var id = this._;
    while (!(id in node)) if (!(node = node.parentNode)) return;
    return node[id];
  },
  set: function(node, value) {
    return node[this._] = value;
  },
  remove: function(node) {
    return this._ in node && delete node[this._];
  },
  toString: function() {
    return this._;
  }
};

function pointers(events, node) {
  if (events.target) { // i.e., instanceof Event, not TouchList or iterable
    events = sourceEvent(events);
    if (node === undefined) node = events.currentTarget;
    events = events.touches || [events];
  }
  return Array.from(events, event => pointer(event, node));
}

function selectAll(selector) {
  return typeof selector === "string"
      ? new Selection([document.querySelectorAll(selector)], [document.documentElement])
      : new Selection([array$2(selector)], root$1);
}

const linear = t => +t;

function quadIn(t) {
  return t * t;
}

function quadOut(t) {
  return t * (2 - t);
}

function quadInOut(t) {
  return ((t *= 2) <= 1 ? t * t : --t * (2 - t) + 1) / 2;
}

var exponent = 3;

var polyIn = (function custom(e) {
  e = +e;

  function polyIn(t) {
    return Math.pow(t, e);
  }

  polyIn.exponent = custom;

  return polyIn;
})(exponent);

var polyOut = (function custom(e) {
  e = +e;

  function polyOut(t) {
    return 1 - Math.pow(1 - t, e);
  }

  polyOut.exponent = custom;

  return polyOut;
})(exponent);

var polyInOut = (function custom(e) {
  e = +e;

  function polyInOut(t) {
    return ((t *= 2) <= 1 ? Math.pow(t, e) : 2 - Math.pow(2 - t, e)) / 2;
  }

  polyInOut.exponent = custom;

  return polyInOut;
})(exponent);

var pi = Math.PI,
    halfPi = pi / 2;

function sinIn(t) {
  return (+t === 1) ? 1 : 1 - Math.cos(t * halfPi);
}

function sinOut(t) {
  return Math.sin(t * halfPi);
}

function sinInOut(t) {
  return (1 - Math.cos(pi * t)) / 2;
}

// tpmt is two power minus ten times t scaled to [0,1]
function tpmt(x) {
  return (Math.pow(2, -10 * x) - 0.0009765625) * 1.0009775171065494;
}

function expIn(t) {
  return tpmt(1 - +t);
}

function expOut(t) {
  return 1 - tpmt(t);
}

function expInOut(t) {
  return ((t *= 2) <= 1 ? tpmt(1 - t) : 2 - tpmt(t - 1)) / 2;
}

function circleIn(t) {
  return 1 - Math.sqrt(1 - t * t);
}

function circleOut(t) {
  return Math.sqrt(1 - --t * t);
}

function circleInOut(t) {
  return ((t *= 2) <= 1 ? 1 - Math.sqrt(1 - t * t) : Math.sqrt(1 - (t -= 2) * t) + 1) / 2;
}

var b1 = 4 / 11,
    b2 = 6 / 11,
    b3 = 8 / 11,
    b4 = 3 / 4,
    b5 = 9 / 11,
    b6 = 10 / 11,
    b7 = 15 / 16,
    b8 = 21 / 22,
    b9 = 63 / 64,
    b0 = 1 / b1 / b1;

function bounceIn(t) {
  return 1 - bounceOut(1 - t);
}

function bounceOut(t) {
  return (t = +t) < b1 ? b0 * t * t : t < b3 ? b0 * (t -= b2) * t + b4 : t < b6 ? b0 * (t -= b5) * t + b7 : b0 * (t -= b8) * t + b9;
}

function bounceInOut(t) {
  return ((t *= 2) <= 1 ? 1 - bounceOut(1 - t) : bounceOut(t - 1) + 1) / 2;
}

var overshoot = 1.70158;

var backIn = (function custom(s) {
  s = +s;

  function backIn(t) {
    return (t = +t) * t * (s * (t - 1) + t);
  }

  backIn.overshoot = custom;

  return backIn;
})(overshoot);

var backOut = (function custom(s) {
  s = +s;

  function backOut(t) {
    return --t * t * ((t + 1) * s + t) + 1;
  }

  backOut.overshoot = custom;

  return backOut;
})(overshoot);

var backInOut = (function custom(s) {
  s = +s;

  function backInOut(t) {
    return ((t *= 2) < 1 ? t * t * ((s + 1) * t - s) : (t -= 2) * t * ((s + 1) * t + s) + 2) / 2;
  }

  backInOut.overshoot = custom;

  return backInOut;
})(overshoot);

var tau = 2 * Math.PI,
    amplitude = 1,
    period = 0.3;

var elasticIn = (function custom(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

  function elasticIn(t) {
    return a * tpmt(-(--t)) * Math.sin((s - t) / p);
  }

  elasticIn.amplitude = function(a) { return custom(a, p * tau); };
  elasticIn.period = function(p) { return custom(a, p); };

  return elasticIn;
})(amplitude, period);

var elasticOut = (function custom(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

  function elasticOut(t) {
    return 1 - a * tpmt(t = +t) * Math.sin((t + s) / p);
  }

  elasticOut.amplitude = function(a) { return custom(a, p * tau); };
  elasticOut.period = function(p) { return custom(a, p); };

  return elasticOut;
})(amplitude, period);

var elasticInOut = (function custom(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

  function elasticInOut(t) {
    return ((t = t * 2 - 1) < 0
        ? a * tpmt(-t) * Math.sin((s - t) / p)
        : 2 - a * tpmt(t) * Math.sin((s + t) / p)) / 2;
  }

  elasticInOut.amplitude = function(a) { return custom(a, p * tau); };
  elasticInOut.period = function(p) { return custom(a, p); };

  return elasticInOut;
})(amplitude, period);

var root = [null];

function active(node, name) {
  var schedules = node.__transition,
      schedule,
      i;

  if (schedules) {
    name = name == null ? null : name + "";
    for (i in schedules) {
      if ((schedule = schedules[i]).state > SCHEDULED && schedule.name === name) {
        return new Transition([[node]], root, name, +i);
      }
    }
  }

  return null;
}

var array = Array.prototype;

var slice = array.slice;

function ascending$1(a, b) {
  return a - b;
}

function area$1(ring) {
  var i = 0, n = ring.length, area = ring[n - 1][1] * ring[0][0] - ring[n - 1][0] * ring[0][1];
  while (++i < n) area += ring[i - 1][1] * ring[i][0] - ring[i - 1][0] * ring[i][1];
  return area;
}

var constant$1 = x => () => x;

function contains$2(ring, hole) {
  var i = -1, n = hole.length, c;
  while (++i < n) if (c = ringContains(ring, hole[i])) return c;
  return 0;
}

function ringContains(ring, point) {
  var x = point[0], y = point[1], contains = -1;
  for (var i = 0, n = ring.length, j = n - 1; i < n; j = i++) {
    var pi = ring[i], xi = pi[0], yi = pi[1], pj = ring[j], xj = pj[0], yj = pj[1];
    if (segmentContains(pi, pj, point)) return 0;
    if (((yi > y) !== (yj > y)) && ((x < (xj - xi) * (y - yi) / (yj - yi) + xi))) contains = -contains;
  }
  return contains;
}

function segmentContains(a, b, c) {
  var i; return collinear(a, b, c) && within(a[i = +(a[0] === b[0])], c[i], b[i]);
}

function collinear(a, b, c) {
  return (b[0] - a[0]) * (c[1] - a[1]) === (c[0] - a[0]) * (b[1] - a[1]);
}

function within(p, q, r) {
  return p <= q && q <= r || r <= q && q <= p;
}

function noop() {}

var cases = [
  [],
  [[[1.0, 1.5], [0.5, 1.0]]],
  [[[1.5, 1.0], [1.0, 1.5]]],
  [[[1.5, 1.0], [0.5, 1.0]]],
  [[[1.0, 0.5], [1.5, 1.0]]],
  [[[1.0, 1.5], [0.5, 1.0]], [[1.0, 0.5], [1.5, 1.0]]],
  [[[1.0, 0.5], [1.0, 1.5]]],
  [[[1.0, 0.5], [0.5, 1.0]]],
  [[[0.5, 1.0], [1.0, 0.5]]],
  [[[1.0, 1.5], [1.0, 0.5]]],
  [[[0.5, 1.0], [1.0, 0.5]], [[1.5, 1.0], [1.0, 1.5]]],
  [[[1.5, 1.0], [1.0, 0.5]]],
  [[[0.5, 1.0], [1.5, 1.0]]],
  [[[1.0, 1.5], [1.5, 1.0]]],
  [[[0.5, 1.0], [1.0, 1.5]]],
  []
];

function Contours() {
  var dx = 1,
      dy = 1,
      threshold = thresholdSturges,
      smooth = smoothLinear;

  function contours(values) {
    var tz = threshold(values);

    // Convert number of thresholds into uniform thresholds.
    if (!Array.isArray(tz)) {
      const e = extent$1(values), ts = tickStep(e[0], e[1], tz);
      tz = ticks(Math.floor(e[0] / ts) * ts, Math.floor(e[1] / ts - 1) * ts, tz);
    } else {
      tz = tz.slice().sort(ascending$1);
    }

    return tz.map(value => contour(values, value));
  }

  // Accumulate, smooth contour rings, assign holes to exterior rings.
  // Based on https://github.com/mbostock/shapefile/blob/v0.6.2/shp/polygon.js
  function contour(values, value) {
    var polygons = [],
        holes = [];

    isorings(values, value, function(ring) {
      smooth(ring, values, value);
      if (area$1(ring) > 0) polygons.push([ring]);
      else holes.push(ring);
    });

    holes.forEach(function(hole) {
      for (var i = 0, n = polygons.length, polygon; i < n; ++i) {
        if (contains$2((polygon = polygons[i])[0], hole) !== -1) {
          polygon.push(hole);
          return;
        }
      }
    });

    return {
      type: "MultiPolygon",
      value: value,
      coordinates: polygons
    };
  }

  // Marching squares with isolines stitched into rings.
  // Based on https://github.com/topojson/topojson-client/blob/v3.0.0/src/stitch.js
  function isorings(values, value, callback) {
    var fragmentByStart = new Array,
        fragmentByEnd = new Array,
        x, y, t0, t1, t2, t3;

    // Special case for the first row (y = -1, t2 = t3 = 0).
    x = y = -1;
    t1 = values[0] >= value;
    cases[t1 << 1].forEach(stitch);
    while (++x < dx - 1) {
      t0 = t1, t1 = values[x + 1] >= value;
      cases[t0 | t1 << 1].forEach(stitch);
    }
    cases[t1 << 0].forEach(stitch);

    // General case for the intermediate rows.
    while (++y < dy - 1) {
      x = -1;
      t1 = values[y * dx + dx] >= value;
      t2 = values[y * dx] >= value;
      cases[t1 << 1 | t2 << 2].forEach(stitch);
      while (++x < dx - 1) {
        t0 = t1, t1 = values[y * dx + dx + x + 1] >= value;
        t3 = t2, t2 = values[y * dx + x + 1] >= value;
        cases[t0 | t1 << 1 | t2 << 2 | t3 << 3].forEach(stitch);
      }
      cases[t1 | t2 << 3].forEach(stitch);
    }

    // Special case for the last row (y = dy - 1, t0 = t1 = 0).
    x = -1;
    t2 = values[y * dx] >= value;
    cases[t2 << 2].forEach(stitch);
    while (++x < dx - 1) {
      t3 = t2, t2 = values[y * dx + x + 1] >= value;
      cases[t2 << 2 | t3 << 3].forEach(stitch);
    }
    cases[t2 << 3].forEach(stitch);

    function stitch(line) {
      var start = [line[0][0] + x, line[0][1] + y],
          end = [line[1][0] + x, line[1][1] + y],
          startIndex = index(start),
          endIndex = index(end),
          f, g;
      if (f = fragmentByEnd[startIndex]) {
        if (g = fragmentByStart[endIndex]) {
          delete fragmentByEnd[f.end];
          delete fragmentByStart[g.start];
          if (f === g) {
            f.ring.push(end);
            callback(f.ring);
          } else {
            fragmentByStart[f.start] = fragmentByEnd[g.end] = {start: f.start, end: g.end, ring: f.ring.concat(g.ring)};
          }
        } else {
          delete fragmentByEnd[f.end];
          f.ring.push(end);
          fragmentByEnd[f.end = endIndex] = f;
        }
      } else if (f = fragmentByStart[endIndex]) {
        if (g = fragmentByEnd[startIndex]) {
          delete fragmentByStart[f.start];
          delete fragmentByEnd[g.end];
          if (f === g) {
            f.ring.push(end);
            callback(f.ring);
          } else {
            fragmentByStart[g.start] = fragmentByEnd[f.end] = {start: g.start, end: f.end, ring: g.ring.concat(f.ring)};
          }
        } else {
          delete fragmentByStart[f.start];
          f.ring.unshift(start);
          fragmentByStart[f.start = startIndex] = f;
        }
      } else {
        fragmentByStart[startIndex] = fragmentByEnd[endIndex] = {start: startIndex, end: endIndex, ring: [start, end]};
      }
    }
  }

  function index(point) {
    return point[0] * 2 + point[1] * (dx + 1) * 4;
  }

  function smoothLinear(ring, values, value) {
    ring.forEach(function(point) {
      var x = point[0],
          y = point[1],
          xt = x | 0,
          yt = y | 0,
          v0,
          v1 = values[yt * dx + xt];
      if (x > 0 && x < dx && xt === x) {
        v0 = values[yt * dx + xt - 1];
        point[0] = x + (value - v0) / (v1 - v0) - 0.5;
      }
      if (y > 0 && y < dy && yt === y) {
        v0 = values[(yt - 1) * dx + xt];
        point[1] = y + (value - v0) / (v1 - v0) - 0.5;
      }
    });
  }

  contours.contour = contour;

  contours.size = function(_) {
    if (!arguments.length) return [dx, dy];
    var _0 = Math.floor(_[0]), _1 = Math.floor(_[1]);
    if (!(_0 >= 0 && _1 >= 0)) throw new Error("invalid size");
    return dx = _0, dy = _1, contours;
  };

  contours.thresholds = function(_) {
    return arguments.length ? (threshold = typeof _ === "function" ? _ : Array.isArray(_) ? constant$1(slice.call(_)) : constant$1(_), contours) : threshold;
  };

  contours.smooth = function(_) {
    return arguments.length ? (smooth = _ ? smoothLinear : noop, contours) : smooth === smoothLinear;
  };

  return contours;
}

function defaultX(d) {
  return d[0];
}

function defaultY(d) {
  return d[1];
}

function defaultWeight() {
  return 1;
}

function density() {
  var x = defaultX,
      y = defaultY,
      weight = defaultWeight,
      dx = 960,
      dy = 500,
      r = 20, // blur radius
      k = 2, // log2(grid cell size)
      o = r * 3, // grid offset, to pad for blur
      n = (dx + o * 2) >> k, // grid width
      m = (dy + o * 2) >> k, // grid height
      threshold = constant$1(20);

  function grid(data) {
    var values = new Float32Array(n * m),
        pow2k = Math.pow(2, -k),
        i = -1;

    for (const d of data) {
      var xi = (x(d, ++i, data) + o) * pow2k,
          yi = (y(d, i, data) + o) * pow2k,
          wi = +weight(d, i, data);
      if (xi >= 0 && xi < n && yi >= 0 && yi < m) {
        var x0 = Math.floor(xi),
            y0 = Math.floor(yi),
            xt = xi - x0 - 0.5,
            yt = yi - y0 - 0.5;
        values[x0 + y0 * n] += (1 - xt) * (1 - yt) * wi;
        values[x0 + 1 + y0 * n] += xt * (1 - yt) * wi;
        values[x0 + 1 + (y0 + 1) * n] += xt * yt * wi;
        values[x0 + (y0 + 1) * n] += (1 - xt) * yt * wi;
      }
    }

    blur2({data: values, width: n, height: m}, r * pow2k);
    return values;
  }

  function density(data) {
    var values = grid(data),
        tz = threshold(values),
        pow4k = Math.pow(2, 2 * k);

    // Convert number of thresholds into uniform thresholds.
    if (!Array.isArray(tz)) {
      tz = ticks(Number.MIN_VALUE, max(values) / pow4k, tz);
    }

    return Contours()
        .size([n, m])
        .thresholds(tz.map(d => d * pow4k))
      (values)
        .map((c, i) => (c.value = +tz[i], transform(c)));
  }

  density.contours = function(data) {
    var values = grid(data),
        contours = Contours().size([n, m]),
        pow4k = Math.pow(2, 2 * k),
        contour = value => {
          value = +value;
          var c = transform(contours.contour(values, value * pow4k));
          c.value = value; // preserve exact threshold value
          return c;
        };
    Object.defineProperty(contour, "max", {get: () => max(values) / pow4k});
    return contour;
  };

  function transform(geometry) {
    geometry.coordinates.forEach(transformPolygon);
    return geometry;
  }

  function transformPolygon(coordinates) {
    coordinates.forEach(transformRing);
  }

  function transformRing(coordinates) {
    coordinates.forEach(transformPoint);
  }

  // TODO Optimize.
  function transformPoint(coordinates) {
    coordinates[0] = coordinates[0] * Math.pow(2, k) - o;
    coordinates[1] = coordinates[1] * Math.pow(2, k) - o;
  }

  function resize() {
    o = r * 3;
    n = (dx + o * 2) >> k;
    m = (dy + o * 2) >> k;
    return density;
  }

  density.x = function(_) {
    return arguments.length ? (x = typeof _ === "function" ? _ : constant$1(+_), density) : x;
  };

  density.y = function(_) {
    return arguments.length ? (y = typeof _ === "function" ? _ : constant$1(+_), density) : y;
  };

  density.weight = function(_) {
    return arguments.length ? (weight = typeof _ === "function" ? _ : constant$1(+_), density) : weight;
  };

  density.size = function(_) {
    if (!arguments.length) return [dx, dy];
    var _0 = +_[0], _1 = +_[1];
    if (!(_0 >= 0 && _1 >= 0)) throw new Error("invalid size");
    return dx = _0, dy = _1, resize();
  };

  density.cellSize = function(_) {
    if (!arguments.length) return 1 << k;
    if (!((_ = +_) >= 1)) throw new Error("invalid cell size");
    return k = Math.floor(Math.log(_) / Math.LN2), resize();
  };

  density.thresholds = function(_) {
    return arguments.length ? (threshold = typeof _ === "function" ? _ : Array.isArray(_) ? constant$1(slice.call(_)) : constant$1(_), density) : threshold;
  };

  density.bandwidth = function(_) {
    if (!arguments.length) return Math.sqrt(r * (r + 1));
    if (!((_ = +_) >= 0)) throw new Error("invalid bandwidth");
    return r = (Math.sqrt(4 * _ * _ + 1) - 1) / 2, resize();
  };

  return density;
}

function autoType(object) {
  for (var key in object) {
    var value = object[key].trim(), number, m;
    if (!value) value = null;
    else if (value === "true") value = true;
    else if (value === "false") value = false;
    else if (value === "NaN") value = NaN;
    else if (!isNaN(number = +value)) value = number;
    else if (m = value.match(/^([-+]\d{2})?\d{4}(-\d{2}(-\d{2})?)?(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[-+]\d{2}:\d{2})?)?$/)) {
      if (fixtz && !!m[4] && !m[7]) value = value.replace(/-/g, "/").replace(/T/, " ");
      value = new Date(value);
    }
    else continue;
    object[key] = value;
  }
  return object;
}

// https://github.com/d3/d3-dsv/issues/45
const fixtz = new Date("2019-01-01T00:00").getHours() || new Date("2019-07-01T00:00").getHours();

function responseBlob(response) {
  if (!response.ok) throw new Error(response.status + " " + response.statusText);
  return response.blob();
}

function blob(input, init) {
  return fetch(input, init).then(responseBlob);
}

function responseArrayBuffer(response) {
  if (!response.ok) throw new Error(response.status + " " + response.statusText);
  return response.arrayBuffer();
}

function buffer(input, init) {
  return fetch(input, init).then(responseArrayBuffer);
}

function image(input, init) {
  return new Promise(function(resolve, reject) {
    var image = new Image;
    for (var key in init) image[key] = init[key];
    image.onerror = reject;
    image.onload = function() { resolve(image); };
    image.src = input;
  });
}

function responseJson(response) {
  if (!response.ok) throw new Error(response.status + " " + response.statusText);
  if (response.status === 204 || response.status === 205) return;
  return response.json();
}

function json(input, init) {
  return fetch(input, init).then(responseJson);
}

function parser(type) {
  return (input, init) => text(input, init)
    .then(text => (new DOMParser).parseFromString(text, type));
}

var xml = parser("application/xml");

var html = parser("text/html");

var svg = parser("image/svg+xml");

function radial$1(radius, x, y) {
  var nodes,
      strength = constant$3(0.1),
      strengths,
      radiuses;

  if (typeof radius !== "function") radius = constant$3(+radius);
  if (x == null) x = 0;
  if (y == null) y = 0;

  function force(alpha) {
    for (var i = 0, n = nodes.length; i < n; ++i) {
      var node = nodes[i],
          dx = node.x - x || 1e-6,
          dy = node.y - y || 1e-6,
          r = Math.sqrt(dx * dx + dy * dy),
          k = (radiuses[i] - r) * strengths[i] * alpha / r;
      node.vx += dx * k;
      node.vy += dy * k;
    }
  }

  function initialize() {
    if (!nodes) return;
    var i, n = nodes.length;
    strengths = new Array(n);
    radiuses = new Array(n);
    for (i = 0; i < n; ++i) {
      radiuses[i] = +radius(nodes[i], i, nodes);
      strengths[i] = isNaN(radiuses[i]) ? 0 : +strength(nodes[i], i, nodes);
    }
  }

  force.initialize = function(_) {
    nodes = _, initialize();
  };

  force.strength = function(_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant$3(+_), initialize(), force) : strength;
  };

  force.radius = function(_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : constant$3(+_), initialize(), force) : radius;
  };

  force.x = function(_) {
    return arguments.length ? (x = +_, force) : x;
  };

  force.y = function(_) {
    return arguments.length ? (y = +_, force) : y;
  };

  return force;
}

function extent() {
  var x0 = 0,
      y0 = 0,
      x1 = 960,
      y1 = 500,
      cache,
      cacheStream,
      clip;

  return clip = {
    stream: function(stream) {
      return cache && cacheStream === stream ? cache : cache = clipRectangle(x0, y0, x1, y1)(cacheStream = stream);
    },
    extent: function(_) {
      return arguments.length ? (x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1], cache = cacheStream = null, clip) : [[x0, y0], [x1, y1]];
    }
  };
}

var lengthSum,
    lambda0,
    sinPhi0,
    cosPhi0;

var lengthStream = {
  sphere: noop$1,
  point: noop$1,
  lineStart: lengthLineStart,
  lineEnd: noop$1,
  polygonStart: noop$1,
  polygonEnd: noop$1
};

function lengthLineStart() {
  lengthStream.point = lengthPointFirst;
  lengthStream.lineEnd = lengthLineEnd;
}

function lengthLineEnd() {
  lengthStream.point = lengthStream.lineEnd = noop$1;
}

function lengthPointFirst(lambda, phi) {
  lambda *= radians, phi *= radians;
  lambda0 = lambda, sinPhi0 = sin(phi), cosPhi0 = cos(phi);
  lengthStream.point = lengthPoint;
}

function lengthPoint(lambda, phi) {
  lambda *= radians, phi *= radians;
  var sinPhi = sin(phi),
      cosPhi = cos(phi),
      delta = abs(lambda - lambda0),
      cosDelta = cos(delta),
      sinDelta = sin(delta),
      x = cosPhi * sinDelta,
      y = cosPhi0 * sinPhi - sinPhi0 * cosPhi * cosDelta,
      z = sinPhi0 * sinPhi + cosPhi0 * cosPhi * cosDelta;
  lengthSum.add(atan2(sqrt(x * x + y * y), z));
  lambda0 = lambda, sinPhi0 = sinPhi, cosPhi0 = cosPhi;
}

function length$1(object) {
  lengthSum = new Adder();
  geoStream(object, lengthStream);
  return +lengthSum;
}

var coordinates = [null, null],
    object = {type: "LineString", coordinates: coordinates};

function distance(a, b) {
  coordinates[0] = a;
  coordinates[1] = b;
  return length$1(object);
}

var containsObjectType = {
  Feature: function(object, point) {
    return containsGeometry(object.geometry, point);
  },
  FeatureCollection: function(object, point) {
    var features = object.features, i = -1, n = features.length;
    while (++i < n) if (containsGeometry(features[i].geometry, point)) return true;
    return false;
  }
};

var containsGeometryType = {
  Sphere: function() {
    return true;
  },
  Point: function(object, point) {
    return containsPoint(object.coordinates, point);
  },
  MultiPoint: function(object, point) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) if (containsPoint(coordinates[i], point)) return true;
    return false;
  },
  LineString: function(object, point) {
    return containsLine(object.coordinates, point);
  },
  MultiLineString: function(object, point) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) if (containsLine(coordinates[i], point)) return true;
    return false;
  },
  Polygon: function(object, point) {
    return containsPolygon(object.coordinates, point);
  },
  MultiPolygon: function(object, point) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) if (containsPolygon(coordinates[i], point)) return true;
    return false;
  },
  GeometryCollection: function(object, point) {
    var geometries = object.geometries, i = -1, n = geometries.length;
    while (++i < n) if (containsGeometry(geometries[i], point)) return true;
    return false;
  }
};

function containsGeometry(geometry, point) {
  return geometry && containsGeometryType.hasOwnProperty(geometry.type)
      ? containsGeometryType[geometry.type](geometry, point)
      : false;
}

function containsPoint(coordinates, point) {
  return distance(coordinates, point) === 0;
}

function containsLine(coordinates, point) {
  var ao, bo, ab;
  for (var i = 0, n = coordinates.length; i < n; i++) {
    bo = distance(coordinates[i], point);
    if (bo === 0) return true;
    if (i > 0) {
      ab = distance(coordinates[i], coordinates[i - 1]);
      if (
        ab > 0 &&
        ao <= ab &&
        bo <= ab &&
        (ao + bo - ab) * (1 - Math.pow((ao - bo) / ab, 2)) < epsilon2 * ab
      )
        return true;
    }
    ao = bo;
  }
  return false;
}

function containsPolygon(coordinates, point) {
  return !!polygonContains(coordinates.map(ringRadians), pointRadians(point));
}

function ringRadians(ring) {
  return ring = ring.map(pointRadians), ring.pop(), ring;
}

function pointRadians(point) {
  return [point[0] * radians, point[1] * radians];
}

function contains$1(object, point) {
  return (object && containsObjectType.hasOwnProperty(object.type)
      ? containsObjectType[object.type]
      : containsGeometry)(object, point);
}

function interpolate(a, b) {
  var x0 = a[0] * radians,
      y0 = a[1] * radians,
      x1 = b[0] * radians,
      y1 = b[1] * radians,
      cy0 = cos(y0),
      sy0 = sin(y0),
      cy1 = cos(y1),
      sy1 = sin(y1),
      kx0 = cy0 * cos(x0),
      ky0 = cy0 * sin(x0),
      kx1 = cy1 * cos(x1),
      ky1 = cy1 * sin(x1),
      d = 2 * asin(sqrt(haversin(y1 - y0) + cy0 * cy1 * haversin(x1 - x0))),
      k = sin(d);

  var interpolate = d ? function(t) {
    var B = sin(t *= d) / k,
        A = sin(d - t) / k,
        x = A * kx0 + B * kx1,
        y = A * ky0 + B * ky1,
        z = A * sy0 + B * sy1;
    return [
      atan2(y, x) * degrees,
      atan2(z, sqrt(x * x + y * y)) * degrees
    ];
  } : function() {
    return [x0 * degrees, y0 * degrees];
  };

  interpolate.distance = d;

  return interpolate;
}

function area(polygon) {
  var i = -1,
      n = polygon.length,
      a,
      b = polygon[n - 1],
      area = 0;

  while (++i < n) {
    a = b;
    b = polygon[i];
    area += a[1] * b[0] - a[0] * b[1];
  }

  return area / 2;
}

function centroid$1(polygon) {
  var i = -1,
      n = polygon.length,
      x = 0,
      y = 0,
      a,
      b = polygon[n - 1],
      c,
      k = 0;

  while (++i < n) {
    a = b;
    b = polygon[i];
    k += c = a[0] * b[1] - b[0] * a[1];
    x += (a[0] + b[0]) * c;
    y += (a[1] + b[1]) * c;
  }

  return k *= 3, [x / k, y / k];
}

// Returns the 2D cross product of AB and AC vectors, i.e., the z-component of
// the 3D cross product in a quadrant I Cartesian coordinate system (+x is
// right, +y is up). Returns a positive value if ABC is counter-clockwise,
// negative if clockwise, and zero if the points are collinear.
function cross(a, b, c) {
  return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
}

function lexicographicOrder(a, b) {
  return a[0] - b[0] || a[1] - b[1];
}

// Computes the upper convex hull per the monotone chain algorithm.
// Assumes points.length >= 3, is sorted by x, unique in y.
// Returns an array of indices into points in left-to-right order.
function computeUpperHullIndexes(points) {
  const n = points.length,
      indexes = [0, 1];
  let size = 2, i;

  for (i = 2; i < n; ++i) {
    while (size > 1 && cross(points[indexes[size - 2]], points[indexes[size - 1]], points[i]) <= 0) --size;
    indexes[size++] = i;
  }

  return indexes.slice(0, size); // remove popped points
}

function hull(points) {
  if ((n = points.length) < 3) return null;

  var i,
      n,
      sortedPoints = new Array(n),
      flippedPoints = new Array(n);

  for (i = 0; i < n; ++i) sortedPoints[i] = [+points[i][0], +points[i][1], i];
  sortedPoints.sort(lexicographicOrder);
  for (i = 0; i < n; ++i) flippedPoints[i] = [sortedPoints[i][0], -sortedPoints[i][1]];

  var upperIndexes = computeUpperHullIndexes(sortedPoints),
      lowerIndexes = computeUpperHullIndexes(flippedPoints);

  // Construct the hull polygon, removing possible duplicate endpoints.
  var skipLeft = lowerIndexes[0] === upperIndexes[0],
      skipRight = lowerIndexes[lowerIndexes.length - 1] === upperIndexes[upperIndexes.length - 1],
      hull = [];

  // Add upper hull in right-to-l order.
  // Then add lower hull in left-to-right order.
  for (i = upperIndexes.length - 1; i >= 0; --i) hull.push(points[sortedPoints[upperIndexes[i]][2]]);
  for (i = +skipLeft; i < lowerIndexes.length - skipRight; ++i) hull.push(points[sortedPoints[lowerIndexes[i]][2]]);

  return hull;
}

function contains(polygon, point) {
  var n = polygon.length,
      p = polygon[n - 1],
      x = point[0], y = point[1],
      x0 = p[0], y0 = p[1],
      x1, y1,
      inside = false;

  for (var i = 0; i < n; ++i) {
    p = polygon[i], x1 = p[0], y1 = p[1];
    if (((y1 > y) !== (y0 > y)) && (x < (x0 - x1) * (y - y1) / (y0 - y1) + x1)) inside = !inside;
    x0 = x1, y0 = y1;
  }

  return inside;
}

function length(polygon) {
  var i = -1,
      n = polygon.length,
      b = polygon[n - 1],
      xa,
      ya,
      xb = b[0],
      yb = b[1],
      perimeter = 0;

  while (++i < n) {
    xa = xb;
    ya = yb;
    b = polygon[i];
    xb = b[0];
    yb = b[1];
    xa -= xb;
    ya -= yb;
    perimeter += Math.hypot(xa, ya);
  }

  return perimeter;
}

var defaultSource = Math.random;

var uniform = (function sourceRandomUniform(source) {
  function randomUniform(min, max) {
    min = min == null ? 0 : +min;
    max = max == null ? 1 : +max;
    if (arguments.length === 1) max = min, min = 0;
    else max -= min;
    return function() {
      return source() * max + min;
    };
  }

  randomUniform.source = sourceRandomUniform;

  return randomUniform;
})(defaultSource);

var int = (function sourceRandomInt(source) {
  function randomInt(min, max) {
    if (arguments.length < 2) max = min, min = 0;
    min = Math.floor(min);
    max = Math.floor(max) - min;
    return function() {
      return Math.floor(source() * max + min);
    };
  }

  randomInt.source = sourceRandomInt;

  return randomInt;
})(defaultSource);

var normal = (function sourceRandomNormal(source) {
  function randomNormal(mu, sigma) {
    var x, r;
    mu = mu == null ? 0 : +mu;
    sigma = sigma == null ? 1 : +sigma;
    return function() {
      var y;

      // If available, use the second previously-generated uniform random.
      if (x != null) y = x, x = null;

      // Otherwise, generate a new x and y.
      else do {
        x = source() * 2 - 1;
        y = source() * 2 - 1;
        r = x * x + y * y;
      } while (!r || r > 1);

      return mu + sigma * y * Math.sqrt(-2 * Math.log(r) / r);
    };
  }

  randomNormal.source = sourceRandomNormal;

  return randomNormal;
})(defaultSource);

var logNormal = (function sourceRandomLogNormal(source) {
  var N = normal.source(source);

  function randomLogNormal() {
    var randomNormal = N.apply(this, arguments);
    return function() {
      return Math.exp(randomNormal());
    };
  }

  randomLogNormal.source = sourceRandomLogNormal;

  return randomLogNormal;
})(defaultSource);

var irwinHall = (function sourceRandomIrwinHall(source) {
  function randomIrwinHall(n) {
    if ((n = +n) <= 0) return () => 0;
    return function() {
      for (var sum = 0, i = n; i > 1; --i) sum += source();
      return sum + i * source();
    };
  }

  randomIrwinHall.source = sourceRandomIrwinHall;

  return randomIrwinHall;
})(defaultSource);

var bates = (function sourceRandomBates(source) {
  var I = irwinHall.source(source);

  function randomBates(n) {
    // use limiting distribution at n === 0
    if ((n = +n) === 0) return source;
    var randomIrwinHall = I(n);
    return function() {
      return randomIrwinHall() / n;
    };
  }

  randomBates.source = sourceRandomBates;

  return randomBates;
})(defaultSource);

var exponential = (function sourceRandomExponential(source) {
  function randomExponential(lambda) {
    return function() {
      return -Math.log1p(-source()) / lambda;
    };
  }

  randomExponential.source = sourceRandomExponential;

  return randomExponential;
})(defaultSource);

var pareto = (function sourceRandomPareto(source) {
  function randomPareto(alpha) {
    if ((alpha = +alpha) < 0) throw new RangeError("invalid alpha");
    alpha = 1 / -alpha;
    return function() {
      return Math.pow(1 - source(), alpha);
    };
  }

  randomPareto.source = sourceRandomPareto;

  return randomPareto;
})(defaultSource);

var bernoulli = (function sourceRandomBernoulli(source) {
  function randomBernoulli(p) {
    if ((p = +p) < 0 || p > 1) throw new RangeError("invalid p");
    return function() {
      return Math.floor(source() + p);
    };
  }

  randomBernoulli.source = sourceRandomBernoulli;

  return randomBernoulli;
})(defaultSource);

var geometric = (function sourceRandomGeometric(source) {
  function randomGeometric(p) {
    if ((p = +p) < 0 || p > 1) throw new RangeError("invalid p");
    if (p === 0) return () => Infinity;
    if (p === 1) return () => 1;
    p = Math.log1p(-p);
    return function() {
      return 1 + Math.floor(Math.log1p(-source()) / p);
    };
  }

  randomGeometric.source = sourceRandomGeometric;

  return randomGeometric;
})(defaultSource);

var gamma = (function sourceRandomGamma(source) {
  var randomNormal = normal.source(source)();

  function randomGamma(k, theta) {
    if ((k = +k) < 0) throw new RangeError("invalid k");
    // degenerate distribution if k === 0
    if (k === 0) return () => 0;
    theta = theta == null ? 1 : +theta;
    // exponential distribution if k === 1
    if (k === 1) return () => -Math.log1p(-source()) * theta;

    var d = (k < 1 ? k + 1 : k) - 1 / 3,
        c = 1 / (3 * Math.sqrt(d)),
        multiplier = k < 1 ? () => Math.pow(source(), 1 / k) : () => 1;
    return function() {
      do {
        do {
          var x = randomNormal(),
              v = 1 + c * x;
        } while (v <= 0);
        v *= v * v;
        var u = 1 - source();
      } while (u >= 1 - 0.0331 * x * x * x * x && Math.log(u) >= 0.5 * x * x + d * (1 - v + Math.log(v)));
      return d * v * multiplier() * theta;
    };
  }

  randomGamma.source = sourceRandomGamma;

  return randomGamma;
})(defaultSource);

var beta = (function sourceRandomBeta(source) {
  var G = gamma.source(source);

  function randomBeta(alpha, beta) {
    var X = G(alpha),
        Y = G(beta);
    return function() {
      var x = X();
      return x === 0 ? 0 : x / (x + Y());
    };
  }

  randomBeta.source = sourceRandomBeta;

  return randomBeta;
})(defaultSource);

var binomial = (function sourceRandomBinomial(source) {
  var G = geometric.source(source),
      B = beta.source(source);

  function randomBinomial(n, p) {
    n = +n;
    if ((p = +p) >= 1) return () => n;
    if (p <= 0) return () => 0;
    return function() {
      var acc = 0, nn = n, pp = p;
      while (nn * pp > 16 && nn * (1 - pp) > 16) {
        var i = Math.floor((nn + 1) * pp),
            y = B(i, nn - i + 1)();
        if (y <= pp) {
          acc += i;
          nn -= i;
          pp = (pp - y) / (1 - y);
        } else {
          nn = i - 1;
          pp /= y;
        }
      }
      var sign = pp < 0.5,
          pFinal = sign ? pp : 1 - pp,
          g = G(pFinal);
      for (var s = g(), k = 0; s <= nn; ++k) s += g();
      return acc + (sign ? k : nn - k);
    };
  }

  randomBinomial.source = sourceRandomBinomial;

  return randomBinomial;
})(defaultSource);

var weibull = (function sourceRandomWeibull(source) {
  function randomWeibull(k, a, b) {
    var outerFunc;
    if ((k = +k) === 0) {
      outerFunc = x => -Math.log(x);
    } else {
      k = 1 / k;
      outerFunc = x => Math.pow(x, k);
    }
    a = a == null ? 0 : +a;
    b = b == null ? 1 : +b;
    return function() {
      return a + b * outerFunc(-Math.log1p(-source()));
    };
  }

  randomWeibull.source = sourceRandomWeibull;

  return randomWeibull;
})(defaultSource);

var cauchy = (function sourceRandomCauchy(source) {
  function randomCauchy(a, b) {
    a = a == null ? 0 : +a;
    b = b == null ? 1 : +b;
    return function() {
      return a + b * Math.tan(Math.PI * source());
    };
  }

  randomCauchy.source = sourceRandomCauchy;

  return randomCauchy;
})(defaultSource);

var logistic = (function sourceRandomLogistic(source) {
  function randomLogistic(a, b) {
    a = a == null ? 0 : +a;
    b = b == null ? 1 : +b;
    return function() {
      var u = source();
      return a + b * Math.log(u / (1 - u));
    };
  }

  randomLogistic.source = sourceRandomLogistic;

  return randomLogistic;
})(defaultSource);

var poisson = (function sourceRandomPoisson(source) {
  var G = gamma.source(source),
      B = binomial.source(source);

  function randomPoisson(lambda) {
    return function() {
      var acc = 0, l = lambda;
      while (l > 16) {
        var n = Math.floor(0.875 * l),
            t = G(n)();
        if (t > l) return acc + B(n - 1, l / t)();
        acc += n;
        l -= t;
      }
      for (var s = -Math.log1p(-source()), k = 0; s <= l; ++k) s -= Math.log1p(-source());
      return acc + k;
    };
  }

  randomPoisson.source = sourceRandomPoisson;

  return randomPoisson;
})(defaultSource);

// https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use
const mul = 0x19660D;
const inc = 0x3C6EF35F;
const eps = 1 / 0x100000000;

function lcg(seed = Math.random()) {
  let state = (0 <= seed && seed < 1 ? seed / eps : Math.abs(seed)) | 0;
  return () => (state = mul * state + inc | 0, eps * (state >>> 0));
}

function square(x) {
  return Math.sign(x) * x * x;
}

function unsquare(x) {
  return Math.sign(x) * Math.sqrt(Math.abs(x));
}

function radial() {
  var squared = continuous(),
      range = [0, 1],
      round = false,
      unknown;

  function scale(x) {
    var y = unsquare(squared(x));
    return isNaN(y) ? unknown : round ? Math.round(y) : y;
  }

  scale.invert = function(y) {
    return squared.invert(square(y));
  };

  scale.domain = function(_) {
    return arguments.length ? (squared.domain(_), scale) : squared.domain();
  };

  scale.range = function(_) {
    return arguments.length ? (squared.range((range = Array.from(_, number)).map(square)), scale) : range.slice();
  };

  scale.rangeRound = function(_) {
    return scale.range(_).round(true);
  };

  scale.round = function(_) {
    return arguments.length ? (round = !!_, scale) : round;
  };

  scale.clamp = function(_) {
    return arguments.length ? (squared.clamp(_), scale) : squared.clamp();
  };

  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  scale.copy = function() {
    return radial(squared.domain(), range)
        .round(round)
        .clamp(squared.clamp())
        .unknown(unknown);
  };

  initRange.apply(scale, arguments);

  return linearish(scale);
}

var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

function formatIsoNative(date) {
  return date.toISOString();
}

var formatIso = Date.prototype.toISOString
    ? formatIsoNative
    : utcFormat(isoSpecifier);

var formatIso$1 = formatIso;

function parseIsoNative(string) {
  var date = new Date(string);
  return isNaN(date) ? null : date;
}

var parseIso = +new Date("2000-01-01T00:00:00.000Z")
    ? parseIsoNative
    : utcParse(isoSpecifier);

var parseIso$1 = parseIso;

function sequentialQuantile() {
  var domain = [],
      interpolator = identity$2;

  function scale(x) {
    if (x != null && !isNaN(x = +x)) return interpolator((bisect(domain, x, 1) - 1) / (domain.length - 1));
  }

  scale.domain = function(_) {
    if (!arguments.length) return domain.slice();
    domain = [];
    for (let d of _) if (d != null && !isNaN(d = +d)) domain.push(d);
    domain.sort(ascending$2);
    return scale;
  };

  scale.interpolator = function(_) {
    return arguments.length ? (interpolator = _, scale) : interpolator;
  };

  scale.range = function() {
    return domain.map((d, i) => interpolator(i / (domain.length - 1)));
  };

  scale.quantiles = function(n) {
    return Array.from({length: n + 1}, (_, i) => quantile(domain, i / n));
  };

  scale.copy = function() {
    return sequentialQuantile(interpolator).domain(domain);
  };

  return initInterpolator.apply(scale, arguments);
}

function colors(specifier) {
  var n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
  while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
  return colors;
}

var category10 = colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

var Accent = colors("7fc97fbeaed4fdc086ffff99386cb0f0027fbf5b17666666");

var Dark2 = colors("1b9e77d95f027570b3e7298a66a61ee6ab02a6761d666666");

var Paired = colors("a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928");

var Pastel1 = colors("fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2");

var Pastel2 = colors("b3e2cdfdcdaccbd5e8f4cae4e6f5c9fff2aef1e2cccccccc");

var Set1 = colors("e41a1c377eb84daf4a984ea3ff7f00ffff33a65628f781bf999999");

var Set2 = colors("66c2a5fc8d628da0cbe78ac3a6d854ffd92fe5c494b3b3b3");

var Set3 = colors("8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f");

var Tableau10 = colors("4e79a7f28e2ce1575976b7b259a14fedc949af7aa1ff9da79c755fbab0ab");

var ramp$1 = scheme => rgbBasis(scheme[scheme.length - 1]);

var scheme$q = new Array(3).concat(
  "d8b365f5f5f55ab4ac",
  "a6611adfc27d80cdc1018571",
  "a6611adfc27df5f5f580cdc1018571",
  "8c510ad8b365f6e8c3c7eae55ab4ac01665e",
  "8c510ad8b365f6e8c3f5f5f5c7eae55ab4ac01665e",
  "8c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e",
  "8c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e",
  "5430058c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e003c30",
  "5430058c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e003c30"
).map(colors);

var BrBG = ramp$1(scheme$q);

var scheme$p = new Array(3).concat(
  "af8dc3f7f7f77fbf7b",
  "7b3294c2a5cfa6dba0008837",
  "7b3294c2a5cff7f7f7a6dba0008837",
  "762a83af8dc3e7d4e8d9f0d37fbf7b1b7837",
  "762a83af8dc3e7d4e8f7f7f7d9f0d37fbf7b1b7837",
  "762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b7837",
  "762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b7837",
  "40004b762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b783700441b",
  "40004b762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b783700441b"
).map(colors);

var PRGn = ramp$1(scheme$p);

var scheme$o = new Array(3).concat(
  "e9a3c9f7f7f7a1d76a",
  "d01c8bf1b6dab8e1864dac26",
  "d01c8bf1b6daf7f7f7b8e1864dac26",
  "c51b7de9a3c9fde0efe6f5d0a1d76a4d9221",
  "c51b7de9a3c9fde0eff7f7f7e6f5d0a1d76a4d9221",
  "c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221",
  "c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221",
  "8e0152c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221276419",
  "8e0152c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221276419"
).map(colors);

var PiYG = ramp$1(scheme$o);

var scheme$n = new Array(3).concat(
  "998ec3f7f7f7f1a340",
  "5e3c99b2abd2fdb863e66101",
  "5e3c99b2abd2f7f7f7fdb863e66101",
  "542788998ec3d8daebfee0b6f1a340b35806",
  "542788998ec3d8daebf7f7f7fee0b6f1a340b35806",
  "5427888073acb2abd2d8daebfee0b6fdb863e08214b35806",
  "5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b35806",
  "2d004b5427888073acb2abd2d8daebfee0b6fdb863e08214b358067f3b08",
  "2d004b5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b358067f3b08"
).map(colors);

var PuOr = ramp$1(scheme$n);

var scheme$m = new Array(3).concat(
  "ef8a62f7f7f767a9cf",
  "ca0020f4a58292c5de0571b0",
  "ca0020f4a582f7f7f792c5de0571b0",
  "b2182bef8a62fddbc7d1e5f067a9cf2166ac",
  "b2182bef8a62fddbc7f7f7f7d1e5f067a9cf2166ac",
  "b2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac",
  "b2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac",
  "67001fb2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac053061",
  "67001fb2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac053061"
).map(colors);

var RdBu = ramp$1(scheme$m);

var scheme$l = new Array(3).concat(
  "ef8a62ffffff999999",
  "ca0020f4a582bababa404040",
  "ca0020f4a582ffffffbababa404040",
  "b2182bef8a62fddbc7e0e0e09999994d4d4d",
  "b2182bef8a62fddbc7ffffffe0e0e09999994d4d4d",
  "b2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d",
  "b2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d",
  "67001fb2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d1a1a1a",
  "67001fb2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d1a1a1a"
).map(colors);

var RdGy = ramp$1(scheme$l);

var scheme$k = new Array(3).concat(
  "fc8d59ffffbf91bfdb",
  "d7191cfdae61abd9e92c7bb6",
  "d7191cfdae61ffffbfabd9e92c7bb6",
  "d73027fc8d59fee090e0f3f891bfdb4575b4",
  "d73027fc8d59fee090ffffbfe0f3f891bfdb4575b4",
  "d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4",
  "d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4",
  "a50026d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4313695",
  "a50026d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4313695"
).map(colors);

var RdYlBu = ramp$1(scheme$k);

var scheme$j = new Array(3).concat(
  "fc8d59ffffbf91cf60",
  "d7191cfdae61a6d96a1a9641",
  "d7191cfdae61ffffbfa6d96a1a9641",
  "d73027fc8d59fee08bd9ef8b91cf601a9850",
  "d73027fc8d59fee08bffffbfd9ef8b91cf601a9850",
  "d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850",
  "d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850",
  "a50026d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850006837",
  "a50026d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850006837"
).map(colors);

var RdYlGn = ramp$1(scheme$j);

var scheme$i = new Array(3).concat(
  "fc8d59ffffbf99d594",
  "d7191cfdae61abdda42b83ba",
  "d7191cfdae61ffffbfabdda42b83ba",
  "d53e4ffc8d59fee08be6f59899d5943288bd",
  "d53e4ffc8d59fee08bffffbfe6f59899d5943288bd",
  "d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd",
  "d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd",
  "9e0142d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd5e4fa2",
  "9e0142d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd5e4fa2"
).map(colors);

var Spectral = ramp$1(scheme$i);

var scheme$h = new Array(3).concat(
  "e5f5f999d8c92ca25f",
  "edf8fbb2e2e266c2a4238b45",
  "edf8fbb2e2e266c2a42ca25f006d2c",
  "edf8fbccece699d8c966c2a42ca25f006d2c",
  "edf8fbccece699d8c966c2a441ae76238b45005824",
  "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45005824",
  "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45006d2c00441b"
).map(colors);

var BuGn = ramp$1(scheme$h);

var scheme$g = new Array(3).concat(
  "e0ecf49ebcda8856a7",
  "edf8fbb3cde38c96c688419d",
  "edf8fbb3cde38c96c68856a7810f7c",
  "edf8fbbfd3e69ebcda8c96c68856a7810f7c",
  "edf8fbbfd3e69ebcda8c96c68c6bb188419d6e016b",
  "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d6e016b",
  "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d810f7c4d004b"
).map(colors);

var BuPu = ramp$1(scheme$g);

var scheme$f = new Array(3).concat(
  "e0f3dba8ddb543a2ca",
  "f0f9e8bae4bc7bccc42b8cbe",
  "f0f9e8bae4bc7bccc443a2ca0868ac",
  "f0f9e8ccebc5a8ddb57bccc443a2ca0868ac",
  "f0f9e8ccebc5a8ddb57bccc44eb3d32b8cbe08589e",
  "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe08589e",
  "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe0868ac084081"
).map(colors);

var GnBu = ramp$1(scheme$f);

var scheme$e = new Array(3).concat(
  "fee8c8fdbb84e34a33",
  "fef0d9fdcc8afc8d59d7301f",
  "fef0d9fdcc8afc8d59e34a33b30000",
  "fef0d9fdd49efdbb84fc8d59e34a33b30000",
  "fef0d9fdd49efdbb84fc8d59ef6548d7301f990000",
  "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301f990000",
  "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301fb300007f0000"
).map(colors);

var OrRd = ramp$1(scheme$e);

var scheme$d = new Array(3).concat(
  "ece2f0a6bddb1c9099",
  "f6eff7bdc9e167a9cf02818a",
  "f6eff7bdc9e167a9cf1c9099016c59",
  "f6eff7d0d1e6a6bddb67a9cf1c9099016c59",
  "f6eff7d0d1e6a6bddb67a9cf3690c002818a016450",
  "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016450",
  "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016c59014636"
).map(colors);

var PuBuGn = ramp$1(scheme$d);

var scheme$c = new Array(3).concat(
  "ece7f2a6bddb2b8cbe",
  "f1eef6bdc9e174a9cf0570b0",
  "f1eef6bdc9e174a9cf2b8cbe045a8d",
  "f1eef6d0d1e6a6bddb74a9cf2b8cbe045a8d",
  "f1eef6d0d1e6a6bddb74a9cf3690c00570b0034e7b",
  "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0034e7b",
  "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0045a8d023858"
).map(colors);

var PuBu = ramp$1(scheme$c);

var scheme$b = new Array(3).concat(
  "e7e1efc994c7dd1c77",
  "f1eef6d7b5d8df65b0ce1256",
  "f1eef6d7b5d8df65b0dd1c77980043",
  "f1eef6d4b9dac994c7df65b0dd1c77980043",
  "f1eef6d4b9dac994c7df65b0e7298ace125691003f",
  "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125691003f",
  "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125698004367001f"
).map(colors);

var PuRd = ramp$1(scheme$b);

var scheme$a = new Array(3).concat(
  "fde0ddfa9fb5c51b8a",
  "feebe2fbb4b9f768a1ae017e",
  "feebe2fbb4b9f768a1c51b8a7a0177",
  "feebe2fcc5c0fa9fb5f768a1c51b8a7a0177",
  "feebe2fcc5c0fa9fb5f768a1dd3497ae017e7a0177",
  "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a0177",
  "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a017749006a"
).map(colors);

var RdPu = ramp$1(scheme$a);

var scheme$9 = new Array(3).concat(
  "edf8b17fcdbb2c7fb8",
  "ffffcca1dab441b6c4225ea8",
  "ffffcca1dab441b6c42c7fb8253494",
  "ffffccc7e9b47fcdbb41b6c42c7fb8253494",
  "ffffccc7e9b47fcdbb41b6c41d91c0225ea80c2c84",
  "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea80c2c84",
  "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea8253494081d58"
).map(colors);

var YlGnBu = ramp$1(scheme$9);

var scheme$8 = new Array(3).concat(
  "f7fcb9addd8e31a354",
  "ffffccc2e69978c679238443",
  "ffffccc2e69978c67931a354006837",
  "ffffccd9f0a3addd8e78c67931a354006837",
  "ffffccd9f0a3addd8e78c67941ab5d238443005a32",
  "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443005a32",
  "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443006837004529"
).map(colors);

var YlGn = ramp$1(scheme$8);

var scheme$7 = new Array(3).concat(
  "fff7bcfec44fd95f0e",
  "ffffd4fed98efe9929cc4c02",
  "ffffd4fed98efe9929d95f0e993404",
  "ffffd4fee391fec44ffe9929d95f0e993404",
  "ffffd4fee391fec44ffe9929ec7014cc4c028c2d04",
  "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c028c2d04",
  "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c02993404662506"
).map(colors);

var YlOrBr = ramp$1(scheme$7);

var scheme$6 = new Array(3).concat(
  "ffeda0feb24cf03b20",
  "ffffb2fecc5cfd8d3ce31a1c",
  "ffffb2fecc5cfd8d3cf03b20bd0026",
  "ffffb2fed976feb24cfd8d3cf03b20bd0026",
  "ffffb2fed976feb24cfd8d3cfc4e2ae31a1cb10026",
  "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cb10026",
  "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cbd0026800026"
).map(colors);

var YlOrRd = ramp$1(scheme$6);

var scheme$5 = new Array(3).concat(
  "deebf79ecae13182bd",
  "eff3ffbdd7e76baed62171b5",
  "eff3ffbdd7e76baed63182bd08519c",
  "eff3ffc6dbef9ecae16baed63182bd08519c",
  "eff3ffc6dbef9ecae16baed64292c62171b5084594",
  "f7fbffdeebf7c6dbef9ecae16baed64292c62171b5084594",
  "f7fbffdeebf7c6dbef9ecae16baed64292c62171b508519c08306b"
).map(colors);

var Blues = ramp$1(scheme$5);

var scheme$4 = new Array(3).concat(
  "e5f5e0a1d99b31a354",
  "edf8e9bae4b374c476238b45",
  "edf8e9bae4b374c47631a354006d2c",
  "edf8e9c7e9c0a1d99b74c47631a354006d2c",
  "edf8e9c7e9c0a1d99b74c47641ab5d238b45005a32",
  "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45005a32",
  "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45006d2c00441b"
).map(colors);

var Greens = ramp$1(scheme$4);

var scheme$3 = new Array(3).concat(
  "f0f0f0bdbdbd636363",
  "f7f7f7cccccc969696525252",
  "f7f7f7cccccc969696636363252525",
  "f7f7f7d9d9d9bdbdbd969696636363252525",
  "f7f7f7d9d9d9bdbdbd969696737373525252252525",
  "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525",
  "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525000000"
).map(colors);

var Greys = ramp$1(scheme$3);

var scheme$2 = new Array(3).concat(
  "efedf5bcbddc756bb1",
  "f2f0f7cbc9e29e9ac86a51a3",
  "f2f0f7cbc9e29e9ac8756bb154278f",
  "f2f0f7dadaebbcbddc9e9ac8756bb154278f",
  "f2f0f7dadaebbcbddc9e9ac8807dba6a51a34a1486",
  "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a34a1486",
  "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a354278f3f007d"
).map(colors);

var Purples = ramp$1(scheme$2);

var scheme$1 = new Array(3).concat(
  "fee0d2fc9272de2d26",
  "fee5d9fcae91fb6a4acb181d",
  "fee5d9fcae91fb6a4ade2d26a50f15",
  "fee5d9fcbba1fc9272fb6a4ade2d26a50f15",
  "fee5d9fcbba1fc9272fb6a4aef3b2ccb181d99000d",
  "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181d99000d",
  "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181da50f1567000d"
).map(colors);

var Reds = ramp$1(scheme$1);

var scheme = new Array(3).concat(
  "fee6cefdae6be6550d",
  "feeddefdbe85fd8d3cd94701",
  "feeddefdbe85fd8d3ce6550da63603",
  "feeddefdd0a2fdae6bfd8d3ce6550da63603",
  "feeddefdd0a2fdae6bfd8d3cf16913d948018c2d04",
  "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d948018c2d04",
  "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d94801a636037f2704"
).map(colors);

var Oranges = ramp$1(scheme);

function cividis(t) {
  t = Math.max(0, Math.min(1, t));
  return "rgb("
      + Math.max(0, Math.min(255, Math.round(-4.54 - t * (35.34 - t * (2381.73 - t * (6402.7 - t * (7024.72 - t * 2710.57))))))) + ", "
      + Math.max(0, Math.min(255, Math.round(32.49 + t * (170.73 + t * (52.82 - t * (131.46 - t * (176.58 - t * 67.37))))))) + ", "
      + Math.max(0, Math.min(255, Math.round(81.24 + t * (442.36 - t * (2482.43 - t * (6167.24 - t * (6614.94 - t * 2475.67)))))))
      + ")";
}

var cubehelix = cubehelixLong(cubehelix$1(300, 0.5, 0.0), cubehelix$1(-240, 0.5, 1.0));

var warm = cubehelixLong(cubehelix$1(-100, 0.75, 0.35), cubehelix$1(80, 1.50, 0.8));

var cool = cubehelixLong(cubehelix$1(260, 0.75, 0.35), cubehelix$1(80, 1.50, 0.8));

var c$1 = cubehelix$1();

function rainbow(t) {
  if (t < 0 || t > 1) t -= Math.floor(t);
  var ts = Math.abs(t - 0.5);
  c$1.h = 360 * t - 100;
  c$1.s = 1.5 - 1.5 * ts;
  c$1.l = 0.8 - 0.9 * ts;
  return c$1 + "";
}

var c = rgb(),
    pi_1_3 = Math.PI / 3,
    pi_2_3 = Math.PI * 2 / 3;

function sinebow(t) {
  var x;
  t = (0.5 - t) * Math.PI;
  c.r = 255 * (x = Math.sin(t)) * x;
  c.g = 255 * (x = Math.sin(t + pi_1_3)) * x;
  c.b = 255 * (x = Math.sin(t + pi_2_3)) * x;
  return c + "";
}

function turbo(t) {
  t = Math.max(0, Math.min(1, t));
  return "rgb("
      + Math.max(0, Math.min(255, Math.round(34.61 + t * (1172.33 - t * (10793.56 - t * (33300.12 - t * (38394.49 - t * 14825.05))))))) + ", "
      + Math.max(0, Math.min(255, Math.round(23.31 + t * (557.33 + t * (1225.33 - t * (3574.96 - t * (1073.77 + t * 707.56))))))) + ", "
      + Math.max(0, Math.min(255, Math.round(27.2 + t * (3211.1 - t * (15327.97 - t * (27814 - t * (22569.18 - t * 6838.66)))))))
      + ")";
}

function ramp(range) {
  var n = range.length;
  return function(t) {
    return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
  };
}

var viridis = ramp(colors("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));

var magma = ramp(colors("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));

var inferno = ramp(colors("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));

var plasma = ramp(colors("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));

function descending$1(a, b) {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}

function identity(d) {
  return d;
}

function pie() {
  var value = identity,
      sortValues = descending$1,
      sort = null,
      startAngle = constant$4(0),
      endAngle = constant$4(tau$1),
      padAngle = constant$4(0);

  function pie(data) {
    var i,
        n = (data = array$3(data)).length,
        j,
        k,
        sum = 0,
        index = new Array(n),
        arcs = new Array(n),
        a0 = +startAngle.apply(this, arguments),
        da = Math.min(tau$1, Math.max(-tau$1, endAngle.apply(this, arguments) - a0)),
        a1,
        p = Math.min(Math.abs(da) / n, padAngle.apply(this, arguments)),
        pa = p * (da < 0 ? -1 : 1),
        v;

    for (i = 0; i < n; ++i) {
      if ((v = arcs[index[i] = i] = +value(data[i], i, data)) > 0) {
        sum += v;
      }
    }

    // Optionally sort the arcs by previously-computed values or by data.
    if (sortValues != null) index.sort(function(i, j) { return sortValues(arcs[i], arcs[j]); });
    else if (sort != null) index.sort(function(i, j) { return sort(data[i], data[j]); });

    // Compute the arcs! They are stored in the original data's order.
    for (i = 0, k = sum ? (da - n * pa) / sum : 0; i < n; ++i, a0 = a1) {
      j = index[i], v = arcs[j], a1 = a0 + (v > 0 ? v * k : 0) + pa, arcs[j] = {
        data: data[j],
        index: i,
        value: v,
        startAngle: a0,
        endAngle: a1,
        padAngle: p
      };
    }

    return arcs;
  }

  pie.value = function(_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : constant$4(+_), pie) : value;
  };

  pie.sortValues = function(_) {
    return arguments.length ? (sortValues = _, sort = null, pie) : sortValues;
  };

  pie.sort = function(_) {
    return arguments.length ? (sort = _, sortValues = null, pie) : sort;
  };

  pie.startAngle = function(_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$4(+_), pie) : startAngle;
  };

  pie.endAngle = function(_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$4(+_), pie) : endAngle;
  };

  pie.padAngle = function(_) {
    return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant$4(+_), pie) : padAngle;
  };

  return pie;
}

var curveRadialLinear = curveRadial(curveLinear);

function Radial(curve) {
  this._curve = curve;
}

Radial.prototype = {
  areaStart: function() {
    this._curve.areaStart();
  },
  areaEnd: function() {
    this._curve.areaEnd();
  },
  lineStart: function() {
    this._curve.lineStart();
  },
  lineEnd: function() {
    this._curve.lineEnd();
  },
  point: function(a, r) {
    this._curve.point(r * Math.sin(a), r * -Math.cos(a));
  }
};

function curveRadial(curve) {

  function radial(context) {
    return new Radial(curve(context));
  }

  radial._curve = curve;

  return radial;
}

function lineRadial(l) {
  var c = l.curve;

  l.angle = l.x, delete l.x;
  l.radius = l.y, delete l.y;

  l.curve = function(_) {
    return arguments.length ? c(curveRadial(_)) : c()._curve;
  };

  return l;
}

function lineRadial$1() {
  return lineRadial(line$2().curve(curveRadialLinear));
}

function areaRadial() {
  var a = area$2().curve(curveRadialLinear),
      c = a.curve,
      x0 = a.lineX0,
      x1 = a.lineX1,
      y0 = a.lineY0,
      y1 = a.lineY1;

  a.angle = a.x, delete a.x;
  a.startAngle = a.x0, delete a.x0;
  a.endAngle = a.x1, delete a.x1;
  a.radius = a.y, delete a.y;
  a.innerRadius = a.y0, delete a.y0;
  a.outerRadius = a.y1, delete a.y1;
  a.lineStartAngle = function() { return lineRadial(x0()); }, delete a.lineX0;
  a.lineEndAngle = function() { return lineRadial(x1()); }, delete a.lineX1;
  a.lineInnerRadius = function() { return lineRadial(y0()); }, delete a.lineY0;
  a.lineOuterRadius = function() { return lineRadial(y1()); }, delete a.lineY1;

  a.curve = function(_) {
    return arguments.length ? c(curveRadial(_)) : c()._curve;
  };

  return a;
}

function expand(series, order) {
  if (!((n = series.length) > 0)) return;
  for (var i, n, j = 0, m = series[0].length, y; j < m; ++j) {
    for (y = i = 0; i < n; ++i) y += series[i][j][1] || 0;
    if (y) for (i = 0; i < n; ++i) series[i][j][1] /= y;
  }
  none(series, order);
}

function diverging(series, order) {
  if (!((n = series.length) > 0)) return;
  for (var i, j = 0, d, dy, yp, yn, n, m = series[order[0]].length; j < m; ++j) {
    for (yp = yn = 0, i = 0; i < n; ++i) {
      if ((dy = (d = series[order[i]][j])[1] - d[0]) > 0) {
        d[0] = yp, d[1] = yp += dy;
      } else if (dy < 0) {
        d[1] = yn, d[0] = yn += dy;
      } else {
        d[0] = 0, d[1] = dy;
      }
    }
  }
}

function silhouette(series, order) {
  if (!((n = series.length) > 0)) return;
  for (var j = 0, s0 = series[order[0]], n, m = s0.length; j < m; ++j) {
    for (var i = 0, y = 0; i < n; ++i) y += series[i][j][1] || 0;
    s0[j][1] += s0[j][0] = -y / 2;
  }
  none(series, order);
}

function wiggle(series, order) {
  if (!((n = series.length) > 0) || !((m = (s0 = series[order[0]]).length) > 0)) return;
  for (var y = 0, j = 1, s0, m, n; j < m; ++j) {
    for (var i = 0, s1 = 0, s2 = 0; i < n; ++i) {
      var si = series[order[i]],
          sij0 = si[j][1] || 0,
          sij1 = si[j - 1][1] || 0,
          s3 = (sij0 - sij1) / 2;
      for (var k = 0; k < i; ++k) {
        var sk = series[order[k]],
            skj0 = sk[j][1] || 0,
            skj1 = sk[j - 1][1] || 0;
        s3 += skj0 - skj1;
      }
      s1 += sij0, s2 += s3 * sij0;
    }
    s0[j - 1][1] += s0[j - 1][0] = y;
    if (s1) y -= s2 / s1;
  }
  s0[j - 1][1] += s0[j - 1][0] = y;
  none(series, order);
}

function appearance(series) {
  var peaks = series.map(peak);
  return none$1(series).sort(function(a, b) { return peaks[a] - peaks[b]; });
}

function peak(series) {
  var i = -1, j = 0, n = series.length, vi, vj = -Infinity;
  while (++i < n) if ((vi = +series[i][1]) > vj) vj = vi, j = i;
  return j;
}

function ascending(series) {
  var sums = series.map(sum);
  return none$1(series).sort(function(a, b) { return sums[a] - sums[b]; });
}

function sum(series) {
  var s = 0, i = -1, n = series.length, v;
  while (++i < n) if (v = +series[i][1]) s += v;
  return s;
}

function descending(series) {
  return ascending(series).reverse();
}

function insideOut(series) {
  var n = series.length,
      i,
      j,
      sums = series.map(sum),
      order = appearance(series),
      top = 0,
      bottom = 0,
      tops = [],
      bottoms = [];

  for (i = 0; i < n; ++i) {
    j = order[i];
    if (top < bottom) {
      top += sums[j];
      tops.push(j);
    } else {
      bottom += sums[j];
      bottoms.push(j);
    }
  }

  return bottoms.reverse().concat(tops);
}

function reverse(series) {
  return none$1(series).reverse();
}

var constant = x => () => x;

function ZoomEvent(type, {
  sourceEvent,
  target,
  transform,
  dispatch
}) {
  Object.defineProperties(this, {
    type: {value: type, enumerable: true, configurable: true},
    sourceEvent: {value: sourceEvent, enumerable: true, configurable: true},
    target: {value: target, enumerable: true, configurable: true},
    transform: {value: transform, enumerable: true, configurable: true},
    _: {value: dispatch}
  });
}

function nopropagation(event) {
  event.stopImmediatePropagation();
}

function noevent(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}

// Ignore right-click, since that should open the context menu.
// except for pinch-to-zoom, which is sent as a wheel+ctrlKey event
function defaultFilter(event) {
  return (!event.ctrlKey || event.type === 'wheel') && !event.button;
}

function defaultExtent() {
  var e = this;
  if (e instanceof SVGElement) {
    e = e.ownerSVGElement || e;
    if (e.hasAttribute("viewBox")) {
      e = e.viewBox.baseVal;
      return [[e.x, e.y], [e.x + e.width, e.y + e.height]];
    }
    return [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
  }
  return [[0, 0], [e.clientWidth, e.clientHeight]];
}

function defaultTransform() {
  return this.__zoom || identity$3;
}

function defaultWheelDelta(event) {
  return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * (event.ctrlKey ? 10 : 1);
}

function defaultTouchable() {
  return navigator.maxTouchPoints || ("ontouchstart" in this);
}

function defaultConstrain(transform, extent, translateExtent) {
  var dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0],
      dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0],
      dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1],
      dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1];
  return transform.translate(
    dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
    dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
  );
}

function zoom() {
  var filter = defaultFilter,
      extent = defaultExtent,
      constrain = defaultConstrain,
      wheelDelta = defaultWheelDelta,
      touchable = defaultTouchable,
      scaleExtent = [0, Infinity],
      translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]],
      duration = 250,
      interpolate = interpolateZoom,
      listeners = dispatch("start", "zoom", "end"),
      touchstarting,
      touchfirst,
      touchending,
      touchDelay = 500,
      wheelDelay = 150,
      clickDistance2 = 0,
      tapDistance = 10;

  function zoom(selection) {
    selection
        .property("__zoom", defaultTransform)
        .on("wheel.zoom", wheeled, {passive: false})
        .on("mousedown.zoom", mousedowned)
        .on("dblclick.zoom", dblclicked)
      .filter(touchable)
        .on("touchstart.zoom", touchstarted)
        .on("touchmove.zoom", touchmoved)
        .on("touchend.zoom touchcancel.zoom", touchended)
        .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }

  zoom.transform = function(collection, transform, point, event) {
    var selection = collection.selection ? collection.selection() : collection;
    selection.property("__zoom", defaultTransform);
    if (collection !== selection) {
      schedule(collection, transform, point, event);
    } else {
      selection.interrupt().each(function() {
        gesture(this, arguments)
          .event(event)
          .start()
          .zoom(null, typeof transform === "function" ? transform.apply(this, arguments) : transform)
          .end();
      });
    }
  };

  zoom.scaleBy = function(selection, k, p, event) {
    zoom.scaleTo(selection, function() {
      var k0 = this.__zoom.k,
          k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return k0 * k1;
    }, p, event);
  };

  zoom.scaleTo = function(selection, k, p, event) {
    zoom.transform(selection, function() {
      var e = extent.apply(this, arguments),
          t0 = this.__zoom,
          p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p,
          p1 = t0.invert(p0),
          k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
    }, p, event);
  };

  zoom.translateBy = function(selection, x, y, event) {
    zoom.transform(selection, function() {
      return constrain(this.__zoom.translate(
        typeof x === "function" ? x.apply(this, arguments) : x,
        typeof y === "function" ? y.apply(this, arguments) : y
      ), extent.apply(this, arguments), translateExtent);
    }, null, event);
  };

  zoom.translateTo = function(selection, x, y, p, event) {
    zoom.transform(selection, function() {
      var e = extent.apply(this, arguments),
          t = this.__zoom,
          p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
      return constrain(identity$3.translate(p0[0], p0[1]).scale(t.k).translate(
        typeof x === "function" ? -x.apply(this, arguments) : -x,
        typeof y === "function" ? -y.apply(this, arguments) : -y
      ), e, translateExtent);
    }, p, event);
  };

  function scale(transform, k) {
    k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
    return k === transform.k ? transform : new Transform(k, transform.x, transform.y);
  }

  function translate(transform, p0, p1) {
    var x = p0[0] - p1[0] * transform.k, y = p0[1] - p1[1] * transform.k;
    return x === transform.x && y === transform.y ? transform : new Transform(transform.k, x, y);
  }

  function centroid(extent) {
    return [(+extent[0][0] + +extent[1][0]) / 2, (+extent[0][1] + +extent[1][1]) / 2];
  }

  function schedule(transition, transform, point, event) {
    transition
        .on("start.zoom", function() { gesture(this, arguments).event(event).start(); })
        .on("interrupt.zoom end.zoom", function() { gesture(this, arguments).event(event).end(); })
        .tween("zoom", function() {
          var that = this,
              args = arguments,
              g = gesture(that, args).event(event),
              e = extent.apply(that, args),
              p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point,
              w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]),
              a = that.__zoom,
              b = typeof transform === "function" ? transform.apply(that, args) : transform,
              i = interpolate(a.invert(p).concat(w / a.k), b.invert(p).concat(w / b.k));
          return function(t) {
            if (t === 1) t = b; // Avoid rounding error on end.
            else { var l = i(t), k = w / l[2]; t = new Transform(k, p[0] - l[0] * k, p[1] - l[1] * k); }
            g.zoom(null, t);
          };
        });
  }

  function gesture(that, args, clean) {
    return (!clean && that.__zooming) || new Gesture(that, args);
  }

  function Gesture(that, args) {
    this.that = that;
    this.args = args;
    this.active = 0;
    this.sourceEvent = null;
    this.extent = extent.apply(that, args);
    this.taps = 0;
  }

  Gesture.prototype = {
    event: function(event) {
      if (event) this.sourceEvent = event;
      return this;
    },
    start: function() {
      if (++this.active === 1) {
        this.that.__zooming = this;
        this.emit("start");
      }
      return this;
    },
    zoom: function(key, transform) {
      if (this.mouse && key !== "mouse") this.mouse[1] = transform.invert(this.mouse[0]);
      if (this.touch0 && key !== "touch") this.touch0[1] = transform.invert(this.touch0[0]);
      if (this.touch1 && key !== "touch") this.touch1[1] = transform.invert(this.touch1[0]);
      this.that.__zoom = transform;
      this.emit("zoom");
      return this;
    },
    end: function() {
      if (--this.active === 0) {
        delete this.that.__zooming;
        this.emit("end");
      }
      return this;
    },
    emit: function(type) {
      var d = select(this.that).datum();
      listeners.call(
        type,
        this.that,
        new ZoomEvent(type, {
          sourceEvent: this.sourceEvent,
          target: zoom,
          type,
          transform: this.that.__zoom,
          dispatch: listeners
        }),
        d
      );
    }
  };

  function wheeled(event, ...args) {
    if (!filter.apply(this, arguments)) return;
    var g = gesture(this, args).event(event),
        t = this.__zoom,
        k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta.apply(this, arguments)))),
        p = pointer(event);

    // If the mouse is in the same location as before, reuse it.
    // If there were recent wheel events, reset the wheel idle timeout.
    if (g.wheel) {
      if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) {
        g.mouse[1] = t.invert(g.mouse[0] = p);
      }
      clearTimeout(g.wheel);
    }

    // If this wheel event won’t trigger a transform change, ignore it.
    else if (t.k === k) return;

    // Otherwise, capture the mouse point and location at the start.
    else {
      g.mouse = [p, t.invert(p)];
      interrupt(this);
      g.start();
    }

    noevent(event);
    g.wheel = setTimeout(wheelidled, wheelDelay);
    g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));

    function wheelidled() {
      g.wheel = null;
      g.end();
    }
  }

  function mousedowned(event, ...args) {
    if (touchending || !filter.apply(this, arguments)) return;
    var currentTarget = event.currentTarget,
        g = gesture(this, args, true).event(event),
        v = select(event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true),
        p = pointer(event, currentTarget),
        x0 = event.clientX,
        y0 = event.clientY;

    dragDisable(event.view);
    nopropagation(event);
    g.mouse = [p, this.__zoom.invert(p)];
    interrupt(this);
    g.start();

    function mousemoved(event) {
      noevent(event);
      if (!g.moved) {
        var dx = event.clientX - x0, dy = event.clientY - y0;
        g.moved = dx * dx + dy * dy > clickDistance2;
      }
      g.event(event)
       .zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = pointer(event, currentTarget), g.mouse[1]), g.extent, translateExtent));
    }

    function mouseupped(event) {
      v.on("mousemove.zoom mouseup.zoom", null);
      yesdrag(event.view, g.moved);
      noevent(event);
      g.event(event).end();
    }
  }

  function dblclicked(event, ...args) {
    if (!filter.apply(this, arguments)) return;
    var t0 = this.__zoom,
        p0 = pointer(event.changedTouches ? event.changedTouches[0] : event, this),
        p1 = t0.invert(p0),
        k1 = t0.k * (event.shiftKey ? 0.5 : 2),
        t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, args), translateExtent);

    noevent(event);
    if (duration > 0) select(this).transition().duration(duration).call(schedule, t1, p0, event);
    else select(this).call(zoom.transform, t1, p0, event);
  }

  function touchstarted(event, ...args) {
    if (!filter.apply(this, arguments)) return;
    var touches = event.touches,
        n = touches.length,
        g = gesture(this, args, event.changedTouches.length === n).event(event),
        started, i, t, p;

    nopropagation(event);
    for (i = 0; i < n; ++i) {
      t = touches[i], p = pointer(t, this);
      p = [p, this.__zoom.invert(p), t.identifier];
      if (!g.touch0) g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;
      else if (!g.touch1 && g.touch0[2] !== p[2]) g.touch1 = p, g.taps = 0;
    }

    if (touchstarting) touchstarting = clearTimeout(touchstarting);

    if (started) {
      if (g.taps < 2) touchfirst = p[0], touchstarting = setTimeout(function() { touchstarting = null; }, touchDelay);
      interrupt(this);
      g.start();
    }
  }

  function touchmoved(event, ...args) {
    if (!this.__zooming) return;
    var g = gesture(this, args).event(event),
        touches = event.changedTouches,
        n = touches.length, i, t, p, l;

    noevent(event);
    for (i = 0; i < n; ++i) {
      t = touches[i], p = pointer(t, this);
      if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p;
      else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p;
    }
    t = g.that.__zoom;
    if (g.touch1) {
      var p0 = g.touch0[0], l0 = g.touch0[1],
          p1 = g.touch1[0], l1 = g.touch1[1],
          dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp,
          dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
      t = scale(t, Math.sqrt(dp / dl));
      p = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
      l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
    }
    else if (g.touch0) p = g.touch0[0], l = g.touch0[1];
    else return;

    g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
  }

  function touchended(event, ...args) {
    if (!this.__zooming) return;
    var g = gesture(this, args).event(event),
        touches = event.changedTouches,
        n = touches.length, i, t;

    nopropagation(event);
    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function() { touchending = null; }, touchDelay);
    for (i = 0; i < n; ++i) {
      t = touches[i];
      if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;
      else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
    }
    if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
    if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);
    else {
      g.end();
      // If this was a dbltap, reroute to the (optional) dblclick.zoom handler.
      if (g.taps === 2) {
        t = pointer(t, this);
        if (Math.hypot(touchfirst[0] - t[0], touchfirst[1] - t[1]) < tapDistance) {
          var p = select(this).on("dblclick.zoom");
          if (p) p.apply(this, arguments);
        }
      }
    }
  }

  zoom.wheelDelta = function(_) {
    return arguments.length ? (wheelDelta = typeof _ === "function" ? _ : constant(+_), zoom) : wheelDelta;
  };

  zoom.filter = function(_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : constant(!!_), zoom) : filter;
  };

  zoom.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant(!!_), zoom) : touchable;
  };

  zoom.extent = function(_) {
    return arguments.length ? (extent = typeof _ === "function" ? _ : constant([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom) : extent;
  };

  zoom.scaleExtent = function(_) {
    return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom) : [scaleExtent[0], scaleExtent[1]];
  };

  zoom.translateExtent = function(_) {
    return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom) : [[translateExtent[0][0], translateExtent[0][1]], [translateExtent[1][0], translateExtent[1][1]]];
  };

  zoom.constrain = function(_) {
    return arguments.length ? (constrain = _, zoom) : constrain;
  };

  zoom.duration = function(_) {
    return arguments.length ? (duration = +_, zoom) : duration;
  };

  zoom.interpolate = function(_) {
    return arguments.length ? (interpolate = _, zoom) : interpolate;
  };

  zoom.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? zoom : value;
  };

  zoom.clickDistance = function(_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom) : Math.sqrt(clickDistance2);
  };

  zoom.tapDistance = function(_) {
    return arguments.length ? (tapDistance = +_, zoom) : tapDistance;
  };

  return zoom;
}

var d3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  bisect: bisect,
  bisectRight: bisectRight,
  bisectLeft: bisectLeft,
  bisectCenter: bisectCenter,
  ascending: ascending$2,
  bisector: bisector,
  blur: blur,
  blur2: blur2,
  blurImage: blurImage,
  count: count,
  cross: cross$1,
  cumsum: cumsum,
  descending: descending$2,
  deviation: deviation,
  extent: extent$1,
  Adder: Adder,
  fsum: fsum,
  fcumsum: fcumsum,
  group: group,
  flatGroup: flatGroup,
  flatRollup: flatRollup,
  groups: groups,
  index: index,
  indexes: indexes,
  rollup: rollup,
  rollups: rollups,
  groupSort: groupSort,
  bin: bin,
  histogram: bin,
  thresholdFreedmanDiaconis: thresholdFreedmanDiaconis,
  thresholdScott: thresholdScott,
  thresholdSturges: thresholdSturges,
  max: max,
  maxIndex: maxIndex,
  mean: mean,
  median: median,
  medianIndex: medianIndex,
  merge: merge,
  min: min,
  minIndex: minIndex,
  mode: mode,
  nice: nice,
  pairs: pairs,
  permute: permute,
  quantile: quantile,
  quantileIndex: quantileIndex,
  quantileSorted: quantileSorted,
  quickselect: quickselect,
  range: range,
  rank: rank,
  least: least,
  leastIndex: leastIndex,
  greatest: greatest,
  greatestIndex: greatestIndex,
  scan: scan,
  shuffle: shuffle,
  shuffler: shuffler,
  sum: sum$1,
  ticks: ticks,
  tickIncrement: tickIncrement,
  tickStep: tickStep,
  transpose: transpose,
  variance: variance,
  zip: zip,
  every: every,
  some: some,
  filter: filter,
  map: map,
  reduce: reduce,
  reverse: reverse$1,
  sort: sort,
  difference: difference,
  disjoint: disjoint,
  intersection: intersection,
  subset: subset,
  superset: superset,
  union: union,
  InternMap: InternMap,
  InternSet: InternSet,
  axisTop: axisTop,
  axisRight: axisRight,
  axisBottom: axisBottom,
  axisLeft: axisLeft,
  brush: brush,
  brushX: brushX,
  brushY: brushY,
  brushSelection: brushSelection,
  chord: chord,
  chordTranspose: chordTranspose,
  chordDirected: chordDirected,
  ribbon: ribbon,
  ribbonArrow: ribbonArrow,
  color: color,
  rgb: rgb,
  hsl: hsl,
  lab: lab,
  hcl: hcl,
  lch: lch,
  gray: gray,
  cubehelix: cubehelix$1,
  contours: Contours,
  contourDensity: density,
  Delaunay: Delaunay,
  Voronoi: Voronoi,
  dispatch: dispatch,
  drag: drag,
  dragDisable: dragDisable,
  dragEnable: yesdrag,
  dsvFormat: dsvFormat,
  csvParse: csvParse,
  csvParseRows: csvParseRows,
  csvFormat: csvFormat,
  csvFormatBody: csvFormatBody,
  csvFormatRows: csvFormatRows,
  csvFormatRow: csvFormatRow,
  csvFormatValue: csvFormatValue,
  tsvParse: tsvParse,
  tsvParseRows: tsvParseRows,
  tsvFormat: tsvFormat,
  tsvFormatBody: tsvFormatBody,
  tsvFormatRows: tsvFormatRows,
  tsvFormatRow: tsvFormatRow,
  tsvFormatValue: tsvFormatValue,
  autoType: autoType,
  easeLinear: linear,
  easeQuad: quadInOut,
  easeQuadIn: quadIn,
  easeQuadOut: quadOut,
  easeQuadInOut: quadInOut,
  easeCubic: cubicInOut,
  easeCubicIn: cubicIn,
  easeCubicOut: cubicOut,
  easeCubicInOut: cubicInOut,
  easePoly: polyInOut,
  easePolyIn: polyIn,
  easePolyOut: polyOut,
  easePolyInOut: polyInOut,
  easeSin: sinInOut,
  easeSinIn: sinIn,
  easeSinOut: sinOut,
  easeSinInOut: sinInOut,
  easeExp: expInOut,
  easeExpIn: expIn,
  easeExpOut: expOut,
  easeExpInOut: expInOut,
  easeCircle: circleInOut,
  easeCircleIn: circleIn,
  easeCircleOut: circleOut,
  easeCircleInOut: circleInOut,
  easeBounce: bounceOut,
  easeBounceIn: bounceIn,
  easeBounceOut: bounceOut,
  easeBounceInOut: bounceInOut,
  easeBack: backInOut,
  easeBackIn: backIn,
  easeBackOut: backOut,
  easeBackInOut: backInOut,
  easeElastic: elasticOut,
  easeElasticIn: elasticIn,
  easeElasticOut: elasticOut,
  easeElasticInOut: elasticInOut,
  blob: blob,
  buffer: buffer,
  dsv: dsv,
  csv: csv,
  tsv: tsv,
  image: image,
  json: json,
  text: text,
  xml: xml,
  html: html,
  svg: svg,
  forceCenter: forceCenter,
  forceCollide: forceCollide,
  forceLink: forceLink,
  forceManyBody: forceManyBody,
  forceRadial: radial$1,
  forceSimulation: forceSimulation,
  forceX: forceX,
  forceY: forceY,
  formatDefaultLocale: defaultLocale,
  get format () { return format; },
  get formatPrefix () { return formatPrefix; },
  formatLocale: formatLocale,
  formatSpecifier: formatSpecifier,
  FormatSpecifier: FormatSpecifier,
  precisionFixed: precisionFixed,
  precisionPrefix: precisionPrefix,
  precisionRound: precisionRound,
  geoArea: geoArea$1,
  geoBounds: geoBounds$1,
  geoCentroid: geoCentroid$1,
  geoCircle: geoCircle,
  geoClipAntimeridian: clipAntimeridian,
  geoClipCircle: clipCircle,
  geoClipExtent: extent,
  geoClipRectangle: clipRectangle,
  geoContains: contains$1,
  geoDistance: distance,
  geoGraticule: graticule,
  geoGraticule10: graticule10,
  geoInterpolate: interpolate,
  geoLength: length$1,
  geoPath: geoPath,
  geoAlbers: geoAlbers,
  geoAlbersUsa: geoAlbersUsa,
  geoAzimuthalEqualArea: geoAzimuthalEqualArea,
  geoAzimuthalEqualAreaRaw: azimuthalEqualAreaRaw,
  geoAzimuthalEquidistant: geoAzimuthalEquidistant,
  geoAzimuthalEquidistantRaw: azimuthalEquidistantRaw,
  geoConicConformal: geoConicConformal,
  geoConicConformalRaw: conicConformalRaw,
  geoConicEqualArea: geoConicEqualArea,
  geoConicEqualAreaRaw: conicEqualAreaRaw,
  geoConicEquidistant: geoConicEquidistant,
  geoConicEquidistantRaw: conicEquidistantRaw,
  geoEqualEarth: geoEqualEarth,
  geoEqualEarthRaw: equalEarthRaw,
  geoEquirectangular: geoEquirectangular,
  geoEquirectangularRaw: equirectangularRaw,
  geoGnomonic: geoGnomonic,
  geoGnomonicRaw: gnomonicRaw,
  geoIdentity: geoIdentity,
  geoProjection: projection,
  geoProjectionMutator: projectionMutator,
  geoMercator: geoMercator,
  geoMercatorRaw: mercatorRaw,
  geoNaturalEarth1: geoNaturalEarth1,
  geoNaturalEarth1Raw: naturalEarth1Raw,
  geoOrthographic: geoOrthographic,
  geoOrthographicRaw: orthographicRaw,
  geoStereographic: geoStereographic,
  geoStereographicRaw: stereographicRaw,
  geoTransverseMercator: geoTransverseMercator,
  geoTransverseMercatorRaw: transverseMercatorRaw,
  geoRotation: rotation,
  geoStream: geoStream,
  geoTransform: transform,
  cluster: cluster,
  hierarchy: hierarchy,
  Node: Node,
  pack: pack,
  packSiblings: siblings,
  packEnclose: enclose,
  partition: partition,
  stratify: stratify,
  tree: tree,
  treemap: treemap,
  treemapBinary: treemapBinary,
  treemapDice: treemapDice,
  treemapSlice: treemapSlice,
  treemapSliceDice: treemapSliceDice,
  treemapSquarify: treemapSquarify,
  treemapResquarify: treemapResquarify,
  interpolate: interpolate$1,
  interpolateArray: array$4,
  interpolateBasis: basis,
  interpolateBasisClosed: basisClosed,
  interpolateDate: date,
  interpolateDiscrete: discrete,
  interpolateHue: hue,
  interpolateNumber: interpolateNumber,
  interpolateNumberArray: numberArray,
  interpolateObject: object$1,
  interpolateRound: interpolateRound,
  interpolateString: interpolateString,
  interpolateTransformCss: interpolateTransformCss,
  interpolateTransformSvg: interpolateTransformSvg,
  interpolateZoom: interpolateZoom,
  interpolateRgb: interpolateRgb,
  interpolateRgbBasis: rgbBasis,
  interpolateRgbBasisClosed: rgbBasisClosed,
  interpolateHsl: hsl$1,
  interpolateHslLong: hslLong,
  interpolateLab: lab$1,
  interpolateHcl: hcl$1,
  interpolateHclLong: hclLong,
  interpolateCubehelix: cubehelix$2,
  interpolateCubehelixLong: cubehelixLong,
  piecewise: piecewise,
  quantize: quantize,
  Path: Path,
  path: path,
  pathRound: pathRound,
  polygonArea: area,
  polygonCentroid: centroid$1,
  polygonHull: hull,
  polygonContains: contains,
  polygonLength: length,
  quadtree: quadtree,
  randomUniform: uniform,
  randomInt: int,
  randomNormal: normal,
  randomLogNormal: logNormal,
  randomBates: bates,
  randomIrwinHall: irwinHall,
  randomExponential: exponential,
  randomPareto: pareto,
  randomBernoulli: bernoulli,
  randomGeometric: geometric,
  randomBinomial: binomial,
  randomGamma: gamma,
  randomBeta: beta,
  randomWeibull: weibull,
  randomCauchy: cauchy,
  randomLogistic: logistic,
  randomPoisson: poisson,
  randomLcg: lcg,
  scaleBand: band,
  scalePoint: point$1,
  scaleIdentity: identity$4,
  scaleLinear: linear$1,
  scaleLog: log,
  scaleSymlog: symlog,
  scaleOrdinal: ordinal,
  scaleImplicit: implicit,
  scalePow: pow,
  scaleSqrt: sqrt$1,
  scaleRadial: radial,
  scaleQuantile: quantile$1,
  scaleQuantize: quantize$1,
  scaleThreshold: threshold,
  scaleTime: time,
  scaleUtc: utcTime,
  scaleSequential: sequential,
  scaleSequentialLog: sequentialLog,
  scaleSequentialPow: sequentialPow,
  scaleSequentialSqrt: sequentialSqrt,
  scaleSequentialSymlog: sequentialSymlog,
  scaleSequentialQuantile: sequentialQuantile,
  scaleDiverging: diverging$1,
  scaleDivergingLog: divergingLog,
  scaleDivergingPow: divergingPow,
  scaleDivergingSqrt: divergingSqrt,
  scaleDivergingSymlog: divergingSymlog,
  tickFormat: tickFormat,
  schemeCategory10: category10,
  schemeAccent: Accent,
  schemeDark2: Dark2,
  schemePaired: Paired,
  schemePastel1: Pastel1,
  schemePastel2: Pastel2,
  schemeSet1: Set1,
  schemeSet2: Set2,
  schemeSet3: Set3,
  schemeTableau10: Tableau10,
  interpolateBrBG: BrBG,
  schemeBrBG: scheme$q,
  interpolatePRGn: PRGn,
  schemePRGn: scheme$p,
  interpolatePiYG: PiYG,
  schemePiYG: scheme$o,
  interpolatePuOr: PuOr,
  schemePuOr: scheme$n,
  interpolateRdBu: RdBu,
  schemeRdBu: scheme$m,
  interpolateRdGy: RdGy,
  schemeRdGy: scheme$l,
  interpolateRdYlBu: RdYlBu,
  schemeRdYlBu: scheme$k,
  interpolateRdYlGn: RdYlGn,
  schemeRdYlGn: scheme$j,
  interpolateSpectral: Spectral,
  schemeSpectral: scheme$i,
  interpolateBuGn: BuGn,
  schemeBuGn: scheme$h,
  interpolateBuPu: BuPu,
  schemeBuPu: scheme$g,
  interpolateGnBu: GnBu,
  schemeGnBu: scheme$f,
  interpolateOrRd: OrRd,
  schemeOrRd: scheme$e,
  interpolatePuBuGn: PuBuGn,
  schemePuBuGn: scheme$d,
  interpolatePuBu: PuBu,
  schemePuBu: scheme$c,
  interpolatePuRd: PuRd,
  schemePuRd: scheme$b,
  interpolateRdPu: RdPu,
  schemeRdPu: scheme$a,
  interpolateYlGnBu: YlGnBu,
  schemeYlGnBu: scheme$9,
  interpolateYlGn: YlGn,
  schemeYlGn: scheme$8,
  interpolateYlOrBr: YlOrBr,
  schemeYlOrBr: scheme$7,
  interpolateYlOrRd: YlOrRd,
  schemeYlOrRd: scheme$6,
  interpolateBlues: Blues,
  schemeBlues: scheme$5,
  interpolateGreens: Greens,
  schemeGreens: scheme$4,
  interpolateGreys: Greys,
  schemeGreys: scheme$3,
  interpolatePurples: Purples,
  schemePurples: scheme$2,
  interpolateReds: Reds,
  schemeReds: scheme$1,
  interpolateOranges: Oranges,
  schemeOranges: scheme,
  interpolateCividis: cividis,
  interpolateCubehelixDefault: cubehelix,
  interpolateRainbow: rainbow,
  interpolateWarm: warm,
  interpolateCool: cool,
  interpolateSinebow: sinebow,
  interpolateTurbo: turbo,
  interpolateViridis: viridis,
  interpolateMagma: magma,
  interpolateInferno: inferno,
  interpolatePlasma: plasma,
  create: create,
  creator: creator,
  local: local,
  matcher: matcher,
  namespace: namespace,
  namespaces: namespaces,
  pointer: pointer,
  pointers: pointers,
  select: select,
  selectAll: selectAll,
  selection: selection,
  selector: selector,
  selectorAll: selectorAll,
  style: styleValue,
  window: defaultView,
  arc: arc$2,
  area: area$2,
  line: line$2,
  pie: pie,
  areaRadial: areaRadial,
  radialArea: areaRadial,
  lineRadial: lineRadial$1,
  radialLine: lineRadial$1,
  pointRadial: pointRadial,
  link: link,
  linkHorizontal: linkHorizontal,
  linkVertical: linkVertical,
  linkRadial: linkRadial,
  symbol: Symbol$1,
  symbolsStroke: symbolsStroke,
  symbolsFill: symbolsFill,
  symbols: symbolsFill,
  symbolAsterisk: asterisk,
  symbolCircle: circle,
  symbolCross: cross$2,
  symbolDiamond: diamond,
  symbolDiamond2: diamond2,
  symbolPlus: plus,
  symbolSquare: square$1,
  symbolSquare2: square2,
  symbolStar: star,
  symbolTriangle: triangle$1,
  symbolTriangle2: triangle2,
  symbolWye: wye,
  symbolTimes: times,
  symbolX: times,
  curveBasisClosed: curveBasisClosed,
  curveBasisOpen: curveBasisOpen,
  curveBasis: curveBasis,
  curveBumpX: bumpX,
  curveBumpY: bumpY,
  curveBundle: curveBundle,
  curveCardinalClosed: curveCardinalClosed,
  curveCardinalOpen: curveCardinalOpen,
  curveCardinal: curveCardinal,
  curveCatmullRomClosed: curveCatmullRomClosed,
  curveCatmullRomOpen: curveCatmullRomOpen,
  curveCatmullRom: curveCatmullRom,
  curveLinearClosed: curveLinearClosed,
  curveLinear: curveLinear,
  curveMonotoneX: monotoneX,
  curveMonotoneY: monotoneY,
  curveNatural: curveNatural,
  curveStep: curveStep,
  curveStepAfter: stepAfter,
  curveStepBefore: stepBefore,
  stack: stack,
  stackOffsetExpand: expand,
  stackOffsetDiverging: diverging,
  stackOffsetNone: none,
  stackOffsetSilhouette: silhouette,
  stackOffsetWiggle: wiggle,
  stackOrderAppearance: appearance,
  stackOrderAscending: ascending,
  stackOrderDescending: descending,
  stackOrderInsideOut: insideOut,
  stackOrderNone: none$1,
  stackOrderReverse: reverse,
  timeInterval: timeInterval,
  utcMillisecond: millisecond,
  utcMilliseconds: milliseconds,
  timeMillisecond: millisecond,
  timeMilliseconds: milliseconds,
  utcSecond: second,
  utcSeconds: seconds,
  timeSecond: second,
  timeSeconds: seconds,
  timeMinute: timeMinute,
  timeMinutes: timeMinutes,
  utcMinute: utcMinute,
  utcMinutes: utcMinutes,
  timeHour: timeHour,
  timeHours: timeHours,
  utcHour: utcHour,
  utcHours: utcHours,
  timeDay: timeDay,
  timeDays: timeDays,
  utcDay: utcDay,
  utcDays: utcDays,
  unixDay: unixDay,
  unixDays: unixDays,
  timeWeek: timeSunday,
  timeWeeks: timeSundays,
  timeSunday: timeSunday,
  timeSundays: timeSundays,
  timeMonday: timeMonday,
  timeMondays: timeMondays,
  timeTuesday: timeTuesday,
  timeTuesdays: timeTuesdays,
  timeWednesday: timeWednesday,
  timeWednesdays: timeWednesdays,
  timeThursday: timeThursday,
  timeThursdays: timeThursdays,
  timeFriday: timeFriday,
  timeFridays: timeFridays,
  timeSaturday: timeSaturday,
  timeSaturdays: timeSaturdays,
  utcWeek: utcSunday,
  utcWeeks: utcSundays,
  utcSunday: utcSunday,
  utcSundays: utcSundays,
  utcMonday: utcMonday,
  utcMondays: utcMondays,
  utcTuesday: utcTuesday,
  utcTuesdays: utcTuesdays,
  utcWednesday: utcWednesday,
  utcWednesdays: utcWednesdays,
  utcThursday: utcThursday,
  utcThursdays: utcThursdays,
  utcFriday: utcFriday,
  utcFridays: utcFridays,
  utcSaturday: utcSaturday,
  utcSaturdays: utcSaturdays,
  timeMonth: timeMonth,
  timeMonths: timeMonths,
  utcMonth: utcMonth,
  utcMonths: utcMonths,
  timeYear: timeYear,
  timeYears: timeYears,
  utcYear: utcYear,
  utcYears: utcYears,
  utcTicks: utcTicks,
  utcTickInterval: utcTickInterval,
  timeTicks: timeTicks,
  timeTickInterval: timeTickInterval,
  timeFormatDefaultLocale: defaultLocale$1,
  get timeFormat () { return timeFormat; },
  get timeParse () { return timeParse; },
  get utcFormat () { return utcFormat; },
  get utcParse () { return utcParse; },
  timeFormatLocale: formatLocale$1,
  isoFormat: formatIso$1,
  isoParse: parseIso$1,
  now: now,
  timer: timer,
  timerFlush: timerFlush,
  timeout: timeout,
  interval: interval,
  transition: transition,
  active: active,
  interrupt: interrupt,
  zoom: zoom,
  zoomTransform: transform$1,
  zoomIdentity: identity$3,
  ZoomTransform: Transform
});

function ccw(polygon) {

    var _p = polygon.slice(0), sum = 0;

    _p.push(_p[0]);

    for (var i = 0; i <= polygon.length - 1; i++) {

        var j  = i + 1;
        var p1 = _p[i].rotated;
        var p2 = _p[j].rotated;

        sum += (p2.x - p1.x) * (p2.y + p1.y);
    }
    // if the area is positive
    // the curve is counter-clockwise
    // because of the flipped y-Axis in the browser
    return sum > 0 ? true : false;
}

function centroid(polygon){
    var _x = 0, _y = 0, _z = 0, _n = polygon.length;

    for (var i = _n - 1; i >= 0; i--) {
        _x += polygon[i].rotated.x;
        _y += polygon[i].rotated.y;
        _z += polygon[i].rotated.z;
    }

    return {
        x: _x / _n,
        y: _y / _n,
        z: _z / _n,
    };
}

function rotateRzRyRx(po, angles){

    var rc = angles.rotateCenter;

    po.x -= rc[0];
    po.y -= rc[1];
    po.z -= rc[2];

    var rz = rotateZ(po, angles.z);
    var ry = rotateY(rz, angles.y);
    var rx = rotateX(ry, angles.x);

    rx.x += rc[0];
    rx.y += rc[1];
    rx.z += rc[2];

    return rx;
}

function rotateX(p, a){
    var sa = Math.sin(a), ca = Math.cos(a);
    return {
        x: p.x,
        y: p.y * ca - p.z * sa,
        z: p.y * sa + p.z * ca
    };
}

function rotateY(p, a){
    var sa = Math.sin(a), ca = Math.cos(a);
    return {
        x: p.z * sa + p.x * ca,
        y: p.y,
        z: p.z * ca - p.x * sa
    };
}

function rotateZ(p, a){
    var sa = Math.sin(a), ca = Math.cos(a);
    return {
        x: p.x * ca - p.y * sa,
        y: p.x * sa + p.y * ca,
        z: p.z
    };
}

function point(points, options, point, angles){

    for (var i = points.length - 1; i >= 0; i--) {

        var p       = points[i];

        p.rotated   = rotateRzRyRx({x : point.x(p), y : point.y(p), z : point.z(p)}, angles);
        p.centroid  = p.rotated;
        p.projected = options.project(p.rotated, options);
    }
    return points;
}

function cube(cubes, options, point$1, angles){
    for (var i = cubes.length - 1; i >= 0; i--) {

        var cube = cubes[i];

        var vertices = point([
            cube[0],
            cube[1],
            cube[2],
            cube[3],
            cube[4],
            cube[5],
            cube[6],
            cube[7]
        ], options, point$1, angles);

        var v1 = vertices[0];
        var v2 = vertices[1];
        var v3 = vertices[2];
        var v4 = vertices[3];
        var v5 = vertices[4];
        var v6 = vertices[5];
        var v7 = vertices[6];
        var v8 = vertices[7];

        var front  = [v1, v2, v3, v4];
        var back   = [v8, v7, v6, v5];
        var left   = [v5, v6, v2, v1];
        var right  = [v4, v3, v7, v8];
        var top    = [v5, v1, v4, v8];
        var bottom = [v2, v6, v7, v3];

        front.centroid  = centroid(front);
        back.centroid   = centroid(back);
        left.centroid   = centroid(left);
        right.centroid  = centroid(right);
        top.centroid    = centroid(top);
        bottom.centroid = centroid(bottom);

        front.ccw  = ccw(front);
        back.ccw   = ccw(back);
        left.ccw   = ccw(left);
        right.ccw  = ccw(right);
        top.ccw    = ccw(top);
        bottom.ccw = ccw(bottom);

        front.face  = 'front';
        back.face   = 'back';
        left.face   = 'left';
        right.face  = 'right';
        top.face    = 'top';
        bottom.face = 'bottom';

        var faces = [front, back, left, right, top, bottom];

        cube.faces = faces;
        cube.centroid = {x: (left.centroid.x + right.centroid.x)/2, y: (top.centroid.y + bottom.centroid.y)/2, z: (front.centroid.z + back.centroid.z/2)};
    }
    return cubes;
}

function gridPlane(grid, options, point$1, angles){

    var points = point(grid, options, point$1, angles);
    var cnt    = 0, planes = [];
    var numPts = options.row;
    var numRow = points.length/numPts;

    for (var i = numRow - 1; i > 0; i--) {
        for (var j = numPts - 1; j > 0; j--) {

            var p1 = j + i * numPts, p4 = p1 - 1, p2 = p4 - numPts + 1, p3 = p2 - 1;
            var pl = [points[p1], points[p2], points[p3], points[p4]];

            pl.plane    = 'plane_' + cnt++;
            pl.ccw      = ccw(pl);
            pl.centroid = centroid(pl);
            planes.push(pl);
        }
    }

    return planes;
}

function lineStrip(lineStrip, options, point, angles){

    for (var i = lineStrip.length - 1; i >= 0; i--) {

        var l = lineStrip[i], m = l.length/2, t = parseInt(m);

        for (var j = l.length - 1; j >= 0; j--) {
            var p = l[j];
            p.rotated   = rotateRzRyRx({x : point.x(p), y : point.y(p), z : point.z(p)}, angles);
            p.projected = options.project(p.rotated, options);
        }

        l.centroid = t === m ? centroid([ l[m - 1], l[m] ]) : { x: l[t].rotated.x, y: l[t].rotated.y, z: l[t].rotated.z };
    }
    return lineStrip;
}

function line(lines, options, point, angles){

    for (var i = lines.length - 1; i >= 0; i--) {

        var line      = lines[i];

        var p1        = line[0];
        var p2        = line[1];

        p1.rotated    = rotateRzRyRx({x : point.x(p1), y : point.y(p1), z : point.z(p1)}, angles);
        p2.rotated    = rotateRzRyRx({x : point.x(p2), y : point.y(p2), z : point.z(p2)}, angles);

        p1.projected  = options.project(p1.rotated, options);
        p2.projected  = options.project(p2.rotated, options);

        line.centroid = centroid(line);
    }
    return lines;
}

function plane(planes, options, point, angles){

    for (var i = planes.length - 1; i >= 0; i--) {

        var plane    = planes[i];

        var p1       = plane[0];
        var p2       = plane[1];
        var p3       = plane[2];
        var p4       = plane[3];

        p1.rotated   = rotateRzRyRx({x : point.x(p1), y : point.y(p1), z : point.z(p1)}, angles);
        p2.rotated   = rotateRzRyRx({x : point.x(p2), y : point.y(p2), z : point.z(p2)}, angles);
        p3.rotated   = rotateRzRyRx({x : point.x(p3), y : point.y(p3), z : point.z(p3)}, angles);
        p4.rotated   = rotateRzRyRx({x : point.x(p4), y : point.y(p4), z : point.z(p4)}, angles);

        p1.projected = options.project(p1.rotated, options);
        p2.projected = options.project(p2.rotated, options);
        p3.projected = options.project(p3.rotated, options);
        p4.projected = options.project(p4.rotated, options);

        plane.ccw      = ccw(plane);
        plane.centroid = centroid(plane);
    }
    return planes;
}

function triangle(triangles, options, point, angles){

    for (var i = triangles.length - 1; i >= 0; i--) {
        var tri      = triangles[i];
        var p1       = tri[0];
        var p2       = tri[1];
        var p3       = tri[2];

        p1.rotated   = rotateRzRyRx({x : point.x(p1), y : point.y(p1), z : point.z(p1)}, angles);
        p2.rotated   = rotateRzRyRx({x : point.x(p2), y : point.y(p2), z : point.z(p2)}, angles);
        p3.rotated   = rotateRzRyRx({x : point.x(p3), y : point.y(p3), z : point.z(p3)}, angles);

        p1.projected = options.project(p1.rotated, options);
        p2.projected = options.project(p2.rotated, options);
        p3.projected = options.project(p3.rotated, options);

        tri.ccw      = ccw(tri);
        tri.centroid = centroid(tri);
    }
    return triangles;
}

function drawLineStrip(lineStrip){
    var lastPoint = lineStrip[lineStrip.length - 1];
    var path = 'M' + lastPoint.projected.x + ',' + lastPoint.projected.y;
    for (var i = lineStrip.length - 2; i >= 0; i--) {
        var p = lineStrip[i].projected;
        path += 'L' + p.x + ',' + p.y;
    }
    return path;
}

function drawPlane(d){
	return 'M' + d[0].projected.x + ',' + d[0].projected.y + 'L' + d[1].projected.x + ',' + d[1].projected.y + 'L' + d[2].projected.x + ',' + d[2].projected.y + 'L' + d[3].projected.x + ',' + d[3].projected.y + 'Z';
}

function drawTriangle(d){
	return 'M' + d[0].projected.x + ',' + d[0].projected.y + 'L' + d[1].projected.x + ',' + d[1].projected.y + 'L' + d[2].projected.x + ',' + d[2].projected.y + 'Z';
}

function orthographic(d, options){
    return {
        x: options.origin[0] + options.scale * d.x,
        y: options.origin[1] + options.scale * d.y
    };
}

function x(p) {
    return p[0];
}

function y(p) {
    return p[1];
}

function z(p) {
    return p[2];
}

/**
* @author Stefan Nieke / http://niekes.com/
*/
function _3d() {

    var origin          = [0, 0],
        scale           = 1,
        projection      = orthographic,
        angleX          = 0,
        angleY          = 0,
        angleZ          = 0,
        rotateCenter    = [0,0,0],
        x$1               = x,
        y$1               = y,
        z$1               = z,
        row             = undefined,
        shape           = 'POINT',
        processData = {
            'CUBE'       : cube,
            'GRID'       : gridPlane,
            'LINE'       : line,
            'LINE_STRIP' : lineStrip,
            'PLANE'      : plane,
            'POINT'      : point,
            'SURFACE'    : gridPlane,
            'TRIANGLE'   : triangle,
        },
        draw = {
            'CUBE'       : drawPlane,
            'GRID'       : drawPlane,
            'LINE_STRIP' : drawLineStrip,
            'PLANE'      : drawPlane,
            'SURFACE'    : drawPlane,
            'TRIANGLE'   : drawTriangle,
        };

    function _3d(data){
        return processData[shape](
            data,
            { scale: scale, origin: origin, project: projection, row: row },
            { x: x$1, y: y$1, z: z$1 },
            { x: angleX, y: angleY, z: angleZ, rotateCenter: rotateCenter }
        );
    }

    _3d.origin = function(_){
        return arguments.length ? (origin = _, _3d) : origin;
    };

    _3d.scale = function(_){
        return arguments.length ? (scale = _, _3d) : scale;
    };

    _3d.rotateX = function(_){
        return arguments.length ? (angleX = _, _3d) : angleX;
    };

    _3d.rotateY = function(_){
        return arguments.length ? (angleY = _, _3d) : angleY;
    };

    _3d.rotateZ = function(_){
        return arguments.length ? (angleZ = _, _3d) : angleZ;
    };

    _3d.shape = function(_, r){
        return arguments.length ? (shape = _, row = r, _3d) : shape;
    };

    _3d.rotateCenter = function(_){
        return arguments.length ? (rotateCenter = _, _3d) : rotateCenter;
    };

    _3d.x = function(_){
        return arguments.length ? (x$1 = typeof _ === 'function' ? _ : +_, _3d) : x$1;
    };

    _3d.y = function(_){
        return arguments.length ? (y$1 = typeof _ === 'function' ? _ : +_, _3d) : y$1;
    };

    _3d.z = function(_){
        return arguments.length ? (z$1 = typeof _ === 'function' ? _ : +_, _3d) : z$1;
    };

    _3d.sort = function(a, b){
        var _a = a.centroid.z, _b = b.centroid.z;
        return _a < _b ? -1 : _a > _b ? 1 : _a >= _b ? 0 : NaN;
    };

    _3d.draw = function(d){
        if(!((shape === 'POINT') || (shape === 'LINE'))){
            return draw[shape](d);
        }
    };

    return _3d;
}

function straightLink(d, targetAccessor, sourceAccessor) {
  const start = { x: sourceAccessor(d).x, y: sourceAccessor(d).y };
  const end = { x: targetAccessor(d).x, y: targetAccessor(d).y };
  return `M ${start.x} ${start.y}, L ${end.x} ${end.y}`;
}

function rotatePoint(pivot, point, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  point.x -= pivot.x;
  point.y -= pivot.y;

  const newX = point.x * cos - point.y * sin;
  const newY = point.x * sin + point.y * cos;

  point.x = pivot.x + newX;
  point.y = pivot.y + newY;
}

function curvedLink(d, curveDir, targetAccessor, sourceAccessor) {
  const start = { x: sourceAccessor(d).x, y: sourceAccessor(d).y };
  const end = { x: targetAccessor(d).x, y: targetAccessor(d).y };

  const L = Math.sqrt(
    (start.y - end.y) * (start.y - end.y) +
      (start.x - end.x) * (start.x - end.x)
  );

  const theta = Math.atan((end.y - start.y) / (end.x - start.x));

  const p1 = {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
  };

  rotatePoint(start, p1, -theta);

  p1.y += (L / 5) * curveDir;

  rotatePoint(start, p1, theta);

  return `M ${start.x} ${start.y}
              S ${p1.x} ${p1.y}, ${end.x} ${end.y}`;
}

class ForceGraph extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "graph-3d-circle"),
      downloadPngMenuItem(this, "graph-3d-circle"),
      downloadJSONMenuItem(this, "graph-3d-circle", this._data),
      downloadCSVMenuItem(this, "graph-3d-circle", this._data),
      downloadTSVMenuItem(this, "graph-3d-circle", this._data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["togostanza-custom_css_url"]);

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    const setFallbackNumVal = (value, defVal) => {
      return isNaN(parseFloat(value)) ? defVal : parseFloat(value);
    };

    //data

    const width = setFallbackNumVal(css("--togostanza-outline-width"), 200);
    const height = setFallbackNumVal(css("--togostanza-outline-height"), 200);
    const MARGIN = getMarginsFromCSSString(css("--togostanza-outline-padding"));

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const cg = new StanzaColorGenerator(this);

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );

    this._data = values;

    const nodes = values.nodes;
    const edges = values.links;

    const HEIGHT = height - MARGIN.TOP - MARGIN.BOTTOM;
    const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

    // Setting color scale
    const togostanzaColors = cg.stanzaColor;

    const color = function (type = "scaleOrdinal") {
      return d3[type]().range(togostanzaColors);
    };

    const root = this.root.querySelector("main");
    const el = this.root.getElementById("layered-graph");

    const existingSvg = root.getElementsByTagName("svg")[0];
    if (existingSvg) {
      existingSvg.remove();
    }

    const svg = select(el)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    this.tooltip = new ToolTip();
    root.append(this.tooltip);

    const constRarius = !!this.params["group_planes-constant_radius"];

    const groupPlaneColorParams = {
      colorPlane: false,
    };

    const groupsSortParams = {
      sortBy: this.params["group_planes-sort-key"],
      sortOrder: this.params["group_planes-sort-order"] || "ascending",
    };

    const nodesSortParams = {
      sortBy: this.params["nodes-sort-key"],
      sortOrder: this.params["nodes-sort-order"] || "ascending",
    };

    const nodeSizeParams = {
      dataKey: this.params["node-size-key"] || "",
      minSize: setFallbackNumVal(this.params["node-size-min"], 3),
      maxSize: this.params["node-size-max"],
      scale: this.params["node-size-scale"] || "linear",
    };

    const nodeColorParams = {
      dataKey: this.params["node-color-key"] || "",
    };

    const edgeWidthParams = {
      dataKey: this.params["edge-width-key"] || "",
      minWidth: setFallbackNumVal(this.params["edge-width-min"], 1),
      maxWidth: this.params["edge-width-max"],
      scale: this.params["edge-width-scale"] || "linear",
      showArrows: this.params["edge-show_arrows"],
    };

    const edgeColorParams = {
      basedOn: "data key",
      dataKey: Symbol(),
    };

    const tooltipParams = {
      dataKey: this.params["tooltips-key"],
      show: nodes.some((d) => d[this.params["tooltips-key"]]),
    };

    const highlightAdjEdges = true;
    const highlightGroupPlanes = this.params["highlight-group_planes"] || false;

    const params = {
      MARGIN,
      width,
      height,
      svg,
      color,
      highlightAdjEdges,
      nodeSizeParams,
      nodesSortParams,
      groupsSortParams,
      nodeColorParams,
      edgeWidthParams,
      edgeColorParams,
      tooltipParams,
    };

    const { prepNodes, prepEdges, groupHash, symbols } = prepareGraphData(
      nodes,
      edges,
      params
    );

    const targetAccessor = (d) => d.edge[symbols.targetNodeSym].projected;
    const sourceAccessor = (d) => d.edge[symbols.sourceNodeSym].projected;

    function drawLink(d) {
      if (d.edge[symbols.isPairEdge]) {
        return curvedLink(
          d,
          d.edge[symbols.isPairEdge],
          targetAccessor,
          sourceAccessor
        );
      } else {
        return straightLink(d, targetAccessor, sourceAccessor);
      }
    }

    const markerBoxWidth = 8;
    const markerBoxHeight = 4;
    const refX = markerBoxWidth;
    const refY = markerBoxHeight / 2;

    const arrowPoints = [
      [0, 0],
      [0, markerBoxHeight],
      [markerBoxWidth, markerBoxHeight / 2],
    ];

    if (edgeWidthParams.showArrows) {
      const defs = svg.append("defs");

      const defsD = defs.selectAll("marker").data(prepEdges);

      defsD
        .enter()
        .append("marker")
        .attr(
          "id",
          (d) => d[symbols.idSym] // edge id
        )
        .attr("viewBox", [0, 0, markerBoxWidth, markerBoxHeight])
        .attr("refX", (d) => {
          return (
            refX +
            d[symbols.targetNodeSym][symbols.nodeSizeSym] /
              d[symbols.edgeWidthSym]
          );
        })
        .attr("refY", refY)
        .attr("markerWidth", markerBoxWidth)
        .attr("markerHeight", markerBoxHeight)
        .attr("orient", "auto-start-reverse")
        .append("path")
        .attr("d", line$2()(arrowPoints))
        .attr("stroke", "none")
        .attr("style", (d) =>
          d[symbols.edgeColorSym] ? `fill: ${d[symbols.edgeColorSym]}` : null
        )
        .attr("fill-opacity", 1);
    }

    const maxNodesInGroup = max(
      Object.entries(groupHash),
      (d) => d[1].length
    );

    const Rmax = (0.8 * WIDTH) / 2;

    const arcLength = ((2 * Math.PI) / maxNodesInGroup) * Rmax;

    const origin = [MARGIN.LEFT + WIDTH / 2, MARGIN.TOP + HEIGHT / 2];
    const scale = 0.75;

    let isDragging = false;

    const key = function (d) {
      return d.id;
    };

    const startAngle = (Math.PI * 8) / 180;

    const svgG = svg
      .call(
        drag().on("drag", dragged).on("start", dragStart).on("end", dragEnd)
      )
      .append("g");

    var mx, my, mouseX, mouseY;

    const point3d = _3d()
      .x(function (d) {
        return d.x;
      })
      .y(function (d) {
        return d.y;
      })
      .z(function (d) {
        return d.z;
      })
      .origin(origin)
      .rotateY(startAngle)
      .rotateX(-startAngle)
      .scale(scale);

    const edge3d = _3d()
      .scale(scale)
      .origin(origin)
      .shape("LINE")
      .rotateY(startAngle)
      .rotateX(-startAngle);

    const plane3d = _3d()
      .shape("LINE_STRIP")
      .origin(origin)
      .rotateY(startAngle)
      .rotateX(-startAngle)
      .scale(scale);

    function processData(data) {
      const planes = svgG
        .selectAll("path.group-plane")
        .data(data[2], (d) => d.groupId);

      planes
        .enter()
        .append("path")
        .attr("class", "_3d")
        .classed("group-plane", true)
        .merge(planes)
        .attr("style", (d) => `fill: ${d.color}`)
        .attr("d", plane3d.draw)
        .sort(plane3d.sort);

      planes.exit().remove();

      const linesStrip = svgG.selectAll("path.link").data(data[1]);

      linesStrip
        .enter()
        .append("path")
        .attr("class", "_3d")
        .classed("link", true)
        .merge(linesStrip)
        .style("stroke", (d) => d.edge[symbols.edgeColorSym])
        .style("stroke-width", (d) => d.edge[symbols.edgeWidthSym])
        .attr("d", drawLink)
        .sort(edge3d.sort)
        .attr(
          "marker-end",
          (d) => `url(#${d.edge[symbols.idSym] || "default"})`
        );

      linesStrip.exit().remove();

      const points = svgG.selectAll("circle").data(data[0], key);

      const p = points
        .enter()
        .append("circle")
        .attr("class", "_3d")
        .classed("node", true)
        .merge(points)
        .attr("cx", posPointX)
        .attr("cy", posPointY)
        .attr("r", (d) => d[symbols.nodeSizeSym])
        .style("fill", (d) => d[symbols.nodeColorSym])
        .sort(point3d.sort);

      if (tooltipParams.show) {
        p.attr("data-tooltip", (d) => d[tooltipParams.dataKey]);
      }

      points.exit().remove();
    }

    function posPointX(d) {
      return d.projected.x;
    }

    function posPointY(d) {
      return d.projected.y;
    }

    let groupPlanes = [];

    let edgesWithCoords = [];
    function init() {
      // Add x,y,z of source and target nodes to 3D edges
      edgesWithCoords = get3DEdges(prepEdges);

      // Laying out nodes=========
      const DEPTH = HEIGHT;
      const yPointScale = point$1([-DEPTH / 2, DEPTH / 2]).domain(
        Object.keys(groupHash).sort((a, b) => {
          if (a > b) {
            return groupsSortParams.sortOrder === "ascending" ? 1 : -1;
          }
          if (a < b) {
            return groupsSortParams.sortOrder === "ascending" ? -1 : 1;
          }
          return 0;
        })
      );

      Object.keys(groupHash).forEach((gKey) => {
        // Laying out nodes ===

        const group = groupHash[gKey];

        const angleScale = point$1()
          .domain(group.map((node) => node.id))
          .range([0, Math.PI * 2 - (Math.PI * 2) / group.length]);

        const R = constRarius
          ? Rmax
          : arcLength / ((Math.PI * 2) / group.length);

        group.forEach((node) => {
          if (group.length === 1) {
            node.x = 0;
            node.z = 0;
            node.y = yPointScale(gKey);
            return;
          }

          node.x = R * Math.cos(angleScale(node.id));
          node.z = R * Math.sin(angleScale(node.id));
          node.y = yPointScale(gKey);
        });
      });

      groupPlanes = getGroupPlanes(
        groupHash,
        {
          WIDTH,
          HEIGHT,
          DEPTH,
          color,
          yPointScale,
          groupPlaneColorParams,
        },
        true
      );

      const data = [
        point3d(prepNodes),
        edge3d(edgesWithCoords),
        plane3d(groupPlanes),
      ];

      processData(data);

      const planes = svgG.selectAll("path.group-plane");
      const points = svgG.selectAll("circle.node");
      const links = svgG.selectAll("path.link");

      if (highlightGroupPlanes) {
        addPlanesHighlight(planes, points, links);
      }

      {
        addEdgesHighlight(points, links);
      }
    }

    function dragStart(e) {
      isDragging = true;
      mx = e.x;
      my = e.y;
    }

    function dragged(e) {
      let alpha = 0;
      let beta = 0;

      mouseX = mouseX || 0;
      mouseY = mouseY || 0;
      beta = ((e.x - mx + mouseX) * Math.PI) / 230;
      alpha = (((e.y - my + mouseY) * Math.PI) / 230) * -1;
      const data = [
        point3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(
          prepNodes
        ),
        edge3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(
          edgesWithCoords
        ),
        plane3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(
          groupPlanes
        ),
      ];
      processData(data);
    }

    function dragEnd(e) {
      isDragging = false;
      mouseX = e.x - mx + mouseX;
      mouseY = e.y - my + mouseY;
    }

    function addPlanesHighlight(planes, points, links) {
      planes.on("mouseover", function (_e, d) {
        if (isDragging) {
          return;
        }

        const group = d.group;

        const nodesIdsInGroup = group.map((node) => node.id);

        const edgesConnectedToThisGroup = prepEdges.filter((edge) => {
          return (
            nodesIdsInGroup.includes(edge.source) ||
            nodesIdsInGroup.includes(edge.target)
          );
        });

        const sourcesGroups = edgesConnectedToThisGroup.map(
          (edge) => "" + edge[symbols.sourceNodeSym].group
        );
        const targetsGroups = edgesConnectedToThisGroup.map(
          (edge) => "" + edge[symbols.targetNodeSym].group
        );

        const connectedTargetNodes = edgesConnectedToThisGroup.map(
          (edge) => edge.target
        );

        const connectedSourceNodes = edgesConnectedToThisGroup.map(
          (edge) => edge.source
        );

        const allConnectedNodes = [
          ...new Set([...connectedTargetNodes, ...connectedSourceNodes]),
        ];
        const connectedNodes = allConnectedNodes.filter(
          (nodeId) => !nodesIdsInGroup.includes(nodeId)
        );

        const allGroups = [...new Set([...sourcesGroups, ...targetsGroups])];
        const connectedGroups = allGroups.filter(
          (group) => group !== d.groupId
        );

        planes.classed("fadeout", true);
        planes.classed("active", false);
        planes.classed("half-active", false);

        planes
          .filter((p) => {
            return connectedGroups.includes(p.groupId);
          })
          .classed("fadeout", false)
          .classed("half-active", true);

        select(this).classed("active", true).classed("fadeout", false);

        // highlight nodes belonging to this group
        points.classed("fadeout", true);
        points.classed("active", false);
        points.classed("half-active", false);

        points
          .filter((p) => {
            return nodesIdsInGroup.includes(p.id);
          })
          .classed("fadeout", false)
          .classed("active", true);

        points
          .filter((p) => {
            return connectedNodes.includes("" + p.id);
          })
          .classed("fadeout", false)
          .classed("half-active", true);

        // highlight edges that belongs to this group
        links.classed("fadeout", true);

        links
          .filter((p) => {
            return (
              (connectedNodes.includes(p.edge[symbols.sourceNodeSym].id) ||
                connectedNodes.includes(p.edge[symbols.targetNodeSym].id)) &&
              (nodesIdsInGroup.includes(p.edge[symbols.sourceNodeSym].id) ||
                nodesIdsInGroup.includes(p.edge[symbols.targetNodeSym].id))
            );
          })
          .classed("fadeout", false)
          .classed("half-active", true)
          .classed("dashed", true)
          .attr("stroke-dasharray", (d) =>
            Math.max(d.edge[symbols.edgeWidthSym] * 2, 2)
          );

        links
          .filter(
            (p) =>
              nodesIdsInGroup.includes(p.edge[symbols.sourceNodeSym].id) &&
              nodesIdsInGroup.includes(p.edge[symbols.targetNodeSym].id)
          )
          .classed("fadeout", false)
          .classed("active", true);
      });

      planes.on("mouseleave", () => {
        if (isDragging) {
          return;
        }
        links.classed("fadeout", false);
        links.classed("active", false);
        links.classed("half-active", false);
        links.classed("dashed", false);
        links.attr("stroke-dasharray", null);
        planes.classed("active", false);
        planes.classed("fadeout", false);
        planes.classed("half-active", false);
        points.classed("fadeout", false);
        points.classed("active", false);
        points.classed("half-active", false);
      });
    }

    function addEdgesHighlight(points, links) {
      points.on("mouseover", function (e, d) {
        if (isDragging) {
          return;
        }

        // fade out all other nodes, highlight a little connected ones
        points.classed("fadeout", true);

        points
          .filter((p) => {
            return (
              p !== d &&
              d[symbols.edgeSym].some(
                (edge) =>
                  edge[symbols.sourceNodeSym] === p ||
                  edge[symbols.targetNodeSym] === p
              )
            );
          })
          .classed("half-active", true)
          .classed("fadeout", false);

        // highlight current node
        select(this).classed("active", true).classed("fadeout", false);
        const edgeIdsOnThisNode = d[symbols.edgeSym].map(
          (edge) => edge[symbols.idSym]
        );

        // fadeout not connected edges, highlight connected ones
        links
          .classed(
            "fadeout",
            (p) => !edgeIdsOnThisNode.includes(p.edge[symbols.idSym])
          )
          .classed("active", (p) =>
            edgeIdsOnThisNode.includes(p.edge[symbols.idSym])
          );
      });

      points.on("mouseleave", function () {
        if (isDragging) {
          return;
        }
        links
          .classed("active", false)
          .classed("fadeout", false)
          .classed("half-active", false);
        points
          .classed("active", false)
          .classed("fadeout", false)
          .classed("half-active", false);
      });
    }

    init();

    if (tooltipParams.show) {
      this.tooltip.setup(el.querySelectorAll("[data-tooltip]"));
    }
  }
}

function getMarginsFromCSSString(str) {
  const splitted = str.trim().split(/\W+/);

  const res = {
    TOP: 0,
    RIGHT: 0,
    BOTTOM: 0,
    LEFT: 0,
  };

  switch (splitted.length) {
    case 1:
      res.TOP = res.RIGHT = res.BOTTOM = res.LEFT = parseInt(splitted[0]);
      break;
    case 2:
      res.TOP = res.BOTTOM = parseInt(splitted[0]);
      res.LEFT = res.RIGHT = parseInt(splitted[1]);
      break;
    case 3:
      res.TOP = parseInt(splitted[0]);
      res.LEFT = res.RIGHT = parseInt(splitted[1]);
      res.BOTTOM = parseInt(splitted[2]);
      break;
    case 4:
      res.TOP = parseInt(splitted[0]);
      res.RIGHT = parseInt(splitted[1]);
      res.BOTTOM = parseInt(splitted[2]);
      res.LEFT = parseInt(splitted[3]);
      break;
  }

  return res;
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': ForceGraph
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "layered-graph",
	"stanza:label": "Layered graph",
	"stanza:definition": "3D Layered graph MetaStanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE",
	"Einishi Tech"
],
	"stanza:created": "2022-04-01",
	"stanza:updated": "2022-11-02",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://gist.githubusercontent.com/abkunal/98d35b9b235312e90f3e43c9f7b6932b/raw/d5589ddd53731ae8eec7abd091320df91cdcf5cd/miserables.json",
		"stanza:description": "Data source URL",
		"stanza:required": true
	},
	{
		"stanza:key": "data-type",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"json",
			"tsv",
			"csv",
			"sparql-results-json"
		],
		"stanza:example": "json",
		"stanza:description": "Data type",
		"stanza:required": true
	},
	{
		"stanza:key": "group_planes-sort-key",
		"stanza:type": "string",
		"stanza:example": "group",
		"stanza:description": "Sort group planes by this data key value"
	},
	{
		"stanza:key": "group_planes-sort-order",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"ascending",
			"descending"
		],
		"stanza:example": "ascending",
		"stanza:description": "Group planes sorting order"
	},
	{
		"stanza:key": "nodes-sort-key",
		"stanza:type": "string",
		"stanza:example": "id",
		"stanza:description": "Sort nodes by this data key value"
	},
	{
		"stanza:key": "nodes-sort-order",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"ascending",
			"descending"
		],
		"stanza:example": "ascending",
		"stanza:description": "Nodes sorting order"
	},
	{
		"stanza:key": "node-size-key",
		"stanza:type": "string",
		"stanza:example": "group",
		"stanza:description": "Set size on the node based on data key"
	},
	{
		"stanza:key": "node-size-min",
		"stanza:type": "number",
		"stanza:example": 3,
		"stanza:description": "Minimum node radius in px"
	},
	{
		"stanza:key": "node-size-max",
		"stanza:type": "number",
		"stanza:example": 6,
		"stanza:description": "Maximum node radius in px"
	},
	{
		"stanza:key": "node-size-scale",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"linear",
			"sqrt",
			"log10"
		],
		"stanza:example": "sqrt",
		"stanza:description": "Node size scale"
	},
	{
		"stanza:key": "node-color-key",
		"stanza:type": "string",
		"stanza:example": "group",
		"stanza:description": "Set color of the node based on data key"
	},
	{
		"stanza:key": "edge-width-key",
		"stanza:type": "string",
		"stanza:example": "value",
		"stanza:description": "Set width of the edge  data key"
	},
	{
		"stanza:key": "edge-width-min",
		"stanza:type": "number",
		"stanza:example": 0.5,
		"stanza:description": "Minimum edge width in px"
	},
	{
		"stanza:key": "edge-width-max",
		"stanza:type": "number",
		"stanza:example": 3,
		"stanza:description": "Maximum edge width in px"
	},
	{
		"stanza:key": "edge-width-scale",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"linear",
			"sqrt",
			"log10"
		],
		"stanza:example": "linear",
		"stanza:description": "Edge width scale"
	},
	{
		"stanza:key": "edge-show_arrows",
		"stanza:type": "boolean",
		"stanza:example": "true",
		"stanza:description": "Show arrows"
	},
	{
		"stanza:key": "group_planes-constant_radius",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:description": "Constant radius for all groups"
	},
	{
		"stanza:key": "highlight-group_planes",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:description": "Highlight group planes on mouse hover"
	},
	{
		"stanza:key": "tooltips-key",
		"stanza:type": "string",
		"stanza:example": "id",
		"stanza:description": "Node tooltips data key. If empty, no tooltips will be shown"
	},
	{
		"stanza:key": "togostanza-custom_css_url",
		"stanza:example": "",
		"stanza:description": "Stylesheet(scss file) URL to override current style",
		"stanza:required": false
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-theme-series_0_color",
		"stanza:type": "color",
		"stanza:default": "#6590e6",
		"stanza:description": "Group color 0"
	},
	{
		"stanza:key": "--togostanza-theme-series_1_color",
		"stanza:type": "color",
		"stanza:default": "#3ac9b6",
		"stanza:description": "Group color 1"
	},
	{
		"stanza:key": "--togostanza-theme-series_2_color",
		"stanza:type": "color",
		"stanza:default": "#9ede2f",
		"stanza:description": "Group color 2"
	},
	{
		"stanza:key": "--togostanza-theme-series_3_color",
		"stanza:type": "color",
		"stanza:default": "#E6BB1A",
		"stanza:description": "Group color 3"
	},
	{
		"stanza:key": "--togostanza-theme-series_4_color",
		"stanza:type": "color",
		"stanza:default": "#F57F5B",
		"stanza:description": "Group color 4"
	},
	{
		"stanza:key": "--togostanza-theme-series_5_color",
		"stanza:type": "color",
		"stanza:default": "#F75976",
		"stanza:description": "Group color 5"
	},
	{
		"stanza:key": "--togostanza-outline-width",
		"stanza:type": "number",
		"stanza:default": 600,
		"stanza:description": "Width in px"
	},
	{
		"stanza:key": "--togostanza-outline-height",
		"stanza:type": "number",
		"stanza:default": 1000,
		"stanza:description": "Height in px"
	},
	{
		"stanza:key": "--togostanza-outline-padding",
		"stanza:type": "text",
		"stanza:default": "50",
		"stanza:description": "Inner padding in px"
	},
	{
		"stanza:key": "--togostanza-border-width",
		"stanza:type": "number",
		"stanza:default": 0,
		"stanza:description": "Nodes border width"
	},
	{
		"stanza:key": "--togostanza-border-color",
		"stanza:type": "color",
		"stanza:default": 0,
		"stanza:description": "Nodes border color"
	},
	{
		"stanza:key": "--togostanza-edge-color",
		"stanza:type": "color",
		"stanza:default": "#bdbdbd",
		"stanza:description": "Egdes default color"
	},
	{
		"stanza:key": "--togostanza-group_plane-color",
		"stanza:type": "color",
		"stanza:default": "#333333",
		"stanza:description": "Egdes default color"
	},
	{
		"stanza:key": "--togostanza-theme-background_color",
		"stanza:type": "color",
		"stanza:default": "rgba(255,255,255,0)",
		"stanza:description": "Background color"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"layered-graph\"></div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=layered-graph.js.map

import { S as Stanza, d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem, f as appendCustomCss, g as defineStanzaElement } from './index-ec45d824.js';
import { l as loadData } from './load-data-f1dd0e29.js';
import { T as ToolTip } from './ToolTip-88ebaba8.js';
import { L as Legend } from './Legend-3d7955e9.js';
import './ref-3bab6ed0.js';

var colorStringExports = {};
var colorString$1 = {
  get exports(){ return colorStringExports; },
  set exports(v){ colorStringExports = v; },
};

var colorName = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};

var simpleSwizzleExports = {};
var simpleSwizzle = {
  get exports(){ return simpleSwizzleExports; },
  set exports(v){ simpleSwizzleExports = v; },
};

var isArrayish$1 = function isArrayish(obj) {
	if (!obj || typeof obj === 'string') {
		return false;
	}

	return obj instanceof Array || Array.isArray(obj) ||
		(obj.length >= 0 && (obj.splice instanceof Function ||
			(Object.getOwnPropertyDescriptor(obj, (obj.length - 1)) && obj.constructor.name !== 'String')));
};

var isArrayish = isArrayish$1;

var concat = Array.prototype.concat;
var slice = Array.prototype.slice;

var swizzle$1 = simpleSwizzle.exports = function swizzle(args) {
	var results = [];

	for (var i = 0, len = args.length; i < len; i++) {
		var arg = args[i];

		if (isArrayish(arg)) {
			// http://jsperf.com/javascript-array-concat-vs-push/98
			results = concat.call(results, slice.call(arg));
		} else {
			results.push(arg);
		}
	}

	return results;
};

swizzle$1.wrap = function (fn) {
	return function () {
		return fn(swizzle$1(arguments));
	};
};

/* MIT license */

var colorNames = colorName;
var swizzle = simpleSwizzleExports;
var hasOwnProperty = Object.hasOwnProperty;

var reverseNames = Object.create(null);

// create a list of reverse color names
for (var name in colorNames) {
	if (hasOwnProperty.call(colorNames, name)) {
		reverseNames[colorNames[name]] = name;
	}
}

var cs = colorString$1.exports = {
	to: {},
	get: {}
};

cs.get = function (string) {
	var prefix = string.substring(0, 3).toLowerCase();
	var val;
	var model;
	switch (prefix) {
		case 'hsl':
			val = cs.get.hsl(string);
			model = 'hsl';
			break;
		case 'hwb':
			val = cs.get.hwb(string);
			model = 'hwb';
			break;
		default:
			val = cs.get.rgb(string);
			model = 'rgb';
			break;
	}

	if (!val) {
		return null;
	}

	return {model: model, value: val};
};

cs.get.rgb = function (string) {
	if (!string) {
		return null;
	}

	var abbr = /^#([a-f0-9]{3,4})$/i;
	var hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
	var rgba = /^rgba?\(\s*([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/;
	var per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/;
	var keyword = /^(\w+)$/;

	var rgb = [0, 0, 0, 1];
	var match;
	var i;
	var hexAlpha;

	if (match = string.match(hex)) {
		hexAlpha = match[2];
		match = match[1];

		for (i = 0; i < 3; i++) {
			// https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
			var i2 = i * 2;
			rgb[i] = parseInt(match.slice(i2, i2 + 2), 16);
		}

		if (hexAlpha) {
			rgb[3] = parseInt(hexAlpha, 16) / 255;
		}
	} else if (match = string.match(abbr)) {
		match = match[1];
		hexAlpha = match[3];

		for (i = 0; i < 3; i++) {
			rgb[i] = parseInt(match[i] + match[i], 16);
		}

		if (hexAlpha) {
			rgb[3] = parseInt(hexAlpha + hexAlpha, 16) / 255;
		}
	} else if (match = string.match(rgba)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = parseInt(match[i + 1], 0);
		}

		if (match[4]) {
			if (match[5]) {
				rgb[3] = parseFloat(match[4]) * 0.01;
			} else {
				rgb[3] = parseFloat(match[4]);
			}
		}
	} else if (match = string.match(per)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
		}

		if (match[4]) {
			if (match[5]) {
				rgb[3] = parseFloat(match[4]) * 0.01;
			} else {
				rgb[3] = parseFloat(match[4]);
			}
		}
	} else if (match = string.match(keyword)) {
		if (match[1] === 'transparent') {
			return [0, 0, 0, 0];
		}

		if (!hasOwnProperty.call(colorNames, match[1])) {
			return null;
		}

		rgb = colorNames[match[1]];
		rgb[3] = 1;

		return rgb;
	} else {
		return null;
	}

	for (i = 0; i < 3; i++) {
		rgb[i] = clamp(rgb[i], 0, 255);
	}
	rgb[3] = clamp(rgb[3], 0, 1);

	return rgb;
};

cs.get.hsl = function (string) {
	if (!string) {
		return null;
	}

	var hsl = /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d\.]+)%\s*,?\s*([+-]?[\d\.]+)%\s*(?:[,|\/]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/;
	var match = string.match(hsl);

	if (match) {
		var alpha = parseFloat(match[4]);
		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
		var s = clamp(parseFloat(match[2]), 0, 100);
		var l = clamp(parseFloat(match[3]), 0, 100);
		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);

		return [h, s, l, a];
	}

	return null;
};

cs.get.hwb = function (string) {
	if (!string) {
		return null;
	}

	var hwb = /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/;
	var match = string.match(hwb);

	if (match) {
		var alpha = parseFloat(match[4]);
		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
		var w = clamp(parseFloat(match[2]), 0, 100);
		var b = clamp(parseFloat(match[3]), 0, 100);
		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
		return [h, w, b, a];
	}

	return null;
};

cs.to.hex = function () {
	var rgba = swizzle(arguments);

	return (
		'#' +
		hexDouble(rgba[0]) +
		hexDouble(rgba[1]) +
		hexDouble(rgba[2]) +
		(rgba[3] < 1
			? (hexDouble(Math.round(rgba[3] * 255)))
			: '')
	);
};

cs.to.rgb = function () {
	var rgba = swizzle(arguments);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ')'
		: 'rgba(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ', ' + rgba[3] + ')';
};

cs.to.rgb.percent = function () {
	var rgba = swizzle(arguments);

	var r = Math.round(rgba[0] / 255 * 100);
	var g = Math.round(rgba[1] / 255 * 100);
	var b = Math.round(rgba[2] / 255 * 100);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + r + '%, ' + g + '%, ' + b + '%)'
		: 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')';
};

cs.to.hsl = function () {
	var hsla = swizzle(arguments);
	return hsla.length < 4 || hsla[3] === 1
		? 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)'
		: 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';
};

// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
// (hwb have alpha optional & 1 is default value)
cs.to.hwb = function () {
	var hwba = swizzle(arguments);

	var a = '';
	if (hwba.length >= 4 && hwba[3] !== 1) {
		a = ', ' + hwba[3];
	}

	return 'hwb(' + hwba[0] + ', ' + hwba[1] + '%, ' + hwba[2] + '%' + a + ')';
};

cs.to.keyword = function (rgb) {
	return reverseNames[rgb.slice(0, 3)];
};

// helpers
function clamp(num, min, max) {
	return Math.min(Math.max(min, num), max);
}

function hexDouble(num) {
	var str = Math.round(num).toString(16).toUpperCase();
	return (str.length < 2) ? '0' + str : str;
}

/* MIT license */

/* eslint-disable no-mixed-operators */
const cssKeywords = colorName;

// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)

const reverseKeywords = {};
for (const key of Object.keys(cssKeywords)) {
	reverseKeywords[cssKeywords[key]] = key;
}

const convert$2 = {
	rgb: {channels: 3, labels: 'rgb'},
	hsl: {channels: 3, labels: 'hsl'},
	hsv: {channels: 3, labels: 'hsv'},
	hwb: {channels: 3, labels: 'hwb'},
	cmyk: {channels: 4, labels: 'cmyk'},
	xyz: {channels: 3, labels: 'xyz'},
	lab: {channels: 3, labels: 'lab'},
	lch: {channels: 3, labels: 'lch'},
	hex: {channels: 1, labels: ['hex']},
	keyword: {channels: 1, labels: ['keyword']},
	ansi16: {channels: 1, labels: ['ansi16']},
	ansi256: {channels: 1, labels: ['ansi256']},
	hcg: {channels: 3, labels: ['h', 'c', 'g']},
	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
	gray: {channels: 1, labels: ['gray']}
};

var conversions$2 = convert$2;

// Hide .channels and .labels properties
for (const model of Object.keys(convert$2)) {
	if (!('channels' in convert$2[model])) {
		throw new Error('missing channels property: ' + model);
	}

	if (!('labels' in convert$2[model])) {
		throw new Error('missing channel labels property: ' + model);
	}

	if (convert$2[model].labels.length !== convert$2[model].channels) {
		throw new Error('channel and label counts mismatch: ' + model);
	}

	const {channels, labels} = convert$2[model];
	delete convert$2[model].channels;
	delete convert$2[model].labels;
	Object.defineProperty(convert$2[model], 'channels', {value: channels});
	Object.defineProperty(convert$2[model], 'labels', {value: labels});
}

convert$2.rgb.hsl = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const min = Math.min(r, g, b);
	const max = Math.max(r, g, b);
	const delta = max - min;
	let h;
	let s;

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	const l = (min + max) / 2;

	if (max === min) {
		s = 0;
	} else if (l <= 0.5) {
		s = delta / (max + min);
	} else {
		s = delta / (2 - max - min);
	}

	return [h, s * 100, l * 100];
};

convert$2.rgb.hsv = function (rgb) {
	let rdif;
	let gdif;
	let bdif;
	let h;
	let s;

	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const v = Math.max(r, g, b);
	const diff = v - Math.min(r, g, b);
	const diffc = function (c) {
		return (v - c) / 6 / diff + 1 / 2;
	};

	if (diff === 0) {
		h = 0;
		s = 0;
	} else {
		s = diff / v;
		rdif = diffc(r);
		gdif = diffc(g);
		bdif = diffc(b);

		if (r === v) {
			h = bdif - gdif;
		} else if (g === v) {
			h = (1 / 3) + rdif - bdif;
		} else if (b === v) {
			h = (2 / 3) + gdif - rdif;
		}

		if (h < 0) {
			h += 1;
		} else if (h > 1) {
			h -= 1;
		}
	}

	return [
		h * 360,
		s * 100,
		v * 100
	];
};

convert$2.rgb.hwb = function (rgb) {
	const r = rgb[0];
	const g = rgb[1];
	let b = rgb[2];
	const h = convert$2.rgb.hsl(rgb)[0];
	const w = 1 / 255 * Math.min(r, Math.min(g, b));

	b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

	return [h, w * 100, b * 100];
};

convert$2.rgb.cmyk = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;

	const k = Math.min(1 - r, 1 - g, 1 - b);
	const c = (1 - r - k) / (1 - k) || 0;
	const m = (1 - g - k) / (1 - k) || 0;
	const y = (1 - b - k) / (1 - k) || 0;

	return [c * 100, m * 100, y * 100, k * 100];
};

function comparativeDistance(x, y) {
	/*
		See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
	*/
	return (
		((x[0] - y[0]) ** 2) +
		((x[1] - y[1]) ** 2) +
		((x[2] - y[2]) ** 2)
	);
}

convert$2.rgb.keyword = function (rgb) {
	const reversed = reverseKeywords[rgb];
	if (reversed) {
		return reversed;
	}

	let currentClosestDistance = Infinity;
	let currentClosestKeyword;

	for (const keyword of Object.keys(cssKeywords)) {
		const value = cssKeywords[keyword];

		// Compute comparative distance
		const distance = comparativeDistance(rgb, value);

		// Check if its less, if so set as closest
		if (distance < currentClosestDistance) {
			currentClosestDistance = distance;
			currentClosestKeyword = keyword;
		}
	}

	return currentClosestKeyword;
};

convert$2.keyword.rgb = function (keyword) {
	return cssKeywords[keyword];
};

convert$2.rgb.xyz = function (rgb) {
	let r = rgb[0] / 255;
	let g = rgb[1] / 255;
	let b = rgb[2] / 255;

	// Assume sRGB
	r = r > 0.04045 ? (((r + 0.055) / 1.055) ** 2.4) : (r / 12.92);
	g = g > 0.04045 ? (((g + 0.055) / 1.055) ** 2.4) : (g / 12.92);
	b = b > 0.04045 ? (((b + 0.055) / 1.055) ** 2.4) : (b / 12.92);

	const x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
	const y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
	const z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

	return [x * 100, y * 100, z * 100];
};

convert$2.rgb.lab = function (rgb) {
	const xyz = convert$2.rgb.xyz(rgb);
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert$2.hsl.rgb = function (hsl) {
	const h = hsl[0] / 360;
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;
	let t2;
	let t3;
	let val;

	if (s === 0) {
		val = l * 255;
		return [val, val, val];
	}

	if (l < 0.5) {
		t2 = l * (1 + s);
	} else {
		t2 = l + s - l * s;
	}

	const t1 = 2 * l - t2;

	const rgb = [0, 0, 0];
	for (let i = 0; i < 3; i++) {
		t3 = h + 1 / 3 * -(i - 1);
		if (t3 < 0) {
			t3++;
		}

		if (t3 > 1) {
			t3--;
		}

		if (6 * t3 < 1) {
			val = t1 + (t2 - t1) * 6 * t3;
		} else if (2 * t3 < 1) {
			val = t2;
		} else if (3 * t3 < 2) {
			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
		} else {
			val = t1;
		}

		rgb[i] = val * 255;
	}

	return rgb;
};

convert$2.hsl.hsv = function (hsl) {
	const h = hsl[0];
	let s = hsl[1] / 100;
	let l = hsl[2] / 100;
	let smin = s;
	const lmin = Math.max(l, 0.01);

	l *= 2;
	s *= (l <= 1) ? l : 2 - l;
	smin *= lmin <= 1 ? lmin : 2 - lmin;
	const v = (l + s) / 2;
	const sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

	return [h, sv * 100, v * 100];
};

convert$2.hsv.rgb = function (hsv) {
	const h = hsv[0] / 60;
	const s = hsv[1] / 100;
	let v = hsv[2] / 100;
	const hi = Math.floor(h) % 6;

	const f = h - Math.floor(h);
	const p = 255 * v * (1 - s);
	const q = 255 * v * (1 - (s * f));
	const t = 255 * v * (1 - (s * (1 - f)));
	v *= 255;

	switch (hi) {
		case 0:
			return [v, t, p];
		case 1:
			return [q, v, p];
		case 2:
			return [p, v, t];
		case 3:
			return [p, q, v];
		case 4:
			return [t, p, v];
		case 5:
			return [v, p, q];
	}
};

convert$2.hsv.hsl = function (hsv) {
	const h = hsv[0];
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;
	const vmin = Math.max(v, 0.01);
	let sl;
	let l;

	l = (2 - s) * v;
	const lmin = (2 - s) * vmin;
	sl = s * vmin;
	sl /= (lmin <= 1) ? lmin : 2 - lmin;
	sl = sl || 0;
	l /= 2;

	return [h, sl * 100, l * 100];
};

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
convert$2.hwb.rgb = function (hwb) {
	const h = hwb[0] / 360;
	let wh = hwb[1] / 100;
	let bl = hwb[2] / 100;
	const ratio = wh + bl;
	let f;

	// Wh + bl cant be > 1
	if (ratio > 1) {
		wh /= ratio;
		bl /= ratio;
	}

	const i = Math.floor(6 * h);
	const v = 1 - bl;
	f = 6 * h - i;

	if ((i & 0x01) !== 0) {
		f = 1 - f;
	}

	const n = wh + f * (v - wh); // Linear interpolation

	let r;
	let g;
	let b;
	/* eslint-disable max-statements-per-line,no-multi-spaces */
	switch (i) {
		default:
		case 6:
		case 0: r = v;  g = n;  b = wh; break;
		case 1: r = n;  g = v;  b = wh; break;
		case 2: r = wh; g = v;  b = n; break;
		case 3: r = wh; g = n;  b = v; break;
		case 4: r = n;  g = wh; b = v; break;
		case 5: r = v;  g = wh; b = n; break;
	}
	/* eslint-enable max-statements-per-line,no-multi-spaces */

	return [r * 255, g * 255, b * 255];
};

convert$2.cmyk.rgb = function (cmyk) {
	const c = cmyk[0] / 100;
	const m = cmyk[1] / 100;
	const y = cmyk[2] / 100;
	const k = cmyk[3] / 100;

	const r = 1 - Math.min(1, c * (1 - k) + k);
	const g = 1 - Math.min(1, m * (1 - k) + k);
	const b = 1 - Math.min(1, y * (1 - k) + k);

	return [r * 255, g * 255, b * 255];
};

convert$2.xyz.rgb = function (xyz) {
	const x = xyz[0] / 100;
	const y = xyz[1] / 100;
	const z = xyz[2] / 100;
	let r;
	let g;
	let b;

	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

	// Assume sRGB
	r = r > 0.0031308
		? ((1.055 * (r ** (1.0 / 2.4))) - 0.055)
		: r * 12.92;

	g = g > 0.0031308
		? ((1.055 * (g ** (1.0 / 2.4))) - 0.055)
		: g * 12.92;

	b = b > 0.0031308
		? ((1.055 * (b ** (1.0 / 2.4))) - 0.055)
		: b * 12.92;

	r = Math.min(Math.max(0, r), 1);
	g = Math.min(Math.max(0, g), 1);
	b = Math.min(Math.max(0, b), 1);

	return [r * 255, g * 255, b * 255];
};

convert$2.xyz.lab = function (xyz) {
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert$2.lab.xyz = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let x;
	let y;
	let z;

	y = (l + 16) / 116;
	x = a / 500 + y;
	z = y - b / 200;

	const y2 = y ** 3;
	const x2 = x ** 3;
	const z2 = z ** 3;
	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

	x *= 95.047;
	y *= 100;
	z *= 108.883;

	return [x, y, z];
};

convert$2.lab.lch = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let h;

	const hr = Math.atan2(b, a);
	h = hr * 360 / 2 / Math.PI;

	if (h < 0) {
		h += 360;
	}

	const c = Math.sqrt(a * a + b * b);

	return [l, c, h];
};

convert$2.lch.lab = function (lch) {
	const l = lch[0];
	const c = lch[1];
	const h = lch[2];

	const hr = h / 360 * 2 * Math.PI;
	const a = c * Math.cos(hr);
	const b = c * Math.sin(hr);

	return [l, a, b];
};

convert$2.rgb.ansi16 = function (args, saturation = null) {
	const [r, g, b] = args;
	let value = saturation === null ? convert$2.rgb.hsv(args)[2] : saturation; // Hsv -> ansi16 optimization

	value = Math.round(value / 50);

	if (value === 0) {
		return 30;
	}

	let ansi = 30
		+ ((Math.round(b / 255) << 2)
		| (Math.round(g / 255) << 1)
		| Math.round(r / 255));

	if (value === 2) {
		ansi += 60;
	}

	return ansi;
};

convert$2.hsv.ansi16 = function (args) {
	// Optimization here; we already know the value and don't need to get
	// it converted for us.
	return convert$2.rgb.ansi16(convert$2.hsv.rgb(args), args[2]);
};

convert$2.rgb.ansi256 = function (args) {
	const r = args[0];
	const g = args[1];
	const b = args[2];

	// We use the extended greyscale palette here, with the exception of
	// black and white. normal palette only has 4 greyscale shades.
	if (r === g && g === b) {
		if (r < 8) {
			return 16;
		}

		if (r > 248) {
			return 231;
		}

		return Math.round(((r - 8) / 247) * 24) + 232;
	}

	const ansi = 16
		+ (36 * Math.round(r / 255 * 5))
		+ (6 * Math.round(g / 255 * 5))
		+ Math.round(b / 255 * 5);

	return ansi;
};

convert$2.ansi16.rgb = function (args) {
	let color = args % 10;

	// Handle greyscale
	if (color === 0 || color === 7) {
		if (args > 50) {
			color += 3.5;
		}

		color = color / 10.5 * 255;

		return [color, color, color];
	}

	const mult = (~~(args > 50) + 1) * 0.5;
	const r = ((color & 1) * mult) * 255;
	const g = (((color >> 1) & 1) * mult) * 255;
	const b = (((color >> 2) & 1) * mult) * 255;

	return [r, g, b];
};

convert$2.ansi256.rgb = function (args) {
	// Handle greyscale
	if (args >= 232) {
		const c = (args - 232) * 10 + 8;
		return [c, c, c];
	}

	args -= 16;

	let rem;
	const r = Math.floor(args / 36) / 5 * 255;
	const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
	const b = (rem % 6) / 5 * 255;

	return [r, g, b];
};

convert$2.rgb.hex = function (args) {
	const integer = ((Math.round(args[0]) & 0xFF) << 16)
		+ ((Math.round(args[1]) & 0xFF) << 8)
		+ (Math.round(args[2]) & 0xFF);

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert$2.hex.rgb = function (args) {
	const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
	if (!match) {
		return [0, 0, 0];
	}

	let colorString = match[0];

	if (match[0].length === 3) {
		colorString = colorString.split('').map(char => {
			return char + char;
		}).join('');
	}

	const integer = parseInt(colorString, 16);
	const r = (integer >> 16) & 0xFF;
	const g = (integer >> 8) & 0xFF;
	const b = integer & 0xFF;

	return [r, g, b];
};

convert$2.rgb.hcg = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const max = Math.max(Math.max(r, g), b);
	const min = Math.min(Math.min(r, g), b);
	const chroma = (max - min);
	let grayscale;
	let hue;

	if (chroma < 1) {
		grayscale = min / (1 - chroma);
	} else {
		grayscale = 0;
	}

	if (chroma <= 0) {
		hue = 0;
	} else
	if (max === r) {
		hue = ((g - b) / chroma) % 6;
	} else
	if (max === g) {
		hue = 2 + (b - r) / chroma;
	} else {
		hue = 4 + (r - g) / chroma;
	}

	hue /= 6;
	hue %= 1;

	return [hue * 360, chroma * 100, grayscale * 100];
};

convert$2.hsl.hcg = function (hsl) {
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;

	const c = l < 0.5 ? (2.0 * s * l) : (2.0 * s * (1.0 - l));

	let f = 0;
	if (c < 1.0) {
		f = (l - 0.5 * c) / (1.0 - c);
	}

	return [hsl[0], c * 100, f * 100];
};

convert$2.hsv.hcg = function (hsv) {
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;

	const c = s * v;
	let f = 0;

	if (c < 1.0) {
		f = (v - c) / (1 - c);
	}

	return [hsv[0], c * 100, f * 100];
};

convert$2.hcg.rgb = function (hcg) {
	const h = hcg[0] / 360;
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	if (c === 0.0) {
		return [g * 255, g * 255, g * 255];
	}

	const pure = [0, 0, 0];
	const hi = (h % 1) * 6;
	const v = hi % 1;
	const w = 1 - v;
	let mg = 0;

	/* eslint-disable max-statements-per-line */
	switch (Math.floor(hi)) {
		case 0:
			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
		case 1:
			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
		case 2:
			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
		case 3:
			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
		case 4:
			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
		default:
			pure[0] = 1; pure[1] = 0; pure[2] = w;
	}
	/* eslint-enable max-statements-per-line */

	mg = (1.0 - c) * g;

	return [
		(c * pure[0] + mg) * 255,
		(c * pure[1] + mg) * 255,
		(c * pure[2] + mg) * 255
	];
};

convert$2.hcg.hsv = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const v = c + g * (1.0 - c);
	let f = 0;

	if (v > 0.0) {
		f = c / v;
	}

	return [hcg[0], f * 100, v * 100];
};

convert$2.hcg.hsl = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const l = g * (1.0 - c) + 0.5 * c;
	let s = 0;

	if (l > 0.0 && l < 0.5) {
		s = c / (2 * l);
	} else
	if (l >= 0.5 && l < 1.0) {
		s = c / (2 * (1 - l));
	}

	return [hcg[0], s * 100, l * 100];
};

convert$2.hcg.hwb = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;
	const v = c + g * (1.0 - c);
	return [hcg[0], (v - c) * 100, (1 - v) * 100];
};

convert$2.hwb.hcg = function (hwb) {
	const w = hwb[1] / 100;
	const b = hwb[2] / 100;
	const v = 1 - b;
	const c = v - w;
	let g = 0;

	if (c < 1) {
		g = (v - c) / (1 - c);
	}

	return [hwb[0], c * 100, g * 100];
};

convert$2.apple.rgb = function (apple) {
	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};

convert$2.rgb.apple = function (rgb) {
	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};

convert$2.gray.rgb = function (args) {
	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};

convert$2.gray.hsl = function (args) {
	return [0, 0, args[0]];
};

convert$2.gray.hsv = convert$2.gray.hsl;

convert$2.gray.hwb = function (gray) {
	return [0, 100, gray[0]];
};

convert$2.gray.cmyk = function (gray) {
	return [0, 0, 0, gray[0]];
};

convert$2.gray.lab = function (gray) {
	return [gray[0], 0, 0];
};

convert$2.gray.hex = function (gray) {
	const val = Math.round(gray[0] / 100 * 255) & 0xFF;
	const integer = (val << 16) + (val << 8) + val;

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert$2.rgb.gray = function (rgb) {
	const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
	return [val / 255 * 100];
};

const conversions$1 = conversions$2;

/*
	This function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

function buildGraph() {
	const graph = {};
	// https://jsperf.com/object-keys-vs-for-in-with-closure/3
	const models = Object.keys(conversions$1);

	for (let len = models.length, i = 0; i < len; i++) {
		graph[models[i]] = {
			// http://jsperf.com/1-vs-infinity
			// micro-opt, but this is simple.
			distance: -1,
			parent: null
		};
	}

	return graph;
}

// https://en.wikipedia.org/wiki/Breadth-first_search
function deriveBFS(fromModel) {
	const graph = buildGraph();
	const queue = [fromModel]; // Unshift -> queue -> pop

	graph[fromModel].distance = 0;

	while (queue.length) {
		const current = queue.pop();
		const adjacents = Object.keys(conversions$1[current]);

		for (let len = adjacents.length, i = 0; i < len; i++) {
			const adjacent = adjacents[i];
			const node = graph[adjacent];

			if (node.distance === -1) {
				node.distance = graph[current].distance + 1;
				node.parent = current;
				queue.unshift(adjacent);
			}
		}
	}

	return graph;
}

function link(from, to) {
	return function (args) {
		return to(from(args));
	};
}

function wrapConversion(toModel, graph) {
	const path = [graph[toModel].parent, toModel];
	let fn = conversions$1[graph[toModel].parent][toModel];

	let cur = graph[toModel].parent;
	while (graph[cur].parent) {
		path.unshift(graph[cur].parent);
		fn = link(conversions$1[graph[cur].parent][cur], fn);
		cur = graph[cur].parent;
	}

	fn.conversion = path;
	return fn;
}

var route$1 = function (fromModel) {
	const graph = deriveBFS(fromModel);
	const conversion = {};

	const models = Object.keys(graph);
	for (let len = models.length, i = 0; i < len; i++) {
		const toModel = models[i];
		const node = graph[toModel];

		if (node.parent === null) {
			// No possible conversion, or this node is the source model.
			continue;
		}

		conversion[toModel] = wrapConversion(toModel, graph);
	}

	return conversion;
};

const conversions = conversions$2;
const route = route$1;

const convert$1 = {};

const models = Object.keys(conversions);

function wrapRaw(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];
		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		return fn(args);
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

function wrapRounded(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];

		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		const result = fn(args);

		// We're assuming the result is an array here.
		// see notice in conversions.js; don't use box types
		// in conversion functions.
		if (typeof result === 'object') {
			for (let len = result.length, i = 0; i < len; i++) {
				result[i] = Math.round(result[i]);
			}
		}

		return result;
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

models.forEach(fromModel => {
	convert$1[fromModel] = {};

	Object.defineProperty(convert$1[fromModel], 'channels', {value: conversions[fromModel].channels});
	Object.defineProperty(convert$1[fromModel], 'labels', {value: conversions[fromModel].labels});

	const routes = route(fromModel);
	const routeModels = Object.keys(routes);

	routeModels.forEach(toModel => {
		const fn = routes[toModel];

		convert$1[fromModel][toModel] = wrapRounded(fn);
		convert$1[fromModel][toModel].raw = wrapRaw(fn);
	});
});

var colorConvert = convert$1;

const colorString = colorStringExports;
const convert = colorConvert;

const skippedModels = [
	// To be honest, I don't really feel like keyword belongs in color convert, but eh.
	'keyword',

	// Gray conflicts with some method names, and has its own method defined.
	'gray',

	// Shouldn't really be in color-convert either...
	'hex',
];

const hashedModelKeys = {};
for (const model of Object.keys(convert)) {
	hashedModelKeys[[...convert[model].labels].sort().join('')] = model;
}

const limiters = {};

function Color(object, model) {
	if (!(this instanceof Color)) {
		return new Color(object, model);
	}

	if (model && model in skippedModels) {
		model = null;
	}

	if (model && !(model in convert)) {
		throw new Error('Unknown model: ' + model);
	}

	let i;
	let channels;

	if (object == null) { // eslint-disable-line no-eq-null,eqeqeq
		this.model = 'rgb';
		this.color = [0, 0, 0];
		this.valpha = 1;
	} else if (object instanceof Color) {
		this.model = object.model;
		this.color = [...object.color];
		this.valpha = object.valpha;
	} else if (typeof object === 'string') {
		const result = colorString.get(object);
		if (result === null) {
			throw new Error('Unable to parse color from string: ' + object);
		}

		this.model = result.model;
		channels = convert[this.model].channels;
		this.color = result.value.slice(0, channels);
		this.valpha = typeof result.value[channels] === 'number' ? result.value[channels] : 1;
	} else if (object.length > 0) {
		this.model = model || 'rgb';
		channels = convert[this.model].channels;
		const newArray = Array.prototype.slice.call(object, 0, channels);
		this.color = zeroArray(newArray, channels);
		this.valpha = typeof object[channels] === 'number' ? object[channels] : 1;
	} else if (typeof object === 'number') {
		// This is always RGB - can be converted later on.
		this.model = 'rgb';
		this.color = [
			(object >> 16) & 0xFF,
			(object >> 8) & 0xFF,
			object & 0xFF,
		];
		this.valpha = 1;
	} else {
		this.valpha = 1;

		const keys = Object.keys(object);
		if ('alpha' in object) {
			keys.splice(keys.indexOf('alpha'), 1);
			this.valpha = typeof object.alpha === 'number' ? object.alpha : 0;
		}

		const hashedKeys = keys.sort().join('');
		if (!(hashedKeys in hashedModelKeys)) {
			throw new Error('Unable to parse color from object: ' + JSON.stringify(object));
		}

		this.model = hashedModelKeys[hashedKeys];

		const {labels} = convert[this.model];
		const color = [];
		for (i = 0; i < labels.length; i++) {
			color.push(object[labels[i]]);
		}

		this.color = zeroArray(color);
	}

	// Perform limitations (clamping, etc.)
	if (limiters[this.model]) {
		channels = convert[this.model].channels;
		for (i = 0; i < channels; i++) {
			const limit = limiters[this.model][i];
			if (limit) {
				this.color[i] = limit(this.color[i]);
			}
		}
	}

	this.valpha = Math.max(0, Math.min(1, this.valpha));

	if (Object.freeze) {
		Object.freeze(this);
	}
}

Color.prototype = {
	toString() {
		return this.string();
	},

	toJSON() {
		return this[this.model]();
	},

	string(places) {
		let self = this.model in colorString.to ? this : this.rgb();
		self = self.round(typeof places === 'number' ? places : 1);
		const args = self.valpha === 1 ? self.color : [...self.color, this.valpha];
		return colorString.to[self.model](args);
	},

	percentString(places) {
		const self = this.rgb().round(typeof places === 'number' ? places : 1);
		const args = self.valpha === 1 ? self.color : [...self.color, this.valpha];
		return colorString.to.rgb.percent(args);
	},

	array() {
		return this.valpha === 1 ? [...this.color] : [...this.color, this.valpha];
	},

	object() {
		const result = {};
		const {channels} = convert[this.model];
		const {labels} = convert[this.model];

		for (let i = 0; i < channels; i++) {
			result[labels[i]] = this.color[i];
		}

		if (this.valpha !== 1) {
			result.alpha = this.valpha;
		}

		return result;
	},

	unitArray() {
		const rgb = this.rgb().color;
		rgb[0] /= 255;
		rgb[1] /= 255;
		rgb[2] /= 255;

		if (this.valpha !== 1) {
			rgb.push(this.valpha);
		}

		return rgb;
	},

	unitObject() {
		const rgb = this.rgb().object();
		rgb.r /= 255;
		rgb.g /= 255;
		rgb.b /= 255;

		if (this.valpha !== 1) {
			rgb.alpha = this.valpha;
		}

		return rgb;
	},

	round(places) {
		places = Math.max(places || 0, 0);
		return new Color([...this.color.map(roundToPlace(places)), this.valpha], this.model);
	},

	alpha(value) {
		if (value !== undefined) {
			return new Color([...this.color, Math.max(0, Math.min(1, value))], this.model);
		}

		return this.valpha;
	},

	// Rgb
	red: getset('rgb', 0, maxfn(255)),
	green: getset('rgb', 1, maxfn(255)),
	blue: getset('rgb', 2, maxfn(255)),

	hue: getset(['hsl', 'hsv', 'hsl', 'hwb', 'hcg'], 0, value => ((value % 360) + 360) % 360),

	saturationl: getset('hsl', 1, maxfn(100)),
	lightness: getset('hsl', 2, maxfn(100)),

	saturationv: getset('hsv', 1, maxfn(100)),
	value: getset('hsv', 2, maxfn(100)),

	chroma: getset('hcg', 1, maxfn(100)),
	gray: getset('hcg', 2, maxfn(100)),

	white: getset('hwb', 1, maxfn(100)),
	wblack: getset('hwb', 2, maxfn(100)),

	cyan: getset('cmyk', 0, maxfn(100)),
	magenta: getset('cmyk', 1, maxfn(100)),
	yellow: getset('cmyk', 2, maxfn(100)),
	black: getset('cmyk', 3, maxfn(100)),

	x: getset('xyz', 0, maxfn(95.047)),
	y: getset('xyz', 1, maxfn(100)),
	z: getset('xyz', 2, maxfn(108.833)),

	l: getset('lab', 0, maxfn(100)),
	a: getset('lab', 1),
	b: getset('lab', 2),

	keyword(value) {
		if (value !== undefined) {
			return new Color(value);
		}

		return convert[this.model].keyword(this.color);
	},

	hex(value) {
		if (value !== undefined) {
			return new Color(value);
		}

		return colorString.to.hex(this.rgb().round().color);
	},

	hexa(value) {
		if (value !== undefined) {
			return new Color(value);
		}

		const rgbArray = this.rgb().round().color;

		let alphaHex = Math.round(this.valpha * 255).toString(16).toUpperCase();
		if (alphaHex.length === 1) {
			alphaHex = '0' + alphaHex;
		}

		return colorString.to.hex(rgbArray) + alphaHex;
	},

	rgbNumber() {
		const rgb = this.rgb().color;
		return ((rgb[0] & 0xFF) << 16) | ((rgb[1] & 0xFF) << 8) | (rgb[2] & 0xFF);
	},

	luminosity() {
		// http://www.w3.org/TR/WCAG20/#relativeluminancedef
		const rgb = this.rgb().color;

		const lum = [];
		for (const [i, element] of rgb.entries()) {
			const chan = element / 255;
			lum[i] = (chan <= 0.04045) ? chan / 12.92 : ((chan + 0.055) / 1.055) ** 2.4;
		}

		return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
	},

	contrast(color2) {
		// http://www.w3.org/TR/WCAG20/#contrast-ratiodef
		const lum1 = this.luminosity();
		const lum2 = color2.luminosity();

		if (lum1 > lum2) {
			return (lum1 + 0.05) / (lum2 + 0.05);
		}

		return (lum2 + 0.05) / (lum1 + 0.05);
	},

	level(color2) {
		// https://www.w3.org/TR/WCAG/#contrast-enhanced
		const contrastRatio = this.contrast(color2);
		if (contrastRatio >= 7) {
			return 'AAA';
		}

		return (contrastRatio >= 4.5) ? 'AA' : '';
	},

	isDark() {
		// YIQ equation from http://24ways.org/2010/calculating-color-contrast
		const rgb = this.rgb().color;
		const yiq = (rgb[0] * 2126 + rgb[1] * 7152 + rgb[2] * 722) / 10000;
		return yiq < 128;
	},

	isLight() {
		return !this.isDark();
	},

	negate() {
		const rgb = this.rgb();
		for (let i = 0; i < 3; i++) {
			rgb.color[i] = 255 - rgb.color[i];
		}

		return rgb;
	},

	lighten(ratio) {
		const hsl = this.hsl();
		hsl.color[2] += hsl.color[2] * ratio;
		return hsl;
	},

	darken(ratio) {
		const hsl = this.hsl();
		hsl.color[2] -= hsl.color[2] * ratio;
		return hsl;
	},

	saturate(ratio) {
		const hsl = this.hsl();
		hsl.color[1] += hsl.color[1] * ratio;
		return hsl;
	},

	desaturate(ratio) {
		const hsl = this.hsl();
		hsl.color[1] -= hsl.color[1] * ratio;
		return hsl;
	},

	whiten(ratio) {
		const hwb = this.hwb();
		hwb.color[1] += hwb.color[1] * ratio;
		return hwb;
	},

	blacken(ratio) {
		const hwb = this.hwb();
		hwb.color[2] += hwb.color[2] * ratio;
		return hwb;
	},

	grayscale() {
		// http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
		const rgb = this.rgb().color;
		const value = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
		return Color.rgb(value, value, value);
	},

	fade(ratio) {
		return this.alpha(this.valpha - (this.valpha * ratio));
	},

	opaquer(ratio) {
		return this.alpha(this.valpha + (this.valpha * ratio));
	},

	rotate(degrees) {
		const hsl = this.hsl();
		let hue = hsl.color[0];
		hue = (hue + degrees) % 360;
		hue = hue < 0 ? 360 + hue : hue;
		hsl.color[0] = hue;
		return hsl;
	},

	mix(mixinColor, weight) {
		// Ported from sass implementation in C
		// https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
		if (!mixinColor || !mixinColor.rgb) {
			throw new Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof mixinColor);
		}

		const color1 = mixinColor.rgb();
		const color2 = this.rgb();
		const p = weight === undefined ? 0.5 : weight;

		const w = 2 * p - 1;
		const a = color1.alpha() - color2.alpha();

		const w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2;
		const w2 = 1 - w1;

		return Color.rgb(
			w1 * color1.red() + w2 * color2.red(),
			w1 * color1.green() + w2 * color2.green(),
			w1 * color1.blue() + w2 * color2.blue(),
			color1.alpha() * p + color2.alpha() * (1 - p));
	},
};

// Model conversion methods and static constructors
for (const model of Object.keys(convert)) {
	if (skippedModels.includes(model)) {
		continue;
	}

	const {channels} = convert[model];

	// Conversion methods
	Color.prototype[model] = function (...args) {
		if (this.model === model) {
			return new Color(this);
		}

		if (args.length > 0) {
			return new Color(args, model);
		}

		return new Color([...assertArray(convert[this.model][model].raw(this.color)), this.valpha], model);
	};

	// 'static' construction methods
	Color[model] = function (...args) {
		let color = args[0];
		if (typeof color === 'number') {
			color = zeroArray(args, channels);
		}

		return new Color(color, model);
	};
}

function roundTo(number, places) {
	return Number(number.toFixed(places));
}

function roundToPlace(places) {
	return function (number) {
		return roundTo(number, places);
	};
}

function getset(model, channel, modifier) {
	model = Array.isArray(model) ? model : [model];

	for (const m of model) {
		(limiters[m] || (limiters[m] = []))[channel] = modifier;
	}

	model = model[0];

	return function (value) {
		let result;

		if (value !== undefined) {
			if (modifier) {
				value = modifier(value);
			}

			result = this[model]();
			result.color[channel] = value;
			return result;
		}

		result = this[model]().color[channel];
		if (modifier) {
			result = modifier(result);
		}

		return result;
	};
}

function maxfn(max) {
	return function (v) {
		return Math.max(0, Math.min(max, v));
	};
}

function assertArray(value) {
	return Array.isArray(value) ? value : [value];
}

function zeroArray(array, length) {
	for (let i = 0; i < length; i++) {
		if (typeof array[i] !== 'number') {
			array[i] = 0;
		}
	}

	return array;
}

var color = Color;

var Color$1 = color;

const LINE_HEIGHT = 1;

class VennStanza extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "vennstanza"),
      downloadPngMenuItem(this, "vennstanza"),
      downloadJSONMenuItem(this, "vennstanza", this.data),
      downloadCSVMenuItem(this, "vennstanza", this.data),
      downloadTSVMenuItem(this, "vennstanza", this.data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["togostanza-custom_css_url"]);
    this.colorSeries = this.getColorSeries();

    this.renderTemplate({ template: "stanza.html.hbs" });

    // append tooltip, legend
    const root = this.root.querySelector("main");
    if (!this.tooltip) {
      this.tooltip = new ToolTip();
      root.append(this.tooltip);
      this.legend = new Legend();
      root.append(this.legend);
    }

    // get data
    this.data = await this.getData();
    this.totals = this.data.map((datum) => {
      const total = {
        set: datum.set,
        size: 0,
      };
      const matchedData = this.data.filter((datum2) =>
        datum.set.every((item) => datum2.set.indexOf(item) !== -1)
      );
      total.size = matchedData.reduce((acc, datum) => acc + datum.size, 0);
      return total;
    });
    this.dataLabels = Array.from(
      new Set(this.data.map((datum) => datum.set).flat())
    );
    this.numberOfData = this.dataLabels.length;
    this.venn = new Map();

    // draw
    this.drawVennDiagram();
  }

  drawVennDiagram() {
    // set common parameters and styles
    const container = this.root.querySelector("#venn-diagrams");

    const getPropertyValue = (key) =>
      window.getComputedStyle(this.element).getPropertyValue(key);
    const svgWidth = getPropertyValue(`--togostanza-canvas-width`);
    const svgHeight = getPropertyValue(`--togostanza-canvas-height`);
    container.style.width = svgWidth + "px";
    container.style.height = svgHeight + "px";

    // show venn diagram corresponds to data(circle numbers to draw)
    const selectedDiagram = this.root.querySelector(
      `.venn-diagram[data-number-of-data="${this.numberOfData}"]`
    );
    const padding = +getPropertyValue(`--togostanza-canvas-padding`);
    if (!selectedDiagram) {
      console.error(
        "Venn diagrams with more than six elements are not supported. Please try using Euler diagrams."
      );
      return;
    }
    selectedDiagram.classList.add("-current");
    this.venn.set("node", selectedDiagram);

    // set scale
    const containerRect = this.root
      .querySelector("main")
      .getBoundingClientRect();
    const rect = selectedDiagram.getBoundingClientRect();
    const margin =
      Math.max(rect.x - containerRect.x, rect.y - containerRect.y) + padding;
    const scale = Math.min(
      svgWidth / (rect.width + margin * 2),
      svgHeight / (rect.height + margin * 2)
    );
    selectedDiagram.style.transform = `translate(${padding}px, ${padding}px) scale(${scale})`;

    // typography
    const fontStyles = [
      {
        className: "label",
        varSuffix: "primary",
      },
      {
        className: "value",
        varSuffix: "secondary",
      },
    ].map(({ className, varSuffix }) => {
      const fontSize = +window
        .getComputedStyle(this.element)
        .getPropertyValue(`--togostanza-fonts-font_size_${varSuffix}`);
      const actualFontSize = fontSize / scale;
      selectedDiagram.querySelectorAll(`text.${className}`).forEach((text) => {
        text.style.fontSize = actualFontSize + "px";
      });
      return { className, varSuffix, fontSize, actualFontSize };
    });
    let textShiftY =
      fontStyles.reduce((acc, style) => acc + style.fontSize, 0) *
      LINE_HEIGHT *
      -0.5;
    selectedDiagram
      .querySelectorAll("text.label")
      .forEach((text) => text.setAttribute("dy", textShiftY));
    textShiftY += fontStyles[1].actualFontSize * LINE_HEIGHT;
    selectedDiagram
      .querySelectorAll("text.value")
      .forEach((text) => text.setAttribute("dy", textShiftY));

    // shapes
    selectedDiagram.querySelectorAll(":scope > g").forEach((group) => {
      const targets = group.dataset.targets.split(",").map((target) => +target);
      const labels = targets.map((target) => this.dataLabels[target]);
      const count =
        this.data.find((datum) => {
          return (
            datum.set.length === labels.length &&
            labels.every((label) =>
              datum.set.find((label2) => label === label2)
            )
          );
        })?.size ?? "";
      // set color
      const color = this.getBlendedColor(targets);
      group
        .querySelector(":scope > .part")
        .setAttribute("fill", color.toString());
      // set label
      group.querySelector(":scope .text > text.label").textContent =
        labels.join(",");
      group.querySelector(":scope .text > text.value").textContent = count;
      // interaction
      group.addEventListener("mouseenter", () =>
        selectedDiagram.classList.add("-hovering")
      );
      group.addEventListener("mouseleave", () =>
        selectedDiagram.classList.remove("-hovering")
      );
      // tooltip
      group.dataset.tooltip = `<strong>${labels.join("∩")}</strong>: ${count}`;
      group.dataset.tooltipHtml = true;
    });
    this.tooltip.setup(selectedDiagram.querySelectorAll("[data-tooltip]"));

    // legend
    const items = this.data.map((datum) => {
      const id = datum.set
        .map((item) => this.dataLabels.indexOf(item))
        .sort()
        .join(",");
      const color = this.getBlendedColor(
        datum.set.map((item) => this.dataLabels.indexOf(item))
      );
      return Object.fromEntries([
        ["id", id],
        ["label", datum.set.map((item) => item).join("∩")],
        ["color", color.toString()],
        ["value", datum.size],
        [
          "node",
          selectedDiagram.querySelector(`:scope > g[data-targets="${id}"]`),
        ],
      ]);
    });
    this.legend.setup(items, this.root.querySelector("main"), {
      fadeoutNodes: selectedDiagram.querySelectorAll(":scope > g"),
      showLeaders: true,
    });
  }

  getColorSeries() {
    const getPropertyValue = (key) =>
      window.getComputedStyle(this.element).getPropertyValue(key);
    const series = Array(6);
    for (let i = 0; i < series.length; i++) {
      series[i] = `--togostanza-theme-series_${i}_color`;
    }
    return series.map((variable) => getPropertyValue(variable).trim());
  }

  getBlendedColor(targets) {
    let blendedColor = Color$1(this.colorSeries[targets[0]]);
    targets.forEach((target, index) => {
      if (index > 0) {
        blendedColor = blendedColor.mix(
          Color$1(this.colorSeries[target]),
          1 / (index + 1)
        );
      }
    });
    if (targets.length > 1) {
      const ratio = (targets.length - 1) / (this.numberOfData - 1);
      switch (this.params["color-blend"]) {
        case "multiply":
          blendedColor = blendedColor.saturate(ratio);
          blendedColor = blendedColor.darken(ratio * 0.5);
          break;
        case "screen":
          blendedColor = blendedColor.saturate(ratio);
          blendedColor = blendedColor.lighten(ratio * 0.5);
          break;
      }
    }
    return blendedColor;
  }

  async getData() {
    const data = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );
    return data;
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': VennStanza
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "venn-diagram",
	"stanza:label": "Venn diagram",
	"stanza:definition": "Venn diagram MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Image",
	"stanza:provider": "TogoStanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE"
],
	"stanza:created": "2021-08-03",
	"stanza:updated": "2022-01-23",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://raw.githubusercontent.com/togostanza/togostanza-data/main/samples/json/3sets-data.json",
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
		"stanza:key": "color-blend",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"normal",
			"multiply",
			"screen"
		],
		"stanza:example": "screen",
		"stanza:description": "How to mix colors in overlapping areas"
	},
	{
		"stanza:key": "togostanza-custom_css_url",
		"stanza:example": "",
		"stanza:description": "Stylesheet(css file) URL to override current style",
		"stanza:required": false
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-canvas-width",
		"stanza:type": "number",
		"stanza:default": 800,
		"stanza:description": "Width"
	},
	{
		"stanza:key": "--togostanza-canvas-height",
		"stanza:type": "number",
		"stanza:default": 380,
		"stanza:description": "Height"
	},
	{
		"stanza:key": "--togostanza-canvas-padding",
		"stanza:type": "number",
		"stanza:default": 10,
		"stanza:description": "Padding"
	},
	{
		"stanza:key": "--togostanza-fonts-font_family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-fonts-font_color",
		"stanza:type": "color",
		"stanza:default": "#000000",
		"stanza:description": "Label font color"
	},
	{
		"stanza:key": "--togostanza-fonts-font_size_primary",
		"stanza:type": "number",
		"stanza:default": 12,
		"stanza:description": "Label font size"
	},
	{
		"stanza:key": "--togostanza-fonts-font_size_secondary",
		"stanza:type": "number",
		"stanza:default": 16,
		"stanza:description": "Value font size"
	},
	{
		"stanza:key": "--togostanza-border-color",
		"stanza:type": "color",
		"stanza:default": "black"
	},
	{
		"stanza:key": "--togostanza-border-width",
		"stanza:type": "number",
		"stanza:default": 0
	},
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
		"stanza:default": "#F5DA64",
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
		"stanza:key": "--togostanza-theme-background_color",
		"stanza:type": "color",
		"stanza:default": "transparent",
		"stanza:description": "Background color"
	}
],
	"stanza:incomingEvent": [
],
	"stanza:outgoingEvent": [
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"drawArea\">\n\n  <svg\n    id=\"venn-diagrams\"\n    version=\"1.1\"\n    xmlns=\"http://www.w3.org/2000/svg\"\n    xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n    xmlns:a=\"http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/\"\n    xml:space=\"preserve\"\n  >\n\n    <!-- 1 -->\n    <g class=\"venn-diagram\" data-number-of-data=\"1\">\n      <g data-targets=\"0\">\n        <circle class=\"part\" cx=\"170.57\" cy=\"169.7\" r=\"169.7\"/>\n        <g class=\"text\" transform=\"translate(175 173.5)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n    </g>\n\n    <!-- 2 -->\n    <g class=\"venn-diagram\" data-number-of-data=\"2\">\n      <g data-targets=\"0\">\n        <path class=\"part\" d=\"M.4,169.7c0,70.48,57.15,127.63,127.63,127.63,14.89,0,29.21-2.55,42.54-7.23-49.63-17.58-85.08-64.81-85.08-120.39s35.45-102.81,85.08-120.39c-13.33-4.68-27.65-7.23-42.54-7.23-70.48,0-127.63,57.15-127.63,127.63Z\"/>\n        <g class=\"text\" transform=\"translate(49 173.5)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"1\">\n        <path class=\"part\" d=\"M255.66,169.7c0,55.59-35.45,102.81-85.08,120.39,13.33,4.68,27.65,7.23,42.54,7.23,70.48,0,127.63-57.15,127.63-127.63,0-70.48-57.15-127.63-127.63-127.63-14.89,0-29.21,2.55-42.54,7.23,49.63,17.58,85.08,64.81,85.08,120.39Z\"/>\n        <g class=\"text\" transform=\"translate(297 173.5)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"0,1\">\n        <path class=\"part\" class=\"part\" d=\"M85.49,169.7c0,55.59,35.45,102.81,85.08,120.39,49.63-17.58,85.08-64.81,85.08-120.39,0-55.59-35.45-102.81-85.08-120.39-49.63,17.58-85.08,64.81-85.08,120.39Z\"/>\n        <g class=\"text\" transform=\"translate(173 173.5)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n    </g>\n\n    <!-- 3 -->\n    <g class=\"venn-diagram\" data-number-of-data=\"3\">\n      <g data-targets=\"0\">\n        <path class=\"part\" d=\"M170.57,96.28c32.64-15.63,72.08-15.5,105.86,4.03,2.52,1.39,4.91,3.02,7.18,4.54C279.2,46.25,230.3,0,170.57,0S61.94,46.25,57.53,104.97c2.39-1.64,4.79-3.15,7.18-4.54,33.77-19.53,73.22-19.79,105.86-4.16Z\"/>\n        <g class=\"text\" transform=\"translate(172.5 58.5)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"1\">\n        <path class=\"part\" d=\"M283.61,104.97c.25,2.77,.38,5.67,.38,8.57,0,38.94-19.53,73.22-49.4,93.63-2.77,36.04-22.68,70.19-56.33,89.6-2.52,1.39-5.04,2.77-7.56,4.03,52.93,25.46,117.45,6.3,147.32-45.49,29.74-51.79,14.24-117.32-34.4-150.34Z\"/>\n        <g class=\"text\" transform=\"translate(275 228.5)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"2\">\n        <path class=\"part\" d=\"M106.55,207.18c-29.87-20.42-49.4-54.69-49.4-93.63,0-2.9,.13-5.8,.38-8.57C8.88,138.12-6.62,203.52,23.25,255.32c29.87,51.79,94.39,70.95,147.32,45.49-2.52-1.26-5.04-2.52-7.56-4.03-33.77-19.41-53.68-53.56-56.46-89.6Z\"/>\n        <g class=\"text\" transform=\"translate(70 228.5)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"0,1\">\n        <path class=\"part\" d=\"M170.57,96.28c19.91,9.58,37.3,24.95,49.15,45.49,11.85,20.54,16.51,43.22,14.87,65.28,29.87-20.42,49.4-54.69,49.4-93.63,0-2.9-.13-5.8-.38-8.57-2.39-1.64-4.79-3.15-7.18-4.54-33.77-19.41-73.22-19.66-105.86-4.03Z\"/>\n        <g class=\"text\" transform=\"translate(246.5 131.5)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"0,2\">\n        <path class=\"part\" d=\"M106.55,207.18c-1.64-22.05,3.02-44.74,14.87-65.28,11.85-20.54,29.24-36.04,49.15-45.49-32.64-15.63-72.08-15.5-105.86,4.03-2.52,1.39-4.91,3.02-7.18,4.54-.25,2.77-.38,5.67-.38,8.57,0,38.81,19.53,73.22,49.4,93.63Z\"/>\n        <g class=\"text\" transform=\"translate(95.5 131.5)\">\n          <text class=\"label\" text-anchor=\"middle\"1></text>\n          <text class=\"value\" text-anchor=\"middle\"1></text>\n        </g>\n      </g>\n      <g data-targets=\"1,2\">\n        <path class=\"part\" d=\"M234.59,207.18c-18.27,12.48-40.2,19.79-64.02,19.79s-45.75-7.31-64.02-19.79c2.77,36.04,22.68,70.19,56.33,89.6,2.52,1.39,5.04,2.77,7.56,4.03,2.52-1.26,5.04-2.52,7.56-4.03,33.9-19.41,53.81-53.56,56.58-89.6Z\"/>\n        <g class=\"text\" transform=\"translate(171.5 260)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"0,1,2\">\n        <path class=\"part\" d=\"M219.72,141.9c-11.85-20.54-29.24-36.04-49.15-45.49-19.91,9.58-37.3,24.95-49.15,45.49-11.85,20.54-16.51,43.22-14.87,65.28,18.27,12.48,40.2,19.79,64.02,19.79s45.75-7.31,64.02-19.79c1.64-22.05-3.02-44.74-14.87-65.28Z\"/>\n        <g class=\"text\" transform=\"translate(172 174)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n    </g>\n\n    <!-- 4 -->\n    <g class=\"venn-diagram\" data-number-of-data=\"4\">\n      <g data-targets=\"0\">\n        <path class=\"part\" d=\"M243.44,79.65c18.13-1.69,35.25,.56,50,6.64-2.93-10.02-7.77-19.14-14.53-27.25-23.65-28.15-65.43-35.14-108.34-22.19,22.19,6.64,44.6,18.69,64.98,35.7,2.7,2.36,5.29,4.73,7.88,7.09Z\"/>\n        <g class=\"text\" transform=\"translate(249 67)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"1\">\n        <path class=\"part\" d=\"M293.44,86.3c5.63,19.26,4.39,41.44-3.15,63.63,11.37,33.79,8.45,67.35-11.26,90.88-7.88,9.46-17.91,16.55-29.28,21.28-2.93,10.02-7.77,19.14-14.53,27.25-15.43,18.36-38.52,27.7-64.53,28.38,34.69,1.01,74.55-13.29,108.68-41.89,59.8-50.23,79.28-125.57,43.36-168.36-7.88-9.35-17.91-16.44-29.28-21.17Z\"/>\n        <g class=\"text\" transform=\"translate(317.5 163)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"2\">\n        <path class=\"part\" d=\"M106.04,289.46c-6.76-8.11-11.6-17.23-14.53-27.25-11.37-4.73-21.4-11.82-29.28-21.28-19.82-23.65-22.75-57.21-11.26-90.88-7.55-22.3-8.78-44.37-3.15-63.63-11.37,4.73-21.4,11.82-29.28,21.28C-17.39,150.49,2.1,225.83,61.9,276.06c34.12,28.6,74.1,42.91,108.68,41.89-26.13-.79-49.21-10.14-64.53-28.49Z\"/>\n        <g class=\"text\" transform=\"translate(25.5 163)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"3\">\n        <path class=\"part\" d=\"M97.71,79.65c2.59-2.36,5.18-4.73,7.88-7.09,20.38-17.12,42.79-29.06,64.98-35.7-42.91-12.95-84.69-5.97-108.34,22.19-6.76,8.11-11.6,17.23-14.53,27.25,14.75-6.08,31.98-8.33,50-6.64Z\"/>\n        <g class=\"text\" transform=\"translate(94.5 67)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"0,1\">\n        <path class=\"part\" d=\"M243.44,79.65c22.52,21.06,38.52,45.72,46.85,70.39,7.55-22.3,8.78-44.37,3.15-63.63-14.75-6.19-31.98-8.45-50-6.76Z\"/>\n        <g class=\"text\" transform=\"translate(281.5 110)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"0,2\">\n        <path class=\"part\" d=\"M90.61,213.33c-18.81-19.37-32.32-41.44-39.75-63.29-11.37,33.79-8.45,67.35,11.26,90.88,7.88,9.46,17.91,16.55,29.28,21.28-4.28-14.98-4.5-31.65-.79-48.88Z\"/>\n        <g class=\"text\" transform=\"translate(70 227)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"0,3\">\n        <path class=\"part\" d=\"M97.71,79.65c23.76,2.14,49.1,10.92,72.86,26.01,23.76-15.09,49.1-23.87,72.86-26.01-2.59-2.36-5.18-4.73-7.88-7.09-20.38-17.12-42.79-29.06-64.98-35.7-22.19,6.64-44.6,18.69-64.98,35.7-2.7,2.36-5.29,4.73-7.88,7.09Z\"/>\n        <g class=\"text\" transform=\"translate(171.5 85)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"1,2\">\n        <path class=\"part\" d=\"M235.1,289.46c6.76-8.11,11.6-17.23,14.53-27.25-22.52,9.35-50.57,9.57-79.06,1.01-28.49,8.56-56.53,8.45-79.06-1.01,2.93,10.02,7.77,19.14,14.53,27.25,15.43,18.36,38.52,27.7,64.53,28.38,26.13-.68,49.21-10.02,64.53-28.38Z\"/>\n        <g class=\"text\" transform=\"translate(171.5 301.5)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"1,3\">\n        <path class=\"part\" d=\"M249.63,262.2c11.37-4.73,21.4-11.82,29.28-21.28,19.82-23.65,22.75-57.21,11.26-90.88-7.43,21.96-20.83,43.92-39.64,63.4,3.72,17.12,3.49,33.79-.9,48.76Z\"/>\n        <g class=\"text\" transform=\"translate(273.5 227)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"2,3\">\n        <path class=\"part\" d=\"M50.86,150.04c8.33-24.55,24.21-49.33,46.85-70.39-18.13-1.69-35.25,.56-50,6.64-5.63,19.37-4.28,41.44,3.15,63.74Z\"/>\n        <g class=\"text\" transform=\"translate(58.5 110)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"0,1,2\">\n        <path class=\"part\" d=\"M90.61,213.33c-3.6,17.12-3.49,33.79,.9,48.76,22.52,9.35,50.57,9.57,79.06,1.01-22.19-6.64-44.6-18.69-64.98-35.7-5.29-4.5-10.36-9.23-14.98-14.08Z\"/>\n        <g class=\"text\" transform=\"translate(114.5 265.5)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"0,1,3\">\n        <path class=\"part\" d=\"M243.44,79.65c-23.76,2.14-49.1,10.92-72.86,26.01,7.21,4.62,14.3,9.69,21.17,15.43,31.65,26.58,52.03,60.14,58.79,92.23,18.81-19.48,32.21-41.44,39.64-63.4-8.22-24.55-24.21-49.21-46.74-70.27Z\"/>\n        <g class=\"text\" transform=\"translate(247 144)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"0,2,3\">\n        <path class=\"part\" d=\"M149.4,121.09c6.87-5.74,13.96-10.92,21.17-15.43-23.76-15.09-49.1-23.87-72.86-26.01-22.52,21.06-38.52,45.72-46.85,70.39,7.43,21.96,20.83,43.92,39.64,63.4,6.87-32.21,27.25-65.77,58.9-92.35Z\"/>\n        <g class=\"text\" transform=\"translate(90 144)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"1,2,3\">\n        <path class=\"part\" d=\"M250.53,213.33c-4.73,4.84-9.69,9.57-15.09,14.08-20.38,17.12-42.79,29.06-64.98,35.7,28.49,8.56,56.53,8.45,79.06-1.01,4.5-14.87,4.73-31.53,1.01-48.76Z\"/>\n        <g class=\"text\" transform=\"translate(223 265.5)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"0,1,2,3\">\n        <path class=\"part\" d=\"M250.53,213.33c-6.87-32.1-27.14-65.66-58.79-92.23-6.87-5.74-13.96-10.92-21.17-15.43-7.21,4.62-14.3,9.69-21.17,15.43-31.65,26.58-52.03,60.14-58.79,92.23,4.73,4.84,9.69,9.57,15.09,14.08,20.38,17.12,42.79,29.06,64.98,35.7,22.19-6.64,44.6-18.69,64.98-35.7,5.18-4.5,10.25-9.23,14.87-14.08Z\"/>\n        <g class=\"text\" transform=\"translate(168.5 196.5)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n    </g>\n\n    <!-- 5 -->\n    <g class=\"venn-diagram\" data-number-of-data=\"5\">\n      <g data-targets=\"0\">\n        <path class=\"part\" d=\"M222.97,68.7c9.7,7,15.5,18.2,17.7,32.2,4.4-.3,8.7-.4,12.9-.5C243.37,42.2,215.67,.4,183.07,.4c-26.8,0-50.3,28.2-63.5,70.6,9.3,1.3,18.8,3.2,28.5,5.7,29.3-17,56.9-21,74.9-8Z\"/>\n        <g class=\"text\" transform=\"translate(185.5 49)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"1\">\n        <path class=\"part\" d=\"M339.27,139c-8.2-25.3-41.8-38.9-85.7-38.6,1.8,10.1,3,20.7,3.7,31.7,24.1,22.2,35.7,46.6,29,67.3-3.7,11.4-12.6,20.4-25.3,26.9,1.5,3.8,2.8,7.5,4.1,11.2,52.8-27.7,84.4-67.3,74.2-98.5Z\"/>\n        <g class=\"text\" transform=\"translate(303.5 157)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"2\">\n        <path class=\"part\" d=\"M183.07,299.5c-12.1,0-23.5-5.8-33.6-16-3.5,2.9-7,5.6-10.4,8.2,42.5,41.2,89.6,58.7,116,39.5,21.6-15.7,24.1-52,10.1-93.7-8.3,4.3-17,8.4-26.3,12.1-13.7,30.6-33.6,49.9-55.8,49.9Z\"/>\n        <g class=\"text\" transform=\"translate(229.5 320)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"3\">\n        <path class=\"part\" d=\"M117.97,268.9c-32.6-3.8-56.4-16.7-63.2-37.4-3.6-11.2-1.9-23.4,4.2-35.8-3.6-2.3-7-4.6-10.4-7-25.8,53-27.8,102.9-1.5,122,21.5,15.6,56.6,6.9,91.8-19-7-6.9-14.1-14.6-20.9-22.8Z\"/>\n        <g class=\"text\" transform=\"translate(77.5 294)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"4\">\n        <path class=\"part\" d=\"M79.17,89.2c9.9-7.2,22.8-9.2,37.2-6.7,1-4,2.1-7.8,3.3-11.6C60.77,62.4,12.07,75.8,1.87,107c-8.2,25.3,11.1,56.2,46.8,81.7,4.3-8.8,9.2-17.6,14.7-26.4-6.9-32.8-2.1-60,15.8-73.1Z\"/>\n        <g class=\"text\" transform=\"translate(35.5 124)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"0,1\">\n        <path class=\"part\" d=\"M241.67,119.3c5.7,4.2,10.9,8.4,15.6,12.8-.7-11-1.9-21.6-3.7-31.7-4.2,0-8.5,.2-12.9,.5,1,5.7,1.3,11.9,1,18.4Z\"/>\n        <g class=\"text\" transform=\"translate(253.5 123)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"0,2\">\n        <path class=\"part\" d=\"M165.97,268.4c-5.5,5.4-11,10.5-16.6,15.1,10.1,10.2,21.5,16,33.6,16,22.2,0,42.1-19.3,55.7-49.9-6,2.4-12.2,4.7-18.6,6.8-18.5,6-36.8,10-54.1,12Z\"/>\n        <g class=\"text\" transform=\"translate(188 291)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"0,3\">\n        <path class=\"part\" d=\"M216.97,103.6c8.1-1.3,16-2.2,23.7-2.7-2.2-14-8.1-25.1-17.7-32.2-18-13.1-45.7-9.1-74.9,7.9,6.3,1.6,12.7,3.4,19.1,5.5,18.1,5.9,34.9,13.3,49.8,21.5Z\"/>\n        <g class=\"text\" transform=\"translate(203 89)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"0,4\">\n        <path class=\"part\" d=\"M132.37,86.8c5.2-3.8,10.5-7.2,15.7-10.2-9.7-2.5-19.2-4.3-28.5-5.7-1.2,3.7-2.2,7.6-3.3,11.6,5.2,.9,10.6,2.3,16.1,4.3Z\"/>\n        <g class=\"text\" transform=\"translate(129 88)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"1,2\">\n        <path class=\"part\" d=\"M245.47,232.5c-2,6-4.2,11.8-6.6,17.1,9.2-3.7,18-7.7,26.3-12.1-1.2-3.7-2.6-7.4-4.1-11.2-4.8,2.4-10,4.5-15.6,6.2Z\"/>\n        <g class=\"text\" transform=\"translate(250 247)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"1,3\">\n        <path class=\"part\" d=\"M78.57,206.8c-6.9-3.5-13.4-7.3-19.6-11.1-6.1,12.4-7.8,24.6-4.2,35.8,6.7,20.7,30.6,33.6,63.2,37.4-3.9-4.7-7.7-9.6-11.4-14.7-11.4-15.6-20.7-31.7-28-47.4Z\"/>\n        <g class=\"text\" transform=\"translate(73 242)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"1,4\">\n        <path class=\"part\" d=\"M252.27,206.8c3.3,6.6,6.2,13.1,8.8,19.6,12.7-6.5,21.6-15.5,25.3-26.9,6.7-20.7-4.9-45.1-29-67.3,.3,5.8,.5,11.8,.5,17.8,0,20.1-2,39.3-5.6,56.8Z\"/>\n        <g class=\"text\" transform=\"translate(268 200)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"2,3\">\n        <path class=\"part\" d=\"M138.47,270c-7.1,0-14-.4-20.5-1.2,6.8,8.2,13.8,15.9,21,22.8,3.5-2.6,7-5.3,10.4-8.2-3.8-3.8-7.4-8.3-10.9-13.4Z\"/>\n        <g class=\"text\" transform=\"translate(134 289)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"2,4\">\n        <path class=\"part\" d=\"M111.97,103.6c1.2-7.3,2.7-14.3,4.4-21.1-14.4-2.5-27.3-.5-37.2,6.7-17.9,13-22.7,40.3-15.8,73.1,3.5-5.5,7.2-11.1,11.2-16.6,11.7-16,24.4-30.1,37.4-42.1Z\"/>\n        <g class=\"text\" transform=\"translate(85 113)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"3,4\">\n        <path class=\"part\" d=\"M68.37,180.9c-2-6.3-3.7-12.5-5-18.6-5.5,8.8-10.5,17.6-14.7,26.4,3.3,2.4,6.8,4.7,10.4,7,2.4-4.9,5.5-9.9,9.3-14.8Z\"/>\n        <g class=\"text\" transform=\"translate(57 189)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"0,1,2\">\n        <path class=\"part\" d=\"M192.47,237.8c-8.4,11.2-17.3,21.4-26.5,30.6,17.3-2,35.6-6,54.2-12,6.4-2.1,12.6-4.4,18.6-6.8,2.4-5.4,4.6-11.1,6.6-17.1-14.9,4.4-33,6.2-52.9,5.3Z\"/>\n        <g class=\"text\" transform=\"translate(206 258)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"0,1,3\">\n        <path class=\"part\" d=\"M241.67,119.3c.3-6.5-.1-12.7-1-18.4-7.7,.5-15.6,1.4-23.7,2.7,9,5,17.2,10.2,24.7,15.7Z\"/>\n        <g class=\"text\" transform=\"translate(230 116)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"0,1,4\">\n        <path class=\"part\" d=\"M230.37,170.2c8.5,12.1,15.8,24.4,21.9,36.6,3.6-17.5,5.6-36.7,5.6-56.8,0-6-.2-12-.5-17.8-4.7-4.4-10-8.6-15.6-12.8-.7,15.3-4.6,32.6-11.4,50.8Z\"/>\n        <g class=\"text\" transform=\"translate(243 176)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"0,2,3\">\n        <path class=\"part\" d=\"M138.47,270c3.4,5.1,7.1,9.6,10.9,13.5,5.6-4.6,11.1-9.7,16.6-15.1-9.5,1.1-18.7,1.7-27.5,1.6Z\"/>\n        <g class=\"text\" transform=\"translate(150 284)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"0,2,4\">\n        <path class=\"part\" d=\"M132.37,86.8c-5.5-2-10.9-3.5-16.1-4.3-1.7,6.8-3.2,13.8-4.4,21.1,6.9-6.2,13.7-11.8,20.5-16.8Z\"/>\n        <g class=\"text\" transform=\"translate(117 101)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"0,3,4\">\n        <path class=\"part\" d=\"M216.97,103.6c-14.9-8.3-31.7-15.6-49.8-21.5-6.4-2.1-12.8-3.9-19.1-5.5-5.2,3-10.4,6.4-15.7,10.2,14.4,5.2,29.7,14.2,44.9,26.2,13.5-4.1,26.9-7.3,39.7-9.4Z\"/>\n        <g class=\"text\" transform=\"translate(173 111)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"1,2,3\">\n        <path class=\"part\" d=\"M78.57,206.8c7.3,15.7,16.6,31.7,28,47.4,3.7,5.1,7.5,10,11.4,14.7,6.5,.8,13.4,1.1,20.5,1.2-8.4-12.5-15.4-28.4-20.6-46.7-14-4.8-27.2-10.4-39.3-16.6Z\"/>\n        <g class=\"text\" transform=\"translate(108 252)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"1,2,4\">\n        <path class=\"part\" d=\"M245.47,232.5c5.7-1.7,10.9-3.7,15.6-6.1-2.6-6.5-5.5-13-8.8-19.6-1.9,9-4.2,17.6-6.8,25.7Z\"/>\n        <g class=\"text\" transform=\"translate(250.5 231)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"1,3,4\">\n        <path class=\"part\" d=\"M68.37,180.9c-3.8,4.9-6.9,9.9-9.3,14.8,6.1,3.9,12.7,7.6,19.6,11.1-4.2-8.8-7.6-17.4-10.3-25.9Z\"/>\n        <g class=\"text\" transform=\"translate(64 204)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"2,3,4\">\n        <path class=\"part\" d=\"M108.37,145.1c.2-14.5,1.5-28.4,3.6-41.5-13,12-25.7,26.1-37.4,42.2-4,5.5-7.7,11-11.2,16.6,1.3,6,2.9,12.2,5,18.6,9.6-12.6,23.2-24.8,40-35.9Z\"/>\n        <g class=\"text\" transform=\"translate(88 153)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"0,1,2,3\">\n        <path class=\"part\" d=\"M192.47,237.8c-22.2-1-46.6-5.4-71.5-13.5-1-.3-2-.7-3-1,5.2,18.3,12.2,34.2,20.6,46.7,8.8,0,18-.5,27.5-1.6,9.1-9.1,18-19.4,26.4-30.6Z\"/>\n        <g class=\"text\" transform=\"translate(151 261)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"0,1,2,4\">\n        <path class=\"part\" d=\"M230.37,170.2c-7.8,20.7-19.5,42.4-34.8,63.5-1,1.4-2.1,2.8-3.1,4.1,19.9,.9,38-1,53-5.4,2.7-8,5-16.6,6.8-25.7-6.1-12.1-13.4-24.4-21.9-36.5Z\"/>\n        <g class=\"text\" transform=\"translate(227 221)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"0,1,3,4\">\n        <path class=\"part\" d=\"M177.27,113.1c17.5,13.9,34.8,31.9,50.3,53.2,.9,1.3,1.9,2.6,2.8,3.9,6.9-18.2,10.7-35.6,11.3-50.9-7.5-5.5-15.8-10.8-24.7-15.7-12.8,2.1-26.2,5.3-39.7,9.5Z\"/>\n        <g class=\"text\" transform=\"translate(218 140)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"0,2,3,4\">\n        <path class=\"part\" d=\"M108.37,145.1c18.5-12.2,40.8-23,65.6-31,1.1-.4,2.2-.7,3.3-1-15.2-12.1-30.5-21-44.9-26.2-6.8,5-13.7,10.6-20.4,16.8-2.1,13-3.4,27-3.6,41.4Z\"/>\n        <g class=\"text\" transform=\"translate(133 121)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"1,2,3,4\">\n        <path class=\"part\" d=\"M117.87,223.3c-6.1-21.7-9.6-46.7-9.6-73.4,0-1.6,0-3.2,.1-4.8-16.8,11.1-30.4,23.3-40,35.8,2.7,8.4,6.1,17.1,10.2,25.9,12.1,6.2,25.3,11.8,39.3,16.5Z\"/>\n        <g class=\"text\" transform=\"translate(91 197)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n      <g data-targets=\"0,1,2,3,4\">\n        <path class=\"part\" d=\"M177.27,113.1c-1.1,.3-2.2,.7-3.3,1-24.8,8.1-47.1,18.8-65.6,31,0,1.6-.1,3.2-.1,4.8,0,26.7,3.5,51.7,9.6,73.4,1,.3,2,.7,3,1,24.9,8.1,49.3,12.5,71.5,13.5,1-1.4,2.1-2.7,3.1-4.1,15.3-21.1,27-42.8,34.8-63.5-.9-1.3-1.8-2.6-2.8-3.9-15.4-21.3-32.7-39.3-50.2-53.2Z\"/>\n        <g class=\"text\" transform=\"translate(162 186)\">\n          <text class=\"label\" text-anchor=\"middle\"></text>\n          <text class=\"value\" text-anchor=\"middle\"></text>\n        </g>\n      </g>\n    </g>\n  </svg>\n\n</div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=venn-diagram.js.map

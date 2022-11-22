import { g as commonjsGlobal, a as s, y, h as b, w, S as Stanza, d as defineStanzaElement } from './transform-23c22e70.js';
import { f as appendCustomCss } from './index-346f55c8.js';
import { o, e, n } from './ref-c68d7fe6.js';
import { l as loadData } from './load-data-07b02667.js';
import { F as FAIcons } from './index-c774cef2.js';

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match words composed of alphanumeric characters. */
var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

/** Used to match Latin Unicode letters (excluding mathematical operators). */
var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
    rsComboSymbolsRange = '\\u20d0-\\u20f0',
    rsDingbatRange = '\\u2700-\\u27bf',
    rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
    rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
    rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
    rsPunctuationRange = '\\u2000-\\u206f',
    rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
    rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
    rsVarRange = '\\ufe0e\\ufe0f',
    rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

/** Used to compose unicode capture groups. */
var rsApos = "['\u2019]",
    rsAstral = '[' + rsAstralRange + ']',
    rsBreak = '[' + rsBreakRange + ']',
    rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']',
    rsDigits = '\\d+',
    rsDingbat = '[' + rsDingbatRange + ']',
    rsLower = '[' + rsLowerRange + ']',
    rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsUpper = '[' + rsUpperRange + ']',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var rsLowerMisc = '(?:' + rsLower + '|' + rsMisc + ')',
    rsUpperMisc = '(?:' + rsUpper + '|' + rsMisc + ')',
    rsOptLowerContr = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
    rsOptUpperContr = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
    reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match apostrophes. */
var reApos = RegExp(rsApos, 'g');

/**
 * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
 * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
 */
var reComboMark = RegExp(rsCombo, 'g');

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/** Used to match complex or compound words. */
var reUnicodeWord = RegExp([
  rsUpper + '?' + rsLower + '+' + rsOptLowerContr + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
  rsUpperMisc + '+' + rsOptUpperContr + '(?=' + [rsBreak, rsUpper + rsLowerMisc, '$'].join('|') + ')',
  rsUpper + '?' + rsLowerMisc + '+' + rsOptLowerContr,
  rsUpper + '+' + rsOptUpperContr,
  rsDigits,
  rsEmoji
].join('|'), 'g');

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + ']');

/** Used to detect strings that need a more robust regexp to match words. */
var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

/** Used to map Latin Unicode letters to basic Latin letters. */
var deburredLetters = {
  // Latin-1 Supplement block.
  '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
  '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
  '\xc7': 'C',  '\xe7': 'c',
  '\xd0': 'D',  '\xf0': 'd',
  '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
  '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
  '\xcc': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
  '\xec': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
  '\xd1': 'N',  '\xf1': 'n',
  '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
  '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
  '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
  '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
  '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
  '\xc6': 'Ae', '\xe6': 'ae',
  '\xde': 'Th', '\xfe': 'th',
  '\xdf': 'ss',
  // Latin Extended-A block.
  '\u0100': 'A',  '\u0102': 'A', '\u0104': 'A',
  '\u0101': 'a',  '\u0103': 'a', '\u0105': 'a',
  '\u0106': 'C',  '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
  '\u0107': 'c',  '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
  '\u010e': 'D',  '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
  '\u0112': 'E',  '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
  '\u0113': 'e',  '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
  '\u011c': 'G',  '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
  '\u011d': 'g',  '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
  '\u0124': 'H',  '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
  '\u0128': 'I',  '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
  '\u0129': 'i',  '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
  '\u0134': 'J',  '\u0135': 'j',
  '\u0136': 'K',  '\u0137': 'k', '\u0138': 'k',
  '\u0139': 'L',  '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
  '\u013a': 'l',  '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
  '\u0143': 'N',  '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
  '\u0144': 'n',  '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
  '\u014c': 'O',  '\u014e': 'O', '\u0150': 'O',
  '\u014d': 'o',  '\u014f': 'o', '\u0151': 'o',
  '\u0154': 'R',  '\u0156': 'R', '\u0158': 'R',
  '\u0155': 'r',  '\u0157': 'r', '\u0159': 'r',
  '\u015a': 'S',  '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
  '\u015b': 's',  '\u015d': 's', '\u015f': 's', '\u0161': 's',
  '\u0162': 'T',  '\u0164': 'T', '\u0166': 'T',
  '\u0163': 't',  '\u0165': 't', '\u0167': 't',
  '\u0168': 'U',  '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
  '\u0169': 'u',  '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
  '\u0174': 'W',  '\u0175': 'w',
  '\u0176': 'Y',  '\u0177': 'y', '\u0178': 'Y',
  '\u0179': 'Z',  '\u017b': 'Z', '\u017d': 'Z',
  '\u017a': 'z',  '\u017c': 'z', '\u017e': 'z',
  '\u0132': 'IJ', '\u0133': 'ij',
  '\u0152': 'Oe', '\u0153': 'oe',
  '\u0149': "'n", '\u017f': 'ss'
};

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array ? array.length : 0;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function asciiToArray(string) {
  return string.split('');
}

/**
 * Splits an ASCII `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */
function asciiWords(string) {
  return string.match(reAsciiWord) || [];
}

/**
 * The base implementation of `_.propertyOf` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyOf(object) {
  return function(key) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
 * letters to basic Latin letters.
 *
 * @private
 * @param {string} letter The matched letter to deburr.
 * @returns {string} Returns the deburred letter.
 */
var deburrLetter = basePropertyOf(deburredLetters);

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

/**
 * Checks if `string` contains a word composed of Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a word is found, else `false`.
 */
function hasUnicodeWord(string) {
  return reHasUnicodeWord.test(string);
}

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return hasUnicode(string)
    ? unicodeToArray(string)
    : asciiToArray(string);
}

/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}

/**
 * Splits a Unicode `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */
function unicodeWords(string) {
  return string.match(reUnicodeWord) || [];
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var Symbol = root.Symbol;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `array` to a slice if it's needed.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {number} start The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the cast slice.
 */
function castSlice(array, start, end) {
  var length = array.length;
  end = end === undefined ? length : end;
  return (!start && end >= length) ? array : baseSlice(array, start, end);
}

/**
 * Creates a function like `_.lowerFirst`.
 *
 * @private
 * @param {string} methodName The name of the `String` case method to use.
 * @returns {Function} Returns the new case function.
 */
function createCaseFirst(methodName) {
  return function(string) {
    string = toString(string);

    var strSymbols = hasUnicode(string)
      ? stringToArray(string)
      : undefined;

    var chr = strSymbols
      ? strSymbols[0]
      : string.charAt(0);

    var trailing = strSymbols
      ? castSlice(strSymbols, 1).join('')
      : string.slice(1);

    return chr[methodName]() + trailing;
  };
}

/**
 * Creates a function like `_.camelCase`.
 *
 * @private
 * @param {Function} callback The function to combine each word.
 * @returns {Function} Returns the new compounder function.
 */
function createCompounder(callback) {
  return function(string) {
    return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
  };
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the camel cased string.
 * @example
 *
 * _.camelCase('Foo Bar');
 * // => 'fooBar'
 *
 * _.camelCase('--foo-bar--');
 * // => 'fooBar'
 *
 * _.camelCase('__FOO_BAR__');
 * // => 'fooBar'
 */
var camelCase = createCompounder(function(result, word, index) {
  word = word.toLowerCase();
  return result + (index ? capitalize(word) : word);
});

/**
 * Converts the first character of `string` to upper case and the remaining
 * to lower case.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to capitalize.
 * @returns {string} Returns the capitalized string.
 * @example
 *
 * _.capitalize('FRED');
 * // => 'Fred'
 */
function capitalize(string) {
  return upperFirst(toString(string).toLowerCase());
}

/**
 * Deburrs `string` by converting
 * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
 * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
 * letters to basic Latin letters and removing
 * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to deburr.
 * @returns {string} Returns the deburred string.
 * @example
 *
 * _.deburr('déjà vu');
 * // => 'deja vu'
 */
function deburr(string) {
  string = toString(string);
  return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
}

/**
 * Converts the first character of `string` to upper case.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.upperFirst('fred');
 * // => 'Fred'
 *
 * _.upperFirst('FRED');
 * // => 'FRED'
 */
var upperFirst = createCaseFirst('toUpperCase');

/**
 * Splits `string` into an array of its words.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to inspect.
 * @param {RegExp|string} [pattern] The pattern to match words.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the words of `string`.
 * @example
 *
 * _.words('fred, barney, & pebbles');
 * // => ['fred', 'barney', 'pebbles']
 *
 * _.words('fred, barney, & pebbles', /[^, ]+/g);
 * // => ['fred', 'barney', '&', 'pebbles']
 */
function words(string, pattern, guard) {
  string = toString(string);
  pattern = guard ? undefined : pattern;

  if (pattern === undefined) {
    return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
  }
  return string.match(pattern) || [];
}

var lodash_camelcase = camelCase;

function applyConstructor(params) {
  for (const param in params) {
    this[lodash_camelcase(param)] = params[param] || undefined;
  }
}

class Breadcrumbs extends s {
  static get properties() {
    return {
      currentId: { type: String, reflect: true },
      data: { type: Array, state: true },
    };
  }
  constructor(element) {
    super();

    element.append(this);

    this.data = [];
    this.loading = false;
    this.pathToShow = [];
    this.nodesMap = new Map();
    this.currentMenuItems = [];
    this.hoverNodeId = "";

    this.rootNodeId = null;
    this.pathToCopy = "/";
  }

  updateParams(params, data) {
    // eslint-disable-next-line no-undef
    this.data = structuredClone(data);

    applyConstructor.call(this, params);

    //check if nodes without parents are present

    if (this.data.some((d) => d[this.nodeKey])) {
      this.data.forEach((d) => {
        this.nodesMap.set("" + d[this.nodeKey], d);
      });

      this.currentId = "" + this.nodeInitialId;
    } else {
      throw new Error("Key not found");
    }

    const idsWithoutParent = [];

    this.nodesMap.forEach((d) => {
      if (!d.parent) {
        idsWithoutParent.push("" + d[this.nodeKey]);
      }
    });

    if (idsWithoutParent.length > 1) {
      this.rootNodeId = "root";
    } else if (idsWithoutParent.length === 1) {
      this.rootNodeId = idsWithoutParent[0];
    } else {
      throw new Error("Root node not found");
    }

    const rootNode = {
      [this.nodeKey]: this.rootNodeId,
      [this.nodeLabelKey]: this.rootNodeLabelText,
    };

    this.nodesMap.set(this.rootNodeId, rootNode);
    this.data.push(rootNode);

    idsWithoutParent.forEach((id) => {
      const itemWithoutParent = this.nodesMap.get("" + id);
      itemWithoutParent.parent = this.rootNodeId;
    });

    this.requestUpdate();
  }

  willUpdate(changed) {
    if (changed.has("currentId")) {
      this.pathToShow = this._getPath(this.currentId);
      this.pathToCopy = this.pathToShow
        .map((p) => p[this.nodeLabelKey])
        .join("/");
    }
  }

  _getByParent(parentId) {
    return this.data.filter((d) => "" + d.parent === "" + parentId);
  }

  _getPath(currentId) {
    const pathToShow = [];
    const traverse = (id) => {
      const currentNode = this.nodesMap.get(id);
      if (currentNode) {
        pathToShow.push(currentNode);
        traverse("" + currentNode.parent);
      }
    };
    traverse(currentId);
    return pathToShow.reverse();
  }

  _handleNodeHover(e) {
    const { id } = e.detail;
    this.hoverNodeId = id;

    const node = this.nodesMap.get("" + id);
    const parentId = node.parent;
    const siblings = this._getByParent(parentId).filter(
      (d) => "" + d[this.nodeKey] !== "" + id
    );

    this.currentMenuItems = siblings.map((d) => ({
      label: d[this.nodeLabelKey],
      id: d[this.nodeKey],
    }));
  }

  _handleCopy() {
    navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
      if (result.state === "granted" || result.state === "prompt") {
        if (this.pathToCopy) {
          navigator.clipboard.writeText(this.pathToCopy).then(() => {
            console.log("Copied");
          });
        }
      } else {
        console.error("Browser is not permitted to copy text to clipboard");
      }
    });
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return y` ${this.showCopyButton &&
    y`<breadcrumbs-node
      .node="${{
        label: "",
        id: "copy",
      }}"
      .iconName=${"Copy"}
      .menuItems="${[]}"
      mode="copy"
      @click=${this._handleCopy}
    ></breadcrumbs-node>`}
    ${o(this.pathToShow, (node) => {
      return y`
        <breadcrumbs-node
          @click=${() => {
            this.currentId = "" + node[this.nodeKey];
            this.dispatchEvent(
              new CustomEvent("selectedDatumChanged", {
                detail: { id: "" + node[this.nodeKey] },
                bubbles: true,
                composed: true,
              })
            );
          }}
          @node-hover=${this._handleNodeHover}
          @menu-item-clicked=${({ detail }) =>
            (this.currentId = "" + detail.id)}
          data-id="${node[this.nodeKey]}"
          .node="${{
            label: node[this.nodeLabelKey],
            id: node[this.nodeKey],
          }}"
          .menuItems=${this._getByParent(node.parent).filter(
            (d) => d[this.nodeKey] !== node[this.nodeKey]
          )}
          .showDropdown=${this.nodeShowDropdown}
          .iconName=${node[this.nodeKey] === this.rootNodeId
            ? this.rootNodeLabelIcon
            : null}
        />
      `;
    })}`;
  }
}

customElements.define("breadcrumbs-el", Breadcrumbs);

class Menu extends s {
  static get properties() {
    return {
      menuItems: {
        type: Array,
        state: true,
      },
    };
  }

  constructor() {
    super();
    this.menuItems = [];
  }

  _handleMouseLeave() {
    this.dispatchEvent(
      new CustomEvent("menu-leave", { composed: true, bubbles: true })
    );
  }
  _handleClick(id) {
    this.dispatchEvent(
      new CustomEvent("menu-item-clicked", {
        detail: { id },
        bubbles: true,
        composed: true,
      })
    );
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return y`
      <div
        data-id="breadcrumbs-node-menu"
        class="menu-wrapper"
        @mouseleave=${this._handleMouseLeave}
      >
        <div class="menu-triangle"></div>
        <div class="menu-triangle-overlay"></div>
        <div class="menu-container">
          <ul class="menu-items">
            ${o(
              this.menuItems,

              (d) =>
                y`
                  <li
                    @click=${(e) => {
                      e.stopPropagation();
                      this._handleClick(d.id);
                    }}
                  >
                    ${d.label}
                  </li>
                `
            )}
          </ul>
        </div>
      </div>
    `;
  }
}

customElements.define("breadcrumbs-node-menu", Menu);

/* eslint-disable */
/*****************************************************************************
 *                                                                            *
 *  SVG Path Rounding Function                                                *
 *  Copyright (C) 2014 Yona Appletree                                         *
 *                                                                            *
 *  Licensed under the Apache License, Version 2.0 (the "License");           *
 *  you may not use this file except in compliance with the License.          *
 *  You may obtain a copy of the License at                                   *
 *                                                                            *
 *      http://www.apache.org/licenses/LICENSE-2.0                            *
 *                                                                            *
 *  Unless required by applicable law or agreed to in writing, software       *
 *  distributed under the License is distributed on an "AS IS" BASIS,         *
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  *
 *  See the License for the specific language governing permissions and       *
 *  limitations under the License.                                            *
 *                                                                            *
 *****************************************************************************/

/**
 * SVG Path rounding function. Takes an input path string and outputs a path
 * string where all line-line corners have been rounded. Only supports absolute
 * commands at the moment.
 *
 * @param pathString The SVG input path
 * @param radius The amount to round the corners, either a value in the SVG
 *               coordinate space, or, if useFractionalRadius is true, a value
 *               from 0 to 1.
 * @param useFractionalRadius If true, the curve radius is expressed as a
 *               fraction of the distance between the point being curved and
 *               the previous and next points.
 * @returns A new SVG path string with the rounding
 */
function roundPathCorners(
  pathString,
  radius,
  useFractionalRadius
) {
  function moveTowardsLength(movingPoint, targetPoint, amount) {
    var width = targetPoint.x - movingPoint.x;
    var height = targetPoint.y - movingPoint.y;

    var distance = Math.sqrt(width * width + height * height);

    return moveTowardsFractional(
      movingPoint,
      targetPoint,
      Math.min(1, amount / distance)
    );
  }
  function moveTowardsFractional(movingPoint, targetPoint, fraction) {
    return {
      x: movingPoint.x + (targetPoint.x - movingPoint.x) * fraction,
      y: movingPoint.y + (targetPoint.y - movingPoint.y) * fraction,
    };
  }

  // Adjusts the ending position of a command
  function adjustCommand(cmd, newPoint) {
    if (cmd.length > 2) {
      cmd[cmd.length - 2] = newPoint.x;
      cmd[cmd.length - 1] = newPoint.y;
    }
  }

  // Gives an {x, y} object for a command's ending position
  function pointForCommand(cmd) {
    return {
      x: parseFloat(cmd[cmd.length - 2]),
      y: parseFloat(cmd[cmd.length - 1]),
    };
  }

  // Split apart the path, handing concatonated letters and numbers
  var pathParts = pathString.split(/[,\s]/).reduce(function (parts, part) {
    var match = part.match("([a-zA-Z])(.+)");
    if (match) {
      parts.push(match[1]);
      parts.push(match[2]);
    } else {
      parts.push(part);
    }

    return parts;
  }, []);

  // Group the commands with their arguments for easier handling
  var commands = pathParts.reduce(function (commands, part) {
    if (parseFloat(part) == part && commands.length) {
      commands[commands.length - 1].push(part);
    } else {
      commands.push([part]);
    }

    return commands;
  }, []);

  // The resulting commands, also grouped
  var resultCommands = [];

  if (commands.length > 1) {
    var startPoint = pointForCommand(commands[0]);

    // Handle the close path case with a "virtual" closing line
    var virtualCloseLine = null;
    if (commands[commands.length - 1][0] == "Z" && commands[0].length > 2) {
      virtualCloseLine = ["L", startPoint.x, startPoint.y];
      commands[commands.length - 1] = virtualCloseLine;
    }

    // We always use the first command (but it may be mutated)
    resultCommands.push(commands[0]);

    for (var cmdIndex = 1; cmdIndex < commands.length; cmdIndex++) {
      var prevCmd = resultCommands[resultCommands.length - 1];

      var curCmd = commands[cmdIndex];

      // Handle closing case
      var nextCmd =
        curCmd == virtualCloseLine ? commands[1] : commands[cmdIndex + 1];

      // Nasty logic to decide if this path is a candidite.
      if (
        nextCmd &&
        prevCmd &&
        prevCmd.length > 2 &&
        curCmd[0] == "L" &&
        nextCmd.length > 2 &&
        nextCmd[0] == "L"
      ) {
        // Calc the points we're dealing with
        var prevPoint = pointForCommand(prevCmd);
        var curPoint = pointForCommand(curCmd);
        var nextPoint = pointForCommand(nextCmd);

        // The start and end of the cuve are just our point moved towards the previous and next points, respectivly
        var curveStart, curveEnd;

        if (useFractionalRadius) {
          curveStart = moveTowardsFractional(
            curPoint,
            prevCmd.origPoint || prevPoint,
            radius
          );
          curveEnd = moveTowardsFractional(
            curPoint,
            nextCmd.origPoint || nextPoint,
            radius
          );
        } else {
          curveStart = moveTowardsLength(curPoint, prevPoint, radius);
          curveEnd = moveTowardsLength(curPoint, nextPoint, radius);
        }

        // Adjust the current command and add it
        adjustCommand(curCmd, curveStart);
        curCmd.origPoint = curPoint;
        resultCommands.push(curCmd);

        // The curve control points are halfway between the start/end of the curve and
        // the original point
        var startControl = moveTowardsFractional(curveStart, curPoint, 0.5);
        var endControl = moveTowardsFractional(curPoint, curveEnd, 0.5);

        // Create the curve
        var curveCmd = [
          "C",
          startControl.x,
          startControl.y,
          endControl.x,
          endControl.y,
          curveEnd.x,
          curveEnd.y,
        ];
        // Save the original point for fractional calculations
        curveCmd.origPoint = curPoint;
        resultCommands.push(curveCmd);
      } else {
        // Pass through commands that don't qualify
        resultCommands.push(curCmd);
      }
    }

    // Fix up the starting point and restore the close path if the path was orignally closed
    if (virtualCloseLine) {
      var newStartPoint = pointForCommand(
        resultCommands[resultCommands.length - 1]
      );
      resultCommands.push(["Z"]);
      adjustCommand(resultCommands[0], newStartPoint);
    }
  } else {
    resultCommands = commands;
  }

  return resultCommands.reduce(function (str, c) {
    return str + c.join(" ") + " ";
  }, "");
}

class Node extends s {
  static get properties() {
    return {
      node: { type: Object, state: true },
      menuItems: { type: Array, state: true },
      showDropdown: {
        type: Boolean,
        state: true,
      },
      iconName: { type: String, state: true },
      mode: { type: String },
    };
  }

  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    this.node = { label: "", id: "" };
    this.menuItems = [];
    this.showDropdown = false;
    this.iconName = "";
    this.icon = null;
    this.mode = "node";

    this.svg = e();

    this.width = 0;
    this.height = 0;
    this.iconMarginLeft = 0;
    this.iconWidth = 0;
    this.emW = 0;
    this.emH = 0;
    this.textMargin = { left: 0, right: 0, top: 0, bottom: 0 };

    this.pathD = "";

    this.showMenu = false;

    this.arrowWidth = 2;
  }

  firstUpdated() {
    let { textWidth, textHeight } = this._getTextRect(this.node.label);

    if (textHeight === 0) {
      textHeight = this._getTextRect("W").textHeight;
      textWidth = 0;
    }

    const { textWidth: emW, textHeight: emH } = this._getTextRect("a");
    this.emW = emW;
    this.emH = emH;
    this.textWidth = textWidth;
    this.textHeight = textHeight;
    const textMarginLeft = 1 * this.emW;

    if (this.icon) {
      this.iconMarginLeft = 1 * this.emW;
      this.iconWidth = (this.emH * this.icon[0]) / this.icon[1];
    }

    this.textMargin = {
      left: textMarginLeft + this.iconMarginLeft + this.iconWidth,
      right: 3 * this.emW,
      top: 0.5 * this.emH,
      bottom: 0.5 * this.emH,
    };

    if (this.mode === "node") {
      this.width =
        this.textWidth + this.textMargin.left + this.textMargin.right;
    } else {
      this.width = this.iconWidth + this.iconMarginLeft * 2;
    }

    this.height =
      this.textHeight + this.textMargin.top + this.textMargin.bottom;
    this.pathD = roundPathCorners(this._getPolygon(), this.emW / 2, 0);

    this.requestUpdate();
  }

  _getPolygon() {
    if (this.width < this.emW * 2) {
      throw new Error("Width must be greater than arrow length");
    }

    const strokeWidth = 1;

    const WIDTH = this.width - 2 * strokeWidth;
    const HEIGHT = this.height - 2 * strokeWidth;

    let points;
    if (this.mode === "node") {
      const arrowLength = this.emW * 2;

      points = [
        [WIDTH - arrowLength, 0],
        [WIDTH, HEIGHT / 2],
        [WIDTH - arrowLength, HEIGHT],
        [0, HEIGHT],
      ];
    } else {
      points = [
        [WIDTH, 0],
        [WIDTH, HEIGHT],
        [0, HEIGHT],
      ];
    }

    const Lpath = points.map((p) => `L ${p.join(",")}`);

    const path = `M 0,0 ${Lpath} Z`;

    return path;
  }

  _getTextRect(text) {
    if (!text) {
      return { textWidth: 0, textHeight: 0 };
    }
    const svg = this.svg.value;
    const textEl = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );

    svg.append(textEl);

    textEl.textContent = text;

    const textWidth = textEl.getBBox().width;
    const textHeight = textEl.getBBox().height;
    textEl.remove();

    return { textWidth, textHeight };
  }

  _getIcon() {
    if (!this.icon) {
      return b;
    } else {
      return y`
        <svg viewBox="0 0 ${this.icon[0]} ${this.icon[1]}" height="${this.emH}">
          ${w`<path d="${this.icon[4]}"></path>`}
        </svg>
      `;
    }
  }
  _handleMouseOver() {
    this.svg.value.classList.add("-hover");
    this.showMenu = true;
    this.requestUpdate();
  }

  _unhover() {
    this.svg.value.classList.remove("-hover");
    this.showMenu = false;
    this.requestUpdate();
  }
  _handleMouseOut(e) {
    if (
      e.relatedTarget &&
      e.relatedTarget.dataset["id"] !== "breadcrumbs-node-menu"
    ) {
      this._unhover();
    }
  }
  _handleMenuLeave() {
    this._unhover();
  }

  willUpdate() {
    this.icon = FAIcons[`fa${this.iconName}`]?.icon;
  }

  render() {
    const nodeG = w`<g transform="translate(1,1)">
    <path class="node-outline" d="${this.pathD}"></path>
    ${
      this.icon
        ? w`<g class="home-icon" transform="translate(${
            -this.width / 2 + this.iconWidth / 2 + this.iconMarginLeft
          },${this.height / 2 - 0.7 * this.emH})">
    ${this._getIcon()}
    </g>`
        : b
    }
    <text class="node-label" transform="translate(${this.textMargin.left},${
      this.height / 2
    })">${this.node.label}</text>
  </g>`;

    return y`
      <svg
        @mouseover=${this._handleMouseOver}
        @mouseout=${this._handleMouseOut}
        xmlns="http://www.w3.org/2000/svg"
        width="${this.width}"
        height="${this.height}"
        ${n(this.svg)}
      >
        ${nodeG}
      </svg>

      ${this.showMenu && this.showDropdown && this.menuItems.length > 0
        ? y`<breadcrumbs-node-menu
            @menu-leave=${this._handleMenuLeave}
            style="top: ${this.height}px;"
            .menuItems=${this.menuItems}
          ></breadcrumbs-node-menu>`
        : b}
    `;
  }
}

customElements.define("breadcrumbs-node", Node);

class BreadcrumbsLit extends Stanza {
  menu() {
    return [];
  }

  async render() {
    appendCustomCss(this, this.params["misc-custom_css_url"]);

    const root = this.root.querySelector("main");

    if (isExamplePage.apply(this)) {
      root.style = null;
      const overflowEl = this.element.parentElement.parentElement;
      overflowEl.classList.remove("overflow-auto");
    }

    if (this.breadcrumbs) {
      this.breadcrumbs.remove();
    }

    this.breadcrumbs = new Breadcrumbs(root);

    const data = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      root,
      5000
    );

    this.breadcrumbs.updateParams(this.params, data);
  }

  handleEvent(e) {
    if (e.details?.id) {
      this.breadcrumbs.setAttribute("currendId", "" + e.details.id);
    }
  }
}

/**
 *
 * @returns true if the page is example page, false otherwise
 */

function isExamplePage() {
  const hostname = window.location.hostname;
  const pageName = window.location.pathname.match(/([^/]+)(?=\.\w+$)/gi)[0];
  const stanzaId = this.metadata["@id"];

  if (
    pageName === stanzaId &&
    (hostname.includes("metastanza") || hostname.includes("localhost"))
  ) {
    return true;
  }

  return false;
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': BreadcrumbsLit
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "breadcrumbs",
	"stanza:label": "Breadcrumbs",
	"stanza:definition": "Breadcrumbs MetaStanza ",
	"stanza:type": "Stanza",
	"stanza:provider": "TogoStanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE",
	"Enishi Tech"
],
	"stanza:created": "2022-04-07",
	"stanza:updated": "2022-04-07",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://raw.githubusercontent.com/togostanza/togostanza-data/main/samples/json/tree-data.json",
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
		"stanza:key": "node-key",
		"stanza:type": "string",
		"stanza:description": "Key of node unique id",
		"stanza:example": "id",
		"stanza:required": false
	},
	{
		"stanza:key": "node-initial_id",
		"stanza:type": "string",
		"stanza:description": "Initial node id",
		"stanza:example": "6",
		"stanza:required": false
	},
	{
		"stanza:key": "node-label_key",
		"stanza:type": "string",
		"stanza:description": "Initial node id",
		"stanza:example": "label",
		"stanza:required": false
	},
	{
		"stanza:key": "node-show_dropdown",
		"stanza:type": "boolean",
		"stanza:description": "Show node dropdown (neighbour nodes)",
		"stanza:example": true,
		"stanza:required": false
	},
	{
		"stanza:key": "root_node-label_text",
		"stanza:type": "string",
		"stanza:description": "Text to show on root node",
		"stanza:example": "Home",
		"stanza:required": false
	},
	{
		"stanza:key": "root_node-label_icon",
		"stanza:type": "string",
		"stanza:description": "Icon to use on root node (Font-awesome icon names)",
		"stanza:example": "Home",
		"stanza:required": false
	},
	{
		"stanza:key": "show_copy_button",
		"stanza:type": "boolean",
		"stanza:description": "Show copy path button",
		"stanza:example": false,
		"stanza:required": false
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-fonts-font_family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-fonts-font_color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Label font color"
	},
	{
		"stanza:key": "--togostanza-fonts-font_color_hover",
		"stanza:type": "color",
		"stanza:default": "#f9f9fa",
		"stanza:description": "Label font color on hover"
	},
	{
		"stanza:key": "--togostanza-fonts-font_size_primary",
		"stanza:type": "number",
		"stanza:default": 9,
		"stanza:description": "Label font size"
	},
	{
		"stanza:key": "--togostanza-border-color",
		"stanza:type": "color",
		"stanza:default": "#DDDCDA",
		"stanza:description": "Border color"
	},
	{
		"stanza:key": "--togostanza-border-width",
		"stanza:type": "number",
		"stanza:default": 1,
		"stanza:description": "Border width"
	},
	{
		"stanza:key": "--togostanza-node-background_color_hover",
		"stanza:type": "color",
		"stanza:default": "#16ADE3",
		"stanza:description": "Background color of the nodes on mouseover"
	},
	{
		"stanza:key": "--togostanza-node-background_color",
		"stanza:type": "color",
		"stanza:default": "#F0F0EF",
		"stanza:description": "Background color of the nodes"
	},
	{
		"stanza:key": "--togostanza-theme-background-color",
		"stanza:type": "color",
		"stanza:default": "rgba(255,255,255,0)",
		"stanza:description": "Background color"
	}
],
	"stanza:incomingEvent": [
	{
		"stanza:key": "selectedDatumChanged",
		"stanza:description": "An event, wich dispatches when user selects some node in other stanza"
	}
],
	"stanza:outgoingEvent": [
	{
		"stanza:key": "selectedDatumChanged",
		"stanza:description": "An event, wich dispatches when user selects some node in this stanza"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"breadcrumbs\"></div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=breadcrumbs.js.map

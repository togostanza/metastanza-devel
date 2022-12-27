import { k as e, j as i, t, a9 as x, h as b, a as s$1, a8 as i$1, y, S as Stanza, d as defineStanzaElement } from './transform-4eef39d8.js';
import { f as appendCustomCss } from './index-0a21be6d.js';
import { m, u as u$1, r, p, s, c as c$1, e as e$1, n, o } from './ref-333ed382.js';

function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}

// utils is a library of generic helper functions non-specific to axios

const {toString} = Object.prototype;
const {getPrototypeOf} = Object;

const kindOf = (cache => thing => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type
};

const typeOfTest = type => thing => typeof thing === type;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const {isArray} = Array;

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined');

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string');

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = typeOfTest('function');

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number');

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing) => thing !== null && typeof thing === 'object';

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = thing => thing === true || thing === false;

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
};

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val) => isObject(val) && isFunction(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = (thing) => {
  const pattern = '[object FormData]';
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) ||
    toString.call(thing) === pattern ||
    (isFunction(thing.toString) && thing.toString() === pattern)
  );
};

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest('URLSearchParams');

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str) => str.trim ?
  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, {allOwnKeys = false} = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}

function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}

const _global = typeof self === "undefined" ? typeof global === "undefined" ? undefined : global : self;

const isContextDefined = (context) => !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  const {caseless} = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  };

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, {allOwnKeys});
  return a;
};

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
};

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};

  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
};

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};


/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
const isTypedArray = (TypedArray => {
  // eslint-disable-next-line func-names
  return thing => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];

  const iterator = generator.call(obj);

  let result;

  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
};

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest('HTMLFormElement');

const toCamelCase = str => {
  return str.toLowerCase().replace(/[_-\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};

/* Creating a function that will check if an object has a property. */
const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest('RegExp');

const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};

  forEach(descriptors, (descriptor, name) => {
    if (reducer(descriptor, name, obj) !== false) {
      reducedDescriptors[name] = descriptor;
    }
  });

  Object.defineProperties(obj, reducedDescriptors);
};

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    // skip restricted props in strict mode
    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }

    const value = obj[name];

    if (!isFunction(value)) return;

    descriptor.enumerable = false;

    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }

    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error('Can not rewrite read-only method \'' + name + '\'');
      };
    }
  });
};

const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};

  const define = (arr) => {
    arr.forEach(value => {
      obj[value] = true;
    });
  };

  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

  return obj;
};

const noop = () => {};

const toFiniteNumber = (value, defaultValue) => {
  value = +value;
  return Number.isFinite(value) ? value : defaultValue;
};

const toJSONObject = (obj) => {
  const stack = new Array(10);

  const visit = (source, i) => {

    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      if(!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};

        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });

        stack[i] = undefined;

        return target;
      }
    }

    return source;
  };

  return visit(obj, 0);
};

var utils = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  toJSONObject
};

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }

  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
}

utils.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils.toJSONObject(this.config),
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});

const prototype$1 = AxiosError.prototype;
const descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
// eslint-disable-next-line func-names
].forEach(code => {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype$1, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype$1);

  utils.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  }, prop => {
    return prop !== 'isAxiosError';
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.cause = error;

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

/* eslint-env browser */

var browser = typeof self == 'object' ? self.FormData : window.FormData;

var FormData$2 = browser;

/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */
function isVisitable(thing) {
  return utils.isPlainObject(thing) || utils.isArray(thing);
}

/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */
function removeBrackets(key) {
  return utils.endsWith(key, '[]') ? key.slice(0, -2) : key;
}

/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    // eslint-disable-next-line no-param-reassign
    token = removeBrackets(token);
    return !dots && i ? '[' + token + ']' : token;
  }).join(dots ? '.' : '');
}

/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */
function isFlatArray(arr) {
  return utils.isArray(arr) && !arr.some(isVisitable);
}

const predicates = utils.toFlatObject(utils, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});

/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliant(thing) {
  return thing && utils.isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator];
}

/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/

/**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */
function toFormData(obj, formData, options) {
  if (!utils.isObject(obj)) {
    throw new TypeError('target must be an object');
  }

  // eslint-disable-next-line no-param-reassign
  formData = formData || new (FormData$2 || FormData)();

  // eslint-disable-next-line no-param-reassign
  options = utils.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    return !utils.isUndefined(source[option]);
  });

  const metaTokens = options.metaTokens;
  // eslint-disable-next-line no-use-before-define
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
  const useBlob = _Blob && isSpecCompliant(formData);

  if (!utils.isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }

  function convertValue(value) {
    if (value === null) return '';

    if (utils.isDate(value)) {
      return value.toISOString();
    }

    if (!useBlob && utils.isBlob(value)) {
      throw new AxiosError('Blob is not supported. Use a Buffer instead.');
    }

    if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */
  function defaultVisitor(value, key, path) {
    let arr = value;

    if (value && !path && typeof value === 'object') {
      if (utils.endsWith(key, '{}')) {
        // eslint-disable-next-line no-param-reassign
        key = metaTokens ? key : key.slice(0, -2);
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
      } else if (
        (utils.isArray(value) && isFlatArray(value)) ||
        (utils.isFileList(value) || utils.endsWith(key, '[]') && (arr = utils.toArray(value))
        )) {
        // eslint-disable-next-line no-param-reassign
        key = removeBrackets(key);

        arr.forEach(function each(el, index) {
          !(utils.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
            convertValue(el)
          );
        });
        return false;
      }
    }

    if (isVisitable(value)) {
      return true;
    }

    formData.append(renderKey(path, key, dots), convertValue(value));

    return false;
  }

  const stack = [];

  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });

  function build(value, path) {
    if (utils.isUndefined(value)) return;

    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }

    stack.push(value);

    utils.forEach(value, function each(el, key) {
      const result = !(utils.isUndefined(el) || el === null) && visitor.call(
        formData, el, utils.isString(key) ? key.trim() : key, path, exposedHelpers
      );

      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });

    stack.pop();
  }

  if (!utils.isObject(obj)) {
    throw new TypeError('data must be an object');
  }

  build(obj);

  return formData;
}

/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
function encode$1(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}

/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
function AxiosURLSearchParams(params, options) {
  this._pairs = [];

  params && toFormData(params, this, options);
}

const prototype = AxiosURLSearchParams.prototype;

prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};

prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode$1);
  } : encode$1;

  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + '=' + _encode(pair[1]);
  }, '').join('&');
};

/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */
function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?object} options
 *
 * @returns {string} The formatted url
 */
function buildURL(url, params, options) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }
  
  const _encode = options && options.encode || encode;

  const serializeFn = options && options.serialize;

  let serializedParams;

  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils.isURLSearchParams(params) ?
      params.toString() :
      new AxiosURLSearchParams(params, options).toString(_encode);
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}

class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}

var InterceptorManager$1 = InterceptorManager;

var transitionalDefaults = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};

var URLSearchParams$1 = typeof URLSearchParams !== 'undefined' ? URLSearchParams : AxiosURLSearchParams;

var FormData$1 = FormData;

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */
const isStandardBrowserEnv = (() => {
  let product;
  if (typeof navigator !== 'undefined' && (
    (product = navigator.product) === 'ReactNative' ||
    product === 'NativeScript' ||
    product === 'NS')
  ) {
    return false;
  }

  return typeof window !== 'undefined' && typeof document !== 'undefined';
})();

/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */
 const isStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === 'function'
  );
})();


var platform = {
  isBrowser: true,
  classes: {
    URLSearchParams: URLSearchParams$1,
    FormData: FormData$1,
    Blob
  },
  isStandardBrowserEnv,
  isStandardBrowserWebWorkerEnv,
  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
};

function toURLEncodedForm(data, options) {
  return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (platform.isNode && utils.isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }

      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}

/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */
function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return utils.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];
    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils.isArray(target) ? target.length : name;

    if (isLast) {
      if (utils.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }

      return !isNumericKey;
    }

    if (!target[name] || !utils.isObject(target[name])) {
      target[name] = [];
    }

    const result = buildPath(path, value, target[name], index);

    if (result && utils.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }

    return !isNumericKey;
  }

  if (utils.isFormData(formData) && utils.isFunction(formData.entries)) {
    const obj = {};

    utils.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });

    return obj;
  }

  return null;
}

const DEFAULT_CONTENT_TYPE = {
  'Content-Type': undefined
};

/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */
function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

const defaults = {

  transitional: transitionalDefaults,

  adapter: ['xhr', 'http'],

  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || '';
    const hasJSONContentType = contentType.indexOf('application/json') > -1;
    const isObjectPayload = utils.isObject(data);

    if (isObjectPayload && utils.isHTMLForm(data)) {
      data = new FormData(data);
    }

    const isFormData = utils.isFormData(data);

    if (isFormData) {
      if (!hasJSONContentType) {
        return data;
      }
      return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
    }

    if (utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
      return data.toString();
    }

    let isFileList;

    if (isObjectPayload) {
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }

      if ((isFileList = utils.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
        const _FormData = this.env && this.env.FormData;

        return toFormData(
          isFileList ? {'files[]': data} : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }

    if (isObjectPayload || hasJSONContentType ) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    const transitional = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    const JSONRequested = this.responseType === 'json';

    if (data && utils.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
      const silentJSONParsing = transitional && transitional.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;

      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: platform.classes.FormData,
    Blob: platform.classes.Blob
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

var defaults$1 = defaults;

// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = utils.toObjectSet([
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */
var parseHeaders = rawHeaders => {
  const parsed = {};
  let key;
  let val;
  let i;

  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();

    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
      return;
    }

    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
};

const $internals = Symbol('internals');

function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}

function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }

  return utils.isArray(value) ? value.map(normalizeValue) : String(value);
}

function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;

  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }

  return tokens;
}

function isValidHeaderName(str) {
  return /^[-_a-zA-Z]+$/.test(str.trim());
}

function matchHeaderValue(context, value, header, filter) {
  if (utils.isFunction(filter)) {
    return filter.call(this, value, header);
  }

  if (!utils.isString(value)) return;

  if (utils.isString(filter)) {
    return value.indexOf(filter) !== -1;
  }

  if (utils.isRegExp(filter)) {
    return filter.test(value);
  }
}

function formatHeader(header) {
  return header.trim()
    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}

function buildAccessors(obj, header) {
  const accessorName = utils.toCamelCase(' ' + header);

  ['get', 'set', 'has'].forEach(methodName => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}

class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }

  set(header, valueOrRewrite, rewrite) {
    const self = this;

    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);

      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }

      const key = utils.findKey(self, lHeader);

      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
        self[key || _header] = normalizeValue(_value);
      }
    }

    const setHeaders = (headers, _rewrite) =>
      utils.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

    if (utils.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if(utils.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }

    return this;
  }

  get(header, parser) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils.findKey(this, header);

      if (key) {
        const value = this[key];

        if (!parser) {
          return value;
        }

        if (parser === true) {
          return parseTokens(value);
        }

        if (utils.isFunction(parser)) {
          return parser.call(this, value, key);
        }

        if (utils.isRegExp(parser)) {
          return parser.exec(value);
        }

        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }

  has(header, matcher) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils.findKey(this, header);

      return !!(key && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }

    return false;
  }

  delete(header, matcher) {
    const self = this;
    let deleted = false;

    function deleteHeader(_header) {
      _header = normalizeHeader(_header);

      if (_header) {
        const key = utils.findKey(self, _header);

        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];

          deleted = true;
        }
      }
    }

    if (utils.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }

    return deleted;
  }

  clear() {
    return Object.keys(this).forEach(this.delete.bind(this));
  }

  normalize(format) {
    const self = this;
    const headers = {};

    utils.forEach(this, (value, header) => {
      const key = utils.findKey(headers, header);

      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }

      const normalized = format ? formatHeader(header) : String(header).trim();

      if (normalized !== header) {
        delete self[header];
      }

      self[normalized] = normalizeValue(value);

      headers[normalized] = true;
    });

    return this;
  }

  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }

  toJSON(asStrings) {
    const obj = Object.create(null);

    utils.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils.isArray(value) ? value.join(', ') : value);
    });

    return obj;
  }

  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }

  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
  }

  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }

  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }

  static concat(first, ...targets) {
    const computed = new this(first);

    targets.forEach((target) => computed.set(target));

    return computed;
  }

  static accessor(header) {
    const internals = this[$internals] = (this[$internals] = {
      accessors: {}
    });

    const accessors = internals.accessors;
    const prototype = this.prototype;

    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);

      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }

    utils.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

    return this;
  }
}

AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent']);

utils.freezeMethods(AxiosHeaders.prototype);
utils.freezeMethods(AxiosHeaders);

var AxiosHeaders$1 = AxiosHeaders;

/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(fns, response) {
  const config = this || defaults$1;
  const context = response || config;
  const headers = AxiosHeaders$1.from(context.headers);
  let data = context.data;

  utils.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });

  headers.normalize();

  return data;
}

function isCancel(value) {
  return !!(value && value.__CANCEL__);
}

/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError(message, config, request) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}

utils.inherits(CanceledError, AxiosError, {
  __CANCEL__: true
});

// eslint-disable-next-line strict
var httpAdapter = null;

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError(
      'Request failed with status code ' + response.status,
      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}

var cookies = platform.isStandardBrowserEnv ?

// Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        const cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

// Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })();

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

var isURLSameOrigin = platform.isStandardBrowserEnv ?

// Standard browser envs have full support of the APIs needed to test
// whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    const msie = /(msie|trident)/i.test(navigator.userAgent);
    const urlParsingNode = document.createElement('a');
    let originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      let href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
          urlParsingNode.pathname :
          '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      const parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
          parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })();

function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
}

/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;

  min = min !== undefined ? min : 1000;

  return function push(chunkLength) {
    const now = Date.now();

    const startedAt = timestamps[tail];

    if (!firstSampleTS) {
      firstSampleTS = now;
    }

    bytes[head] = chunkLength;
    timestamps[head] = now;

    let i = tail;
    let bytesCount = 0;

    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }

    head = (head + 1) % samplesCount;

    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }

    if (now - firstSampleTS < min) {
      return;
    }

    const passed = startedAt && now - startedAt;

    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}

function progressEventReducer(listener, isDownloadStream) {
  let bytesNotified = 0;
  const _speedometer = speedometer(50, 250);

  return e => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;

    bytesNotified = loaded;

    const data = {
      loaded,
      total,
      progress: total ? (loaded / total) : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e
    };

    data[isDownloadStream ? 'download' : 'upload'] = true;

    listener(data);
  };
}

const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

var xhrAdapter = isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    let requestData = config.data;
    const requestHeaders = AxiosHeaders$1.from(config.headers).normalize();
    const responseType = config.responseType;
    let onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (utils.isFormData(requestData) && (platform.isStandardBrowserEnv || platform.isStandardBrowserWebWorkerEnv)) {
      requestHeaders.setContentType(false); // Let the browser set it
    }

    let request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      const username = config.auth.username || '';
      const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.set('Authorization', 'Basic ' + btoa(username + ':' + password));
    }

    const fullPath = buildFullPath(config.baseURL, config.url);

    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders = AxiosHeaders$1.from(
        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = config.transitional || transitionalDefaults;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(new AxiosError(
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (platform.isStandardBrowserEnv) {
      // Add xsrf header
      const xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath))
        && config.xsrfCookieName && cookies.read(config.xsrfCookieName);

      if (xsrfValue) {
        requestHeaders.set(config.xsrfHeaderName, xsrfValue);
      }
    }

    // Remove Content-Type if data is undefined
    requestData === undefined && requestHeaders.setContentType(null);

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', progressEventReducer(config.onDownloadProgress, true));
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', progressEventReducer(config.onUploadProgress));
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    const protocol = parseProtocol(fullPath);

    if (protocol && platform.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData || null);
  });
};

const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter
};

utils.forEach(knownAdapters, (fn, value) => {
  if(fn) {
    try {
      Object.defineProperty(fn, 'name', {value});
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
    Object.defineProperty(fn, 'adapterName', {value});
  }
});

var adapters = {
  getAdapter: (adapters) => {
    adapters = utils.isArray(adapters) ? adapters : [adapters];

    const {length} = adapters;
    let nameOrAdapter;
    let adapter;

    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      if((adapter = utils.isString(nameOrAdapter) ? knownAdapters[nameOrAdapter.toLowerCase()] : nameOrAdapter)) {
        break;
      }
    }

    if (!adapter) {
      if (adapter === false) {
        throw new AxiosError(
          `Adapter ${nameOrAdapter} is not supported by the environment`,
          'ERR_NOT_SUPPORT'
        );
      }

      throw new Error(
        utils.hasOwnProp(knownAdapters, nameOrAdapter) ?
          `Adapter '${nameOrAdapter}' is not available in the build` :
          `Unknown adapter '${nameOrAdapter}'`
      );
    }

    if (!utils.isFunction(adapter)) {
      throw new TypeError('adapter is not a function');
    }

    return adapter;
  },
  adapters: knownAdapters
};

/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new CanceledError(null, config);
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = AxiosHeaders$1.from(config.headers);

  // Transform request data
  config.data = transformData.call(
    config,
    config.transformRequest
  );

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = adapters.getAdapter(config.adapter || defaults$1.adapter);

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );

    response.headers = AxiosHeaders$1.from(response.headers);

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
      }
    }

    return Promise.reject(reason);
  });
}

const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? thing.toJSON() : thing;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  function getMergedValue(target, source, caseless) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge.call({caseless}, target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(a, b, caseless) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(a, b, caseless);
    } else if (!utils.isUndefined(a)) {
      return getMergedValue(undefined, a, caseless);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(a, b) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(a, b) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!utils.isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }

  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
  };

  utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
}

const VERSION = "1.2.1";

const validators$1 = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators$1[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

const deprecatedWarnings = {};

/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */
validators$1.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return (value, opt, opts) => {
    if (validator === false) {
      throw new AxiosError(
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        AxiosError.ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
    }
  }
}

var validator = {
  assertOptions,
  validators: validators$1
};

const validators = validator.validators;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager$1(),
      response: new InterceptorManager$1()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = mergeConfig(this.defaults, config);

    const {transitional, paramsSerializer, headers} = config;

    if (transitional !== undefined) {
      validator.assertOptions(transitional, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }

    if (paramsSerializer !== undefined) {
      validator.assertOptions(paramsSerializer, {
        encode: validators.function,
        serialize: validators.function
      }, true);
    }

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    let contextHeaders;

    // Flatten headers
    contextHeaders = headers && utils.merge(
      headers.common,
      headers[config.method]
    );

    contextHeaders && utils.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      (method) => {
        delete headers[method];
      }
    );

    config.headers = AxiosHeaders$1.concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promise;
    let i = 0;
    let len;

    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), undefined];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);

      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = config;

    i = 0;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

  getUri(config) {
    config = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
}

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url,
        data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

var Axios$1 = Axios;

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new CanceledError(message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}

var CancelToken$1 = CancelToken;

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
function isAxiosError(payload) {
  return utils.isObject(payload) && (payload.isAxiosError === true);
}

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new Axios$1(defaultConfig);
  const instance = bind(Axios$1.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios$1.prototype, context, {allOwnKeys: true});

  // Copy context to instance
  utils.extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(defaults$1);

// Expose Axios class to allow class inheritance
axios.Axios = Axios$1;

// Expose Cancel & CancelToken
axios.CanceledError = CanceledError;
axios.CancelToken = CancelToken$1;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData;

// Expose AxiosError class
axios.AxiosError = AxiosError;

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = spread;

// Expose isAxiosError
axios.isAxiosError = isAxiosError;

// Expose mergeConfig
axios.mergeConfig = mergeConfig;

axios.AxiosHeaders = AxiosHeaders$1;

axios.formToJSON = thing => formDataToJSON(utils.isHTMLForm(thing) ? new FormData(thing) : thing);

axios.default = axios;

// this module should only have a default export
var axios$1 = axios;

var loaderPNG = "data:image/png;base64,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";

/** Cached axios */
class cachedAxios {
  /**
   * Create cached axios instance
   * @param {string} baseURL - base URL.
   * @param {number} maxCacheSize - maximum cache entries number. After reaching this treshold, oldest entries will be deleted from cache.
   */
  constructor(maxCacheSize = 100) {
    this.axios = axios$1.create({
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    this.maxCacheSize = maxCacheSize;
    this.cache = new Map();
  }

  /**
   *
   * @param {string} url - url part bo be fetched. Fetched url will be  baseURL + url
   * @returns {object} {data} - response data
   */
  get(url) {
    if (this.cache.has(url)) {
      return Promise.resolve(this.cache.get(url));
    }
    return this.axios.get(url).then((res) => {
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }

      if (Object.keys(res.data).length === 0) {
        throw new Error("Empty response from API");
      }

      this.cache.set(url, { data: res.data });
      if (this.cache.size > this.maxCacheSize) {
        const [first] = this.cache.keys();
        this.cache.delete(first);
      }
      return { data: res.data };
    });
  }
}

function getByPath(object, path) {
  if (!path) {
    return object;
  }

  const pathArr = path.split(".");
  let res = object[pathArr[0]];

  for (const path of pathArr.slice(1)) {
    if (!res) {
      return undefined;
    }
    res = res[path];
  }
  return res;
}

function camelize(s) {
  return s.replace(/[-_]./g, (x) => x[1].toUpperCase());
}

function applyConstructor(params) {
  for (const param in params) {
    this[camelize(param)] = params[param] || undefined;
  }
}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const u=(e,s,t)=>{const r=new Map;for(let l=s;l<=t;l++)r.set(e[l],l);return r},c=e(class extends i{constructor(e){if(super(e),e.type!==t.CHILD)throw Error("repeat() can only be used in text expressions")}ht(e,s,t){let r;void 0===t?t=s:void 0!==s&&(r=s);const l=[],o=[];let i=0;for(const s of e)l[i]=r?r(s,i):i,o[i]=t(s,i),i++;return {values:o,keys:l}}render(e,s,t){return this.ht(e,s,t).values}update(s$1,[t,r$1,c]){var d;const a=m(s$1),{values:p$1,keys:v}=this.ht(t,r$1,c);if(!Array.isArray(a))return this.ut=v,p$1;const h=null!==(d=this.ut)&&void 0!==d?d:this.ut=[],m$1=[];let y,x$1,j=0,k=a.length-1,w=0,A=p$1.length-1;for(;j<=k&&w<=A;)if(null===a[j])j++;else if(null===a[k])k--;else if(h[j]===v[w])m$1[w]=u$1(a[j],p$1[w]),j++,w++;else if(h[k]===v[A])m$1[A]=u$1(a[k],p$1[A]),k--,A--;else if(h[j]===v[A])m$1[A]=u$1(a[j],p$1[A]),r(s$1,m$1[A+1],a[j]),j++,A--;else if(h[k]===v[w])m$1[w]=u$1(a[k],p$1[w]),r(s$1,a[j],a[k]),k--,w++;else if(void 0===y&&(y=u(v,w,A),x$1=u(h,j,k)),y.has(h[j]))if(y.has(h[k])){const e=x$1.get(v[w]),t=void 0!==e?a[e]:null;if(null===t){const e=r(s$1,a[j]);u$1(e,p$1[w]),m$1[w]=e;}else m$1[w]=u$1(t,p$1[w]),r(s$1,a[j],t),a[e]=null;w++;}else p(a[k]),k--;else p(a[j]),j++;for(;w<=A;){const e=r(s$1,m$1[A+1]);u$1(e,p$1[w]),m$1[w++]=e;}for(;j<=k;){const e=a[j++];null!==e&&p(e);}return this.ut=v,s(s$1,m$1),x}});

const disconnectedRects = new Map();
class Flip extends c$1 {
  constructor() {
    super();

    this.parent = undefined;
    this.element = undefined;
    this.boundingRect = undefined;
    this.id = undefined;
    this.role = "";
    this.parentRect = null;
  }

  render() {
    return b;
  }

  update(
    part,
    [
      {
        id = undefined,
        role = "",
        options = {},
        heroId = undefined,
        scrolledHeroRect = null,
      } = {},
    ]
  ) {
    this.id = id;
    this.role = role;
    this.heroId = heroId;

    this.scrolledHeroRect = scrolledHeroRect;

    // for column wich became hero, remove all other nodes from it
    // TODO not working for now (deleting nodes with animation)
    if (
      this.role === "hero" &&
      this.id !== this.heroId &&
      this.id !== "dummy"
    ) {
      disconnectedRects.set(this.id, part.getBoundingClientRect());
      this.remove();
    }

    // for new nodes in non-hero columns, slide them from 0 to their positions
    if (this.role !== "hero" && !disconnectedRects.has(this.id)) {
      disconnectedRects.set(this.id, { y: 0, x: 0, width: 0, height: 0 });
    }

    this.options = {
      ...this.options,
      ...options,
    };

    if (this.element !== part.element) {
      this.element = part.element;

      this.parent =
        this.element.parentElement ||
        this.element.getRootNode().querySelector(".column");
    }

    // memorize boundingRect before element updates
    if (this.boundingRect) {
      this.boundingRect = this.element.getBoundingClientRect();
    }
    // the timing on which LitElement batches its updates, to capture the "last" frame of our animation.
    Promise.resolve().then(() => this.prepareToFlip());
    return x;
  }

  prepareToFlip() {
    if (!this.boundingRect) {
      this.boundingRect = disconnectedRects.has(this.id)
        ? disconnectedRects.get(this.id)
        : this.element.getBoundingClientRect();
      disconnectedRects.delete(this.id);
    }

    this.flip();
  }

  flip(listener, removing) {
    let previous = this.boundingRect;

    if (this.id === this.heroId) {
      previous = this.scrolledHeroRect;
      this.boundingRect = this.element.parentElement.getBoundingClientRect();
    } else {
      this.boundingRect = this.element.getBoundingClientRect();
    }

    this.boundingRect = this.element.getBoundingClientRect();

    const deltaY = (previous?.y || 0) - (this.boundingRect?.y || 0);

    if (!deltaY && !removing) {
      return;
    }

    const filteredListener = (event) => {
      if (event.target === this.element) {
        listener(event);
        this.element.removeEventListener("transitionend", filteredListener);
      }
    };

    this.element.addEventListener("transitionend", filteredListener);

    this.element.animate(
      [
        {
          transform: `translate(0, ${deltaY}px)`,
        },
        {
          transform: `translate(0,0)`,
        },
      ],
      this.options
    );
  }

  remove() {
    this.element.animate(
      [
        {
          opacity: 1,

          transform: `translateY(0)`,
        },
        {
          opacity: 0,

          transform: `translateY(${
            this.element.getBoundingClientRect().y + 200
          }px)`,
        },
      ],
      this.options
    ).onfinish = () => {
      if (disconnectedRects.has(this.id)) {
        disconnectedRects.delete(this.id);
      }
      this.element.remove();
    };
  }

  disconnected() {
    if (this.role === "hero") {
      this.remove();
      return;
    }
    this.boundingRect = this.element.getBoundingClientRect();
    if (typeof this.id !== "undefined") {
      disconnectedRects.set(this.id, this.boundingRect);
      requestAnimationFrame(() => {
        if (disconnectedRects.has(this.id)) {
          this.remove();
        }
      });
    }
  }
}

const flip = e(Flip);

class OntologyCard extends s$1 {
  static get styles() {
    return i$1`
    :host {
      display: block;
      position: relative;
      --default-bg-color: white;
      font-family: var(--togostanza-fonts-font_family);
      font-size: var(--togostanza-fonts-font_size_primary);
      color: var(--togostanza-fonts-font_color);
    }

    .-hero-right:before {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-bottom: 1px solid var(--togostanza-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .-hero-left:before {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-bottom: 1px solid var(--togostanza-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .-hero-left-1:after {
      position: absolute;
      content: "";
      width: 0px;
      height: 0px;
      border: 8px solid transparent;
      border-left: 8px solid var(--togostanza-border-color);
      top: min(50%, 15px);
      right: 0;
      transform: translate(50%, -50%) scaleY(0.5);
      box-sizing: border-box;
      z-index: 9;
    }

    .-children-first:before {
      position: absolute;
      z-index: 9;
      content: "";
      width: 1px;
      height: calc(100% - min(50%, 15px) + 5px);
      border-left: 1px solid var(--togostanza-border-color);
      bottom: -6px;
      box-sizing: border-box;
    }

    .-children-first:after {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-bottom: 1px solid var(--togostanza-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .-children-last:before {
      position: absolute;
      z-index: 9;
      content: "";
      width: 1px;
      height: calc(min(50%, 15px) + 6px);
      border-left: 1px solid var(--togostanza-border-color);
      top: -6px;
      box-sizing: border-box;
    }

    .-children-last:after {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-top:  1px solid var(--togostanza-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .-children-mid:before {
      position: absolute;
      z-index: 9;
      content: "";
      width: 1px;
      height: calc(100% + 14px);
      border-left: 1px solid var(--togostanza-border-color);
      top: -6px;
      box-sizing: border-box;
    }

    .-children-mid:after {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-bottom: 1px solid var(--togostanza-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .-parents-first:before {
      position: absolute;
      z-index: 9;
      content: "";
      width: 1px;
      height: calc(100% - min(50%, 15px) + 5px);
      border-right: 1px solid var(--togostanza-border-color);
      bottom: -6px;
      right: 0;
      box-sizing: border-box;
    }

    .-parents-first:after {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-bottom: 1px solid var(--togostanza-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .-parents-last:before {
      position: absolute;
      z-index: 9;
      content: "";
      width: 1px;
      height: calc(min(50%, 15px) + 6px);
      border-right: 1px solid var(--togostanza-border-color);
      top: -6px;
      right: 0;
      box-sizing: border-box;
    }

    .-parents-last:after {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-top: 1px solid var(--togostanza-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .-parents-mid:before {
      position: absolute;
      z-index: 9;
      content: "";
      width: 1px;
      height: calc(100% + 14px);
      border-right: 1px solid var(--togostanza-border-color);
      top: -6px;
      right: 0;
      box-sizing: border-box;
    }

    .-parents-mid:after {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-bottom: 1px solid var(--togostanza-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .-parents-single:after {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-bottom: 1px solid var(--togostanza-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .-children-single:before {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-bottom: 1px solid var(--togostanza-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .ontology-card {
      padding: 10px;
      font-family: var(--togostanza-font-family);
      border: 1px solid var(--togostanza-border-color);
      border-radius: 8px;
      background-color: var(--togostanza-node-bg-color);
      cursor: pointer;
      position: relative;
      width: min(85%, 20rem);
      max-width: 30rem;
      box-sizing: border-box;
      overflow: hidden;
      margin-bottom: 6px;
    }

    .ontology-card:hover {
      filter: brightness(0.98)
    }

    .children-arrow {
      overflow: visible;
    }

    .children-arrow-1:before {
      position: absolute;
      content: "";
      width: 0px;
      height: 0px;
      border: 8px solid transparent;
      border-left: 8px solid var(--togostanza-border-color);
      top: min(50%, 15px);
      left: 0;
      transform: translate(-50%, -50%) scaleY(0.5);
      box-sizing: border-box;
      z-index: 9;
    }

    h3 {
      display: inline;
      margin: 0;
      font-size: var(--togostanza-fonts-font_size_primary);
    }

    .card-container {
      display: flex;
      flex-direction: row;
      justify-content: center;
    }

    .connector {
      position: relative;
      flex-grow: 1;
    }

    .selected {
      background-color: var(--togostanza-node-bg-color_selected);
      border-color: var(--togostanza-border-color_selected);
    }

    .hidden {
      visibility: hidden;
    }

    .table-container {
      overflow-y: auto;
    }

    .hero-list {
      padding-inline-start: 1rem;
    }

    .hero-list li {
      margin-left: 0.5rem;
    }

    table {
      width: 100%
      max-width: 10rem;
      table-layout: fixed;
      font-size: var(--togostanza-fonts-font_size_secondary)
    }

    table td.key {
      vertical-align: top;
      font-style: italic;
    }

    table td.data {
      overflow: auto;
      display: inline-block;
    }
  `;
  }

  static get properties() {
    return {
      data: { type: Object, state: true },
      hidden: { type: Boolean, attribute: true },
      id: { type: String, attribute: true, reflect: true },
      mode: {
        type: String,
        state: true,
      },
      order: {
        type: String,
        state: true,
      },
      prevRect: {
        type: Object,
        state: true,
      },
      content: {
        type: Object,
        state: true,
      },
    };
  }

  shouldUpdate() {
    if (this.data.id === "dummy") {
      this.hidden = true;
    } else {
      this.hidden = false;
    }
    return true;
  }

  constructor() {
    super();
    this.data = {};
    this.hidden = false;
    this.mode = "";
    this.order = "";
    this.prevRect = { x: 0, y: 0, width: 0, height: 0 };
    this._skipKeys = ["label", "children", "parents", "leaf", "root"];
    this.cardRef = e$1();
    this._leftCoinnector = e$1;
    this.leftConnectorClassName = "";
    this.rightConnectorClassName = "";
    this.content = {};
  }

  willUpdate(prevParams) {
    if (this.mode === "hero") {
      // do not display connection liner to right of hero node without children and to left of hero node without parents
      if (this.data.leaf) {
        this.leftConnectorClassName = "-hero-left";
      } else if (this.data.root) {
        this.rightConnectorClassName = "-hero-right";
      } else {
        this.leftConnectorClassName = `-hero-left`;
        this.rightConnectorClassName = `-hero-right`;
      }
    } else if (this.mode === "children") {
      this.leftConnectorClassName = `-${this.mode}-${this.order}`;
    } else if (this.mode === "parents") {
      this.rightConnectorClassName = `-${this.mode}-${this.order}`;
    }

    this.prevMode = prevParams.get("mode");
    if (this.data.id === "dummy") {
      this.leftConnectorClassName = "";
      this.rightConnectorClassName = "";
    }
  }

  updated() {
    const animProps = {
      duration: 500,
      easing: "ease-out",
    };
    if (this.mode === "hero") {
      const animation = [
        {
          height: `${this.prevRect?.height || 0}px`,
          overflow: "hidden",
        },
        {
          height: `${
            this.cardRef?.value.getBoundingClientRect().height || 0
          }px`,
        },
      ];

      animation[0].backgroundColor = this.defaultBgColor;
      animation[1].backgroundColor = this.selectedBgColor;

      this.cardRef.value.animate(animation, animProps);
    }
  }

  firstUpdated() {
    this.defaultBgColor = getComputedStyle(this.cardRef.value).getPropertyValue(
      "--default-bg-color"
    );
    this.selectedBgColor = getComputedStyle(
      this.cardRef.value
    ).getPropertyValue("--selected-bg-color");
  }

  render() {
    return y`
      <div class="card-container">
        <div class="connector ${this.leftConnectorClassName}"></div>
        <div
          ${n(this.cardRef)}
          class="ontology-card ${this.hidden ? "hidden" : ""} ${this.mode ===
          "hero"
            ? "selected"
            : ""} ${this.mode === "children" ? "children-arrow" : ""}"
        >
          <h3>${this.data.label || "..."}</h3>
          ${this.mode === "hero"
            ? y`
                <div class="table-container">
                  <table>
                    <tbody>
                      ${this.data.showDetailsKeys?.map((key) => {
                        return y`
                          <tr>
                            <td class="key">${key}</td>
                            <td class="data">
                              ${this.data[key] instanceof Array
                                ? y`<ul class="hero-list">
                                    ${this.data[key].map(
                                      (item) => y`<li>${item}</li> `
                                    )}
                                  </ul>`
                                : this.data[key]}
                            </td>
                          </tr>
                        `;
                      })}
                    </tbody>
                  </table>
                </div>
              `
            : b}
        </div>
        <div class="connector ${this.rightConnectorClassName}"></div>
      </div>
    `;
  }
}

customElements.define("ontology-card", OntologyCard);

class OntologyBrowserColumn extends s$1 {
  static get styles() {
    return i$1`
      :host {
        flex-grow: 1;
        flex-basis: 0;
        display: block;
        position: relative;
      }

      .column {
        height: 100%;
        position: relative;
        overflow-y: auto;
        overflow-x: hidden;
        max-height: calc(
          var(--togostanza-outline-height) - var(--history-height)
        );
      }
    `;
  }

  static get properties() {
    return {
      nodes: { type: Array, state: true },
      role: { type: String, state: true },
      heroId: {
        type: String,
        state: true,
      },
      scrolledHeroRect: { type: Object, state: true },
      animationOptions: { type: Object, state: true },
    };
  }
  constructor() {
    super();
    this.nodes = []; // array of nodes in children / parents, or [details]
    this.heroId = undefined;
    this.role = "";
    this.scrolledHeroRect = null;
    this.animationOptions = {};
    this.idNodeMap = new Map();
  }

  willUpdate(changed) {
    if (changed.has("nodes")) {
      this.nodes.forEach((node) => {
        this.idNodeMap.set(node.id, node);
      });
    }
    if (changed.has("heroId")) {
      this.previousHeroId = changed.get("heroId");
    }
  }

  _handleClick(e) {
    if (e.target.tagName === "ONTOLOGY-CARD") {
      // only if clicked on the card itself, not on connector div
      if (!e.path[0].classList.contains("connector") && this.role !== "hero") {
        // dispatch event to load new data by id
        this.dispatchEvent(
          new CustomEvent("column-click", {
            detail: {
              role: this.role,
              rect: e.target.getBoundingClientRect(),
              ...this.idNodeMap.get(e.target.id),
            },
            bubbles: true,
            composed: true,
          })
        );
      }
    }
  }

  render() {
    return y`
      <div
        class="column"
        @click="${this.nodes[0].id === "dummy" ? null : this._handleClick}"
      >
        ${this.nodes.length
          ? y`
              ${c(
                this.nodes,
                (node) => node.id,
                (node, index) => {
                  return y`<ontology-card
                    key="${node.id}"
                    id="${node.id}"
                    .data=${node}
                    .mode=${this.role}
                    .prevRect=${this.scrolledHeroRect}
                    .order=${this.nodes.length === 1
                      ? "single"
                      : index === 0
                      ? "first"
                      : index === this.nodes.length - 1
                      ? "last"
                      : "mid"}
                    ${flip({
                      id: node.id,
                      heroId: this.heroId,
                      previousHeroId: this.previousHeroId,
                      role: this.role,
                      scrolledHeroRect: this.scrolledHeroRect,
                      options: this.animationOptions,
                    })}
                  />`;
                }
              )}
            `
          : b}
      </div>
    `;
  }
}

customElements.define("ontology-browser-column", OntologyBrowserColumn);

class OntologyBrowserView extends s$1 {
  static get styles() {
    return i$1`
      :host {
        font-size: 10px;
        display: block;
        height: 100%;
      }

      .clip {
        height: 100%;
        overflow: hidden;
        position: relative;
      }

      .flex {
        height: 100%;
        display: flex;
        flex-direction: row;
      }
    `;
  }

  constructor() {
    super();
    this.flexRef = e$1();
    this.clipRef = e$1();
    this.nodeRef = e$1();
    this.movement = "";
    this.flexWidth = 0;
    this.deltaWidth = 0;
    this.nodeWidth = 0;
    this.gap = 0;
    this.animate = null;
    this.scrolledRect = null;

    this.dataColumns = {
      _parents: [],
      parents: [],
      hero: [],
      children: [],
      _children: [],
    };
    this.animationOptions = {
      duration: 500,
      easing: "ease-in-out",
    };

    this._id = "";
    this._columns = ["parents", "hero", "children"];
    this.data = {};
  }

  static get properties() {
    return {
      data: { type: Object, state: true },
      _columns: {
        type: Array,
        state: true,
      },
    };
  }

  willUpdate(changedProperties) {
    if (changedProperties.has("data")) {
      if (changedProperties.get("data")) {
        if (
          this.data.details.id &&
          changedProperties.get("data").details?.id !== this.data.details.id
        ) {
          // parents before update
          this.dataColumns._parents = changedProperties.get("data").relations
            ?.parents || [{ id: "dummy", label: "dummy" }];
          // children before update
          this.dataColumns._children = changedProperties.get("data").relations
            ?.children || [{ id: "dummy", label: "dummy" }];

          if (this._columns.length === 4) {
            let movement;
            if (this._columns.includes("_parents")) {
              movement = "left";
            } else if (this._columns.includes("_children")) {
              movement = "right";
            } else {
              movement = "";
            }

            // hero before update
            if (movement === "left") {
              this.dataColumns.hero = this.dataColumns._children;
            } else if (movement === "right") {
              this.dataColumns.hero = this.dataColumns._parents;
            }
          } else {
            this.dataColumns.hero = [
              {
                ...this.data.details,
                leaf:
                  !this.data.relations?.children ||
                  !this.data.relations?.children.length,
                root:
                  !this.data.relations?.parents ||
                  !this.data.relations?.parents.length,
              },
            ];
          }

          //parents after update
          this.dataColumns.parents = this.data.relations?.parents || [];
          //children after update
          this.dataColumns.children = this.data.relations?.children || [];
        }
      }

      this.updateComplete.then(() => {
        if (this.data.role === "children") {
          this.movement = "left";

          this._columns = ["_parents", "parents", "hero", "children"];
        } else if (this.data.role === "parents") {
          this.movement = "right";

          this._columns = ["parents", "hero", "children", "_children"];
        }
      });
    }
    if (changedProperties.has("_columns")) {
      this.nodeWidth =
        this.nodeRef.value?.getBoundingClientRect().width -
          (this.nodeRef.value?.getBoundingClientRect().right -
            this.clipRef.value?.getBoundingClientRect().right) || 0;
      this.gap =
        (this.clipRef.value?.getBoundingClientRect().width -
          this.nodeWidth * 3) /
        2;

      this.flexWidth =
        this._columns.length === 4
          ? this.nodeWidth * this._columns.length +
            (this._columns.length - 1) * this.gap +
            "px"
          : "100%";

      this.deltaWidth = this.nodeWidth + this.gap;
    }
  }

  _handleClick(e) {
    if (e.target?.role === "parents" || e.target?.role === "children") {
      this.scrolledRect = e.detail?.rect || null;
    }
  }

  updated() {
    if (this.movement === "left") {
      this.animate = this.flexRef.value.animate(
        [
          { transform: "translateX(0)" },
          {
            transform: `translateX(${-this.deltaWidth}px)`,
          },
        ],
        this.animationOptions
      );
    } else if (this.movement === "right") {
      this.animate = this.flexRef.value.animate(
        [
          {
            transform: `translateX(${-this.deltaWidth}px)`,
          },
          { transform: "translateX(0)" },
        ],
        this.animationOptions
      );
    }

    if (this.animate) {
      this.animate.onfinish = () => {
        this.movement = "";
        this._columns = ["parents", "hero", "children"];
        this.animate = null;
      };
    }
  }

  render() {
    return y`
      <div class="clip" ${n(this.clipRef)}>
        <div
          class="flex"
          @column-click="${this._handleClick}"
          style="width: ${this.flexWidth}"
          ${n(this.flexRef)}
        >
          ${c(
            this._columns,
            (column) => column,
            (column) => {
              return y`
                <ontology-browser-column
                  .role="${column}"
                  .nodes="${this.dataColumns[column].length
                    ? this.dataColumns[column]
                    : [{ id: "dummy", label: "dummy" }]}"
                  ${n(this.nodeRef)}
                  .heroId="${this.data.details?.id}"
                  .scrolledHeroRect="${this.scrolledRect}"
                  .animationOptions="${this.animationOptions}"
                ></ontology-browser-column>
              `;
            }
          )}
        </div>
      </div>
    `;
  }
}

customElements.define("ontology-browser-view", OntologyBrowserView);

class OntologyError extends s$1 {
  static get styles() {
    return i$1`
      .error-wrapper {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(5px);
        z-index: 11;
      }

      .error-container {
        width: max(50%, 15rem);
        min-width: 5rem;
        background-color: var(--togostanza-node-bg-color);
        border-radius: 15px;
        padding: 0 1rem;
        border: 1px solid var(--togostanza-node-border-color);
      }

      h3 {
        margin-top: 0.8rem;
      }
    `;
  }

  static get properties() {
    return {
      message: {
        type: String,
        attribute: "message",
      },
    };
  }

  constructor() {
    super();
    this.message = "";
  }

  render() {
    return y`
      <div class="error-wrapper">
        <div class="error-container">
          <h3>Error</h3>
          <p>${this.message}</p>
        </div>
      </div>
    `;
  }
}

customElements.define("ontology-error", OntologyError);

class OntologyPath extends s$1 {
  constructor() {
    super();
    this.path = [];
    this._container = e$1();
    this.selectedNodeId = "";
  }

  static get styles() {
    return i$1`
      .container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        heigth: var(--history-height);
      }

      .path-header {
        display: block;
        font-size: var(--togostanza-fonts-font_size_primary);
        margin: 0;
        padding: 0;
        width: calc(100% - (100% / 3 - min(85% / 3, 20rem)));
        max-width: calc(100% - (100% / 3 - 30rem));
      }

      .path-container {
        white-space: nowrap;
        overflow-x: scroll;
        display: flex;
        gap: 0.2em;
        align-items: center;
        justify-content: flex-start;
        height: 5rem;
        max-width: calc(100% - (100% / 3 - 30rem));
        width: calc(100% - (100% / 3 - min(85% / 3, 20rem)));
      }

      .node {
        cursor: pointer;
        display: inline-block;
        font-size: var(--togostanza-fonts-font_size_secondary);
        padding: 0 0.6em;
        width: 10em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .node-container {
        display: block;
        position: relative;
        margin-right: -3em;
        transform: rotate(340deg);
      }

      .node-container:before {
        content: "";
        display: block;
        width: 5px;
        height: 5px;
        border: 1px solid var(--togostanza-border-color);
        position: absolute;
        border-radius: 50%;
        bottom: 0;
      }

      .node-container + .node-container:after {
        content: "";
        display: block;
        width: 2.35em;
        height: 1px;
        border-bottom: 1px solid var(--togostanza-border-color);
        transform: rotate(200deg);
        transform-origin: left bottom;
        box-sizing: border-box;
        position: absolute;
        bottom: 0.25em;
      }

      .node:hover {
        filter: brightness(1.05);
      }

      .-active {
        font-weight: bold;
      }
    `;
  }

  static get properties() {
    return {
      path: { type: Array, state: true },
      selectedNodeId: { type: String, state: true },
    };
  }

  _nodeClickHandler(e) {
    if (e.target.classList.contains("node")) {
      this.selectedNodeId = e.target.id;
      const selectedNodeId = e.target.id.match(/(^.+(?=-))/g)[0];

      this.dispatchEvent(
        new CustomEvent("history-clicked", {
          detail: {
            id: selectedNodeId,
          },
          composed: true,
        })
      );
    }
  }

  updated(changed) {
    if (changed.get("path")) {
      this._container.value.scrollLeft = this._container.value.scrollWidth;
    }
  }

  render() {
    return y`
      <div class="container">
        <h2 class="path-header">History</h2>
        <div
          class="path-container"
          @click="${this._nodeClickHandler}"
          ${n(this._container)}
        >
          ${o(this.path, (node, i) => {
            const id = `${node.id}-${i}`;
            return y`<span class="node-container">
              <span
                id="${id}"
                class="node ${id === this.selectedNodeId ? "-active" : ""}"
                title="${node.label}"
                >${node.label}</span
              >
            </span>`;
          })}
        </div>
      </div>
    `;
  }
}

customElements.define("ontology-browser-path", OntologyPath);

class OntologyBrowser extends s$1 {
  static get styles() {
    return i$1`
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }

      .container {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .spinner {
        z-index: 10;
        position: absolute;
        width: 100%;
        height: 100%;
      }

      ontology-error {
        z-index: 11;
      }

      .spinner > img {
        display: block;
        width: 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    `;
  }

  static get properties() {
    return {
      diseaseId: {
        type: String,
        reflect: true,
      },
      data: { state: true },
      loading: { type: Boolean, state: true },
      error: { type: Object, state: true },
      clickedRole: {
        type: String,
        status: true,
      },
      apiEndPoint: {
        type: String,
        state: true,
      },
      showKeys: {
        type: Array,
        state: true,
      },
      pathArray: {
        type: Array,
        state: true,
      },
      activeNode: {
        type: Object,
        state: true,
      },
    };
  }

  constructor(element) {
    super();
    this._timer = null;

    element.append(this);

    this.data = [];
    this.loading = false;
    this.clickedRole = undefined;
    this.diseaseId = undefined;
    this.apiEndpoint = "";
    this.error = { message: "", isError: false };
    this.showKeys = ["id", "label"];
    this.pathArray = [];
    this.activeNode = {};

    this.historyClicked = false;

    this.API = new cachedAxios();
  }

  updateParams(params) {
    try {
      this._validateParams(params);

      applyConstructor.call(this, params);

      this.showKeys = this.nodeDetailsShowKeys
        ? this.nodeDetailsShowKeys.split(",").map((key) => key.trim())
        : [];

      this.error = { message: "", isError: false };

      this.diseaseId = this.initialId;
    } catch (error) {
      this.error = { message: error.message, isError: true };
    }
  }

  _validateParams(params) {
    for (const key in params) {
      if (key === "api-endpoint") {
        if (!params[key].includes("<>")) {
          throw new Error("Placeholder '<>' should be present in the API URL");
        }
      }
    }
  }

  _loadData() {
    this.API.get(this._getURL(this.diseaseId))
      .then(({ data }) => {
        this.data = {
          role: this.clickedRole,
          ...this._getDataObject(data),
        };

        this.activeNode = {
          id: this.data.details.id,
          label: this.data.details.label,
        };

        if (!this.historyClicked) {
          this.pathArray = [...this.pathArray, this.activeNode];
        }
      })
      .catch((e) => {
        console.error(e);
        this.error = { message: e.message, isError: true };
      })
      .finally(() => {
        this._loadingEnded();
      });
  }

  willUpdate(changed) {
    console.log("this.historyClicked", this.historyClicked);
    if (
      (changed.has("diseaseId") || changed.has("apiEndpoint")) &&
      this.diseaseId
    ) {
      this.error = { message: "", isError: false };
      this._loadData();
    }
    if (changed.has("pathArray")) {
      if (this.pathArray.length > 10) {
        this.pathArray = this.pathArray.slice(1);
      }
    }
  }

  firstUpdated() {
    this._loadingStarted();
    this.diseaseId = this.initialId;
  }
  _handleHistoryClick({ detail: { id } }) {
    this.historyClicked = true;
    this.diseaseId = id;
  }

  _getDataObject(incomingData) {
    //validate
    const nodeIdVal = getByPath(incomingData, this.nodeIdPath);
    if (!nodeIdVal) {
      throw new Error("Node id path is not valid");
    }
    const nodeLabelVal = getByPath(incomingData, this.nodeLabelPath);
    if (!nodeLabelVal) {
      throw new Error("Node label path is not valid");
    }
    const childrenArr = getByPath(incomingData, this.nodeRelationsChildrenPath);

    if (childrenArr instanceof Array) {
      if (childrenArr.length > 0) {
        if (!childrenArr.some((item) => item[this.nodeRelationsIdKey])) {
          throw new Error("Path to node children id is not valid ");
        }
        if (!childrenArr.some((item) => item[this.nodeRelationsLabelKey])) {
          throw new Error("Path to node children label is not valid ");
        }
      }
    } else {
      throw new Error("Path to node children is not valid ");
    }

    const parentsArr = getByPath(incomingData, this.nodeRelationsParentsPath);

    if (parentsArr instanceof Array) {
      if (parentsArr.length > 0) {
        if (!parentsArr.some((item) => item[this.nodeRelationsIdKey])) {
          throw new Error("Path to node children id is not valid ");
        }
        if (!parentsArr.some((item) => item[this.nodeRelationsLabelKey])) {
          throw new Error("Path to node children label is not valid ");
        }
      }
    } else {
      throw new Error("Path to node parents is not valid ");
    }

    return {
      details: {
        ...getByPath(incomingData, this.nodeDetailsPath),
        id: nodeIdVal,
        label: nodeLabelVal,
        showDetailsKeys: this.showKeys,
      },
      relations: {
        children: childrenArr.map((item) => ({
          ...item,
          id: item[this.nodeRelationsIdKey],
          label: item[this.nodeRelationsLabelKey],
        })),
        parents: parentsArr.map((item) => ({
          ...item,
          id: item[this.nodeRelationsIdKey],
          label: item[this.nodeRelationsLabelKey],
        })),
      },
    };
  }

  _getURL(id) {
    return this.apiEndpoint.replace("<>", id);
  }

  _changeDiseaseEventHadnler(e) {
    e.stopPropagation();
    this.historyClicked = false;
    this.diseaseId = e.detail.id;
    this.clickedRole = e.detail.role;
    this._loadingStarted();

    this.updateComplete.then(() => {
      this.dispatchEvent(
        new CustomEvent("ontology-node-changed", {
          // here we can pass any data to the event through this.data
          detail: {
            id: e.detail.id,
            label: e.detail.label,
            ...this.data,
          },
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  _loadingStarted() {
    this._timer = setTimeout(() => {
      this.loading = true;
    }, 200);
  }

  _loadingEnded() {
    this.loading = false;
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  render() {
    return y`
      <div class="container">
        ${this.showHistory
          ? y`<ontology-browser-path
              @history-clicked="${this._handleHistoryClick}"
              .path=${this.pathArray}
            >
            </ontology-browser-path>`
          : b}
        ${this.loading
          ? y`<div class="spinner">
              <img src="${loaderPNG}"></img>
            </div>`
          : b}
        ${this.error.isError
          ? y`
              <ontology-error message="${this.error.message}"> </ontology-error>
            `
          : b}
        <ontology-browser-view
          .data=${this.data}
          @column-click="${this._changeDiseaseEventHadnler}"
        ></ontology-browser-view>
      </div>
    `;
  }
}

customElements.define("ontology-browser", OntologyBrowser);

class Linechart extends Stanza {
  menu() {
    return [];
  }

  render() {
    appendCustomCss(this, this.params["custom_css_url"]);

    const root = this.root.querySelector("main");

    if (!this.ontologyViewer) {
      this.ontologyViewer = new OntologyBrowser(root);
    }

    this.ontologyViewer.updateParams(this.params);
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Linechart
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "ontology-browser",
	"stanza:label": "Ontology browser",
	"stanza:definition": "Graphical ontology browser",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE"
],
	"stanza:created": "2022-09-06",
	"stanza:updated": "2022-09-06",
	"stanza:parameter": [
	{
		"stanza:key": "api_endpoint",
		type: "string",
		"stanza:example_old": "https://togovar.biosciencedbc.jp/api/inspect/disease?node=<>",
		"stanza:example": "https://hpo.jax.org/api/hpo/term/<>",
		"stanza:description": "Get node details and relations API endpoint",
		"stanza:required": true
	},
	{
		"stanza:key": "custom_css_url",
		type: "string",
		"stanza:example": "",
		"stanza:description": "URL of custom CSS",
		"stanza:required": false
	},
	{
		"stanza:key": "initial_id",
		type: "string",
		"stanza:example_old": "MONDO_0005709",
		"stanza:example": "HP:0001168",
		"stanza:description": "Node id to be shown at load time",
		"stanza:required": true
	},
	{
		"stanza:key": "node-id_path",
		type: "string",
		"stanza:example_old": "id",
		"stanza:example": "details.id",
		"stanza:description": "Key with unique node id",
		"stanza:required": true
	},
	{
		"stanza:key": "node-label_path",
		type: "string",
		"stanza:example_old": "label",
		"stanza:example": "details.name",
		"stanza:description": "JSON path to node label path, separated by dot '.' (e.g. 'details.label') ",
		"stanza:required": true
	},
	{
		"stanza:key": "node-details_path",
		"stanza:type": "string",
		"stanza:example_old": "",
		"stanza:example": "details",
		"stanza:description": "JSON path to node details data in API response, separated by dot '.' (e.g. 'data.details') ",
		"stanza:required": false
	},
	{
		"stanza:key": "node-details_show_keys",
		"stanza:type": "string",
		"stanza:example": "definition, synonyms, xrefs",
		"stanza:description": "Show keys list, comma separated",
		"stanza:required": false
	},
	{
		"stanza:key": "node-relations-parents_path",
		"stanza:type": "string",
		"stanza:example_old": "parents",
		"stanza:example": "relations.parents",
		"stanza:description": "JSON path to node parents array, separated by dot '.' (e.g. 'data.relations.parents')",
		"stanza:required": true
	},
	{
		"stanza:key": "node-relations-children_path",
		"stanza:type": "string",
		"stanza:example_old": "children",
		"stanza:example": "relations.children",
		"stanza:description": "JSON path to node children array,  separated by dot '.' (e.g. 'data.relations.children')",
		"stanza:required": false
	},
	{
		"stanza:key": "node-relations-id_key",
		"stanza:type": "string",
		"stanza:example_old": "id",
		"stanza:example": "ontologyId",
		"stanza:description": "JSON path to id key of parent or child node,  separated by dot '.' (e.g. 'path.to.id')",
		"stanza:required": false
	},
	{
		"stanza:key": "node-relations-label_key",
		"stanza:type": "string",
		"stanza:example_old": "label",
		"stanza:example": "name",
		"stanza:description": "JSON path to label key of parent or child node,  separated by dot '.' (e.g. 'path.to.label')",
		"stanza:required": false
	},
	{
		"stanza:key": "show_history",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:description": "Whether to show history of navigation",
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
		"stanza:description": "Card font color"
	},
	{
		"stanza:key": "--togostanza-fonts-font_size_primary",
		"stanza:type": "text",
		"stanza:default": "10px",
		"stanza:description": "Card title font size"
	},
	{
		"stanza:key": "--togostanza-fonts-font_size_secondary",
		"stanza:type": "text",
		"stanza:default": "8px",
		"stanza:description": "Card contents font size"
	},
	{
		"stanza:key": "--togostanza-outline-height",
		"stanza:type": "text",
		"stanza:default": "500px",
		"stanza:description": "Stanza height. Width is always 100%, a la div with `display: block`"
	},
	{
		"stanza:key": "--togostanza-border-color",
		"stanza:type": "color",
		"stanza:default": "#9b9ca1",
		"stanza:description": "Border color"
	},
	{
		"stanza:key": "--togostanza-border-color_selected",
		"stanza:type": "color",
		"stanza:default": "#1f9dad",
		"stanza:description": "Selected border color"
	},
	{
		"stanza:key": "--togostanza-node-bg-color",
		"stanza:type": "color",
		"stanza:default": "#ffffff",
		"stanza:description": "Node background color"
	},
	{
		"stanza:key": "--togostanza-node-bg-color_selected",
		"stanza:type": "color",
		"stanza:default": "#fff6e0",
		"stanza:description": "Selected node background color"
	},
	{
		"stanza:key": "--togostanza-theme-background_color",
		"stanza:type": "color",
		"stanza:default": "rgba(255,255,255,0)",
		"stanza:description": "Background color"
	}
],
	"stanza:outgoingEvent": [
	{
		"stanza:key": "ontology-node-changed",
		"stanza:description": "Being dispatched on change of the active node. `event.details` contains the info of that node."
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=ontology-browser.js.map

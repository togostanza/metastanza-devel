import axios from "axios";
import camelCase from "lodash.camelcase";
import get from "lodash.get";

/** Cached axios */
export class cachedAxios {
  /**
   * Create cached axios instance
   * @param {string} baseURL - base URL.
   * @param {number} maxCacheSize - maximum cache entries number. After reaching this treshold, oldest entries will be deleted from cache.
   */
  constructor(maxCacheSize = 100) {
    this.axios = axios.create({
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

export function debounce(func, ms = 1000) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, arguments), ms);
  };
}

export function getByPath(object, path) {
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

export function mapJsonToProps(json) {
  const props = {};
  json.forEach((attr) => {
    props[camelCase(attr.name)] = {
      type: getType(attr.type),
      attribute: attr.name,
      reflect: true,
    };
  });
  return props;
}

export function applyConstructor(params) {
  for (const param in params) {
    this[camelCase(param)] = params[param] || undefined;
  }
}

function getType(type) {
  switch (type) {
    case "String":
      return String;
    case "Number":
      return Number;
    case "Boolean":
      return Boolean;

    default:
      return String;
  }
}

export function getMarginsFromCSSString(str) {
  const splitted = str.trim().split(/\W+/);

  const res = {
    TOP: 0,
    RIGHT: 0,
    BOTTOM: 0,
    LEFT: 0,
  };

  switch (splitted.length) {
    case 1:
      res.TOP = res.RIGHT = res.BOTTOM = res.LEFT = parseInt(splitted[0]) || 0;
      break;
    case 2:
      res.TOP = res.BOTTOM = parseInt(splitted[0]) || 0;
      res.LEFT = res.RIGHT = parseInt(splitted[1]) || 0;
      break;
    case 3:
      res.TOP = parseInt(splitted[0]) || 0;
      res.LEFT = res.RIGHT = parseInt(splitted[1]) || 0;
      res.BOTTOM = parseInt(splitted[2]) || 0;
      break;
    case 4:
      res.TOP = parseInt(splitted[0]) || 0;
      res.RIGHT = parseInt(splitted[1]) || 0;
      res.BOTTOM = parseInt(splitted[2]) || 0;
      res.LEFT = parseInt(splitted[3]) || 0;
      break;
    default:
      break;
  }

  return res;
}

export function checkIfHexColor(text) {
  const regex = /^#(?:[0-9a-f]{3}){1,2}$/i;
  return regex.test(text);
}

/**
 * Example usage: emitSelectedEvent.apply(null, [this, d.data["__togostanza_id__"]]);
 * @date 19/02/2024
 *
 * @export
 * @param {{ stanza: any; targetId: string|number; targetElementSelector: string; selectedElementSelector: string; idPath: string; }} param0 - object with parameters
 * @param {*} param0.stanza - stanza object
 * @param {*} param0.targetId - id of the selected element (e.g. d.data["__togostanza_id__"])
 * @param {*} param0.targetElementSelector - selector for the target elements
 * @param {*} param0.selectedElementSelector - selector for the selected elements
 * @param {*} param0.idPath - path to the id in the data object (e.g. "data.__togostanza_id__")
 */
export function emitSelectedEvent({
  drawing,
  rootElement = undefined,
  targetId,
  targetElementSelector,
  selectedElementClassName,
  selectedElementSelector,
  idPath,
}) {
  const convertToString = (id) => {
    return typeof id === "number" ? id.toString() : id;
  };

  targetId = convertToString(targetId);

  const isD3Drawing = drawing.selectAll !== undefined;

  // get filter nodes
  const targetElements = isD3Drawing
    ? drawing.selectAll(targetElementSelector)
    : Array.from(drawing.shadowRoot.querySelectorAll(targetElementSelector));
  const selectedElements = isD3Drawing
    ? targetElements.filter(selectedElementSelector)
    : targetElements.filter((el) => {
        return el.classList.contains(selectedElementClassName);
      });
  const selectedIds = isD3Drawing
    ? selectedElements.data().map((d) => {
        const id = get(d, idPath);
        return convertToString(id);
      })
    : selectedElements.map((el) => el.id.replace("column-tree-checkbox-", ""));

  if (!selectedIds.includes(targetId)) {
    selectedIds.push(targetId);
  } else {
    selectedIds.splice(selectedIds.indexOf(targetId), 1);
  }
  console.log(rootElement, selectedIds);
  rootElement.dispatchEvent(
    new CustomEvent("changeSelectedNodes", {
      detail: selectedIds,
    })
  );
}

/**
 * Add class name to selected elements
 * @date 19/02/2024
 *
 * @export
 * @param {{ stanza: any; selectedIds: Array<string|number>; targetElementSelector: string; selectedElementClassName: string; idPath: string; }} param0
 * @param {*} param0.stanza - stanza object
 * @param {*} param0.selectedIds - array of selected ids
 * @param {*} param0.targetElementSelector - selector for the target elements
 * @param {*} param0.selectedElementClassName - class name to be added to the selected elements
 * @param {*} param0.idPath - path to the id in the data object (e.g. "data.__togostanza_id__")
 */
export function updateSelectedElementClassName({
  drawing,
  selectedIds,
  targetElementSelector,
  selectedElementClassName,
  idPath,
  idPrefix = "",
}) {
  const isD3Drawing = drawing.selectAll !== undefined;
  const targetElements = isD3Drawing
    ? drawing.selectAll(targetElementSelector)
    : drawing.shadowRoot.querySelectorAll(targetElementSelector);
  console.log(targetElements);
  if (isD3Drawing) {
    targetElements.classed(selectedElementClassName, (d) => {
      let targetId = get(d, idPath);

      // make sure all ids are string, convert if necessary
      targetId = typeof targetId === "number" ? targetId.toString() : targetId;
      selectedIds = selectedIds.map((id) =>
        typeof id === "number" ? id.toString() : id
      );

      return selectedIds.indexOf(targetId) !== -1;
    });
  } else {
    Array.from(targetElements).forEach((el) => {
      console.log({ selectedIds });
      console.log(el.id);
      console.log(el.id.replace(idPrefix, ""));
      console.log(selectedIds.includes(el.id.replace(idPrefix, "")));
      return selectedIds.includes(el.id.replace(idPrefix, ""));
    });
  }
}

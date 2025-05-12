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

export function toggleSelectIds({ selectedIds, targetId }) {
  !selectedIds.includes(targetId)
    ? selectedIds.push(targetId)
    : selectedIds.splice(selectedIds.indexOf(targetId), 1);
}

export function toggleSelectedIdsMultiple({ selectedIds, targetIds }) {
  targetIds.forEach((targetId) => {
    toggleSelectIds({ selectedIds, targetId });
  });
}

export function emitSelectedEvent({
  rootElement = undefined,
  selectedIds,
  targetId,
  dataUrl,
}) {
  rootElement.dispatchEvent(
    new CustomEvent("changeSelectedNodes", {
      detail: { targetId, selectedIds, dataUrl },
    })
  );
}

export function updateSelectedElementClassNameForD3({
  drawing,
  selectedIds,
  targetElementSelector,
  selectedElementClassName,
  idPath,
}) {
  drawing
    .selectAll(targetElementSelector)
    .classed(selectedElementClassName, (d) => {
      const targetId = get(d, idPath);
      return selectedIds.indexOf(targetId) !== -1;
    });
}

// TODO update utils.d.ts and JSDoc

export function displayApiError(element, error) {
  const htmlString = `
  <div class="metastanza-error-message-div">
    <p class="metastanza-error-message">
      <span>MetaStanza API error</span>
      <br>
      <span>${error.name}: ${error.message}</span>
    </p>
  </div>
`;

  element.insertAdjacentHTML("beforeend", htmlString);
}

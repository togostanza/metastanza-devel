import { appendCustomCss } from "togostanza-utils";
import { Data } from "togostanza-utils/data";
import Stanza from "togostanza/stanza";
import { BasePlugin } from "./plugins/BasePlugin";
import { getMarginsFromCSSString, MarginsI } from "./utils";

/** Common event names used in MetaStanza */
export const METASTANZA_EVENTS = {
  CHANGE_SELECTED_NODES: "changeSelectedNodes",
} as const;

export const METASTANZA_ALLOWED_EVENTS = Object.values(METASTANZA_EVENTS);

export type MetastanzaEvent =
  | (typeof METASTANZA_EVENTS)[keyof typeof METASTANZA_EVENTS]
  | (string & {});

export const METASTANZA_COMMON_PARAMS = {
  LISTEN_TO_SELECTION_EVENTS: "event-incoming_change_selected_nodes",
  DISPATCH_SELECTION_EVENTS: "event-outgoing_change_selected_nodes",
  DATA_URL: "data-url",
} as const;

/** Data-attribute that used to identify the element */
export const METASTANZA_DATA_ATTR = "data-id" as const;

export const METASTANZA_NODE_ID_KEY = "__togostanza_id__" as const;

export default abstract class extends Stanza {
  _data: any;
  __data: Data;
  _main: HTMLElement;
  abstract renderNext(): Promise<void>;
  _apiError = false;
  _error: Error;

  private plugins: Map<string, BasePlugin> = new Map();

  get MARGIN(): MarginsI {
    return getMarginsFromCSSString(this.css("--togostanza-canvas-padding"));
  }

  css(key: string) {
    return getComputedStyle(this.element).getPropertyValue(key);
  }

  emit<P extends unknown>(eventType: MetastanzaEvent, data: P) {
    this.element.dispatchEvent(
      new CustomEvent(eventType, {
        detail: data,
      })
    );
  }

  use(plugin: BasePlugin) {
    plugin.init(this);
    this.plugins.set(plugin.name, plugin);
    return this;
  }

  getPlugin<T extends BasePlugin>(name: string): T | undefined {
    return this.plugins.get(name) as T;
  }

  async render() {
    appendCustomCss(this, this.params["togostanza-custom_css_url"]);

    this._main = this.root.querySelector("main");
    // To maintain compatibility, we assign values to __data,
    // but in the future we would like to make _data the return value of Data.load itself.
    try {
      this.__data = await Data.load(this.params["data-url"], {
        type: this.params["data-type"],
        mainElement: this._main,
      });
      this._data = this.__data.data;
      this._apiError = false;
      this._error = undefined;
    } catch (error) {
      this._apiError = true;
      this._error = error;
    } finally {
      await this.renderNext();
    }
  }
}

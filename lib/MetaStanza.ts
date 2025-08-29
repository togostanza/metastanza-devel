import { appendCustomCss } from "togostanza-utils";
import { Data } from "togostanza-utils/data";
import Stanza from "togostanza/stanza";
import { getMarginsFromCSSString, MarginsI } from "./utils";
import { SelectionPlugin } from "./plugins/BaseSelectionPlugin";

export default abstract class extends Stanza {
  _data: any;
  __data: Data;
  _main: HTMLElement;
  abstract renderNext(): Promise<void>;
  _apiError = false;
  _error: Error;

  private plugins: Map<string, SelectionPlugin> = new Map();

  get MARGIN(): MarginsI {
    return getMarginsFromCSSString(this.css("--togostanza-canvas-padding"));
  }

  css(key: string) {
    return getComputedStyle(this.element).getPropertyValue(key);
  }

  emit(eventType: string, data: any) {
    this.element.dispatchEvent(
      new CustomEvent(eventType, {
        detail: data,
      })
    );
  }

  use(plugin: SelectionPlugin) {
    plugin.init(this);
    this.plugins.set(plugin.name, plugin);
    return this;
  }

  getPlugin<T extends SelectionPlugin>(name: string): T | undefined {
    return this.plugins.get(name) as T;
  }

  protected handleSelection(event: MouseEvent, target: any): void {
    const selectionPlugin = this.getPlugin("selection");

    if (!selectionPlugin) return;

    if (event.shiftKey) {
      selectionPlugin.onShiftSelect(event, target);
    } else {
      selectionPlugin.onSelect(event, target);
    }
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

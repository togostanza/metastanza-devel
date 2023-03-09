import Stanza from "togostanza/stanza";
import { appendCustomCss } from "togostanza-utils";
import { getMarginsFromCSSString, MarginsI } from "./utils";
import { Data } from "togostanza-utils/data";

export default abstract class extends Stanza {
  _data: any;
  __data: Data;
  _main: HTMLElement;
  abstract renderNext(): Promise<void>;

  get MARGIN(): MarginsI {
    return getMarginsFromCSSString(this.css("--togostanza-canvas-padding"));
  }

  css(key: string) {
    return getComputedStyle(this.element).getPropertyValue(key);
  }

  async render() {
    appendCustomCss(this, this.params["togostanza-custom_css_url"]);

    this._main = this.root.querySelector("main");

    this.__data = await Data.load(this.params["data-url"], {
      type: this.params["data-type"],
      mainElement: this._main,
    });

    this._data = this.__data.data;

    await this.renderNext();
  }
}

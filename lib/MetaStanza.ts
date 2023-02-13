import Stanza from "togostanza/stanza";
import loadData from "togostanza-utils/load-data";
import { appendCustomCss } from "togostanza-utils";
import { getMarginsFromCSSString, MarginsI } from "./utils";

export default abstract class extends Stanza {
  _data: any;
  _main: HTMLElement;
  MARGIN: MarginsI;
  abstract renderNext(): Promise<void>;

  css(key: string) {
    return getComputedStyle(this.element).getPropertyValue(key);
  }

  async render() {
    appendCustomCss(this, this.params["togostanza-custom_css_url"]);

    this._main = this.root.querySelector("main");

    this.MARGIN = getMarginsFromCSSString(
      this.css("--togostanza-canvas-padding")
    );

    this._data = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );

    await this.renderNext();
  }
}

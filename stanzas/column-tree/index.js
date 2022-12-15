import Stanza from "togostanza/stanza";
import { createApp } from "vue";
import App from "./app.vue";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
  appendCustomCss,
} from "togostanza-utils";
import { camelCase } from "lodash";
export default class ColumnTree extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "column-tree"),
      downloadPngMenuItem(this, "column-tree"),
      downloadJSONMenuItem(this, "column-tree", this._data),
      downloadCSVMenuItem(this, "column-tree", this._data),
      downloadTSVMenuItem(this, "column-tree", this._data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom_css_url"]);

    const main = this.root.querySelector("main");

    const camelCaseParams = {};
    Object.entries(this.params).forEach(([key, value]) => {
      camelCaseParams[camelCase(key)] = value;
    });

    this._app?.unmount();
    this._app = createApp(App, { ...camelCaseParams, main });
    this._app.mount(main);
  }
}

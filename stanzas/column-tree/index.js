import Stanza from "togostanza/stanza";
import { createApp } from "vue";
import App from "./app.vue";
import { appendCustomCss } from "togostanza-utils";
import { camelCase } from "lodash";
export default class ColumnTree extends Stanza {
  async render() {
    appendCustomCss(this, this.params["custom_css_url"]);

    const main = this.root.querySelector("main");
    main.parentNode.style.backgroundColor =
      "var(--togostanza-background-color)";

    const camelCaseParams = {};
    Object.entries(this.params).forEach(([key, value]) => {
      camelCaseParams[camelCase(key)] = value;
    });

    this._app?.unmount();
    this._app = createApp(App, { ...camelCaseParams, main });
    this._app.mount(main);
  }
}

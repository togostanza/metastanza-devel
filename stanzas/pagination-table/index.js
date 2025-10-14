import { createApp } from "vue";
import App from "./app.vue";
import MetaStanza from "@/lib/MetaStanza";

import {
  appendCustomCss,
  downloadCSVMenuItem,
  downloadJSONMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";
import { SelectionPlugin } from "../../lib/plugins/SelectionPlugin";

export default class PaginationTable extends MetaStanza {
  _selectionPlugin;

  menu() {
    return [
      downloadJSONMenuItem(this, "table", this._component?.json()),
      downloadCSVMenuItem(this, "table", this._component?.json()),
      downloadTSVMenuItem(this, "table", this._component?.json()),
    ];
  }

  async renderNext() {
    appendCustomCss(this, this.params["togostanza-custom_css_url"]);

    const main = this.root.querySelector("main");

    // Set border styles from CSS variables
    const borderHorizontal = window
      .getComputedStyle(this.element)
      .getPropertyValue("--togostanza-border-horizontal")
      .trim();
    const borderVertical = window
      .getComputedStyle(this.element)
      .getPropertyValue("--togostanza-border-vertical")
      .trim();
    main.dataset.borderHorizontal = borderHorizontal;
    main.dataset.borderVertical = borderVertical;

    this._app?.unmount();

    const drawContent = async () => {
      this._app = createApp(App, {
        ...this.params,
        main,
        stanzaElement: this.element,
      });
      this._component = this._app.mount(main);
    };

    await drawContent();

    this._selectionPlugin = new SelectionPlugin({
      mode: "range",
      adapter: "vue",
      component: this._component,
      stanza: this,
      passIdsToComponent: this._component.updateSelectedRows,
    });

    this.use(this._selectionPlugin);
  }
}

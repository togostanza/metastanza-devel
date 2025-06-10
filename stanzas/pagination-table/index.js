import { createApp } from "vue";
import App from "./app.vue";
import MetaStanza from "@/lib/MetaStanza";

import {
  appendCustomCss,
  downloadCSVMenuItem,
  downloadJSONMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";

export default class PaginationTable extends MetaStanza {
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
    // main.parentNode.style.backgroundColor =
    //   "var(--togostanza-background-color)"; TODO: コメントアウトしたが、要検討
    main.parentNode.style.padding = this.params["padding"];

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
    this._app = createApp(App, {
      ...this.params,
      main,
      stanzaElement: this.element,
    });
    this._component = this._app.mount(main);
  }

  handleEvent(event) {
    if (this.params["event-incoming_change_selected_nodes"]) {
      this._component.updateSelectedRows(event.detail);
    }
  }
}

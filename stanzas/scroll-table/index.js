import MetaStanza from "@/lib/MetaStanza";

import { appendCustomCss } from "togostanza-utils";

import { createApp } from "vue";
import App from "./app.vue";

export default class ScrollTable extends MetaStanza {
  async renderNext() {
    appendCustomCss(this, this.params["togostanza-custom_css_url"]);

    const main = this.root.querySelector("main");
    main.parentNode.style.backgroundColor =
      "var(--togostanza-background-color)";

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
    this._app = createApp(App, { ...this.params, main });
    this._app.mount(main);
  }
}

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
  _messageParamObserver;

  menu() {
    return [
      downloadJSONMenuItem(this, "table", this._component?.json()),
      downloadCSVMenuItem(this, "table", this._component?.json()),
      downloadTSVMenuItem(this, "table", this._component?.json()),
    ];
  }

  async renderNext() {
    this._messageParamObserver?.disconnect();
    this._messageParamObserver = undefined;

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

    const attributeMessageNotFound =
      this.element.getAttribute("message-not_found") ?? undefined;
    const attributeMessageLoadError =
      this.element.getAttribute("message-load_error") ?? undefined;

    const resolvedMessageNotFound =
      attributeMessageNotFound ?? this.params["message-not_found"];
    const resolvedMessageLoadError =
      attributeMessageLoadError ?? this.params["message-load_error"];

    this.params["message-not_found"] = resolvedMessageNotFound;
    this.params["message-load_error"] = resolvedMessageLoadError;

    const drawContent = async () => {
      this._app = createApp(App, {
        ...this.params,
        "message-not_found": resolvedMessageNotFound,
        "message-load_error": resolvedMessageLoadError,
        main,
        stanzaElement: this.element,
      });
      this._component = this._app.mount(main);
    };

    await drawContent();

    this._component?.updateMessageStrings?.(
      resolvedMessageNotFound,
      resolvedMessageLoadError
    );

    this._messageParamObserver = new MutationObserver((mutations) => {
      let hasRelevantChange = false;
      let nextNotFound = this.params["message-not_found"];
      let nextLoadError = this.params["message-load_error"];

      for (const mutation of mutations) {
        if (mutation.type !== "attributes") {
          continue;
        }

        if (mutation.attributeName === "message-not_found") {
          hasRelevantChange = true;
          nextNotFound = this.element.getAttribute("message-not_found") ?? undefined;
          this.params["message-not_found"] = nextNotFound;
        } else if (mutation.attributeName === "message-load_error") {
          hasRelevantChange = true;
          nextLoadError = this.element.getAttribute("message-load_error") ?? undefined;
          this.params["message-load_error"] = nextLoadError;
        }
      }

      if (!hasRelevantChange) {
        return;
      }

      this._component?.updateMessageStrings?.(nextNotFound, nextLoadError);
    });

    this._messageParamObserver.observe(this.element, {
      attributes: true,
      attributeFilter: ["message-not_found", "message-load_error"],
    });

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

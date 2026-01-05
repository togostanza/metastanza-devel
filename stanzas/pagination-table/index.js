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

const MESSAGE_PARAM_KEYS = ["message-not_found", "message-load_error"];

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

    const normalizeAttrValue = (value) => (value === null ? undefined : value);
    const syncParamsFromAttributes = (keys) => {
      return keys.reduce((acc, key) => {
        const attrValue = normalizeAttrValue(this.element.getAttribute(key));
        const resolvedValue = attrValue ?? this.params[key];
        this.params[key] = resolvedValue;
        acc[key] = resolvedValue;
        return acc;
      }, {});
    };

    const messageParams = syncParamsFromAttributes(MESSAGE_PARAM_KEYS);

    const drawContent = async () => {
      this._app = createApp(App, {
        ...this.params,
        ...messageParams,
        main,
        stanzaElement: this.element,
      });
      this._component = this._app.mount(main);
    };

    await drawContent();

    this._component?.updateMessageStrings?.(
      messageParams["message-not_found"],
      messageParams["message-load_error"]
    );

    this._messageParamObserver = new MutationObserver((mutations) => {
      let hasRelevantChange = false;
      const nextMessageParams = { ...messageParams };

      for (const mutation of mutations) {
        if (
          mutation.type !== "attributes" ||
          !MESSAGE_PARAM_KEYS.includes(mutation.attributeName)
        ) {
          continue;
        }

        hasRelevantChange = true;
        const nextValue = normalizeAttrValue(
          this.element.getAttribute(mutation.attributeName)
        );
        nextMessageParams[mutation.attributeName] = nextValue;
        this.params[mutation.attributeName] = nextValue;
      }

      if (!hasRelevantChange) {
        return;
      }

      Object.assign(messageParams, nextMessageParams);

      this._component?.updateMessageStrings?.(
        nextMessageParams["message-not_found"],
        nextMessageParams["message-load_error"]
      );
    });

    this._messageParamObserver.observe(this.element, {
      attributes: true,
      attributeFilter: MESSAGE_PARAM_KEYS,
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

import MetaStanza from "../../lib/MetaStanza";
import { createApp } from "vue";
import App from "./app.vue";
import {
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";
import { camelCase } from "lodash";

export default class ColumnTree extends MetaStanza {
  menu() {
    return [
      downloadJSONMenuItem(this, "column-tree", this._data),
      downloadCSVMenuItem(this, "column-tree", this._data),
      downloadTSVMenuItem(this, "column-tree", this._data),
    ];
  }

  async renderNext() {
    const root = this._main;
    const camelCaseParams = {};
    Object.entries(this.params).forEach(([key, value]) => {
      camelCaseParams[camelCase(key)] = value;
    });
    camelCaseParams.data = this._data;

    this._app?.unmount();
    this._app = createApp(App, { ...camelCaseParams, root });
    this._app.mount(root);
  }

  handleEvent(event) {
    if (this.params["event-incoming_change_selected_nodes"]) {
      const selectedIds = event.detail;
      const targetElements =
        this.element.shadowRoot.querySelectorAll("input.selectable");

      for (const el of targetElements) {
        const targetTogostanzaId = Number(el.dataset.togostanzaId);
        const isSelected = selectedIds.includes(targetTogostanzaId);
        const inputElement = this.element.shadowRoot.querySelector(
          `input[data-togostanza-id="${targetTogostanzaId}"]`
        );

        if (isSelected !== inputElement.checked) {
          inputElement.click();
        }
      }
    }
  }
}

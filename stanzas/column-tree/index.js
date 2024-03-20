import { camelCase } from "lodash";
import {
  downloadCSVMenuItem,
  downloadJSONMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";
import { createApp } from "vue";
import MetaStanza from "../../lib/MetaStanza";
import { displayApiError } from "../../lib/utils";
import App from "./app.vue";

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
    camelCaseParams.data = this.__data.asTree({
      nodeLabelKey: this.params["node-label_key"].trim(),
      nodeGroupKey: this.params["node-group_key"].trim(),
      nodeValueKey: this.params["node-value_key"].trim(),
    }).data;

    this._app?.unmount();
    this._app = createApp(App, { ...camelCaseParams, root });
    this._component = this._app.mount(root);

    if (this._apiError) {
      this._app.unmount();
      displayApiError(this._main, this._error);
    } else {
      const errorMessageEl = this._main.querySelector(
        ".metastanza-error-message-div"
      );
      if (errorMessageEl) {
        errorMessageEl.remove();
      }
    }
  }

  handleEvent(event) {
    const { dataUrl, targetId, selectedIds } = event.detail;
    if (
      this.params["event-incoming_change_selected_nodes"] &&
      dataUrl === this.params["data-url"]
    ) {
      const targetElements = this._data.filter((d) =>
        selectedIds.includes(d.__togostanza_id__)
      );

      const targetElement = targetElements.find(
        (el) => el.__togostanza_id__ === targetId
      );

      const isSelected = selectedIds.includes(targetId);

      const { checkedNodes } = this._component.state;
      const nodeExists = checkedNodes.has(targetId);

      if (isSelected && !nodeExists) {
        checkedNodes.set(targetId, {
          __togostanza_id__: targetId,
          ...targetElement,
        });
      } else if (!isSelected && nodeExists) {
        checkedNodes.delete(targetId);
      }
    }
  }
}

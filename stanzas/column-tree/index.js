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
    this._component = this._app.mount(root);
  }

  handleEvent(event) {
    const { dataUrl, targetId, selectedIds } = event.detail;
    if (
      this.params["event-incoming_change_selected_nodes"] &&
      event.srcElement !== this.element
    ) {
      const targetElements = this._data.filter((d) =>
        selectedIds.includes(d.__togostanza_id__)
      );

      if (targetElements.length === 0) {
        this._component.state.checkedNodes = new Map();
        return;
      }

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

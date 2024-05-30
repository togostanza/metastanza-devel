import { camelCase } from "lodash";
import {
  downloadCSVMenuItem,
  downloadJSONMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";
import { createApp } from "vue";
import MetaStanza from "../../lib/MetaStanza";
import { handleApiError } from "../../lib/apiError";
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
      nodeValueKey: this.params["node-value_key"].trim(),
    }).data;

    this._app?.unmount();
    const drawContent = async () => {
      this._app = createApp(App, { ...camelCaseParams, root });
      this._component = this._app.mount(root);
    };

    handleApiError({
      stanzaData: this,
      drawContent,
    });
  }

  handleEvent(event) {
    const { dataUrl, targetId, selectedIds } = event.detail;
    if (
      this.params["event-incoming_change_selected_nodes"] &&
      dataUrl === this.params["data-url"]
    ) {
      const targetElements = this._data.filter((d) =>
        selectedIds.includes(d.id)
      );

      const targetElement = targetElements.find((el) => el.id === targetId);

      const isSelected = selectedIds.includes(targetId);

      const { checkedNodes } = this._component.state;
      const nodeExists = checkedNodes.has(targetId);

      if (isSelected && !nodeExists) {
        checkedNodes.set(targetId, {
          id: targetId,
          ...targetElement,
        });
      } else if (!isSelected && nodeExists) {
        checkedNodes.delete(targetId);
      }
    }
  }
}

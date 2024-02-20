import MetaStanza from "../../lib/MetaStanza";
import { createApp } from "vue";
import App from "./app.vue";
import {
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";
import { camelCase } from "lodash";
import { updateSelectedElementClassName } from "../../lib/utils";

export default class ColumnTree extends MetaStanza {
  selectedEventParams = {
    stanza: this,
    targetElementSelector: "g circle",
    selectedElementClassName: "-selected",
    selectedElementSelector: ".-selected",
    idPath: "id",
  };

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
    console.log(event);
    if (this.params["event-incoming_change_selected_nodes"]) {
      updateSelectedElementClassName.apply(null, [
        {
          selectedIds: event.detail,
          ...this.selectedEventParams,
        },
      ]);
    }
  }
}

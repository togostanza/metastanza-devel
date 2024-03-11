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
      console.log(targetElements);
      if (targetElements.length === 0) {
        this._component.state.checkedNodes = new Map();
        return;
      }

      const targetElement = targetElements.find(
        (el) => el.__togostanza_id__ === targetId
      );

      // for (const el of targetElements) {
      const isSelected = selectedIds.includes(targetId);
      // const inputElement = this.element.shadowRoot.querySelector(
      //   `input[data-togostanza-id="${targetTogostanzaId}"]`
      // );

      // if (!this._component.state.checkedNodes.has(el.id)) {
      //   // inputElement.click();
      //   this._component.state.checkedNodes.set(el.id, { id: el.id, ...el });
      // }
      console.log(
        isSelected && !this._component.state.checkedNodes.has(targetId)
      );
      console.log(
        !isSelected && this._component.state.checkedNodes.has(targetId)
      );
      if (isSelected && !this._component.state.checkedNodes.has(targetId)) {
        this._component.state.checkedNodes.set(targetId, {
          __togostanza_id__: targetId,
          ...targetElement,
        });
      } else if (
        !isSelected &&
        this._component.state.checkedNodes.has(targetId)
      ) {
        this._component.state.checkedNodes.delete(targetId);
      }
      // this._component.state.checkedNodes.includes(el.id)
      //   ? this._component.state.checkedNodes.delete(el.id)
      //   : this._component.state.checkedNodes.set(el.id, { id: el.id, ...el });
      // }
    }
  }
}

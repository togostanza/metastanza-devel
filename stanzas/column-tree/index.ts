import { camelCase } from "lodash";
import {
  downloadCSVMenuItem,
  downloadJSONMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";
import { createApp, type ComponentPublicInstance } from "vue";
import MetaStanza from "../../lib/MetaStanza";
import { handleApiError } from "../../lib/apiError";
import App from "./app.vue";

// ツリー構造に使うノードの型定義
type TreeNode = {
  id: string | number;
  parent?: string | number | null;
  label: string;
  value?: number;
  order?: number;
  color?: string;
  description?: string;
  group?: string;
  children?: TreeNode[];
};

// ツリーデータ構造の型定義
type Tree<T> = {
  data: T[];
};

export default class ColumnTree extends MetaStanza {
  _app: ReturnType<typeof createApp> | null = null;
  _component: ComponentPublicInstance<typeof App> | null = null;

  menu() {
    return [
      downloadJSONMenuItem(this, "column-tree", this._data),
      downloadCSVMenuItem(this, "column-tree", this._data),
      downloadTSVMenuItem(this, "column-tree", this._data),
    ];
  }

  async renderNext() {
    const root = this._main;

    // パラメータをcamelCaseに変換してVueアプリへ渡す形式に整形
    const camelCaseParams = this.buildCamelCaseParams();

    Object.entries(this.params).forEach(([key, value]) => {
      camelCaseParams[camelCase(key)] = value;
    });

    const result: Tree<TreeNode> = this.__data.asTree({
      nodeLabelKey: this.params["node-label_key"].trim(),
      nodeValueKey: this.params["node-value_key"].trim(),
    });

    camelCaseParams.data = result.data;

    this._app?.unmount();
    const drawContent = async () => {
      this._app = createApp(App, { ...camelCaseParams, root });
      this._component = this._app.mount(root) as ComponentPublicInstance<
        typeof App
      >;
    };

    handleApiError({
      stanzaData: this,
      drawContent,
    });
  }

  handleEvent(event: CustomEvent) {
    const { dataUrl, targetId, selectedIds } = event.detail;
    if (
      this.params["event-incoming_change_selected_nodes"] &&
      dataUrl === this.params["data-url"]
    ) {
      const targetElements = this._data.filter((d) =>
        selectedIds.includes(d.id)
      );

      const targetElement = targetElements.find(
        (el: Element) => el.id === targetId
      );

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

  // camelCaseに変換したparamsを構築する関数
  private buildCamelCaseParams(): Record<string, any> {
    const params: Record<string, any> = {};
    Object.entries(this.params).forEach(([key, value]) => {
      params[camelCase(key)] = value;
    });
    return params;
  }
}

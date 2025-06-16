import { camelCase } from "lodash";
import {
  downloadCSVMenuItem,
  downloadJSONMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";
import { createApp, type ComponentPublicInstance } from "vue";
import MetaStanza from "../../lib/MetaStanza";
import App from "./app.vue";
import type { Tree, TreeItem } from "./types";

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

    // データをツリー形式に整形
    const result: Tree<TreeItem> = this.__data.asTree({
      nodeLabelKey: this.params["node-label_key"].trim(),
      nodeValueKey: this.params["node-value_key"].trim(),
    });
    camelCaseParams.data = result.data;

    // 既にマウントされている Vue アプリケーションがあれば一度アンマウント
    this._app?.unmount();

    // Vueアプリを新たにマウント
    const drawContent = async () => {
      this._app = createApp(App, { ...camelCaseParams });
      this._component = this._app.mount(root) as ComponentPublicInstance<
        typeof App
      >;
    };

    await drawContent();
  }

  // 外部イベントを受け取ってチェック状態を同期
  handleEvent(event: CustomEvent) {
    const { dataUrl, targetId, selectedIds } = event.detail;

    // 条件に合う場合のみ同期処理を実行
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

      if (isSelected && !nodeExists && targetElement) {
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
  private buildCamelCaseParams(): Record<string, unknown> {
    const params: Record<string, unknown> = {};
    Object.entries(this.params).forEach(([key, value]) => {
      params[camelCase(key)] = value;
    });
    return params;
  }
}

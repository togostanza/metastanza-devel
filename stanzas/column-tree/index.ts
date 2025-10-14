import { camelCase } from "lodash";
import {
  downloadCSVMenuItem,
  downloadJSONMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";
import { createApp, type ComponentPublicInstance, reactive, toRefs } from "vue";
import MetaStanza, {
  METASTANZA_COMMON_PARAMS,
  METASTANZA_DATA_ATTR,
} from "../../lib/MetaStanza";
import App from "./app.vue";
import type { Tree, TreeItem } from "./types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faChevronRight,
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { SelectionPlugin } from "@/lib/plugins/SelectionPlugin";

library.add(faChevronRight, faMagnifyingGlass, faXmark);

export default class ColumnTree extends MetaStanza {
  _app: ReturnType<typeof createApp> | null = null;
  _component: ComponentPublicInstance<typeof App> | null = null;

  _selectionPlugin: SelectionPlugin | null = null;

  menu() {
    return [
      downloadJSONMenuItem(this, "column-tree", this._data),
      downloadCSVMenuItem(this, "column-tree", this._data),
      downloadTSVMenuItem(this, "column-tree", this._data),
    ];
  }

  async renderNext() {
    if (this._error) return;

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
      this._app = createApp(App, {
        ...camelCaseParams,
        selectedIds: [],
      });
      this._app.component("FontAwesomeIcon", FontAwesomeIcon);
      this._component = this._app.mount(root) as ComponentPublicInstance<
        typeof App
      >;
    };

    await drawContent();

    this._selectionPlugin = new SelectionPlugin({
      mode: "range",
      adapter: "vue",
      checkboxMode: true,
      component: this._component!,
      stanza: this,
      getListElement: (el) => el?.parentElement?.parentElement?.parentElement,
    });

    this.use(this._selectionPlugin);
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

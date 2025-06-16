<template>
  <section id="wrapper">
    <div
      class="search-container search-field-view"
      @mouseleave="state.showSuggestions ? toggleSuggestions() : null"
    >
      <div class="inputcontainer">
        <input
          v-model="state.searchTerm"
          type="text"
          placeholder="Search for keywords"
          class="search"
          @focus="toggleSuggestionsIfValid"
          @input="toggleSuggestionsIfValid"
        />
      </div>
      <!-- <SearchSuggestions
        :show-suggestions="state.showSuggestions"
        :search-input="state.searchTerm"
        :data="suggestions"
        :label-and-value-keys="state.labelAndValueKeys"
        :value-fallback="valueFallback"
        :node-value-alignment="state.nodeValueAlignment"
        @select-node="selectNode"
      /> -->
    </div>
    <div id="tree">
      <NodeColumn
        v-for="(column, index) of state.columnData.filter(
          (col) => col?.length > 0
        )"
        :key="index"
        :data="state.treeItemsWithPath"
        :data-url="props.dataUrl"
        :layer="index"
        :nodes="column"
        :checked-nodes="state.checkedNodes"
        :label-and-value-keys="state.labelAndValueKeys"
        :value-fallback="valueFallback"
        :highlighted-node="state.highligthedNodes[index]"
        :node-value-alignment="state.nodeValueAlignment"
        :is-event-outgoing="props.eventOutgoingChangeSelectedNodes"
        @set-parent="updatePartialColumnData"
        @set-checked-node="updateCheckedNodes"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, computed, watchEffect } from "vue";
import SearchSuggestions from "./SearchSuggestions.vue";
import NodeColumn from "./NodeColumn.vue";
import type { TreeItem, TreeItemWithPath, TreePathNode } from "./types";

// Props定義
const props = defineProps<{
  data: TreeItem[];
  dataUrl: string;
  nodeLabelKey?: string;
  nodeValueKey?: string;
  nodeValueAlignment?: "horizontal" | "vertical";
  nodeValueFallback?: string;
  searchKey?: string;
  eventOutgoingChangeSelectedNodes: boolean;
}>();

// state ------------------------------
// アプリケーションの状態をまとめたreactiveオブジェクト
const state = reactive({
  labelAndValueKeys: {
    label: props.nodeLabelKey?.trim(),
    value: props.nodeValueKey?.trim(),
  },
  nodeValueAlignment: props.nodeValueAlignment,
  fallbackInCaseOfNoValue: props.nodeValueFallback,
  showSuggestions: false,
  treeItemsWithPath: [] as TreeItemWithPath[],
  columnData: [] as TreeItemWithPath[][],
  checkedNodes: new Map<string | number, TreeItemWithPath>(),
  searchTerm: "",
  highligthedNodes: [] as (string | number)[],
});

// computed ------------------------------
// 表示する値のfallback情報
const valueFallback = computed(() => ({
  fallback: state.fallbackInCaseOfNoValue,
}));

// 検索入力が有効かどうか
const isValidSearchNode = computed(() => state.searchTerm.length > 0);

// サジェスト候補のリスト（通常検索 or パス検索）
const suggestions = computed(() =>
  state.searchTerm.includes("/")
    ? state.treeItemsWithPath.filter(isPathSearchHit)
    : state.treeItemsWithPath.filter(isNormalSearchHit)
);

// watch ------------------------------
// ノードにpathを追加しつつ初期化
watchEffect(() => {
  state.treeItemsWithPath = props.data.map((item) => ({
    ...item,
    path: getPath(item),
  }));
  state.checkedNodes = new Map();
});

// ルートノードの列を初期化
watchEffect(() => {
  state.columnData[0] = state.treeItemsWithPath.filter((obj) =>
    isRootNode(obj.parent)
  );
});

// method ------------------------------
/** 指定されたノードからルートノードまでのパス（親子関係）を取得する関数
 * @param node 対象のツリーノード
 * @returns TreePathNode[] ルートから該当ノードまでの順に並んだノード配列 */
function getPath(node: TreeItem): TreePathNode[] {
  const path: TreePathNode[] = [];

  // 初期ノードを TreePathNode として追加
  let current: TreePathNode = {
    id: node.id,
    label: node.label,
    parent: node.parent,
  };
  path.push(current);

  // 親を辿ってルートノードまで取得
  while (current.parent !== undefined) {
    const ancestor = props.data.find((item) => item.id === current.parent);
    if (!ancestor) {
      break;
    }

    current = {
      id: ancestor.id,
      label: ancestor.label,
      parent: ancestor.parent,
    };
    path.push(current);
  }

  return path.reverse();
}

/** 親 ID が未定義または空であればルートノードとみなす。
 * @param parent ノードの親 ID（数値または文字列、または未定義）
 * @returns ルートノードなら true、それ以外は false */
function isRootNode(parent: number | string | undefined): boolean {
  return !parent;
}

// パス検索一致（例：1/2/3のような形式）
function isPathSearchHit(node: TreeItemWithPath): boolean {
  return (
    node.path
      ?.map((n) => n.id)
      .join("/")
      .toLowerCase()
      .startsWith(state.searchTerm.toLowerCase()) ?? false
  );
}

// 通常の検索一致（ラベル・キーワード含む）
function isNormalSearchHit(node: TreeItemWithPath): boolean {
  return node[props.searchKey?.trim() || ""]
    ?.toString()
    .toLowerCase()
    .includes(state.searchTerm.toLowerCase());
}

/** 指定したレイヤーと親ノード ID に基づいて、その親を持つ子ノードの一覧を返す。
 * 同時に、指定レイヤーの直前（親レイヤー）のノードをハイライト状態として記録する。
 * @param layer レイヤー番号（1 以上の整数）
 * @param parentId 親ノードの ID
 * @returns 指定した親 ID を持つ子ノードの配列 */
function getChildNodes([layer, parentId]: [
  number,
  string | number
]): TreeItemWithPath[] {
  // ハイライト対象ノードを記録（親ノードをハイライト）
  state.highligthedNodes[layer - 1] = parentId;

  // 指定された親を持つ子ノードだけを返す
  return state.treeItemsWithPath.filter((node) => node.parent === parentId);
}

// ノード選択時の表示更新
function selectNode(node: TreeItemWithPath) {
  state.highligthedNodes = [];
  state.columnData = [
    state.treeItemsWithPath.filter((obj) => isRootNode(obj.parent)),
    ...node.path!.map((n, index) => getChildNodes([index + 1, n.id])),
  ];
  state.checkedNodes = new Map([[node.id, node]]);
  toggleSuggestions();
}

/** 指定されたレイヤーと親 ID に基づき、子ノードの一覧を取得し、
 * そのレイヤー以降の columnData を置き換える。
 * @param layer 現在のレイヤー番号（0 ベース）
 * @param parentId 親ノードの ID
 * @returns 取得された子ノードの配列 */
function updatePartialColumnData([layer, parentId]: [
  number,
  string | number
]): TreeItemWithPath[] {
  const children = getChildNodes([layer, parentId]);

  // 現在のレイヤー以降のデータを children のみに置き換える
  state.columnData.splice(layer, state.columnData.length - layer, children);

  return children;
}

/** ノードのチェック状態をトグルする関数。
 * チェックされていなければ Map に追加し、チェック済みであれば削除する。
 * @param node チェック状態を変更する対象ノード（TreePath を含む） */
function updateCheckedNodes(node: TreeItemWithPath) {
  const target = props.data.find((item) => item.id === node.id);
  if (!target) {
    return;
  }

  const { id, ...rest } = target;

  const isAlreadyChecked = state.checkedNodes.has(id);
  isAlreadyChecked
    ? state.checkedNodes.delete(id)
    : state.checkedNodes.set(id, { id, ...rest });
}

// 条件付きでサジェスト表示を切り替え
function toggleSuggestionsIfValid() {
  if (!isValidSearchNode.value || state.showSuggestions) {
    return;
  }
  toggleSuggestions();
}

// サジェストのON/OFF切替
function toggleSuggestions() {
  state.showSuggestions = !state.showSuggestions;
}
</script>

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
      <SearchSuggestions
        :show-suggestions="state.showSuggestions"
        :search-input="state.searchTerm"
        :data="suggestions"
        :keys="state.keys"
        :value-obj="valueObj"
        :node-value-alignment="state.nodeValueAlignment"
        @select-node="selectNode"
      />
    </div>
    <div id="tree">
      <NodeColumn
        v-for="(column, index) of state.columnData.filter(
          (col) => col?.length > 0
        )"
        :key="index"
        :nodes="column"
        :layer="index"
        :checked-nodes="state.checkedNodes"
        :keys="state.keys"
        :highlighted-node="state.highligthedNodes[index]"
        :value-obj="valueObj"
        :node-value-alignment="state.nodeValueAlignment"
        :params="params"
        @set-parent="updatePartialColumnData"
        @set-checked-node="updateCheckedNodes"
      />
    </div>
  </section>
</template>
<script setup lang="ts">
import { reactive, watchEffect, computed } from "vue";
import NodeColumn from "./NodeColumn.vue";
import SearchSuggestions from "./SearchSuggestions.vue";

interface Node {
  id: string | number;
  label: string;
  value?: number;
  parent?: string | number;
  path?: Node[];
  [key: string]: any;
}

// 動的にpropsを型付けする代替手段は明示的に列挙または any の利用
const props = defineProps<{
  data: Node[];
  nodeLabelKey?: string;
  nodeValueKey?: string;
  nodeValueFallback?: string;
  nodeValueAlignment?: "horizontal" | "vertical";
  searchKey?: string;
  [key: string]: any; // metadataからの動的キーを許容
}>();

defineEmits<{
  (e: "resetHighlightedNode"): void;
}>();

const state = reactive({
  keys: {
    label: props.nodeLabelKey?.trim(),
    value: props.nodeValueKey?.trim(),
  },
  fallbackInCaseOfNoValue: props.nodeValueFallback,
  nodeValueAlignment: props.nodeValueAlignment,
  showSuggestions: false,
  responseJSON: [] as Node[],
  columnData: [] as Node[][],
  checkedNodes: new Map<string | number, Node>(),
  searchTerm: "",
  highligthedNodes: [] as (string | number)[],
});

function isRootNode(parent: unknown): boolean {
  return !parent || isNaN(Number(parent));
}

watchEffect(() => {
  state.responseJSON = props.data.map((node) => {
    return { ...node, path: getPath(node) };
  });
  state.checkedNodes = new Map();
});

watchEffect(() => {
  state.columnData[0] = state.responseJSON.filter((obj) =>
    isRootNode(obj.parent)
  );
});

function updateCheckedNodes(node: Node) {
  const targetData = props.data.find((d) => d.id === node.id);
  if (!targetData) {
    return;
  }
  const { id, ...obj } = targetData;
  state.checkedNodes.has(id)
    ? state.checkedNodes.delete(id)
    : state.checkedNodes.set(id, { id, ...obj });
}

function getChildNodes([layer, parentId]: [number, string | number]): Node[] {
  state.highligthedNodes[layer - 1] = parentId;
  return state.responseJSON.filter((obj) => obj.parent === parentId);
}

function updatePartialColumnData([layer, parentId]: [number, string | number]) {
  const children = getChildNodes([layer, parentId]);
  const indexesToRemove = state.columnData.length - layer;
  state.columnData.splice(layer, indexesToRemove, children);
  return children;
}

function isNormalSearchHit(node: Node): boolean {
  return node[props.searchKey?.trim() || ""]
    ?.toString()
    .toLowerCase()
    .includes(state.searchTerm.toLowerCase());
}

function isPathSearchHit(node: Node): boolean {
  return (
    node.path
      ?.map((n) => n.id)
      .join("/")
      .toLowerCase()
      .startsWith(state.searchTerm.toLowerCase()) ?? false
  );
}

const valueObj = computed(() => ({ fallback: state.fallbackInCaseOfNoValue }));
const isValidSearchNode = computed(() => state.searchTerm.length > 0);

function selectNode(node: Node) {
  state.highligthedNodes = [];
  state.columnData = [
    state.responseJSON.filter((obj) => isRootNode(obj.parent)),
    ...node.path!.map((n, index) => getChildNodes([index + 1, n.id])),
  ];
  state.checkedNodes = new Map([[node.id, node]]);
  toggleSuggestions();
}

function getPath(node: Node): Node[] {
  const path: Node[] = [];
  let parent: Node = { id: node.id, label: node.label, parent: node.parent };
  path.push(parent);
  while (parent.parent) {
    const obj = props.data.find((obj) => obj.id === parent.parent);
    if (!obj) {
      break;
    }
    parent = { id: obj.id, label: obj.label, parent: obj.parent };
    path.push(parent);
  }
  return path.reverse();
}

function toggleSuggestionsIfValid() {
  if (!isValidSearchNode.value || state.showSuggestions) {
    return;
  }
  toggleSuggestions();
}

function toggleSuggestions() {
  state.showSuggestions = !state.showSuggestions;
}

const suggestions = computed(() => {
  return state.searchTerm.includes("/")
    ? state.responseJSON.filter(isPathSearchHit)
    : state.responseJSON.filter(isNormalSearchHit);
});
</script>

<template>
  <div class="column">
    <span
      v-for="node in nodes"
      :key="node.id"
      class="node"
      :class="[
        {
          '-highlighted':
            node.id === highlightedNode && hasChildren(node.children),
        },
        '-with-border',
      ]"
      @click="hasChildren(node.children) ? setParent(node.id) : null"
    >
      <span class="inner">
        <input
          :data-togostanza-id="node.id"
          class="selectable"
          :class="{ '-selected': checkedNodes.get(node.id) }"
          type="checkbox"
          :checked="checkedNodes.get(node.id)"
          @input="handleCheckboxClick(node)"
        />

        <span class="label" :class="`-${nodeValueAlignment}`">
          <strong class="title">
            {{ node.label }}
          </strong>
          <span
            class="value"
            :class="{ fallback: node[keys.value] === undefined }"
          >
            {{ node.value?.toLocaleString() ?? valueObj.fallback }}
          </span>
        </span>
        <font-awesome-icon
          v-if="hasChildren(node.children)"
          icon="chevron-right"
          class="icon"
        />
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faChevronRight, faClipboard } from "@fortawesome/free-solid-svg-icons";
library.add(faChevronRight, faClipboard);

// 型定義
interface NodeItem {
  id: string | number;
  label: string;
  value?: number;
  children?: string | number[]; // 文字列の可能性あり
  [key: string]: any;
}

interface Keys {
  label: string;
  value: string;
}

interface ValueObj {
  fallback: string | number;
}

interface Params {
  data: {
    _object: {
      eventOutgoingChangeSelectedNodes: boolean;
      dataUrl: string;
    };
  };
}

// Props定義
const props = defineProps<{
  layer?: number;
  nodes?: NodeItem[];
  children?: boolean;
  checkedNodes: Map<string | number, NodeItem>;
  keys: Keys;
  valueObj: ValueObj;
  highlightedNode?: number | string | null;
  nodeValueAlignment?: string;
  params: Params;
}>();

// Emits定義
const emit = defineEmits<{
  (e: "setParent", value: [number, string | number]): void;
  (e: "setCheckedNode", node: NodeItem): void;
}>();

// 子ノードが存在するか判定
function hasChildren(childrenProp: unknown): boolean {
  if (typeof childrenProp === "string") {
    childrenProp = childrenProp
      .split(/,/)
      .map(parseFloat)
      .filter((prop) => !isNaN(prop));
  }
  return Array.isArray(childrenProp) && childrenProp.length > 0;
}

// 親ノードをセット
function setParent(id: string | number) {
  emit("setParent", [props.layer + 1, id]);
}

// チェックボックスがクリックされたときの処理
function handleCheckboxClick(node: NodeItem) {
  emit("setCheckedNode", node);

  if (props.params.data._object.eventOutgoingChangeSelectedNodes) {
    const stanza = document.querySelector("togostanza-column-tree");
    stanza?.dispatchEvent(
      new CustomEvent("changeSelectedNodes", {
        detail: {
          selectedIds: [...props.checkedNodes.keys()],
          targetId: node.id,
          dataUrl: props.params.data._object.dataUrl,
        },
      })
    );
  }
}
</script>

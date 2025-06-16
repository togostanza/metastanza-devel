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
          :checked="!!checkedNodes.get(node.id)"
          @input="handleCheckboxClick(node)"
        />

        <span class="label" :class="`-${nodeValueAlignment}`">
          <strong class="title">
            {{ node.label }}
          </strong>
          <span
            class="value"
            :class="{ fallback: node[labelAndValueKeys.value] === undefined }"
          >
            {{ node.value?.toLocaleString() ?? valueFallback.fallback }}
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
import type {
  TreeItemWithPath,
  ValueFallback,
  LabelAndValueKeys,
} from "./types";
library.add(faChevronRight, faClipboard);

// Props定義
const props = defineProps<{
  data: TreeItemWithPath[];
  dataUrl: string;
  layer?: number;
  nodes?: TreeItemWithPath[];
  children?: boolean;
  checkedNodes: Map<string | number, TreeItemWithPath>;
  labelAndValueKeys: LabelAndValueKeys;
  valueFallback: ValueFallback;
  highlightedNode?: number | string | null;
  nodeValueAlignment?: string;
  isEventOutgoing: boolean;
}>();

// Emits定義
const emit = defineEmits<{
  (e: "setParent", value: [number, string | number]): void;
  (e: "setCheckedNode", node: TreeItemWithPath): void;
}>();

// method ------------------------------
/** 子ノードの配列が1つ以上の要素を持つかを判定する関数
 * @param childrenProp 子ノードの ID 配列（文字列または数値の配列）
 * @returns 子ノードが存在するかどうか（配列の長さが 1 以上か） */
function hasChildren(childrenProp: string[] | number[]): boolean {
  return Array.isArray(childrenProp) && childrenProp.length > 0;
}

/** 指定されたノード ID を親とし、その子ノードの階層レベルをイベントで通知する関数
 * @param parentId 親ノードの ID（数値または文字列） */
function setParent(parentId: string | number): void {
  const nextLayer = (props.layer ?? 0) + 1;
  emit("setParent", [nextLayer, parentId]);
}

/** チェックボックスがクリックされたときの処理を行う関数
 * - イベント `setCheckedNode` を emit して選択状態を親に通知
 * - `props.isEventOutgoing` が true の場合、Stanza 向けに `changeSelectedNodes` イベントも dispatch
 * @param node チェック対象のツリーノード（TreeItemWithPath 型） */
function handleCheckboxClick(node: TreeItemWithPath) {
  emit("setCheckedNode", node);

  if (props.isEventOutgoing) {
    const stanza = document.querySelector("togostanza-column-tree");
    stanza?.dispatchEvent(
      new CustomEvent("changeSelectedNodes", {
        detail: {
          selectedIds: [...props.checkedNodes.keys()],
          targetId: node.id,
          dataUrl: props.dataUrl,
        },
      })
    );
  }
}
</script>

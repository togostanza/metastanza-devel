<template>
  <div class="column">
    <div
      v-for="node in nodes"
      :key="node.id"
      class="node"
      :class="[
        {
          '-highlighted':
            node.id === highlightedNode && hasChildren(node.children),
        },
      ]"
      @click="hasChildren(node.children) ? setParent(node.id) : null"
    >
      <div class="inner" :class="`-${nodeValueAlignment}`">
        <input
          :id="`checkbox-${node.id}`"
          :data-togostanza-id="node.id"
          class="selectable"
          :class="{ '-selected': checkedNodes.get(node.id) }"
          type="checkbox"
          :checked="!!checkedNodes.get(node.id)"
          @input="handleCheckboxClick(node)"
        />

        <div class="label" :class="`-${nodeValueAlignment}`">
          <span class="title">{{ node.label }}</span>
          <span class="value">
            {{ node.value?.toLocaleString() ?? valueFallback }}
          </span>
        </div>
        <font-awesome-icon
          v-if="hasChildren(node.children)"
          class="icon"
          :icon="['fas', 'chevron-right']"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TreeItemWithPath } from "./types";

// Props & Emits ------------------------------
const props = defineProps<{
  data: TreeItemWithPath[];
  dataUrl: string;
  layer: number;
  nodes?: TreeItemWithPath[];
  children?: boolean;
  checkedNodes: Map<string | number, TreeItemWithPath>;
  valueFallback: string;
  highlightedNode?: number | string | null;
  nodeValueAlignment?: string;
  isEventOutgoing: boolean;
}>();

const emit = defineEmits<{
  (e: "setParent", value: [number, string | number]): void;
  (e: "setCheckedNode", node: TreeItemWithPath): void;
}>();

// Methods ------------------------------
/** 子ノードの配列が1つ以上の要素を持つかを判定する関数
 * @param childrenProp 子ノードの ID 配列（文字列または数値の配列）
 * @returns 子ノードが存在するかどうか（配列の長さが 1 以上か） */
function hasChildren(childrenProp: string[] | number[]): boolean {
  return Array.isArray(childrenProp) && childrenProp.length > 0;
}

/** 指定されたノード ID を親とし、その子ノードの階層レベルをイベントで通知する関数
 * @param parentId 親ノードの ID（数値または文字列） */
function setParent(parentId: string | number) {
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

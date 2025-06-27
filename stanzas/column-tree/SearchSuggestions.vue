<template>
  <div v-show="props.isShowSuggestions" class="suggestions-container">
    <ul class="suggestions">
      <li
        v-for="(node, index) in props.data"
        :key="node.id"
        :ref="registerSuggestionItem"
        class="suggestion-item"
        tabindex="0"
        @click="$emit('selectNode', node)"
        @keydown="(e) => createKeydownHandler(Number(index), node)(e)"
      >
        <div class="label" :class="`-${props.nodeValueAlignment}`">
          <span class="title">{{ node.label }}</span>
          <span class="value" :class="{ fallback: node.value === undefined }">
            {{ node.value?.toLocaleString() ?? props.valueFallback }}
          </span>
        </div>
      </li>
      <li v-if="props.data.length === 0" class="no-results">
        {{ props.valueFallback }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import type { TreeItemWithPath } from "./types";

// Props & Emits ------------------------------
const props = defineProps<{
  isShowSuggestions: boolean;
  data: TreeItemWithPath[];
  searchInput: string;
  valueFallback: string;
  nodeValueAlignment?: "horizontal" | "vertical";
}>();

const emit = defineEmits<{
  (e: "selectNode", node: TreeItemWithPath);
  (e: "closeSuggestions");
}>();

// DOM参照 ------------------------------
const suggestionItems = ref<HTMLElement[]>([]);

// Watchers ------------------------------
/** データ変更時にリストアイテムを初期化 */
watch(
  () => props.data,
  () => {
    suggestionItems.value = [];
  }
);

// Methods ------------------------------
/** サジェスト項目のDOMを配列に登録
 * @param el DOM要素（nullの可能性あり） */
function registerSuggestionItem(el: HTMLElement | null): void {
  if (el && !suggestionItems.value.includes(el)) {
    suggestionItems.value.push(el);
  }
}

/** 最初のサジェスト項目にフォーカスを移動 */
function focusFirstSuggestionItem(): void {
  nextTick(() => {
    suggestionItems.value[0]?.focus();
  });
}

/** サジェスト項目に対するキーボードイベントのハンドラを生成
 * @param index 対象のサジェスト項目のインデックス
 * @param node 対象のノードデータ
 * @returns キーボードイベントに対応するコールバック関数 */
function createKeydownHandler(index: number, node: TreeItemWithPath) {
  return (e: KeyboardEvent): void => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        suggestionItems.value[index + 1]?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        suggestionItems.value[index - 1]?.focus();
        break;
      case "Enter":
        emit("selectNode", node);
        break;
      case "Escape":
        emit("closeSuggestions");
        break;
    }
  };
}

// Expose method ------------------------------
defineExpose({ focusFirstSuggestionItem });
</script>

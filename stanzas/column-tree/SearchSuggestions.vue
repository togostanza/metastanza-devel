<template>
  <div v-show="props.isShowSuggestions" class="suggestions-container">
    <ul class="suggestions">
      <li
        v-for="(node, index) in data"
        :key="index"
        :ref="setSuggestionItemRef"
        class="suggestion-item"
        tabindex="0"
        @click="$emit('selectNode', node)"
        @keydown="(e) => handleItemKeydown(Number(index), node)(e)"
      >
        <div class="label" :class="`-${nodeValueAlignment}`">
          <span class="title">{{ node.label }}</span>
          <span class="value" :class="{ fallback: node.value === undefined }">
            {{ node.value?.toLocaleString() ?? valueFallback.fallback }}
          </span>
        </div>
      </li>
      <li v-if="data.length === 0" class="no-results">
        {{ valueFallback.fallback }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import type {
  TreeItemWithPath,
  ValueFallback,
  LabelAndValueKeys,
} from "./types";

const props = defineProps<{
  isShowSuggestions: boolean;
  data: TreeItemWithPath[];
  searchInput: string;
  labelAndValueKeys: LabelAndValueKeys;
  valueFallback: ValueFallback;
  nodeValueAlignment?: "horizontal" | "vertical";
}>();

const emit = defineEmits<{
  (e: "selectNode", node: TreeItemWithPath);
  (e: "closeSuggestions");
}>();

const suggestionItems = ref<HTMLElement[]>([]);

watch(
  () => props.data,
  () => {
    suggestionItems.value = [];
  }
);

function setSuggestionItemRef(el: HTMLElement | null) {
  if (!el || props.data.length === 0) {
    return;
  }

  if (el && !suggestionItems.value.includes(el)) {
    suggestionItems.value = [...suggestionItems.value, el];
  }
}

function focusFirstSuggestionItem() {
  nextTick(() => {
    if (suggestionItems.value.length > 0) {
      suggestionItems.value[0].focus();
    }
  });
}

function handleItemKeydown(index: number, node: TreeItemWithPath) {
  return (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      suggestionItems.value[index + 1]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      suggestionItems.value[index - 1]?.focus();
    } else if (e.key === "Enter") {
      emit("selectNode", node);
    } else if (e.key === "Escape") {
      emit("closeSuggestions");
    }
  };
}

defineExpose({ focusFirstSuggestionItem });
</script>

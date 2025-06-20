<template>
  <div v-show="showSuggestions" class="suggestions-container">
    <ul class="suggestions">
      <!-- 候補リストが存在する場合 -->
      <li
        v-for="(node, index) in data"
        :key="index"
        class="suggestion-item"
        @click="$emit('selectNode', node)"
      >
        <span class="label" :class="`-${nodeValueAlignment}`">
          <strong class="title">{{ node.label }}</strong>
          <span
            class="value"
            :class="{ fallback: node[labelAndValueKeys.value] === undefined }"
          >
            {{ node.value?.toLocaleString() ?? valueFallback.fallback }}
          </span>
        </span>
      </li>

      <!-- 候補リストが空の場合 -->
      <li v-if="data.length === 0" class="no-results">
        {{ valueFallback.fallback }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type {
  TreeItemWithPath,
  ValueFallback,
  LabelAndValueKeys,
} from "./types";

// Props 定義
defineProps<{
  showSuggestions?: boolean;
  data?: TreeItemWithPath[];
  searchInput: string;
  labelAndValueKeys: LabelAndValueKeys;
  valueFallback: ValueFallback;
  nodeValueAlignment?: "horizontal" | "vertical";
}>();

// Emits 定義
defineEmits<{
  (e: "selectNode", node: TreeItemWithPath);
}>();
</script>

<template>
  <div v-show="showSuggestions" class="search-wrapper suggestionscontainer">
    <ul class="suggestions">
      <li
        v-for="(node, index) in data"
        :key="index"
        :class="'-with-border'"
        @click="$emit('selectNode', node)"
      >
        <span class="label" :class="`-${nodeValueAlignment}`">
          <strong class="title">{{ node[keys.label] }}</strong>
          <span
            class="value"
            :class="{ fallback: node[keys.value] === undefined }"
          >
            {{ node[keys.value]?.toLocaleString() ?? valueObj.fallback }}
          </span>
        </span>
      </li>
      <li v-if="data.length < 1" class="no-results">
        {{ valueObj.fallback }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// 型定義
interface SuggestionItem {
  [key: string]: string | number | undefined;
}

interface Keys {
  label: string;
  value: string;
}

interface ValueObj {
  fallback: string | number;
}

// Props 定義
defineProps<{
  showSuggestions?: boolean;
  data?: SuggestionItem[];
  searchInput: string;
  keys: Keys;
  valueObj: ValueObj;
  nodeValueAlignment?: "horizontal" | "vertical";
}>();

// Emits 定義
defineEmits<{
  (e: "selectNode", node: SuggestionItem): void;
}>();
</script>

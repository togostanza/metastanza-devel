<template>
  <div v-show="showSuggestions" class="search-wrapper">
    <ul class="suggestions">
      <li
        v-for="(node, index) of data"
        :key="index"
        :class="{ '-with-border': nodeShowBorders }"
        @click="$emit('selectNode', node)"
      >
        <span class="label" :class="`-${nodeValueAlignment}`">
          <strong class="title">{{ node[keys.label] }}</strong>
          <span v-if="valueObj.show" class="value">
            {{ node[keys.value] ?? valueObj.fallback }}
          </span>
        </span>
      </li>
      <li v-if="data.length < 1" class="no-results">
        {{ valueObj.fallback }}
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    showSuggestions: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: () => [],
    },
    searchInput: {
      type: String,
      required: true,
    },
    keys: {
      type: Object,
      required: true,
    },
    valueObj: {
      type: Object,
      required: true,
    },
    nodeShowBorders: {
      type: Boolean,
      default: false,
    },
    nodeValueAlignment: {
      type: String,
      default: "horizontal",
    },
  },
  emits: ["selectNode"],
});
</script>

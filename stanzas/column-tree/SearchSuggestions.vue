<template>
  <div v-show="showSuggestions" class="search-wrapper">
    <ul class="suggestions">
      <li
        v-for="(node, index) of data"
        :key="index"
        :class="{ '-with-border': nodeShowBorders }"
        @click="$emit('selectNode', node)"
      >
        <span class="label" :class="`-${nodeContentAlignment}`">
          <strong class="title">{{ node[keys.label] }}</strong>
          <span v-if="valueObj.show" class="value">
            {{ node[keys.value] ?? valueObj.fallback }}
          </span>
        </span>
        <span v-if="searchShowPath" class="value">
          Path :
          <ruby v-for="(item, pathIndex) of node.path" :key="pathIndex">
            {{ item.label }}/<rp>(</rp><rt> {{ item.id }}</rt
            ><rp>)</rp>
          </ruby>
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
    searchShowPath: {
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
    nodeContentAlignment: {
      type: String,
      default: "horizontal",
    },
  },
  emits: ["selectNode"],
});
</script>

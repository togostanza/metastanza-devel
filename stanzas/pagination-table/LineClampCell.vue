<!-- eslint-disable vue/no-v-html -->
<template>
  <input :id="id" type="checkbox" :name="id" />
  <label
    v-if="unescape"
    :style="`-webkit-line-clamp: ${lineClamp}`"
    class="label"
    v-html="value"
  ></label>
  <label v-else :style="`-webkit-line-clamp: ${lineClamp}`" class="label">
    {{ value }}
  </label>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    id: {
      type: String,
      default: null,
    },
    unescape: {
      type: Boolean,
      default: false,
    },
    lineClamp: {
      type: Number,
      default: null,
    },
    value: {
      type: String,
      default: null,
    },
  },
});
</script>

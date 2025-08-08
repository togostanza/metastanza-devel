<!-- eslint-disable vue/no-v-html -->
<template>
  <a v-if="unescape && (lineClamp || charClamp)" :href="href" :target="target">
    <ClampCell
      v-if="charClamp"
      :line-clamp="lineClamp"
      :char-clamp="charClamp"
      :char-clamp-on="charClampOn"
      :unescape="unescape"
      :value="value"
      @toggle-char-clamp-on="$emit('toggleCharClampOn')"
    />
    <LineClampCell
      v-else
      :line-clamp="lineClamp"
      :unescape="unescape"
      :value="value"
    />
  </a>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <a v-else-if="unescape && !lineClamp && !charClamp" :href="href" :target="target" v-html="value">
  </a>
  <a v-else :href="href" :target="target">
    <ClampCell
      v-if="charClamp"
      :line-clamp="lineClamp"
      :char-clamp="charClamp"
      :char-clamp-on="charClampOn"
      :value="value"
      @toggle-char-clamp-on="$emit('toggleCharClampOn')"
    />
    <LineClampCell v-else-if="lineClamp" :line-clamp="lineClamp" :value="value" />
    <template v-else>
      {{ value }}
    </template>
  </a>
</template>

<script>
import { defineComponent } from "vue";
import LineClampCell from "./LineClampCell.vue";
import ClampCell from "./ClampCell.vue";

export default defineComponent({
  components: {
    LineClampCell,
    ClampCell,
  },
  props: {
    // id: {
    //   type: String,
    //   default: null,
    // },
    href: {
      type: String,
      default: null,
    },
    value: {
      type: String,
      default: null,
    },
    target: {
      type: String,
      default: "_blank",
    },
    unescape: {
      type: Boolean,
      default: false,
    },
    lineClamp: {
      type: Number,
      default: null,
    },
    charClamp: {
      type: Number,
      default: null,
    },
    charClampOn: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["toggleCharClampOn"],
});
</script>

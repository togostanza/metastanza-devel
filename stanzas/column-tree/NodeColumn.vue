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
          type="checkbox"
          :checked="checkedNodes.get(node.id)"
          @input="setCheckedNode(node)"
        />

        <span class="label" :class="`-${nodeValueAlignment}`">
          <strong class="title">
            {{ node[keys.label] }}
          </strong>
          <span class="value" :class="{fallback: node[keys.value] === undefined}">
            {{ node[keys.value]?.toLocaleString() ?? valueObj.fallback }}
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

<script>
import { defineComponent } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faChevronRight, faClipboard } from "@fortawesome/free-solid-svg-icons";
library.add(faChevronRight, faClipboard);
export default defineComponent({
  components: {
    FontAwesomeIcon,
  },
  props: {
    layer: {
      type: Number,
      default: 0,
    },
    nodes: {
      type: Array,
      default: () => [],
    },
    children: {
      type: Boolean,
      default: false,
    },
    checkedNodes: {
      type: Map,
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
    highlightedNode: {
      type: [Number, String, null],
      default: null,
    },
    nodeValueAlignment: {
      type: String,
      default: "horizontal",
    },
  },
  emits: ["setParent", "setCheckedNode"],
  setup(props, context) {
    function hasChildren(childrenProp) {
      if (typeof childrenProp === "string") {
        childrenProp = childrenProp
          .split(/,/)
          .map(parseFloat)
          .filter((prop) => !isNaN(prop));
      }
      return childrenProp && childrenProp.length > 0;
    }

    function setCheckedNode(node) {
      context.emit("setCheckedNode", node);
    }

    function setParent(id) {
      context.emit("setParent", [props.layer + 1, id]);
    }
    return {
      setParent,
      setCheckedNode,
      hasChildren,
    };
  },
});
</script>

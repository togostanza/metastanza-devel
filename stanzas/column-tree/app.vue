<template>
  <section id="wrapper">
    <div
      class="search-container search-field-view"
      @mouseleave="state.showSuggestions ? toggleSuggestions() : null"
    >
      <div class="inputcontainer">
        <input
          v-model="state.searchTerm"
          type="text"
          placeholder="Search for keywords"
          class="search"
          @focus="toggleSuggestionsIfValid"
          @input="toggleSuggestionsIfValid"
        />
      </div>
      <search-suggestions
        :show-suggestions="state.showSuggestions"
        :search-input="state.searchTerm"
        :data="suggestions"
        :keys="state.keys"
        :value-obj="valueObj"
        :node-value-alignment="state.nodeValueAlignment"
        @select-node="selectNode"
      />
    </div>
    <div id="tree">
      <NodeColumn
        v-for="(column, index) of state.columnData.filter(
          (col) => col?.length > 0
        )"
        :key="index"
        :nodes="column"
        :layer="index"
        :checked-nodes="state.checkedNodes"
        :keys="state.keys"
        :highlighted-node="state.highligthedNodes[index]"
        :value-obj="valueObj"
        :node-value-alignment="state.nodeValueAlignment"
        @set-parent="updatePartialColumnData"
        @set-checked-node="updateCheckedNodes"
      />
    </div>
  </section>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  watchEffect,
  ref,
  computed,
} from "vue";
import metadata from "./metadata.json";
import NodeColumn from "./NodeColumn.vue";
import SearchSuggestions from "./SearchSuggestions.vue";
import { camelCase } from "lodash";

function isRootNode(parent) {
  return !parent || isNaN(parent);
}

const getType = (stanzaType) => {
  switch (stanzaType) {
    case "boolean":
      return Boolean;
    case "number":
      return Number;
    default:
      return String;
  }
};
const typeArray = metadata["stanza:parameter"].map((param) => {
  return {
    name: camelCase(param["stanza:key"]),
    type: getType(param["stanza:type"]),
  };
});
const typeObject = typeArray.reduce(
  (objects, current) => ({ ...objects, [current.name]: current.type }),
  {}
);

// TODO: set path for data objects
export default defineComponent({
  components: { NodeColumn, SearchSuggestions },
  props: { ...typeObject, data: { type: Array, default: () => [] } },
  emits: ["resetHighlightedNode"],
  setup(params) {
    params = toRefs(params);

    const layerRefs = ref([]);
    const state = reactive({
      keys: {
        label: params?.nodeLabelKey?.value.trim(),
        value: params?.nodeValueKey?.value.trim(),
      },
      fallbackInCaseOfNoValue: params?.nodeValueFallback.value,
      nodeValueAlignment: params?.nodeValueAlignment?.value,
      showSuggestions: false,
      responseJSON: [],
      columnData: [],
      checkedNodes: new Map(),
      searchTerm: "",
      highligthedNodes: [],
    });
    watchEffect(
      () => {
        state.responseJSON = params?.data?.value?.map((node) => {
          return { ...node, path: getPath(node) };
        });
        state.checkedNodes = new Map();
      },
      { immediate: true }
    );
    watchEffect(() => {
      const data = state.responseJSON || [];
      state.columnData[0] = data.filter((obj) => isRootNode(obj.parent));
    });

    function updateCheckedNodes(node) {
      console.log(params.data._object.data);
      const targetData = params.data._object.data.find(
        (d) => d.__togostanza_id__ === node.__togostanza_id__
      );
      console.log(targetData);
      const { __togostanza_id__, ...obj } = targetData;
      state.checkedNodes.has(__togostanza_id__)
        ? state.checkedNodes.delete(__togostanza_id__)
        : state.checkedNodes.set(__togostanza_id__, {
            __togostanza_id__,
            ...obj,
          });
      console.log(state.checkedNodes);
      // TODO: add event handler
      // console.log([...state.checkedNodes.values()]);
    }
    function getChildNodes([layer, parentId]) {
      state.highligthedNodes[layer - 1] = parentId;
      return state.responseJSON.filter((obj) => obj.parent === parentId);
    }
    function updatePartialColumnData([layer, parentId]) {
      const children = getChildNodes([layer, parentId]);
      const indexesToRemove = state.columnData.length - layer;
      state.columnData.splice(layer, indexesToRemove, children);
      return children;
    }
    function isNormalSearchHit(node) {
      return node[params?.searchKey?.value.trim()]
        ?.toString()
        .toLowerCase()
        .includes(state.searchTerm.toLowerCase());
    }
    function isPathSearchHit(node) {
      return node.path
        .map((node) => node.id)
        .join("/")
        .toLowerCase()
        .startsWith(state.searchTerm.toLowerCase());
    }
    const valueObj = computed(() => {
      return {
        fallback: state.fallbackInCaseOfNoValue,
      };
    });
    const isValidSearchNode = computed(() => {
      return state.searchTerm.length > 0;
    });
    function selectNode(node) {
      state.highligthedNodes = [];
      state.columnData = [
        state.responseJSON.filter((obj) => isRootNode(obj.parent)),
        ...[...node.path].map((node, index) => {
          return getChildNodes([index + 1, node.id]);
        }),
      ];
      state.checkedNodes = new Map([[node.id, node]]);
      toggleSuggestions();
    }
    function getPath(node) {
      const path = [];
      let parent = { id: node.id, label: node.label, parent: node.parent };
      path.push(parent);
      while (parent.parent) {
        const obj = params?.data?.value?.find((obj) => {
          return obj.id === parent.parent;
        });
        parent = { id: obj?.id, label: obj?.label, parent: obj?.parent };
        path.push(parent);
      }
      return path.reverse();
    }
    function toggleSuggestionsIfValid() {
      if (!isValidSearchNode.value || state.showSuggestions) {
        return;
      }
      toggleSuggestions();
    }
    function toggleSuggestions() {
      state.showSuggestions = !state.showSuggestions;
    }
    const suggestions = computed(() => {
      if (state.searchTerm.includes("/")) {
        return state.responseJSON.filter(isPathSearchHit);
      }
      return state.responseJSON.filter(isNormalSearchHit); // array of nodes.
    });
    return {
      isValidSearchNode,
      state,
      layerRefs,
      updateCheckedNodes,
      updatePartialColumnData,
      suggestions,
      valueObj,
      selectNode,
      toggleSuggestions,
      toggleSuggestionsIfValid,
    };
  },
});
</script>

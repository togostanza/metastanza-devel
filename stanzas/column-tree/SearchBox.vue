<template>
  <div class="search-container search-field-view">
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
    <SearchSuggestions
      :show-suggestions="state.isShowSuggestions"
      :search-input="state.searchTerm"
      :data="suggestions"
      :label-and-value-keys="labelAndValueKeys"
      :value-fallback="valueFallback"
      :node-value-alignment="nodeValueAlignment"
      @select-node="$emit('select-node', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import type {
  TreeItemWithPath,
  ValueFallback,
  LabelAndValueKeys,
} from "./types";
import SearchSuggestions from "./SearchSuggestions.vue";

// Props定義
const props = defineProps<{
  isValidSearchNode: boolean;
  treeItemsWithPath: TreeItemWithPath[];
  labelAndValueKeys: LabelAndValueKeys;
  valueFallback: ValueFallback;
  nodeValueAlignment: "horizontal" | "vertical";
}>();

const state = reactive({
  isShowSuggestions: false,
  searchTerm: "",
});

const emit = defineEmits<{
  (e: "select-node", node: any): void;
}>();

// computed ------------------------------
// 検索入力が有効かどうか
const isValidSearchNode = computed(() => state.searchTerm.length > 0);

// サジェスト候補のリスト（通常検索 or パス検索）
const suggestions = computed(() =>
  props.treeItemsWithPath.filter(isNormalSearchHit)
);

// method ------------------------------
/** ノードのラベルが検索語を含むかどうかを判定する関数
 * @param node - 検索対象のツリーノード
 * @returns 部分一致していれば true、それ以外は false */
function isNormalSearchHit(node: TreeItemWithPath): boolean {
  const value = node.label.toString().toLowerCase();
  const search = state.searchTerm.toLowerCase();
  return value.includes(search);
}

/** 有効な検索語が入力されている場合のみ、
 * サジェスト表示をトグル（表示・非表示）します。 */
function toggleSuggestionsIfValid() {
  const hasValidInput = isValidSearchNode.value;

  if (hasValidInput) {
    showSuggestions();
  } else {
    closeSuggestions();
  }
}

function showSuggestions() {
  if (state.isShowSuggestions) {
    return; // 既に表示中なら何もしない
  }
  state.isShowSuggestions = true;
}

function closeSuggestions() {
  if (!state.isShowSuggestions) {
    return; // 既に非表示なら何もしない
  }
  state.isShowSuggestions = false;
}
</script>

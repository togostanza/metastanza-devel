<template>
  <div class="search-field-view">
    <font-awesome-icon
      :icon="['fas', 'magnifying-glass']"
      class="search-icon"
    />
    <input
      id="keyword-search"
      ref="inputRef"
      v-model="state.searchTerm"
      class="search-input"
      type="text"
      placeholder="Search for keywords"
      autocomplete="off"
      @focus="toggleSuggestionsIfValid"
      @input="toggleSuggestionsIfValid"
      @keydown="handleKeydown"
    />
    <font-awesome-icon
      :icon="['fas', 'xmark']"
      class="search-clear"
      @click="clearSearch"
    />
    <SearchSuggestions
      ref="suggestionsRef"
      :is-show-suggestions="state.isShowSuggestions"
      :search-input="state.searchTerm"
      :data="suggestions"
      :label-and-value-keys="labelAndValueKeys"
      :value-fallback="valueFallback"
      :node-value-alignment="nodeValueAlignment"
      @select-node="handleSelectNode"
      @close-suggestions="closeSuggestions"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref, onMounted, onUnmounted, nextTick } from "vue";
import type {
  TreeItemWithPath,
  ValueFallback,
  LabelAndValueKeys,
} from "./types";
import SearchSuggestions from "./SearchSuggestions.vue";
import type { ComponentPublicInstance } from "vue";

type SearchSuggestionsInstance = ComponentPublicInstance<{
  focusFirstSuggestionItem: () => void;
}>;

// Props定義
const props = defineProps<{
  isValidSearchNode: boolean;
  treeItemsWithPath: TreeItemWithPath[];
  labelAndValueKeys: LabelAndValueKeys;
  valueFallback: ValueFallback;
  nodeValueAlignment: "horizontal" | "vertical";
}>();

// Emit定義
const emit = defineEmits<{
  (e: "selectNode", node: TreeItemWithPath);
  (e: "closeSuggestions"): void;
}>();

// state ------------------------------
const state = reactive({
  isShowSuggestions: false,
  searchTerm: "",
});

// ref ------------------------------
const inputRef = ref<HTMLElement | null>(null);
const suggestionsRef = ref<SearchSuggestionsInstance | null>(null);

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
  if (!isValidSearchNode.value) {
    return false; // 検索語が無効な場合はヒットしない
  }
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

function handleSelectNode(node: TreeItemWithPath) {
  state.isShowSuggestions = false;
  emit("selectNode", node);
}

const clearSearch = () => {
  state.searchTerm = "";
  inputRef.value?.focus();
};

// 外側クリック検出
function handleClickOutside(event: MouseEvent) {
  const target = event.composedPath()[0] as Node;

  if (inputRef.value && !inputRef.value.contains(target)) {
    closeSuggestions();
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    nextTick(() => {
      suggestionsRef.value?.focusFirstSuggestionItem();
    });
  } else if (e.key === "Escape") {
    closeSuggestions();
  }
}

// マウント時にイベント登録、アンマウント時に解除
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

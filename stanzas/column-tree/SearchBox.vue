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
      :value-fallback="valueFallback"
      :node-value-alignment="nodeValueAlignment"
      @select-node="handleSelectNode"
      @close-suggestions="closeSuggestions"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref, onMounted, onUnmounted, nextTick } from "vue";
import type { ComponentPublicInstance } from "vue";
import SearchSuggestions from "./SearchSuggestions.vue";
import type { TreeItemWithPath } from "./types";

/** 型定義：子コンポーネント（SearchSuggestions）のインスタンス */
type SearchSuggestionsInstance = ComponentPublicInstance<{
  focusFirstSuggestionItem: () => void;
}>;

// Props & Emits ------------------------------
const props = defineProps<{
  treeItemsWithPath: TreeItemWithPath[];
  valueFallback: string;
  nodeValueAlignment: "horizontal" | "vertical";
}>();

const emit = defineEmits<{
  (e: "selectNode", node: TreeItemWithPath): void;
  (e: "closeSuggestions"): void;
}>();

// State ------------------------------
const state = reactive({
  isShowSuggestions: false,
  searchTerm: "",
});

// DOM参照 ------------------------------
const inputRef = ref<HTMLElement | null>(null);
const suggestionsRef = ref<SearchSuggestionsInstance | null>(null);

// Computed ------------------------------
/** 検索語が有効かどうか */
const isValidSearchInput = computed(() => state.searchTerm.length > 0);

/** 入力にマッチするノードの一覧をフィルタリング */
const suggestions = computed(() =>
  props.treeItemsWithPath.filter((node) => {
    if (!isValidSearchInput.value) {
      return false;
    }
    return node.label.toLowerCase().includes(state.searchTerm.toLowerCase());
  })
);

// Methods ------------------------------
/** 入力が有効なときだけサジェストを表示する */
function toggleSuggestionsIfValid() {
  isValidSearchInput.value ? showSuggestions() : closeSuggestions();
}

/** サジェストを表示 */
function showSuggestions(): void {
  if (!state.isShowSuggestions) {
    state.isShowSuggestions = true;
  }
}

/** サジェストを非表示 */
function closeSuggestions() {
  if (state.isShowSuggestions) {
    state.isShowSuggestions = false;
  }
}

/** サジェスト候補が選択されたときに実行される
 * @param node - 選択されたノード */
function handleSelectNode(node: TreeItemWithPath) {
  state.isShowSuggestions = false;
  emit("selectNode", node);
}

/** 検索入力をクリアし、フォーカスを戻す */
function clearSearch() {
  state.searchTerm = "";
  inputRef.value?.focus();
}

/** 入力欄外をクリックしたときにサジェストを閉じる
 * @param event - クリックイベント */
function handleClickOutside(event: MouseEvent) {
  const target = event.composedPath()[0] as Node;
  if (inputRef.value && !inputRef.value.contains(target)) {
    closeSuggestions();
  }
}

/** キーボード操作（↓でサジェストにフォーカス、ESCで閉じる）
 * @param event - キーボードイベント */
function handleKeydown(event: KeyboardEvent) {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    nextTick(() => {
      suggestionsRef.value?.focusFirstSuggestionItem();
    });
  } else if (event.key === "Escape") {
    closeSuggestions();
  }
}

// Lifecycle ----------------------
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

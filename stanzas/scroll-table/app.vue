<!-- eslint-disable vue/no-v-html -->
<template>
  <div ref="rootElement" class="wrapper" :style="`width: ${canvasWidth}; height: ${canvasHeight};`">
    <div
      class="tableWrapper"
      @scroll="handleScroll"
    >
    <table v-if="state.allRows">
      <thead ref="thead">
        <tr>
          <th
            v-for="(column, index) in state.columns"
            :id="column.id"
            :key="column.id"
            :class="{ fixed: column.fixed }"
            :style="
              column.fixed
                ? `left: ${index === 0 ? 0 : state.thListWidth[index - 1]}px;`
                : null
            "
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, row_index) in state.allRows" :key="row.id">
          <td
            v-for="(cell, index) in row"
            :key="cell.column.id"
            :class="[
              cell.column.align,
              { fixed: cell.column.fixed },
              cell.column.class,
            ]"
            :style="
              cell.column.fixed
                ? `left: ${index === 0 ? 0 : state.thListWidth[index - 1]}px;`
                : null
            "
          >
            <span v-if="cell.href">
              <AnchorCell
                :id="`${cell.column.id}_${row_index}`"
                :href="cell.href"
                :value="cell.value"
                :target="cell.target ? `_${cell.target}` : '_blank'"
                :unescape="cell.unescape"
                :line-clamp="cell.lineClamp"
              />
            </span>
            <span v-else-if="cell.lineClamp">
              <LineClampCell
                :id="`${cell.column.id}_${row_index}`"
                :value="cell.value"
                :unescape="cell.unescape"
                :line-clamp="cell.lineClamp"
              />
            </span>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-else-if="cell.unescape" v-html="cell.value"></span>
            <span v-else>{{ cell.value }}</span>
          </td>
        </tr>
        <tr v-if="state.isFetching">
          <td
            :colspan="state.columns.length"
            class="togostanza-table-loading-wrapper"
          >
            <div class="togostanza-table-loading-dots"></div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="state.hasError" class="togostanza-table-error-message">
      {{ message_load_error }}
    </div>
    <div v-else-if="state.allRows && state.allRows.length === 0 && !state.isFetching" class="togostanza-table-no-data">
      {{ message_not_found }}
    </div>
  </div>
</div>
</template>

<script>
import {
  defineComponent,
  reactive,
  onMounted,
  onRenderTriggered,
  ref,
} from "vue";
import AnchorCell from "./AnchorCell.vue";
import LineClampCell from "./LineClampCell.vue";

import loadData from "togostanza-utils/load-data";

import metadata from "./metadata.json";

export default defineComponent({
  components: {
    AnchorCell,
    LineClampCell,
  },
  props: metadata["stanza:parameter"].map((p) => p["stanza:key"]),
  setup(params) {
    const rootElement = ref(null);
    const canvasWidth = ref("100%");
    const canvasHeight = ref("");
    const message_not_found = ref(params["message-not_found"]);
    const message_load_error = ref(params["message-load_error"]);

    const state = reactive({
      columns: [],
      allRows: [],
      main: null,
      offset: 0,

      isFetching: false,
      hasError: false,

      thListWidth: [],
    });

    async function fetchData() {
      state.isFetching = true;
      state.hasError = false;

      try {
        const data = await loadData(
          params.dataUrl,
          params.dataType,
          params.main,
          undefined,
          params.pageSize,
          state.offset
        );

      if (params.columns) {
        state.columns = JSON.parse(params.columns).map((column, index) => {
          column.fixed = index < params.fixedColumns;
          return column;
        });
      } else if (data.length > 0) {
        const firstRow = data[0];
        state.columns = Object.keys(firstRow).map((key, index) => {
          return {
            id: key,
            label: key,
            fixed: index < params.fixedColumns,
          };
        });
      } else {
        state.columns = [];
      }

      state.allRows = state.allRows.concat(
        data.map((row) => {
          return state.columns.map((column) => {
            return {
              column,
              value: row[column.id],
              href: column.link ? row[column.link] : null,
              unescape: column.escape === false,
              align: column.align,
              class: column.class,
              target: column.target,
              lineClamp: column["line-clamp"],
            };
          });
        })
      );

      state.isFetching = false;
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to fetch data:', error);
        } else {
          console.error('Failed to fetch data.');
        }
        state.hasError = true;
        state.isFetching = false;
      }
    }

    function handleScroll(e) {
      if (
        e.currentTarget.scrollTop >
          e.currentTarget.firstChild.clientHeight -
            e.currentTarget.clientHeight -
            5 &&
        e.currentTarget.scrollTop <
          e.currentTarget.firstChild.clientHeight -
            e.currentTarget.clientHeight +
            5 &&
        !state.isFetching
      ) {
        state.offset = state.offset + params.pageSize;
        fetchData();
      }
    }

    onMounted(() => {
      // Read CSS variables and set canvas size
      requestAnimationFrame(() => {
        const style = window.getComputedStyle(rootElement.value);
        const widthFromCss = style.getPropertyValue("--togostanza-canvas-width").trim();
        canvasWidth.value = widthFromCss ? widthFromCss + "px" : "100%";
        const heightFromCss = style.getPropertyValue("--togostanza-canvas-height").trim();
        canvasHeight.value = heightFromCss ? heightFromCss + "px" : "";
      });

      fetchData();
    });

    const thead = ref(null);
    onRenderTriggered(() => {
      setTimeout(() => {
        const thList = thead.value.children[0].children;
        state.thListWidth = Array.from(thList).map((th) => th.clientWidth);
      }, 0);
    });

    return {
      state,
      handleScroll,
      rootElement,
      canvasWidth,
      canvasHeight,
      thead,
      message_not_found,
      message_load_error,
    };
  },
});
</script>

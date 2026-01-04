<!-- eslint-disable vue/no-v-html -->
<template>
  <div ref="rootElement" class="wrapper" :style="`width: ${canvasWidth}; height: ${canvasHeight};`" @click="clearSelection">
    <div class="tableOptionWrapper">
      <div class="tableOption">
        <input
          v-model="state.queryForAllColumns"
          type="text"
          placeholder="Search for keywords..."
          class="textSearchInput"
          @click.stop
        />
        <p class="entries">
          Show
          <select
            v-model="state.pagination.perPage"
            @click.stop
          >
            <option v-for="size of pageSizeOption" :key="size" :value="size">
              {{ size }}
            </option>
          </select>
          entries
        </p>
      </div>
      <div class="tableWrapper" :style="`width: ${canvasWidth};`">
        <table v-if="filteredRows.length > 0" ref="table">
          <thead ref="thead">
            <tr>
              <template v-for="(column, i) in state.columns">
                <th
                  v-if="i !== state.columns.length - 1"
                  :key="column.id"
                  :class="{ fixed: column.fixed }"
                  :style="
                    column.fixed
                      ? `left: ${i === 0 ? 0 : state.thListWidth[i - 1]}px;`
                      : null
                  "
                >
                  {{ column.label }}
                  <font-awesome-icon
                    v-if="state.sorting.column === column"
                    :key="`sort-${
                      state.sorting.direction === 'asc' ? 'up' : 'down'
                    }`"
                    class="icon sort active"
                    :icon="`sort-${
                      state.sorting.direction === 'asc' ? 'up' : 'down'
                    }`"
                    @click.stop="setSorting(column)"
                  />
                  <font-awesome-icon
                    v-else
                    class="icon sort"
                    icon="sort"
                    @click.stop="setSorting(column)"
                  />

                  <font-awesome-icon
                    :class="[
                      'icon',
                      'search',
                      { active: column.isSearchConditionGiven },
                    ]"
                    icon="search"
                    @click.stop="showModal(column)"
                  />
                  <font-awesome-icon
                    v-if="column.searchType === 'category'"
                    icon="filter"
                    :class="[
                      'icon',
                      'filter',
                      { isShowing: column.isFilterPopupShowing },
                      {
                        active: column.filters.some(
                          (filter) => !filter.checked
                        ),
                      },
                    ]"
                    @click.stop="column.isFilterPopupShowing = true"
                  />
                  <transition name="modal">
                    <div
                      v-if="column.isFilterPopupShowing"
                      :class="[
                        'filterWrapper',
                        'modal',
                        { lastCol: state.columns.length - 1 === i },
                      ]"
                    >
                      <div class="filterWindow">
                        <p class="filterWindowTitle">{{ column.label }}</p>
                        <ul class="filters">
                          <li
                            v-for="filter in column.filters"
                            :key="filter.value"
                          >
                            <label :for="filter.id">
                              <input
                                :id="filter.value"
                                v-model="filter.checked"
                                type="checkbox"
                                name="items"
                              />
                              {{ filter.value }}
                            </label>
                          </li>
                        </ul>
                        <div class="toggleAllButton">
                          <button
                            class="selectAll"
                            @click="setFilters(column, true)"
                          >
                            Select All
                          </button>
                          <button
                            class="clear"
                            @click="setFilters(column, false)"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  </transition>
                  <transition name="modal">
                    <div
                      v-if="column.isSearchModalShowing"
                      :class="[
                        'textSearchByColumnWrapper',
                        'modal',
                        { lastCol: state.columns.length - 1 === i },
                      ]"
                      @click.stop
                    >
                      <p class="title">
                        <template v-if="column.searchType === 'number'">
                          {{ column.label }} range
                        </template>
                        <template v-else>
                          {{ column.label }}
                        </template>
                      </p>
                      <div v-if="column.searchType === 'number'">
                        <Slider
                          :model-value="column.range"
                          :min="column.minValue"
                          :max="column.maxValue"
                          :tooltips="false"
                          :step="-1"
                          @update="column.setRange"
                        ></Slider>
                        <div class="rangeInput">
                          <div>
                            <span class="rangeInputLabel"> From </span>
                            <input
                              v-model.number="column.inputtingRangeMin"
                              type="text"
                              class="min"
                              @input="setRangeFilters(column)"
                            />
                          </div>
                          <span class="dash"></span>
                          <div>
                            <span class="rangeInputLabel"> To </span>
                            <input
                              v-model.number="column.inputtingRangeMax"
                              type="text"
                              class="max"
                              @input="setRangeFilters(column)"
                            />
                          </div>
                        </div>
                      </div>
                      <input
                        v-else
                        v-model="column.query"
                        type="text"
                        placeholder="Search for keywords..."
                        name="queryInputByColumn"
                        class="textSearchInput"
                      />
                    </div>
                  </transition>

                  <font-awesome-icon
                    v-if="showAxisSelector === true"
                    :class="['icon', 'chart-bar']"
                    icon="chart-bar"
                    @click.stop="handleAxisSelectorButton(column)"
                  />
                  <AxisSelectorModal
                    :active="state.axisSelectorActiveColumn === column"
                    :label="column.label"
                    @axis-selected="handleAxisSelected"
                  />
                </th>
              </template>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, row_index) in rowsInCurrentPage"
              :key="row.id"
              :data-id="getRowDataId(row)"
              :class="{
                selected: isSelectedRow(row),
                selectable: eventOutgoingChangeSelectedNodes,
              }"
              @click.stop="
                eventOutgoing_change_selected_nodes
                  ? handleRowClick($event, row_index, row)
                  : null
              "
            >
              <template v-for="(cell, i) in row">
                <td
                  v-if="i !== state.columns.length - 1"
                  :key="cell.column.id"
                  :rowspan="cell.rowspanCount"
                  :class="[
                    { hide: cell.hide },
                    cell.column.align,
                    { fixed: cell.column.fixed },
                    cell.column.class,
                  ]"
                  :style="
                    cell.column.fixed
                      ? `left: ${i === 0 ? 0 : state.thListWidth[i - 1]}px;`
                      : null
                  "
                  class="clamp-td"
                >
                  <span v-if="cell.href">
                    <AnchorCell
                      :href="cell.href"
                      :value="cell.value"
                      :target="
                        cell.column.target ? `_${cell.column.target}` : '_blank'
                      "
                      :unescape="cell.column.unescape"
                      :char-clamp="cell.column.charClamp"
                      :char-clamp-on="cell.column.charClampOn"
                    />
                  </span>
                  <span v-else-if="cell.column.charClamp">
                    <ClampCell
                      :char-clamp="cell.column.charClamp"
                      :char-clamp-on="cell.charClampOn"
                      :unescape="cell.column.unescape"
                      :value="cell.value"
                      @toggle-char-clamp-on="
                        cell.charClampOn = !cell.charClampOn
                      "
                    />
                  </span>
                  <!-- Line clamp cell (unescaped) -->
                  <template v-else-if="cell.column.unescape">
                    <span
                      v-html="cell.value"
                      :class="{ 
                        'line-clamp': cell.lineClampOn,
                        'line-clamp-expanded': !cell.lineClampOn
                      }"
                    ></span>
                  </template>
                  <!-- Line clamp cell (escaped) -->
                  <template v-else>
                    <span 
                      :class="{ 
                        'line-clamp': cell.lineClampOn,
                        'line-clamp-expanded': !cell.lineClampOn
                      }"
                    >{{ cell.value }}</span>
                  </template>
                  <button
                    v-if="cell.lineClampOn !== undefined"
                    class="clamp-toggle-button"
                    type="button"
                    :data-expanded="!cell.lineClampOn"
                    :aria-label="cell.lineClampOn ? 'Expand content' : 'Collapse content'"
                    @click.stop="toggleRowLineClamp(cell.rowIndex)"
                  ></button>
                </td>
              </template>
            </tr>
            <tr v-if="state.isFetching">
              <td
                :colspan="state.columns.length - 1"
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
        <div
          v-else-if="!state.isFetching && ((!state.allRows || state.allRows.length === 0) || (filteredRows.length === 0 && state.allRows && state.allRows.length > 0))"
          class="togostanza-table-no-data"
        >
          {{ message_not_found }}
        </div>
      </div>
    </div>
    <SliderPagination
      ref="sliderPagination"
      :current-page="state.pagination.currentPage"
      :total-pages="totalPages"
      :is-slider-on="state.pagination.isSliderOn"
      @update-current-page="updateCurrentPage"
    />
    <div
      v-if="isPopupOrModalShowing"
      class="modalBackground"
      @click="closeModal()"
    ></div>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  ref,
  computed,
  watch,
  watchEffect,
  onMounted,
  onRenderTriggered,
  nextTick,
} from "vue";

import SliderPagination from "./SliderPagination.vue";
import AnchorCell from "./AnchorCell.vue";
import ClampCell from "./ClampCell.vue";
import AxisSelectorModal from "./AxisSelectorModal.vue";

import orderBy from "lodash.orderby";
import uniq from "lodash.uniq";
import Slider from "@vueform/slider";
import { sprintf } from "sprintf-js";

import loadData from "togostanza-utils/load-data";

// import testData from "./assets/test.json";
import metadata from "./metadata.json";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEllipsisH,
  faFilter,
  faSearch,
  faSort,
  faSortUp,
  faSortDown,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { METASTANZA_NODE_ID_KEY } from "@/lib/MetaStanza";

library.add(
  faEllipsisH,
  faFilter,
  faSearch,
  faSort,
  faSortUp,
  faSortDown,
  faChartBar
);

export default defineComponent({
  components: {
    Slider,
    SliderPagination,
    AnchorCell,
    ClampCell,
    FontAwesomeIcon,
    AxisSelectorModal,
  },

  props: [
    ...metadata["stanza:parameter"].map((p) => p["stanza:key"]),
    "stanzaElement",
  ],

  setup(params) {
    const canvasWidth = ref("100%");
    const canvasHeight = ref("");

    onMounted(() => {
      requestAnimationFrame(() => {
        const style = window.getComputedStyle(rootElement.value);
        const widthFromCss = style
          .getPropertyValue("--togostanza-canvas-width")
          .trim();
        canvasWidth.value = widthFromCss ? widthFromCss + "px" : "100%";
        const heightFromCss = style
          .getPropertyValue("--togostanza-canvas-height")
          .trim();
        canvasHeight.value = heightFromCss ? heightFromCss + "px" : "";
        const flexDirection = style.getPropertyValue(
          "--togostanza-pagination-placement_vertical"
        );
        rootElement.value.style.flexDirection = {
          top: "column-reverse",
          bottom: "column",
        }[flexDirection];
      });
    });

    const sliderPagination = ref();
    const pageSizeOptionRaw = params.pageSize_option;
    const pageSizeOption = (pageSizeOptionRaw || "10,20,50,100")
      .split(",")
      .map(Number);

    const state = reactive({
      responseJSON: null, // for download. may consume extra memory

      columns: [],
      allRows: [],
      main: null,
      queryForAllColumns: "",

      sorting: {
        direction: "desc",
      },

      pagination: {
        currentPage: 1,
        perPage: pageSizeOption[0],
        isSliderOn: params.pageSlider,
      },

      axisSelectorActiveColumn: null,

      selectedRows: [],

      isFetching: false,
      hasError: false,
    });

    const message_not_found = ref(params["message-not_found"]);
    const message_load_error = ref(params["message-load_error"]);

    const filteredRows = computed(() => {
      const queryForAllColumns = state.queryForAllColumns;
      let filtered = state.allRows.filter((row) => {
        return (
          searchByAllColumns(row, queryForAllColumns) && searchByEachColumn(row)
        );
      });

      const sortColumn = state.sorting.column;

      if (sortColumn) {
        filtered = orderBy(
          filtered,
          (cells) => {
            const cell = cells.find((cell) => cell.column === sortColumn);
            return cell.value;
          },
          [state.sorting.direction]
        );
        return filtered;
      } else {
        return filtered;
      }
    });

    const totalPages = computed(() => {
      const totalPages = Math.ceil(
        filteredRows.value.length / state.pagination.perPage
      );
      return totalPages;
    });

    watch(
      () => totalPages.value,
      (totalPages) => {
        if (totalPages > 0 && state.pagination.currentPage > totalPages) {
          updateCurrentPage(totalPages);
          if (sliderPagination.value) {
            sliderPagination.value.inputtingCurrentPage = totalPages;
          }
        }
      }
    );

    const rowsInCurrentPage = computed(() => {
      const { currentPage, perPage } = state.pagination;

      const startIndex = (currentPage - 1) * perPage;
      const endIndex = startIndex + perPage;

      return setRowspanState(filteredRows.value.slice(startIndex, endIndex));
    });

    const isModalShowing = computed(() => {
      return state.columns.some(
        ({ isSearchModalShowing }) => isSearchModalShowing
      );
    });

    const isPopupOrModalShowing = computed(() => {
      return (
        state.columns.some(
          ({ isFilterPopupShowing }) => isFilterPopupShowing
        ) || isModalShowing.value
      );
    });

    watchEffect(() => {
      const conditions = [];

      if (state.queryForAllColumns !== "") {
        conditions.push({
          type: "substring",
          target: null,
          value: state.queryForAllColumns,
        });
      }

      for (const column of state.columns) {
        if (column.query !== "" && column.query !== undefined) {
          conditions.push({
            type: "substring",
            target: column.id,
            value: column.query,
          });
        }
        if (
          column.rangeMin !== undefined &&
          column.rangeMin !== column.minValue
        ) {
          conditions.push({
            type: "gte",
            target: column.id,
            value: column.rangeMin,
          });
        }
        if (
          column.rangeMax !== undefined &&
          column.rangeMax !== column.maxValue
        ) {
          conditions.push({
            type: "lte",
            target: column.id,
            value: column.rangeMax,
          });
        }
      }

      params.stanzaElement.dispatchEvent(
        new CustomEvent("filter", { detail: conditions })
      );
    });

    function setRowspanState(rows) {
      const rowspanCount = {};
      const reversedRows = rows.reverse().map((row, rowIndex) => {
        return row.map((cell, colIndex) => {
          if (cell.column.rowspan) {
            delete cell.hide;
            delete cell.rowspanCount;
            const aboveValue = rows[rowIndex + 1]
              ? rows[rowIndex + 1][colIndex].value
              : null;
            const colId = cell.column.id;
            if (cell.value === aboveValue) {
              cell.hide = true;
              rowspanCount[colId] = rowspanCount[colId]
                ? rowspanCount[colId] + 1
                : 1;
            } else if (rowspanCount[colId] >= 1) {
              cell.rowspanCount = rowspanCount[colId] + 1;
              delete rowspanCount[colId];
            }
          }
          return cell;
        });
      });
      return reversedRows.reverse();
    }

    function setSorting(column) {
      state.sorting.column = column;
      state.sorting.direction =
        state.sorting.direction === "asc" ? "desc" : "asc";
    }

    function setFilters(column, checked) {
      for (const filter of column.filters) {
        filter.checked = checked;
      }
    }

    function setRangeFilters(column) {
      if (
        column.inputtingRangeMin < column.minValue ||
        column.inputtingRangeMax > column.maxValue
      ) {
        return;
      }
      column.rangeMin = column.inputtingRangeMin;
      column.rangeMax = column.inputtingRangeMax;
    }

    function toggleRowLineClamp(rowIndex) {
      const row = state.allRows[rowIndex];
      if (row) {
        const newState = !row[0].lineClampOn;
        row.forEach((cell) => {
          cell.lineClampOn = newState;
        });
      }
    }

    function showModal(column) {
      column.isSearchModalShowing = true;
    }

    function closeModal() {
      for (const column of state.columns) {
        column.isFilterPopupShowing = null;
        column.isSearchModalShowing = null;
      }
    }

    function handleAxisSelectorButton(column) {
      if (column === state.axisSelectorActiveColumn) {
        state.axisSelectorActiveColumn = null;
        return;
      }
      state.axisSelectorActiveColumn = column;
    }

    function handleAxisSelected(axis) {
      const event = new CustomEvent(axis, {
        detail: state.axisSelectorActiveColumn.id,
      });
      params.stanzaElement.dispatchEvent(event);
      state.axisSelectorActiveColumn = null;
    }

    function updateCurrentPage(currentPage) {
      state.pagination.currentPage = currentPage;
    }

    async function fetchData() {
      state.isFetching = true;
      state.hasError = false;

      try {
        const data = await loadData(
          params.dataUrl,
          params.dataType,
          params.main
        );

        state.responseJSON = data;
        let columns;
        if (params.columns) {
          columns = JSON.parse(params.columns).map((column, index) => {
            column.fixed = index < params.fixedColumns;
            return column;
          });
        } else if (data.length > 0) {
          const firstRow = data[0];
          columns = Object.keys(firstRow).map((key, index) => {
            return {
              id: key,
              label: key,
              fixed: index < params.fixedColumns,
            };
          });
        } else {
          columns = [];
        }
        columns.push({ id: METASTANZA_NODE_ID_KEY, label: "", fixed: false });

        state.columns = columns.map((column) => {
          const values = data.map((obj) => obj[column.id]);
          return createColumnState(column, values);
        });

        state.allRows = data.map((row, rowIndex) => {
          return state.columns.map((column) => {
            return {
              column,
              value: column.parseValue(row[column.id]),
              href: column.href ? row[column.href] : null,
              charClampOn: true,
              lineClampOn: true,
              rowIndex,
            };
          });
        });

        state.isFetching = false;
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Failed to fetch data:", error);
        } else {
          console.error("Failed to fetch data");
        }
        state.hasError = true;
        state.isFetching = false;
      }
    }

    onMounted(fetchData);

    const table = ref(null);
    const thead = ref(null);
    const rootElement = ref(null);

    onRenderTriggered(() => {
      nextTick(() => {
        try {
          if (thead.value?.children?.[0]?.children?.length > 0) {
            const thList = thead.value.children[0].children;
            state.thListWidth = Array.from(thList).map((th) => th.clientWidth);
          }
        } catch (error) {
          console.warn('Failed to calculate column widths:', error);
        }
      });
    });

    const json = () => {
      return state.responseJSON;
    };

    const handleMouseDown = (event) => {
      if (event.shiftKey) {
        event.preventDefault();
      }
    };

    const getRowDataId = (row) => {
      return row.find((column) => column.column.id === METASTANZA_NODE_ID_KEY)
        .value;
    };

    const isSelectedRow = (row) => {
      const rowID = row.find(
        (column) => column.column.id === METASTANZA_NODE_ID_KEY
      ).value;
      return state.selectedRows.includes(rowID);
    };

    const updateSelectedRows = (ids) => {
      state.selectedRows = ids;
    };

    function clearSelection(event) {
      state.selectedRows = [];
      state.lastSelectedRow = null;
    }

    return {
      canvasWidth,
      canvasHeight,
      message_not_found,
      message_load_error,
      sliderPagination,
      pageSizeOption,
      state,
      filteredRows,
      totalPages,
      rowsInCurrentPage,
      isModalShowing,
      isPopupOrModalShowing,
      setSorting,
      setFilters,
      setRangeFilters,
      toggleRowLineClamp,
      showModal,
      closeModal,
      updateCurrentPage,
      table,
      thead,
      rootElement,
      json,
      handleAxisSelectorButton,
      handleAxisSelected,
      showAxisSelector: params.showAxis_selector ?? false,
      handleMouseDown,
      isSelectedRow,
      getRowDataId,
      updateSelectedRows,
      clearSelection,
      eventOutgoing_change_selected_nodes:
        params.eventOutgoing_change_selected_nodes,
    };
  },
});

function createColumnState(columnDef, values) {
  const baseProps = {
    id: columnDef.id,
    label: columnDef.label,
    searchType: columnDef.type,
    rowspan: columnDef.rowspan,
    href: columnDef.link,
    class: columnDef.class,
    unescape: columnDef.escape === false,
    align: columnDef.align,
    fixed: columnDef.fixed,
    target: columnDef.target,
    charClamp: columnDef["char-clamp"],
    sprintf: columnDef["sprintf"],
  };

  if (columnDef.type === "number") {
    const nums = values.map(Number).filter((value) => !Number.isNaN(value));
    const minValue = Math.min(...nums);
    const maxValue = Math.max(...nums) < 1 ? 1 : Math.max(...nums);
    const rangeMin = ref(minValue);
    const rangeMax = ref(maxValue);
    const range = computed(() => [rangeMin.value, rangeMax.value]);
    const inputtingRangeMin = ref(rangeMin.value);
    const inputtingRangeMax = ref(rangeMax.value);

    const isSearchConditionGiven = computed(() => {
      return minValue < rangeMin.value || maxValue > rangeMax.value;
    });

    const setRange = ([min, max]) => {
      rangeMin.value = min;
      rangeMax.value = max;
      inputtingRangeMin.value = min;
      inputtingRangeMax.value = max;
    };

    return {
      ...baseProps,
      minValue,
      maxValue,
      rangeMin,
      rangeMax,
      range,
      setRange,
      isSearchConditionGiven,
      inputtingRangeMin,
      inputtingRangeMax,
      isSearchModalShowing: false,
      parseValue(val) {
        if (columnDef["sprintf"]) {
          return formattedValue(columnDef["sprintf"], val);
        } else {
          return val;
        }
      },

      isMatch(val) {
        if (Number.isNaN(rangeMin.value) || Number.isNaN(rangeMax.value)) {
          return true;
        }
        return val >= rangeMin.value && val <= rangeMax.value;
      },
    };
  } else {
    const query = ref("");
    const isSearchConditionGiven = computed(() => query.value !== "");

    const filters =
      columnDef.type === "category"
        ? uniq(values)
            .sort()
            .map((value) => {
              return reactive({
                value,
                checked: true,
              });
            })
        : null;

    const filter = (val) => {
      const selected = filters.filter(({ checked }) => checked);
      return selected.some(({ value }) => value === val);
    };

    const search = (val) => {
      const q = query.value;
      return q ? val.includes(q) : true;
    };

    return {
      ...baseProps,
      parseValue(val) {
        if (columnDef["sprintf"]) {
          return formattedValue(columnDef["sprintf"], val);
        } else {
          return String(val);
        }
      },
      query,
      isSearchConditionGiven,
      filters,
      isFilterModalShowing: false,
      isSearchModalShowing: false,

      isMatch(val) {
        return columnDef.type === "category"
          ? search(val) && filter(val)
          : search(val);
      },
    };
  }
}

function searchByAllColumns(row, query) {
  if (!query) {
    return true;
  }

  return row.some(({ value }) => String(value).includes(query));
}

function searchByEachColumn(row) {
  return row.every((cell) => {
    return cell.column.isMatch(cell.value);
  });
}

function formattedValue(format, val) {
  try {
    // If it cannot be converted to a number, return it as is
    const numVal = Number(val);
    if (isNaN(numVal)) {
      return val;
    }
    return sprintf(format, numVal);
  } catch (e) {
    console.error(e);
    return val;
  }
}
</script>

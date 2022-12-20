import { a as s, a8 as i, y, S as Stanza, s as select, d as defineStanzaElement } from './transform-2d2d4fd0.js';
import { a as brushX, c as brushY } from './brush-1c3a785b.js';
import { l as loadData } from './load-data-c99d7a02.js';
import { d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem, f as appendCustomCss } from './index-1567edd1.js';
import { S as StanzaColorGenerator } from './ColorGenerator-55034777.js';
import { g as getMarginsFromCSSString } from './utils-0de57f2d.js';
import { v as v4 } from './v4-1d7bfe79.js';
import { S as Symbol, d as circle, an as timeFormat, t as time, q as utcSecond, W as utcMinute, Y as utcHour, _ as utcDay, a0 as utcSunday, ae as utcMonth, ag as utcYear } from './symbol-f660dd1d.js';
import { o as ordinal, f as format } from './ordinal-5c40f749.js';
import { a as axisBottom, b as axisLeft } from './axis-3dba94d9.js';
import { e as extent } from './extent-14a1e8e9.js';
import { l as line$2 } from './line-5ff356a1.js';
import { l as linear } from './linear-b53de1ad.js';
import { l as log } from './log-747567d2.js';
import { b as band } from './band-b5fce97a.js';
import './nodrag-9107f376.js';
import './axios-70c5a559.js';
import './constant-c49047a5.js';
import './math-24162d65.js';
import './path-a78af922.js';
import './array-80a7907a.js';
import './point-7945b9d0.js';
import './range-e15c6861.js';

class Legend2 extends s {
  /**
   *
   * @param {Object[]} items - Array of objects
   * @param {string?} items[].id - id of item
   * @param {label} items[].label - label of item
   * @param {string} items[].color - color of item
   * @param {number?} items[].value - value of item
   * @param {HTMLElement?} items[].node - node of item/ Can be array of nodes
   * @param {Object} options - Options object
   * @param {NodeList?} options.fadeoutNodes - Nodelist of nodes to fade out
   * @param {string?} options.fadeProp - Property to fade out
   * @param {string?} options.position - Position of legend
   * @param {boolean} options.showLeaders - Direction of leader
   */
  constructor() {
    if (Legend2._instance) {
      return Legend2._instance;
    }
    super(...arguments);
    Legend2._instance = this;
    this.items = [];
    this.toggled = [];
    this.options = {};
    this.nodes = [];
    this.legend = null;
    this.title = "";
    this._datumMap = new Map();
    this.options.fadeProp = this.options.fadeProp ?? "opacity";
    this.options.position = this.options.position ?? ["top", "right"];
  }

  static get properties() {
    return {
      items: { type: Array },
      nodes: { type: Array },
      options: { type: Object },
      toggled: { type: Array },
      title: { type: String },
    };
  }

  static get styles() {
    return i`
      .origin {
        position: absolute;
        top: 0;
        left: 0;
      }
      .legend {
        padding: 3px 9px;
        display: inline-block;
        vertical-align: top;
        max-width: 25em;
        max-height: 100%;
        font-size: 10px;
        line-height: 1.5;
        overflow-y: auto;
        color: var(--togostanza-fonts-font_color);
        background-color: rgba(255, 255, 255, 0.8);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        white-space: nowrap;
      }
      .legend > table > tbody > tr > td > .marker {
        display: inline-block;
        width: 1em;
        height: 1em;
        border-radius: 100%;
        vertical-align: middle;
        margin-right: 0.3em;
      }
      .legend > table > tbody > tr > td.number {
        text-align: right;
      }

      .legend > .title {
        font-size: var(--togostanza-fonts-font_size_secondary);
      }
      .leader {
        position: absolute;
        border-left: dotted 1px black;
        z-index: 10000;
        opacity: 0;
        pointer-events: none;
        transition: all 0.2s;
      }
      .leader[data-direction="top"] {
        border-top: dotted 1px black;
      }
      .leader[data-direction="bottom"] {
        border-bottom: dotted 1px black;
      }
      .leader.-show {
        opacity: 0.5;
      }
      .toggled {
        opacity: 0.5;
      }
    `;
  }

  render() {
    return y`
      <div class="origin"></div>
      <div class="legend">
        ${this.title && y`<h2 class="title">${this.title}</h2>`}
        <table>
          <tbody>
            ${this.items.map((item) => {
              return y` <tr>
                <td
                  data-id="${item.id}"
                  class="${item.toggled ? "toggled" : ""}"
                >
                  <span
                    class="marker"
                    style="background-color: ${item.color}"
                  ></span
                  >${item.label}
                </td>
                ${item.value
                  ? y`<td class="${(typeof item.value).toLowerCase()}">
                      ${item.value}
                    </td>`
                  : ""}
              </tr>`;
            })}
          </tbody>
        </table>
      </div>
      <div class="leader"></div>
    `;
  }

  firstUpdated() {
    // placement
    this.legend = this.shadowRoot.querySelector(".legend");
  }

  _mouseOverHandler(e) {
    if (this.nodes?.length) {
      if (e.target.nodeName === "TD") {
        e.stopPropagation();

        const nodes = this._datumMap.get(e.target.dataset.id);

        if (nodes) {
          this.options.fadeoutNodes.forEach((node) => {
            node.style[this.options.fadeProp] = 0.2;
          });

          if (Array.isArray(nodes) && nodes.length !== 0) {
            nodes.forEach((item) => (item.style[this.options.fadeProp] = ""));
          } else if (!Array.isArray(nodes)) {
            nodes.style[this.options.fadeProp] = "";
          } else {
            return;
          }

          if (this.options.showLeaders) {
            this._leader.classList.add("-show");
            const originRect = this.renderRoot
              .querySelector(".origin")
              .getBoundingClientRect();
            const legendRect = e.target.getBoundingClientRect();
            const targetRect = nodes.getBoundingClientRect();
            this._leader.style.left =
              targetRect.x + targetRect.width * 0.5 - originRect.x + "px";
            this._leader.style.width =
              legendRect.x - targetRect.right + targetRect.width * 0.5 + "px";
            const legendMiddle = legendRect.y + legendRect.height * 0.5;
            const targetMiddle = targetRect.y + targetRect.height * 0.5;
            if (legendMiddle < targetMiddle) {
              this._leader.dataset.direction = "top";
              this._leader.style.top = legendMiddle - originRect.y + "px";
              this._leader.style.height = targetMiddle - legendMiddle + "px";
            } else {
              this._leader.dataset.direction = "bottom";
              this._leader.style.top = targetMiddle - originRect.y + "px";
              this._leader.style.height = legendMiddle - targetMiddle + "px";
            }
          }
        }
      }
    }
  }

  _mouseOutHandler(e) {
    if (this.nodes?.length) {
      if (e.target.nodeName === "TD") {
        e.stopPropagation();
        this.options.fadeoutNodes.forEach((node) => {
          node.style[this.options.fadeProp] = "";
        });
        this._leader.classList.remove("-show");
      }
    }
  }

  _clickHandler(e) {
    if (this.nodes?.length) {
      if (e.target.nodeName === "TD") {
        this.renderRoot.dispatchEvent(
          new CustomEvent("legend-item-click", {
            bubbles: true,
            composed: true,
            detail: {
              label: this.items.find((item) => item.id === e.target.dataset.id)
                ?.label,
            },
          })
        );
      }
    }
  }

  willUpdate(changed) {
    if (changed.has("nodes") && this.nodes?.length) {
      this.nodes.forEach((node) => {
        this._datumMap.set(node.id, node.node);
      });
      this._leader = this.shadowRoot.querySelector(".leader");

      this.legend.addEventListener(
        "mouseover",
        this._mouseOverHandler.bind(this)
      );

      this.legend.addEventListener(
        "mouseout",
        this._mouseOutHandler.bind(this)
      );

      this.legend.addEventListener("click", this._clickHandler.bind(this));
    }
  }

  disconnectedCallback() {
    this.legend.removeEventListener(
      "mouseover",
      this._mouseOverHandler.bind(this)
    );
    this.legend.removeEventListener(
      "mouseleave",
      this._mouseOutHandler.bind(this)
    );
    this.legend.removeEventListener("click", this._clickHandler.bind(this));
  }
}

customElements.define("togostanza--legend2", Legend2);

function parseValue(value, scaleType) {
  if (scaleType === "linear" || scaleType === "log") {
    return parseFloat(value);
  } else if (scaleType === "time") {
    const parsedDate = new Date(value);
    return parsedDate instanceof Date ? parsedDate : NaN;
  } else {
    return value;
  }
}

/**
 * Validates params given to a stanza
 * Throws error if params marked as `required` are not present
 * @param {object} metadata contents of metadata JSON file
 * @param {object} thisparams this.params object of a stanza
 * @returns {Map} map of params with values {default: value, required: boolean}
 */
function validateParams(metadata, thisparams) {
  const exampleHosts = ["localhost", "127.0.0.1", "togostanza.github.io"];
  const examplePathname = `/${metadata["@id"]}.html`;
  // TODO how to know if this is an example page or user page? Better way to do this?
  const isExamplePage =
    exampleHosts.includes(window.location.hostname) &&
    window.location.pathname === examplePathname;

  const params = new Map(
    metadata["stanza:parameter"].map((param) => {
      return [
        param["stanza:key"],
        {
          value:
            typeof thisparams[param["stanza:key"]] === "undefined"
              ? (isExamplePage
                  ? param["stanza:example"]
                  : param["stanza:default"]) || null
              : thisparams[param["stanza:key"]],
          computed: !!param["stanza:computed"],
        },
      ];
    })
  );

  return params;
}

class Linechart extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "linechart"),
      downloadPngMenuItem(this, "linechart"),
      downloadJSONMenuItem(this, "linechart", this._data),
      downloadCSVMenuItem(this, "linechart", this._data),
      downloadTSVMenuItem(this, "linechart", this._data),
    ];
  }

  async render() {
    this._hideError();

    appendCustomCss(this, this.params["custom_css_url"]);

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    this._validatedParams = validateParams(this.metadata, this.params);

    //data
    const xKeyName = this._validatedParams.get("axis-x-key").value;
    const yKeyName = this._validatedParams.get("axis-y-key").value;
    const xAxisTitle = this._validatedParams.get("axis-x-title").value;
    const yAxisTitle = this._validatedParams.get("axis-y-title").value || "";
    const hideXAxis = !this._validatedParams.get("axis-x-visible").value;
    const hideYAxis = !this._validatedParams.get("axis-y-visible").value;
    const hideXAxisTicks = this._validatedParams.get("axis-x-ticks_hide").value;
    const hideYAxisTicks = this._validatedParams.get("axis-y-ticks_hide").value;
    const showPoints = this._validatedParams.get("points-show").value;
    const pointsSize = this._validatedParams.get("points-size").value;

    const errorKeyName = this._validatedParams.get("error_bars-key").value;

    const xTicksAngle = this._validatedParams.get(
      "axis-x-ticks_label_angle"
    ).value;

    const groupingColorKey = this._validatedParams.get("color_by-key").value;

    const xTicksNumber = 5;
    const xGridNumber = xTicksNumber;
    const xTicksInterval = !isNaN(
      parseFloat(this._validatedParams.get("axis-x-ticks_interval").value)
    )
      ? Math.abs(
          parseFloat(this._validatedParams.get("axis-x-ticks_interval").value)
        )
      : null;

    const xGridInterval = xTicksInterval;

    const showYGridlines = this._validatedParams.get(
      "axis-y-show_gridlines"
    ).value;

    const showXGridlines = this._validatedParams.get(
      "axis-x-show_gridlines"
    ).value;

    const yTicksNumber = 3;
    const yGridNumber = yTicksNumber;
    const yTicksInterval = !isNaN(
      parseFloat(this._validatedParams.get("axis-y-ticks_interval").value)
    )
      ? Math.abs(
          parseFloat(this._validatedParams.get("axis-y-ticks_interval").value)
        )
      : null;

    const yGridInterval = yTicksInterval;

    this.xScale = this._validatedParams.get("axis-x-scale").value;
    this.yScale = this._validatedParams.get("axis-y-scale").value;

    const showXPreview = this._validatedParams.get("axis-x-preview").value;
    const showYPreview = this._validatedParams.get("axis-y-preview").value;
    const showLegend = this._validatedParams.get("legend-show").value;
    const legendPosition = this._validatedParams.get("legend-placement").value;
    const legendTitle = this._validatedParams.get("legend-title").value;

    const xAxisTicksIntervalUnits = this._validatedParams.get(
      "axis-x-ticks_interval_units"
    ).value;

    const xAxisGridIntervalUnits = xAxisTicksIntervalUnits;

    const xTitlePadding = this._validatedParams.get(
      "axis-x-title_padding"
    ).value;
    const yTitlePadding = this._validatedParams.get(
      "axis-y-title_padding"
    ).value;

    const xAxisTicksFormat = this._validatedParams.get(
      "axis-x-ticks_labels_format"
    ).value;

    const yAxisTicksFormat = this._validatedParams.get(
      "axis-y-ticks_labels_format"
    ).value;

    const groupKeyName = this._validatedParams.get("group_by-key").value;

    const axisYRangeMin = this._validatedParams.get("axis-y-range_min").value;
    const axisYRangeMax = this._validatedParams.get("axis-y-range_max").value;

    if (
      this.yScale === "log" &&
      (parseFloat(axisYRangeMin) <= 0 || parseFloat(axisYRangeMin) <= 0)
    ) {
      this._renderError("Y axis range must be positive");
      throw new Error("Y axis range must be positive");
    }

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );

    /* eslint-disable-next-line */
    this._data = structuredClone(values);

    parseData.call(this);

    const showErrorBars = this._data.some((d) => d[errorKeyName]);

    const root = this.root.querySelector("main");

    if (root.querySelector("svg")) {
      root.querySelector("svg").remove();
    }

    // Data symbols
    const symbolGenerator = Symbol().size(pointsSize).type(circle);

    const width = css("--togostanza-outline-width");
    const height = css("--togostanza-outline-height");

    const MARGIN = getMarginsFromCSSString(css("--togostanza-outline-padding"));

    const SVGMargin = {
      top: 10,
      right: 10,
      bottom: 20,
      left: 24,
    };

    const colorGenerator = new StanzaColorGenerator(this);

    const togostanzaColors = colorGenerator.stanzaColor;

    const color = ordinal().range(togostanzaColors);

    function getScale(scaleType) {
      if (scaleType === "linear") {
        return linear();
      } else if (scaleType === "log") {
        return log();
      } else if (scaleType === "time") {
        return time();
      } else {
        return band();
      }
    }

    function parseData() {
      this._data.forEach((d) => {
        d[xKeyName] = parseValue(d[xKeyName], this.xScale);
        d[yKeyName] = parseValue(d[yKeyName], this.yScale);
      });
    }

    this._groups = [];
    this._groupByNameMap = new Map();

    if (groupKeyName && this._data.some((d) => d[groupKeyName])) {
      this._groupedData = this._data.reduce((acc, d) => {
        const group = d[groupKeyName];

        if (
          this.xScale !== "ordinal" &&
          (isNaN(d[xKeyName]) || isNaN(d[yKeyName]))
        ) {
          return acc;
        }
        const groupIndex = acc.findIndex((g) => g.group === group);
        if (groupIndex === -1) {
          acc.push({
            group,
            id: v4(),
            color: color(d[groupingColorKey]),
            show: true,
            data: [
              {
                x: d[xKeyName],
                y: d[yKeyName],
                error: d[errorKeyName],
              },
            ],
          });
          this._groups.push(group);
          this._groupByNameMap.set(group, acc[acc.length - 1]);
        } else {
          if (d[xKeyName] && d[yKeyName]) {
            acc[groupIndex].data.push({
              x: d[xKeyName],
              y: d[yKeyName],
              error: d[errorKeyName],
            });
          }
        }
        return acc;
      }, []);
    } else {
      this._groupedData = [
        {
          group: "data",
          color: color("data"),
          show: true,
          id: v4(),
          data: this._data
            .map((d) => {
              if (d[yKeyName] && d[yKeyName]) {
                return {
                  x: d[xKeyName],
                  y: d[yKeyName],
                  error: d[errorKeyName],
                };
              }
            })
            .filter((d) => d),
        },
      ];
    }

    const svg = select(root).append("svg");

    if (showLegend) {
      this.legend = new Legend2();

      root.append(this.legend);
      root.classList.add(`legend-${legendPosition}`);

      this.legend.items = this._groups.map((item, index) => {
        return {
          id: "" + index,
          label: item,
          color: this._groupByNameMap.get(item).color,
          toggled: false,
        };
      });
    } else {
      this.legend.removeEventListener(
        "legend-item-click",
        this._legendListener
      );
      this.legend.remove();
    }

    // Add legend, after rendering, so we know its width
    requestAnimationFrame(() => {
      const legendRect = this.legend?.getBoundingClientRect();
      if (
        this.legend &&
        (legendPosition === "right" || legendPosition === "left")
      ) {
        legendRect.height = 0;
      }
      if (
        this.legend &&
        (legendPosition === "top" || legendPosition === "bottom")
      ) {
        legendRect.width = 0;
      }

      afterLegendRendered.bind(this)(legendRect);
    });

    function afterLegendRendered(legendRect) {
      // render svg after we got legend width

      const SVGWidth = width - MARGIN.LEFT - MARGIN.RIGHT - legendRect.width;
      const SVGHeight = height - MARGIN.TOP - MARGIN.BOTTOM - legendRect.height;

      // Width and height of the chart

      const WIDTH =
        width -
        MARGIN.LEFT -
        SVGMargin.left -
        MARGIN.RIGHT -
        SVGMargin.right -
        legendRect.width;
      const HEIGHT =
        height -
        MARGIN.TOP -
        SVGMargin.top -
        MARGIN.BOTTOM -
        SVGMargin.bottom -
        legendRect.height;

      // padding betsween chart and preview
      const PD = 20;

      let chartWidth = WIDTH;
      let chartHeight = HEIGHT;
      let previewXWidth = WIDTH;
      let previewYHeight = HEIGHT;
      const previewYWidth = WIDTH * 0.2 - PD / 2;
      const previewXHeight = HEIGHT * 0.2 - PD / 2;

      if (showXPreview) {
        chartHeight = HEIGHT * 0.8 - PD / 2;
        previewYHeight = chartHeight;
      }

      if (showYPreview) {
        chartWidth = WIDTH * 0.8 - PD / 2;
        previewXWidth = chartWidth;
      }

      this._currentData = this._groupedData;

      const getXDomain = () => {
        if (this.xScale === "ordinal") {
          return [
            ...new Set(
              this._currentData.map((d) => d.data.map((d) => d.x)).flat()
            ),
          ];
        } else {
          const xDomain = this._currentData.map((d) => d.data.map((d) => d.x));
          return extent(xDomain.flat());
        }
      };

      // set y domain
      const getYDomain = () => {
        const yDomain = this._currentData.map((d) => d.data.map((d) => d.y));
        let extent$1 = extent(yDomain.flat());

        if (showErrorBars) {
          const mins = this._currentData.map((d) => {
            return d.data.map((d) => {
              // const error = d[errorKeyName];
              return d.error[0];
            });
          });

          const maxs = this._currentData.map((d) => {
            return d.data.map((d) => {
              // const error = d[errorKeyName];
              return d.error[1];
            });
          });

          extent$1 = extent([...mins.flat(), ...maxs.flat()]);
        }

        return [
          !isNaN(parseFloat(axisYRangeMin))
            ? parseFloat(axisYRangeMin)
            : extent$1[0],

          !isNaN(parseFloat(axisYRangeMax))
            ? parseFloat(axisYRangeMax)
            : extent$1[1],
        ];
      };

      svg.attr("width", SVGWidth).attr("height", SVGHeight);

      const graphArea = svg
        .append("g")
        .attr("class", "chart")
        .attr("transform", `translate(${SVGMargin.left}, ${SVGMargin.top})`);

      const yAxisTitleGroup = graphArea
        .append("g")
        .attr("class", "axis-title-group y");

      const xAxisTitleGroup = graphArea
        .append("g")
        .attr("class", "axis-title-group x");

      //Add title to axes if they are not empty
      let yTitleWidth = 0;
      let xTitleHeight = 0;
      if (yAxisTitle) {
        const yTitle = yAxisTitleGroup
          .append("text")
          .text(yAxisTitle)
          .attr("class", "title y")
          .attr("y", chartHeight / 2)
          .attr("dominant-baseline", "hanging")
          .attr("transform", `rotate(-90, 0, ${chartHeight / 2})`);

        yTitleWidth = yTitle.node().getBBox().height;
      }

      if (xAxisTitle) {
        const xTitle = xAxisTitleGroup
          .append("text")
          .text(xAxisTitle)
          .attr("class", "title x")
          .attr("y", xTitlePadding || 0)
          .attr("x", chartWidth / 2)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "hanging");

        xTitleHeight = xTitle.node().getBBox().height;
      }

      xAxisTitleGroup.attr(
        "transform",
        `translate(${yTitleWidth + yTitlePadding},${
          chartHeight - xTitlePadding - xTitleHeight
        })`
      );

      chartWidth -= yTitleWidth + yTitlePadding;
      chartHeight -= xTitleHeight + xTitlePadding;
      previewXWidth -= yTitleWidth + yTitlePadding;
      previewYHeight -= xTitleHeight + xTitlePadding;

      svg
        .append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", chartWidth)
        .attr("height", chartHeight);

      const chartAreaGroup = graphArea
        .append("g")
        .attr("class", "chart-area")
        .attr("transform", `translate(${yTitleWidth + yTitlePadding}, 0)`);

      let previewXArea;
      let previewYArea;

      if (showXPreview) {
        previewXArea = svg
          .append("g")
          .attr("class", "preview")
          .attr(
            "transform",
            `translate(${SVGMargin.left + yTitleWidth + yTitlePadding}, ${
              SVGMargin.top + chartHeight + xTitleHeight + xTitlePadding + PD
            })`
          );
      }
      if (showYPreview) {
        previewYArea = svg
          .append("g")
          .attr("class", "preview")
          .attr(
            "transform",
            `translate(${
              SVGMargin.left + chartWidth + yTitleWidth + yTitlePadding + PD
            }, ${SVGMargin.top})`
          );
      }

      const errorsGroup = chartAreaGroup
        .append("g")
        .attr("class", "error-bars")
        .attr("clip-path", "url(#clip)");

      let xExtent, yExtent;

      this._scaleX = getScale(this.xScale).range([0, chartWidth]);
      this._scaleY = getScale(this.yScale).range([chartHeight, 0]);

      this._previewXScaleX = getScale(this.xScale).range([0, previewXWidth]);
      this._previewXScaleY = getScale(this.yScale).range([previewXHeight, 0]);
      this._previewYScaleX = getScale(this.xScale).range([0, previewYWidth]);
      this._previewYScaleY = getScale(this.yScale).range([previewYHeight, 0]);

      const xAxis = axisBottom(this._scaleX);
      const xAxisX = axisBottom(this._previewXScaleX).tickValues([]);
      const xAxisY = axisBottom(this._previewYScaleX).tickValues([]);
      const yAxis = axisLeft(this._scaleY);
      const yAxisX = axisLeft(this._previewXScaleY).tickValues([]);
      const yAxisY = axisLeft(this._previewYScaleY).tickValues([]);

      const xAxisGrid = axisBottom(this._scaleX)
        .tickSize(-chartHeight)
        .tickFormat("");

      const yAxisGrid = axisLeft(this._scaleY)
        .tickSize(-chartWidth)
        .tickFormat("");

      if (this.xScale === "linear") {
        try {
          xAxis.tickFormat(format(xAxisTicksFormat));
          xAxisX.tickFormat(format(xAxisTicksFormat));
        } catch {
          xAxis.tickFormat((d) => d);
          xAxisX.tickFormat((d) => d);
        }
        xExtent = extent(getXDomain());

        if (showXGridlines) {
          if (xGridInterval) {
            const ticks = [];
            for (let i = xExtent[0]; i <= xExtent[1]; i = i + xGridInterval) {
              ticks.push(i);
            }
            xAxisGrid.tickValues(ticks);
          } else {
            xAxisGrid.ticks(xGridNumber);
          }
        }

        if (xTicksInterval) {
          const ticks = [];
          for (let i = xExtent[0]; i <= xExtent[1]; i = i + xTicksInterval) {
            ticks.push(i);
          }
          xAxis.tickValues(ticks);
        } else {
          xAxis.ticks(xTicksNumber);
        }
        try {
          xAxis.tickFormat(xAxisTicksFormat);
          xAxisX.tickFormat(xAxisTicksFormat);
        } catch {
          xAxis.tickFormat((d) => d);
          xAxisX.tickFormat((d) => d);
        }
      } else if (this.xScale === "time") {
        try {
          xAxis.tickFormat(timeFormat(xAxisTicksFormat));
          xAxisX.tickFormat(timeFormat(xAxisTicksFormat));
        } catch {
          xAxis.tickFormat(timeFormat("%Y-%m-%d"));
          xAxisX.tickFormat(timeFormat("%Y-%m-%d"));
        }

        if (showXGridlines) {
          if (
            xGridInterval &&
            xAxisGridIntervalUnits &&
            xAxisGridIntervalUnits !== "none"
          ) {
            const interval =
              intervalMap[xAxisGridIntervalUnits]().every(xGridInterval);
            xAxisGrid.ticks(interval);
          } else {
            xAxisGrid.ticks(xGridNumber);
          }
        }

        if (
          xTicksInterval &&
          xAxisTicksIntervalUnits &&
          xAxisTicksIntervalUnits !== "none"
        ) {
          const interval =
            intervalMap[xAxisTicksIntervalUnits]().every(xTicksInterval);
          xAxis.ticks(interval);
        } else {
          xAxis.ticks(xTicksNumber);
        }
      } else {
        try {
          xAxis.tickFormat(format(xAxisTicksFormat));
          xAxisX.tickFormat(format(xAxisTicksFormat));
        } catch {
          xAxis.tickFormat((d) => d);
          xAxisX.tickFormat((d) => d);
        }
      }

      if (this.yScale === "linear") {
        try {
          yAxis.tickFormat(format(yAxisTicksFormat));
        } catch {
          yAxis.tickFormat((d) => d);
        }

        yExtent = extent(getYDomain());

        if (showYGridlines) {
          if (yGridInterval) {
            const ticks = [];
            for (let i = yExtent[0]; i <= yExtent[1]; i = i + yGridInterval) {
              ticks.push(i);
            }
            yAxisGrid.tickValues(ticks);
          } else {
            yAxisGrid.ticks(yGridNumber);
          }
        }

        if (yTicksInterval) {
          const ticks = [];
          for (let i = yExtent[0]; i <= yExtent[1]; i = i + yTicksInterval) {
            ticks.push(i);
          }
          yAxis.tickValues(ticks);
        } else {
          yAxis.ticks(yTicksNumber);
        }
      } else {
        yAxis.tickFormat(format(yAxisTicksFormat));
      }

      const errorVertical = (d, error) => {
        return `M 0,${-Math.abs(
          this._scaleY(d.y) - this._scaleY(error[1])
        )} L 0,${Math.abs(this._scaleY(d.y) - this._scaleY(error[0]))}`;
      };

      const errorHorizontalTop = (d, error) => {
        const barWidth = 5;

        return `M ${-barWidth / 2},${-Math.abs(
          this._scaleY(d.y) - this._scaleY(error[1])
        )} L ${barWidth / 2},${-Math.abs(
          this._scaleY(d.y) - this._scaleY(error[1])
        )}`;
      };

      const errorHorizontalBottom = (d, error) => {
        const barWidth = 5;

        return `M ${-barWidth / 2},${Math.abs(
          this._scaleY(d.y) - this._scaleY(error[0])
        )} L ${barWidth / 2},${Math.abs(
          this._scaleY(d.y) - this._scaleY(error[0])
        )}`;
      };

      const line = line$2()
        .x((d) => {
          if (this.xScale === "ordinal") {
            return this._scaleX(d.x) + this._scaleX.bandwidth() / 2;
          }
          return this._scaleX(d.x);
        })
        .y((d) => {
          return this._scaleY(d.y);
        });

      const linePreviewX = line$2()
        .x((d) => {
          if (this.xScale === "ordinal") {
            return (
              this._previewXScaleX(d.x) + this._previewXScaleX.bandwidth() / 2
            );
          }
          return this._previewXScaleX(d.x);
        })
        .y((d) => this._previewXScaleY(d.y));

      const linePreviewY = line$2()
        .x((d) => {
          if (this.xScale === "ordinal") {
            return (
              this._previewYScaleX(d.x) + this._previewYScaleX.bandwidth() / 2
            );
          }
          return this._previewYScaleX(d.x);
        })
        .y((d) => {
          return this._previewYScaleY(d.y);
        });

      const graphXAxisG = xAxisTitleGroup.append("g").attr("class", "axis x");

      const graphXGridG = xAxisTitleGroup.append("g").attr("class", "grid x");

      const graphYAxisG = yAxisTitleGroup
        .append("g")
        .attr("class", "axis y")
        .attr("transform", `translate(${yTitlePadding + yTitleWidth}, 0)`);

      const graphYGridG = yAxisTitleGroup
        .append("g")
        .attr("class", "grid y")
        .attr("transform", `translate(${yTitlePadding + yTitleWidth}, 0)`)
        .attr("clip-path", "url(#clip)");

      let previewXAxisXG;
      let previewXAxisYG;
      let previewYAxisXG;
      let previewYAxisYG;

      // append preview if true
      if (showXPreview) {
        previewXAxisXG = previewXArea
          .append("g")
          .attr("class", "axis x")
          .attr("transform", `translate(0, ${previewXHeight})`)
          .attr("clip-path", "url(#clip)");

        previewXAxisYG = previewXArea.append("g").attr("class", "axis y");
        previewXArea.append("g").attr("class", "brushX");
      }

      if (showYPreview) {
        previewYAxisXG = previewYArea
          .append("g")
          .attr("class", "axis x")
          .attr("transform", `translate(0, ${previewYHeight})`)
          .attr("clip-path", "url(#clip)");

        previewYAxisYG = previewYArea.append("g").attr("class", "axis y");
        previewYArea.append("g").attr("class", "brushY");
      }

      // update with new data (when toggling via legend)
      const update = () => {
        this._currentData = this._groupedData.filter((group) => group.show);

        this._scaleX.domain(getXDomain());
        this._scaleY.domain(getYDomain());

        if (showXPreview) {
          this._previewXScaleX.domain(getXDomain());
          this._previewXScaleY.domain(getYDomain());

          const previewLinesUpdate = previewXArea
            .selectAll(".line")
            .data(this._currentData);

          const previewLinesEnter = previewLinesUpdate
            .enter()
            .append("path")
            .attr("class", "line")
            .attr("clip-path", "url(#clip)");

          previewLinesUpdate
            .merge(previewLinesEnter)
            .attr("d", (d) => linePreviewX(d.data))
            .attr("stroke", (d) => d.color);

          previewLinesUpdate.exit().remove();
        }

        if (showYPreview) {
          this._previewYScaleX.domain(getXDomain());
          this._previewYScaleY.domain(getYDomain());

          const previewLinesUpdate = previewYArea
            .selectAll(".line")
            .data(this._currentData);

          const previewLinesEnter = previewLinesUpdate
            .enter()
            .append("path")
            .attr("class", "line")
            .attr("clip-path", "url(#clip)");

          previewLinesUpdate
            .merge(previewLinesEnter)
            .attr("d", (d) => linePreviewY(d.data))
            .attr("stroke", (d) => d.color);

          previewLinesUpdate.exit().remove();
        }

        const interpolator = {};

        if (this.xScale === "linear") {
          this._currentData.forEach((d) => {
            const domain = d.data.map((d) => d.x);
            const range = d.data.map((d) => d.y);
            if (
              [...new Set(domain)].length < 2 ||
              [...new Set(range)].length < 2
            ) {
              this._renderError(
                "Cannot interpolate with less than 2 points. Probably wrong scale type was chosen."
              );
              return;
            }
            interpolator[d.group] = linear()
              .domain(d.data.map((d) => d.x))
              .range(d.data.map((d) => d.y));
          });
        } else if (this.xScale === "ordinal") {
          this._currentData.forEach((d) => {
            interpolator[d.group] = linear()
              .domain(d.data.map((d) => d.x))
              .range(d.data.map((d) => d.y));
          });
        } else if (this.xScale === "time") {
          this._currentData.forEach((d) => {
            const domain = d.data.map((d) => d.x);
            const range = d.data.map((d) => d.y);
            if (
              [...new Set(domain)].length < 2 ||
              [...new Set(range)].length < 2
            ) {
              this._renderError(
                "Cannot interpolate with less than 2 points. Probably wrong scale type was chosen."
              );
              return;
            }
            interpolator[d.group] = time()
              .domain(d.data.map((d) => d.x))
              .range(d.data.map((d) => d.y));
          });
        } else if (this.xScale === "log") {
          this._currentData.forEach((d) => {
            const domain = d.data.map((d) => d.x);
            const range = d.data.map((d) => d.y);
            if (
              [...new Set(domain)].length < 2 ||
              [...new Set(range)].length < 2
            ) {
              this._renderError(
                "Cannot interpolate with less than 2 points. Probably wrong scale type was chosen."
              );
              return;
            }
            interpolator[d.group] = log()
              .domain(d.data.map((d) => d.x))
              .range(d.data.map((d) => d.y));
          });
        } else {
          this._renderError(
            "Unknown scale type. Probably wrong scale type was chosen."
          );
          return;
        }

        const brushedX = (e) => {
          const s = e.selection || this._previewXScaleX.range();

          previewXArea.select(".left").attr("width", s[0]);
          previewXArea
            .select(".right")
            .attr("width", previewXWidth - s[1])
            .attr("x", s[1]);

          if (this.xScale === "ordinal") {
            const currentRange = [
              Math.floor(s[0] / this._previewXScaleX.step()),
              Math.floor(s[1] / this._previewXScaleX.step()),
            ];
            const newDomainX = getXDomain().slice(
              currentRange[0],
              currentRange[1] + 1
            );

            const croppedData = this._currentData.map((d) => {
              return {
                ...d,
                data: d.data.filter((v) => newDomainX.includes(v.x)),
              };
            });

            this._scaleX.domain(newDomainX);

            if (!showYPreview) {
              this._scaleY.domain(
                extent(croppedData.map((d) => d.data.map((v) => v.y)).flat())
              );
            }

            updateRange(croppedData);
          } else {
            const x0x1 = s.map(
              this._previewXScaleX.invert,
              this._previewXScaleX
            );
            this._scaleX.domain(x0x1);

            if (!showYPreview) {
              const extents = [];

              this._currentData.forEach((d) => {
                const ext = extent(
                  d.data
                    .filter((v) => x0x1[0] < v.x && v.x < x0x1[1])
                    .map((v) => v.y)
                );

                ext.push(...x0x1.map((v) => interpolator[d.group](v)));

                extents.push(extent(ext));
              });

              this._scaleY.domain(extent(extents.flat()));
            }
          }

          if (showXPreview) {
            previewXArea.selectAll(".handle").attr("rx", 2).attr("ry", 2);
            previewXArea
              .selectAll(".handle")
              .attr("y", previewXHeight / 4)
              .attr("height", previewXHeight / 2);
          }

          graphArea.selectAll(".line").attr("d", (d) => line(d.data));

          if (showYGridlines) {
            graphYGridG.call(yAxisGrid);
          }

          if (showXGridlines) {
            graphXGridG.call(xAxisGrid);
          }

          if (showErrorBars) {
            graphArea
              .selectAll(".error-bar")
              .call(updateErrorTranslate.bind(this));
          }
          if (showPoints) {
            graphArea
              .selectAll(".symbol")
              .call(updateSymbolTranslate.bind(this));
          }

          if (!hideXAxis && !hideXAxisTicks) {
            graphXAxisG.call(xAxis).call(rotateXTickLabels);
          }

          if (!hideYAxis && !hideYAxisTicks) {
            graphYAxisG.call(yAxis);
          }
        };

        const brushedY = (e) => {
          const s = e.selection || this._previewYScaleY.range();

          previewYArea.select(".top").attr("height", Math.min(...s));

          previewYArea
            .select(".bottom")
            .attr("y", Math.max(...s))
            .attr("height", previewYHeight - Math.max(...s));

          const y0y1 = s.map(this._previewYScaleY.invert, this._previewYScaleY);

          this._scaleY.domain(extent(y0y1));

          if (!hideXAxis && !hideXAxisTicks) {
            graphXAxisG.call(xAxis).call(rotateXTickLabels);
          }

          if (!hideYAxis && !hideYAxisTicks) {
            graphYAxisG.call(yAxis);
          }

          if (showYGridlines) {
            graphYGridG.call(yAxisGrid);
          }

          if (showXGridlines) {
            graphXGridG.call(xAxisGrid);
          }

          graphArea.selectAll(".line").attr("d", (d) => line(d.data));

          graphArea
            .selectAll(".error-bar")
            .call(updateErrorTranslate.bind(this));

          graphArea.selectAll(".error-bar").call(updateErrorScale);

          graphArea.selectAll(".symbol").call(updateSymbolTranslate.bind(this));

          if (showYPreview) {
            previewYArea.selectAll(".handle").attr("rx", 2).attr("ry", 2);
            previewYArea
              .selectAll(".handle")
              .attr("x", previewYWidth / 4)
              .attr("width", previewYWidth / 2);
          }
        };

        if (showXPreview) {
          previewXArea.selectAll(".handle").attr("rx", 2).attr("ry", 2);
          previewXArea
            .selectAll(".handle")
            .attr("y", previewXHeight / 4)
            .attr("height", previewXHeight / 2);
        }

        if (showYPreview) {
          previewYArea.selectAll(".handle").attr("rx", 2).attr("ry", 2);
          previewYArea
            .selectAll(".handle")
            .attr("x", previewYWidth / 4)
            .attr("width", previewYWidth / 2);
        }

        const updateSymbols = (data) => {
          const symUpdateG = chartAreaGroup
            .selectAll(".symbol-group")
            .data(data, (d) => d.id);

          const symEnterG = symUpdateG.enter().append("g");

          const mergedSymbols = symUpdateG
            .merge(symEnterG)
            .attr("class", "symbol-group")
            .attr("clip-path", "url(#clip)")
            .attr("fill", (d) => d.color);

          symUpdateG.exit().remove();

          const symUpdate = mergedSymbols.selectAll(".symbol").data((d) => {
            return d.data;
          });

          const symEnter = symUpdate
            .enter()
            .append("g")
            .attr("transform", (d) => {
              return `translate(${
                this._scaleX(d.x) + (this._scaleX.bandwidth?.() / 2 || 0)
              },${this._scaleY(d.y)})`;
            });

          symUpdate
            .merge(symEnter)
            .attr("class", "symbol")
            .append("path")
            .attr("d", symbolGenerator);

          symUpdate.exit().remove();
        };

        function updateErrorTranslate(nodes) {
          nodes.attr("transform", (d) => {
            const x = this._scaleX(d.x) + (this._scaleX.bandwidth?.() / 2 || 0);
            const y = this._scaleY(d.y);
            return `translate(${x},${y})`;
          });
        }

        function updateSymbolTranslate(nodes) {
          nodes.attr("transform", (d) => {
            const x = this._scaleX(d.x) + (this._scaleX.bandwidth?.() / 2 || 0);
            const y = this._scaleY(d.y);
            return `translate(${x},${y})`;
          });
        }

        function updateErrorScale(nodes) {
          nodes.each(function (d) {
            const errorG = select(this);

            errorG.select("path.vertical").attr("d", errorVertical(d, d.error));

            errorG.select("path.top").attr("d", errorHorizontalTop(d, d.error));
            errorG
              .select("path.bottom")
              .attr("d", errorHorizontalBottom(d, d.error));
          });
        }

        const updateErrors = (data) => {
          const errorUpdate = errorsGroup
            .selectAll(".error")
            .data(data, (d) => d.id);

          const errorEnter = errorUpdate.enter().append("g");

          const mergedErrors = errorUpdate
            .merge(errorEnter)
            .classed("error", true)
            .attr("stroke", (d) => d.color);

          errorUpdate.exit().remove();

          const errorBarUpdate = mergedErrors.selectAll(".error-bar").data(
            (d) => {
              return d.data;
            },
            (d) => d.x
          );

          const errorBarEnter = errorBarUpdate.enter().append("g");

          errorBarEnter
            .append("path")
            .attr("d", (d) => errorVertical(d, d.error))
            .attr("class", "vertical");

          errorBarEnter
            .append("path")
            .attr("d", (d) => errorHorizontalTop(d, d.error))
            .attr("class", "top");

          errorBarEnter
            .append("path")
            .attr("d", (d) => errorHorizontalBottom(d, d.error))
            .attr("class", "bottom");

          errorBarUpdate
            .merge(errorBarEnter)
            .attr("class", "error-bar")
            .attr("transform", (d) => {
              return `translate(${
                this._scaleX(d.x) + (this._scaleX.bandwidth?.() / 2 || 0)
              },${this._scaleY(d.y)})`;
            });

          errorBarUpdate.exit().remove();
        };

        const updateRange = (data) => {
          const linesUpdate = chartAreaGroup
            .selectAll(".line")
            .data(data, (d) => d.id);

          const linesEnter = linesUpdate
            .enter()
            .append("path")
            .attr("class", "line")
            .attr("clip-path", "url(#clip)");

          linesUpdate
            .merge(linesEnter)
            .attr("d", (d) => line(d.data))
            .attr("stroke", (d) => d.color);

          if (showPoints) {
            updateSymbols(data);
          }
          if (showErrorBars) {
            updateErrors(data);
          }

          linesUpdate.exit().remove();

          graphXAxisG.call(xAxis).call(rotateXTickLabels);
          graphYAxisG.call(yAxis);

          if (showXPreview) {
            previewXAxisXG.call(xAxisX).call(rotateXTickLabels);
            previewXAxisYG.call(yAxisX);
          }

          if (showYPreview) {
            previewYAxisXG.call(xAxisY).call(rotateXTickLabels);
            previewYAxisYG.call(yAxisY);
          }

          if (hideXAxis) {
            graphXAxisG.call(hideTicks);
            graphXAxisG.call((g) => g.select(".domain").remove());
            if (showXPreview) {
              previewXAxisXG.call(hideTicks);
              previewXAxisXG.call((g) => g.select(".domain").remove());
            }
            xAxisTitleGroup.call((g) => g.select(".text").remove());
          }
          if (hideYAxis) {
            graphYAxisG.call(hideTicks);
            graphYAxisG.call((g) => g.select(".domain").remove());
            if (showXPreview) {
              previewXAxisYG.call(hideTicks);
              previewXAxisYG.call((g) => g.select(".domain").remove());
            }
            yAxisTitleGroup.call((g) => g.select(".text").remove());
          }
          if (hideXAxisTicks) {
            graphXAxisG.call(hideTicks);
            if (showXPreview) {
              previewXAxisXG.call(hideTicks);
            }
          }
          if (hideYAxisTicks) {
            graphYAxisG.call(hideTicks);
            if (showXPreview) {
              previewXAxisYG.call(hideTicks);
            }
          }
          if (showYGridlines) {
            graphYGridG.call(yAxisGrid);
          }

          if (showXGridlines) {
            graphXGridG.call(xAxisGrid);
          }
        };

        updateRange(this._currentData);

        let brushX$1;
        let brushY$1;

        if (showXPreview) {
          brushX$1 = brushX()
            .extent([
              [0, 0],
              [previewXWidth, previewXHeight],
            ])
            .on("start brush end", brushedX);
          previewXArea
            .append("rect")
            .attr("class", "non-selection left")
            .attr("x", 0)
            .attr("y", 0)
            .attr("height", previewXHeight);

          previewXArea
            .append("rect")
            .attr("class", "non-selection right")
            .attr("y", 0)
            .attr("height", previewXHeight);

          previewXArea.call(brushX$1).call(brushX$1.move, this._scaleX.range());
        }
        if (showYPreview) {
          brushY$1 = brushY()
            .extent([
              [0, 0],
              [previewYWidth, previewYHeight],
            ])
            .on("start brush end", brushedY);

          previewYArea
            .append("rect")
            .attr("class", "non-selection top")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", previewYWidth);

          previewYArea
            .append("rect")
            .attr("class", "non-selection bottom")
            .attr("x", 0)
            .attr("width", previewYWidth);

          previewYArea
            .call(brushY$1)
            .call(brushY$1.move, [
              this._scaleY.range()[1],
              this._scaleY.range()[0],
            ]);
        }
      };

      update();

      function hideTicks(g) {
        g.selectAll(".tick").remove();
      }

      function rotateXTickLabels(g) {
        if (xTicksAngle !== 0) {
          const allTicks = g
            .selectAll(".tick text")
            .attr("y", 0)
            .attr("dy", 0)
            .attr(
              "transform",
              `translate(0, ${xAxis.tickSize() * 1.2}) rotate(${xTicksAngle})`
            )
            .attr("dominant-baseline", "middle");
          if (xTicksAngle > 0) {
            allTicks.attr("text-anchor", "start");
          } else {
            allTicks.attr("text-anchor", "end");
          }
        }
      }
      this._legendListener = (e) => {
        e.stopPropagation();

        const group = e.detail.label;

        this._groupedData.forEach((d) => {
          if (d.group === group) {
            d.show = !d.show;
          }
        });

        e.target.items = e.target.items.map((item) => {
          return {
            ...item,
            toggled: item.label === group ? !item.toggled : item.toggled,
          };
        });

        update();
      };
      if (showLegend) {
        this.legend.title = legendTitle || null;
        this.legend.nodes = this._groups.map((item, index) => {
          return {
            id: "" + index,
            node: svg
              .selectAll("path.line")
              .filter((d) => d.group === item)
              .nodes(),
          };
        });

        this.legend.options = {
          fadeoutNodes: svg.selectAll("path.line").nodes(),
          position: legendPosition.split("-"),
          fadeProp: "opacity",
          showLeaders: false,
        };

        this.legend.addEventListener("legend-item-click", this._legendListener);
      }
    }
  }

  _renderError(error) {
    const main = this.root.querySelector("main");
    let errorDiv = main.querySelector("div.error");
    if (!errorDiv) {
      errorDiv = document.createElement("div");
      errorDiv.classList.add("error");
      main.appendChild(errorDiv);
    }
    errorDiv.innerText = error;
  }
  _hideError() {
    const main = this.root.querySelector("main");
    const errorDiv = main.querySelector("div.error");
    if (errorDiv) {
      errorDiv.remove();
    }
  }
}

const intervalMap = {
  second: () => utcSecond,
  minute: () => utcMinute,
  hour: () => utcHour,
  day: () => utcDay,
  week: () => utcSunday,
  month: () => utcMonth,
  year: () => utcYear,
};

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Linechart
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "linechart",
	"stanza:label": "Linechart",
	"stanza:definition": "Linechart MetaStanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE"
],
	"stanza:created": "2021-01-06",
	"stanza:updated": "2022-11-01",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:type": "text",
		"stanza:example": "https://sparql-support.dbcls.jp/sparqlist/api/metastanza_multi_data_chart",
		"stanza:description": "Data source URL",
		"stanza:required": true
	},
	{
		"stanza:key": "data-type",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"json",
			"tsv",
			"csv",
			"sparql-results-json",
			"elasticsearch"
		],
		"stanza:example": "json",
		"stanza:description": "Data type",
		"stanza:required": true
	},
	{
		"stanza:key": "custom_css_url",
		"stanza:type": "text",
		"stanza:example": "",
		"stanza:default": "",
		"stanza:description": "Stylesheet(css file) URL to override current style",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-x-key",
		"stanza:type": "text",
		"stanza:example": "chromosome",
		"stanza:description": "Variable to be assigned as x axis value.",
		"stanza:required": true
	},
	{
		"stanza:key": "axis-x-visible",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:default": true,
		"stanza:description": "Show the axis",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-x-title",
		"stanza:type": "text",
		"stanza:example": "Category",
		"stanza:computed": true,
		"stanza:description": "Axis title",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-x-title_padding",
		"stanza:type": "number",
		"stanza:example": 40,
		"stanza:default": 20,
		"stanza:description": "Axis title padding in px",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-x-ticks_hide",
		"stanza:type": "boolean",
		"stanza:example": false,
		"stanza:description": "Hide axis ticks",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-x-ticks_label_angle",
		"stanza:type": "number",
		"stanza:example": 90,
		"stanza:default": 0,
		"stanza:description": "Tick labels angle, in degrees",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-x-preview",
		"stanza:type": "boolean",
		"stanza:example": false,
		"stanza:default": false,
		"stanza:description": "Show",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-x-scale",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"linear",
			"log",
			"ordinal",
			"time"
		],
		"stanza:example": "time",
		"stanza:default": "linear",
		"stanza:description": "Axis scale",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-x-ticks_interval",
		"stanza:type": "number",
		"stanza:example": "",
		"stanza:computed": true,
		"stanza:description": "Axis ticks interval. If not set, show 5 ticks. If axis scale is ordinal, show all ticks",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-x-ticks_interval_units",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"none",
			"year",
			"month",
			"week",
			"day",
			"hour",
			"minute",
			"second"
		],
		"stanza:example": "none",
		"stanza:default": "none",
		"stanza:description": "Axis ticks interval units",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-x-ticks_labels_format",
		"stanza:type": "text",
		"stanza:example": "%b %d",
		"stanza:default": "",
		"stanza:description": "Axis ticks interval format, in d3.format string form",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-x-show_gridlines",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:computed": true,
		"stanza:description": "Show grid lines",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-y-key",
		"stanza:type": "text",
		"stanza:example": "count",
		"stanza:description": "Variable to be assigned as y axis value. Ignored if data-type is CSV of TSV",
		"stanza:required": true
	},
	{
		"stanza:key": "axis-y-visible",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:default": true,
		"stanza:description": "Hide the axis",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-y-title",
		"stanza:type": "text",
		"stanza:example": "Data",
		"stanza:computed": true,
		"stanza:description": "Axis title",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-y-title_padding",
		"stanza:type": "number",
		"stanza:example": 20,
		"stanza:default": 20,
		"stanza:description": "Axis title padding in px",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-y-ticks_hide",
		"stanza:type": "boolean",
		"stanza:example": false,
		"stanza:default": false,
		"stanza:description": "Hide axis ticks",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-y-scale",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"linear",
			"log"
		],
		"stanza:example": "linear",
		"stanza:default": "linear",
		"stanza:description": "Axis scale",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-y-preview",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:default": false,
		"stanza:description": "Show",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-y-range_min",
		"stanza:type": "number",
		"stanza:example": null,
		"stanza:computed": true,
		"stanza:description": "Axis range min",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-y-range_max",
		"stanza:type": "number",
		"stanza:example": null,
		"stanza:computed": true,
		"stanza:description": "Axis range max",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-y-ticks_interval",
		"stanza:type": "number",
		"stanza:example": 0,
		"stanza:computed": true,
		"stanza:description": "Axis ticks interval. If bot set, show 5 ticks",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-y-ticks_labels_format",
		"stanza:type": "text",
		"stanza:example": "",
		"stanza:default": "",
		"stanza:description": "Axis ticks interval format, in d3.format string form",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-y-show_gridlines",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:default": false,
		"stanza:description": "Show grid lines",
		"stanza:required": false
	},
	{
		"stanza:key": "points-show",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:description": "Show data points",
		"stanza:required": false,
		"stanza:default": false
	},
	{
		"stanza:key": "points-size",
		"stanza:type": "number",
		"stanza:example": 10,
		"stanza:description": "Data points size",
		"stanza:required": false,
		"stanza:default": 10
	},
	{
		"stanza:key": "error_bars-key",
		"stanza:type": "text",
		"stanza:example": "error",
		"stanza:default": "",
		"stanza:description": "Data key wich includes error data. Error data is array [min, max]. If no such data key, no error bars are shown",
		"stanza:required": false
	},
	{
		"stanza:key": "group_by-key",
		"stanza:type": "text",
		"stanza:example": "category",
		"stanza:default": "",
		"stanza:description": "Data key to group by data series. All data points wich includes that key will be considered as one data series. If not set, all points will be considered as of one data series.",
		"stanza:required": false
	},
	{
		"stanza:key": "color_by-key",
		"stanza:type": "text",
		"stanza:example": "category",
		"stanza:default": "series",
		"stanza:description": "Data key to map color to the data series. If includes hex color, that color will be used, if not - color from the ordinal scale from the theme colors will be used.",
		"stanza:required": false
	},
	{
		"stanza:key": "legend-show",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:default": false,
		"stanza:description": "Show legend",
		"stanza:required": false
	},
	{
		"stanza:key": "legend-placement",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"left",
			"right",
			"bottom",
			"top"
		],
		"stanza:example": "right",
		"stanza:default": "right",
		"stanza:description": "Legend placement",
		"stanza:required": false
	},
	{
		"stanza:key": "legend-title",
		"stanza:type": "text",
		"stanza:example": "",
		"stanza:default": "",
		"stanza:description": "Legend title. If not set explicitly, shows a data grouoping data key. If set to empty string ('') no title will be shown.",
		"stanza:required": false
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-theme-series_0_color",
		"stanza:type": "color",
		"stanza:default": "#6590e6",
		"stanza:description": "Group color 0"
	},
	{
		"stanza:key": "--togostanza-theme-series_1_color",
		"stanza:type": "color",
		"stanza:default": "#3ac9b6",
		"stanza:description": "Group color 1"
	},
	{
		"stanza:key": "--togostanza-theme-series_2_color",
		"stanza:type": "color",
		"stanza:default": "#9ede2f",
		"stanza:description": "Group color 2"
	},
	{
		"stanza:key": "--togostanza-theme-series_3_color",
		"stanza:type": "color",
		"stanza:default": "#F5DA64",
		"stanza:description": "Group color 3"
	},
	{
		"stanza:key": "--togostanza-theme-series_4_color",
		"stanza:type": "color",
		"stanza:default": "#F57F5B",
		"stanza:description": "Group color 4"
	},
	{
		"stanza:key": "--togostanza-theme-series_5_color",
		"stanza:type": "color",
		"stanza:default": "#F75976",
		"stanza:description": "Group color 5"
	},
	{
		"stanza:key": "--togostanza-theme-background_color",
		"stanza:type": "color",
		"stanza:default": "",
		"stanza:description": "Background color"
	},
	{
		"stanza:key": "--togostanza-fonts-font_family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-fonts-font_color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Font color"
	},
	{
		"stanza:key": "--togostanza-fonts-font_size_primary",
		"stanza:type": "number",
		"stanza:default": 12,
		"stanza:description": "Primary font size in px (Axes title)"
	},
	{
		"stanza:key": "--togostanza-fonts-font_size_secondary",
		"stanza:type": "number",
		"stanza:default": 9,
		"stanza:description": "Secondary font size in px (Axes ticks values)"
	},
	{
		"stanza:key": "--togostanza-outline-width",
		"stanza:type": "number",
		"stanza:default": 600,
		"stanza:description": "Togostanza element width"
	},
	{
		"stanza:key": "--togostanza-outline-height",
		"stanza:type": "number",
		"stanza:default": 400,
		"stanza:description": "Togostanza element height"
	},
	{
		"stanza:key": "--togostanza-outline-padding",
		"stanza:type": "text",
		"stanza:default": "20px 20px 20px 20px",
		"stanza:description": "Togostanza element inner padding"
	},
	{
		"stanza:key": "--togostanza-border-color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Border color for everything that have a border"
	},
	{
		"stanza:key": "--togostanza-border-width",
		"stanza:type": "number",
		"stanza:default": 1,
		"stanza:description": "Border width in px"
	},
	{
		"stanza:key": "--togostanza-error_bars-width",
		"stanza:type": "number",
		"stanza:default": 1,
		"stanza:description": "Erorr bars width in px"
	},
	{
		"stanza:key": "--togostanza-error_bars-opacity",
		"stanza:type": "number",
		"stanza:default": 1,
		"stanza:description": "Erorr bars opacity"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"linechart\"></div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=linechart.js.map

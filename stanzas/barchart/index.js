import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";
import ToolTip from "@/lib/ToolTip";
import Legend from "@/lib/Legend";
import { getXTextLabelProps, getYTextLabelProps } from "@/lib/SetLabelsAngle";

import { StanzaColorGenerator } from "@/lib/ColorGenerator";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
  appendCustomCss,
} from "togostanza-utils";
import { getMarginsFromCSSString } from "../../lib/utils";

export default class Barchart extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "barchart"),
      downloadPngMenuItem(this, "barchart"),
      downloadJSONMenuItem(this, "barchart", this._data),
      downloadCSVMenuItem(this, "barchart", this._data),
      downloadTSVMenuItem(this, "barchart", this._data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom_css_url"]);

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    const colorGenerator = new StanzaColorGenerator(this);
    //width、height、padding

    //data
    const xKeyName = this.params["axis-x-key"];
    const yKeyName = this.params["axis-y-key"];
    const xAxisTitle =
      typeof this.params["axis-x-title"] === "undefined"
        ? xKeyName
        : this.params["axis-x-title"];
    const yAxisTitle =
      typeof this.params["axis-y-title"] === "undefined"
        ? yKeyName
        : this.params["axis-y-title"];

    const xTicksHide = this.params["axis-x-ticks_hide"];
    const xTicksNumber = xTicksHide ? 0 : null;
    const xTickValues = xTicksHide ? [] : null;

    const showLegend = this.params["legend-show"];
    const legendTitle = this.params["legend-title"];

    const groupKeyName = this.params["group_by-key"];

    const xLabelAngle =
      parseInt(this.params["axis-x-ticks_labels_angle"]) === 0
        ? 0
        : parseInt(this.params["axis-x-ticks_labels_angle"]) || -90;
    const yLabelAngle =
      parseInt(this.params["axis-y-ticks_labels_angle"]) === 0
        ? 0
        : parseInt(this.params["axis-y-ticks_labels_angle"]) || 0;

    const yTicksInterval = parseFloat(this.params["axis-y-ticks_interval"]);

    const yTicksNumber =
      yTicksInterval === 0 ? null : isNaN(yTicksInterval) ? 5 : null;

    const yGridLinesInterval = parseFloat(
      this.params["axis-y-gridlines_interval"]
    );

    const yGridNumber =
      yGridLinesInterval === 0 ? null : isNaN(yGridLinesInterval) ? 5 : null;

    const barPlacement = this.params["chart-bar_arrangement"] || "grouped";
    const errorKeyName = this.params["error_bars-key"];
    const showErrorBars = errorKeyName !== "" || errorKeyName !== undefined;

    const errorBarWidth = 0.4;
    const xLabelPadding = 5;
    const yLabelPadding = 10;
    const ylabelFormat = this.params["axis-y-ticks_labels_format"] || null;
    const xTitlePadding = this.params["axis-x-title_padding"] || 15;
    const yTitlePadding = this.params["axis-y-title_padding"] || 25;
    const xTickSize = this.params["axis-x-ticks_hide"] ? 0 : 4;
    const yTickSize = 4;
    const axisTitleFontSize =
      parseInt(css("--togostanza-title-font-size")) || 10;
    const barPaddings = 0.1;

    const barSubPaddings = 0.1;

    const xTickPlacement = barPlacement === "stacked" ? "center" : "in-between";

    const tooltipsKey = this.params["tooltips-key"];

    const showXAxis = !this.params["axis-x-hide"];
    const showYAxis = !this.params["axis-y-hide"];

    const axisYScale = this.params["axis-y-scale"] || "linear";

    const width = parseInt(css("--togostanza-outline-width"));
    const height = parseInt(css("--togostanza-outline-height"));

    let inputMargin = getMarginsFromCSSString(
      css("--togostanza-outline-padding")
    );

    inputMargin = {
      TOP: Math.max(inputMargin.TOP, 10),
      BOTTOM: Math.max(
        inputMargin.BOTTOM,
        xTitlePadding + xTickSize + 10 + axisTitleFontSize
      ),
      LEFT: Math.max(
        inputMargin.LEFT,
        yTitlePadding + yTickSize + 10 + axisTitleFontSize
      ),

      RIGHT: Math.max(inputMargin.RIGHT, 10),
    };

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const root = this.root.querySelector("main");
    const el = this.root.getElementById("barchart-d3");

    // On change params rerender - Check if legend and svg already existing and remove them -
    const existingLegend = this.root.querySelector("togostanza--legend");

    if (existingLegend) {
      existingLegend.remove();
    }
    const existingSVG = this.root.querySelector("svg");
    if (existingSVG) {
      existingSVG.remove();
    }
    // ====

    // Add legend

    if (showLegend) {
      this.legend = new Legend();
      root.append(this.legend);
    }

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );

    if (
      this.params["data-type"] === "csv" ||
      this.params["data-type"] === "tsv"
    ) {
      values.forEach((d) => {
        d[errorKeyName] = [d[`${errorKeyName}_q1`], d[`${errorKeyName}_q3`]];
      });
    }

    values.forEach((d) => {
      d[errorKeyName] = d[errorKeyName]?.map(parseFloat);
      d[yKeyName] = parseFloat(d[yKeyName]);
    });

    const showBarTooltips = values.some((d) => d[tooltipsKey]);

    if (!this.tooltip && showBarTooltips) {
      this.tooltip = new ToolTip();
      root.append(this.tooltip);
    }

    // Check data
    let error;
    if (!values.some((val) => yKeyName in val || parseFloat(val[yKeyName]))) {
      error = new Error(
        "--togostanza-barchart ERROR: No y-axis key found in data"
      );
      console.error(error);
      return error;
    }
    if (!values.some((val) => xKeyName in val || parseFloat(val[xKeyName]))) {
      error = new Error(
        "--togostanza-barchart ERROR: No x-axis key found in data"
      );
      console.error(error);
      return error;
    }

    //=========

    this._data = values;

    const togostanzaColors = colorGenerator.stanzaColor;

    let dataMax = d3.max(values, (d) => d[yKeyName] + (d[errorKeyName] || 0));

    const svg = d3
      .select(el)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    /// make below function to redraw with different margins if some labels are beyound the svg

    const redrawSVG = (MARGIN = inputMargin) => {
      const existingChart = svg.select("g.chart");
      if (!existingChart.empty()) {
        existingChart
          .transition()
          .duration(200)
          .attr("opacity", 0)
          .on("end", () => {
            existingChart.remove();
          });
      }

      const HEIGHT = height - MARGIN.TOP - MARGIN.BOTTOM;
      const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

      const graphArea = svg.append("g").attr("class", "chart");

      const barsArea = graphArea
        .append("g")
        .attr("class", "bars")
        .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

      const xAxisArea = graphArea
        .append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(${MARGIN.LEFT},${HEIGHT + MARGIN.TOP})`);

      const yTitleArea = graphArea.append("g").attr("class", "y axis title");

      const xTitleArea = graphArea
        .append("g")
        .attr("class", "x axis title")
        .attr("dominant-baseline", "hanging")
        .attr(
          "transform",
          `translate(0,${HEIGHT + MARGIN.TOP + xTickSize + xTitlePadding})`
        );

      xTitleArea
        .append("text")
        .text(xAxisTitle)
        .attr("text-anchor", "middle")
        .attr("x", MARGIN.LEFT + WIDTH / 2);

      const yAxisArea = graphArea
        .append("g")
        .attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`)
        .attr("class", "y axis");

      yTitleArea.attr(
        "transform",
        `translate(${MARGIN.LEFT - yTickSize - yTitlePadding},0)`
      );

      yTitleArea
        .append("text")
        .text(yAxisTitle)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "top")
        .attr("transform", `rotate(-90)`)
        .attr("x", -HEIGHT / 2 - MARGIN.TOP);

      const xAxisLabelsProps = getXTextLabelProps(
        xLabelAngle,
        xLabelPadding + xTickSize
      );
      const yAxisLabelsProps = getYTextLabelProps(
        yLabelAngle,
        yLabelPadding + yTickSize
      );

      /// Axes preparation
      const xAxisLabels = [...new Set(values.map((d) => d[xKeyName]))];
      const gSubKeyNames = [...new Set(values.map((d) => d[groupKeyName]))];

      const color = d3
        .scaleOrdinal()
        .domain(gSubKeyNames)
        .range(togostanzaColors);

      const toggleState = new Map(
        gSubKeyNames.map((_, index) => ["" + index, false])
      );

      const x = d3
        .scaleBand()
        .domain(xAxisLabels)
        .range([0, WIDTH])
        .padding(barPaddings);

      let y;

      if (barPlacement === "grouped") {
        switch (axisYScale) {
          case "log10":
            y = d3.scaleLog().range([HEIGHT, 0]);

            break;

          default:
            y = d3.scaleLinear().range([HEIGHT, 0]);

            break;
        }
      } else {
        y = d3.scaleLinear().range([HEIGHT, 0]);
      }

      const xAxisGenerator = d3
        .axisBottom(x)
        .tickSizeOuter(0)
        .ticks(xTicksNumber)
        .tickValues(xTickValues);

      const yAxisGenerator = d3
        .axisLeft(y)
        .ticks(yTicksNumber)
        .tickFormat((d) => d3.format(ylabelFormat)(d));

      const yAxisGridGenerator = d3
        .axisLeft(y)
        .tickSize(-WIDTH)
        .tickFormat("")
        .ticks(yGridNumber);

      const yGridLines = barsArea.append("g").attr("class", "y gridlines");

      const barsGroups = barsArea.append("g").attr("class", "bars-group");

      xAxisGenerator.tickSize(xTickSize);

      yAxisGenerator.tickSize(yTickSize);

      const update = (values) => {
        const xAxisLabels = [...new Set(values.map((d) => d[xKeyName]))];
        const subKeyNames = [...new Set(values.map((d) => d[groupKeyName]))];

        x.domain(xAxisLabels);

        if (showXAxis) {
          xAxisArea
            .transition()
            .duration(200)
            .call(xAxisGenerator)
            .selectAll("text")
            .attr("text-anchor", xAxisLabelsProps.textAnchor)
            .attr("alignment-baseline", xAxisLabelsProps.dominantBaseline)
            .attr("y", xAxisLabelsProps.y)
            .attr("x", xAxisLabelsProps.x)
            .attr("dy", null)
            .attr("transform", `rotate(${xLabelAngle})`)
            .on("end", function (_, i, nodes) {
              if (i === nodes.length - 1) {
                check(xAxisArea.node().getBoundingClientRect());
              }
            });
        }

        if (xTickPlacement === "in-between") {
          xAxisArea
            .selectAll("g.tick>line")
            .attr("x1", -(x.bandwidth() + x.step() * x.paddingInner()) / 2)
            .attr("x2", -(x.bandwidth() + x.step() * x.paddingInner()) / 2);
        }

        // Show/hide grid lines

        if (barPlacement === "stacked") {
          updateStackedBars(values);
        } else {
          updateGroupedBars(values);
        }

        if (showBarTooltips) {
          requestAnimationFrame(() => {
            const arr = this.root.querySelectorAll("svg rect[data-tooltip]");
            this.tooltip.setup(arr);
          });
        }

        if (showLegend) {
          this.legend.setup(
            gSubKeyNames.map((item, index) => {
              return {
                id: "" + index,
                label: item,
                color: color(item),
                node: svg
                  .selectAll("g.bars-group rect")
                  .filter((d) => {
                    if (barPlacement === "stacked") {
                      return d.key === item;
                    }
                    return d[groupKeyName] === item;
                  })
                  .nodes(),
              };
            }),
            this.root.querySelector("main"),
            {
              fadeoutNodes: svg.selectAll("g.bars-group rect").nodes(),
              position: ["top", "right"],
              fadeProp: "opacity",
              showLeaders: false,
            },
            legendTitle
          );
        }

        function updateStackedBars(values) {
          const stack = d3.stack().keys(subKeyNames);

          const dataset = [];
          for (const entry of d3.group(values, (d) => d[xKeyName]).entries()) {
            dataset.push({
              x: entry[0],
              ...Object.fromEntries(
                entry[1].map((d) => [d[groupKeyName], d[yKeyName]])
              ),
            });
          }

          const stackedData = stack(dataset);

          dataMax = d3.max(stackedData.flat(), (d) => d[1]);

          y.domain([0, dataMax * 1.05]);

          if (isNaN(yTicksInterval)) {
            yAxisGenerator.ticks(5);
          } else if (yTicksInterval !== 0) {
            const ticks = [];
            for (
              let i = 0;
              i <= Math.floor((dataMax * 1.05) / yTicksInterval);
              i++
            ) {
              ticks.push(i * yTicksInterval);
            }
            yAxisGenerator.tickValues(ticks);
          } else {
            yAxisGenerator.tickValues([]);
          }

          if (isNaN(yGridLinesInterval)) {
            yAxisGridGenerator.ticks(yGridNumber);
          } else if (yGridLinesInterval !== 0) {
            const gridTicks = [];
            for (
              let i = 0;
              i <= Math.floor((dataMax * 1.05) / yGridLinesInterval);
              i++
            ) {
              gridTicks.push(i * yGridLinesInterval);
            }
            yAxisGridGenerator.tickValues(gridTicks);
          } else {
            yAxisGridGenerator.tickValues([]);
          }

          if (showYAxis) {
            yAxisArea
              .transition()
              .duration(200)
              .call(yAxisGenerator)
              .selectAll("text")
              .attr("text-anchor", yAxisLabelsProps.textAnchor)
              .attr("alignment-baseline", yAxisLabelsProps.dominantBaseline)
              .attr("dy", null)
              .attr("x", yAxisLabelsProps.x)
              .attr("y", yAxisLabelsProps.y)
              .attr("transform", `rotate(${yLabelAngle})`);
          }

          yGridLines.transition().duration(200).call(yAxisGridGenerator);

          stackedData.forEach((item) => {
            item.forEach((d) => (d.key = item.key));
          });

          const gs = barsGroups
            .selectAll("rect")
            .data(stackedData.flat(), (d) => `${d.key}-${d[0][xKeyName]}`);

          gs.join(
            (enter) => {
              return enter
                .append("rect")
                .attr("fill", (d) => color(d.key))
                .attr("x", (d) => {
                  return x(d.data.x);
                })
                .attr("y", (d) => {
                  return y(d[1]);
                })
                .attr("height", 0)
                .attr("width", x.bandwidth())
                .transition()
                .duration(200)
                .attr("y", (d) => {
                  return y(d[1]);
                })
                .attr("height", (d) => {
                  if (d[1]) {
                    return y(d[0]) - y(d[1]);
                  }
                  return 0;
                });
            },
            (update) => {
              return update
                .transition()
                .duration(200)
                .attr("x", (d) => x(d.data.x))
                .attr("y", (d) => {
                  return y(d[1]);
                })
                .attr("width", x.bandwidth())
                .attr("height", (d) => {
                  if (d[1]) {
                    return y(d[0]) - y(d[1]);
                  }
                  return 0;
                });
            },
            (exit) => {
              exit
                .transition()
                .duration(200)
                .attr("opacity", 0)
                .on("end", () => {
                  exit.remove();
                });
            }
          )
            .attr("data-tooltip", (d) => `${d.key}: ${d[1] - d[0]}`)
            .attr("data-html", "true")
            .attr(
              "class",
              (d) => `data-${gSubKeyNames.findIndex((item) => item === d.key)}`
            );
        }

        function updateGroupedBars(values) {
          const dataset = d3.group(values, (d) => d[xKeyName]);

          const yMinMax = d3.extent(
            values,
            (d) => d[yKeyName] + (d[errorKeyName] || 0) / 2
          );

          switch (axisYScale) {
            case "log10":
              y.domain([yMinMax[0] || 1, yMinMax[1]]);
              break;

            default:
              y.domain(yMinMax);
              break;
          }

          if (isNaN(yTicksInterval)) {
            yAxisGenerator.ticks(5);
          } else if (yTicksInterval !== 0) {
            const ticks = [];
            for (
              let i = 0;
              i <= Math.floor((yMinMax[1] - yMinMax[0]) / yTicksInterval);
              i++
            ) {
              ticks.push(i * yTicksInterval);
            }
            yAxisGenerator.tickValues(ticks);
          } else {
            yAxisGenerator.tickValues([]);
          }

          if (isNaN(yGridLinesInterval)) {
            yAxisGridGenerator.ticks(yGridNumber);
          } else if (yGridLinesInterval !== 0) {
            const gridTicks = [];
            for (
              let i = 0;
              i <= Math.floor((yMinMax[1] - yMinMax[0]) / yGridLinesInterval);
              i++
            ) {
              gridTicks.push(i * yGridLinesInterval);
            }
            yAxisGridGenerator.tickValues(gridTicks);
          } else {
            yAxisGridGenerator.tickValues([]);
          }

          if (showYAxis) {
            yAxisArea
              .transition()
              .duration(200)
              .call(yAxisGenerator)
              .selectAll("text")
              .attr("text-anchor", yAxisLabelsProps.textAnchor)
              .attr("alignment-baseline", yAxisLabelsProps.dominantBaseline)
              .attr("dy", null)
              .attr("x", yAxisLabelsProps.x)
              .attr("y", yAxisLabelsProps.y)
              .attr("transform", `rotate(${yLabelAngle})`);
          }

          yGridLines.transition().duration(200).call(yAxisGridGenerator);

          const subX = d3
            .scaleBand()
            .domain(subKeyNames)
            .range([0, x.bandwidth()])
            .padding(barSubPaddings);

          //For every group of bars - own g with
          const barsGroup = barsGroups
            .selectAll("g")
            .data(dataset, (d) => d[0])
            .join(
              (enter) => enter.append("g"),
              (update) => update,
              (exit) => {
                exit.remove();
              }
            )
            .attr("transform", (d) => `translate(${x(d[0])},0)`);

          // inside every g insert bars on its own x genertor
          barsGroup
            .selectAll("rect")
            .data(
              (d) => d[1],
              (d) => `${d[xKeyName]}-${d[groupKeyName]}`
            )
            .join(
              (enter) => enter.append("rect").transition(300),
              (update) => update,
              (exit) => {
                exit.remove();
              }
            )
            .transition(300)
            .attr("data-tooltip", (d) => `${d[groupKeyName]}: ${d[yKeyName]}`)
            .attr("x", (d) => subX(d[groupKeyName]))
            .attr("y", (d) => y(d[yKeyName]))
            .attr("width", subX.bandwidth())
            .attr("height", (d) => {
              if (y(y.domain()[0]) - y(d[yKeyName]) >= 0) {
                return y(y.domain()[0]) - y(d[yKeyName]);
              }
              return 0;
            })
            .attr(
              "class",
              (d) =>
                `data-${gSubKeyNames.findIndex(
                  (item) => item === d[groupKeyName]
                )}`
            )
            .attr("fill", (d) => color(d[groupKeyName]));

          if (showErrorBars) {
            barsGroup.call(errorBars, y, subX, errorBarWidth);
          }
        }
        // Check if X axis labels gets beyond the svg borders and adjust margins if necessary:

        function check(axisBBox) {
          const svgBBox = svg.node().getBoundingClientRect();

          const deltaLeftWidth = svgBBox.left - axisBBox.left;
          const deltaRightWidth = axisBBox.right - svgBBox.right;
          const deltaBottomHeight = axisBBox.bottom - svgBBox.bottom;
          const deltaTopHeight = svgBBox.top - axisBBox.top;

          if (
            deltaLeftWidth > 0 ||
            deltaRightWidth > 0 ||
            deltaBottomHeight > 0 ||
            deltaTopHeight > 0
          ) {
            MARGIN.LEFT =
              deltaLeftWidth > 0
                ? MARGIN.LEFT + deltaLeftWidth + 5
                : MARGIN.LEFT;
            MARGIN.RIGHT =
              deltaRightWidth > 0
                ? MARGIN.RIGHT + deltaRightWidth + 5
                : MARGIN.RIGHT;
            MARGIN.BOTTOM =
              deltaBottomHeight > 0
                ? MARGIN.BOTTOM + deltaBottomHeight + 5
                : MARGIN.BOTTOM;
            MARGIN.TOP =
              deltaTopHeight > 0 ? MARGIN.TOP + deltaTopHeight + 5 : MARGIN.TOP;

            redrawSVG(MARGIN);
          }
        }
      };

      update(values);

      if (showLegend) {
        const legend = this.root
          .querySelector("togostanza--legend")
          .shadowRoot.querySelector(".legend > table > tbody");

        legend.addEventListener("click", (e) => {
          const parentNode = e.target.parentNode;
          if (parentNode.nodeName === "TR") {
            const id = parentNode.dataset.id;
            parentNode.style.opacity = toggleState.get("" + id) ? 1 : 0.5;
            toggleState.set("" + id, !toggleState.get("" + id));

            // filter out data wich was clicked
            const newData = values.filter(
              (item) =>
                !toggleState.get("" + gSubKeyNames.indexOf(item[groupKeyName]))
            );

            update(newData);
          }
        });
      }

      function errorBars(selection, yAxis, subXAxis) {
        selection.each(function (d) {
          const selG = d3.select(this);

          const errorBarGroup = selG
            .selectAll("g")
            .data(d[1])
            .enter()
            .filter((d) => {
              return d[errorKeyName] !== undefined && !isNaN(d[errorKeyName]);
            })
            .append("g")
            .attr("class", "error-bar");

          errorBarGroup
            .append("line")
            .attr("class", "error-bar-line")
            .attr(
              "x1",
              (d) => subXAxis(d[groupKeyName]) + subXAxis.bandwidth() / 2
            )
            .attr("y1", (d) => yAxis(d[errorKeyName][0]))
            .attr(
              "x2",
              (d) => subXAxis(d[groupKeyName]) + subXAxis.bandwidth() / 2
            )
            .attr("y2", (d) => yAxis(d[errorKeyName][1]));

          // upper stroke
          errorBarGroup
            .append("line")
            .attr("class", "error-bar-line")
            .attr("x1", (d) => subXAxis(d[groupKeyName]))
            .attr("x2", (d) => subXAxis(d[groupKeyName]) + subXAxis.bandwidth())
            .attr("y1", (d) => yAxis(d[errorKeyName][0]))
            .attr("y2", (d) => yAxis(d[errorKeyName][0]));
          // lower stroke
          errorBarGroup
            .append("line")
            .attr("class", "error-bar-line")
            .attr("x1", (d) => subXAxis(d[groupKeyName]))
            .attr("x2", (d) => subXAxis(d[groupKeyName]) + subXAxis.bandwidth())
            .attr("y1", (d) => yAxis(d[errorKeyName][1]))
            .attr("y2", (d) => yAxis(d[errorKeyName][1]));
        });
      }
    };

    redrawSVG();
  }
}

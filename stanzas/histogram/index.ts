import { bin, select, type Selection } from "d3";
import { AxisDomain } from "d3-axis";
import {
  downloadCSVMenuItem,
  downloadJSONMenuItem,
  downloadPngMenuItem,
  downloadSvgMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";
import { Axis, type AxisParamsI, paramsModel } from "../../lib/AxisMixin";
import MetaStanza from "../../lib/MetaStanza";
import ToolTip from "../../lib/ToolTip";
import { emitSelectedEvent, toggleSelectedIdsMultiple } from "../../lib/utils";

export default class Histogram extends MetaStanza {
  xAxisGen: Axis;
  yAxisGen: Axis;
  _graphArea: d3.Selection<SVGGElement, {}, SVGElement, unknown>;
  tooltips: ToolTip;
  selectedIds: Array<string | number> = [];

  menu() {
    return [
      downloadSvgMenuItem(this, "histogram"),
      downloadPngMenuItem(this, "histogram"),
      downloadJSONMenuItem(this, "histogram", this._data),
      downloadCSVMenuItem(this, "histogram", this._data),
      downloadTSVMenuItem(this, "histogram", this._data),
    ];
  }

  async renderNext() {
    let svg = select(this._main.querySelector("svg"));
    if (!svg.empty()) {
      svg.remove();
      this.xAxisGen = null;
      this.yAxisGen = null;
    }
    svg = select(this._main).append("svg");
    svg
      .attr("width", +this.css("--togostanza-canvas-width"))
      .attr("height", +this.css("--togostanza-canvas-height"));

    const tooltipString = this.params["tooltip"];
    if (tooltipString) {
      if (!this.tooltips) {
        this.tooltips = new ToolTip();
        this._main.append(this.tooltips);
      }
      this.tooltips.setTemplate(tooltipString);
    }

    this.drawHistogram(svg);
  }

  drawHistogram(svg: Selection<SVGSVGElement, unknown, null, undefined>) {
    const xKeyName = this.params["axis-x-key"];

    const values: Record<string, number>[] = structuredClone(this._data);

    try {
      paramsModel.parse(this.params);
    } catch (error) {
      console.log(error);
      return;
    }

    const data = values
      .map((d) => Number(d[xKeyName]))
      .filter((v) => Number.isFinite(v));
    const height =
      +this.css("--togostanza-canvas-height") -
      this.MARGIN.TOP -
      this.MARGIN.BOTTOM;

    this._graphArea = svg.append("g").attr("class", "chart");

    // ビンの設定
    const bins = bin().thresholds(+this.params["data-bin-count"] || 20)(data);

    bins.forEach((bin) => {
      // 各ビンにデータ元のデータを追加
      bin["__values__"] = values.filter(
        (value) => value[xKeyName] >= bin.x0 && value[xKeyName] < bin.x1
      );
    });

    if (!this.xAxisGen) {
      this.xAxisGen = new Axis(svg.node());
    }
    if (!this.yAxisGen) {
      this.yAxisGen = new Axis(svg.node());
    }

    // データが空の場合のガード
    if (!bins.length) {
      const xParams = getXAxisParams.apply(this, [
        [0, 1] as unknown as AxisDomain[],
        "linear",
      ]);
      this.xAxisGen.update(xParams);

      const yParams = getYAxis.apply(this, [[0, 1] as unknown as AxisDomain[]]);
      this.yAxisGen.update(yParams);

      this._graphArea.attr(
        "transform",
        `translate(${this.xAxisGen.axisArea.x},${this.xAxisGen.axisArea.y})`
      );
      return;
    }

    // X軸のスケールをビンのデータに合わせて設定
    const xAxisDomain: AxisDomain[] = [
      bins[0].x0 as AxisDomain,
      bins[bins.length - 1].x1 as AxisDomain,
    ];
    const xParams = getXAxisParams.apply(this, [xAxisDomain, "linear"]);
    this.xAxisGen.update(xParams);

    // Y軸のスケールをビンのデータに合わせて設定
    const yParams = getYAxis.apply(this, [
      [0, Math.max(...bins.map((d) => d.length)) * 1.02],
    ]);
    this.yAxisGen.update(yParams);

    this._graphArea.attr(
      "transform",
      `translate(${this.xAxisGen.axisArea.x},${this.xAxisGen.axisArea.y})`
    );

    // バーを描画
    const bar = this._graphArea
      .selectAll(".bar")
      .data(bins)
      .enter()
      .append("g")
      .attr("class", "bar")
      .attr(
        "transform",
        (d) => `translate(${this.xAxisGen.axisGen.scale()(d.x0) + 1},0)`
      );

    const css = (key: string) =>
      getComputedStyle(this.element).getPropertyValue(key);
    const fill = css("--togostanza-theme-series_0_color");

    bar
      .append("rect")
      .attr("y", (d) => this.yAxisGen.scale(d.length))
      .attr(
        "width",
        this.xAxisGen.scale(bins[0].x1) - this.xAxisGen.scale(bins[0].x0) - 2
      )
      .attr("height", (d) => height - this.yAxisGen.scale(d.length))
      .attr("fill", fill)
      .attr("data-tooltip", (d) => {
        if (this.tooltips) {
          return this.tooltips.compile(d);
        } else {
          return null as unknown as string;
        }
      });

    // ツールチップのターゲット登録
    if (this.tooltips) {
      const nodesWithTooltips = this._main.querySelectorAll("[data-tooltip]");
      this.tooltips.setup(nodesWithTooltips);
    }

    if (this.params["event-outgoing_change_selected_nodes"]) {
      bar.on("click", (_, d: any) => {
        const ids = d["__values__"].map(
          (value: any) => value["__togostanza_id__"]
        );
        toggleSelectedIdsMultiple({
          selectedIds: this.selectedIds,
          targetIds: ids,
        });

        emitSelectedEventByHistogram.apply(this, [
          this.selectedIds,
          this.params["data-url"],
        ]);
      });
    }
  }

  handleEvent(event: CustomEvent) {
    const { selectedIds, dataUrl } = event.detail as any;
    if (
      this.params["event-incoming_change_selected_nodes"] &&
      dataUrl === this.params["data-url"]
    ) {
      this.selectedIds = selectedIds;
      changeSelectedStyle.apply(this, [selectedIds]);
    }
  }
}

function emitSelectedEventByHistogram(
  this: Histogram,
  ids: unknown[],
  dataUrl: string
) {
  // dispatch event
  emitSelectedEvent({
    rootElement: this.element,
    targetId: ids[0],
    selectedIds: ids,
    dataUrl,
  });

  changeSelectedStyle.apply(this, [ids as (string | number)[]]);
}

function changeSelectedStyle(this: Histogram, ids: (string | number)[]) {
  const bars = this._graphArea.selectAll("g.bar");
  bars.classed("-selected", (d: any) =>
    d["__values__"].some((value: any) =>
      ids.includes(value["__togostanza_id__"])
    )
  );
}

/**
 *
 * @param this - Histogram instance
 * @param domain - [min, max] of the x-axis
 * @param scale
 * @returns params object for Axis's update method
 */
function getXAxisParams(
  this: Histogram,
  domain: AxisDomain[],
  scale: "linear" | "time" | "log10" | "ordinal"
) {
  const xKeyName = this.params["axis-x-key"];
  const xAxisTitle =
    typeof this.params["axis-x-title"] === "undefined"
      ? xKeyName
      : this.params["axis-x-title"];

  const xParams: AxisParamsI = {
    placement: this.params["axis-x-placement"],
    domain,
    drawArea: {
      x: 0,
      y: 0,
      width: +this.css("--togostanza-canvas-width"),
      height: +this.css("--togostanza-canvas-height"),
    },
    margins: this.MARGIN,
    tickLabelsAngle: this.params["axis-x-ticks_label_angle"],
    title: xAxisTitle,
    titlePadding: this.params["axis-x-title_padding"],
    scale,
    gridInterval: this.params["axis-x-gridlines_interval"],
    gridIntervalUnits: this.params["axis-x-gridlines_interval_units"],
    ticksInterval: this.params["axis-x-ticks_interval"],
    ticksIntervalUnits: this.params["axis-x-ticks_interval_units"],
    ticksLabelsFormat: this.params["axis-x-ticks_labels_format"],
  };

  return xParams;
}

/**
 *
 * @param this - Histogram instance
 * @param domain - [min, max] of the y-axis
 * @returns params object for Axis's update method
 */
function getYAxis(this: Histogram, domain: AxisDomain[]) {
  const yAxisTitle =
    typeof this.params["axis-y-title"] === "undefined"
      ? "count"
      : this.params["axis-y-title"];

  const yParams: AxisParamsI = {
    placement: this.params["axis-y-placement"],
    domain,
    drawArea: {
      x: 0,
      y: 0,
      width: +this.css("--togostanza-canvas-width"),
      height: +this.css("--togostanza-canvas-height"),
    },
    margins: this.MARGIN,
    tickLabelsAngle: this.params["axis-y-ticks_label_angle"],
    title: yAxisTitle,
    titlePadding: this.params["axis-y-title_padding"],
    scale: "linear",
    gridInterval: this.params["axis-y-gridlines_interval"],
    gridIntervalUnits: this.params["axis-y-gridlines_interval_units"],
    ticksInterval: this.params["axis-y-ticks_interval"],
    ticksIntervalUnits: this.params["axis-y-ticks_interval_units"],
    ticksLabelsFormat: this.params["axis-y-ticks_labels_format"],
  };
  return yParams;
}

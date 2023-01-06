import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";
import {
  Axis,
  AxisParamsI,
  AxisParamsModelT,
  MarginsI,
  paramsModel,
} from "../../lib/AxisMixin";

import { getMarginsFromCSSString } from "../../lib/utils";

import {
  downloadCSVMenuItem,
  downloadJSONMenuItem,
  downloadPngMenuItem,
  downloadSvgMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";

class TestAxis extends Stanza {
  _data: any[];
  xAxisGen: Axis;
  interval: any;
  yAxisGen: Axis;

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
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    if (this.interval) {
      clearInterval(this.interval);
    }

    const MARGIN = getMarginsFromCSSString(
      css("--togostanza-outline-padding")
    ) as MarginsI;

    const width = 500;
    const height = 200;

    this._data = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );

    let params: AxisParamsModelT;
    try {
      params = paramsModel.parse(this.params);
    } catch (error) {
      console.log(error);
    }

    const root = this.root.querySelector("main");

    let svg = d3.select(root.querySelector("svg"));

    if (svg.empty()) {
      svg = d3.select(root).append("svg");
    }

    svg.attr("width", width).attr("height", height);

    const xParams: AxisParamsI = {
      placement: params["axis-x-placement"],
      domain: [new Date(2000, 0, 1), new Date(2000, 0, 2)],
      range: [0, width],
      showTicks: !params["axis-x-ticks_hide"],
      margins: MARGIN,
      tickLabelsAngle: params["axis-x-ticks_label_angle"],
      title: params["axis-x-title"],
      titlePadding: params["axis-x-title_padding"],
      scale: "time", //params["axis-x-scale"],
      gridInterval: params["axis-x-gridlines_interval"],
      ticksInterval: params["axis-x-ticks_interval"],
      ticksIntervalUtins: params["axis-x-ticks_interval_units"],
      ticksLabelsFormat: params["axis-x-ticks_labels_format"],
    };

    const yParams: AxisParamsI = {
      placement: params["axis-y-placement"],
      domain: [0.01, 100],
      range: [0, width],
      showTicks: !params["axis-y-ticks_hide"],
      margins: MARGIN,
      tickLabelsAngle: params["axis-y-ticks_label_angle"],
      title: params["axis-y-title"],
      titlePadding: params["axis-y-title_padding"],
      scale: params["axis-y-scale"],
      gridInterval: params["axis-y-gridlines_interval"],
      ticksInterval: params["axis-y-ticks_interval"],
      ticksIntervalUtins: params["axis-y-ticks_interval_units"],
      ticksLabelsFormat: params["axis-y-ticks_labels_format"],
    };

    if (!this.xAxisGen) {
      this.xAxisGen = new Axis(svg.node());
    }
    if (!this.yAxisGen) {
      this.yAxisGen = new Axis(svg.node());
    }

    if (this.interval) {
      clearInterval(this.interval);
    }

    this.xAxisGen.update(xParams);
    this.yAxisGen.update(yParams);

    const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

    function getRandomDomain(n: number) {
      return alphabet.slice(0, n - 1);
    }

    // this.interval = setInterval(() => {
    //   const domain = getRandomDomain(Math.floor(Math.random() * 15));

    //   this.xAxisGen.update({
    //     domain,
    //     scale: "ordinal",
    //   });
    //   this.yAxisGen.update({ domain: [0.01, Math.random() * 100] });
    // }, 1000);
  }
}

export default TestAxis;

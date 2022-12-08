import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";
import { z } from "zod";
import { Axis } from "../../lib/AxisMixin";
import type { AxisParamsI } from "../../lib/AxisMixin";

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
    console.log(this.params);
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    if (this.interval) {
      clearInterval(this.interval);
    }

    const MARGIN = getMarginsFromCSSString(css("--togostanza-outline-padding"));

    const width = 200;
    const height = 200;

    this._data = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );

    const paramsModel = z
      .object({
        "axis-x-ticks_label_angle": z.number().min(-90).max(90).default(0),
        "axis-y-ticks_label_angle": z.number().min(-90).max(90).default(0),
        "axis-x-key": z.string(),
        "axis-y-key": z.string(),
        "axis-x-title_padding": z.number().default(0),
        "axis-y-title_padding": z.number().default(0),
        "axis-x-title": z.string(),
        "axis-y-title": z.string(),
        "axis-x-placement": z
          .union([z.literal("top"), z.literal("bottom")])
          .default("bottom"),
        "axis-y-placement": z
          .union([z.literal("left"), z.literal("right")])
          .default("left"),
        "axis-y-ticks_hide": z.boolean(),
        "axis-x-ticks_hide": z.boolean(),
      })
      .passthrough();

    let params: z.infer<typeof paramsModel>;
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

    const xParams = {
      placement: params["axis-x-placement"],
      domain: [0, 100],
      range: [0, width],
      showTicks: !params["axis-x-ticks_hide"],
      width,
      height,
      margins: MARGIN,
      tickLabelsAngle: params["axis-x-ticks_label_angle"],
      title: params["axis-x-title"],
    };

    if (!this.xAxisGen) {
      this.xAxisGen = new Axis(svg.node());
    }

    // if (this.interval) {
    //   clearInterval(this.interval);
    // }

    this.xAxisGen.update(xParams);

    // this.interval = setInterval(() => {
    //   this.xAxisGen.update({ domain: [0, Math.random() * 100] });
    // }, 1000);
  }
}

export default TestAxis;

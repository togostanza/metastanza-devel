import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";

import { Axis } from "../../lib/AxisMixin";

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
    if (this.interval) {
      clearInterval(this.interval);
    }

    const MARGIN = {
      TOP: 10,
      BOTTOM: 20,
      LEFT: 30,
      RIGHT: 10,
    };

    const width = 200;
    const height = 200;

    this._data = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );

    const root = this.root.querySelector("main");

    let svg = d3.select(root.querySelector("svg"));

    if (svg.empty()) {
      svg = d3.select(root).append("svg");
    }

    svg.attr("width", width).attr("height", height);

    let xG = svg.select("g.x");
    let yG = svg.select("g.y");

    console.log(xG.empty());
    if (xG.empty()) {
      xG = svg.append("g").classed("x axis", true);
    }
    if (yG.empty()) {
      yG = svg.append("g").classed("y axis", true);
    }

    this.xAxisGen = new Axis(xG, {
      placement: "bottom",
      domain: [0, 100],
      range: [0, width],
      showTicks: true,
      width,
      height,
      margins: MARGIN,
      tickLabelsAngle: this.params["axis-x-ticks_label_angle"],
    });

    this.yAxisGen = new Axis(yG, {
      placement: "left",
      domain: [0, 100],
      range: [0, height],
      showTicks: true,
      height,
      width,
      margins: MARGIN,
      tickLabelsAngle: this.params["axis-y-ticks_label_angle"],
    });

    xG.call(this.xAxisGen.axis);
    yG.call(this.yAxisGen.axis);
  }
}

export default TestAxis;

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
      BOTTOM: 10,
      LEFT: 10,
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

    if (!svg.node()) {
      svg = d3.select(root).append("svg");
    }

    svg.attr("width", width).attr("height", height);

    const xG = svg.append("g").classed("x axis", true);

    this.xAxisGen = new Axis(svg, {
      placement: "bottom",
      domain: [0, 100],
      range: [0, 200],
      showTicks: true,
      width: 200,
      tickLabelsAngle: this.params["axis-x-ticks_label_angle"],
    });

    // this.yAxisGen = new Axis(yG, {
    //   placement: "left",
    //   domain: [0, 100],
    //   range: [0, 200],
    //   showTicks: true,
    //   height: 200,
    //   tickLabelsAngle: this.params["axis-y-ticks_label_angle"],
    // });

    xG.call(this.xAxisGen.axis);
  }
}

export default TestAxis;

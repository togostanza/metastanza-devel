import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";

import AxisMixin from "@/lib/AxisMixin";
import {
  downloadCSVMenuItem,
  downloadJSONMenuItem,
  downloadPngMenuItem,
  downloadSvgMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";

class TestAxis extends Stanza {
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

    const svg = d3.select(root).append("svg");
    svg.attr("width", width).attr("height", height);

    svg.call(this.drawAxis("x", width, height, MARGIN));

    svg.call(this.drawAxis("y", width, height, MARGIN));
  }
}

Object.assign(TestAxis.prototype, AxisMixin);

export default TestAxis;

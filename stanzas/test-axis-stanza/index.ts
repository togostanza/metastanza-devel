import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";
import {
  Axis,
  AxisAreaT,
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
      css("--togostanza-canvas-padding")
    ) as MarginsI;

    const width = +css("--togostanza-canvas-width");
    const height = +css("--togostanza-canvas-height");

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

    const axisArea: AxisAreaT = { x: 100, y: 120, width: 200, height: 130 };

    const xParams: AxisParamsI = {
      placement: params["axis-x-placement"],
      domain: getRandomDomain(10),
      drawArea: axisArea,
      margins: MARGIN,
      tickLabelsAngle: params["axis-x-ticks_label_angle"],
      title: params["axis-x-title"],
      titlePadding: params["axis-x-title_padding"],
      scale: params["axis-x-scale"],
      gridInterval: params["axis-x-gridlines_interval"],
      gridIntervalUnits: params["axis-x-gridlines_interval_units"],
      ticksInterval: params["axis-x-ticks_interval"],
      ticksIntervalUnits: params["axis-x-ticks_interval_units"],
      ticksLabelsFormat: params["axis-x-ticks_labels_format"],
    };

    const yParams: AxisParamsI = {
      placement: params["axis-y-placement"],
      domain: [0.01, 3],
      drawArea: axisArea,
      margins: MARGIN,
      tickLabelsAngle: params["axis-y-ticks_label_angle"],
      title: params["axis-y-title"],
      titlePadding: params["axis-y-title_padding"],
      scale: params["axis-y-scale"],
      gridInterval: params["axis-y-gridlines_interval"],
      gridIntervalUnits: params["axis-x-gridlines_interval_units"],
      ticksInterval: params["axis-y-ticks_interval"],
      ticksIntervalUnits: params["axis-y-ticks_interval_units"],
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

    function getRandomDomain(n: number) {
      const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
      return alphabet.slice(0, n - 1);
    }

    this.interval = setInterval(() => {
      let domain = [];

      switch (xParams.scale) {
        case "ordinal":
          domain = getRandomDomain(Math.floor(Math.random() * 15));
          break;
        case "time":
          domain = [
            new Date(
              2000,
              Math.floor(Math.random() * 11),
              Math.floor(Math.random() * 30)
            ),
            new Date(
              2000,
              Math.floor(Math.random() * 11),
              Math.floor(Math.random() * 30)
            ),
          ];

          domain.sort((a, b) => a - b);
          break;

        case "linear":
          let sign1 = 1;
          let sign2 = 1;
          if (Math.random() > 0.5) {
            sign1 = -1;
          }
          if (Math.random() > 0.5) {
            sign1 = -1;
          }
          domain = [
            sign1 * Math.random() * 10,
            sign2 * Math.random() * 10,
          ].sort((a, b) => a - b);

          break;
        case "log10":
          domain = [0.01, Math.random() * 10000];
          break;
        default:
          break;
      }

      this.xAxisGen.update({
        domain,
      });
      this.yAxisGen.update({ domain: [0.01, Math.random() * 100] });
    }, 1000);
  }
}

export default TestAxis;

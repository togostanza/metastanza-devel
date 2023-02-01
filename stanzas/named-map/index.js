import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import { feature } from "topojson-client";
import loadData from "togostanza-utils/load-data";
import ToolTip from "@/lib/ToolTip";
import Legend from "@/lib/Legend";
import { getGradationColor } from "@/lib/ColorGenerator";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
  appendCustomCss,
} from "togostanza-utils";
import { getMarginsFromCSSString } from "../../lib/utils";

const REGION = new Map([
  [
    "world",
    {
      url: "https://d3js.org/world-110m.v1.json",
    },
  ],
  [
    "us",
    {
      url: "https://d3js.org/us-10m.v2.json",
    },
  ],
]);

export default class regionGeographicMap extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "named-map"),
      downloadPngMenuItem(this, "named-map"),
      downloadJSONMenuItem(this, "named-map", this._data),
      downloadCSVMenuItem(this, "named-map", this._data),
      downloadTSVMenuItem(this, "named-map", this._data),
    ];
  }

  async render() {
    const root = this.root.querySelector("main");

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      root
    );
    this._data = values;

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);
    appendCustomCss(this, this.params["custom_css_url"]);
    const width = parseFloat(css("--togostanza-canvas-width"));
    const height = parseFloat(css("--togostanza-canvas-height"));
    const padding = getMarginsFromCSSString(css("--togostanza-canvas-padding"));
    const region = this.params["data-region"];
    const legendVisible = this.params["legend-visible"];
    const legendTitle = this.params["legend-title"];
    const legendLevelsNumber = parseFloat(this.params["legend-levels_number"]);
    const existingLegend = this.root.querySelector("togostanza--legend");
    if (existingLegend) {
      existingLegend.remove();
    }
    if (legendVisible === true) {
      this.legend = new Legend();
      root.append(this.legend);
    }

    const tooltipKey = this.params["tooltips-key"];
    if (!this.tooltip) {
      this.tooltip = new ToolTip();
      root.append(this.tooltip);
    }

    // Color scale
    const areaColorKey = this.params["area-color_key"];
    const areaColorMin = this.params["area-color_min"];
    const areaColorMid = this.params["area-color_mid"];
    const areaColorMax = this.params["area-color_max"];
    let areaDomainMin = parseFloat(this.params["area-value_min"]);
    let areaDomainMid = parseFloat(this.params["area-value_mid"]);
    let areaDomainMax = parseFloat(this.params["area-value_max"]);

    if (isNaN(parseFloat(areaDomainMin))) {
      areaDomainMin = Math.min(...userDataValue);
    }
    if (isNaN(parseFloat(areaDomainMax))) {
      areaDomainMax = Math.max(...userDataValue);
    }
    if (isNaN(parseFloat(areaDomainMid))) {
      areaDomainMid = (areaDomainMax + areaDomainMin) / 2;
    }

    const setColor = getGradationColor(
      this,
      [areaColorMin, areaColorMid, areaColorMax],
      [areaDomainMin, areaDomainMid, areaDomainMax]
    );

    // Drawing svg
    const svgWidth = width - padding.LEFT - padding.RIGHT;
    const svgHeight = height - padding.TOP - padding.BOTTOM;

    d3.select(root).select("svg").remove();
    const svg = d3
      .select(root)
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("viewBox", `0 -200 1000 800`);
    const g = svg.append("g").classed("g-path", true).attr("width", 200);

    const areaUrl = REGION.get(region).url;
    const topology = await d3.json(areaUrl);
    const projection = d3.geoMercator();
    let topologyProperty, path;
    switch (region) {
      case "world":
        topologyProperty = topology.objects.countries;
        path = d3.geoPath().projection(projection);
        break;

      case "us":
        topologyProperty = topology.objects.counties;
        path = d3.geoPath();
        break;
    }

    // Combine data
    const topojsonData = feature(topology, topologyProperty).features;
    const allData = topojsonData.map((topoDatum) => {
      let matchData = values.find((val) => topoDatum.id === val.id);
      return Object.assign({}, topoDatum, {
        [areaColorKey]: matchData ? matchData[areaColorKey] : undefined,
      });
    });

    // Drawing path
    g.selectAll("path")
      .data(allData)
      .enter()
      .append("path")
      .classed("path", true)
      .attr("d", path)
      .attr("data-tooltip", (d) => d[tooltipKey])
      .attr("fill", (d) => setColor(d[areaColorKey]))
      .on("mouseenter", function () {
        d3.select(this).raise();
      });

    this.tooltip.setup(root.querySelectorAll("[data-tooltip]"));

    // Setting legend
    if (legendVisible === true) {
      this.legend.setup(
        intervals(setColor),
        null,
        {
          position: ["top", "right"],
        },
        legendTitle
      );
    }

    //Create legend objects
    function intervals(
      color,
      steps = legendLevelsNumber >= 2 ? legendLevelsNumber : 2
    ) {
      return [...Array(steps).keys()].map((i) => {
        const legendSteps =
          Math.round(
            (areaDomainMax -
              i * (Math.abs(areaDomainMax - areaDomainMin) / (steps - 1))) *
              100
          ) / 100;
        return {
          label: legendSteps,
          color: color(legendSteps),
        };
      });
    }
  }
}

import Stanza from "togostanza/stanza";
import { select, json, geoMercator, geoPath } from "d3";
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
      url: "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
    },
  ],
  [
    "us",
    {
      url: "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json",
    },
  ],
  [
    "japan",
    {
      url: "https://raw.githubusercontent.com/YukikoNoda/sampleJSON-NamedMap/main/japan.topojson",
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
    const objectType = this.params["data-object_type"];
    const property = this.params["data-property"];
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
    const userDataValue = values.map((d) => parseFloat(d[areaColorKey]));

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

    select(root).select("svg").remove();
    const svg = select(root)
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    const g = svg.append("g").classed("g-path", true);

    const areaUrl = REGION.get(region).url;
    const topoJson = await json(areaUrl);

    let projection;
    switch (region) {
      case "world":
        projection = geoMercator()
          .scale(130)
          .translate([width / 2 - 35, height / 2 - 15]);
        break;

      case "us":
        projection = d3.geoAlbersUsa().translate([width / 2, height / 2]);
        break;

      case "japan":
        projection = geoMercator().scale(1640).translate([-3510, 1470]);
        break;
    }
    const path = geoPath().projection(projection);

    // Combine data
    const geoJson = feature(topoJson, topoJson.objects[objectType]).features;

    const allData = geoJson.map((geoDatum) => {
      const matchData = values.find((val) => geoDatum.id === val.id);
      return Object.assign({}, geoDatum, {
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
        select(this).raise();
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

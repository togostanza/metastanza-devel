import Stanza from "togostanza/stanza";
import vegaEmbed from "vega-embed";
import * as d3 from "d3";
import * as topojson from "topojson";
import loadData from "togostanza-utils/load-data";
import ToolTip from "@/lib/ToolTip";
import Legend from "@/lib/Legend";
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

const areas = new Map([
  [
    "us",
    {
      name: "map",
      url: "https://vega.github.io/vega/data/us-10m.json",
      format: { type: "topojson", feature: "counties" },
    },
  ],
  [
    "world",
    {
      name: "map",
      url: "https://vega.github.io/vega/data/world-110m.json",
      format: {
        type: "topojson",
        feature: "countries",
      },
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
    this.renderTemplate({
      template: "stanza.html.hbs",
    });
    const root = this.root.querySelector("main");
    const el = this.root.getElementById("named-map");

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
    const value_key = this.params["data-value_key"];
    const area = this.params["data-region"];
    const showlegend = this.params["legend-visible"];
    const legendPlacement = this.params["legend-placement"];
    const legendTitle = this.params["legend-title"];
    const legendGroups = parseFloat(this.params["legend-levels_number"]);
    const existingLegend = this.root.querySelector("togostanza--legend");
    if (existingLegend) {
      existingLegend.remove();
    }

    if (showlegend === true) {
      this.legend = new Legend();
      root.append(this.legend);
    }

    const tooltipKey = this.params["tooltips-key"];
    const showToolTips =
      !!tooltipKey && values.some((item) => item[tooltipKey]);
    this.tooltip = new ToolTip();
    root.append(this.tooltip);

    const valObj = {
      name: "userData",
      values,
    };

    const transform = [
      {
        type: "lookup",
        from: "userData",
        key: "id",
        fields: ["id"],
        values: [value_key],
      },
    ];

    const obj = areas.get(area);
    obj.transform = transform;
    const data = [valObj, obj];

    const projections = [
      {
        name: "projection",
        type: area === "us" ? "albersUsa" : "mercator",
      },
    ];

    const togostanzaColors = new StanzaColorGenerator(this).stanzaColor;
    const colorRange = togostanzaColors.slice(0, legendGroups);

    const val = values.map((val) => val[value_key]);

    const scales = [
      {
        name: "userColor",
        type: "quantize",
        domain: [Math.min(...val), Math.max(...val)],
        range: colorRange,
      },
    ];

    const legends = [
      {
        fill: "userColor",
        orient: legendPlacement,
        title: legendTitle,
      },
    ];

    const marks = [
      {
        type: "shape",
        from: { data: "map" },
        encode: {
          enter: {
            tooltip: {
              signal: `datum.${value_key}`,
            },
          },
          hover: {
            stroke: { value: "var(--togostanza-selected-color)" },
          },
          update: {
            fill: { scale: "userColor", field: value_key },
            stroke: { value: "var(--togostanza-border-color)" },
          },
        },
        transform: [{ type: "geoshape", projection: "projection" }],
      },
    ];

    const spec = {
      $schema: "https://vega.github.io/schema/vega/v5.json",
      width: 1000,
      height: 500,
      data,
      projections,
      scales,
      legends: showlegend ? legends : [],
      marks,
    };

    const opts = {
      renderer: "svg",
    };
    await vegaEmbed(root, spec, opts);

    let areaD3;
    switch (area) {
      case "world":
        console.log("world");
        areaD3 = "https://d3js.org/world-110m.v1.json";
        break;

      case "us":
        console.log("us");
        areaD3 = "https://d3js.org/us-10m.v2.json";
        break;
    }
    console.log(areaD3);

    const chartWrapper = this.root.querySelector(".chart-wrapper");

    const projection = d3.geoMercator();

    const svg = d3
      .select(chartWrapper)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 -200 ${width} ${height}`);
    const g = svg.append("g").classed("g-path", true);

    // const path = d3.geoPath().projection(projection);

    const topology = await d3.json(areaD3);

    let topologyProperty, path;
    switch (area) {
      case "world":
        console.log("world");
        topologyProperty = topology.objects.countries;
        path = d3.geoPath().projection(projection);
        break;

      case "us":
        console.log("us");
        topologyProperty = topology.objects.counties;
        path = d3.geoPath();
        break;
    }

    g.selectAll("path")
      .data(topojson.feature(topology, topologyProperty).features)
      .enter()
      .append("path")
      .attr("d", path);
  }
}

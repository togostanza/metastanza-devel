import Stanza from "togostanza/stanza";
// import vegaEmbed from "vega-embed";
import * as d3 from "d3";
import * as topojson from "topojson";
import loadData from "togostanza-utils/load-data";
import ToolTip from "@/lib/ToolTip";
import Legend from "@/lib/Legend";
import { StanzaColorGenerator } from "@/lib/ColorGenerator";
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
      // url: "https://vega.github.io/vega/data/world-110m.json",
      url: "https://d3js.org/world-110m.v1.json",
      format: {
        type: "topojson",
        feature: "countries",
      },
    },
  ],
]);

//Mapでus, worldのkeyの中にObjectが入っている
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

    // // data-urlにはいっている情報をarrayの中のObjectで受け取っている
    // const valObj = {
    //   name: "userData",
    //   values,
    // };

    // //Objectの中にkeyを入れて定義している。arrayにしている
    // const transform = [
    //   {
    //     type: "lookup",
    //     from: "userData",
    //     key: "id",
    //     fields: ["id"],
    //     values: [value_key],
    //   },
    // ];
    // // console.log("transform", transform);

    // //params[data-region]で受け取った値のObjectと、上記のtransformの情報をを入れてる
    // const obj = areas.get(area);
    // obj.transform = transform;
    // // console.log("obj", obj);

    // // 今まで書いたdataがすべて集約されている
    // const data = [valObj, obj];
    // // console.log("data", data);

    // //projectionの設定
    // const projections = [
    //   {
    //     name: "projection",
    //     type: area === "us" ? "albersUsa" : "mercator",
    //   },
    // ];

    // //Color Setting
    // const togostanzaColors = new StanzaColorGenerator(this).stanzaColor;
    // const colorRange = togostanzaColors.slice(0, legendGroups);

    // //params[value_key]だけのarrayにしている。今回はrate
    // const userDataValue = values.map((d) => parseFloat(d[value_key]));

    // //ColorScale colorGeneratorで変更できそう
    // const scales = [
    //   {
    //     name: "userColor",
    //     type: "quantize",
    //     domain: [Math.min(...userDataValue), Math.max(...userDataValue)],
    //     range: colorRange,
    //   },
    // ];

    // //legendについてObjectで定義している
    // const legends = [
    //   {
    //     fill: "userColor",
    //     orient: legendPlacement,
    //     title: legendTitle,
    //   },
    // ];

    // //描画CSS, tooltipsなどのobject
    // const marks = [
    //   {
    //     type: "shape",
    //     from: { data: "map" },
    //     encode: {
    //       enter: {
    //         tooltip: {
    //           signal: `datum.${value_key}`,
    //         },
    //       },
    //       hover: {
    //         stroke: { value: "var(--togostanza-selected-color)" },
    //       },
    //       update: {
    //         fill: { scale: "userColor", field: value_key },
    //         stroke: { value: "var(--togostanza-border-color)" },
    //       },
    //     },
    //     transform: [{ type: "geoshape", projection: "projection" }],
    //   },
    // ];

    // const spec = {
    //   $schema: "https://vega.github.io/schema/vega/v5.json",
    //   width: 1000,
    //   height: 500,
    //   data,
    //   projections,
    //   scales,
    //   legends: showlegend ? legends : [],
    //   marks,
    // };

    // const opts = {
    //   renderer: "svg",
    // };
    // await vegaEmbed(root, spec, opts);

    // const chartWrapper = this.root.querySelector(".chart-wrapper");

    const tooltipKey = this.params["tooltips-key"];
    this.tooltip = new ToolTip();
    root.append(this.tooltip);

    const areasD3 = new Map([
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

    d3.select(root).select("svg").remove();
    const svg = d3
      .select(root)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 -200 ${width} ${height}`);
    const g = svg.append("g").classed("g-path", true);

    const areaUrl = areasD3.get(area).url;
    const topology = await d3.json(areaUrl);
    const projection = d3.geoMercator();
    let topologyProperty, path;
    switch (area) {
      case "world":
        topologyProperty = topology.objects.countries;
        path = d3.geoPath().projection(projection);
        break;

      case "us":
        topologyProperty = topology.objects.counties;
        path = d3.geoPath();
        break;
    }

    const topoJsonData = topojson.feature(topology, topologyProperty).features;
    const allTopoData = topoJsonData.map((topoDatum) => {
      let matchData = values.find((val) => topoDatum.id === val.id);
      return { ...topoDatum, ...matchData };
    });

    g.selectAll("path")
      .data(allTopoData)
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
  }
}

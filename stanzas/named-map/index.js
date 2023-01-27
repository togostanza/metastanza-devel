import Stanza from "togostanza/stanza";
import vegaEmbed from "vega-embed";
import * as d3 from "d3";
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
    const value_key = this.params["data-value_key"];
    const area = this.params["data-area"];
    const showlegend = this.params["legend-visible"];
    const legendPlacement = this.params["legend-placement"];
    const legendTitle = this.params["legend-title"];
    const legendGroups = parseFloat(this.params["legend-groups"]);
    const tooltipKey = this.params["tooltips-key"];

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
        format: this.params["data-percentage"] ? "0.1%" : "",
      },
    ];

    const marks = [
      {
        type: "shape",
        from: { data: "map" },
        encode: {
          enter: {
            tooltip: {
              signal: this.params["data-percentage"]
                ? `format(datum.${value_key}, '0.1%')`
                : `datum.${value_key}`,
            },
          },
          hover: {
            fill: { value: "var(--togostanza-selected-fill_color)" },
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
  }
}

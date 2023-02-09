import Stanza from "togostanza/stanza";
import { select, json, geoMercator, geoAlbersUsa, geoPath } from "d3";
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
      url: "https://raw.githubusercontent.com/togostanza/togostanza-data/main/samples/json/named-map-japan.json",
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
    const svgWidth = width - padding.LEFT - padding.RIGHT;
    const svgHeight = height - padding.TOP - padding.BOTTOM;

    const region = this.params["data-region"];
    const objectType = this.params["data-layer"].trim();
    const userTopoJson = this.params["data-user_topojson"].trim();
    if (userTopoJson) {
      REGION.set("user", { url: userTopoJson });
    }

    const [property1, property2] = this.params["data-property"]
      .trim()
      .split(/[.,-_/;。、 ]+/);
    const switchProperty = (datum) =>
      property2 ? datum[property1][property2] : datum[property1];

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
    const areaColorKey = this.params["area-color_key"].trim();
    const areaColorValue = this.params["area-color_value"].trim();
    const areaColorMin = this.params["area-color_min"];
    const areaColorMid = this.params["area-color_mid"];
    const areaColorMax = this.params["area-color_max"];
    let areaDomainMin = parseFloat(this.params["area-value_min"]);
    let areaDomainMid = parseFloat(this.params["area-value_mid"]);
    let areaDomainMax = parseFloat(this.params["area-value_max"]);
    const userDataValue = values.map((d) => parseFloat(d[areaColorValue]));

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
    select(root).select("svg").remove();
    const svg = select(root)
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);
    const g = svg.append("g").classed("g-path", true);

    // Setting  projection
    const projection = region === "us" ? geoAlbersUsa() : geoMercator();
    const path = geoPath().projection(projection);

    try {
      // Combine data
      const areaUrl = REGION.get(region).url;
      const topoJson = await json(areaUrl);
      const geoJson = feature(topoJson, topoJson.objects[objectType]).features;

      const allData = geoJson.map((geoDatum) => {
        const matchData = values.find(
          (val) => switchProperty(geoDatum) === val[areaColorKey]
        );
        return Object.assign({}, geoDatum, {
          [areaColorValue]: matchData ? matchData[areaColorValue] : undefined,
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
        .attr("fill", (d) =>
          switchProperty(d) ? setColor(d[areaColorValue]) : "#555"
        )
        .on("mouseenter", function () {
          select(this).raise();
        });

      // Change scale and translate of group of paths
      const paths = root.querySelectorAll(".path");
      let xmin = Infinity,
        ymin = Infinity,
        xmax = -Infinity,
        ymax = -Infinity;
      paths.forEach((path) => {
        const bbox = path.getBBox();
        xmin = Math.min(xmin, bbox.x);
        ymin = Math.min(ymin, bbox.y);
        xmax = Math.max(xmax, bbox.x + bbox.width);
        ymax = Math.max(ymax, bbox.y + bbox.height);
      });
      const gPathBbox = {
        x: xmin,
        y: ymin,
        width: xmax - xmin,
        height: ymax - ymin,
      };
      const gPathScale = Math.min(
        svgWidth / gPathBbox.width,
        svgHeight / gPathBbox.height
      );
      g.attr(
        "transform",
        `scale(${gPathScale}) translate(${
          -gPathBbox.x + (svgWidth / gPathScale - gPathBbox.width) / 2
        },${-gPathBbox.y + (svgHeight / gPathScale - gPathBbox.height) / 2})`
      );

      // Setting tooltip
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

      throw new Error(
        '"data-region" and "data-layer" (and "data-user_topojson") is not set correctly'
      );
    } catch (error) {
      handleError(
        error,
        "Cannot read properties of undefined (reading 'type')",
        "error-types",
        '<p>Set <strong>"data-region"</strong> and <strong>"data-layer"</strong> correctly !</p>'
      );

      handleError(
        error,
        "Cannot read properties of undefined (reading 'url')",
        "error-url",
        '<p>Set <strong>"data-user_topojson"</strong> and <strong>"data-layer"</strong> correctly !</p>'
      );
    }

    // Error handling
    function handleError(error, errorMessage, errorClass, message) {
      const existError = root.querySelector(`.${errorClass}`);
      if (existError) {
        root.removeChild(existError);
      }
      if (error.message === errorMessage) {
        const errorElement = document.createElement("p");
        errorElement.classList.add(errorClass);
        errorElement.innerHTML = message;
        root.prepend(errorElement);
      }
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

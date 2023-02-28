import MetaStanza from "../../lib/MetaStanza";
import { select, json, geoMercator, geoAlbersUsa, geoPath } from "d3";
import { feature } from "topojson-client";
import ToolTip from "@/lib/ToolTip";
import Legend from "@/lib/Legend2";
import { getGradationColor } from "@/lib/ColorGenerator";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";

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

export default class regionGeographicMap extends MetaStanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "named-map"),
      downloadPngMenuItem(this, "named-map"),
      downloadJSONMenuItem(this, "named-map", this._data),
      downloadCSVMenuItem(this, "named-map", this._data),
      downloadTSVMenuItem(this, "named-map", this._data),
    ];
  }

  async renderNext() {
    const root = this._main;
    const dataset = this._data;

    // Parameters
    const region = this.params["data-region"];
    const objectType = this.params["data-layer"].trim();
    const userTopoJson = this.params["data-user_topojson"].trim();
    if (userTopoJson) {
      REGION.set("user", { url: userTopoJson });
    } else {
      REGION.delete("user");
    }

    const [property1, property2] = this.params["data-property"]
      .trim()
      .split(/[.,-_/;。、 ]+/);
    const switchProperty = (datum) =>
      property2 ? datum[property1][property2] : datum[property1];

    const legendVisible = this.params["legend-visible"];
    const legendTitle = this.params["legend-title"];
    const legendLevelsNumber = parseFloat(this.params["legend-levels_number"]);

    const tooltipKey = this.params["tooltips-key"].trim();
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
    const userDataValue = dataset.map((d) => parseFloat(d[areaColorValue]));

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

    //Styles
    const width = parseFloat(this.css("--togostanza-canvas-width"));
    const height = parseFloat(this.css("--togostanza-canvas-height"));
    const padding = this.MARGIN;
    const svgWidth = width - padding.LEFT - padding.RIGHT;
    const svgHeight = height - padding.TOP - padding.BOTTOM;

    // Drawing svg
    select(root).select("svg").remove();
    const svg = select(root)
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);
    const g = svg.append("g").classed("g-path", true);

    const existError = root.querySelector(".error");
    if (existError) {
      root.removeChild(existError);
    }

    // Setting  projection
    const projection = region === "us" ? geoAlbersUsa() : geoMercator();
    const path = geoPath().projection(projection);

    let topoJsonType;
    try {
      // Combine data
      const areaUrl = REGION.get(region).url;
      const topoJson = await json(areaUrl);
      topoJsonType = Object.keys(topoJson.objects);
      const geoJson = feature(topoJson, topoJson.objects[objectType]).features;

      const allData = geoJson.map((geoDatum) => {
        const matchData = dataset.find(
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
    } catch (error) {
      const errorElement = document.createElement("p");
      errorElement.classList.add("error");

      const topoJsonTypeEl = () =>
        topoJsonType === undefined
          ? ""
          : `( <strong>${topoJsonType.join("</strong>, <strong>")}</strong> )`;

      if (region === "user") {
        errorElement.innerHTML = `<p>Set <strong>"data-user_topojson"</strong> and <strong>"data-layer"</strong>
          ${topoJsonTypeEl()} correctly !</p>`;
      } else {
        errorElement.innerHTML = `<p>Set <strong>"data-region"</strong> and <strong>"data-layer"</strong>
        ( <strong>${topoJsonType.join(
          "</strong>, <strong>"
        )}</strong> ) correctly !</p>`;
      }

      root.prepend(errorElement);
    }

    // Setting tooltip
    this.tooltip.setup(root.querySelectorAll("[data-tooltip]"));

    // Setting legend
    if (legendVisible) {
      if (!this.legend) {
        this.legend = new Legend();
        this.root.append(this.legend);
      }
      this.legend.setup({
        items: intervals(setColor).map((interval) => ({
          id: interval.label,
          color: interval.color,
          value: interval.label,
        })),
        title: legendTitle,
        options: {
          shape: "square",
        },
      });
    } else {
      this.legend?.remove();
      this.legend = null;
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

import { geoAlbersUsa, geoMercator, geoPath, json, select } from "d3";
import { Feature, Geometry } from "geojson";
import {
  downloadCSVMenuItem,
  downloadJSONMenuItem,
  downloadPngMenuItem,
  downloadSvgMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";
import { feature } from "topojson-client";
import { Topology } from "topojson-specification";
import { getGradationColor } from "../../lib/ColorGenerator";
import MetaStanza from "../../lib/MetaStanza";
import {
  emitSelectedEvent,
  toggleSelectIds,
  updateSelectedElementClassNameForD3,
} from "../../lib/utils";
import ToolTip from "../../lib/ToolTip";
import Legend from "../../lib/Legend2.js";

interface DataItem {
  [key: string]: string | number;
  __togostanza_id: string | number;
}

interface CustomFeature extends Feature<Geometry> {
  rate?: string | number;
  __togostanza_id__?: string | number;
}

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
  _chartArea: d3.Selection<SVGGElement, unknown, SVGElement, undefined>;
  selectedIds: Array<string | number> = [];
  legend: Legend;
  tooltips: ToolTip;
  selectedEventParams = {
    targetElementSelector: ".path",
    selectedElementClassName: "-selected",
    selectedElementSelector: ".-selected",
    idPath: "__togostanza_id__",
  };

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
    this._chartArea = select(root.querySelector("svg"));
    this.selectedIds = [];

    // Parameters
    const region: string = this.params["data-region"];
    const objectType: string = this.params["data-layer"].trim();
    const userTopoJson: string = this.params["data-user_topojson"].trim();
    if (userTopoJson) {
      REGION.set("user", { url: userTopoJson });
    } else {
      REGION.delete("user");
    }

    const [property1, property2]: [string, string] = this.params[
      "data-property"
    ]
      .trim()
      .split(/[.,-_/;。、 ]+/);
    const switchProperty = (datum: CustomFeature) =>
      property2 ? datum[property1][property2] : datum[property1];

    // Color scale
    const areaColorKey: string = this.params["area-color_key"].trim();
    const areaColorValue: string = this.params["area-color_value"].trim();
    const areaColorMin: string = this.params["area-color_min"];
    const areaColorMid: string = this.params["area-color_mid"];
    const areaColorMax: string = this.params["area-color_max"];
    let areaDomainMin = parseFloat(this.params["area-value_min"]);
    let areaDomainMid = parseFloat(this.params["area-value_mid"]);
    let areaDomainMax = parseFloat(this.params["area-value_max"]);
    const userDataValue = dataset.map((d: DataItem) => {
      d[areaColorValue];
    });

    if (isNaN(areaDomainMin)) {
      areaDomainMin = Math.min(...userDataValue);
    }
    if (isNaN(areaDomainMax)) {
      areaDomainMax = Math.max(...userDataValue);
    }
    if (isNaN(areaDomainMid)) {
      areaDomainMid = (areaDomainMax + areaDomainMin) / 2;
    }

    const setColor = getGradationColor(
      this,
      [areaColorMin, areaColorMid, areaColorMax],
      [areaDomainMin, areaDomainMid, areaDomainMax]
    );

    // Legend
    const isLegendVisible = this.params["legend-visible"];
    const legendTitle = this.params["legend-title"];
    const legendLevelsNumber = parseFloat(this.params["legend-color_steps"]);
    const legendConfiguration = {
      items: intervals(setColor).map((interval) => ({
        id: interval.label,
        color: interval.color,
        value: interval.label,
      })),
      title: legendTitle,
      options: {
        shape: "square",
      },
    };

    // Tooltip
    const tooltipString = this.params["tooltip"]?.trim();

    //Styles
    const width = parseFloat(this.css("--togostanza-canvas-width"));
    const height = parseFloat(this.css("--togostanza-canvas-height"));
    const padding = this.MARGIN;
    const svgWidth = width - padding.LEFT - padding.RIGHT;
    const svgHeight = height - padding.TOP - padding.BOTTOM;

    // for data-layer error
    const existError = root.querySelector(".error");
    if (existError) {
      root.removeChild(existError);
    }

    if (!this._chartArea.empty()) {
      this._chartArea.remove();
    }

    const drawContent = async () => {
      // Drawing svg
      this._chartArea = select(root)
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

      // Append tooltips
      if (tooltipString) {
        if (!this.tooltips) {
          this.tooltips = new ToolTip();
          root.append(this.tooltips);
        }
        this.tooltips.setTemplate(tooltipString);
      }

      const g = this._chartArea.append("g").classed("g-path", true);

      // Setting  projection
      const projection = region === "us" ? geoAlbersUsa() : geoMercator();
      const path = geoPath().projection(projection);

      let topoJsonType: string[] = [];
      try {
        // Combine data
        const areaUrl = REGION.get(region).url;
        const topoJson: Topology = await json(areaUrl);
        topoJsonType = Object.keys(topoJson.objects);
        const geoJsonObject = feature(topoJson, topoJson.objects[objectType]);

        let allData = [];
        if ("features" in geoJsonObject) {
          allData = geoJsonObject.features.map((geoDatum) => {
            const matchData = dataset.find(
              (val: DataItem) => switchProperty(geoDatum) === val[areaColorKey]
            );

            const wrappedMatchData = matchData
              ? Object.fromEntries(
                  Object.entries(matchData).filter(
                    ([key]) => key !== "__togostanza_id__"
                  )
                )
              : {};

            return {
              ...geoDatum,
              userData: wrappedMatchData,
              __togostanza_id__: matchData?.__togostanza_id__,
            };
          });
        }

        // Drawing path
        const pathGroup = g
          .selectAll("path")
          .data(allData)
          .enter()
          .append("path")
          .classed("path", true)
          .attr("d", path)
          .attr("data-tooltip", (d) => {
            if (this.tooltips) {
              return this.tooltips.compile(d.userData);
            } else {
              return false;
            }
          })
          .attr("fill", (d) =>
            switchProperty(d) ? setColor(d.userData[areaColorValue]) : "#555"
          );

        pathGroup.on("mouseenter", function () {
          const node = select(this);
          pathGroup.classed("-fadeout", true);
          node.classed("-fadeout", false);
        });
        pathGroup.on("mouseleave", function () {
          pathGroup.classed("-fadeout", false);
        });

        // Add event listener
        pathGroup.on("click", (e, d) => {
          select(e.target).raise();
          toggleSelectIds({
            selectedIds: this.selectedIds,
            targetId: d["__togostanza_id__"],
          });
          updateSelectedElementClassNameForD3({
            drawing: this._chartArea,
            selectedIds: this.selectedIds,
            ...this.selectedEventParams,
          });
          if (this.params["event-outgoing_change_selected_nodes"]) {
            emitSelectedEvent({
              rootElement: this.element,
              dataUrl: this.params["data-url"],
              targetId: d["__togostanza_id__"],
              selectedIds: this.selectedIds,
            });
          }
        });

        // Change scale and translate of group of paths
        const paths = root.querySelectorAll(".path");
        let xmin = Infinity,
          ymin = Infinity,
          xmax = -Infinity,
          ymax = -Infinity;
        paths.forEach((path: SVGGraphicsElement) => {
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
            : `( <strong>${topoJsonType.join(
                "</strong>, <strong>"
              )}</strong> )`;

        if (region === "user") {
          errorElement.innerHTML = `<p>Set <strong>"data-user_topojson"</strong> and <strong>"data-layer"</strong>
          ${topoJsonTypeEl()} correctly!</p>`;
        } else {
          errorElement.innerHTML = `<p>Set <strong>"data-layer"</strong>
        (<strong>${topoJsonType.join(
          "</strong>, <strong>"
        )}</strong>) correctly!</p>`;
        }

        root.prepend(errorElement);
      }
    };

    await drawContent();

    if (isLegendVisible) {
      if (!this.legend) {
        this.legend = new Legend();
        this.root.append(this.legend);
      }
      this.legend.setup(legendConfiguration);
    } else {
      this.legend?.remove();
      this.legend = null;
    }

    if (this.tooltips) {
      this.tooltips.setup(root.querySelectorAll("[data-tooltip]"));
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

  // TODO: add color type. ScaleLinear<string, number>.
  // check https://github.com/d3/d3-scale/issues/111, https://github.com/DefinitelyTyped/DefinitelyTyped/issues/38574
  // fix ColorGenerator to typescript
  handleEvent(event: CustomEvent) {
    const { selectedIds, dataUrl } = event.detail;
    if (
      this.params["event-incoming_change_selected_nodes"] &&
      dataUrl === this.params["data-url"]
    ) {
      this.selectedIds = selectedIds;
      updateSelectedElementClassNameForD3({
        drawing: this._chartArea,
        selectedIds: event.detail.selectedIds,
        ...this.selectedEventParams,
      });
    }
  }
}

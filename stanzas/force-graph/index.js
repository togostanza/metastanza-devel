import prepareGraphData from "@/lib/prepareGraphData";
import * as d3 from "d3";
import { Data } from "togostanza-utils/data";
import MetaStanza from "../../lib/MetaStanza";
import { handleApiError } from "../../lib/apiError";
import drawForceLayout from "./drawForceLayout";

import { getMarginsFromCSSString } from "@/lib/utils";

import {
  appendCustomCss,
  downloadCSVMenuItem,
  downloadJSONMenuItem,
  downloadPngMenuItem,
  downloadSvgMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";
import {
  emitSelectedEvent,
  toggleSelectIds,
  updateSelectedElementClassNameForD3,
} from "../../lib/utils";

export default class ForceGraph extends MetaStanza {
  _graphArea;
  selectedEventParams = {
    targetElementSelector: ".node",
    selectedElementClassName: "-selected",
    selectedElementSelector: ".-selected",
    idPath: "id",
  };
  selectedIds = [];

  menu() {
    return [
      downloadSvgMenuItem(this, "force-graph"),
      downloadPngMenuItem(this, "force-graph"),
      downloadJSONMenuItem(this, "force-graph", this._data),
      downloadCSVMenuItem(this, "force-graph", this._data),
      downloadTSVMenuItem(this, "force-graph", this._data),
    ];
  }

  async renderNext() {
    if (!this._graphArea?.empty()) {
      this._graphArea?.remove();
    }

    const setFallbackVal = (param, defVal) => {
      return isNaN(parseFloat(this.params[param]))
        ? defVal
        : this.params[param];
    };

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const root = this.root.querySelector("main");
    const el = this.root.getElementById("force-graph");

    //data
    const width = parseInt(this.css("--togostanza-canvas-width"));
    const height = parseInt(this.css("--togostanza-canvas-height"));

    const drawContent = async () => {
      const data = await Data.load(this.params["data-url"], {
        type: this.params["data-type"],
        mainElement: this.root.querySelector("main"),
      });

      this._data = data.data;
      const graph = data.asGraph({
        nodesKey: this.params["data-nodes_key"],
        edgesKey: this.params["data-edges_key"],
        nodeIdKey: this.params["node-id_key"],
      });

      const { nodes, edges } = graph;

      // add any other arbitrary data that was in the json:
      for (const node of nodes) {
        Object.assign(
          node,
          this._data[this.params["data-nodes_key"]]?.find(
            (d) => d[this.params["node-id_key"]] === node.id
          )
        );
      }

      const nodeSizeParams = {
        dataKey: this.params["node-size_key"] || "",
        minSize: setFallbackVal("node-size_min", 0),
        maxSize: this.params["node-size_max"],
        scale: this.params["node-size_scale"] || "linear",
      };

      const nodeColorParams = {
        dataKey: this.params["node-color_key"] || "",
      };

      const edgeWidthParams = {
        dataKey: this.params["edge-width_key"] || "",
        minWidth: setFallbackVal("edge-width_min", 1),
        maxWidth: this.params["edge-width_max"],
        scale: this.params["edge-width_scale"] || "linear",
        showArrows: this.params["edge-arrows_visible"],
      };

      const edgeColorParams = {
        basedOn: "data key",
        dataKey: Symbol(),
      };

      const nodeLabelParams = {
        margin: 3,
        dataKey: this.params["node-label_key"],
        urlKey: this.params["node-url_key"],
      };

      const highlightAdjEdges = true;

      const MARGIN = getMarginsFromCSSString(
        this.css("--togostanza-canvas-padding")
      );

      const tooltipParams = {
        dataKey: this.params["node-tooltip_key"],
        show: nodes.some((d) => d[this.params["node-tooltip_key"]]),
      };

      // Setting color scale
      const togostanzaColors = [];

      let i = 0;

      let togoColor = this.css(`--togostanza-theme-series_${i}_color`)
        .trim()
        .toUpperCase();

      while (togoColor) {
        togostanzaColors.push(togoColor);
        i++;
        togoColor = this.css(`--togostanza-theme-series_${i}_color`)
          .trim()
          .toUpperCase();
      }

      const color = function () {
        return d3.scaleOrdinal().range(togostanzaColors);
      };

      const existingSvg = root.getElementsByTagName("svg")[0];
      if (existingSvg) {
        existingSvg.remove();
      }
      this._graphArea = d3
        .select(el)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      const params = {
        MARGIN,
        width,
        height,
        svg: this._graphArea,
        color,
        highlightAdjEdges,
        nodeSizeParams,
        nodeColorParams,
        edgeWidthParams,
        edgeColorParams,
        nodeLabelParams,
        tooltipParams,
      };

      const { prepNodes, prepEdges, symbols } = prepareGraphData(
        nodes,
        edges,
        params
      );

      drawForceLayout(this._graphArea, prepNodes, prepEdges, {
        ...params,
        symbols,
      });

      if (this.params["event-outgoing_change_selected_nodes"]) {
        this._graphArea
          .selectAll(".node")
          .selectAll("circle")
          .on("click", (_, d) => {
            toggleSelectIds({
              selectedIds: this.selectedIds,
              targetId: d.id,
            });
            updateSelectedElementClassNameForD3({
              drawing: this._graphArea,
              selectedIds: this.selectedIds,
              ...this.selectedEventParams,
            });
            if (this.params["event-outgoing_change_selected_nodes"]) {
              emitSelectedEvent({
                rootElement: this.element,
                targetId: d.id,
                selectedIds: this.selectedIds,
                dataUrl: this.params["data-url"],
              });
            }
          });
      }
    };

    handleApiError({
      stanzaData: this,
      hasTooltip: true,
      drawContent,
    });
  }

  handleEvent(event) {
    const { selectedIds, dataUrl } = event.detail;

    if (
      this.params["event-incoming_change_selected_nodes"] &&
      dataUrl === this.params["data-url"]
    ) {
      this.selectedIds = selectedIds;
      updateSelectedElementClassNameForD3({
        drawing: this._graphArea,
        selectedIds,
        ...this.selectedEventParams,
      });
    }
  }
}

import getStanzaColors from "@/lib/ColorGenerator";
import MetaStanza from "@/lib/MetaStanza";
import prepareGraphData from "@/lib/prepareGraphData";
import { getMarginsFromCSSString } from "@/lib/utils";
import * as d3 from "d3";
import drawForceLayout from "./drawForceLayout";

import {
  downloadCSVMenuItem,
  downloadJSONMenuItem,
  downloadPngMenuItem,
  downloadSvgMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";
import ToolTip from "../../lib/ToolTip";
import { METASTANZA_DATA_ATTR } from "../../lib/MetaStanza";
import { SelectionPlugin } from "../../lib/plugins/SelectionPlugin";

export default class ForceGraph extends MetaStanza {
  _graphArea;
  _selectionPlugin;

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
    this._selectionPlugin = new SelectionPlugin({
      adapter: "vanilla",
      stanza: this,
    });

    this.use(this._selectionPlugin);

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

    const width = parseInt(this.css("--togostanza-canvas-width"));
    const height = parseInt(this.css("--togostanza-canvas-height"));

    if (this.params["tooltip"]) {
      this.tooltips = new ToolTip();
      this.tooltips.setTemplate(this.params["tooltip"]);
      this._main.appendChild(this.tooltips);
    }

    const drawContent = async () => {
      const graph = this.__data.asGraph({
        nodesKey: this.params["data-nodes_key"],
        edgesKey: this.params["data-edges_key"],
        nodeIdKey: this.params["node-id_key"],
      });

      console.log("data", graph);

      const { nodes, edges } = graph;

      const nodeSizeParams = {
        dataKey: this.params["node-size_key"] || "",
        minSize: setFallbackVal("node-size_min", 0),
        maxSize: this.params["node-size_max"],
        scale: this.params["node-size_scale"] || "linear",
      };

      const nodeColorParams = {
        colorKey: this.params["node-color_key"] || "",
        groupKey: this.params["node-group_key"] || "",
        colorBlendMode: this.params["node-color_blend"] || "normal",
      };

      const edgeWidthParams = {
        dataKey: this.params["edge-width-key"] || "",
        minWidth: setFallbackVal("edge-width-min", 1),
        maxWidth: this.params["edge-width-max"],
        scale: this.params["edge-width-scale"] || "linear",
        showArrows: this.params["edge-arrows_visible"],
      };

      const edgeColorParams = {
        basedOn: "data key",
        dataKey: Symbol(),
      };

      const nodeLabelParams = {
        margin: 3,
        dataKey: this.params["node-label_key"],
      };

      const highlightAdjEdges = true;

      const MARGIN = getMarginsFromCSSString(
        this.css("--togostanza-canvas-padding")
      );

      const tooltipParams = {
        dataKey: this.params["tooltip"],
        show: !!this.params["tooltip"],
        tooltipsInstance: this.tooltips,
      };

      const togostanzaColors = getStanzaColors(this);

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

      if (tooltipParams.show && this.tooltips) {
        const nodesList = this._main.querySelectorAll("[data-tooltip]");
        this.tooltips.setup(nodesList);
      }

      // Set data-id attributes for nodes to work with the selection plugin
      this._graphArea
        .selectAll(".node")
        .attr(METASTANZA_DATA_ATTR, (d) => d.id.toString());
    };

    drawContent();
  }
}

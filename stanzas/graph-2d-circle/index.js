import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";
import ToolTip from "@/lib/ToolTip";
import prepareGraphData from "@/lib/prepareGraphData";
import drawCircleLayout from "./drawCircleLayout";
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

export default class ForceGraph extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "graph-2d-force"),
      downloadPngMenuItem(this, "graph-2d-force"),
      downloadJSONMenuItem(this, "graph-2d-force", this._data),
      downloadCSVMenuItem(this, "graph-2d-force", this._data),
      downloadTSVMenuItem(this, "graph-2d-force", this._data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["togostanza-custom_css_url"]);

    const setFallbackVal = (param, defVal) => {
      return isNaN(parseFloat(this.params[param]))
        ? defVal
        : this.params[param];
    };

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    //data

    const width = parseInt(css("--togostanza-outline-width"));
    const height = parseInt(css("--togostanza-outline-height"));

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );

    this._data = values;

    const nodes = values[this.params["nodes-key"]];
    const edges = values.links;

    const MARGIN = getMarginsFromCSSString(css("--togostanza-outline-padding"));

    const togostanzaColors = new StanzaColorGenerator(this).stanzaColor;

    const color = function () {
      return d3.scaleOrdinal().range(togostanzaColors);
    };

    const root = this.root.querySelector("main");
    const el = this.root.getElementById("graph-2d-circle");

    const existingSvg = root.getElementsByTagName("svg")[0];
    if (existingSvg) {
      existingSvg.remove();
    }
    const svg = d3
      .select(el)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    this.tooltip = new ToolTip();
    root.append(this.tooltip);

    const nodesSortParams = {
      sortBy: this.params["nodes-sort-key"],
      sortOrder: this.params["nodes-sort-order"] || "ascending",
    };

    const NODE_SIZE_BASED_ON = {
      dataKey: "data key",
      sumEdges: "sum of edge values",
    };

    const nodeSizeParams = {
      basedOn: this.params["node-size-based_on"] || "fixed",
      dataKey: this.params["node-size-key"] || "",
      scale: this.params["node-size-scale"] || "linear",
      fixedSize: this.params["node-size-min"] || 3,
      minSize: this.params["node-size-min"],
      maxSize: this.params["node-size-max"],
    };

    const nodeColorParams = {
      dataKey: this.params["node-color-key"] || "",
    };

    const edgeWidthParams = {
      dataKey: this.params["edge-width-key"] || "",
      minWidth: setFallbackVal("edge-width-min", 1),
      maxWidth: this.params["edge-width-max"],
      scale: "linear",
      showArrows: this.params["edge-show_arrows"],
    };

    const edgeColorParams = {
      basedOn: "data key",
      dataKey: Symbol(),
    };

    const nodeLabelParams = {
      margin: this.params["labels-margin"],
      dataKey: this.params["labels-data-key"],
    };

    const tooltipParams = {
      dataKey: this.params["tooltips-key"],
      show: nodes.some((d) => d[this.params["tooltips-key"]]),
    };

    const edgeParams = {
      type: "curve",
      curveStrength: this.params["edge-curvature"] || 0,
    };

    const highlightAdjEdges = true;

    const params = {
      MARGIN,
      width,
      height,
      svg,
      color,
      highlightAdjEdges,
      nodesSortParams,
      nodeSizeParams,
      nodeColorParams,
      edgeWidthParams,
      edgeColorParams,
      edgeParams,
      nodeLabelParams,
      tooltipParams,
    };

    let notEmptyNodes = nodes;
    if (!notEmptyNodes) {
      const names = Array.from(
        new Set(edges.flatMap((d) => [d.source, d.target]))
      );
      notEmptyNodes = [];
      names.forEach((name) => {
        notEmptyNodes.push({
          id: name,
        });
      });
    }

    const { prepNodes, prepEdges, symbols } = prepareGraphData(
      notEmptyNodes,
      edges,
      params
    );

    if (nodeSizeParams.basedOn === NODE_SIZE_BASED_ON.sumEdges) {
      drawChordDiagram(svg, prepNodes, prepEdges, { ...params, symbols });
    } else {
      drawCircleLayout(svg, prepNodes, prepEdges, { ...params, symbols });
    }

    this.tooltip.setup(el.querySelectorAll("[data-tooltip]"));
  }
}

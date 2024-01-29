import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import { Data } from "togostanza-utils/data";
import ToolTip from "@/lib/ToolTip";
import drawForceLayout from "./drawForceLayout";
import prepareGraphData from "@/lib/prepareGraphData";

import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
  appendCustomCss,
} from "togostanza-utils";

export default class ForceGraph extends Stanza {
  _graphArea;

  menu() {
    return [
      downloadSvgMenuItem(this, "force-graph"),
      downloadPngMenuItem(this, "force-graph"),
      downloadJSONMenuItem(this, "force-graph", this._data),
      downloadCSVMenuItem(this, "force-graph", this._data),
      downloadTSVMenuItem(this, "force-graph", this._data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["togostanza-custom_css_url"]);

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

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
    const width = parseInt(css("--togostanza-canvas-width"));
    const height = parseInt(css("--togostanza-canvas-height"));

    const data = await Data.load(this.params["data-url"], {
      type: this.params["data-type"],
      mainElement: this.root.querySelector("main"),
    });

    this._data = data.data;
    const graph = data.asGraph({
      edgesKey: "links", // TODO parameterize
    });

    const { nodes, edges } = graph;

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
    };

    const highlightAdjEdges = true;

    const MARGIN = getMarginsFromCSSString(css("--togostanza-canvas-padding"));

    const tooltipParams = {
      dataKey: this.params["node-tooltip_key"],
      show: nodes.some((d) => d[this.params["node-tooltip_key"]]),
    };

    // Setting color scale
    const togostanzaColors = [];

    let i = 0;

    let togoColor = css(`--togostanza-theme-series_${i}_color`)
      .trim()
      .toUpperCase();

    while (togoColor) {
      togostanzaColors.push(togoColor);
      i++;
      togoColor = css(`--togostanza-theme-series_${i}_color`)
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

    this.tooltip = new ToolTip();
    root.append(this.tooltip);

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

    if (tooltipParams.show) {
      this.tooltip.setup(el.querySelectorAll("[data-tooltip]"));
    }
    this._graphArea.selectAll("g.node-group").on("click", (_, d) => {
      const clickedNode = prepNodes.find(({ id }) => id === d.id);
      return emitSelectedEvent.apply(null, [this, clickedNode.id]);
    });
  }

  handleEvent(event) {
    const selectedNodes = event.detail;
    const nodeGroups = this._graphArea.selectAll("g.node-group");
    nodeGroups.classed("-selected", (d) => {
      return selectedNodes.includes(d.id);
    });
  }
}

function getMarginsFromCSSString(str) {
  const splitted = str.trim().split(/\W+/);

  const res = {
    TOP: 0,
    RIGHT: 0,
    BOTTOM: 0,
    LEFT: 0,
  };

  switch (splitted.length) {
    case 1:
      res.TOP = res.RIGHT = res.BOTTOM = res.LEFT = parseInt(splitted[0]);
      break;
    case 2:
      res.TOP = res.BOTTOM = parseInt(splitted[0]);
      res.LEFT = res.RIGHT = parseInt(splitted[1]);
      break;
    case 3:
      res.TOP = parseInt(splitted[0]);
      res.LEFT = res.RIGHT = parseInt(splitted[1]);
      res.BOTTOM = parseInt(splitted[2]);
      break;
    case 4:
      res.TOP = parseInt(splitted[0]);
      res.RIGHT = parseInt(splitted[1]);
      res.BOTTOM = parseInt(splitted[2]);
      res.LEFT = parseInt(splitted[3]);
      break;
    default:
      break;
  }

  return res;
}

function emitSelectedEvent(graph, id) {
  // get selected pies
  const nodeGroups = graph._graphArea.selectAll("g.node-group");
  const filteredNodes = nodeGroups.filter(".-selected");
  const ids = filteredNodes.data().map((datum) => datum.id);
  if (!ids.includes(id)) {
    ids.push(id);
  } else {
    ids.splice(ids.indexOf(id), 1);
  }

  // dispatch event
  graph.element.dispatchEvent(
    new CustomEvent("changeSelectedNodes", {
      detail: ids,
    })
  );
}

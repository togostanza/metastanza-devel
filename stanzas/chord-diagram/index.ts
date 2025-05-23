import * as d3 from "d3";
import {
  appendCustomCss,
  downloadCSVMenuItem,
  downloadJSONMenuItem,
  downloadPngMenuItem,
  downloadSvgMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";
import loadData from "togostanza-utils/load-data";
import getStanzaColors from "../../lib/ColorGenerator";
import MetaStanza from "../../lib/MetaStanza";
import ToolTip from "../../lib/ToolTip";
import { handleApiError } from "../../lib/apiError";
import prepareGraphData from "../../lib/prepareGraphData";
import {
  MarginsI,
  emitSelectedEvent,
  getMarginsFromCSSString,
  toggleSelectIds,
  updateSelectedElementClassNameForD3,
} from "../../lib/utils";
import { drawChordDiagram } from "./drawChordDiagram";
import drawCircleLayout from "./drawCircleLayout";

interface Datum {
  id: string;
}

//log

export default class ChordDiagram extends MetaStanza {
  tooltip: ToolTip;
  _chartArea: d3.Selection<SVGGElement, any, SVGElement, any>;
  selectedIds: Array<string | number> = [];
  selectedEventParams = {
    targetElementSelector: "g.node",
    selectedElementClassName: "-selected",
    selectedElementSelector: ".-selected",
    idPath: "id",
  };

  menu() {
    return [
      downloadSvgMenuItem(this, "graph-2d-force"),
      downloadPngMenuItem(this, "graph-2d-force"),
      downloadJSONMenuItem(this, "graph-2d-force", this._data),
      downloadCSVMenuItem(this, "graph-2d-force", this._data),
      downloadTSVMenuItem(this, "graph-2d-force", this._data),
    ];
  }

  async renderNext() {
    appendCustomCss(this, this.params["togostanza-custom_css_url"]);

    const setFallbackVal = (param, defVal) => {
      return isNaN(parseFloat(this.params[param]))
        ? defVal
        : this.params[param];
    };

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    //data

    const width = parseInt(css("--togostanza-canvas-width"));
    const height = parseInt(css("--togostanza-canvas-height"));

    if (!this._chartArea?.empty()) {
      this._chartArea?.remove();
    }

    const drawContent = async () => {
      const values = await loadData(
        this.params["data-url"],
        this.params["data-type"],
        this.root.querySelector("main")
      );

      this._data = values;

      const nodes = values["nodes"];
      const edges = values["links"];

      const togostanzaColors = getStanzaColors(this);

      const color = function () {
        return d3.scaleOrdinal().range(togostanzaColors);
      };

      const root = this.root.querySelector("main");

      const existingSvg = root.getElementsByTagName("svg")[0];
      if (existingSvg) {
        existingSvg.remove();
      }
      const svg = d3
        .select(root)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      this._chartArea = svg;

      const nodesSortParams = {
        sortBy: this.params["nodes-sort-key"],
        sortOrder: this.params["nodes-sort-order"] || "ascending",
      };

      const nodeSizeParams = {
        isChord: !this.params["node-size-fixed"],
        dataKey: "",
        minSize: 3,
        maxSize: 3,
        scale: "linear",
      };

      const nodeColorParams = {
        dataKey: this.params["node-color_key"] || "",
      };

      const nodeLabelParams = {
        margin: 3,
        dataKey: this.params["node-label_key"],
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

      const tooltipParams = {
        dataKey: this.params["tooltips-key"],
        show: nodes.some((d) => d[this.params["tooltips-key"]]),
      };

      const edgeParams = {
        type: "curve",
        curveStrength: 25,
      };

      const highlightAdjEdges = true;

      const CSSMargins = getMarginsFromCSSString(
        css("--togostanza-canvas-padding")
      );

      const longestLabelWidth = getLongestLabelWidth(
        svg,
        nodes.map((d) => d[nodeLabelParams.dataKey])
      );

      const MARGIN: MarginsI = {
        LEFT: CSSMargins.LEFT + longestLabelWidth + nodeLabelParams.margin,
        RIGHT: CSSMargins.RIGHT + longestLabelWidth + nodeLabelParams.margin,
        TOP: CSSMargins.TOP + longestLabelWidth + nodeLabelParams.margin,
        BOTTOM: CSSMargins.BOTTOM + longestLabelWidth + nodeLabelParams.margin,
      };

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
      if (nodeSizeParams.isChord) {
        drawChordDiagram(svg, prepNodes, prepEdges, { ...params, symbols });
      } else {
        drawCircleLayout(svg, prepNodes, prepEdges, { ...params, symbols });
      }

      this._chartArea
        .selectAll(this.selectedEventParams.targetElementSelector)
        .on("click", (_, d: Datum) => {
          toggleSelectIds({
            selectedIds: this.selectedIds,
            targetId: d.id,
          });
          updateSelectedElementClassNameForD3({
            drawing: this._chartArea,
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
        drawing: this._chartArea,
        selectedIds,
        ...this.selectedEventParams,
      });
    }
  }
}

function getLongestLabelWidth(
  svg: d3.Selection<SVGElement, unknown, null, undefined>,
  labelsArray: string[]
) {
  const labelsG = svg.append("g");

  labelsG
    .selectAll("text")
    .data(labelsArray)
    .join("text")
    .text((d) => d)
    .classed("label", true);
  const width = labelsG.node().getBBox().width;

  labelsG.remove();
  return width;
}

import MetaStanza, { METASTANZA_DATA_ATTR } from "../../lib/MetaStanza";
import {
  select,
  scaleOrdinal,
  scaleLinear,
  stratify,
  format as d3format,
  treemap as d3treemap,
  hierarchy,
  sum,
  interpolate,
} from "d3";
import uid from "./uid";
import getStanzaColors from "@/lib/ColorGenerator";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils"; // from "@/lib/metastanza_utils.js"; //
import shadeColor from "./shadeColor";
import { handleApiError } from "../../lib/apiError";
import treemapBinaryLog from "./treemapBinaryLog";
import { SelectionPlugin } from "../../lib/plugins/SelectionPlugin";

export default class TreeMapStanza extends MetaStanza {
  _chartArea;
  _selectionPlugin;

  menu() {
    return [
      downloadSvgMenuItem(this, "treemap"),
      downloadPngMenuItem(this, "treemap"),
      downloadJSONMenuItem(this, "treemap", this._data),
      downloadCSVMenuItem(this, "treemap", this._data),
      downloadTSVMenuItem(this, "treemap", this._data),
    ];
  }

  async renderNext() {
    this._selectionPlugin = new SelectionPlugin({ stanza: this });
    this.use(this._selectionPlugin);
    if (!this._chartArea?.empty()) {
      this._chartArea?.remove();
    }

    const width = parseInt(this.css("--togostanza-canvas-width"));
    const height = parseInt(this.css("--togostanza-canvas-height"));

    const MARGIN = this.MARGIN;

    const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;
    const HEIGHT = height - MARGIN.TOP - MARGIN.BOTTOM;

    const logScale = false;
    const gapWidth = 2;

    const drawContent = async () => {
      const data = this.__data.asTree({
        nodeLabelKey: this.params["node-label_key"].trim(),
        nodeValueKey: this.params["node-value_key"].trim(),
      }).data;

      // filter out all elements with n=0
      const filteredData = data.filter(
        (item) =>
          (item.children?.length > 0 && !item.value) ||
          (item.value && item.value > 0)
      );

      const treeMapElement = this._main;
      const colorScale = scaleOrdinal(getStanzaColors(this));

      const opts = {
        WIDTH,
        HEIGHT,
        colorScale,
        logScale,
        gapWidth,
      };
      draw(treeMapElement, filteredData, opts, this);
    };

    handleApiError({
      stanzaData: this,
      hasTooltip: true,
      drawContent,
    });
  }
}

/**
 *
 * @param {boolean} logScale - Whether to use log10 scale or not
 * @param {number} value - value to transform
 * @returns
 */
function transformValue(logScale, value) {
  if (!value || value <= 0) {
    return null;
  }

  if (logScale) {
    return Math.log10(value);
  }
  return value;
}

function draw(el, dataset, opts, stanza) {
  const { WIDTH, HEIGHT, logScale, colorScale, gapWidth } = opts;
  const colorKey = stanza.params["node-color_key"]?.trim();

  const nested = stratify()
    .id(function (d) {
      return d.id;
    })
    .parentId(function (d) {
      return d.parent;
    })(dataset);

  // Height of upper "root" element tile
  const rootHeight = getLineHeight(el) * 1.3;

  // Height of the rest chart
  let adjustedHeight = HEIGHT - rootHeight;

  if (adjustedHeight < 0) {
    adjustedHeight = 10;
  }

  const x = scaleLinear().rangeRound([0, WIDTH]);
  const y = scaleLinear().rangeRound([0, adjustedHeight]);

  // make path-like string for node
  const name = (d) => {
    if (d.data.data.id === -1) {
      return "> ";
    }
    return d
      .ancestors()
      .reverse()
      .map((d) => {
        return d.data.data.label;
      })
      .join(" > ");
  };

  const format = d3format(",d");

  //move and scale children nodes to fit into parent nodes
  function tile(node, x0, y0, x1, y1) {
    treemapBinaryLog(node, 0, 0, WIDTH, adjustedHeight);
    for (const child of node.children) {
      child.x0 = x0 + (child.x0 / WIDTH) * (x1 - x0);
      child.x1 = x0 + (child.x1 / WIDTH) * (x1 - x0);
      child.y0 = y0 + (child.y0 / adjustedHeight) * (y1 - y0);
      child.y1 = y0 + (child.y1 / adjustedHeight) * (y1 - y0);
    }
  }

  const treemap = (data) =>
    d3treemap().tile(tile)(
      hierarchy(data)
        .sum((d) => d.data.value)
        .sort((a, b) => b.value - a.value)
        .each((d) => {
          d.value2 = transformValue(logScale, d.value);
        })
    );

  const SVG_PADDING = 5; // TODO check if this should be one of the parameters
  select(el).select("svg").remove();
  stanza._chartArea = select(el)
    .append("svg")
    .attr("width", WIDTH + SVG_PADDING * 2)
    .attr("height", HEIGHT + SVG_PADDING * 2)
    .attr("viewBox", [
      -SVG_PADDING,
      -SVG_PADDING,
      WIDTH + SVG_PADDING * 2,
      HEIGHT + SVG_PADDING * 2,
    ]);

  let group = stanza._chartArea.append("g").call(render, treemap(nested), null);

  function render(group, root, zoomInOut) {
    group
      .append("rect")
      .classed("container", true)
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", WIDTH)
      .attr("height", HEIGHT);

    const node = group
      .selectAll("g")
      .data(root.children.concat(root))
      .join("g");

    let timeout;
    node
      .attr("cursor", "pointer")
      .filter((d) => {
        return d === root ? d.parent : d.children;
      })
      .on("dblclick", (e, d) => {
        clearTimeout(timeout);
        d === root ? zoomout(root) : zoomin(d);
      });

    node
      .append("title")
      .text((d) =>
        d === root
          ? ""
          : `${name(d)}\n${
              d?.children
                ? format(sum(d, (d) => d?.data?.data.value || 0))
                : d.data.data.value
            }`
      );

    node
      .append("rect")
      .classed("selectable", true)
      .classed("breadcrumb", (d) => d === root)
      .attr(METASTANZA_DATA_ATTR, (d) => d.data?.data?.id?.toString())
      .attr("id", (d) => (d.leafUid = uid("leaf")).id)
      .attr("style", (d) => {
        if (d === root) {
          return `fill: var(--togostanza-theme-background_color)`;
        }

        if (colorKey && d.data.data[colorKey]) {
          return `fill: ${d.data.data[colorKey]}`;
        }
        return `fill: ${colorScale(d.data.data.label)}`;
      });

    //Add inner nodes to show that it's a zoomable tile
    const innerNode = node
      .filter((d) => {
        return d !== root && d.children;
      })
      .selectAll("g")
      .data((d) => d.children)
      .join("g");

    innerNode
      .append("rect")
      .classed("selectable", true)
      .attr(METASTANZA_DATA_ATTR, (d) => d.data.data.id.toString())
      .attr("id", (d) => (d.leafUid = uid("leaf")).id)
      .attr("fill", "none")
      .attr("stroke-width", 1)
      .attr("stroke", (d) => {
        let baseColor;
        if (colorKey && d.parent.data.data[colorKey]) {
          // Use custom color from data directly
          baseColor = d.parent.data.data[colorKey];
        } else {
          // Get the CSS variable string and extract just the variable name inside var()
          const cssVariable = colorScale(d.parent.data.data.label);
          const varName = cssVariable.substring(
            cssVariable.indexOf("(") + 1,
            cssVariable.lastIndexOf(")")
          );
          baseColor = stanza.css(varName);
        }
        return shadeColor(baseColor, -15);
      });

    innerNode
      .append("clipPath")
      .attr("id", (d) => (d.clipUid = uid("clip")).id)
      .append("use")
      .attr("href", (d) => d.leafUid.href);

    //add clip paths to nodes to trim text
    node
      .append("clipPath")
      .attr("id", (d) => (d.clipUid = uid("clip")).id)
      .append("use")
      .attr("href", (d) => d.leafUid.href);

    //add text contents
    node
      .append("text")
      .attr("clip-path", (d) => d.clipUid)
      .attr("y", "1.5em")
      .attr("x", (d) => (d === root ? "0.2em" : "1em"))
      .text((d) => {
        if (d === root) {
          return name(d);
        } else {
          return `${d.data.data.label || ""}`;
        }
      });

    //adjust rectangles positions
    group.call(position, root, true, zoomInOut);
  }

  //function to wrap long text in svg
  function wrap(root, isFirstRender, zoomInOut, d, i, nodes) {
    // on positioning elements that are about to display

    if (isFirstRender) {
      let lineSeparator;

      //nodes[i] is rect
      const text = select(nodes[i].parentNode).select("text");

      if (text.empty()) {
        return;
      }

      const isRoot = d === root;

      let maxWidth;
      if (isRoot) {
        lineSeparator = /(?=[/])/g;
        maxWidth = WIDTH;
      } else {
        lineSeparator = /\s+/;
        maxWidth = WIDTH / 6;
      }

      const words = text.text().split(lineSeparator).reverse();

      let word,
        line = [],
        lineNumber = 0;
      const lineHeight = 1.15, // rems
        x = text.attr("x") || 0,
        y = text.attr("y") || 0,
        dy = 0;

      let tspan = text
        .text(null)
        .append("tspan")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", dy + "em");

      while ((word = words.pop())) {
        line.push(word);

        tspan.text(line.join(isRoot ? "" : " "));
        if (tspan.node().getComputedTextLength() > maxWidth - 5) {
          if (isRoot) {
            line.shift();
            line[0] = `..${line[0]}`;
            tspan.text(line.join(""));
          } else {
            if (line.length < 2) {
              continue;
            }
            line.pop();
            tspan.text(line.join(" "));
            line = [word];

            //set tspan to last added tspan and append word that didnt fit
            tspan = text
              .append("tspan")
              .attr("x", "1em")
              .attr("y", y)
              .attr("dy", ++lineNumber * lineHeight + dy + "em")
              .text(word);
          }
        }
      }

      text
        .append("tspan")
        .attr("class", "number-label")
        .attr("dy", "1.6em")
        .attr("x", "1.6em")
        .text((d) => format(sum(d, (d) => d?.data?.data.value || 0)));
    }
  }

  //place elements according to data
  function position(group, root, isFirstRender, zoomInOut) {
    const a = group.selectAll("g").attr("transform", (d) => {
      if (d === root) {
        return `translate(0,0)`;
      } else if (d.parent !== root) {
        return `translate(${x(d.x0) - x(d.parent.x0)},${
          y(d.y0) - y(d.parent.y0)
        })`;
      } else {
        return `translate(${x(d.x0) + gapWidth},${
          y(d.y0) + rootHeight + gapWidth
        })`;
      }
    });

    a.select("rect")
      .attr("width", (d) => {
        if (d === root) {
          return WIDTH;
        } else if (x(d.x1) === WIDTH) {
          if (x(d.x1) - x(d.x0) - 2 * gapWidth < 0) {
            return 0;
          }
          return x(d.x1) - x(d.x0) - 2 * gapWidth;
        } else {
          if (x(d.x1) - x(d.x0) - gapWidth < 0) {
            return 0;
          }
          return x(d.x1) - x(d.x0) - gapWidth;
        }
      })
      .attr("height", (d) => {
        if (d === root) {
          return rootHeight;
        } else if (y(d.y1) === adjustedHeight) {
          if (y(d.y1) - y(d.y0) - 2 * gapWidth < 0) {
            return 0;
          }
          return y(d.y1) - y(d.y0) - 2 * gapWidth;
        } else {
          if (y(d.y1) - y(d.y0) - gapWidth < 0) {
            return 0;
          }
          return y(d.y1) - y(d.y0) - gapWidth;
        }
      })
      .each(wrap.bind(this, root, isFirstRender, zoomInOut));
  }

  // When zooming in, draw the new nodes on top, and fade them in.
  function zoomin(d) {
    const group0 = group.attr("pointer-events", "none");
    const group1 = (group = stanza._chartArea
      .append("g")
      .call(render, d, "zoomin"));

    //re-define domain for scaling

    x.domain([d.x0, d.x1]);
    y.domain([d.y0, d.y1]);

    stanza._chartArea
      .transition()
      .duration(750)
      .call((t) => {
        return group0.transition(t).remove().call(position, d.parent, false);
      })

      .call((t) =>
        group1
          .transition(t)
          .attrTween("opacity", () => interpolate(0, 1))
          .call(position, d, false)
      );
  }

  // When zooming out, draw the old nodes on top, and fade them out.
  function zoomout(d) {
    const group0 = group.attr("pointer-events", "none");
    const group1 = (group = stanza._chartArea
      .insert("g", "*")
      .call(render, d.parent, "zoomout"));

    x.domain([d.parent.x0, d.parent.x1]);
    y.domain([d.parent.y0, d.parent.y1]);

    stanza._chartArea
      .transition()
      .duration(750)
      .call((t) =>
        group0
          .transition(t)
          .remove()
          .attrTween("opacity", () => interpolate(1, 0))
          .call(position, d, false)
      )
      .call((t) => group1.transition(t).call(position, d.parent, false));
  }
}

// Get text line height
function getLineHeight(el) {
  var temp = document.createElement(el.nodeName),
    ret;
  temp.setAttribute(
    "style",
    "margin:0; padding:0; " +
      "font-family:" +
      (el.style.fontFamily || "inherit") +
      "; " +
      "font-size:" +
      (el.style.fontSize || "inherit")
  );
  temp.innerHTML = "A";

  el.parentNode.appendChild(temp);
  ret = temp.clientHeight;
  temp.parentNode.removeChild(temp);

  return ret;
}

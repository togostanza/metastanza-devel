import MetaStanza from "../../lib/MetaStanza";
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
import treemapBinaryLog from "./treemapBinaryLog";

export default class TreeMapStanza extends MetaStanza {
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
    const width = parseInt(this.css("--togostanza-canvas-width"));
    const height = parseInt(this.css("--togostanza-canvas-height"));
    const MARGIN = this.MARGIN;

    const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;
    const HEIGHT = height - MARGIN.TOP - MARGIN.BOTTOM;

    const logScale = this.params["node-log_scale"];
    const gapWidth = 2;

    const labelKey = this.params["node-label_key"];
    const valueKey = this.params["node-value_key"];

    const data = this._data;

    // filter out all elements with n=0
    const filteredData = data.filter(
      (item) =>
        (item.children && !item[valueKey]) ||
        (item[valueKey] && item[valueKey] > 0)
    );

    //Add root element if there are more than one elements without parent. D3 cannot process data with more than one root elements
    const rootElems = filteredData
      .map((d, i) => ({
        d,
        i,
      }))
      .filter((d) => !d.d.parent)
      .map((d) => d.i);

    if (rootElems.length > 1) {
      filteredData.push({ id: -1, value: "", label: "" });

      rootElems.forEach((index) => {
        filteredData[index].parent = -1;
      });
    }

    if (!filteredData.find((d) => d.id === -1)) {
      filteredData.push({ id: -1, value: "", label: "" });
    }
    const treeMapElement = this._main;
    const colorScale = scaleOrdinal(getStanzaColors(this));

    const opts = {
      WIDTH,
      HEIGHT,
      colorScale,
      logScale,
      gapWidth,
      labelKey,
      valueKey,
    };

    draw(treeMapElement, filteredData, opts);
  }
}

function transformValue(logScale, value) {
  if (!value || value <= 0) {
    return null;
  }

  if (logScale) {
    return Math.log10(value);
  }
  return value;
}

function draw(el, dataset, opts) {
  const { WIDTH, HEIGHT, logScale, colorScale, gapWidth, labelKey, valueKey } =
    opts;

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
        return d.data.data[labelKey];
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
        .sum((d) => d.data[valueKey])
        .sort((a, b) => b.value - a.value)
        .each((d) => {
          d.value2 = transformValue(logScale, d.value);
        })
    );

  select(el).select("svg").remove();
  const svg = select(el)
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    .attr("viewBox", [0, 0, WIDTH, HEIGHT]);

  let group = svg.append("g").call(render, treemap(nested), null);

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

    node
      .filter((d) => {
        console.log(d);
        return d === root ? d.parent : d.children;
      })
      .attr("cursor", "pointer")
      .on("click", (_, d) => (d === root ? zoomout(root) : zoomin(d)));

    node
      .append("title")
      .text((d) =>
        d === root
          ? ""
          : `${name(d)}\n${
              d?.children
                ? format(sum(d, (d) => d?.data?.data[valueKey] || 0))
                : d.data.data[valueKey]
            }`
      );

    node
      .append("rect")
      .attr("id", (d) => (d.leafUid = uid("leaf")).id)
      .attr("style", (d) => {
        return `fill: ${
          d === root
            ? "var(--togostanza-theme-background_color)"
            : colorScale(d.data.data[labelKey])
        }`;
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
      .attr("id", (d) => (d.leafUid = uid("leaf")).id)
      .attr("fill", "none")
      .attr("stroke-width", 1)
      .attr("stroke", (d) =>
        shadeColor(colorScale(d.parent.data.data[labelKey]), -15)
      );

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
          return `${d.data.data[labelKey] || ""}`;
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
        .text((d) => format(sum(d, (d) => d?.data?.data[valueKey] || 0)));
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
    const group1 = (group = svg.append("g").call(render, d, "zoomin"));

    //re-define domain for scaling

    x.domain([d.x0, d.x1]);
    y.domain([d.y0, d.y1]);

    svg
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
    const group1 = (group = svg
      .insert("g", "*")
      .call(render, d.parent, "zoomout"));

    x.domain([d.parent.x0, d.parent.x1]);
    y.domain([d.parent.y0, d.parent.y1]);

    svg
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

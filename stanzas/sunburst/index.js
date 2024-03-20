import MetaStanza from "../../lib/MetaStanza";
import {
  select,
  scaleOrdinal,
  stratify,
  format,
  hierarchy,
  sum,
  max,
  interpolate,
  partition as d3partition,
  arc as d3arc,
  path as d3path,
} from "d3";
import getStanzaColors from "../../lib/ColorGenerator";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";
import {
  toggleSelectIds,
  emitSelectedEvent,
  updateSelectedElementClassNameForD3,
} from "../../lib/utils";

let path;

export default class Sunburst extends MetaStanza {
  _chartArea;
  selectedIds = [];
  selectedEventParams = {
    targetElementSelector: "g path.selectable",
    selectedElementClassName: "-selected",
    idPath: "data.data.__togostanza_id__",
  };

  constructor(...args) {
    super(...args);
    this.state = {
      currentId: null,
    };
  }

  menu() {
    return [
      downloadSvgMenuItem(this, "sunburst"),
      downloadPngMenuItem(this, "sunburst"),
      downloadJSONMenuItem(this, "sunburst", this._data),
      downloadCSVMenuItem(this, "sunburst", this._data),
      downloadTSVMenuItem(this, "sunburst", this._data),
    ];
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
        selectedIds: event.detail.selectedIds,
        targetId: event.detail.targetId,
        ...this.selectedEventParams,
      });
    }

    // event.stopPropagation();
    // TODO not sure the purpose of this code
    // if (event.target !== this.element) {
    //   this.state.currentId = "" + event.detail.id;
    // }
  }

  async renderNext() {
    /* eslint-disable @typescript-eslint/no-this-alias */
    const that = this;
    this.state = new Proxy(this.state, {
      set(target, key, value) {
        if (key === "currentId") {
          updateId(getNodeById(value), that);
        }
        return Reflect.set;
      },
      get: Reflect.get,
    });

    const dispatchEvent = (value) => {
      dispatcher.dispatchEvent(
        new CustomEvent("selectedDatumChanged", {
          detail: { id: "" + value },
        })
      );
    };

    const state = this.state;
    const dispatcher = this.element;
    const main = this._main;
    const data = this._data;

    // get value of css vars
    const width = parseFloat(this.css("--togostanza-canvas-width"));
    const height = parseFloat(this.css("--togostanza-canvas-height"));
    const padding = this.MARGIN;

    const valueKey = this.params["node-value_key"].trim();
    const labelKey = this.params["node-label_key"].trim();
    const showNumbers = this.params["node-values_visible"];
    const borderWidth = this.params["node-levels_gap_width"] || 2;
    const nodesGapWidth = this.params["node-gap_width"] || 8;
    const cornerRadius = this.params["node-corner_radius"] || 0;
    const scalingMethod = this.params["scaling"] || "By value";
    let depthLim =
      parseFloat(this.params["max_depth"]) > 0
        ? parseFloat(this.params["max_depth"])
        : 1;

    const color = scaleOrdinal(getStanzaColors(this));

    data.forEach((node) => {
      node.id = "" + node.id;
      if (node?.children) {
        node.children = node.children.map((child) => "" + child);
      }
      if (node?.parent) {
        node.parent = "" + node.parent;
      }
    });

    //Add root element if there are more than one elements without parent. D3 cannot process data with more than one root elements
    const rootElemIndexes = [];
    data.forEach((node, index) => {
      if (!node.parent) {
        rootElemIndexes.push(index);
      }
    });

    if (rootElemIndexes.length > 1 || !data.find((item) => item.id === "-1")) {
      const rootElem = {
        id: "-1",
        value: "",
      };
      data.push(rootElem);

      rootElemIndexes.forEach((index) => {
        data[index].parent = rootElem.id;
      });
    }

    const dataset = data.filter(
      (item) =>
        (item.children && !item[valueKey]) ||
        (item[valueKey] && item[valueKey] > 0) ||
        item.id === "-1"
    );

    const stratifiedData = stratify()
      .id(function (d) {
        return d.id;
      })
      .parentId(function (d) {
        return d.parent;
      })(dataset);

    const formatNumber = format(",d");

    const partition = (data) => {
      const root = hierarchy(data);
      switch (scalingMethod) {
        case "By value":
          root.sum((d) => d.data[valueKey]);
          break;
        case "Equal children":
          root.sum((d) => (d.children ? 0 : 1));
          break;
        case "Equal parents":
          root.each(
            (d) =>
              (d.value = d.parent
                ? d.parent.value / d.parent.children.length
                : 1)
          );
          break;
      }

      root
        .sort((a, b) => b.value - a.value)
        // store real values for number labels in d.value2
        .each((d) => (d.value2 = sum(d, (dd) => dd.data.data[valueKey])));
      return d3partition().size([2 * Math.PI, root.height + 1])(root);
    };

    const root = partition(stratifiedData);

    root.each((d) => (d.current = d));

    // if depthLim 0 of negative, show all levels
    const maxDepth = max(root, (d) => d.depth);
    if (depthLim <= 0 || depthLim > maxDepth) {
      depthLim = maxDepth;
    }

    const radius =
      Math.min(
        width - padding.LEFT - padding.RIGHT,
        height - padding.TOP - padding.BOTTOM
      ) /
      ((depthLim + 1) * 2);

    if (
      padding.LEFT + padding.RIGHT >= width ||
      padding.TOP + padding.BOTTOM >= height
    ) {
      main.innerHTML = "<p>Padding is too big for given width and height!</p>";
      throw new Error("Padding is too big for given width and height!");
    }

    const arc = d3arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle((d) => Math.min((d.x1 - d.x0) / 2, nodesGapWidth / 500))
      .padRadius(radius * 1.5)
      .innerRadius((d) => d.y0 * radius)
      .outerRadius((d) =>
        Math.max(d.y0 * radius, d.y1 * radius - borderWidth / 2)
      )
      .cornerRadius(cornerRadius);

    const middleArcLabelLine = (d) => {
      const halfPi = Math.PI / 2;
      const angles = [d.x0 - halfPi, d.x1 - halfPi];
      let r = Math.max(0, (d.y1 - (d.y1 - d.y0) / 2.5) * radius);

      const middleAngle = (angles[1] + angles[0]) / 2;
      const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
      if (invertDirection) {
        r = Math.max(0, (d.y0 + (d.y1 - d.y0) / 2.5) * radius);
        angles.reverse();
      }

      if (Math.abs(angles[1] - angles[0]) > Math.PI && d.y0 < 1) {
        angles[0] = middleAngle + Math.PI / 2;
        angles[1] = middleAngle - Math.PI / 2;

        r = Math.max(0, (d.y1 - (d.y1 - d.y0) / 5) * radius);
      }

      const path = d3path();
      path.arc(0, 0, r, angles[0], angles[1], invertDirection);
      return path.toString();
    };

    const middleArcNumberLine = (d) => {
      const halfPi = Math.PI / 2;
      const angles = [d.x0 - halfPi, d.x1 - halfPi];
      let r = Math.max(0, (d.y0 + (d.y1 - d.y0) / 2.5) * radius);

      const middleAngle = (angles[1] + angles[0]) / 2;
      const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
      if (invertDirection) {
        r = Math.max(0, (d.y1 - (d.y1 - d.y0) / 2.5) * radius);

        angles.reverse();
      }

      if (Math.abs(angles[1] - angles[0]) > Math.PI && d.y0 < 1) {
        r = Math.max(0, (d.y1 - (d.y1 - d.y0) / 2.5) * radius);
      }

      const path = d3path();
      path.arc(0, 0, r, angles[0], angles[1], invertDirection);
      return path.toString();
    };

    function textFits(d, charWidth, text) {
      if (!text || !text.length) {
        return true;
      }
      const deltaAngle = d.x1 - d.x0;
      const r = Math.max(0, ((d.y0 + d.y1) * radius) / 2);
      const perimeter = r * deltaAngle;

      return text.length * charWidth < perimeter;
    }

    select(main).select("svg").remove();
    this._chartArea = select(main)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`);

    //Get character width
    const testText = this._chartArea
      .append("g")
      .attr("class", "labels")
      .append("text")
      .text("a");
    const CHAR_SPACE = testText.node().getComputedTextLength();
    testText.remove();

    const g = this._chartArea.append("g");

    path = g
      .append("g")
      .selectAll("path")
      .data(root.descendants())
      .join("path")
      .classed("selectable", true)
      .attr("fill", (d) => {
        while (d.depth > 1) {
          d = d.parent;
        }
        if (d.data.data.id === "-1") {
          return "none";
        }

        return color(d.data.data.id);
      })
      .attr("fill-opacity", (d) =>
        arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0
      )
      .attr("d", (d) => arc(d.current));

    let timeout;

    path
      .style("cursor", "pointer")
      .on("click", (e, d) => {
        if (e.detail === 1) {
          timeout = setTimeout(() => {
            toggleSelectIds({
              selectedIds: this.selectedIds,
              targetId: d.data.data.__togostanza_id__,
            });
            updateSelectedElementClassNameForD3({
              drawing: this._chartArea,
              selectedIds: this.selectedIds,
              ...this.selectedEventParams,
            });
            if (this.params["event-outgoing_change_selected_nodes"]) {
              emitSelectedEvent({
                rootElement: this.element,
                targetId: d.data.data.__togostanza_id__,
                selectedIds: this.selectedIds,
                ...this.selectedEventParams,
                dataUrl: this.params["data-url"],
              });
            }
          }, 500);
        }
      })
      .filter((d) => d.children)
      .on("dblclick", (e, d) => {
        clearTimeout(timeout);
        clicked(e, d);
      });

    path.append("title").text((d) => {
      return `${d
        .ancestors()
        .map((d) => d.data.data[labelKey])
        .reverse()
        .join("/")}\n${formatNumber(d.value2)}`;
    });

    //add hidden arcs for text
    const textArcs = g
      .append("g")
      .selectAll("path")
      .data(root.descendants().slice(1))
      .join("path")
      .attr("class", "hidden-arc")
      .attr("id", (_, i) => `hiddenLabelArc${i}`)
      .attr("d", middleArcLabelLine);

    //For numbers
    const numArcs = g
      .append("g")
      .selectAll("path")
      .data(root.descendants().slice(1))
      .join("path")
      .attr("class", "hidden-arc")
      .attr("id", (_, i) => `hiddenNumberArc${i}`)
      .attr("d", middleArcNumberLine);

    // Center circle
    const parent = g
      .append("circle")
      .datum(root)
      .attr("r", radius - borderWidth / 2)
      .attr("fill", "none")
      .attr("pointer-events", "all");

    //Text labels
    const textLabels = g
      .append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(root.descendants().slice(1))
      .join("text")
      .attr(
        "fill-opacity",
        (d) =>
          +(labelVisible(d) && textFits(d, CHAR_SPACE, d.data.data[labelKey]))
      )
      .append("textPath")
      .attr("startOffset", "50%")
      .attr("href", (_, i) => `#hiddenLabelArc${i}`)
      .text((d) => d.data.data[labelKey]);

    //Number labels
    const numLabels = g
      .append("g")
      .attr("class", "numbers")
      .selectAll("text")
      .data(root.descendants().slice(1))
      .join("text")
      //Show only if label is supposed to be shown, label text fits into node and showNumbers =true
      .attr(
        "fill-opacity",
        (d) =>
          +(
            labelVisible(d) &&
            textFits(d, CHAR_SPACE, d.data.data[labelKey]) &&
            showNumbers
          )
      )
      .append("textPath")
      .attr("startOffset", "50%")
      .attr("href", (_, i) => `#hiddenNumberArc${i}`)
      .text((d) => formatNumber(d.value2));

    function clicked(_e, p) {
      state.currentId = p.data.data.id;

      dispatchEvent(p.data.data.id);
    }

    function getNodeById(id) {
      return root.descendants().find((d) => d.data.data.id === id);
    }

    function updateId(p, stanza) {
      if (!arcVisible(p.current) && p.current.y1 > 1) {
        return;
      }

      parent.datum(p.parent ? p : root);

      parent.attr("cursor", (d) => (d === root ? "auto" : "pointer"));

      root.each(
        (d) =>
          (d.target = {
            x0:
              Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
              2 *
              Math.PI,
            x1:
              Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
              2 *
              Math.PI,
            y0: Math.max(0, d.y0 - p.depth),
            y1: Math.max(0, d.y1 - p.depth),
          })
      );

      const t = g.transition().duration(750);

      // Transition the data on all arcs, even the ones that aren’t visible,
      // so that if this transition is interrupted, entering arcs will start
      // the next transition from the desired position.
      path
        .transition(t)
        .tween("data", (d) => {
          const i = interpolate(d.current, d.target);
          return (t) => (d.current = i(t));
        })
        .filter(function (d) {
          return +this.getAttribute("fill-opacity") || arcVisible(d.target);
        })
        .attr("fill-opacity", (d) =>
          arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0
        )
        .attr("cursor", (d) =>
          d.children && arcVisible(d.target) ? "pointer" : "auto"
        )

        .attrTween("d", (d) => () => arc(d.current));

      parent.transition(t).attr("fill", () => {
        let b = p;
        while (b.depth > 1) {
          b = b.parent;
        }

        return b.data?.data?.[labelKey]
          ? color(b.data.data.id)
          : "rgba(0,0,0,0)";
      });

      textLabels
        .filter(function (d) {
          return +this.getAttribute("fill-opacity") || +labelVisible(d.target);
        })
        .transition(t)
        .attr(
          "fill-opacity",
          (d) =>
            +(
              labelVisible(d.target) &&
              textFits(d.target, CHAR_SPACE, d.data.data[labelKey])
            )
        );

      textArcs
        .transition(t)
        .attrTween("d", (d) => () => middleArcLabelLine(d.current));

      numLabels
        .filter(function (d) {
          return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        })
        .transition(t)
        .attr(
          "fill-opacity",
          (d) =>
            +(
              labelVisible(d.target) &&
              textFits(d.target, CHAR_SPACE, d.data.data[labelKey]) &&
              showNumbers
            )
        );

      numArcs
        .transition(t)
        .attrTween("d", (d) => () => middleArcNumberLine(d.current));

      const isBlankRoot = p.data.id === "-1";
      if (isBlankRoot) {
        parent.on("click", null).on("dblclick", null);
      } else {
        parent
          .on("click", (e, d) => {
            if (e.detail === 1) {
              timeout = setTimeout(() => {
                const selectedIds = stanza.selectedIds;
                const targetId = d.data.data.__togostanza_id__;

                return emitSelectedEvent({
                  drawing: stanza._chartArea,
                  rootElement: stanza.element,
                  targetId,
                  selectedIds,
                  ...stanza.selectedEventParams,
                });
              }, 500);
            }
          })
          .on("dblclick", (e, d) => {
            clearTimeout(timeout);
            clicked(e, d.parent);
          });
      }
    }

    function arcVisible(d) {
      return d.y1 <= depthLim + 1 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible(d) {
      return d.y1 <= depthLim + 1 && d.y0 >= 0;
    }

    if (this._apiError) {
      this._chartArea?.remove();
      this._chartArea = null;
    } else {
      const errorMessageEl = this._main.querySelector(
        ".metastanza-error-message-div"
      );
      if (errorMessageEl) {
        errorMessageEl.remove();
      }
    }
  }
}

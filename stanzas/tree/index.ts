import { getCirculateColor } from "../../lib/ColorGenerator";
import {
  cluster,
  linkHorizontal,
  linkRadial,
  linkVertical,
  max,
  min,
  scaleSqrt,
  select,
  stratify,
  tree,
} from "d3";
import { HierarchyNode, HierarchyLink } from "d3-hierarchy";
import {
  downloadCSVMenuItem,
  downloadJSONMenuItem,
  downloadPngMenuItem,
  downloadSvgMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";
import MetaStanza from "../../lib/MetaStanza";
import {
  emitSelectedEvent,
  toggleSelectIds,
  updateSelectedElementClassNameForD3,
} from "../../lib/utils";
import ToolTip from "../../lib/ToolTip";

//Declaring constants
// const ASCENDING = "ascending";
// const DESCENDING = "descending";
const HORIZONTAL = "horizontal";
const VERTICAL = "vertical";
const RADIAL = "radial";
const COLOR_MODES = {
  translucent: { property: "opacity", value: "0.5" },
  multiply: { property: "mix-blend-mode", value: "multiply" },
  screen: { property: "mix-blend-mode", value: "screen" },
};

interface NodeData {
  id: number;
  label: string;
  group: string;
  order?: number;
  description?: string;
  url?: string;
  parent?: number;
  value?: number;
  children?: number[];
  originalData?: Record<string, any>;
}

interface ExtendedHierarchyNode extends HierarchyNode<NodeData> {
  x?: number;
  x0?: number;
  y?: number;
  y0?: number;
  _children?: ExtendedHierarchyNode[] | null;
}

export default class Tree extends MetaStanza {
  _chartArea: d3.Selection<SVGGElement, unknown, SVGElement, undefined>;
  selectedIds: Array<string | number> = [];
  selectedEventParams = {
    targetElementSelector: "g.labels g",
    selectedElementClassName: "-selected",
    idPath: "data.id",
  };
  tooltips: ToolTip;

  //Stanza download menu contents
  menu() {
    return [
      downloadSvgMenuItem(this, "tree"),
      downloadPngMenuItem(this, "tree"),
      downloadJSONMenuItem(this, "tree", this._data),
      downloadCSVMenuItem(this, "tree", this._data),
      downloadTSVMenuItem(this, "tree", this._data),
    ];
  }

  async renderNext() {
    if (!this._chartArea?.empty()) {
      this._chartArea?.remove();
    }

    //Define from params
    const nodeGroupKey = this.params["node-color_group"].trim();
    const width = parseFloat(this.css("--togostanza-canvas-width")) || 0;
    const height = parseFloat(this.css("--togostanza-canvas-height")) || 0;
    const minRadius = this.params["node-size_min"] / 2;
    const maxRadius = this.params["node-size_max"] / 2;
    const colorMode = this.params["node-color_blend"];
    // const sortOrder = this.params["sort-order"];

    const root = this._main;

    const dataset: NodeData[] = this.__data.asTree({
      nodeLabelKey: this.params["node-label_key"].trim(),
      nodeColorKey: this.params["node-color_key"].trim(),
      nodeGroupKey,
      // nodeOrderKey: this.params["sort-key"].trim(),
      nodeValueKey: this.params["node-size_key"].trim(),
      nodeDescriptionKey: this.params["tooltip"].trim(),
    }).data as NodeData[];
    const padding = this.MARGIN;
    const isLeafNodesAlign = this.params["layout-align_leaf_nodes"];
    const layout = this.params["layout-orientation"];
    const labelMargin = this.params["node-label_margin"];
    const aveRadius = (minRadius + maxRadius) / 2;
    const colorGroup = nodeGroupKey; // NOTE Actually, this variable is not needed (because asTree does the property name conversion), but since we cannot remove this variable without changing the getCirculateColor interface, we have left it in.

    let colorModeProperty, colorModeValue;

    // Set color mode
    if (COLOR_MODES[colorMode]) {
      ({ property: colorModeProperty, value: colorModeValue } =
        COLOR_MODES[colorMode]);
    }

    // Tooltip
    const tooltipString = this.params["tooltip"].trim();

    const mergedDataset = dataset.map((item) => {
      const original = this.__data.data.find((d) => d.id === item.id);
      return {
        ...item,
        originalData: original, // idが同じoriginalのプロパティを追加
      };
    });

    // Sort機能を使用しなくなったため、コメントアウト
    // Sorting by user keywords
    // const orderSym = Symbol("order");
    // dataset.forEach((datum, index) => {
    //   datum[orderSym] = index;
    // });

    // const reorder = (
    //   a: HierarchyNode<NodeData>,
    //   b: HierarchyNode<NodeData>
    // ) => {
    //   if (a.data.order && b.data.order) {
    //     return sortOrder === ASCENDING
    //       ? a.data.order - b.data.order
    //       : b.data.order - a.data.order;
    //   }
    //   return sortOrder === DESCENDING ? b.data[orderSym] - a.data[orderSym] : 0;
    // };

    const drawContent = async () => {
      //Hierarchize data
      const treeRoot = stratify<NodeData>()
        .id((d) => String(d.id))
        .parentId((d) => (d.parent !== undefined ? String(d.parent) : null))(
        mergedDataset
      ) as ExtendedHierarchyNode;
      // .sort(reorder) ;

      const treeDescendants = treeRoot.descendants() as ExtendedHierarchyNode[];
      const data = treeDescendants.slice(1);

      // Setting node size
      const nodeSizeMin = min(data, (d) => d.data.value);
      const nodeSizeMax = max(data, (d) => d.data.value);

      const radiusScale = scaleSqrt()
        .domain([nodeSizeMin, nodeSizeMax])
        .range([minRadius, maxRadius]);

      const nodeRadius = (size) => {
        return size ? radiusScale(size) : radiusScale(nodeSizeMin);
      };

      //Toggle display/hide of children
      const toggle = (d) => {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
      };

      //Setting color scale
      const colorDatas = [];
      treeDescendants.forEach((d) => {
        colorDatas.push(d.data);
      });

      const getColor = getCirculateColor(this, colorDatas, colorGroup);

      const setColor = (d) => {
        if (d.data.color) {
          return d.data.color;
        } else {
          return d.data.group
            ? getColor.groupColor(d.data.group)
            : getColor.stanzaColors[0];
        }
      };

      const svgWidth = width - padding.LEFT - padding.RIGHT;
      const svgHeight = height - padding.TOP - padding.BOTTOM;

      // Append tooltips
      if (tooltipString) {
        if (!this.tooltips) {
          this.tooltips = new ToolTip();
          root.append(this.tooltips);
        }
        this.tooltips.setTemplate(tooltipString);
      }

      //Setting svg area
      select(root).select("svg").remove();
      this._chartArea = select(root)
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

      //Get width of root label
      const rootGroup = this._chartArea
        .append("text")
        .text(treeDescendants[0].data.label || "");
      const rootLabelWidth = rootGroup.node().getBBox().width;
      rootGroup.remove();

      //Get width of the largest label at the lowest level
      const maxDepth = max(data, (d) => d.depth);
      const labels = [];
      for (const n of data) {
        n.depth === maxDepth ? labels.push(n.data.label || "") : "";
      }
      const maxLabelGroup = this._chartArea.append("g");
      maxLabelGroup
        .selectAll("text")
        .data(labels)
        .enter()
        .append("text")
        .text((d) => d);
      const maxLabelWidth = maxLabelGroup.node().getBBox().width;
      maxLabelGroup.remove();

      //Create each group
      const g = this._chartArea.append("g");
      const gCircles = g.append("g").attr("class", "circles");
      const gLabels = g.append("g").attr("class", "labels");

      //Draw function
      const draw = (
        margin = {
          top: 0,
          right: maxLabelWidth + labelMargin,
          bottom: 0,
          left: rootLabelWidth + labelMargin,
        }
      ) => {
        //Error handling
        const errorMessage = root.querySelector(`.error-message`);
        if (errorMessage) {
          root.removeChild(errorMessage);
        }
        switch (layout) {
          case HORIZONTAL:
            if (width - margin.right - margin.left < 0) {
              handleError("width-error", "width is too small!");
            }
            break;
          case VERTICAL:
            if (height - margin.left - margin.right < 0) {
              handleError("heigth-error", "height is too small!");
            }
            break;
        }
        if (
          Math.max(maxRadius, minRadius) * 2 >= width ||
          Math.max(maxRadius, minRadius) * 2 >= height
        ) {
          handleError(
            "node-error",
            "node size is too big for width and height!"
          );
        }

        //Movement of drawing position
        g.attr("transform", () => {
          switch (layout) {
            case HORIZONTAL:
              return `translate(${margin.left}, ${margin.top})`;
            case VERTICAL:
              return `translate(${margin.top}, ${margin.left})`;
            case RADIAL:
              return `translate(${svgWidth / 2}, ${svgHeight / 2})`;
          }
        });

        //Align leaves or not
        let graphType = tree();
        isLeafNodesAlign ? (graphType = cluster()) : (graphType = tree());

        //Gap between node
        const separation = (a, b) => {
          return (a.parent === b.parent ? 1 : 2) / isLeafNodesAlign
            ? 1
            : a.depth;
        };

        //Setting the graph size for each layout
        switch (layout) {
          case HORIZONTAL:
            graphType.size([
              svgHeight - margin.top - margin.bottom,
              svgWidth - margin.left - margin.right,
            ]);
            break;
          case VERTICAL:
            graphType.size([
              svgWidth - margin.top - margin.bottom,
              svgHeight - margin.left - margin.right,
            ]);
            break;
          case RADIAL:
            graphType
              .size([
                2 * Math.PI,
                Math.min(svgWidth / 2, svgHeight / 2) - margin.right,
              ])
              .separation(separation)(treeRoot);
            break;
        }

        graphType(treeRoot);

        //Start position of drawing
        treeRoot.x0 = data[0].parent.x;
        treeRoot.y0 = 0;

        //Change values during vertical
        if (layout === VERTICAL) {
          treeDescendants.forEach((node) => {
            const { x0, x, y0, y } = node;

            node.x0 = y0;
            node.x = y;
            node.y0 = x0;
            node.y = x;
          });
        }

        //Setting the width of margin
        const minY = [],
          maxY = [],
          minX = [],
          maxX = [];

        const circleRadius = [],
          aligns = [],
          depths = [];
        treeDescendants.forEach((d) => {
          circleRadius.push(nodeRadius(d.data.value) || aveRadius);

          const mapper = {
            horizontal: {
              alignmentDirection: margin.top + d.x,
              depthDirection: margin.left + d.y,
            },
            vertical: {
              alignmentDirection: margin.left + d.x,
              depthDirection: margin.top + d.y,
            },
          };

          switch (layout) {
            case HORIZONTAL:
              return (
                aligns.push(mapper.horizontal["alignmentDirection"]),
                depths.push(mapper.horizontal["depthDirection"])
              );
            case VERTICAL:
              return (
                aligns.push(mapper.vertical["alignmentDirection"]),
                depths.push(mapper.vertical["depthDirection"])
              );
            default:
              break;
          }
        });

        //Get all positions
        let deltas;
        treeDescendants.forEach((d, i) => {
          minX.push(aligns[i] - circleRadius[i]);
          minY.push(depths[i] - circleRadius[i]);
          maxX.push(aligns[i] + circleRadius[i]);
          maxY.push(depths[i] + circleRadius[i]);
        });

        //Find each max/min value
        switch (layout) {
          case HORIZONTAL:
            deltas = {
              top: Math.min(...minX),
              bottom: height - Math.max(...maxX),
              left: Math.min(...minY),
              right: width - Math.max(...maxY),
            };
            break;
          case VERTICAL:
            deltas = {
              top: Math.min(...minY),
              bottom: width - Math.max(...maxY),
              left: Math.min(...minX),
              right: height - Math.max(...maxX),
            };
            break;
          default:
            break;
        }

        // Update margin values
        const directions = ["top", "bottom", "right", "left"];
        switch (layout) {
          case HORIZONTAL:
          case VERTICAL:
            for (const dir of directions) {
              deltas[dir] < 0 ? (margin[dir] += Math.abs(deltas[dir]) + 1) : "";
            }

            //Redraw
            if (
              deltas.top < 0 ||
              deltas.bottom < 0 ||
              deltas.left < 0 ||
              deltas.right < 0
            ) {
              draw(margin);
            }
            break;
          default:
            break;
        }

        //Update graph values
        const update = (source) => {
          let i = 0;

          //Drawing circles
          const nodeCirclesUpdate = gCircles
            .selectAll<SVGGElement, ExtendedHierarchyNode>("g")
            .data(treeRoot.descendants(), (d) => d.id ?? String(++i));

          //Generate new elements of circle
          const nodeCirclesEnter = nodeCirclesUpdate
            .enter()
            .append("g")
            .attr("transform", () => {
              switch (layout) {
                case HORIZONTAL:
                case VERTICAL:
                  return `translate(${source.y0}, ${source.x0})`;
                case RADIAL:
                  return `rotate(${
                    (source.x0 * 180) / Math.PI - 90
                  }) translate(${source.y0}, 0)`;
              }
            });

          let timeout;

          nodeCirclesEnter
            .on("click", (e, d) => {
              if (e.detail === 1) {
                timeout = setTimeout(() => {
                  toggleSelectIds({
                    selectedIds: this.selectedIds,
                    targetId: d.data.id,
                  });
                  updateSelectedElementClassNameForD3({
                    drawing: this._chartArea,
                    selectedIds: this.selectedIds,
                    ...this.selectedEventParams,
                  });
                  if (this.params["event-outgoing_change_selected_nodes"]) {
                    emitSelectedEvent({
                      rootElement: this.element,
                      targetId: d.data.id,
                      selectedIds: this.selectedIds,
                      dataUrl: this.params["data-url"],
                    });
                  }
                }, 500);
              }
            })
            .on("dblclick", (e, d) => {
              clearTimeout(timeout);
              toggle(d);
              update(d);

              updateSelectedElementClassNameForD3.apply(this, [
                {
                  drawing: this._chartArea,
                  selectedIds: this.selectedIds,
                  ...this.selectedEventParams,
                },
              ]);
            });

          //Update circle color when opening and closing
          nodeCirclesUpdate
            .filter((d) => d === source)
            .select("circle")
            .attr("fill", (d) => (d._children ? "#fff" : setColor(d)));

          //Decorate circle
          nodeCirclesEnter
            .append("circle")
            .attr("data-tooltip", (d) => {
              if (this.tooltips) {
                return this.tooltips.compile(d.data.originalData);
              } else {
                return false;
              }
            })
            .attr("stroke", setColor)
            .style(colorModeProperty, colorModeValue)
            .classed("with-children", (d) => !!d.children)
            .attr("r", (d) =>
              data.some((d) => d.data.value)
                ? nodeRadius(d.data.value)
                : aveRadius
            )
            .attr("fill", setColor);

          //Drawing labels
          const nodeLabelsUpdate = gLabels
            .selectAll<SVGGElement, ExtendedHierarchyNode>("g")
            .data(treeRoot.descendants(), (d) => d.id ?? String(++i));

          //Generate new elements of Labels
          const nodeLabelsEnter = nodeLabelsUpdate
            .enter()
            .append("g")
            .attr("transform", () => {
              switch (layout) {
                case HORIZONTAL:
                case VERTICAL:
                  return `translate(${source.y0}, ${source.x0})`;
                case RADIAL:
                  return `rotate(${
                    (source.x0 * 180) / Math.PI - 90
                  }) translate(${source.y0}, 0)`;
              }
            });

          //Decorate labels
          nodeLabelsEnter
            .append("text")
            .attr("x", (d) => {
              switch (layout) {
                case HORIZONTAL:
                  return d.children || d._children ? -labelMargin : labelMargin;
                case VERTICAL:
                  return d.children || d._children ? labelMargin : -labelMargin;
                case RADIAL:
                  return d.x < Math.PI === !d.children
                    ? labelMargin
                    : -labelMargin;
              }
            })
            .attr("dy", "3")
            .attr("transform", (d) => {
              switch (layout) {
                case HORIZONTAL:
                  return "rotate(0)";
                case VERTICAL:
                  return "rotate(-90)";
                case RADIAL:
                  return `rotate(${d.x >= Math.PI ? 180 : 0})`;
              }
            })
            .attr("text-anchor", (d) => {
              switch (layout) {
                case HORIZONTAL:
                  return d.children || d._children ? "end" : "start";
                case VERTICAL:
                  return d.children || d._children ? "start" : "end";
                case RADIAL:
                  return d.x < Math.PI === !d.children ? "start" : "end";
              }
            })
            .text((d) => d.data.label || "");

          nodeLabelsEnter.on("click", (e, d) => {
            console.log("click", e, d);
          });

          const duration = 500;

          //Circle transition
          nodeCirclesEnter
            .transition()
            .duration(duration)
            .attr("transform", (d) => {
              switch (layout) {
                case HORIZONTAL:
                case VERTICAL:
                  return `translate(${d.y}, ${d.x})`;
                case RADIAL:
                  return `rotate(${(d.x * 180) / Math.PI - 90}) translate(${
                    d.y
                  }, 0)`;
              }
            });

          //Labels transition
          nodeLabelsEnter
            .attr("transform", (d) => {
              switch (layout) {
                case HORIZONTAL:
                case VERTICAL:
                  return `translate(${source.y}, ${source.x})`;
                case RADIAL:
                  if (source.y === 0) {
                    return `rotate(${(d.x * 180) / Math.PI - 90}) translate(${
                      source.y
                    }, ${source.x})`;
                  } else {
                    return `rotate(${
                      (source.x * 180) / Math.PI - 90
                    }) translate(${source.y}, ${source.x})`;
                  }
              }
            })
            .transition()
            .duration(duration)
            .attr("transform", (d) => {
              switch (layout) {
                case HORIZONTAL:
                case VERTICAL:
                  return `translate(${d.y}, ${d.x})`;
                case RADIAL:
                  return `rotate(${(d.x * 180) / Math.PI - 90}) translate(${
                    d.y
                  }, 0)`;
              }
            });

          //Remove extra elements of circle
          nodeCirclesUpdate
            .exit()
            .transition()
            .duration(duration)
            .attr("transform", () => {
              switch (layout) {
                case HORIZONTAL:
                case VERTICAL:
                  return `translate(${source.y}, ${source.x})`;
                case RADIAL:
                  return `rotate(${
                    (source.x * 180) / Math.PI - 90
                  }) translate(${source.y}, 0)`;
              }
            })
            .remove();

          //Remove extra elements of Labels
          nodeLabelsUpdate
            .exit<ExtendedHierarchyNode>()
            .attr("transform", (d) => {
              switch (layout) {
                case HORIZONTAL:
                case VERTICAL:
                  return `translate(${d.y}, ${d.x})`;
                case RADIAL:
                  return `rotate(${(d.x * 180) / Math.PI - 90}) translate(${
                    d.y
                  }, 0)`;
              }
            })
            .transition()
            .duration(duration)
            .attr("transform", (d) => {
              switch (layout) {
                case HORIZONTAL:
                case VERTICAL:
                  return `translate(${source.y}, ${source.x})`;
                case RADIAL:
                  if (source.y === 0) {
                    return `rotate(${(d.x * 180) / Math.PI - 90}) translate(${
                      source.y
                    }, 0)`;
                  } else {
                    return `rotate(${
                      (source.x * 180) / Math.PI - 90
                    }) translate(${source.y}, 0)`;
                  }
              }
            })
            .remove();

          //Drawing path
          const link = g
            .selectAll<SVGPathElement, d3.HierarchyLink<NodeData>>(".link")
            .data(treeRoot.links(), (d) => d.target.id);

          //Setting the path for each direction
          const getLinkFn = () => {
            switch (layout) {
              case HORIZONTAL:
                return linkHorizontal<
                  HierarchyNode<NodeData>,
                  HierarchyLink<NodeData>
                >();
              case VERTICAL:
                return linkVertical<
                  HierarchyNode<NodeData>,
                  HierarchyLink<NodeData>
                >();
            }
          };

          //Generate new elements of Path
          const linkEnter = link
            .enter()
            .insert("path", "g")
            .classed("link", true)
            .attr(
              "d",
              layout === RADIAL
                ? (linkRadial() as any).angle(source.x).radius(source.y)
                : getLinkFn().x(source.y0).y(source.x0)
            );

          // //Path transition
          const linkUpdate = linkEnter;
          linkUpdate
            .transition()
            .duration(duration)
            .attr(
              "d",
              layout === RADIAL
                ? (linkRadial() as any).angle((d) => d.x).radius((d) => d.y)
                : (getLinkFn() as any).x((d) => d.y).y((d) => d.x)
            );

          //Remove extra elements of path
          link
            .exit()
            .transition()
            .duration(duration)
            .attr(
              "d",
              layout === RADIAL
                ? linkRadial().angle(source.x).radius(source.y)
                : getLinkFn().x(source.y).y(source.x)
            )
            .remove();

          //Get current position for next action
          nodeCirclesUpdate.each((d) => {
            d.x0 = d.x;
            d.y0 = d.y;
          });
        };
        update(treeRoot);
      };

      // Drawing
      draw();

      // Error handling function
      function handleError(errorClass, message) {
        const existError = root.querySelector(`.${errorClass}`);
        if (existError) {
          root.removeChild(existError);
        }
        const errorElement = document.createElement("p");
        errorElement.classList.add(`${errorClass}`, "error-message");
        errorElement.innerHTML = `<p>${message}</p>`;
        root.prepend(errorElement);

        throw new Error(`${message}`);
      }
    };

    await drawContent();

    if (this.tooltips) {
      this.tooltips.setup(root.querySelectorAll("[data-tooltip]"));
    }
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

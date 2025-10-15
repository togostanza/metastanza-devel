import { getCirculateColor } from "@/lib/ColorGenerator";
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
import MetaStanza, { METASTANZA_DATA_ATTR } from "@/lib/MetaStanza";
import { SelectionPlugin } from "@/lib/plugins/SelectionPlugin";
import ToolTip from "@/lib/ToolTip";

//Declaring constants
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
  _selectionPlugin: SelectionPlugin;
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
    if (this._error) return;

    this._selectionPlugin = new SelectionPlugin({ stanza: this });
    this.use(this._selectionPlugin);
    if (!this._chartArea?.empty()) {
      this._chartArea?.remove();
    }

    //Define from params
    const nodeGroupKey = this.params["group-key"]?.trim();
    const width = parseFloat(this.css("--togostanza-canvas-width")) || 0;
    const height = parseFloat(this.css("--togostanza-canvas-height")) || 0;
    const minRadius = this.params["node-size_min"] / 2 || 0;
    const maxRadius = (this.params["node-size_max"] || 0) / 2;
    const colorMode = this.params["node-color_blend"];

    const root = this._main;

    const dataset: NodeData[] = this.__data.asTree({
      nodeLabelKey: this.params["node-label_key"]?.trim(),
      nodeColorKey: this.params["node-color_key"]?.trim(),
      nodeGroupKey,
      nodeValueKey: this.params["node-size_key"]?.trim(),
      nodeDescriptionKey: this.params["tooltip"]?.trim(),
    }).data as NodeData[];
    const padding = this.MARGIN;
    const isLeafNodesAlign = this.params["layout-align_leaf_nodes"];
    const layout = this.params["layout-orientation"];
    const labelMargin = this.params["node-label_margin"] || 0;
    const aveRadius = (minRadius + maxRadius) / 2;
    const colorGroup = nodeGroupKey; // NOTE Actually, this variable is not needed (because asTree does the property name conversion), but since we cannot remove this variable without changing the getCirculateColor interface, we have left it in.

    let colorModeProperty, colorModeValue;

    // Set color mode
    if (COLOR_MODES[colorMode]) {
      ({ property: colorModeProperty, value: colorModeValue } =
        COLOR_MODES[colorMode]);
    }

    // Tooltip
    const tooltipString = this.params["tooltip"]?.trim();

    const mergedDataset = dataset.map((item) => {
      const original = this.__data.data.find((d) => d.id === item.id);
      return {
        ...item,
        originalData: original,
      };
    });

    const drawContent = async () => {
      //Hierarchize data
      const treeRoot = generateTreeStructure(mergedDataset);
      const treeDescendants = treeRoot.descendants();
      const data = treeDescendants.slice(1);

      const radiusScale = createRadiusScale(data, minRadius, maxRadius);
      const nodeRadius = (size) => {
        return size
          ? radiusScale(size)
          : radiusScale(min(data, (d) => d.data.value));
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
      const getColor = setupColorScale(this, treeDescendants, colorGroup);

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

      const { rootLabelWidth, maxLabelWidth } = await measureLabels(
        this._chartArea,
        treeDescendants,
        data
      );

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
            .attr("class", "node")
            .attr(METASTANZA_DATA_ATTR, (d) => d.data.id.toString())
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

          nodeCirclesEnter.on("dblclick", (e, d) => {
            clearTimeout(timeout);
            toggle(d);
            update(d);
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

          // Add labels
          nodeCirclesEnter
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
            .attr("transform", (d) => {
              switch (layout) {
                case HORIZONTAL:
                  return "rotate(0)";
                case VERTICAL:
                  return "rotate(-90)";
                case RADIAL: {
                  if (d.x > Math.PI) return `rotate(180)`;
                }
              }
            })
            .text((d) => d.data.label || "");

          const duration = 500;

          //Circle transition
          nodeCirclesEnter
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

          // Add hover functionality for tree nodes
          const addTreeHighlightOnHover = () => {
            const selectedIds = this._selectionPlugin?.getSelection() || [];
            const nodeGroups = g.selectAll<SVGGElement, ExtendedHierarchyNode>(
              ".node"
            );
            const nodeLabels = g.selectAll<SVGGElement, ExtendedHierarchyNode>(
              "g.labels g"
            );
            const links = g.selectAll<
              SVGPathElement,
              d3.HierarchyLink<NodeData>
            >(".link");

            nodeGroups.on("mouseover", function (e, d) {
              select(this).select("circle").classed("-active", true);

              // Find related nodes (parent and children)
              const relatedNodeIds = new Set<number>();
              relatedNodeIds.add(d.data.id);

              // Add parent nodes
              let current: ExtendedHierarchyNode = d;
              while (current.parent) {
                relatedNodeIds.add(current.parent.data.id);
                current = current.parent as ExtendedHierarchyNode;
              }

              // Add child nodes
              const addChildren = (node: ExtendedHierarchyNode) => {
                if (node.children) {
                  node.children.forEach((child: ExtendedHierarchyNode) => {
                    relatedNodeIds.add(child.data.id);
                    addChildren(child);
                  });
                }
              };
              addChildren(d);

              // Apply fadeout and half-active to nodes (like force-graph)
              nodeGroups
                .classed("-active", (p) => p === d)
                .classed(
                  "-fadeout",
                  (p) => d !== p && !relatedNodeIds.has(p.data.id)
                )
                .classed("-half-active", (p) => {
                  // 選択されたアイテムには-half-activeを適用しない
                  return (
                    p !== d &&
                    relatedNodeIds.has(p.data.id) &&
                    !selectedIds.includes(p.data.id.toString())
                  );
                });

              nodeLabels
                .classed("-active", (p) => p === d)
                .classed(
                  "-fadeout",
                  (p) => d !== p && !relatedNodeIds.has(p.data.id)
                )
                .classed("-half-active", (p) => {
                  // 選択されたアイテムには-half-activeを適用しない
                  return (
                    p !== d &&
                    relatedNodeIds.has(p.data.id) &&
                    !selectedIds.includes(p.data.id.toString())
                  );
                });

              // Apply fadeout to unrelated links
              links.classed("-fadeout", (link) => {
                const sourceId = (link.source as ExtendedHierarchyNode).data.id;
                const targetId = (link.target as ExtendedHierarchyNode).data.id;
                return (
                  !relatedNodeIds.has(sourceId) || !relatedNodeIds.has(targetId)
                );
              });
            });

            nodeGroups.on("mouseleave", function () {
              links.classed("-active", false).classed("-fadeout", false);
              nodeGroups
                .classed("-active", false)
                .classed("-fadeout", false)
                .classed("-half-active", false);
              nodeLabels
                .classed("-active", false)
                .classed("-fadeout", false)
                .classed("-half-active", false);
            });
          };

          addTreeHighlightOnHover();
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
}

function generateTreeStructure(data: NodeData[]): ExtendedHierarchyNode {
  return stratify<NodeData>()
    .id((d) => String(d.id))
    .parentId((d) => (d.parent !== undefined ? String(d.parent) : null))(data);
}

function createRadiusScale(
  data: ExtendedHierarchyNode[],
  minRadius: number,
  maxRadius: number
) {
  const minVal = min(data, (d) => d.data.value);
  const maxVal = max(data, (d) => d.data.value);
  return scaleSqrt().domain([minVal, maxVal]).range([minRadius, maxRadius]);
}

function setupColorScale(
  thisEl,
  treeDescendants: ExtendedHierarchyNode[],
  colorGroup
) {
  const colorDatas = treeDescendants.map((d) => d.data);
  return getCirculateColor(thisEl, colorDatas, colorGroup);
}

async function measureLabels(
  chartArea: d3.Selection<SVGGElement, unknown, SVGElement, undefined>,
  treeDescendants: ExtendedHierarchyNode[],
  data: ExtendedHierarchyNode[]
) {
  await document.fonts.ready;

  const rootText = treeDescendants[0].data.label || "";
  const rootGroup = chartArea
    .append("text")
    .text(rootText)
    .attr("visibility", "hidden");
  await new Promise(requestAnimationFrame);
  const rootLabelWidth = rootGroup.node().getBBox().width;
  rootGroup.remove();

  const labels = data
    .filter((n) => !n.children && !n._children)
    .map((n) => n.data.label || "");
  const textSelection = chartArea
    .append("g")
    .selectAll("text")
    .data(labels)
    .enter()
    .append("text")
    .text((d) => d)
    .attr("visibility", "hidden");
  await new Promise(requestAnimationFrame);

  const widths = textSelection.nodes().map((el) => el.getBBox().width);
  const maxLabelWidth = Math.max(...widths);
  textSelection.remove();

  return { rootLabelWidth, maxLabelWidth };
}

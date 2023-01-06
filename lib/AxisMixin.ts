import * as d3 from "d3";
import { z } from "zod";

export const timeIntervalUnitsSchema = z
  .union([
    z.literal("second"),
    z.literal("minute"),
    z.literal("hour"),
    z.literal("day"),
    z.literal("week"),
    z.literal("month"),
    z.literal("year"),
    z.literal("none"),
  ])
  .nullable()
  .optional();

export const scaleSchema = z.union([
  z.literal("linear"),
  z.literal("log10"),
  z.literal("time"),
  z.literal("ordinal"),
]);

export const paramsModel = z
  .object({
    "axis-x-ticks_label_angle": z.number().min(-90).max(90).default(0),
    "axis-y-ticks_label_angle": z.number().min(-90).max(90).default(0),
    "axis-x-title_padding": z.number().default(0),
    "axis-y-title_padding": z.number().default(0),
    "axis-x-title": z.string(),
    "axis-y-title": z.string(),
    "axis-x-placement": z
      .union([z.literal("top"), z.literal("bottom")])
      .default("bottom"),
    "axis-y-placement": z
      .union([z.literal("left"), z.literal("right")])
      .default("left"),
    "axis-x-scale": scaleSchema,
    "axis-y-scale": scaleSchema,
    "axis-x-gridlines_interval": z.number().optional(),
    "axis-x-gridlines_interval_units": timeIntervalUnitsSchema,
    "axis-y-gridlines_interval": z.number().optional(),
    "axis-y-gridlines_interval_units": timeIntervalUnitsSchema,
    "axis-x-ticks_interval": z.number().optional(),
    "axis-x-ticks_interval_units": timeIntervalUnitsSchema,
    "axis-y-ticks_interval": z.number().optional(),
    "axis-y-ticks_interval_units": timeIntervalUnitsSchema,
    "axis-x-ticks_labels_format": z.string().optional(),
    "axis-y-ticks_labels_format": z.string().optional(),
  })
  .passthrough();

export type AxisParamsModelT = z.infer<typeof paramsModel>;

export enum AxisScaleE {
  linear = "linear",
  log10 = "log10",
  time = "time",
  ordinal = "ordinal",
}

export enum AxisPlacementE {
  left = "left",
  right = "right",
  top = "top",
  bottom = "bottom",
  default = "",
}

export type AxisPlacementT = "left" | "right" | "top" | "bottom" | "";

export interface MarginsI {
  LEFT: number;
  RIGHT: number;
  TOP: number;
  BOTTOM: number;
}

export type ScaleType = `${AxisScaleE}`;

export interface AxisParamsI {
  domain: d3.AxisDomain[];
  range: number[];
  margins?: MarginsI;
  showTicks?: boolean;
  scale?: ScaleType;
  placement?: AxisPlacementT;
  tickLabelsAngle?: number;
  ticksLabelsMargin?: number;
  ticksInterval?: number;
  ticksIntervalUnits?: TimeIntervalUnitsT;
  ticksLabelsFormat?: string;
  title?: string;
  titlePadding?: number;
  gridInterval?: number;
  gridIntervalUnits: TimeIntervalUnitsT;
}

type d3Selection = d3.Selection<SVGElement, any, any, any>;

type GetScaleT =
  | d3.ScaleLinear<d3.AxisDomain, number, never>
  | d3.ScaleLogarithmic<d3.AxisDomain, number, never>
  | d3.ScaleBand<d3.AxisDomain>
  | d3.ScaleTime<d3.AxisDomain, number, never>;

const initialMargins: MarginsI = {
  TOP: 0,
  BOTTOM: 0,
  LEFT: 0,
  RIGHT: 0,
};

type TimeIntervalUnitsT = z.infer<typeof timeIntervalUnitsSchema>;

const initialState: AxisParamsI = {
  domain: [],
  range: [],
  margins: initialMargins,
  showTicks: true,
  scale: AxisScaleE.linear,
  placement: AxisPlacementE.default,
  tickLabelsAngle: 0,
  ticksLabelsMargin: 0,
  ticksInterval: 0,
  ticksIntervalUnits: "none",
  title: "",
  ticksLabelsFormat: "%s",
  titlePadding: 0,
  gridInterval: 0,
  gridIntervalUnits: "none",
};

const proxyfy = (init: object, callbackMap: Map<string, (val) => void>) => {
  return new Proxy(init, {
    set(target: object, key: string, val: Partial<AxisParamsI>) {
      if (key === "params") {
        const oldParams: Partial<AxisParamsI> = target[key];
        // process scale change first
        if (val.scale) {
          target[key] = val;
          callbackMap.get("scale")(val.scale);
        }
        if (val.margins) {
          target[key] = val;
          callbackMap.get("margins")(val.margins);
        }
        Object.entries(val)
          .filter(([key]) => key !== "scale" && key !== "margins")
          .forEach(([pKey, pValue]) => {
            const newType = typeof pValue;

            if (newType !== "object") {
              if (oldParams[pKey] !== pValue && callbackMap.has(pKey)) {
                target[key] = val;
                callbackMap.get(pKey)(pValue);
              }
            } else if (Array.isArray(pValue)) {
              const isChanged =
                (pValue.length !== oldParams[pKey].length ||
                  oldParams[pKey].toString() !== pValue.toString()) &&
                callbackMap.has(pKey);
              if (isChanged) {
                target[key] = val;
                callbackMap.get(pKey)(pValue);
              }
            } else {
              const ifChanged =
                Object.entries(pValue).some(([subKey, subVal]) => {
                  oldParams[pKey][subKey] !== subVal;
                }) && callbackMap.has(pKey);

              if (ifChanged) {
                target[key] = val;
                callbackMap.get(pKey)(pValue);
              }
            }
          });
      }

      return true;
    },
  });
};

export class Axis {
  params: AxisParamsI;
  _svg: SVGSVGElement;
  _g: d3Selection;
  _gridG: d3Selection;
  _axisG: d3Selection;
  _titleG: d3Selection;
  _titleText: d3Selection;
  _axisMargin: MarginsI = { LEFT: 0, TOP: 0, BOTTOM: 0, RIGHT: 0 };
  _height: number;
  _width: number;
  callbackMap: Map<keyof AxisParamsI, (val) => void>;
  _axisScale: GetScaleT;
  _axisGen: d3.Axis<d3.AxisDomain>;
  _gridGen: d3.Axis<d3.AxisDomain>;
  _axisLength: number;
  _tickTextXY: { x: string; y: string };

  private _getTickValues(interval: number, ticksOrGrid: "ticks" | "grid") {
    if (interval) {
      if (this.params.scale === "linear" || this.params.scale === "log10") {
        const domain = this.params.domain as number[];
        const domainSize = Math.abs(domain[0] - domain[1]);

        const intervalsCount = Math.floor(domainSize / interval);

        if (intervalsCount !== 0) {
          const tickValues = [...Array(intervalsCount + 1)]
            .slice(1)
            .map((_, i) => Math.min(...domain) + (i + 1) * interval);
          return tickValues;
        }

        return [];
      } else if (this.params.scale === "time") {
        switch (ticksOrGrid) {
          case "ticks":
            return intervalMap[this.params.ticksIntervalUnits]().every(
              interval
            );

          case "grid":
            return intervalMap[this.params.gridIntervalUnits]().every(interval);
        }
      }
    }

    return [];
  }

  private get tickTextXY() {
    const tick = this._axisG.select(".tick")?.select("text");
    if (tick.empty()) {
      return {
        x: "0",
        y: "0",
      };
    }
    return {
      x: tick.attr("x") || "0",
      y: tick.attr("y") || "0",
    };
  }

  private get scaleType() {
    if (this.params.scale === "ordinal") {
      return "ordinal";
    } else return "quantitaive";
  }

  private get ticksLabelsFormatter() {
    if (this.params.scale === "time") {
      return d3.timeFormat(this.params.ticksLabelsFormat || "%b %d %I %p");
    }
    if (this.params.scale !== "ordinal") {
      return d3.format(this.params.ticksLabelsFormat);
    }
    return (val) => val;
  }

  private get gridTickValues() {
    return this._getTickValues(this.params.gridInterval, "grid");
  }
  private get axisTickValues() {
    return this._getTickValues(this.params.ticksInterval, "ticks");
  }

  constructor(svg: SVGSVGElement) {
    this._svg = svg;
    this.params = initialState;

    this._width = svg.getBoundingClientRect().width;
    this._height = svg.getBoundingClientRect().height;

    this._init();

    this.callbackMap = new Map();
    this.callbackMap.set("domain", this._handleDomainUpdate.bind(this));
    this.callbackMap.set("placement", this._handlePlacementUpdate.bind(this));
    this.callbackMap.set("title", this._handleTitleUpdate.bind(this));
    this.callbackMap.set(
      "titlePadding",
      this._handleTitlePaddingUpdate.bind(this)
    );
    this.callbackMap.set("showTicks", this._handleShowTicksUpdate.bind(this));
    this.callbackMap.set("margins", this._handleMarginsUpdate.bind(this));
    this.callbackMap.set(
      "tickLabelsAngle",
      this._handleTickLabelsAngleUpdate.bind(this)
    );
    this.callbackMap.set("scale", this._handleScaleUpdate.bind(this));
    this.callbackMap.set(
      "gridInterval",
      this._handleGridIntervalUpdate.bind(this)
    );
    this.callbackMap.set(
      "ticksInterval",
      this._handleTicksIntervalUpdate.bind(this)
    );
    this.callbackMap.set(
      "ticksLabelsFormat",
      this._handleTicksLabelsFormatUpdate.bind(this)
    );
    return proxyfy(this, this.callbackMap) as Axis;
  }

  private _handleGridIntervalUpdate() {
    this._updateGrid();

    this._gridG.call(this._gridGen.bind(this));
  }

  private _handleTicksIntervalUpdate() {
    this._updateTicks();
    this._callDrawAxis();
  }

  private _callDrawAxis() {
    this._axisG.call(this._axisGen.bind(this));

    this._tickTextXY = this.tickTextXY;
    this._axisG.selectAll(".tick").each(function (this: SVGElement) {
      this.querySelector("text").setAttribute("x", "0");
      this.querySelector("text").setAttribute("y", "0");
    });

    queueMicrotask(() => {
      this._handleTickLabelsAngleUpdate();
      this._handleTitlePaddingUpdate();
    });
  }

  private _callDrawGridlines() {
    this._gridG.call(this._gridGen.bind(this));
  }

  private get HEIGHT() {
    return this._height - this.params.margins.TOP - this.params.margins.BOTTOM;
  }
  private get WIDTH() {
    return this._width - this.params.margins.LEFT - this.params.margins.RIGHT;
  }

  update(params: Partial<AxisParamsI>) {
    this.params = { ...this.params, ...params };
  }

  get scale() {
    return this._axisGen.scale;
  }

  get axisGen() {
    return this._axisGen;
  }

  private _init() {
    const svg = d3.select(this._svg);
    this._g = svg.append("g").classed("axis-container", true);

    this._axisG = this._g.append("g").classed("axis", true);

    this._gridG = this._g.append("g").classed("grid-lines", true);

    this._titleG = this._g.append("g").classed("title-conatiner", true);

    this._titleText = this._titleG
      .append("text")
      .classed("title", true)
      .attr("text-anchor", "middle");
  }

  private _handleMarginsUpdate() {
    this._calcAxisMargins();

    this._callDrawAxis();
    this._callDrawGridlines();

    this._g.attr(
      "transform",
      `translate(${this._axisMargin.LEFT}, ${this._axisMargin.TOP})`
    );
    this._titleG.attr(
      "transform",
      getTitleTranslate.call(this, this.params.placement)
    );
  }

  private _handleDomainUpdate(domain: d3.AxisDomain[] = this.params.domain) {
    this._axisScale.domain(domain);

    this._updateTicks();

    this._updateGrid();

    this._callDrawAxis();

    this._callDrawGridlines();
  }

  private _handlePlacementUpdate() {
    this._calcAxisMargins();

    this._g.attr(
      "transform",
      `translate(${this._axisMargin.LEFT}, ${this._axisMargin.TOP})`
    );

    this._redrawAxis();

    this._titleG.attr(
      "transform",
      getTitleTranslate.call(this, this.params.placement)
    );

    this._titleText.attr(
      "alignment-baseline",
      getTitleBaseline(this.params.placement)
    );

    if (this.params.placement === "left" || this.params.placement === "right") {
      this._titleText.attr("transform", "rotate(-90)");
    }
  }

  private _handleTitleUpdate(title: string) {
    this._titleText.text(title);
  }

  private _handleTitlePaddingUpdate(
    padding: number = this.params.titlePadding || 0
  ) {
    let translate;

    const previousTransform = this._titleG.attr("transform");
    const prevTranslate = /translate\((-?\d+),\s*(-?\d+)/.exec(
      previousTransform
    );
    const [prevTX, prevTY] = prevTranslate?.slice(1) || [0, 0];

    switch (this.params.placement) {
      case "bottom":
        translate = `translate(${prevTX},${padding})`;
        break;
      case "top":
        translate = `translate(${prevTX},${-padding})`;
        break;
      case "left":
        translate = `translate(${-padding},${prevTY})`;
        break;
      case "right":
        translate = `translate(${padding},${prevTY})`;
        break;

      default:
        translate = `translate(${prevTX},${prevTY})`;
    }

    this._titleG.attr("transform", translate);
  }

  private _handleTickLabelsAngleUpdate(
    angle: number = this.params.tickLabelsAngle || 0
  ) {
    let translate = "";

    if (this.params.ticksInterval === 0) return;

    if (!this._axisG.select(".tick").select("text").empty()) {
      const { x, y } = this._tickTextXY;

      if (this.params.placement === "bottom") {
        translate = `translate(0,${y})`;

        if (angle > 0 && angle < 90) {
          this._axisG.selectAll("text").attr("text-anchor", "start");
        } else if (angle > -90 && angle < 0) {
          this._axisG.selectAll("text").attr("text-anchor", "end");
        } else {
          this._axisG.selectAll("text").attr("text-anchor", "middle");
        }
      } else if (this.params.placement === "top") {
        translate = `translate(0,${y})`;

        if (angle > 0 && angle < 90) {
          this._axisG.selectAll("text").attr("text-anchor", "end");
        } else if (angle > -90 && angle < 0) {
          this._axisG.selectAll("text").attr("text-anchor", "start");
        } else {
          this._axisG.selectAll("text").attr("text-anchor", "middle");
        }
      } else if (this.params.placement === "left") {
        if (angle > -90 && angle < 90) {
          this._axisG.selectAll("text").attr("text-anchor", "end");
          if (angle === 90) {
            this._axisG
              .selectAll(".tick")
              .select("text")
              .attr("alignment-baseline", "middle");
          }
          translate = `translate(${x},0)`;
        }
      } else {
        if (angle > -90 && angle < 90) {
          this._axisG.selectAll("text").attr("text-anchor", "start");
          if (angle === 90) {
            this._axisG
              .selectAll(".tick")
              .select("text")
              .attr("alignment-baseline", "middle");
          }
          translate = `translate(${x},0)`;
        }
      }
    }

    this._axisG
      .selectAll("text")
      .attr("transform", `${translate || ""} rotate(${angle})`);
  }

  private _handleShowTicksUpdate(showTicks: boolean) {
    this._axisGen.tickSize(!showTicks ? 0 : 6);
    this._callDrawAxis();
  }

  private _handleScaleUpdate(newScale: ScaleType) {
    this._axisScale = getScale(newScale);
    this._axisScale.domain(this.params.domain);

    this._axisScale.range(this.params.range);
    this._axisGen = getAxisGen(this.params.placement)(
      this._axisScale as d3.AxisScale<d3.AxisDomain>
    );
    this._axisGen.tickFormat(this.ticksLabelsFormatter);

    this._gridGen = getAxisGen(this.params.placement)(
      this._axisScale as d3.AxisScale<d3.AxisDomain>
    );

    this._updateTicks();
    this._updateGrid();

    this._callDrawAxis();
    this._callDrawGridlines();
  }

  private _handleTicksLabelsFormatUpdate() {
    this._axisGen.tickFormat(this.ticksLabelsFormatter);
    this._callDrawAxis();
  }

  private _getTicksFormat() {
    switch (this.params.scale) {
      case AxisScaleE.linear:
        return this.ticksLabelsFormatter;
      case AxisScaleE.log10:
        return formatPower;

      default:
        return (value: d3.AxisDomain) => value.toString();
    }
  }

  private _redrawAxis() {
    this._axisGen = getAxisGen(this.params.placement)(
      this._axisScale as d3.AxisScale<d3.AxisDomain>
    );

    this._gridGen = getAxisGen(this.params.placement)(
      this._axisScale as d3.AxisScale<d3.AxisDomain>
    );

    this._axisGen.tickFormat(this.ticksLabelsFormatter);

    if (!this._axisG.empty()) {
      this._axisG.remove();
    }

    if (!this._gridG.empty()) {
      this._gridG.remove();
    }

    this._axisG = this._g.append("g").classed("axis", true);
    this._gridG = this._g.append("g").classed("grid-lines", true);

    this._updateTicks();
    this._updateGrid();

    queueMicrotask(() => {
      this._callDrawAxis();
      this._callDrawGridlines();
    });
  }

  private _updateGrid() {
    this._gridGen.tickFormat(() => "");
    this._gridGen.tickSize(this.tickSize);
    switch (this.params.gridInterval) {
      case 0:
        this._gridGen.tickValues([]);
        break;
      case undefined:
        this._gridGen.tickValues(null).ticks(5);
        break;
      default:
        if (this.params.scale === "time") {
          if (
            this.params.gridInterval &&
            this.params.gridIntervalUnits !== "none"
          ) {
            this._gridGen.ticks(this.gridTickValues);
          } else {
            this._gridGen.tickValues(null).ticks(5);
          }
        } else {
          this._gridGen.tickValues(this.gridTickValues as number[]);
        }
        break;
    }
  }

  private _updateTicks() {
    switch (this.params.ticksInterval) {
      case 0:
        this._axisGen.tickValues([]);
        break;
      case undefined:
        this._axisGen.tickValues(null).ticks(5);
        break;
      default:
        if (this.params.scale === "time") {
          if (
            this.params.ticksIntervalUnits &&
            this.params.ticksIntervalUnits !== "none"
          ) {
            this._axisGen.ticks(this.axisTickValues);
          } else {
            this._axisGen.tickValues(null).ticks(5);
          }
        } else {
          this._axisGen.tickValues(this.axisTickValues as number[]);
        }
        break;
    }
  }

  private get tickSize() {
    if (
      this.params.placement === AxisPlacementE.bottom ||
      this.params.placement === AxisPlacementE.top
    ) {
      return -this.HEIGHT;
    }
    return -this.WIDTH;
  }

  private _calcAxisMargins() {
    switch (this.params.placement) {
      case "bottom":
        this._axisMargin.LEFT = this.params.margins.LEFT;
        this._axisMargin.TOP = this._height - this.params.margins.BOTTOM;
        this._axisLength = this.WIDTH;
        this._axisScale.range([0, this._axisLength]);
        break;
      case "top":
        this._axisMargin.LEFT = this.params.margins.LEFT;
        this._axisMargin.TOP = this.params.margins.TOP;
        this._axisLength = this.WIDTH;
        this._axisScale.range([0, this._axisLength]);

        break;
      case "left":
        this._axisMargin.LEFT = this.params.margins.LEFT;
        this._axisMargin.TOP = this.params.margins.TOP;
        this._axisLength = this.HEIGHT;
        this._axisScale.range([this._axisLength, 0]);
        break;
      case "right":
        this._axisMargin.LEFT = this._width - this.params.margins.RIGHT;
        this._axisMargin.TOP = this.params.margins.TOP;
        this._axisLength = this.HEIGHT;
        this._axisScale.range([this._axisLength, 0]);
        break;

      default:
        break;
    }
  }
}

function getScale(scale: ScaleType) {
  switch (scale) {
    case AxisScaleE.linear:
      return d3.scaleLinear();
    case AxisScaleE.log10:
      return d3.scaleLog();
    case AxisScaleE.ordinal:
      return d3.scaleBand();
    case AxisScaleE.time:
      return d3.scaleTime();
    default:
      return d3.scaleLinear();
  }
}

function getAxisGen(type: AxisPlacementT) {
  switch (type) {
    case AxisPlacementE.left:
      return d3.axisLeft;
    case AxisPlacementE.right:
      return d3.axisRight;
    case AxisPlacementE.bottom:
      return d3.axisBottom;
    case AxisPlacementE.top:
      return d3.axisTop;
    default:
      return d3.axisBottom;
  }
}

function getTitleBaseline(placement: AxisParamsI["placement"]): string {
  switch (placement) {
    case "top":
      return "baseline";
    case "bottom":
      return "hanging";
    case "left":
      return "baseline";
    case "right":
      return "hanging";
    default:
      return "hangong";
  }
}

function getTitleTranslate(placement: AxisParamsI["placement"]): string {
  switch (placement) {
    case "top":
      return `translate(${this._axisLength / 2}, 0)`;
    case "bottom":
      return `translate(${this._axisLength / 2}, 0)`;
    case "left":
      return `translate(0, ${this._axisLength / 2})`;
    case "right":
      return `translate(0, ${this._axisLength / 2})`;

    default:
      break;
  }
}

export function formatPower(x) {
  const e = Math.log10(x);
  if (e !== Math.floor(e)) return; // Ignore non-exact power of ten.
  return `10${(e + "").replace(/./g, (c) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[c] || "⁻")}`;
}

export const intervalMap = {
  second: () => d3.utcSecond,
  minute: () => d3.utcMinute,
  hour: () => d3.utcHour,
  day: () => d3.utcDay,
  week: () => d3.utcWeek,
  month: () => d3.utcMonth,
  year: () => d3.utcYear,
};

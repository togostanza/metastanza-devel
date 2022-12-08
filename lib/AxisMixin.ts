import * as d3 from "d3";

enum AxisScaleE {
  linear = "linear",
  log10 = "log10",
  time = "time",
  ordinal = "band",
}
enum AxisPlacementE {
  left = "left",
  right = "right",
  top = "top",
  bottom = "bottom",
  default = "",
}

type AxisPlacementT = "left" | "right" | "top" | "bottom" | "";

interface MarginsI {
  LEFT: number;
  RIGHT: number;
  TOP: number;
  BOTTOM: number;
}

export interface AxisParamsI {
  domain: d3.AxisDomain[];
  range: number[];
  width: number;
  height: number;
  margins?: MarginsI;
  showTicks?: boolean;
  scale?: AxisScaleE;
  placement?: AxisPlacementT;
  tickLabelsAngle?: number;
  ticksLabelsMargin?: number;
  title?: string;
  titlePadding?: number;
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

const initialState: AxisParamsI = {
  domain: [],
  range: [],
  width: 0,
  height: 0,
  margins: initialMargins,
  showTicks: true,
  scale: AxisScaleE.linear,
  placement: AxisPlacementE.default,
  tickLabelsAngle: 0,
  ticksLabelsMargin: 0,
  title: "",
  titlePadding: 0,
};

type updatedParamT = string | number | number[];

const proxyfy = (init: object, callbackMap: Map<string, (val) => void>) => {
  return new Proxy(init, {
    set(target: object, key: string, val: Partial<AxisParamsI>) {
      if (key === "params") {
        const oldParams = target[key];
        Object.entries(val).forEach(([pKey, pValue]) => {
          if (
            typeof oldParams[pKey] !== undefined &&
            oldParams[pKey] !== pValue &&
            callbackMap.has(pKey)
          ) {
            target[key] = val;
            callbackMap.get(pKey)(pValue);
          }
        });
      }

      return Reflect.set(target, key, val);
    },
  });
};

export class Axis {
  params: AxisParamsI;
  _svg: SVGSVGElement;
  _g: d3Selection;
  _axisG: d3Selection;
  _titleG: d3Selection;
  _titleText: d3Selection;
  _axisMargin: MarginsI = { LEFT: 0, TOP: 0, BOTTOM: 0, RIGHT: 0 };
  _height: number;
  _width: number;
  callbackMap: Map<keyof AxisParamsI, (val) => void>;
  _axisScale: GetScaleT;
  _axisGen: d3.Axis<d3.AxisDomain>;
  _axisLength: number;

  constructor(svg: SVGSVGElement) {
    this._svg = svg;

    this._width = svg.getBoundingClientRect().width;
    this._height = svg.getBoundingClientRect().height;

    this._axisScale = getScale(AxisScaleE.linear);
    this._axisScale.domain([0, 1]);

    this._axisGen = getAxisGen(AxisPlacementE.bottom)(
      this._axisScale as d3.AxisScale<d3.AxisDomain>
    );

    this.params = initialState;

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

    return proxyfy(this, this.callbackMap) as Axis;
  }

  update(params: Partial<AxisParamsI>) {
    this.params = { ...this.params, ...params };
  }

  private _init() {
    const svg = d3.select(this._svg);
    this._g = svg.append("g").classed("axis-container", true);

    this._axisG = this._g.append("g").classed("axis", true).call(this._axisGen);

    this._titleG = this._g.append("g").classed("title-conatiner", true);

    this._titleText = this._titleG
      .append("text")
      .classed("title", true)
      .attr("text-anchor", "middle");
  }

  private _handleMarginsUpdate() {
    this._calcAxisMargins();
    this._g.attr(
      "transform",
      `translate(${this._axisMargin.LEFT}, ${this._axisMargin.TOP})`
    );
  }

  private _handleDomainUpdate(domain: d3.AxisDomain[]) {
    this._axisScale.domain(domain);
    this._axisG.call(this._axisGen.bind(this));
  }

  private _handlePlacementUpdate() {
    this._calcAxisMargins();
    this._g.attr(
      "transform",
      `translate(${this._axisMargin.LEFT}, ${this._axisMargin.TOP})`
    );

    this._axisGen = getAxisGen(this.params.placement)(
      this._axisScale as d3.AxisScale<d3.AxisDomain>
    );
    if (!this._axisG.empty()) {
      this._axisG.remove();
    }
    this._axisG = this._g.append("g").classed("axis", true).call(this._axisGen);

    this._titleG.attr(
      "transform",
      getTitleTranslate.call(this, this.params.placement)
    );

    this._titleText.attr(
      "alignment-baseline",
      getTitleBaseline(this.params.placement)
    );

    this._handleTitlePaddingUpdate(this.params.titlePadding);
  }

  private _handleTitleUpdate(title: string) {
    this._titleText.text(title);
  }

  private _handleTitlePaddingUpdate(padding: number) {
    let translate;

    const previousTransform = this._titleG.attr("transform");

    const prevTranslate = /translate\((-?\d+),\s*(-?\d+)/.exec(
      previousTransform
    );
    const [prevTX, prevTY] = prevTranslate.slice(1);

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
      default:
        translate = `translate(${prevTX},${prevTY})`;
    }

    this._titleG.attr("transform", translate);
  }

  private _handleShowTicksUpdate(showTicks: boolean) {
    this._axisGen.tickSize(!showTicks ? 0 : 6);
    this._axisG.call(this._axisGen.bind(this));
  }

  private _calcAxisMargins() {
    switch (this.params.placement) {
      case "bottom":
        this._axisMargin.LEFT = this.params.margins.LEFT;
        this._axisMargin.TOP = this._height - this.params.margins.BOTTOM;
        this._axisLength =
          this._width - this.params.margins.LEFT - this.params.margins.RIGHT;
        this._axisScale.range([0, this._axisLength]);
        break;
      case "top":
        this._axisMargin.LEFT = this.params.margins.LEFT;
        this._axisMargin.TOP = this.params.margins.TOP;
        this._axisLength =
          this._width - this.params.margins.LEFT - this.params.margins.RIGHT;
        this._axisScale.range([0, this._axisLength]);
        break;
      case "left":
        this._axisMargin.LEFT = this.params.margins.LEFT;
        this._axisMargin.TOP = this.params.margins.TOP;
        this._axisLength =
          this._height - this.params.margins.TOP - this.params.margins.BOTTOM;
        this._axisScale.range([this._axisLength, 0]);
        break;
      case "right":
        this._axisMargin.LEFT = this._width - this.params.margins.RIGHT;
        this._axisMargin.TOP = this.params.margins.TOP;
        this._axisLength =
          this._height - this.params.margins.TOP - this.params.margins.BOTTOM;
        this._axisScale.range([this._axisLength, 0]);
        break;

      default:
        break;
    }
  }
}

function getScale(scale: AxisScaleE) {
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
      return `rotate(90) translate(0, ${this._axisLength / 2})`;
    case "right":
      return `rotate(90) translate(0, ${this._axisLength / 2})`;

    default:
      break;
  }
}

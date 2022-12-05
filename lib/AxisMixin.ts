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
}

type AxisPlacementT = "left" | "right" | "top" | "bottom";

interface MarginsI {
  LEFT: number;
  RIGHT: number;
  TOP: number;
  BOTTOM: number;
}

interface AxisMarginI {
  LEFT: number;
  TOP: number;
}

interface axisParamsI {
  domain: number[];
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
}

type d3Selection = d3.Selection<SVGSVGElement, any, any, any>;

type GetScaleT =
  | d3.ScaleLinear<d3.AxisDomain, number, never>
  | d3.ScaleLogarithmic<d3.AxisDomain, number, never>
  | d3.ScaleBand<d3.AxisDomain>
  | d3.ScaleTime<d3.AxisDomain, number, never>;

export class Axis {
  private axisScale: GetScaleT;
  private _axisGen: d3.Axis<d3.AxisDomain>;
  private parentSelection: d3Selection;
  private axisParams: axisParamsI;
  private _axesMargins: AxisMarginI;
  private _margins: MarginsI;
  private WIDTH: number;
  private HEIGHT: number;

  constructor(parentSelection, axisParams: axisParamsI) {
    this.axisParams = axisParams;
    this.parentSelection = parentSelection;
    this.axisScale = this._getScale(axisParams.scale);

    this._margins = axisParams.margins;

    this._axisGen = this._getAxisGen(axisParams.placement)(
      this.axisScale as d3.AxisScale<d3.AxisDomain>
    );

    this._init();
  }

  private _addTranslate(g: d3Selection) {
    const transform = g.attr("transform");
    g.attr(
      "transform",
      `${transform || ""} translate(${this._axesMargins.LEFT}, ${
        this._axesMargins.TOP
      })`
    );
  }

  private _init() {
    if (!this._margins) {
      this._margins = {
        TOP: 0,
        BOTTOM: 0,
        LEFT: 0,
        RIGHT: 0,
      };
    }

    this._axesMargins = { TOP: this._margins.TOP, LEFT: this._margins.LEFT };
    switch (this.axisParams.placement) {
      case AxisPlacementE.right:
        this._axesMargins.LEFT = this.axisParams.width - this._margins.RIGHT;
        break;

      case AxisPlacementE.bottom:
        this._axesMargins.TOP = this.axisParams.height - this._margins.BOTTOM;
      default:
        break;
    }

    this.WIDTH =
      this.axisParams.width - this._margins.LEFT - this._margins.RIGHT;
    this.HEIGHT =
      this.axisParams.height - this._margins.TOP - this._margins.BOTTOM;

    if (
      this.axisParams.placement === AxisPlacementE.left ||
      this.axisParams.placement === AxisPlacementE.right
    ) {
      this.axisScale.range([0, this.HEIGHT]);
      this.axisScale.domain(this.axisParams.domain.reverse());
    } else {
      this.axisScale.range([0, this.WIDTH]);
      this.axisScale.domain(this.axisParams.domain);
    }
  }

  get axis() {
    return (g: d3Selection) => {
      this._axisGen(g);
      this._rotateLabels(g);
      this._addTranslate(g);
    };
  }

  set axisDomain(newDomain) {
    this.axisScale.domain(newDomain);
    this.update();
  }

  set axisRange(newRange) {
    this.axisScale.range(newRange);
    this.update();
  }

  private update() {
    queueMicrotask(() => this.parentSelection.call(this.axis));
  }

  private _rotateLabels(g: d3Selection) {
    if (this.axisParams.tickLabelsAngle < 0) {
      g.selectAll("text").attr("text-anchor", "end");
    }

    g.selectAll("text").attr(
      "transform",
      `rotate(${this.axisParams.tickLabelsAngle || 0})`
    );
  }

  _getScale(scale: AxisScaleE) {
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

  _getAxisGen(type: AxisPlacementT) {
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
}

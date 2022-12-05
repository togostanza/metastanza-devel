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

interface axisParamsI {
  domain: number[];
  range: number[];
  showTicks?: boolean;
  scale?: AxisScaleE;
  placement?: AxisPlacementT;
  width?: number;
  height?: number;
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
  private axisGen: d3.Axis<d3.AxisDomain>;
  private parentSelection: d3Selection;
  private axisParams: axisParamsI;

  constructor(parentSelection, axisParams: axisParamsI) {
    this.axisParams = axisParams;
    this.parentSelection = parentSelection;
    this.axisScale = this._getScale(axisParams.scale);
    this.axisScale.range(axisParams.range);

    this.axisGen = this._getAxisGen(axisParams.placement)(
      this.axisScale as d3.AxisScale<d3.AxisDomain>
    );

    this._init();
  }

  private _init() {
    if (
      this.axisParams.placement === AxisPlacementE.left ||
      this.axisParams.placement === AxisPlacementE.right
    ) {
      this.axisScale.domain(this.axisParams.domain.reverse());
    } else {
      this.axisScale.domain(this.axisParams.domain);
    }
  }

  get axis() {
    return this.axisGen;
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

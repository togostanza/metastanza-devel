import * as d3 from "d3";
import { axisBottom } from "d3";

const AXIS_PLACEMENT = {
  left: "left",
  right: "right",
  top: "top",
  bottom: "bottom",
};

type ReturnsAxisFuncT = (
  scale: d3.AxisScale<d3.AxisDomain>
) => d3.Axis<d3.AxisDomain>;

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

interface axisParamsI {
  scale: AxisScaleE;
  placement: AxisPlacementE;
  domain: number[];
  range: number[];
  ticks: boolean;
  width?: number;
  height?: number;
}

type GetScaleT =
  | d3.ScaleLinear<d3.AxisDomain, number, never>
  | d3.ScaleLogarithmic<d3.AxisDomain, number, never>
  | d3.ScaleBand<d3.AxisDomain>
  | d3.ScaleTime<d3.AxisDomain, number, never>;

export class Axis {
  axisG: d3.Selection<SVGElement, {}, SVGAElement, any>;
  axisScale: GetScaleT;
  axisGen: d3.Axis<d3.AxisDomain>;
  LENGTH: number;
  constructor(parentSVGElement, axisParams: axisParamsI) {
    this.axisG = d3.select(parentSVGElement);
    this.axisScale = this._getScale(axisParams.scale);
    this.axisScale.domain(axisParams.domain);
    this.axisScale.range(axisParams.range);

    this.axisGen = this._getAxisGen(axisParams.placement)(
      this.axisScale as d3.AxisScale<d3.AxisDomain>
    );
    this.LENGTH = axisParams.width || axisParams.height;
  }

  get axis() {
    return this.axisGen;
  }

  set axisDomain(newDomain) {
    this.axisScale.domain(newDomain);
  }

  set axisRange(newRange) {
    this.axisScale.range(newRange);
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

  _getAxisGen(type: AxisPlacementE) {
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

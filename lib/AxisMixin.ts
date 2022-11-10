import * as d3 from "d3";

interface marginI {
  TOP: number;
  BOTTOM: number;
  LEFT: number;
  RIGHT: number;
}

type Constructor = new (...args: any[]) => any;

export function AddAxisMixin<BaseT extends Constructor>(Base: BaseT) {
  return class extends Base {
    updateAxis(axis = "x", range: number[], MARGIN: marginI): void {
      // TODO update axis here to be able on d3.selection.call(updateAxis("x", [...], MARGIN))
    }

    drawAxis(axis = "x", width: number, height: number, MARGIN: marginI) {
      const axisString = `axis-${axis}`;

      const HEIGHT = height - MARGIN.TOP - MARGIN.BOTTOM;
      const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

      const key = this.params[`${axisString}-key`];
      const scale = this.params[`${axisString}-scale`] as AxisScaleTypesE;
      const hide = this.params[`${axisString}-hide`];

      const title = this.params[`${axisString}-title`];
      const titlePadding = this.params[`${axisString}-title_padding`];

      const ticksHide = this.params[`${axisString}-ticks_hide`];
      const ticksLabelsAngle = this.params[`${axisString}-ticks_labels_angle`];
      const ticksInterval =
        scale === "linear" || scale === "log10"
          ? parseFloat(this.params[`${axisString}-ticks_interval`])
          : this.params[`${axisString}-ticks_interval`];
      const ticksIntervalUnits =
        scale === "time"
          ? this.params[`${axisString}-ticks_interval_units`]
          : 1;
      const ticksLabelsFormat =
        this.params[`${axisString}-ticks_labels_format`];

      const placement = this.params[
        `${axisString}-placement`
      ] as AxisPlacementE;

      const labelFormat = this.params[`${axisString}-ticks_labels_format`];

      const min =
        this.params[`${axisString}-range_min`] ||
        d3.min(this._data, (d: datumT) => this.parseValue(d[key], scale)); //TODO address 0 case, address ordinal scale

      const max =
        this.params[`${axisString}-range_max`] ||
        d3.max(this._data, (d: datumT) => this.parseValue(d[key], scale)); //TODO address 0 case

      const gridlinesInterval = this.params[`${axisString}-gridlines_interval`];
      const gridlinesIntervalUnits =
        this.params[`${axisString}-gridlines_interval_units`];

      const domain = [min, max];

      const range = axis === "x" ? [0, WIDTH] : [HEIGHT, 0];

      const axisScaleFn = this.getAxisScale(scale);
      axisScaleFn.range(range);
      axisScaleFn.domain(domain);

      const sb = d3.scaleLog().range([0, 19]).domain([0, 23]);

      const axisGen = this.axisPlacementMap[placement](sb).tickFormat();

      const gridAxisGen = this.axisPlacementMap[placement](axisScaleFn)
        .tickSize(axis === "x" ? -HEIGHT : -WIDTH)
        .tickFormat(null);

      if (scale === "linear") {
        if (ticksInterval) {
          const ticks = [];
          const Nticks = Math.round((max - min) / ticksInterval) + 1;
          const integerTickInterval = (max - min) / (Nticks - 1);
          for (let i = 0; i < Nticks; i++) {
            ticks.push(min + i * integerTickInterval);
          }
          axisGen.tickValues(ticks);
        } else {
          axisGen.ticks(5);
        }
      }

      let TL = MARGIN.LEFT,
        TT = MARGIN.TOP;

      if (placement === "bottom") {
        TT += Math.abs(range[0] - range[1]);
      } else if (placement === "right") {
        TL += Math.abs(range[0] - range[1]);
      }

      const translate = `translate(${TL},${TT})`;

      return function (selection: d3.Selection<SVGElement, any, any, any>) {
        const axisArea = selection
          .append("g")
          .attr("class", `${axisString} axis`)
          .attr("transform", translate);
        axisArea.call(axisGen);
      };
    }

    intervalMap = {
      second: () => d3.utcSecond,
      minute: () => d3.utcMinute,
      hour: () => d3.utcHour,
      day: () => d3.utcDay,
      week: () => d3.utcWeek,
      month: () => d3.utcMonth,
      year: () => d3.utcYear,
    };

    getAxisScale(scaleType: AxisScaleTypesE) {
      switch (scaleType) {
        case AxisScaleTypesE.LINEAR:
          return d3.scaleLinear();
        case AxisScaleTypesE.LOG:
          return d3.scaleLog();
        case AxisScaleTypesE.TIME:
          return d3.scaleTime();

        default:
          return d3.scaleBand();
      }
    }

    parseValue(value: valueT, scaleType: AxisScaleTypesE) {
      if (typeof value === "undefined") {
        return null;
      }
      switch (scaleType) {
        case AxisScaleTypesE.LINEAR:
        case AxisScaleTypesE.LOG:
          return parseFloat(value as string);
        case AxisScaleTypesE.TIME:
          const parsedDate = new Date(value);
          return !isNaN(Number(parsedDate)) ? parsedDate : null;

        default:
          return null;
      }
    }

    axisPlacementMap = {
      left: d3.axisLeft,
      right: d3.axisRight,
      top: d3.axisTop,
      bottom: d3.axisBottom,
    };
  };
}

export enum AxisScaleTypesE {
  LOG = "log10",
  LINEAR = "linear",
  TIME = "time",
  ORDINAL = "ordinal",
}

export enum AxisPlacementE {
  LEFT = "left",
  RIGHT = "right",
  TOP = "top",
  BOTTOM = "bottom",
}

type valueT = number | string | undefined;

type datumT = Record<string | symbol | number, string | number>;

type parseValueT = (
  value: number | string,
  scaleType: AxisScaleTypesE
) => number | string | Date;

interface axisPlacementMapI {
  left: typeof d3.axisLeft;
  right: typeof d3.axisRight;
  top: typeof d3.axisTop;
  bottom: typeof d3.axisBottom;
}

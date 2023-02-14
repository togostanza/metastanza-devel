interface MarginsI {
  LEFT: number;
  RIGHT: number;
  TOP: number;
  BOTTOM: number;
}

export function getMarginsFromCSSString(cssString: string): MarginsI;

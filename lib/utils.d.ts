interface MarginsI {
  LEFT: number;
  RIGHT: number;
  TOP: number;
  BOTTOM: number;
}

export function getMarginsFromCSSString(cssString: string): MarginsI;

export function emitSelectedEventForD3({
  drawing,
  rootElement,
  targetId,
  targetElementSelector,
  selectedElementSelector,
  idPath,
}): void;

export function updateSelectedElementClassNameForD3({
  drawing,
  selectedIds,
  targetElementSelector,
  selectedElementClassName,
  idPath,
}): void;

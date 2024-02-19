interface MarginsI {
  LEFT: number;
  RIGHT: number;
  TOP: number;
  BOTTOM: number;
}

export function getMarginsFromCSSString(cssString: string): MarginsI;

export function emitSelectedEvent({
  drawing,
  targetId,
  targetElementSelector,
  selectedElementSelector,
  idPath,
}): void;

export function updateSelectedElementClassName({
  drawing,
  selectedIds,
  targetElementSelector,
  selectedElementClassName,
  idPath,
}): void;

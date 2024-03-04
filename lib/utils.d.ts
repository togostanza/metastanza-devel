interface MarginsI {
  LEFT: number;
  RIGHT: number;
  TOP: number;
  BOTTOM: number;
}

export function getMarginsFromCSSString(cssString: string): MarginsI;

export function emitSelectedEvent({
  stanza,
  targetId,
  targetElementSelector,
  selectedElementSelector,
  idPath,
}): void;

export function updateSelectedElementClassName({
  stanza,
  selectedIds,
  targetElementSelector,
  selectedElementClassName,
  idPath,
}): void;

export function selectElement({
  stanza,
  selectedIds,
  targetElementSelector,
  idPrefix,
}): void;

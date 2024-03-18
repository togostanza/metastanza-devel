interface MarginsI {
  LEFT: number;
  RIGHT: number;
  TOP: number;
  BOTTOM: number;
}

export function getMarginsFromCSSString(cssString: string): MarginsI;

export function toggleSelectIds({ targetId, selectedIds }): void;

export function emitSelectedEvent({
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

export function selectElement({
  stanza,
  selectedIds,
  targetElementSelector,
  idPrefix,
}): void;

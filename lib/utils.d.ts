interface MarginsI {
  LEFT: number;
  RIGHT: number;
  TOP: number;
  BOTTOM: number;
}

type Id = number | string;

export function getMarginsFromCSSString(cssString: string): MarginsI;

export function toggleSelectIds({
  targetId,
  selectedIds,
}: {
  targetId: Id;
  selectedIds: Id[];
}): void;

export function toggleSelectedIdsMultiple({
  selectedIds,
  targetIds,
}: {
  selectedIds: Id[];
  targetIds: Id[];
}): void;

export function emitSelectedEvent({
  rootElement = undefined,
  targetId,
  selectedIds,
  dataUrl,
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

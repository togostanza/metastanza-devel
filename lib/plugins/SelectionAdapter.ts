import { METASTANZA_DATA_ATTR } from "../MetaStanza";
import {
  METASTANZA_SELECTED_CLASS,
  type SelectionState,
} from "./SelectionPlugin";
import type { ComponentPublicInstance } from "vue";

interface UpdateStatePayload {
  ids: string[];
  shiftKey: boolean;
}

export type AdapterInitProps = {
  updateState: (selected: UpdateStatePayload) => void;
  element: HTMLElement;
  /**
   * Convert event target to array of data ids.
   * Needed, for example, in case of Histogram, where clicked target represents multiple data-id
   * @param target - event target
   * @returns array of datum ids
   */
  mapTargetToIds?: (target: Element) => string[] | undefined;

  /**
   * Convert incoming data-ids to selection targets
   * @param ids - selected ids
   * @returns array of selection targets
   */
  mapIdsToTargets?: (ids: string[]) => Element[];

  passIdsToComponent?: (ids: string[]) => void;
};

export abstract class SelectionAdapter {
  private abortController: AbortController;

  protected element: HTMLElement;

  /**
   * Update the visual selection state
   * @param state - The current selection state
   */
  abstract updateSelection(state: SelectionState): void;

  protected mapTargetToIds: (target: Element) => string[] | undefined;

  protected mapIdsToTargets: (ids: string[]) => Element[];

  static defaultMapTargetToIds(target: Element): string[] {
    const dataId = target
      .closest(`[${METASTANZA_DATA_ATTR}]`)
      ?.getAttribute(METASTANZA_DATA_ATTR);

    if (!dataId) return [];

    return [dataId];
  }

  // needed for updating elements based on ids.
  static defaultMapIdsToTargets(main: Element, ids: string[]): Element[] {
    const targets = [] as Element[];

    for (const el of main.querySelectorAll(`[${METASTANZA_DATA_ATTR}]`)) {
      const dataId = el.getAttribute(METASTANZA_DATA_ATTR);
      if (dataId && ids.includes(dataId)) {
        targets.push(el);
      }
    }

    return targets;
  }

  constructor({
    updateState,
    mapTargetToIds,
    mapIdsToTargets,
    element,
  }: AdapterInitProps) {
    this.element = element;
    this.abortController = new AbortController();

    if (mapTargetToIds) {
      this.mapTargetToIds = mapTargetToIds;
    } else {
      this.mapTargetToIds = SelectionAdapter.defaultMapTargetToIds;
    }

    if (mapIdsToTargets) {
      this.mapIdsToTargets = mapIdsToTargets;
    } else {
      this.mapIdsToTargets = (ids: string[]) =>
        SelectionAdapter.defaultMapIdsToTargets(element, ids);
    }

    this.element.addEventListener(
      "click",
      (e) => {
        const target = e.target as Element | null | undefined;

        const ids = this.mapTargetToIds(target);

        if ((!ids || ids.length === 0) && e.shiftKey) return;

        updateState({ ids: ids ?? [], shiftKey: e.shiftKey });
      },
      { signal: this.abortController.signal }
    );
  }

  destroy(): void {
    this.abortController.abort();
  }
}

export class DomSelectionAdapter extends SelectionAdapter {
  /** @inheritdoc */
  updateSelection(state: SelectionState): void {
    const elements = this.mapIdsToTargets(Array.from(state.selectedItems));

    this.element
      .querySelectorAll(`.${METASTANZA_SELECTED_CLASS}`)
      .forEach((el) => {
        el.classList.remove(METASTANZA_SELECTED_CLASS);
      });

    elements.forEach((element) => {
      element.classList.add(METASTANZA_SELECTED_CLASS);
    });
  }
}

interface VueSelectionAdapterInputProps
  extends Omit<AdapterInitProps, "element"> {
  component: ComponentPublicInstance;
  passIdsToComponent?: (ids: string[]) => void;
}

export class VueSelectionAdapter extends SelectionAdapter {
  private component: ComponentPublicInstance;
  private passIdsToComponent: (ids: string[]) => void;

  static defaultPassIdsToComponent(
    component: ComponentPublicInstance,
    ids: string[]
  ) {
    component.$.props.selectedIds = ids;
  }

  constructor({
    component,
    updateState,
    passIdsToComponent,
  }: VueSelectionAdapterInputProps) {
    super({ updateState, element: component.$el });

    if (!passIdsToComponent) {
      this.passIdsToComponent = (ids) =>
        VueSelectionAdapter.defaultPassIdsToComponent(component, ids);
    } else {
      this.passIdsToComponent = passIdsToComponent;
    }

    this.component = component;
  }

  /** @inheritdoc */
  updateSelection(state: SelectionState): void {
    // No way to update some abstract things. Let the Vue component hanlde this inside Vue.
    this.passIdsToComponent(Array.from(state.selectedItems));
  }
}

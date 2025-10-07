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

export interface AdapterInitProps {
  // updateSelection: (state: SelectionState) => void;
  /**
   * Function that will update the state. Passed from the plugin.
   * @param selected - interpreted data, ready to be passed to state updater.
   * @returns
   */
  updateState: (selected: UpdateStatePayload) => void;
  /**
   * Convert event target to array of data ids.
   * Needed, for example, in case of Histogram, where clicked target represents multiple data-id
   * @param target - event target
   * @returns array of datum ids
   */
  mapTargetToIds?: (target: Element) => string[];

  mapIdsToTargets?: (ids: string[]) => Element[];
  element: HTMLElement;
}

export abstract class SelectionAdapter {
  private abortController: AbortController;

  protected element: HTMLElement;

  /**
   * Update the visual selection state
   * @param state - The current selection state
   */
  abstract updateSelection(state: SelectionState): void;

  protected mapTargetToIds: (target: Element) => string[];

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
        if (!(e.target as Element).closest(`[${METASTANZA_DATA_ATTR}]`)) return;
        const ids = this.mapTargetToIds(e.target as Element);
        // whether it is range or single selection - must be decided in the Plugin, not in here. Here is just getting ids
        // Thats why passing shift key
        //
        updateState({ ids, shiftKey: e.shiftKey });
      },
      { signal: this.abortController.signal }
    );
  }

  destroy(): void {
    this.abortController.abort();
  }
}

interface VanillaSelectionAdapterInputProps extends AdapterInitProps {}

export class DomSelectionAdapter extends SelectionAdapter {
  constructor({ element, updateState }: VanillaSelectionAdapterInputProps) {
    super({ element, updateState });
  }

  /** @inheritdoc */
  updateSelection(state: SelectionState): void {
    const elements = this.mapIdsToTargets(Array.from(state.selectedItems));

    console.log("updateSelection state", state);
    this.element
      .querySelectorAll(`.${METASTANZA_SELECTED_CLASS}`)
      .forEach((el) => {
        el.classList.remove(METASTANZA_SELECTED_CLASS);
      });

    elements.forEach((element) => {
      const dataId = element.getAttribute(METASTANZA_DATA_ATTR);
      if (dataId) {
        element.classList.toggle(
          METASTANZA_SELECTED_CLASS,
          state.selectedItems.has(dataId)
        );
      }
    });
  }
}

interface VueSelectionAdapterInputProps
  extends Omit<AdapterInitProps, "element"> {
  component: ComponentPublicInstance;
}

export class VueSelectionAdapter extends SelectionAdapter {
  private component: ComponentPublicInstance;

  constructor({ component, updateState }: VueSelectionAdapterInputProps) {
    super({ updateState, element: component.$el });

    this.component = component;
  }

  /** @inheritdoc */
  updateSelection(state: SelectionState): void {
    // No way to update some abstract things. Let the Vue component hanlde this inside Vue.
    this.component.$.props.selectedIds = Array.from(state.selectedItems);
  }
}

import { ComponentPublicInstance } from "vue";
import type MetaStanza from "../MetaStanza";
import {
  METASTANZA_EVENTS,
  METASTANZA_COMMON_PARAMS,
  METASTANZA_DATA_ATTR,
} from "../MetaStanza";
import type { BasePlugin } from "./BasePlugin";
import {
  AdapterInitProps,
  DomSelectionAdapter,
  SelectionAdapter,
  VueSelectionAdapter,
} from "./SelectionAdapter";

export const METASTANZA_SELECTED_CLASS = "-selected";

type SelectionPluginName = "selection";

export interface SelectableItem {
  ids: string[];
}

export interface SelectionState {
  selectedItems: Set<string>;
  lastSelected?: string;
  lastListElement?: Element;
}

/** Interface for selection Event's `detail` */
export interface SelectEventPayload {
  selectedIds: string[];
  dataUrl?: string;
  targetId?: string;
}

export interface SelectionPluginI extends BasePlugin {
  name: SelectionPluginName;
  state: SelectionState;
  init(stanza: MetaStanza): void;
  getSelection(): any[];
  clearSelection(): void;
}

const ADAPTER_TYPE = {
  VUE: "vue",
  VANILLA: "vanilla",
} as const;

type AdapterType = (typeof ADAPTER_TYPE)[keyof typeof ADAPTER_TYPE];

const SELECTION_MODE = {
  RANGE: "range",
  SINGLE: "single",
} as const;

type SelectionMode = (typeof SELECTION_MODE)[keyof typeof SELECTION_MODE];

interface UpdateStatePayload {
  ids: string[];
  shiftKey: boolean;
}

type VueSingle = {
  adapter?: typeof ADAPTER_TYPE.VUE;
  mode?: typeof SELECTION_MODE.SINGLE;
  component: ComponentPublicInstance;
  stanza: MetaStanza;
  checkboxMode?: boolean;
} & Omit<
  AdapterInitProps,
  "element" | "updateState" | "mapIdsToTargets" | "mapTargetToIds"
>;

type VueRange = {
  adapter?: typeof ADAPTER_TYPE.VUE;
  mode?: typeof SELECTION_MODE.RANGE;
  component: ComponentPublicInstance;
  stanza: MetaStanza;
  getListElement?: (el: Element | undefined) => Element | undefined | null;
  getTargetElement?: (
    listEl: Element | undefined
  ) => Element | undefined | null;
  checkboxMode?: boolean;
} & Omit<
  AdapterInitProps,
  "element" | "updateState" | "mapIdsToTargets" | "mapTargetToIds"
>;

// Base types without custom methods
type VanillaSingle = {
  adapter?: typeof ADAPTER_TYPE.VANILLA;
  mode?: typeof SELECTION_MODE.SINGLE;
  stanza: MetaStanza;
  checkboxMode?: boolean;
} & Omit<AdapterInitProps, "element" | "updateState">;

type VanillaRange = {
  adapter?: typeof ADAPTER_TYPE.VANILLA;
  mode?: typeof SELECTION_MODE.RANGE;
  stanza: MetaStanza;

  getListElement?: (el: Element | undefined) => Element | undefined | null;
  getTargetElement?: (
    listEl: Element | undefined
  ) => Element | undefined | null;

  checkboxMode?: boolean;
} & Omit<AdapterInitProps, "element" | "updateState">;

// need parent list to be able to pap from index range to ids.
// the thing is that there might be multilple lists! - try just get list element as a parent node! - mb add method to get?
type SelectionPluginInitProps =
  | VueSingle
  | VueRange
  | VanillaSingle
  | VanillaRange;

export class SelectionPlugin implements SelectionPluginI {
  name: SelectionPluginName;
  private stanza: MetaStanza;
  private adapterInstance: SelectionAdapter;
  private checkboxMode: boolean = false;

  /**
   * How to get a list element from a child element
   */
  private getListElement:
    | ((el: Element | undefined) => Element | undefined | null)
    | null = null;
  /**
   * How to get a child element from list child element
   */
  private getTargetElement:
    | ((listEl: Element) => Element | undefined | null)
    | null = null;

  static defaultGetListElement(el: Element | undefined | null) {
    return el?.parentElement;
  }

  /**
   * Default function to return eleme
   * @param listChild - list element's child
   * @returns element to update
   */
  static defaultGetTargetElement(listChild: Element) {
    if (listChild.getAttribute(METASTANZA_DATA_ATTR)) return listChild;
    return listChild.querySelector(`[${METASTANZA_DATA_ATTR}]`);
  }

  readonly mode: SelectionMode;
  readonly adapter: AdapterType;

  private _state: SelectionState = {
    selectedItems: new Set<string>(),
    lastSelected: undefined,
    lastListElement: undefined,
  };

  get state(): SelectionState {
    return this._state;
  }

  constructor(options: SelectionPluginInitProps) {
    this.name = "selection";

    this.stanza = options.stanza;

    this.mode = options.mode || SELECTION_MODE.SINGLE;
    this.adapter = options.adapter || ADAPTER_TYPE.VANILLA;

    if (options.mode === "range") {
      if (options.getListElement) {
        this.getListElement = options.getListElement;
      } else {
        this.getListElement = SelectionPlugin.defaultGetListElement;
      }

      if (options.getTargetElement) {
        this.getTargetElement = options.getTargetElement;
      } else {
        this.getTargetElement = SelectionPlugin.defaultGetTargetElement;
      }
    }

    if (options.checkboxMode) {
      this.checkboxMode = options.checkboxMode;
    }

    switch (this.adapter) {
      case "vanilla": {
        //@ts-ignore
        this.adapterInstance = new DomSelectionAdapter({
          //@ts-ignore
          element: this.stanza._main,
          //@ts-ignore
          ...(options as VanillaSingle | VanillaRange),
          //@ts-ignore
          updateState: this.updateState.bind(this),
        });
        break;
      }
      case "vue": {
        this.adapterInstance = new VueSelectionAdapter({
          ...(options as VueSingle | VueRange),
          updateState: this.updateState.bind(this),
        });
        break;
      }
    }
  }

  init(): void {
    // On incoming selection event (from other stanzas),
    // handle update the selection state
    //@ts-ignore
    this.stanza.handleEvent = (event: CustomEvent<SelectEventPayload>) => {
      if (event.type === METASTANZA_EVENTS.CHANGE_SELECTED_NODES) {
        this.handleIncomingSelection(event.detail);
      }
    };
  }

  private handleIncomingSelection(payload: SelectEventPayload): void {
    // Ignore incoming events if the data is different

    if (
      payload.dataUrl !== this.stanza.params[METASTANZA_COMMON_PARAMS.DATA_URL]
    )
      return;

    // Replace current selection with incoming selection
    this._state.selectedItems = new Set(payload.selectedIds);
    this._state.lastSelected = payload.targetId;

    this.adapterInstance.updateSelection(this.state);
  }

  private notifyOutgoingSelection(): void {
    if (this.stanza.params[METASTANZA_COMMON_PARAMS.DISPATCH_SELECTION_EVENTS])
      this.stanza.emit<SelectEventPayload>(
        METASTANZA_EVENTS.CHANGE_SELECTED_NODES,
        {
          selectedIds: Array.from(this.state.selectedItems),
          dataUrl: this.stanza.params[METASTANZA_COMMON_PARAMS.DATA_URL],
          targetId: this.state.lastSelected,
        }
      );

    // update self
    this.handleIncomingSelection({
      targetId: this.state.lastSelected,
      selectedIds: Array.from(this.state.selectedItems),
      dataUrl: this.stanza.params[METASTANZA_COMMON_PARAMS.DATA_URL],
    });
  }

  /** Handler of the update state event */
  private updateState(selected: UpdateStatePayload) {
    if (selected.shiftKey) {
      if (this.mode === SELECTION_MODE.RANGE) {
        this.onShiftSelectRange(selected.ids);
      } else {
        this.onShiftSelect(selected.ids);
      }
    } else {
      this.onSelect(selected.ids);
      if (this.mode === SELECTION_MODE.RANGE) {
        this._state.lastListElement = this.getListElementByChilId(
          selected.ids[0]
        );
      }
    }

    this.notifyOutgoingSelection();
  }

  /** Get element by data-id  */
  private getElementFromId(id: string): Element | undefined {
    return this.stanza._main.querySelector(`[${METASTANZA_DATA_ATTR}="${id}"]`);
  }

  private getListElementByChilId(id: string): Element {
    return this.getListElement(this.getElementFromId(id));
  }

  /**
   * Adds range to state.
   * @param ids
   */
  private onShiftSelectRange(ids: string[]) {
    const selectedId = ids.at(-1);

    const listElement = this.getListElementByChilId(selectedId);

    if (listElement && listElement !== this.state.lastListElement) {
      this._state.lastListElement = listElement;
      this._state.lastSelected = selectedId;
      return;
    }

    if (!this.state.lastSelected) {
      this._state.lastSelected = selectedId;
    }

    // Need to get the array of children every time because it may change;
    const arrayOfChildren = Array.from(listElement.children);

    const index1 = arrayOfChildren.findIndex(
      (el) =>
        this.getTargetElement(el).getAttribute(METASTANZA_DATA_ATTR) ===
        this.state.lastSelected
    );
    const index2 = arrayOfChildren.findIndex(
      (el) =>
        this.getTargetElement(el).getAttribute(METASTANZA_DATA_ATTR) ===
        selectedId
    );

    if (index1 === -1 || index2 === -1) return;

    const start = Math.min(index1, index2);
    const end = Math.max(index1, index2);

    const newIds: string[] = [];

    for (let i = start; i <= end; i++) {
      const child = this.getTargetElement(arrayOfChildren[i]);
      const id = child.getAttribute(METASTANZA_DATA_ATTR);
      if (id && id !== this.state.lastSelected) newIds.push(id);
    }

    // next ids, since
    this.addIdsToSelection(newIds);
    this._state.lastSelected = selectedId;
    this._state.lastListElement = listElement;
  }

  /**
   * Adds multiple ids to state - on shift + select
   */
  protected onShiftSelect(ids: string[]): void {
    this.addIdsToSelection(ids);
    this._state.lastSelected = ids.at(-1);
  }

  /**
   * Adds last id to the state, if it is different from last selected. If same, the unselect all.s
   */
  onSelect(ids: string[]): void {
    if (!this.checkboxMode) {
      if (this.state.lastSelected === ids.at(-1)) {
        this.clearSelection();
        return;
      }
      this.clearSelection();
    }

    this._state.lastSelected = ids.at(-1);

    this.addIdsToSelection(ids);
  }

  /** Adds ids to the state. if id already in state, removes it */
  private addIdsToSelection(ids: string[]) {
    for (const id of ids) {
      if (this.state.selectedItems.has(id)) {
        this.state.selectedItems.delete(id);
      } else {
        this.state.selectedItems.add(id);
      }
    }
  }

  getSelection(): string[] {
    return Array.from(this.state.selectedItems);
  }

  clearSelection(): void {
    this.state.selectedItems.clear();
    this._state.lastSelected = undefined;
  }

  isSelected(id: string): boolean {
    return this.state.selectedItems.has(id);
  }

  destroy() {
    this._state.lastListElement = undefined;
    this.adapterInstance.destroy();
  }
}

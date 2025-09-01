import type MetaStanza from "../MetaStanza";
import {
  METASTANZA_EVENTS,
  METASTANZA_COMMON_PARAMS,
  METASTANZA_DATA_ATTR,
} from "../MetaStanza";
import type { BasePlugin } from "./BasePlugin";

type SelectionPluginName = "selection";

type SelectionNode = HTMLElement | SVGElement;

export interface SelectableItem {
  id: string;
}

export interface SelectionState {
  selectedItems: Set<string>;
  lastSelected?: string;
}

export interface SelectionPlugin extends BasePlugin {
  name: SelectionPluginName;
  state: SelectionState;
  init(stanza: MetaStanza): void;
  onSelect(event: MouseEvent, target: SelectableItem): void;
  onShiftSelect(event: MouseEvent, target: SelectableItem): void;
  handleIncomingSelection(selectedIds: Set<string>): void;
  getSelection(): any[];
  clearSelection(): void;
}

export abstract class BaseSelectionPlugin implements SelectionPlugin {
  name: SelectionPluginName;
  protected stanza: MetaStanza;

  state: SelectionState = {
    selectedItems: new Set(),
    lastSelected: undefined,
  };

  constructor() {
    this.name = "selection";
  }

  init(stanza: MetaStanza): void {
    this.stanza = stanza;

    this.stanza.element.addEventListener(
      METASTANZA_EVENTS.CHANGE_SELECTED_NODES,
      (e: Event) => {
        this.handleIncomingSelection((e as CustomEvent<Set<string>>).detail);
      }
    );

    this.stanza._main.addEventListener(
      "click",
      this.handleSelection.bind(this)
    );
  }

  handleIncomingSelection(selectedIds: Set<string>): void {
    // Replace current selection with incoming selection
    this.state.selectedItems = new Set(selectedIds);

    // Update lastSelected if needed
    if (this.state.lastSelected && !selectedIds.has(this.state.lastSelected)) {
      this.state.lastSelected = undefined;
    }

    this.updateSelectionClasses();
  }

  protected notifyOutgoingSelection(): void {
    const selectedIds = new Set(this.state.selectedItems);

    if (this.stanza.params[METASTANZA_COMMON_PARAMS.DISPATCH_SELECTION_EVENTS])
      // Notify other stanzas about our selection change
      this.stanza.emit(METASTANZA_EVENTS.CHANGE_SELECTED_NODES, selectedIds);
  }

  /** Event handler for node select */
  handleSelection(event: MouseEvent): void {
    const id = (event.target as SelectionNode)?.getAttribute(
      METASTANZA_DATA_ATTR
    );

    if (
      !this.stanza.params[METASTANZA_COMMON_PARAMS.LISTEN_TO_SELECTION_EVENTS]
    )
      return;

    if (!id) return;

    if (event.shiftKey) {
      this.onShiftSelect(event, { id });
    } else {
      this.onSelect(event, { id });
    }
  }

  /** Select handler - same for any selection plugin, because it's basic */
  onSelect(event: MouseEvent, target: SelectableItem): void {
    const idString = target.id?.toString() ?? "";

    if (this.state.lastSelected === idString) {
      this.clearSelection();
    } else {
      this.clearSelection();
      this.state.selectedItems.add(idString);
      this.state.lastSelected = idString;
    }

    // Trigger update event
    this.notifyOutgoingSelection();

    this.updateSelectionClasses();
  }

  abstract onShiftSelect(event: MouseEvent, target: SelectableItem): void;
  protected abstract updateSelectionClasses(): void;

  getSelection(): any[] {
    return Array.from(this.state.selectedItems);
  }

  clearSelection(): void {
    this.state.selectedItems.clear();
    this.state.lastSelected = undefined;
  }

  isSelected(item: SelectableItem): boolean {
    return this.state.selectedItems.has(item.id);
  }
}

import MetaStanza from "../MetaStanza";

export interface SelectableItem {
  id: string;
}

export interface SelectionState {
  selectedItems: Set<string>;
  lastSelected?: string;
}

export interface SelectionPlugin {
  name: string;
  state: SelectionState;
  init(stanza: MetaStanza): void;
  onSelect(event: MouseEvent, target: any): void;
  onShiftSelect(event: MouseEvent, target: any): void;
  handleIncomingSelection(selectedIds: Set<string>): void;
  getSelection(): any[];
  clearSelection(): void;
}

export abstract class BaseSelectionPlugin implements SelectionPlugin {
  name: string;
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

    this.stanza.element.addEventListener("changeSelectedNodes", (e: Event) => {
      this.handleIncomingSelection((e as CustomEvent<Set<string>>).detail);
    });
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
    const selectedIds = new Set(this.state.selectedItems.keys());

    // Notify other stanzas about our selection change
    this.stanza.emit("changeSelectedNodes", selectedIds);
  }

  abstract onSelect(event: MouseEvent, target: any): void;
  abstract onShiftSelect(event: MouseEvent, target: any): void;
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

import type MetaStanza from "../MetaStanza";
import {
  METASTANZA_EVENTS,
  METASTANZA_COMMON_PARAMS,
  METASTANZA_DATA_ATTR,
} from "../MetaStanza";
import type { BasePlugin } from "./BasePlugin";

export const METASTANZA_SELECTED_CLASS = "-selected";

type SelectionPluginName = "selection";

type SelectionNode = HTMLElement | SVGElement;

export interface SelectableItem {
  id: string;
}

export interface SelectionState {
  selectedItems: Set<string>;
  lastSelected?: string;
}

/** Interface for selection Event's `detail` */
export interface SelectEventPayload {
  selectedIds: string[];
  dataUrl?: string;
  targetId?: string;
}

export interface SelectionPlugin extends BasePlugin {
  name: SelectionPluginName;
  state: SelectionState;
  init(stanza: MetaStanza): void;
  onSelect(event: MouseEvent, target: SelectableItem): void;
  onShiftSelect(event: MouseEvent, target: SelectableItem): void;
  handleIncomingSelection(payload: SelectEventPayload): void;
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
        this.handleIncomingSelection(
          (e as CustomEvent<SelectEventPayload>).detail
        );
      }
    );

    this.stanza._main.addEventListener(
      "click",
      this.handleSelection.bind(this)
    );
  }

  handleIncomingSelection(payload: SelectEventPayload): void {
    // Ignore incoming events if the data is different
    if (
      payload.dataUrl !== this.stanza.params[METASTANZA_COMMON_PARAMS.DATA_URL]
    )
      return;

    // Replace current selection with incoming selection
    this.state.selectedItems = new Set(payload.selectedIds);

    // Update lastSelected if needed
    if (
      this.state.lastSelected &&
      !this.state.selectedItems.has(this.state.lastSelected)
    ) {
      this.state.lastSelected = undefined;
    }

    this.updateSelectionClasses();
  }

  protected notifyOutgoingSelection(): void {
    if (this.stanza.params[METASTANZA_COMMON_PARAMS.DISPATCH_SELECTION_EVENTS])
      this.stanza.emit<SelectEventPayload>(
        METASTANZA_EVENTS.CHANGE_SELECTED_NODES,
        {
          selectedIds: Array.from(this.state.selectedItems),
          dataUrl: this.stanza.params[METASTANZA_COMMON_PARAMS.DATA_URL],
          targetId: this.state.lastSelected,
        }
      );
  }

  /** Update selection classes on DOM nodes */
  protected updateSelectionClasses(): void {
    this.stanza._main
      .querySelectorAll(`[${METASTANZA_DATA_ATTR}]`)
      .forEach((element) => {
        const nodeId = element.getAttribute(METASTANZA_DATA_ATTR);

        if (nodeId) {
          element.classList.toggle(
            METASTANZA_SELECTED_CLASS,
            this.state.selectedItems.has(nodeId)
          );
        }
      });
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

import { BaseSelectionPlugin, SelectableItem } from "./BaseSelectionPlugin";

export class SingleNodeSelection extends BaseSelectionPlugin {
  constructor() {
    super();
  }

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

  onShiftSelect(event: MouseEvent, target: SelectableItem): void {
    const idString = target.id?.toString() ?? "";
    if (!this.state.selectedItems.has(idString)) {
      this.state.selectedItems.add(idString);
      this.state.lastSelected = idString;

      this.notifyOutgoingSelection();
    }
    this.updateSelectionClasses();
  }

  protected updateSelectionClasses(): void {
    // For SVG nodes
    this.stanza._main.querySelectorAll("[data-node-id]").forEach((element) => {
      const nodeId = element.getAttribute("data-node-id");

      if (nodeId) {
        element.classList.toggle(
          "-selected",
          this.state.selectedItems.has(nodeId)
        );
      }
    });

    // For table rows
    this.stanza._main.querySelectorAll("tr[data-id]").forEach((element) => {
      const rowId = element.getAttribute("data-id");
      if (rowId) {
        element.classList.toggle(
          "-selected",
          this.state.selectedItems.has(rowId)
        );
      }
    });
  }
}

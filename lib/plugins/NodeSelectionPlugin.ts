import {
  BaseSelectionPlugin,
  type SelectableItem,
} from "./BaseSelectionPlugin";

export class NodeSelectionPlugin extends BaseSelectionPlugin {
  onSelect(event: MouseEvent, target: SelectableItem): void {
    super.onSelect(event, target);
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
}

import {
  BaseSelectionPlugin,
  type SelectableItem,
} from "./BaseSelectionPlugin";

export class NodeSelectionPlugin extends BaseSelectionPlugin {
  onSelect(event: MouseEvent, target: SelectableItem): void {
    super.onSelect(event, target);
  }

  onShiftSelect(event: MouseEvent, target: SelectableItem): void {
    if (!this.isSelected(target)) {
      const idsString = target.ids?.map(String) ?? [];

      this.addIdsToSelection(idsString);
      this.state.lastSelected = idsString.at(-1);

      this.notifyOutgoingSelection();
    }
    this.updateSelectionClasses();
  }
}

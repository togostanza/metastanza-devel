import {
  BaseSelectionPlugin,
  type BaseSelectionPluginOptions,
  type SelectableItem,
} from "./BaseSelectionPlugin";

export class NodeSelectionPlugin extends BaseSelectionPlugin {
  private static instance: NodeSelectionPlugin;

  static getInstance(options?: BaseSelectionPluginOptions) {
    if (!NodeSelectionPlugin.instance) {
      NodeSelectionPlugin.instance = new NodeSelectionPlugin(options);
    }
    return NodeSelectionPlugin.instance;
  }

  private constructor(options?: BaseSelectionPluginOptions) {
    super(options);
  }

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

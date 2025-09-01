import { METASTANZA_DATA_ATTR } from "../MetaStanza";
import { BaseSelectionPlugin, SelectableItem } from "./BaseSelectionPlugin";

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

  protected updateSelectionClasses(): void {
    // For SVG nodes
    this.stanza._main
      .querySelectorAll(`[${METASTANZA_DATA_ATTR}]`)
      .forEach((element) => {
        const nodeId = element.getAttribute(METASTANZA_DATA_ATTR);

        if (nodeId) {
          element.classList.toggle(
            "-selected",
            this.state.selectedItems.has(nodeId)
          );
        }
      });

    // For table rows - into another plugin
    // this.stanza._main.querySelectorAll("tr[data-id]").forEach((element) => {
    //   const rowId = element.getAttribute("data-id");
    //   if (rowId) {
    //     element.classList.toggle(
    //       "-selected",
    //       this.state.selectedItems.has(rowId)
    //     );
    //   }
    // });
  }
}

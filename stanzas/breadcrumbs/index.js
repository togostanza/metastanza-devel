import { Breadcrumbs } from "./components/Breadcrumbs";
import "./components/BreadcrumbsNode";
import "./components/BreadcrumbsNodeMenu";
import MetaStanza from "@/lib/MetaStanza";
import Tooltip from "@/lib/ToolTip";

export default class BreadcrumbsLit extends MetaStanza {
  menu() {
    return [];
  }

  renderNext() {
    const root = this._main;

    if (isExamplePage.apply(this)) {
      this._main.style = null;
      const overflowEl = this.element.parentElement.parentElement;
      overflowEl.classList.remove("overflow-auto");
    }

    if (this.breadcrumbs) {
      this.breadcrumbs.remove();
    }

    if (this.params["tooltip"] && !this.tooltips) {
      this.tooltips = new Tooltip();
      this.tooltips.setTemplate(this.params["tooltip"]);
      this._main.append(this.tooltips);
    }

    const breadcrumbsConfig = {
      tooltipParams: {
        show: !!this.params["tooltip"],
        tooltipsInstance: this.tooltips,
      },
    };

    this.breadcrumbs = new Breadcrumbs(root, breadcrumbsConfig);

    this.breadcrumbs.updateParams(this.params, this._data);

    this.breadcrumbs.updateComplete.then(this.setupTooltips);
  }

  setupTooltips = () => {
    // Get all breadcrumb nodes that should have tooltips
    const breadcrumbNodes =
      this.breadcrumbs.querySelectorAll("breadcrumbs-node");

    const nodes = [...breadcrumbNodes]
      .map((d) => d.querySelector("[data-tooltip]"))
      .filter(Boolean);

    if (nodes.length > 0) {
      this.tooltips?.setup(nodes);
    }
  };

  handleEvent(e) {
    if (e.details?.id) {
      this.breadcrumbs.setAttribute("currendId", "" + e.details.id);
    }
  }
}

/**
 *
 * @returns true if the page is example page, false otherwise
 */

function isExamplePage() {
  const hostname = window.location.hostname;
  const pageName = window.location.pathname.match(/([^/]+)(?=\.\w+$)/gi);
  const stanzaId = this.metadata["@id"];

  if (
    pageName &&
    pageName[0] === stanzaId &&
    (hostname.includes("metastanza") ||
      hostname.includes("localhost") ||
      hostname.includes("togostanza"))
  ) {
    return true;
  }

  return false;
}

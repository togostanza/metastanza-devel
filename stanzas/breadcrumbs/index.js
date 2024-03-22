import Stanza from "togostanza/stanza";

import { appendCustomCss } from "togostanza-utils";
import loadData from "togostanza-utils/load-data";
import { Breadcrumbs } from "./components/Breadcrumbs";
import "./components/BreadcrumbsNode";
import "./components/BreadcrumbsNodeMenu";

export default class BreadcrumbsLit extends Stanza {
  menu() {
    return [];
  }

  async render() {
    appendCustomCss(this, this.params["togostanza-custom_css_url"]);

    const root = this.root.querySelector("main");

    if (isExamplePage.apply(this)) {
      root.style = null;
      const overflowEl = this.element.parentElement.parentElement;
      overflowEl.classList.remove("overflow-auto");
    }

    if (this.breadcrumbs) {
      this.breadcrumbs.remove();
    }

    this.breadcrumbs = new Breadcrumbs(root);

    const data = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      root,
      5000
    );

    this.breadcrumbs.updateParams(this.params, data);
  }

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

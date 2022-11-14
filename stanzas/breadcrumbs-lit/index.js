import Stanza from "togostanza/stanza";

import { appendCustomCss } from "togostanza-utils";
import { Breadcrumbs } from "./components/Breadcrumbs";
import loadData from "togostanza-utils/load-data";
import "./components/Menu";
import "./components/Node";

export default class BreadcrumbsLit extends Stanza {
  menu() {
    return [];
  }

  async render() {
    appendCustomCss(this, this.params["misc-custom_css_url"]);

    const root = this.root.querySelector("main");

    root.style = null;
    const overflowEl = this.element.parentElement.parentElement;
    overflowEl.classList.remove("overflow-auto");

    if (!this.breadcrumbs) {
      this.breadcrumbs = new Breadcrumbs(root);
    }

    const data = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      root,
      5000
    );

    this.breadcrumbs.updateParams(this.params, data);
  }
}

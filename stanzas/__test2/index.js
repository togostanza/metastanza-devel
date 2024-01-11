import Stanza from "togostanza/stanza";
import loadData from "togostanza-utils/load-data";
import Color from "color";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
  appendCustomCss,
} from "togostanza-utils";
import ToolTip from "@/lib/ToolTip";
import Legend from "@/lib/Legend";

const LINE_HEIGHT = 1;

export default class VennStanza extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "vennstanza"),
      downloadPngMenuItem(this, "vennstanza"),
      downloadJSONMenuItem(this, "vennstanza", this.data),
      downloadCSVMenuItem(this, "vennstanza", this.data),
      downloadTSVMenuItem(this, "vennstanza", this.data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["togostanza-custom_css_url"]);

    this.renderTemplate({ template: "stanza.html.hbs" });
    // console.log(this.params);
  }
}
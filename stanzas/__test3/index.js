import Stanza from "togostanza/stanza";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
  appendCustomCss,
} from "togostanza-utils";

export default class VennStanza extends Stanza {
  receiveData;

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

  handleEvent(event) {
    console.log(event);
    if (event.type !== "changeSelectedNodes") {
      return;
    }
    this.renderTemplate({
      template: "stanza.html.hbs",
      parameters: {
        nodes: event.detail,
      },
    });
  }
}

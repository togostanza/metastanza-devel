import {
  downloadCSVMenuItem,
  downloadJSONMenuItem,
  downloadPngMenuItem,
  downloadSvgMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";
import Stanza from "togostanza/stanza";

export default class VennStanza extends Stanza {
  receivedData;

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
    const dataUrl = this.params["data-url"];
    // if (!dataUrl) {
    //   return;
    // }
    const receivedData = await fetch(dataUrl).then((res) => res.json());
    this.receivedData = receivedData;
    this.renderTemplate({
      template: "stanza.html.hbs",
      parameters: {
        receivedData: JSON.stringify(receivedData, null, "  "),
      },
    });
  }

  get data() {
    return this.receivedData;
  }
}

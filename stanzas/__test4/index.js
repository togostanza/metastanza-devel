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
    console.log(this);
    const dataUrl = this.params["data-url"];
    if (!dataUrl) {
      return;
    }
    console.log(dataUrl);
    const receivedData = await fetch(dataUrl).then((res) => {
      console.log(res);
      return res.json();
    });
    console.log(receivedData);
    this.receivedData = receivedData;
    this.renderTemplate({
      template: "stanza.html.hbs",
      parameters: {
        receivedData: JSON.stringify(receivedData, null, "  "),
      },
    });

    console.log(window);
    window.addEventListener("keyup", (e) => {
      console.log(e);
    });
  }

  get data() {
    return this.receivedData;
  }
}

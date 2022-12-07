import Stanza from "togostanza/stanza";

import loadData from "togostanza-utils/load-data";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  appendCustomCss,
} from "togostanza-utils";

export default class Scorecard extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "scorecard"),
      downloadPngMenuItem(this, "scorecard"),
      downloadJSONMenuItem(this, "scorecard", this._data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom_css_url"]);
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    const dataset = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );

    const key = this.params["score-key"];
    const value = dataset[key];
    this._data = { [key]: value };

    const titleText = this.params["title-text"] || key;

    this.renderTemplate({
      template: "stanza.html.hbs",
      parameters: {
        scorecards: [
          {
            titleText,
            value,
          },
        ],
      },
    });

    const scorecardSvg = this.root.querySelector("#scorecardSvg");
    scorecardSvg.setAttribute(
      "height",
      `${
        Number(css("--togostanza-fonts-font_size_secondary")) +
        Number(css("--togostanza-fonts-font_size_primary"))
      }`
    );

    const keyElement = this.root.querySelector("#key");
    const valueElement = this.root.querySelector("#value");
    if (this.params["title-show"] === false) {
      keyElement.setAttribute(`style`, `display: none;`);
    }

    keyElement.setAttribute(
      "y",
      Number(css("--togostanza-fonts-font_size_secondary"))
    );
    keyElement.setAttribute(
      "fill",
      "var(--togostanza-fonts-font_color_secondary)"
    );
    valueElement.setAttribute(
      "y",
      Number(css("--togostanza-fonts-font_size_secondary")) +
        Number(css("--togostanza-fonts-font_size_primary"))
    );
    valueElement.setAttribute(
      "fill",
      "var(--togostanza-fonts-font_color_primary)"
    );
    keyElement.setAttribute(
      "font-size",
      css("--togostanza-fonts-font_size_secondary")
    );
    valueElement.setAttribute(
      "font-size",
      css("--togostanza-fonts-font_size_primary")
    );
    keyElement.setAttribute(
      "font-weight",
      css("--togostanza-fonts-font_weight_secondary")
    );
    valueElement.setAttribute(
      "font-weight",
      css("--togostanza-fonts-font_weight_primary")
    );
  }
}

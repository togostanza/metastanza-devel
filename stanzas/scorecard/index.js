import Stanza from "togostanza/stanza";
import loadData from "togostanza-utils/load-data";
import { getMarginsFromCSSString } from "../../lib/utils";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
  appendCustomCss,
} from "togostanza-utils";

export default class Scorecard extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "scorecard"),
      downloadPngMenuItem(this, "scorecard"),
      downloadJSONMenuItem(this, "scorecard", this._data),
      downloadCSVMenuItem(this, "scorecard", this._data),
      downloadTSVMenuItem(this, "scorecard", this._data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom_css_url"]);
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    this.renderTemplate({
      template: "stanza.html.hbs",
    });
    const main = this.root.querySelector("main");
    const el = this.root.getElementById("scorecard");

    const dataset = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      main
    );

    const width = parseFloat(css("--togostanza-outline-width")) || 0;
    const height = parseFloat(css("--togostanza-outline-height")) || 0;
    const padding = getMarginsFromCSSString(
      css("--togostanza-outline-padding")
    );
    const fontSizePrimary =
      parseFloat(css("--togostanza-fonts-font_size_primary")) || 0;

    const scoreKey = this.params["score-key"];
    const titleKey = this.params["title-key"];
    const scoreValue = dataset[scoreKey];
    this._data = [{ [scoreKey]: scoreValue }];

    const titleText =
      this.params["title-text"] || dataset[titleKey] || scoreKey;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", padding.LEFT + width + padding.RIGHT);
    svg.setAttribute("height", padding.TOP + height + padding.BOTTOM);
    svg.classList.add("svg");
    el.appendChild(svg);

    const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");
    wrapper.setAttribute(
      "transform",
      `translate(${padding.LEFT + width / 2}, ${padding.TOP + height / 2})`
    );
    svg.appendChild(wrapper);

    const titleKeyText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    titleKeyText.classList.add("title-key");
    titleKeyText.textContent = titleText;
    titleKeyText.setAttribute("text-anchor", "middle");
    wrapper.append(titleKeyText);
    if (this.params["title-show"] === false) {
      titleKeyText.setAttribute(`style`, `display: none;`);
    }

    const scoreValueText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    scoreValueText.classList.add("score-value");
    scoreValueText.textContent = scoreValue;
    scoreValueText.setAttribute("text-anchor", "middle");
    scoreValueText.setAttribute("y", fontSizePrimary);
    wrapper.append(scoreValueText);
  }
}

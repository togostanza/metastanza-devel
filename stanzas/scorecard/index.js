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

    const width = parseFloat(css("--togostanza-canvas-width")) || 0;
    const height = parseFloat(css("--togostanza-canvas-height")) || 0;
    const padding = getMarginsFromCSSString(css("--togostanza-canvas-padding"));
    const fontSizePrimary =
      parseFloat(css("--togostanza-fonts-font_size_primary")) || 0;
    const fontSizeSecondary =
      parseFloat(css("--togostanza-fonts-font_size_secondary")) || 0;

    const scoreKey = this.params["data-score_key"];
    const titleKey = this.params["data-title_key"];
    const scoreValue = dataset[scoreKey];
    const titleText = dataset[titleKey];
    this._data = [{ [scoreKey]: scoreValue }];

    const prefixText = this.params["data-prefix"];
    const suffixText = this.params["data-suffix"];
    const affixSpace = 5;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    const scale = Math.min(
      width / (width + padding.LEFT + padding.RIGHT),
      height / (height + padding.TOP + padding.BOTTOM)
    );
    svg.classList.add("svg");
    el.appendChild(svg);

    const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.appendChild(wrapper);

    const titleKeyText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    titleKeyText.classList.add("title-key");
    titleKeyText.textContent = titleText;
    titleKeyText.setAttribute("text-anchor", "middle");
    wrapper.append(titleKeyText);

    const scoreWrapper = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    wrapper.appendChild(scoreWrapper);

    const scoreValueText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    scoreValueText.classList.add("score-value");
    scoreValueText.textContent = scoreValue;
    scoreValueText.setAttribute("text-anchor", "middle");
    scoreWrapper.append(scoreValueText);

    const prefixValueText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    prefixValueText.classList.add("prefix-value");
    prefixValueText.textContent = prefixText;
    prefixValueText.setAttribute("text-anchor", "end");
    prefixValueText.setAttribute(
      "x",
      -scoreValueText.getBBox().width / 2 - affixSpace
    );
    scoreWrapper.append(prefixValueText);

    const suffixValueText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    suffixValueText.classList.add("suffix-value");
    suffixValueText.textContent = suffixText;
    suffixValueText.setAttribute(
      "x",
      scoreValueText.getBBox().width / 2 + affixSpace
    );
    scoreWrapper.append(suffixValueText);

    if (titleText) {
      titleKeyText.setAttribute("y", fontSizeSecondary);
      scoreValueText.setAttribute("y", fontSizePrimary + fontSizeSecondary);
      prefixValueText.setAttribute("y", fontSizePrimary + fontSizeSecondary);
      suffixValueText.setAttribute("y", fontSizePrimary + fontSizeSecondary);
    } else {
      titleKeyText.setAttribute(`style`, `display: none;`);
      scoreValueText.setAttribute("y", fontSizePrimary);
      prefixValueText.setAttribute("y", fontSizePrimary);
      suffixValueText.setAttribute("y", fontSizePrimary);
    }

    wrapper.setAttribute(
      "transform",
      `translate(${width / 2 + padding.LEFT},
      ${
        height / 2 - wrapper.getBBox().height / 2 + padding.TOP
      }) scale(${scale})`
    );
  }
}

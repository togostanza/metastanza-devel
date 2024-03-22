import {
  downloadCSVMenuItem,
  downloadJSONMenuItem,
  downloadPngMenuItem,
  downloadSvgMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";
import MetaStanza from "../../lib/MetaStanza";

export default class Scorecard extends MetaStanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "scorecard"),
      downloadPngMenuItem(this, "scorecard"),
      downloadJSONMenuItem(this, "scorecard", this._data),
      downloadCSVMenuItem(this, "scorecard", this._data),
      downloadTSVMenuItem(this, "scorecard", this._data),
    ];
  }

  async renderNext() {
    const root = this._main;
    const dataset = this._data;
    // Parameters
    const scoreKey = this.params["data-score_key"].trim();
    const titleKey = this.params["data-title_key"].trim();
    const scoreValue = dataset[scoreKey];
    const titleText = dataset[titleKey];
    const prefixText = this.params["affix-prefix"];
    const suffixText = this.params["affix-suffix"];
    this._data = [{ [titleText]: scoreValue }];
    // Styles
    const width = parseFloat(this.css("--togostanza-canvas-width")) || 0;
    const height = parseFloat(this.css("--togostanza-canvas-height")) || 0;
    const padding = this.MARGIN;
    const fontSizePrimary =
      parseFloat(this.css("--togostanza-fonts-font_size_primary")) || 0;
    const fontSizeSecondary =
      parseFloat(this.css("--togostanza-fonts-font_size_secondary")) || 0;

    //Drawing svg
    const existSvg = this.root.querySelectorAll(".svg");
    if (existSvg.length > 0) {
      existSvg.forEach((svg) => svg.parentNode.removeChild(svg));
    }
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    root.append(svg);

    const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");
    wrapper.classList.add("wrapper");
    svg.append(wrapper);

    const titleSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    titleSvg.classList.add("title");
    titleSvg.textContent = titleText;
    titleSvg.setAttribute("text-anchor", "middle");
    wrapper.append(titleSvg);

    const scoreWrapper = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    scoreWrapper.classList.add("score-wrapper");
    scoreWrapper.setAttribute("text-anchor", "middle");
    wrapper.append(scoreWrapper);

    const prefixSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "tspan"
    );
    prefixSvg.classList.add("prefix");
    prefixSvg.textContent = prefixText;
    scoreWrapper.append(prefixSvg);

    const scoreSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "tspan"
    );
    scoreSvg.classList.add("score");
    scoreSvg.textContent = scoreValue;
    scoreWrapper.append(scoreSvg);

    const suffixSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "tspan"
    );
    suffixSvg.classList.add("suffix");
    suffixSvg.textContent = suffixText;
    scoreWrapper.append(suffixSvg);

    if (titleText) {
      titleSvg.setAttribute("y", fontSizeSecondary);
      scoreWrapper.setAttribute("y", fontSizePrimary + fontSizeSecondary);
    } else {
      titleSvg.setAttribute(`style`, `display: none;`);
      scoreWrapper.setAttribute("y", fontSizePrimary);
    }

    const wrapperWidth = wrapper.getBoundingClientRect().width;
    const wrapperHeight = wrapper.getBoundingClientRect().height;
    const scale = () => {
      const minScale = Math.min(
        Math.min(
          (width - padding.LEFT - padding.RIGHT) / wrapperWidth,
          (height - padding.TOP - padding.BOTTOM) / wrapperHeight
        ),
        1
      );
      if (minScale < 0) {
        return 0;
      }
      return minScale;
    };

    wrapper.setAttribute(
      "transform",
      `translate(${width / 2},${
        height / 2 - ((fontSizePrimary + fontSizeSecondary) * scale()) / 2
      }) scale(${scale()})`
    );
  }
}

import './transform-53933414.js';
import { o as ordinal } from './ordinal-90a3df9a.js';
import { l as linear } from './linear-546377fb.js';

//Parent class for stanza
class StanzaColorGenerator {
  /**
   * @param {HTMLElement} self - Information of the stanza
   * @return {object}  - Colors based on "togostanza them"
   */
  constructor(self) {
    this.self = self;
  }

  //Create object of colors based on "togostanza-theme-series"
  static getColorSeries(stanza) {
    const getPropertyValue = (key) =>
      window.getComputedStyle(stanza.element).getPropertyValue(key);
    const series = [];
    let index = 0;
    let color = getPropertyValue(`--togostanza-theme-series_${index}_color`);
    while (color) {
      series.push(color.trim());
      color = getPropertyValue(`--togostanza-theme-series_${++index}_color`);
    }
    return { stanzaColors: series, firstColor: series[0] };
  }

  //Get stanzaColor
  get stanzaColor() {
    const stanza = this.self;
    return StanzaColorGenerator.getColorSeries(stanza).stanzaColors;
  }
}

//CirculateColorGenerator class for stanza
class StanzaCirculateColorGenerator extends StanzaColorGenerator {
  /**
   * @param {array} data - Array of data
   * @param {array} colorGroup - Array of specified color group
   */
  constructor(self, data, colorGroup) {
    super(self);
    const stanza = this.self;
    const stanzaColor = StanzaColorGenerator.getColorSeries(stanza);
    const colorRange = stanzaColor.stanzaColors.slice(1, 6);
    this.firstColor = stanzaColor.firstColor;

    //Create array for domain and define color scale
    const groups = Array.from(
      new Set(data.flatMap((d) => d[colorGroup])).delete(undefined)
    );
    this.groupColor = ordinal().domain(groups).range(colorRange);
  }

  get defaultColor() {
    return this.firstColor;
  }

  getColor(datum) {
    return this.groupColor(datum);
  }
}

//Generate color scheme for gradation pattern
function getGradationColor(self, colorRange, colorDomain) {
  /**
   * @param {HTMLElement} self - Information of the stanza
   * @param {array} colorRange - [minColor, midColor, maxColor]
   * @param {array} colorDomain - [minNumber, midNumber, maxNumber]
   */

  colorRange = colorRange.filter(Boolean);
  let colors = colorRange;
  let domain = colorDomain;

  if (colorRange.length === 1 || colorRange.length === 0) {
    colors = StanzaColorGenerator.getColorSeries(self).stanzaColors;

    const delta = (colorDomain[2] - colorDomain[0]) / (colors.length - 1);
    domain = [...Array(colors.length)].map(
      (_, index) => colorDomain[0] + index * delta
    );
  }

  return linear()
    .domain(domain)
    .range(colors)
    .clamp(true)
    .unknown("#555");
}

//Generate color scheme for StanzaInterpolateColor pattern
function getStanzaInterpolateColor(self, colorNum) {
  /**
   * @param {HTMLElement} self - Information of the stanza
   * @param {number} colorNum - Number of colors
   */

  const stazaColors = StanzaColorGenerator.getColorSeries(self).stanzaColors;
  const domains = [];
  for (let i = 0; i < stazaColors.length; i++) {
    domains.push((colorNum / stazaColors.length) * i);
  }

  return linear().domain(domains).range(stazaColors);
}

export { StanzaColorGenerator as S, getGradationColor as a, StanzaCirculateColorGenerator as b, getStanzaInterpolateColor as g };
//# sourceMappingURL=ColorGenerator-769dc7a1.js.map

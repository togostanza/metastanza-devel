import { scaleOrdinal, scaleLinear } from "d3";

export default function getStanzaColors(stanza) {
  /**
   * @param {object} stanza - Information of the stanza
   * @return {object} - Colors based on "togostanza theme"
   */

  const getPropertyValue = (key) =>
    window.getComputedStyle(stanza.element).getPropertyValue(key);

  const stanzaColors = [];
  let index = 0;

  let color = getPropertyValue(`--togostanza-theme-series_${index}_color`);
  while (color) {
    stanzaColors.push(color.trim());
    color = getPropertyValue(`--togostanza-theme-series_${++index}_color`);
  }

  return stanzaColors;
}

export function getCirculateColor(stanza, data, colorGroup) {
  /**
   * @param {object} stanza - Information of the stanza
   * @param {array} data - Array of data
   * @param {array} colorGroup - Array of specified color group
   */

  const stanzaColors = getStanzaColors(stanza);
  const groups = Array.from(
    new Set(data.flatMap((d) => d[colorGroup])).delete(undefined)
  );

  return {
    stanzaColors,
    groupColor: scaleOrdinal().domain(groups).range(stanzaColors.slice(1, 6)),
  };
}

export function getGradationColor(stanza, colorRange, colorDomain) {
  /**
   * @param {object} stanza - Information of the stanza
   * @param {array} colorRange - [minColor, midColor, maxColor]
   * @param {array} colorDomain - [minNumber, midNumber, maxNumber]
   */

  colorRange = colorRange.filter(Boolean);
  let colors = colorRange;
  let domain = colorDomain;

  if (colorRange.length === 1 || colorRange.length === 0) {
    colors = getStanzaColors(stanza);

    const delta = (colorDomain[2] - colorDomain[0]) / (colors.length - 1);
    domain = [...Array(colors.length)].map(
      (_, index) => colorDomain[0] + index * delta
    );
  }

  return scaleLinear().domain(domain).range(colors).clamp(true).unknown("#555");
}

export function getInterpolateColor(stanza, colorNum) {
  /**
   * @param {object} stanza - Information of the stanza
   * @param {number} colorNum - Number of colors
   */

  const stazaColors = getStanzaColors(stanza);
  const domains = [];
  for (let i = 0; i < stazaColors.length; i++) {
    domains.push((colorNum / stazaColors.length) * i);
  }

  return scaleLinear().domain(domains).range(stazaColors);
}

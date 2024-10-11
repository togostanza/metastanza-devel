import * as d3 from "d3";

import MetaStanza from "../../lib/MetaStanza";

// ダンベルグラフのデータ
const data = {
  max: 30,
  min: 10,
  mid: 20,
};

export default class KeyValue extends MetaStanza {
  async renderNext() {
    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    // svg のサイズ
    const width = 500;
    const height = 50;

    const MARGINS = {
      right: 20,
      left: 20,
    };

    const svgElement = this.root.querySelector("#dumbell");

    // 描画する領域の幅
    const canvasWidth = width - MARGINS.left - MARGINS.right;

    const svg = d3.select(svgElement);

    svg.attr("width", width).attr("height", height);

    const x = d3
      .scaleLinear()
      .domain([data.min, data.max])
      .range([0, canvasWidth]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${MARGINS.left}, ${height / 2})`);

    g.append("line")
      .attr("x1", x(data.min))
      .attr("x2", x(data.max))
      .attr("stroke", "blue")
      .attr("stroke-width", 2);

    g.append("circle")
      .attr("cx", x(data.min))
      .attr("r", 5)
      .attr("fill", "blue");

    g.append("circle")
      .attr("cx", x(data.max))
      .attr("r", 5)
      .attr("fill", "blue");

    g.append("circle").attr("cx", x(data.mid)).attr("r", 5).attr("fill", "red");
  }
}

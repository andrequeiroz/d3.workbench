Number.prototype.zeros = function(tam) {
  var n = String(this);
  while (n.length < (tam || 2)) {
    n = "0" + n;
  }
  return n;
}

function gerarMapa(malha) {
  var largura = 350;
  var altura = 350;

  var cores = d3.scaleLinear()
                .domain([0, 1])
                .range(["gold", "darkgreen"]);

  var area = d3.select("body")
               .append("svg")
               .attr("width", largura)
               .attr("height", altura)
               .append("g");

  // [[x_e, y_c], [x_r, y_b]]
  var projecaoAlbers = d3.geoEquirectangular()
                         .fitExtent([[0, 0], [largura, altura]], malha);

  var poligonos = d3.geoPath()
                    .projection(projecaoAlbers);

  var corMem = "";
  area.selectAll("path")
      .data(malha.features)
      .enter()
      .append("path")
      .attr("id", function(d) { return "poly" + d.properties.id.zeros(2); })
      .attr("fill", function(d) { return cores(Math.random()); })
      .attr("stroke", "black")
      .attr("d", poligonos)
      .on("mouseover", function() {
        corMem = d3.select(this).attr("fill");
        d3.select(this)
          .attr("fill", "lightblue");
      })
      .on("mouseout", function() {
        d3.select(this)
          .attr("fill", corMem);
        corMem = "";
      });
}

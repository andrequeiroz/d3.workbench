function gerarMapa(malha) {
  var largura = 350;
  var altura = 350;

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

  area.selectAll("path")
      .data(malha.features)
      .enter()
      .append("path")
      .attr("fill", "darkgreen")
      .attr("stroke", "black")
      .attr("d", poligonos)
      .on("mouseover", function() {
        d3.select(this)
          .attr("fill", "lightgreen");
      })
      .on("mouseout", function() {
        d3.select(this)
          .attr("fill", "darkgreen");
      });
}

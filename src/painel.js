function executar(dados) {

  d3.json(dados).then(function(x) {

    var painel = d3.select("body")
                   .append("div")
                   .attr("id", "painel");

    painel.append("p")
          .text("Prova: ")
          .append("select")
          .attr("id", "seletor")
          .selectAll("option")
          .data(x)
          .enter()
          .append("option")
          .attr("value", function(d) { return d.codigo; })
          .text(function(d) { return d.prova; });

    var prova = x.filter(function(el) {
      return el.codigo === seletor.options[seletor.selectedIndex].value;
    });
    prova = prova[0];
    console.log(prova);
  });
}

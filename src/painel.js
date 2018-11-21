function executar(dados) {

  d3.json(dados).then(function(x) {

    // painel principal
    var painel = d3.select("body")
                   .append("div")
                   .attr("id", "painel");

    // seletor de provas
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

    // menu de opções
    var paineis = [ "Masculino", "Feminino" ];
    var menu = painel.append("div")
                     .attr("id", "painel-menu");

    var botoes = menu.selectAll("button")
                     .data(paineis)
                     .enter()
                     .append("button")
                     .attr("class", "painel-botoes")
                     .text(function(d) { return d; })

    prova = prova[0];
    console.log(prova);
  });
}

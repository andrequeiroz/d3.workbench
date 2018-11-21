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

    // menu de opções
    var paineis = [ { "painel": "Masculino", "funcao": "painelMasculino(dados)" },
                    { "painel": "Feminino", "funcao": "painelFeminino(dados)" } ];

    painel.append("div")
          .attr("id", "painel-menu")
          .selectAll("button")
          .data(paineis)
          .enter()
          .append("button")
          .attr("class", "painel-botoes")
          .attr("onclick", function(d) { return d.funcao; })
          .text(function(d) { return d.painel; });

    painelMasculino(dados);
  });
}

// filtrar os dados
function filtrarDados(dados) {

  var resultado = dados.filter(function(el) {
    return el.codigo === seletor.options[seletor.selectedIndex].value;
  });

  resultado = resultado[0];

  return resultado;
}

// área de visualização
function criarArea() {

  // checar se área já existe
  var elemento = document.getElementById("painel-area");

  if (elemento != null) {
    d3.select("body")
      .select("div#painel-area")
      .remove();
  }

  var resultado = d3.select("body")
                    .append("div")
                    .attr("id", "painel-area");

  return resultado;
}

function painelMasculino(dados) {

  d3.json(dados).then(function(x) {

    var area = criarArea();

    area.append("p")
        .text("Painel Masculino");

    prova = filtrarDados(x);
    console.log("masc");
  });
}

function painelFeminino(dados) {

  d3.json(dados).then(function(x) {

    var area = criarArea();

    area.append("p")
        .text("Painel Feminino");

    prova = filtrarDados(x);
    console.log("fem");
  });
}

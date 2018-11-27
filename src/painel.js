const lerDatas = d3.timeParse("%Y-%m-%d");

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
    var paineis = [{ "painel": "Masculino", "id": "bMasculino", "funcao": "painelMasculino(dados, this.id)" },
                   { "painel": "Feminino", "id": "bFeminino", "funcao": "painelFeminino(dados, this.id)" }];

    painel.append("div")
          .attr("id", "painel-menu")
          .selectAll("button")
          .data(paineis)
          .enter()
          .append("button")
          .attr("id", function(d) { return d.id; })
          .attr("class", "painel-botoes")
          .attr("onclick", function(d) { return d.funcao; })
          .text(function(d) { return d.painel; });

    painelMasculino(dados, "bMasculino");
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

// marcar botão clicado
function destacarBotao(botao) {

  // pintar todos de branco
  d3.selectAll("button.painel-botoes")
    .style("background-color", "inherit")
    .style("color", "inherit")
    .on("mouseover", function() {
      d3.select(this)
        .style("background-color", "lightblue");
    })
    .on("mouseout", function() {
      d3.select(this)
        .style("background-color", "inherit");
    });

  // pintar o selecionado de azul
  d3.select("button#" + botao)
    .style("background-color", "steelblue")
    .style("color", "aliceblue")
    .on("mouseover", null)
    .on("mouseout", null);
}

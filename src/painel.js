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
    var paineis = [{ "painel": "Masculino", "funcao": "painelMasculino(dados)" },
                   { "painel": "Feminino", "funcao": "painelFeminino(dados)" }];

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

    const largura = 500;
    const altura = 300;
    const margens = {c: 38, d: 10, b: 30, e: 60};
    const dimensoes = {l: largura - margens.e - margens.d, a: altura - margens.c - margens.b};

    prova = filtrarDados(x);

    var serie = [];
    for (var i = 0; i < prova.registros.masculino.length; i++) {
      serie.push(prova.registros.masculino[i]);
    }

    var dataInicial = d3.min(serie, function(d) { return lerDatas(d.data); });
    var dataFinal = d3.max(serie, function(d) { return lerDatas(d.data); });

    var media = d3.mean(serie, function(d) { return d.tempo; });

    var xEscalaTempo = d3.scaleTime()
                         .domain([dataInicial, dataFinal])
                         .range([0, dimensoes.l]);

    var yEscala = d3.scaleLinear()
                    .domain([ .95 * d3.min(serie, function(d) { return d.tempo; }),
                             1.05 * d3.max(serie, function(d) { return d.tempo; })])
                    .range([dimensoes.a, 0]);

    var xEixo = d3.axisBottom()
                  .scale(xEscalaTempo);

    var yEixo = d3.axisLeft()
                  .scale(yEscala);

    var linhaInicial = d3.line()
                         .x(function(d) { return xEscalaTempo(lerDatas(d.data)); })
                         .y(yEscala(media));

    var linha = d3.line()
                  .x(function(d) { return xEscalaTempo(lerDatas(d.data)); })
                  .y(function(d) { return yEscala(d.tempo)});

    var grafico = d3.select("div#painel-area")
                    .append("svg")
                    .attr("width", largura)
                    .attr("height", altura)
                    .append("g")
                    .attr("transform", "translate(" + margens.e + ", " + margens.c + ")");

    grafico.append("text")
           .attr("x", -margens.e + 5)
           .attr("y", 0 - margens.c / 2)
           .text("Recordes de natação");

    grafico.append("g")
           .attr("class", "eixoX")
           .transition()
           .duration(1000)
           .ease(d3.easeBounce)
           .attr("transform", "translate(0, " + dimensoes.a + ")")
           .call(xEixo);

    grafico.append("g")
           .attr("class", "eixoY")
           .attr("transform", "translate(" + -margens.e + ", 0)")
           .transition()
           .duration(1200)
           .attr("transform", "translate(0, 0)")
           .call(yEixo);

    grafico.append("path")
           .datum(serie)
           .attr("class", "serie")
           .attr("d", linhaInicial);

    grafico.select("path.serie")
           .transition()
           .delay(1000)
           .duration(1200)
           .attr("d", linha);

    d3.select("select#seletor")
      .on("change", function() {
        prova = filtrarDados(x);

        serie = [];
        for (var i = 0; i < prova.registros.masculino.length; i++) {
          serie.push(prova.registros.masculino[i]);
        }

        dataInicial = d3.min(serie, function(d) { return lerDatas(d.data); });
        dataFinal = d3.max(serie, function(d) { return lerDatas(d.data); });

        xEscalaTempo = d3.scaleTime()
                         .domain([dataInicial, dataFinal])
                         .range([0, dimensoes.l]);

        yEscala = d3.scaleLinear()
                    .domain([ .95 * d3.min(serie, function(d) { return d.tempo; }),
                             1.05 * d3.max(serie, function(d) { return d.tempo; })])
                    .range([dimensoes.a, 0]);

        xEixo = d3.axisBottom()
                  .scale(xEscalaTempo);

        yEixo = d3.axisLeft()
                  .scale(yEscala);

        linha = d3.line()
                  .x(function(d) { return xEscalaTempo(lerDatas(d.data)); })
                  .y(function(d) { return yEscala(d.tempo)});

        grafico.select("g.eixoX")
               .transition()
               .duration(1000)
               .call(xEixo);

        grafico.select("g.eixoY")
               .transition()
               .duration(1200)
               .call(yEixo);

        grafico.select("path.serie")
               .datum(serie)
               .transition()
               .duration(1200)
               .attr("d", linha);
      })
  });
}

function painelFeminino(dados) {

  d3.json(dados).then(function(x) {

    var area = criarArea();

    const largura = 500;
    const altura = 300;
    const margens = {c: 38, d: 10, b: 30, e: 60};
    const dimensoes = {l: largura - margens.e - margens.d, a: altura - margens.c - margens.b};

    prova = filtrarDados(x);

    var serie = [];
    for (var i = 0; i < prova.registros.feminino.length; i++) {
      serie.push(prova.registros.feminino[i]);
    }

    var dataInicial = d3.min(serie, function(d) { return lerDatas(d.data); });
    var dataFinal = d3.max(serie, function(d) { return lerDatas(d.data); });

    var media = d3.mean(serie, function(d) { return d.tempo; });

    var xEscalaTempo = d3.scaleTime()
                         .domain([dataInicial, dataFinal])
                         .range([0, dimensoes.l]);

    var yEscala = d3.scaleLinear()
                    .domain([ .95 * d3.min(serie, function(d) { return d.tempo; }),
                             1.05 * d3.max(serie, function(d) { return d.tempo; })])
                    .range([dimensoes.a, 0]);

    var xEixo = d3.axisBottom()
                  .scale(xEscalaTempo);

    var yEixo = d3.axisLeft()
                  .scale(yEscala);

    var linhaInicial = d3.line()
                         .x(function(d) { return xEscalaTempo(lerDatas(d.data)); })
                         .y(yEscala(media));

    var linha = d3.line()
                  .x(function(d) { return xEscalaTempo(lerDatas(d.data)); })
                  .y(function(d) { return yEscala(d.tempo)});

    var grafico = d3.select("div#painel-area")
                    .append("svg")
                    .attr("width", largura)
                    .attr("height", altura)
                    .append("g")
                    .attr("transform", "translate(" + margens.e + ", " + margens.c + ")");

    grafico.append("text")
           .attr("x", -margens.e + 5)
           .attr("y", 0 - margens.c / 2)
           .text("Recordes de natação");

    grafico.append("g")
           .attr("class", "eixoX")
           .transition()
           .duration(1000)
           .ease(d3.easeBounce)
           .attr("transform", "translate(0, " + dimensoes.a + ")")
           .call(xEixo);

    grafico.append("g")
           .attr("class", "eixoY")
           .attr("transform", "translate(" + -margens.e + ", 0)")
           .transition()
           .duration(1200)
           .attr("transform", "translate(0, 0)")
           .call(yEixo);

    grafico.append("path")
           .datum(serie)
           .attr("class", "serie")
           .attr("d", linhaInicial);

    grafico.select("path.serie")
           .transition()
           .delay(1000)
           .duration(1200)
           .attr("d", linha);

    d3.select("select#seletor")
      .on("change", function() {
        prova = filtrarDados(x);

        serie = [];
        for (var i = 0; i < prova.registros.feminino.length; i++) {
          serie.push(prova.registros.feminino[i]);
        }

        dataInicial = d3.min(serie, function(d) { return lerDatas(d.data); });
        dataFinal = d3.max(serie, function(d) { return lerDatas(d.data); });

        xEscalaTempo = d3.scaleTime()
                         .domain([dataInicial, dataFinal])
                         .range([0, dimensoes.l]);

        yEscala = d3.scaleLinear()
                    .domain([ .95 * d3.min(serie, function(d) { return d.tempo; }),
                             1.05 * d3.max(serie, function(d) { return d.tempo; })])
                    .range([dimensoes.a, 0]);

        xEixo = d3.axisBottom()
                  .scale(xEscalaTempo);

        yEixo = d3.axisLeft()
                  .scale(yEscala);

        linha = d3.line()
                  .x(function(d) { return xEscalaTempo(lerDatas(d.data)); })
                  .y(function(d) { return yEscala(d.tempo)});

        grafico.select("g.eixoX")
               .transition()
               .duration(1000)
               .call(xEixo);

        grafico.select("g.eixoY")
               .transition()
               .duration(1200)
               .call(yEixo);

        grafico.select("path.serie")
               .datum(serie)
               .transition()
               .duration(1200)
               .attr("d", linha);
      })
  });
}

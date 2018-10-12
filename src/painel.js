const lerDatas = d3.timeParse("%Y-%m-%d");

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

    var menu = painel.append("nav")
                     .attr("id", "menu")
                     .append("ul");

    menu.selectAll("li")
        .data(["Masculino", "Feminino"])
        .enter()
        .append("li")
        .text(function(d) { return d; });

    var sexo = "feminino";
    var serie = prova.registros[sexo];

    // gráfico 1
    const largura1 = 500;
    const altura1 = 300;
    const margens1 = { c: 38, d: 10, b: 30, e: 60 };
    const dim1 = { l: largura1 - margens1.e - margens1.d, a: altura1 - margens1.c - margens1.b};

    var grafico1 = painel.append("div")
                         .attr("id", "g1")
                         .append("svg")
                         .attr("width", largura1)
                         .attr("height", altura1)
                         .append("g")
                         .attr("transform", "translate(" + margens1.e + ", " + margens1.c + ")");

    var xEscala = d3.scaleTime()
                    .domain([d3.min(serie, function(d) { return lerDatas(d.data); }), new Date()])
                    .range([0, dim1.l]);

    var yEscala = d3.scaleLinear()
                    .domain([0.95 * d3.min(serie, function(d) { return d.tempo; }),
                             1.05 * d3.max(serie, function(d) { return d.tempo; })])
                    .range([dim1.a, 0]);

    var xEixo = d3.axisBottom()
                  .scale(xEscala);

    var yEixo = d3.axisLeft()
                  .scale(yEscala);

    var linha = d3.line()
                  .x(function(d) { return xEscala(lerDatas(d.data)); })
                  .y(function(d) { return yEscala(d.tempo); });

    grafico1.append("g")
            .attr("transform", "translate(0, " + dim1.a + ")")
            .call(xEixo);

    grafico1.append("g")
            .call(yEixo);

    grafico1.append("path")
            .datum(serie)
            .attr("class", "serie")
            .attr("d", linha);
  });
}

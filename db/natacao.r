library(rvest)
library(dplyr)
library(lubridate)
library(RJSONIO)

lista <- list()

base <- data.frame(paginas = c("https://en.wikipedia.org/wiki/World_record_progression_50_metres_freestyle",
                               "https://en.wikipedia.org/wiki/World_record_progression_100_metres_freestyle"),
                   codigos = c("fs50", "fs100"),
                   provas = c("50m Freestyle", "100m Freestyle")) %>%
  mutate_all(funs(as.character(.)))

for (.p in 1:nrow(base)) {

  prova <- list()
  prova[[1]] <- base[.p, "codigos"]
  prova[[2]] <- base[.p, "provas"]

  registros <- list()
  for (.categoria in c(1, 3)) {

    .x <- read_html(base[.p, "paginas"]) %>%
      html_table(fill = TRUE) %>%
      .[[.categoria]] %>%
      select(2, 4:6) %>%
      mutate(Time = if_else(grepl(":", Time),
                            period_to_seconds(ms(Time)),
                            as.double(Time)),
             Date = parse_date_time(Date, orders = c("mdy", "dmy")))

    .temp <- list()
    .registro <- list()
    for (.i in 1:nrow(.x)) {
      .registro[[1]] <- as.character(.x[.i, "Date"])
      .registro[[2]] <- .x[.i, "Name"]
      .registro[[3]] <- .x[.i, "Nationality"]
      .registro[[4]] <- .x[.i, "Time"]
      .temp[[.i]] <- structure(.registro, names = c("data", "nome", "nacionalidade", "tempo"))
    }

    registros[[(.categoria + 1) / 2]] <- .temp
  }

  prova[[3]] <- structure(registros, names = c("masculino", "feminino"))
  lista[[.p]] <- structure(prova, names = c("codigo", "prova", "registros"))
}

toJSON(lista) %>%
  write("/tmp/natacao.json")

import assert from "node:assert/strict";
import { test } from "node:test";
import {
  dataValida,
  domingoDaSemana,
  formatarKg,
  formatarVariacao,
  hojeNoBrasil,
  lerNumero,
  rotuloDaSemana,
  segundaDaSemana,
} from "./semana.ts";

test("segunda-feira continua sendo ela mesma", () => {
  assert.equal(segundaDaSemana("2026-11-09"), "2026-11-09");
});

test("domingo pertence à semana que COMEÇOU na segunda anterior", () => {
  assert.equal(segundaDaSemana("2026-11-15"), "2026-11-09");
});

test("meio de semana volta para a segunda", () => {
  assert.equal(segundaDaSemana("2026-11-11"), "2026-11-09");
  assert.equal(segundaDaSemana("2026-11-14"), "2026-11-09");
});

test("virada de mês e de ano", () => {
  assert.equal(segundaDaSemana("2026-12-01"), "2026-11-30"); // terça -> segunda do mês anterior
  assert.equal(segundaDaSemana("2027-01-01"), "2026-12-28"); // sexta
  assert.equal(segundaDaSemana("2024-03-01"), "2024-02-26"); // ano bissexto
});

test("domingo da semana e rótulo", () => {
  assert.equal(domingoDaSemana("2026-11-09"), "2026-11-15");
  assert.equal(rotuloDaSemana("2026-11-30"), "30/11 a 06/12");
});

test("datas inválidas são recusadas", () => {
  assert.equal(dataValida("2026-11-09"), true);
  assert.equal(dataValida("2026-02-30"), false);
  assert.equal(dataValida("09/11/2026"), false);
  assert.equal(dataValida(""), false);
});

test("hoje no Brasil usa o horário de Brasília", () => {
  // 02:00 UTC de 10/11 ainda é noite de 09/11 em Brasília (UTC-3)
  assert.equal(hojeNoBrasil(new Date("2026-11-10T02:00:00Z")), "2026-11-09");
  assert.equal(hojeNoBrasil(new Date("2026-11-10T15:00:00Z")), "2026-11-10");
});

test("lerNumero aceita vírgula e ponto, no máximo 1 casa decimal", () => {
  assert.equal(lerNumero("72,5"), 72.5);
  assert.equal(lerNumero("72.5"), 72.5);
  assert.equal(lerNumero(" 80 "), 80);
  assert.equal(lerNumero("172"), 172);
  assert.equal(lerNumero("72,55"), null);
  assert.equal(lerNumero("abc"), null);
  assert.equal(lerNumero(""), null);
  assert.equal(lerNumero("-5"), null);
  assert.equal(lerNumero("1e3"), null);
});

test("formatação em português", () => {
  assert.equal(formatarKg(72.5), "72,5 kg");
  assert.equal(formatarKg(80), "80,0 kg");
  assert.equal(formatarVariacao(-0.8), "−0,8 kg");
  assert.equal(formatarVariacao(1.2), "+1,2 kg");
  assert.equal(formatarVariacao(0), "0,0 kg");
  assert.equal(formatarVariacao(0.04), "0,0 kg");
});

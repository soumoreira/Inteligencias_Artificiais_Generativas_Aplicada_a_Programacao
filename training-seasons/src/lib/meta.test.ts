import assert from "node:assert/strict";
import { test } from "node:test";
import { faltaParaMeta } from "./meta.ts";

test("perder peso: ainda falta", () => {
  assert.deepEqual(faltaParaMeta(90, 85.5, 80), { atingida: false, falta: 5.5 });
});

test("perder peso: meta atingida ou ultrapassada", () => {
  assert.deepEqual(faltaParaMeta(90, 80, 80), { atingida: true, falta: 0 });
  assert.deepEqual(faltaParaMeta(90, 79.2, 80), { atingida: true, falta: 0 });
});

test("perder peso: engordou além do peso inicial", () => {
  assert.deepEqual(faltaParaMeta(90, 92, 80), { atingida: false, falta: 12 });
});

test("ganhar peso: ainda falta", () => {
  assert.deepEqual(faltaParaMeta(60, 63.4, 70), { atingida: false, falta: 6.6 });
});

test("ganhar peso: meta atingida", () => {
  assert.deepEqual(faltaParaMeta(60, 70.1, 70), { atingida: true, falta: 0 });
});

test("manter o peso", () => {
  assert.deepEqual(faltaParaMeta(70, 70, 70), { atingida: true, falta: 0 });
  assert.deepEqual(faltaParaMeta(70, 71.5, 70), { atingida: false, falta: 1.5 });
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { questionsFor, domains, type Length } from "./scoring";
import {
  explainQuestion,
  traitExplanations,
  facetExplanations,
} from "./explanations";

for (const length of [120, 300] as Length[]) {
  test(`${length}: every statement has an individual reading explanation`, () => {
    for (const q of questionsFor(length)) {
      const help = explainQuestion(q.text);
      assert.ok(help && help.length > 30, `Missing reading help: ${q.text}`);
      assert.notEqual(help, q.text);
    }
  });
}
test("all five traits and thirty facets have full reading guides", () => {
  assert.equal(Object.keys(traitExplanations).length, 5);
  assert.equal(Object.keys(facetExplanations).length, 30);
  const scales = [
    ...domains.map((d) => traitExplanations[d.id]),
    ...new Set(questionsFor(300).map((q) => q.facet)),
  ].map((x) => (typeof x === "string" ? facetExplanations[x] : x));
  for (const guide of scales) {
    assert.ok(guide);
    for (const field of ["meaning", "lower", "higher", "reflection"] as const)
      assert.ok(guide[field].length > 30);
  }
});
test("short-form wording variant and source whitespace resolve to their matching explanations", () => {
  assert.equal(
    explainQuestion("Believe that there is no absolute right and wrong."),
    explainQuestion("Believe that there is no absolute right or wrong."),
  );
  assert.equal(
    explainQuestion(
      "Believe that criminals should receive help rather than \n punishment.",
    ),
    explainQuestion(
      "Believe that criminals should receive help rather than punishment.",
    ),
  );
  assert.match(explainQuestion("Seldom feel blue."), /rarely feel sad/);
  assert.match(explainQuestion("Often feel blue."), /sad or low/);
});

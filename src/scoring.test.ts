import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseSession,
  questionsFor,
  score,
  type Answers,
  type Length,
} from "./scoring";

for (const length of [120, 300] as Length[]) {
  test(`${length}: complete item bank with balanced facets`, () => {
    const questions = questionsFor(length);
    assert.equal(questions.length, length);
    assert.equal(new Set(questions.map((q) => q.id)).size, length);
    for (const facet of new Set(questions.map((q) => q.facet)))
      assert.equal(
        questions.filter((q) => q.facet === facet).length,
        length / 30,
      );
    assert.equal(new Set(questions.map((q) => q.facet)).size, 30);
    assert.equal(questions[0].text, "Worry about things.");
  });
  test(`${length}: all neutral answers yield midpoint on every scale`, () => {
    const answers = Object.fromEntries(
      questionsFor(length).map((q) => [q.id, 3]),
    );
    for (const d of score(length, answers)) {
      assert.equal(d.position, 50);
      assert.equal(d.mean, 3);
      assert.equal(d.total, (length / 5) * 3);
      for (const f of d.facets) assert.equal(f.position, 50);
    }
  });
  test(`${length}: reverse scoring produces exact minima and maxima`, () => {
    for (const maximum of [false, true]) {
      const answers = Object.fromEntries(
        questionsFor(length).map((q) => [q.id, q.reverse !== maximum ? 5 : 1]),
      );
      for (const d of score(length, answers)) {
        assert.equal(d.position, maximum ? 100 : 0);
        assert.equal(d.total, maximum ? d.max : d.min);
        for (const f of d.facets) assert.equal(f.position, maximum ? 100 : 0);
      }
    }
  });
  test(`${length}: incomplete and invalid answers cannot produce results`, () => {
    assert.throws(() => score(length, {}));
    for (const invalid of [0, 6, 1.5, NaN]) {
      const answers: Answers = Object.fromEntries(
        questionsFor(length).map((q) => [q.id, 3]),
      );
      answers[questionsFor(length)[0].id] = invalid;
      assert.throws(() => score(length, answers));
    }
  });
}
test("published negative key and positive key score in opposite directions", () => {
  const questions = questionsFor(300);
  assert.equal(
    questions.find((q) => q.text === "Am relaxed most of the time.")?.reverse,
    true,
  );
  assert.equal(
    questions.find((q) => q.text === "Worry about things.")?.reverse,
    false,
  );
  const answers = Object.fromEntries(questions.map((q) => [q.id, 3]));
  const relaxed = questions.find(
    (q) => q.text === "Am relaxed most of the time.",
  )!;
  answers[relaxed.id] = 5;
  assert.equal(score(300, answers).find((d) => d.id === "N")?.total, 178);
});
test("saved progress validation rejects corruption and repairs bounds", () => {
  assert.equal(parseSession("{broken"), null);
  assert.equal(
    parseSession(JSON.stringify({ version: 1, length: 15, answers: {} })),
    null,
  );
  const restored = parseSession(
    JSON.stringify({
      version: 1,
      length: 120,
      answers: { "N1-0": 5, "E1-0": 9, unknown: 3 },
      index: 999,
      completed: true,
    }),
  );
  assert.equal(restored?.index, 119);
  assert.deepEqual(restored?.answers, { "N1-0": 5 });
  assert.equal(restored?.completed, false);
});

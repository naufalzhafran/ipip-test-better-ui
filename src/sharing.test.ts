import { test } from "node:test";
import assert from "node:assert/strict";
import { questionsFor, score, type Session, type Length } from "./scoring";
import { shareUrl, readSharedResult } from "./sharing";

for (const length of [120, 300] as Length[]) {
  test(`${length}: shared link preserves every answer and all scores`, () => {
    const session: Session = {
      version: 1,
      length,
      completed: true,
      index: 0,
      answers: Object.fromEntries(
        questionsFor(length).map((q, i) => [q.id, (i % 5) + 1]),
      ),
    };
    for (const sample of [false, true]) {
      const url = new URL(
        shareUrl("https://example.com/?preview=results#old", session, sample),
      );
      assert.equal(url.search, "");
      assert.ok(url.href.length < 400);
      const restored = readSharedResult(url.hash)!;
      assert.deepEqual(restored.session.answers, session.answers);
      assert.equal(restored.sample, sample);
      assert.deepEqual(
        score(length, restored.session.answers),
        score(length, session.answers),
      );
    }
  });
}
test("malformed, truncated, unsupported and invalid response links are rejected", () => {
  for (const hash of [
    "",
    "#result=v2.120.profile." + "3".repeat(120),
    "#result=v1.120.profile." + "3".repeat(119),
    "#result=v1.300.profile." + "3".repeat(301),
    "#result=v1.120.profile." + "0".repeat(120),
    "#result=v1.120.profile." + "6".repeat(120),
    "#result=v1.121.profile." + "3".repeat(121),
    "#result=v1.120.other." + "3".repeat(120),
  ])
    assert.equal(readSharedResult(hash), null);
});
test("incomplete sessions cannot be shared", () => {
  assert.throws(() =>
    shareUrl("https://example.com", {
      version: 1,
      length: 120,
      completed: false,
      index: 0,
      answers: {},
    }),
  );
  assert.throws(() =>
    shareUrl("https://example.com", {
      version: 1,
      length: 120,
      completed: true,
      index: 0,
      answers: {},
    }),
  );
});

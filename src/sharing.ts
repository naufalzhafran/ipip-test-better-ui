import { questionsFor, score, type Session, type Length } from "./scoring";

// Version 1 fixes question order and the 1–5 response encoding to this inventory.
export function shareUrl(
  base: string,
  session: Session,
  sample = false,
): string {
  if (!session.completed)
    throw new Error("Finish the questionnaire before sharing.");
  score(session.length, session.answers);
  const answers = questionsFor(session.length)
    .map((q) => session.answers[q.id])
    .join("");
  const url = new URL(base);
  url.search = "";
  url.hash = `result=v1.${session.length}.${sample ? "sample" : "profile"}.${answers}`;
  return url.href;
}

export function readSharedResult(
  hash: string,
): { session: Session; sample: boolean } | null {
  const match = /^#result=v1\.(120|300)\.(sample|profile)\.([1-5]+)$/.exec(
    hash,
  );
  if (!match) return null;
  const length = Number(match[1]) as Length;
  if (match[3].length !== length) return null;
  return {
    sample: match[2] === "sample",
    session: {
      version: 1,
      length,
      completed: true,
      index: length - 1,
      answers: Object.fromEntries(
        questionsFor(length).map((q, i) => [q.id, Number(match[3][i])]),
      ),
    },
  };
}

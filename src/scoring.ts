import bank from "./items.json";

export type Length = 120 | 300;
export type Answers = Record<string, number>;
export type Question = {
  id: string;
  facet: string;
  text: string;
  reverse: boolean;
};
export const domains = [
  {
    id: "O",
    name: "Openness",
    subtitle: "Ideas, imagination & new experiences",
    description:
      "Openness describes your interest in ideas, creativity, feelings, and unfamiliar experiences.",
    low: "Familiarity, concrete ideas, and established routines",
    high: "Imagination, curiosity, and variety",
  },
  {
    id: "C",
    name: "Conscientiousness",
    subtitle: "Structure, intentions & follow-through",
    description:
      "Conscientiousness describes how you organize your life, approach responsibilities, and follow through on plans.",
    low: "Spontaneity and a flexible approach to plans",
    high: "Organization, deliberation, and persistence",
  },
  {
    id: "E",
    name: "Extraversion",
    subtitle: "Social energy & engagement",
    description:
      "Extraversion describes your tendency to seek social interaction, activity, excitement, and positive emotion.",
    low: "Quieter settings and less social stimulation",
    high: "Social engagement, activity, and outward expression",
  },
  {
    id: "A",
    name: "Agreeableness",
    subtitle: "Trust, cooperation & consideration",
    description:
      "Agreeableness describes your approach to other people, including trust, cooperation, and concern for their needs.",
    low: "Skepticism, directness, and competitive approaches",
    high: "Trust, cooperation, and consideration for others",
  },
  {
    id: "N",
    name: "Neuroticism",
    subtitle: "Sensitivity to stress & difficult emotions",
    description:
      "Neuroticism describes your tendency to experience stress and difficult emotions. The name refers to a personality dimension, not a diagnosis.",
    low: "Emotional steadiness and less stress reactivity",
    high: "Greater sensitivity to stress and difficult emotions",
  },
];

export function questionsFor(length: Length): Question[] {
  const facets = bank[String(length) as "120" | "300"];
  const questions: Question[] = [];
  for (let item = 0; item < length / 30; item++) {
    for (let facet = 1; facet <= 6; facet++) {
      for (const domain of ["N", "E", "O", "A", "C"]) {
        const scale = facets.find((f) => f.id === domain + facet)!;
        questions.push({
          id: `${scale.id}-${item}`,
          facet: scale.id,
          ...scale.items[item],
        });
      }
    }
  }
  return questions;
}

export function score(length: Length, answers: Answers) {
  const questions = questionsFor(length);
  if (
    questions.some(
      (q) =>
        !Number.isInteger(answers[q.id]) ||
        answers[q.id] < 1 ||
        answers[q.id] > 5,
    )
  ) {
    throw new Error("Answer every question before viewing your results.");
  }
  const summarize = (items: Question[]) => {
    const total = items.reduce(
      (sum, q) => sum + (q.reverse ? 6 - answers[q.id] : answers[q.id]),
      0,
    );
    return {
      total,
      min: items.length,
      max: items.length * 5,
      mean: total / items.length,
      position: ((total - items.length) / (items.length * 4)) * 100,
    };
  };
  return domains.map((domain) => ({
    ...domain,
    ...summarize(questions.filter((q) => q.facet[0] === domain.id)),
    facets: bank[String(length) as "120" | "300"]
      .filter((f) => f.id[0] === domain.id)
      .map((f) => ({
        id: f.id,
        name: f.name,
        ...summarize(questions.filter((q) => q.facet === f.id)),
      })),
  }));
}

export type Session = {
  version: 1;
  length: Length;
  answers: Answers;
  index: number;
  completed: boolean;
};
export function parseSession(raw: string | null): Session | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    if (
      value.version !== 1 ||
      ![120, 300].includes(value.length) ||
      !value.answers ||
      typeof value.answers !== "object" ||
      Array.isArray(value.answers)
    )
      return null;
    const questions = questionsFor(value.length);
    const answers: Answers = {};
    for (const q of questions)
      if (
        Number.isInteger(value.answers[q.id]) &&
        value.answers[q.id] >= 1 &&
        value.answers[q.id] <= 5
      )
        answers[q.id] = value.answers[q.id];
    return {
      version: 1,
      length: value.length,
      answers,
      index: Number.isInteger(value.index)
        ? Math.max(0, Math.min(value.length - 1, value.index))
        : 0,
      completed:
        value.completed === true &&
        Object.keys(answers).length === value.length,
    };
  } catch {
    return null;
  }
}

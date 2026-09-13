import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  domains,
  parseSession,
  questionsFor,
  score,
  type Length,
  type Session,
} from "./scoring";
import "./style.css";
import {
  explainQuestion,
  traitExplanations,
  facetExplanations,
  type Explanation,
} from "./explanations";

const STORAGE = "ipip-session-v1";
const preview =
  new URLSearchParams(window.location.search).get("preview") === "results";
const choices = [
  "Very inaccurate",
  "Moderately inaccurate",
  "Neither accurate nor inaccurate",
  "Moderately accurate",
  "Very accurate",
];
const choiceHelp = [
  "This is not like me.",
  "This is mostly unlike me.",
  "I am in between; neither side fits better.",
  "This is mostly like me.",
  "This is very much like me.",
];

function ReadingGuide({ explanation }: { explanation: Explanation }) {
  return (
    <div className="reading-guide">
      <div className="tendency-grid">
        <div>
          <h3>What the lower end can look like</h3>
          <p>{explanation.lower}</p>
        </div>
        <div>
          <h3>What the higher end can look like</h3>
          <p>{explanation.higher}</p>
        </div>
      </div>
      <p className="reflection">
        <strong>A question to reflect on</strong>
        {explanation.reflection}
      </p>
      {explanation.note && (
        <p className="interpretation-note">{explanation.note}</p>
      )}
    </div>
  );
}
function initial() {
  if (preview) {
    const base: Record<string, number> = { O: 4, C: 4, E: 3, A: 4, N: 2 };
    return {
      version: 1 as const,
      length: 120 as const,
      index: 119,
      completed: true,
      answers: Object.fromEntries(
        questionsFor(120).map((q, i) => {
          const keyed = Math.max(
            1,
            Math.min(5, base[q.facet[0]] + (i % 4 === 0 ? -1 : 0)),
          );
          return [q.id, q.reverse ? 6 - keyed : keyed];
        }),
      ),
    };
  }
  try {
    return parseSession(localStorage.getItem(STORAGE));
  } catch {
    return null;
  }
}

function App() {
  const [session, setSession] = useState<Session | null>(initial);
  const [view, setView] = useState<"start" | "test" | "results">(
    preview ? "results" : "start",
  );
  const [length, setLength] = useState<Length>(session?.length ?? 120);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("ipip-theme") === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });
  const [storageError, setStorageError] = useState(false);
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState<"about" | "review" | "reset" | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const questions = questionsFor(session?.length ?? length);
  const answered = Object.keys(session?.answers ?? {}).length;
  const question = questions[session?.index ?? 0];
  const currentAnswer = session?.answers[question.id];
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("ipip-theme", theme);
    } catch {
      /* Theme still works in memory. */
    }
  }, [theme]);
  useEffect(() => {
    if (!session || preview) return;
    try {
      localStorage.setItem(STORAGE, JSON.stringify(session));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [session]);
  useEffect(() => {
    if (modal) dialog.current?.showModal();
    else dialog.current?.close();
  }, [modal]);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    setMessage("");
  }, [view, session?.index]);
  useEffect(() => {
    let expanded: HTMLDetailsElement[] = [];
    const prepare = () => {
      expanded = Array.from(
        document.querySelectorAll<HTMLDetailsElement>("details:not([open])"),
      );
      expanded.forEach((detail) => {
        detail.open = true;
      });
    };
    const restore = () => {
      expanded.forEach((detail) => {
        detail.open = false;
      });
      expanded = [];
    };
    window.addEventListener("beforeprint", prepare);
    window.addEventListener("afterprint", restore);
    return () => {
      window.removeEventListener("beforeprint", prepare);
      window.removeEventListener("afterprint", restore);
    };
  }, []);

  function select(value: number) {
    setSession((s) =>
      s
        ? {
            ...s,
            completed: false,
            answers: { ...s.answers, [question.id]: value },
          }
        : s,
    );
    setMessage("");
  }
  function next() {
    if (!session) return;
    if (!currentAnswer) {
      setMessage("Choose the response that best describes you to continue.");
      return;
    }
    if (session.index < session.length - 1)
      setSession({ ...session, index: session.index + 1 });
    else if (answered !== session.length) {
      setMessage(
        "A few questions still need an answer. Review them before viewing your results.",
      );
      setModal("review");
    } else {
      setSession({ ...session, completed: true });
      setView("results");
    }
  }
  useEffect(() => {
    function key(event: KeyboardEvent) {
      if (
        view !== "test" ||
        modal ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      )
        return;
      if (/^[1-5]$/.test(event.key)) {
        event.preventDefault();
        select(Number(event.key));
      }
      if (
        event.key === "Enter" &&
        (document.activeElement === heading.current ||
          document.activeElement === document.body ||
          document.activeElement?.tagName === "INPUT")
      ) {
        event.preventDefault();
        next();
      }
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });
  function start() {
    setSession({ version: 1, length, answers: {}, index: 0, completed: false });
    setView("test");
    setModal(null);
  }
  function resume() {
    setView(session?.completed ? "results" : "test");
  }
  function jump(index: number) {
    if (session) setSession({ ...session, index });
    setView("test");
    setModal(null);
  }
  function download() {
    if (!session) return;
    const blob = new Blob(
      [
        JSON.stringify(
          {
            instrument: `IPIP-NEO-${session.length}`,
            sample: preview,
            scoring:
              "Raw keyed scores and position within the possible scale range; not population percentiles.",
            results: score(session.length, session.answers).map((d) => ({
              ...d,
              explanation: traitExplanations[d.id],
              facets: d.facets.map((f) => ({
                ...f,
                explanation: facetExplanations[f.id],
              })),
            })),
            responses: questions.map((q) => ({
              ...q,
              answer: session.answers[q.id],
            })),
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ipip-neo-${session.length}-results.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <>
      <header className="header">
        <button
          className="wordmark"
          onClick={() => setView("start")}
          aria-label="IPIP home"
        >
          ipip<span>Personality inventory</span>
        </button>
        <div className="header-actions">
          <button className="text-button" onClick={() => setModal("about")}>
            About the test
          </button>
          <button
            className="theme-button"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M20 15a8 8 0 0 1-11-11 8 8 0 1 0 11 11Z" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
              </svg>
            )}
          </button>
        </div>
      </header>
      {storageError && (
        <div className="warning" role="status">
          Your browser couldn’t save your progress. You can continue, but keep
          this tab open until you finish.
        </div>
      )}
      <main>
        {preview && (
          <div className="warning" role="status">
            <strong>Sample results.</strong> These use synthetic answers, not
            your responses. Nothing in this preview replaces your saved test.{" "}
            <a href="/">Return to your test</a>
          </div>
        )}
        {view === "start" && (
          <div className="start-layout">
            <section className="introduction">
              <p className="eyebrow">The Big Five · IPIP-NEO</p>
              <h1 ref={heading} tabIndex={-1}>
                Your personality,
                <br />
                <em>in perspective.</em>
              </h1>
              <p className="intro-copy">
                A little time to reflect on how you think, feel, and relate to
                the world. Build a picture of your personality across five broad
                dimensions.
              </p>
              <div className="trait-index">
                {domains.map((d, i) => (
                  <div key={d.id}>
                    <span className="index-number">0{i + 1}</span>
                    <span>{d.name}</span>
                    <span className="trait-subtitle">{d.subtitle}</span>
                  </div>
                ))}
              </div>
              <p className="source-line">
                Based on the public-domain IPIP-NEO inventory.
                <br />
                Adapted from the work of John A. Johnson.
              </p>
            </section>
            <section className="setup-panel" aria-labelledby="setup-title">
              <span className="section-number">Before you begin</span>
              <h2 id="setup-title">
                Make a little room
                <br />
                for yourself.
              </h2>
              <p>
                Choose the length that works for you. Both versions cover the
                same five traits and 30 facets.
              </p>
              {session && (
                <div className="resume-box">
                  <div>
                    <strong>
                      {session.completed
                        ? "Your profile is ready"
                        : "Pick up where you left off"}
                    </strong>
                    <p>
                      {answered} of {session.length} questions answered
                    </p>
                  </div>
                  <button className="primary" onClick={resume}>
                    {session.completed
                      ? "View your results"
                      : "Resume your test"}
                  </button>
                </div>
              )}
              <fieldset className="length-options">
                <legend>Choose your test</legend>
                {([120, 300] as Length[]).map((n) => (
                  <label
                    key={n}
                    className={`length-choice ${length === n ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="length"
                      value={n}
                      checked={length === n}
                      onChange={() => setLength(n)}
                    />
                    <span>
                      <strong>
                        {n === 120 ? "The short version" : "The full version"}
                      </strong>
                      <small>
                        {n} questions · {n === 120 ? "10–20" : "30–40"} minutes
                      </small>
                    </span>
                  </label>
                ))}
              </fieldset>
              <div className="instructions">
                <p>
                  Answer as you usually are, rather than how you would like to
                  be. There are no right or wrong answers.
                </p>
                <p>
                  Your answers stay in this browser. You can pause and return on
                  this device.
                </p>
              </div>
              <button
                className="primary start-button"
                onClick={() => (session ? setModal("reset") : start())}
              >
                {session ? "Start a new test" : "Begin the questionnaire"}
                <span aria-hidden="true">↗</span>
              </button>
              <p className="disclaimer">
                For self-reflection, not a clinical diagnosis.
              </p>
            </section>
          </div>
        )}
        {view === "test" && session && (
          <div className="test-layout">
            <aside className="progress-rail">
              <p className="eyebrow">Your questionnaire</p>
              <h2>
                One honest
                <br />
                answer at a time.
              </h2>
              <p className="muted">IPIP-NEO-{session.length}</p>
              <div className="progress-copy">
                <strong>
                  {Math.round((answered / session.length) * 100)}%
                </strong>
                <span>
                  {answered} / {session.length} answered
                </span>
              </div>
              <progress
                max={session.length}
                value={answered}
                aria-label="Questions answered"
              />
              <div className="chapter-list">
                {Array.from({ length: session.length / 30 }, (_, i) => {
                  const completed = questions
                    .slice(i * 30, i * 30 + 30)
                    .filter((q) => session.answers[q.id]).length;
                  return (
                    <button
                      key={i}
                      className={
                        Math.floor(session.index / 30) === i ? "current" : ""
                      }
                      onClick={() => jump(i * 30)}
                    >
                      <span className="chapter-number">
                        {completed === 30
                          ? "✓"
                          : String(i + 1).padStart(2, "0")}
                      </span>
                      <span>
                        Questions {i * 30 + 1}–{i * 30 + 30}
                      </span>
                      <small>{completed}/30</small>
                    </button>
                  );
                })}
              </div>
              <button
                className="text-button review-button"
                onClick={() => setModal("review")}
              >
                Review your answers
              </button>
              <div className="save-note">
                <span aria-hidden="true">{storageError ? "!" : "✓"}</span>
                <span>
                  {storageError
                    ? "Progress is not saved"
                    : "Progress saved on this device"}
                </span>
              </div>
              <button className="text-button" onClick={() => setView("start")}>
                Pause and exit
              </button>
            </aside>
            <section className="question-area">
              <div className="question-meta">
                <span>
                  Question {String(session.index + 1).padStart(2, "0")}{" "}
                  <span className="muted">of {session.length}</span>
                </span>
                <span className="muted">Think about your everyday self.</span>
              </div>
              <h1 ref={heading} tabIndex={-1}>
                {question.text}
              </h1>
              <div className="question-explanation" id="question-explanation">
                <span>In everyday words</span>
                <p>{explainQuestion(question.text)}</p>
              </div>
              <p className="question-prompt" id="answer-instruction">
                How well does the original statement describe your usual self?
              </p>
              <fieldset
                className="answers"
                aria-describedby="question-explanation answer-instruction"
              >
                <legend className="sr-only">Choose an answer</legend>
                {choices.map((label, i) => (
                  <label
                    className={`answer ${currentAnswer === i + 1 ? "selected" : ""}`}
                    key={label}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      checked={currentAnswer === i + 1}
                      onChange={() => select(i + 1)}
                      value={i + 1}
                    />
                    <span className="key-number" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span className="answer-label">
                      {label}
                      <small>{choiceHelp[i]}</small>
                    </span>
                    <span className="radio-mark" aria-hidden="true" />
                  </label>
                ))}
              </fieldset>
              <p className="validation" role="status">
                {message}
              </p>
              <div className="question-controls">
                <button
                  className="secondary"
                  disabled={session.index === 0}
                  onClick={() => jump(session.index - 1)}
                >
                  Back
                </button>
                <button className="primary" onClick={next}>
                  {session.index === session.length - 1
                    ? "See my results"
                    : "Next question"}
                  <span aria-hidden="true">→</span>
                </button>
              </div>
              <p className="keyboard-hint">
                Use keys <kbd>1</kbd>–<kbd>5</kbd> to choose, then{" "}
                <kbd>Enter</kbd> to continue.
              </p>
            </section>
          </div>
        )}
        {view === "results" && session?.completed && (
          <div className="results-layout">
            <div className="results-header">
              <div>
                <p className="eyebrow">
                  Your IPIP-NEO-{session.length} profile
                </p>
                <h1 ref={heading} tabIndex={-1}>
                  Many dimensions.
                  <br />
                  <em>One you.</em>
                </h1>
                <p>
                  A snapshot of how you described yourself today.
                  <br />
                  Use it as a starting point for reflection.
                </p>
              </div>
              <div className="result-actions">
                <button className="primary" onClick={download}>
                  Download results (.json)
                </button>
                <button
                  className="text-button"
                  onClick={() => setModal("review")}
                >
                  Review your answers
                </button>
              </div>
            </div>
            <div className="score-note">
              <strong>How to read your profile</strong>
              <p>
                Bars show where your score falls within the possible score
                range, from 0 to 100. These are{" "}
                <b>not population percentiles</b>. Higher and lower scores
                describe different tendencies; they are not grades. This app
                does not reproduce the original site’s age- and sex-based
                comparisons.
              </p>
            </div>
            <div className="results-reading-help">
              <h2>Start with the five traits</h2>
              <p>
                A trait is a broad pattern, like enjoying company. Each trait
                has six smaller parts, called <strong>facets</strong>. Those
                parts can differ: someone can be friendly but prefer small
                gatherings. Open the facet details to see that extra detail.
              </p>
              <p>
                A score of 50 is halfway between this questionnaire’s lowest and
                highest possible scores. It does not mean “average person.” Read
                the two ends below as examples to reflect on, not as rules about
                who you are.
              </p>
            </div>
            <div className="results-list">
              {score(session.length, session.answers).map((d, i) => (
                <section className="domain-result" key={d.id}>
                  <div className="domain-title">
                    <span className="index-number">0{i + 1}</span>
                    <h2>{d.name}</h2>
                    <span className="score-number">
                      {Math.round(d.position)}
                      <small>/100</small>
                    </span>
                  </div>
                  <p>{traitExplanations[d.id].meaning}</p>
                  <div
                    className="score-bar"
                    role="img"
                    aria-label={`${d.name}: ${Math.round(d.position)} out of 100, scale position`}
                  >
                    <span style={{ width: `${d.position}%` }} />
                  </div>
                  <div className="scale-labels">
                    <span>Lower end</span>
                    <span>Higher end</span>
                  </div>
                  <ReadingGuide explanation={traitExplanations[d.id]} />
                  <details>
                    <summary>
                      Understand the six parts of {d.name.toLowerCase()}{" "}
                      <span>
                        Raw score {d.total} · range {d.min}–{d.max}
                      </span>
                    </summary>
                    <div className="facets">
                      {d.facets.map((f) => (
                        <article className="facet-detail" key={f.id}>
                          <div className="facet">
                            <h3>{f.name}</h3>
                            <div className="facet-bar">
                              <span style={{ width: `${f.position}%` }} />
                            </div>
                            <strong>
                              {Math.round(f.position)}
                              <small>/100</small>
                            </strong>
                            <small>
                              Raw {f.total} / {f.max}
                            </small>
                          </div>
                          <p className="facet-meaning">
                            {facetExplanations[f.id].meaning}
                          </p>
                          <ReadingGuide explanation={facetExplanations[f.id]} />
                        </article>
                      ))}
                    </div>
                  </details>
                </section>
              ))}
            </div>
            <div className="results-bottom">
              <p>
                Personality has context. Your responses can vary with your
                circumstances and how you interpret the questions. Facet names
                follow the published inventory.
              </p>
              <button className="secondary" onClick={() => setView("start")}>
                Back to test options
              </button>
            </div>
          </div>
        )}
      </main>
      <footer>
        <span>IPIP-NEO · A tool for self-reflection</span>
        <a
          href="https://drj60472.virtualave.net/IPIP/index.html"
          target="_blank"
          rel="noreferrer"
        >
          Original inventory ↗
        </a>
      </footer>
      <dialog
        ref={dialog}
        onCancel={() => setModal(null)}
        onClick={(e) => {
          if (e.target === dialog.current) setModal(null);
        }}
      >
        <div className="dialog-heading">
          <h2>
            {modal === "about"
              ? "About this questionnaire"
              : modal === "reset"
                ? "Start a new test?"
                : "Your answers"}
          </h2>
          <button
            className="close-button"
            aria-label="Close dialog"
            onClick={() => setModal(null)}
          >
            ×
          </button>
        </div>
        {modal === "about" && (
          <div className="about-content">
            <p>
              This independent interface uses the public-domain IPIP-NEO items.
              It is not affiliated with John A. Johnson or the original website.
            </p>
            <h3>Five traits. Thirty facets.</h3>
            <p>
              The 120-item version uses four questions per facet. The 300-item
              version uses ten. Question wording and scoring direction follow
              the published item keys; presentation order has been adapted.
            </p>
            <h3>Help with the wording</h3>
            <p>
              Each original statement has a plain-language explanation, and the
              answer choices include simple labels. These reading aids were
              written for this app; they are not part of the original inventory,
              and their effect on responses has not been validated. Answer the
              original statement using your usual experience.
            </p>
            <h3>Understanding the results</h3>
            <p>
              The examples describe possible tendencies at either end of a
              scale. They are not personalized predictions, and the reflection
              questions are prompts rather than advice or diagnoses.
            </p>
            <h3>Transparent scoring</h3>
            <p>
              Responses score from 1 to 5. Reverse-keyed items score from 5 to
              1. Facet scores sum their items, and trait scores sum the six
              facets. The displayed 0–100 scale position is (score − minimum) ÷
              (maximum − minimum) × 100. No population norms are applied.
            </p>
            <h3>Your data</h3>
            <p>
              Answers and progress are stored in this browser’s local storage.
              This app sends no answers to a server. Anyone using this browser
              profile can access the saved test. Starting a new test replaces
              it.
            </p>
            <h3>Sources</h3>
            <ul>
              <li>
                <a
                  href="https://ipip.ori.org/30FacetNEO-PI-RItems.htm"
                  target="_blank"
                  rel="noreferrer"
                >
                  IPIP-NEO-120 items and scoring key
                </a>
              </li>
              <li>
                <a
                  href="https://ipip.ori.org/newNEOKey.htm"
                  target="_blank"
                  rel="noreferrer"
                >
                  300-item facet keys
                </a>
              </li>
              <li>
                <a
                  href="https://ipip.ori.org/newScoringInstructions.htm"
                  target="_blank"
                  rel="noreferrer"
                >
                  IPIP scoring instructions
                </a>
              </li>
              <li>
                <a
                  href="https://doi.org/10.1016/j.jrp.2014.05.003"
                  target="_blank"
                  rel="noreferrer"
                >
                  Johnson (2014), development of the IPIP-NEO-120
                </a>
              </li>
            </ul>
            <p className="muted">
              This inventory supports self-reflection and education. It does not
              diagnose mental health conditions.
            </p>
          </div>
        )}
        {modal === "reset" && (
          <>
            <p>
              This will replace the {answered} saved answers from your{" "}
              {session?.length}-question test with a new {length}-question test.
            </p>
            <div className="dialog-actions">
              <button className="secondary" onClick={() => setModal(null)}>
                Keep my progress
              </button>
              <button className="primary" onClick={start}>
                Replace and begin
              </button>
            </div>
          </>
        )}
        {modal === "review" && session && (
          <>
            <p>
              {answered} of {session.length} answered. Choose any question to
              revisit it.
            </p>
            <div className="review-grid">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  aria-label={`Question ${i + 1}: ${q.text} ${session.answers[q.id] ? choices[session.answers[q.id] - 1] : "Unanswered"}`}
                  className={session.answers[q.id] ? "answered" : ""}
                  onClick={() => jump(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <p className="muted">
              Blue squares have an answer. Outlined squares are unanswered.
            </p>
          </>
        )}
      </dialog>
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

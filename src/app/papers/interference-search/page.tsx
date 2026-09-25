import Link from "next/link";
import styles from "../behavior-before-perplexity/paper.module.css";

const PDF = "/papers/interference-search/paper.pdf";

const ledger = [
  ["Solved at equal budget", "30 vs 21"],
  ["Sequential steps", "3 vs 24"],
  ["Paths per state", "63×"],
  ["Tokens generated", "0 vs 14,900"],
];

const steps = [
  ["01", "Expand every live state", "All branches on the frontier propose their moves in the same step. Nothing waits for another branch to finish."],
  ["02", "Let the environment execute", "The moves run. A branch holds the state it actually reached, not a model's description of it."],
  ["03", "Merge identical states", "Branches that land on the same state become one, so the same position is never judged or expanded twice. At six numbers, 831,176 operation sequences collapse into 13,229 states."],
  ["04", "Cancel dead ends", "A small trained judge ranks the merged states and drops the ones that cannot reach the goal. This is the interference in the name: wrong paths cancel out."],
  ["05", "Advance together", "The survivors move forward one level at a time. The frontier finishes in the number of levels, not the number of attempts."],
];

export default function InterferenceSearchPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>BTL</Link>
        <div className={styles.navLinks}>
          <Link href="/papers">Papers</Link>
          <a href={PDF}>PDF</a>
        </div>
      </nav>

      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Research paper · September 2026</p>
          <h1>Interference<br />Search</h1>
          <p className={styles.deck}>
            Reasoning over merged states, many branches at once. The model stops thinking in one line and searches a frontier of real states instead.
          </p>
          <p className={styles.byline}>Al-ameen · BTL, Lagos</p>
          <div className={styles.actions}>
            <a className={styles.primary} href={PDF}>Read the paper</a>
            <Link href="/papers">All papers</Link>
          </div>
        </div>

        <aside className={styles.abstract}>
          <span>Abstract</span>
          <p>
            Language models reason in a line: one token after another in a single transcript, rewinding in text when a step fails. Interference Search works on explicit states. Every live branch expands at once, the environment executes the moves, branches that reach the same state merge, a trained judge cancels dead ends, and the survivors advance together.
          </p>
          <p>
            On 30 hard Countdown problems, with the same judge and the same budget of 200 judged positions, it solves 30 and a single line of thought solves 21. To solve all 30, the line needs 23.7 sequential steps on average and the frontier needs 3.
          </p>
        </aside>
      </header>

      <section className={styles.ledger} aria-label="Measured results">
        {ledger.map(([label, value]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className={styles.bodySection}>
        <div className={styles.sectionLabel}>The result</div>
        <div className={styles.prose}>
          <h2>Most of what a linear reasoner writes is duplicate work.</h2>
          <p>
            Holding the judge and the budget fixed and changing only the shape of the search turned 21 solved problems into 30 and 24 sequential steps into 3. The gain grows with problem size, because the number of paths grows much faster than the number of states: the ratio rises 3.2 times from four numbers to five and 5.5 times from five to six.
          </p>
          <p>
            The judge was trained on four- and five-number problems and cut the search 12.6 times on seven-number problems without losing a solution. Qwen3-1.7B thinking in text solved 3 of the 30 problems and generated about 14,900 tokens per solve, where the search generates none. In one recorded trace the model wrote the correct expression at token 1,313 and never committed to it.
          </p>
          <p>
            On 30 MBPP coding problems the model fails on its first try, Interference Search solved 9, independent sampling 8, and both linear refinement strategies 7. That lead is within noise, and the paper says so.
          </p>
          <div className={styles.boundary}>
            <strong>Claim boundary</strong>
            <p>
              Every result is one seed, and the main claims rest on 30 problems per condition. The strongest Countdown numbers use a small trained judge and an environment that lists moves, not the language model. The name comes from the way quantum search lets wrong paths cancel; the method is classical and claims no quantum speedup. Nothing here trains the language model yet. That is the next step.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.recipeSection}>
        <div className={styles.sectionLabel}>The method</div>
        <div className={styles.recipeIntro}>
          <h2>A frontier of states instead of a single transcript.</h2>
          <p>
            Each level runs the same five steps. Merging and level-synchronous advance carry the gain together: the ablation without merging drops from 77% to 50% on unseen six-number problems.
          </p>
        </div>
        <ol className={styles.steps}>
          {steps.map(([number, title, text]) => (
            <li key={number}>
              <span>{number}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.anatomy}>
        <div className={styles.sectionLabel}>What is in the paper</div>
        <div className={styles.anatomyGrid}>
          <div><h3>Countdown</h3><p>States are sorted multisets of numbers, moves are exact arithmetic, and a solver labels every state. That makes redundancy and pruning measurable instead of estimated.</p></div>
          <div><h3>The judge</h3><p>A two-layer set transformer trained on 632,279 exactly labelled states. It generalizes two sizes past its training data, and it loses solutions on hard problems when set aggressively.</p></div>
          <div><h3>Language model</h3><p>Qwen3-1.7B as a thinker in text, and as a judge through prompts and probes on its hidden states. A probe on plain number features matched the hidden-state probe, so the paper does not claim the model knows more than it says.</p></div>
          <div><h3>What failed</h3><p>Textual notes about failed attempts made the model retry them. Decode-time rewinding regenerated the same mistake. Parallel streams that could see each other learned nothing independent streams did not.</p></div>
        </div>
      </section>

      <section className={styles.downloads}>
        <p className={styles.kicker}>Read the paper</p>
        <h2>The complete paper is available as a PDF.</h2>
        <p>
          The paper includes the method, the redundancy measurements, judge training and generalization, the frontier against the line, the language model and code experiments, token consumption, the negative results, and the limits of every claim. Code, the trained judge and raw results will be released under Apache 2.0.
        </p>
        <div className={styles.actions}>
          <a className={styles.primary} href={PDF}>Paper · PDF</a>
          <Link href="/papers">Research index</Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>BTL · Lagos</span>
        <Link href="/papers">All papers</Link>
      </footer>
    </main>
  );
}

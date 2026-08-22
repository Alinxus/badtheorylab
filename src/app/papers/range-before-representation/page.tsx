import Link from "next/link";
import styles from "../behavior-before-perplexity/paper.module.css";

const PDF = "/papers/range-before-representation/paper.pdf";

const ledger = [
  ["Released artifact", "9.96 GB"],
  ["Model scale", "35.1B MoE"],
  ["Conditional retention", "94.1%"],
  ["Whole-artifact rate", "2.30 bpw"],
];

const recipe = [
  ["01", "Hold budget constant", "Compare quantization decisions at the same nominal bit width, group size, and layer specification before assigning causality."],
  ["02", "Choose the usable range", "Endpoint min/max scaling wasted levels on outliers; per-group clip selection preserved much more measured behavior at the same storage."],
  ["03", "Respect the level cliff", "In this checkpoint, four expert-weight levels stayed close to the teacher while ternary and binary expert routes lost behavior sharply."],
  ["04", "Measure where damage lives", "BTL-3-style head and embedding protection did not transfer; the routed expert tensors dominated the measured quantization damage."],
  ["05", "Ship the exact artifact", "The release uses upstream IQ2_XXS GGUF plus an importance matrix, then gets judged as the physical file users actually run."],
];

export default function RangeBeforeRepresentationPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>Bad Theory Labs</Link>
        <div className={styles.navLinks}>
          <Link href="/papers">Papers</Link>
          <a href={PDF}>PDF</a>
        </div>
      </nav>

      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Research paper · August 2026</p>
          <h1>Range Before<br />Representation</h1>
          <p className={styles.deck}>
            Behavior-gated two-bit quantization of a 35B mixture-of-experts model into a released 9.96 GB GGUF.
          </p>
          <p className={styles.byline}>Bad Theory Labs, Lagos</p>
          <div className={styles.actions}>
            <a className={styles.primary} href={PDF}>Read the paper</a>
            <Link href="/papers">All papers</Link>
          </div>
        </div>

        <aside className={styles.abstract}>
          <span>Abstract</span>
          <p>
            BTL-4 Compact is a released 9,967,966,240-byte GGUF of a 35.1B-parameter mixture-of-experts model. It uses upstream IQ2_XXS weight types and a calibration-derived importance matrix, with no BTL-specific weight codec.
          </p>
          <p>
            The paper explains why this stock-format route worked: at the tested two-bit edge, range selection and expert-weight level count mattered more than representation-family novelty. The result is behavior-gated evidence, not a universal sub-two-bit claim.
          </p>
        </aside>
      </header>

      <section className={styles.ledger} aria-label="Measured artifact facts">
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
          <h2>The MoE stayed useful because the range was chosen before the representation fight.</h2>
          <p>
            The controlled study held storage constant and changed how each group chose its quantization interval. Endpoint min/max scaling retained 77.1% of teacher-correct behaviors. Per-group MSE clip search retained 95.8% at the same 2.40 bpw simulated budget.
          </p>
          <p>
            The exact release is separate from the simulation: a stock IQ2_XXS plus imatrix GGUF at 2.30 bpw. On the artifact gate, the bf16 teacher answered 118 items correctly and BTL-4 Compact reproduced 111 of them, for 94.1% conditional behavioral retention.
          </p>
          <div className={styles.boundary}>
            <strong>Claim boundary</strong>
            <p>
              The 94.1% figure is conditional retention on a 120-item first-party behavior gate covering factual recall, grounded extraction, and false-premise rejection. It is not a general intelligence score, a coding result, or a claim that every capability retained 94.1%.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.recipeSection}>
        <div className={styles.sectionLabel}>The BTL cookbook</div>
        <div className={styles.recipeIntro}>
          <h2>A falsification of the previous recipe, not a new codec.</h2>
          <p>
            BBP made the case for behavior-first promotion. RBR keeps that discipline but changes what the ablation teaches: for this routed model, expert tensors and range selection were the story.
          </p>
        </div>
        <ol className={styles.steps}>
          {recipe.map(([number, title, text]) => (
            <li key={number}>
              <span>{number}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.anatomy}>
        <div className={styles.sectionLabel}>Artifact anatomy</div>
        <div className={styles.anatomyGrid}>
          <div><h3>Standard format</h3><p>A single GGUF using upstream llama.cpp IQ2_XXS weight types and an importance matrix, without a private packed representation.</p></div>
          <div><h3>Routed scale</h3><p>A 35.1B-parameter MoE with roughly 2.1B active parameters per token, compressed into a 9.96 GB decimal file.</p></div>
          <div><h3>Expert sensitivity</h3><p>Protecting output head and embedding did not rescue the model; measured damage was dominated by expert tensors.</p></div>
          <div><h3>Behavior gate</h3><p>Retention was measured on the exact release artifact against teacher-correct, completed answers rather than tensor error alone.</p></div>
        </div>
      </section>

      <section className={styles.downloads}>
        <p className={styles.kicker}>Read the paper</p>
        <h2>The finished report is available as a PDF.</h2>
        <p>
          The paper records the controlled fake-quantization study, the shipped GGUF result, category-level retention, limitations, and the reason BRQ-style one-bit claims remain separate from this release.
        </p>
        <div className={styles.actions}>
          <a className={styles.primary} href={PDF}>Paper · PDF</a>
          <Link href="/papers">Research index</Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>Bad Theory Labs · Lagos</span>
        <Link href="/papers">All papers</Link>
      </footer>
    </main>
  );
}

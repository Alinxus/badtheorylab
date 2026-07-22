import Link from "next/link";
import styles from "./paper.module.css";

const REPO = "https://github.com/Badtheorylabs/BTL-3/tree/main/papers/behavior-before-perplexity";

const ledger = [
  ["Portable artifact", "8.39 GB"],
  ["Tensor payloads", "2,416"],
  ["Conditional retention", "92.2%"],
  ["Generation, RTX PRO 6000", "43.16 tok/s"],
];

const recipe = [
  ["01", "Start from behavior", "Reject candidates that preserve perplexity or token agreement but cannot emit valid, correctly stopped tool calls."],
  ["02", "Localize the first cliff", "Replay nested compressed prefixes, then override modules at the first failing boundary instead of blaming the whole model."],
  ["03", "Allocate measured precision", "Use AVQ2 for the vector core, INT4 and BF16 only where executable behavior proves that additional precision earns its bytes."],
  ["04", "Repair the interface", "Rescue structural vocabulary rows, correct the output head, and train a bounded behavior adapter against the packed artifact."],
  ["05", "Prove the physical file", "Export one native GGUF, verify every tensor and checksum, then run the same deployed representation used by the release gate."],
];

export default function BehaviorBeforePerplexityPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>Bad Theory Labs</Link>
        <div className={styles.navLinks}>
          <Link href="/btl-3">BTL-3</Link>
          <Link href="/papers">Papers</Link>
          <a href={REPO} target="_blank" rel="noreferrer">Source</a>
        </div>
      </nav>

      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Research paper · July 2026</p>
          <h1>Behavior<br />Before Perplexity</h1>
          <p className={styles.deck}>
            A behavior-first compression recipe for agentic language models under an exact physical byte ceiling.
          </p>
          <p className={styles.byline}>Al-ameen · Bad Theory Labs, Lagos</p>
          <div className={styles.actions}>
            <a className={styles.primary} href="/papers/behavior-before-perplexity/paper.pdf">Read the paper</a>
            <a href="/papers/behavior-before-perplexity/engineering-article.pdf">Engineering article</a>
            <a href={REPO} target="_blank" rel="noreferrer">Sources and evidence</a>
          </div>
        </div>

        <aside className={styles.abstract}>
          <span>Abstract</span>
          <p>
            Early BTL-3 Compact candidates looked acceptable under reconstruction loss, perplexity, and teacher-forced token agreement, yet could not make a valid tool call. We changed the unit of optimization from a tensor to a deployed behavior.
          </p>
          <p>
            The final build combines sequential affine-lattice vector quantization, measured precision islands, vocabulary and output-head repair, and a small behavior correction. This paper records the failures, the exact recipe that survived, and the boundary of the result.
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
          <h2>The model that looked healthy was behaviorally dead.</h2>
          <p>
            Local tensor error was not enough. Aggregate language metrics were not enough. Several candidates retained plausible token statistics while producing malformed calls, failing to stop, or losing multi-call structure. That failure changed the promotion rule: a compressed layer advanced only when the packed artifact preserved the behavior users would actually observe.
          </p>
          <p>
            The released file is 8,392,369,600 bytes and retains all 64 text-decoder layers. On a fresh 100-turn tool-contract gate, the full-precision teacher solved 90 turns and BTL-3 Compact retained 83 of those 90. Conditional retention was 100% for single, parallel, sequential, and abstention cases, and 30% for parallel-multiple calls.
          </p>
          <div className={styles.boundary}>
            <strong>Claim boundary</strong>
            <p>
              The 92.2% figure is conditional retention on one private tool-contract gate. It is not “intelligence retained,” a coding score, or evidence that every category cleared 90%. Parallel-multiple remains the measured weakness.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.recipeSection}>
        <div className={styles.sectionLabel}>The BTL cookbook</div>
        <div className={styles.recipeIntro}>
          <h2>A selection procedure, not a magic quantizer.</h2>
          <p>
            The contribution is the ordered, falsifiable system used to find and repair behavioral cliffs under a fixed byte budget. Its components have prior art; the measured cookbook and deployed artifact are ours.
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
          <div><h3>Vector core</h3><p>AVQ2 affine-lattice codes, Hadamard-style incoherence processing, block-LDLQ reconstruction, and physical byte accounting.</p></div>
          <div><h3>Precision islands</h3><p>Measured INT4 and twelve retained BF16 islands where lower precision caused cumulative behavioral failure.</p></div>
          <div><h3>Interface repair</h3><p>4,096 rescued embedding rows, a rank-32 output-head residual, and a counted 32.46 MB rank-8 behavior adapter.</p></div>
          <div><h3>Native proof</h3><p>A standalone GGUF with byte-verified tensors, packed CUDA and Metal execution, manifests, checksums, and no BF16 fallback.</p></div>
        </div>
      </section>

      <section className={styles.downloads}>
        <p className={styles.kicker}>Read and reproduce</p>
        <h2>The complete record is public.</h2>
        <p>
          Download the academic paper, read the chronological engineering account, or inspect the LaTeX source, figures, claim ledger, manifest, bibliography, and checksums on GitHub.
        </p>
        <div className={styles.actions}>
          <a className={styles.primary} href="/papers/behavior-before-perplexity/paper.pdf">Paper · PDF</a>
          <a href="/papers/behavior-before-perplexity/engineering-article.pdf">Engineering article · PDF</a>
          <a href={REPO} target="_blank" rel="noreferrer">Research package · GitHub</a>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>Bad Theory Labs · Lagos</span>
        <Link href="/papers">All papers</Link>
      </footer>
    </main>
  );
}

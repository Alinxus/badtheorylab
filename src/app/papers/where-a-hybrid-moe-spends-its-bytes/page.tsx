import Link from "next/link";
import styles from "../behavior-before-perplexity/paper.module.css";

const PDF = "/papers/where-a-hybrid-moe-spends-its-bytes/paper.pdf";

const ledger = [
  ["Model scale", "176.94B"],
  ["Smallest file", "61.5 GiB"],
  ["GPU-resident core", "34.67 GiB"],
  ["Private retention", "97.4%"],
];

const decisions = [
  ["01", "Count bytes a token reads", "Stored size and decode traffic rank this architecture differently. Routed experts occupy most of the file but account for 15.5% of modeled per-token reads."],
  ["02", "Keep the dense spine resident", "Linear-attention projections account for 40.6% of modeled reads and hyper-connections another 12.4%, so the dense path stays on the GPU."],
  ["03", "Preserve row coverage", "Pruning the engram table to its hottest 5% of rows recovered only 28% of its measured output contribution. Lower precision across all rows caused much less damage."],
  ["04", "Search the two-bit range", "Importance-weighted range search reduced reconstruction error on the expert down projections from 51.9% to 11.7% without changing Q2_0's file layout."],
  ["05", "Verify the physical artifact", "The final merge was checked across 131 source shards and 530 LoRA targets before conversion, then measured as the exact GGUF users run."],
];

export default function HybridMoeBytesPage() {
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
          <h1>Where a Hybrid MoE<br />Spends Its Bytes</h1>
          <p className={styles.deck}>
            A measured compression allocation for a 177B hybrid model with sparse experts, linear attention, gated residual streams, and a 51B-parameter n-gram table.
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
            Tinfield 1 Compact is a 72.04 GiB GGUF with 45.22 GiB resident on the GPU. Tinfield 1 Mini reduces those figures to 61.5 GiB and 34.67 GiB by range-searching the two-bit expert down projections.
          </p>
          <p>
            The paper follows the bytes through the architecture, tests whether the engram table should lose rows or precision, proves which weight edits survive the model&apos;s hyper-connections, and records the exact allocation behind both artifacts.
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
          <h2>The largest tensors were not the bytes a decoded token spent most often.</h2>
          <p>
            A token reads about 5.09 GiB from the compressed model. Linear-attention projections account for 40.6% of that traffic. Routed experts account for 15.5%, despite dominating stored weight size. That reversal changed the offload and precision plan.
          </p>
          <p>
            The other surprise was the engram table. Its accesses are extremely concentrated, but its measured effect is not. The hottest 5% of rows serve 73.9% of held-out reads and recover only 28% of the table&apos;s output contribution when the remaining rows are removed. A simulated 2.5-bit code across all rows moved mean KL from 0.287 to 0.296.
          </p>
          <div className={styles.boundary}>
            <strong>Claim boundary</strong>
            <p>
              The engram measurements come from one agent-session distribution. The 2.5-bit table saving is derived from a restricted-code experiment; its CUDA path and full-model build remain untested. The private gate is a damage check, not a general quality score.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.recipeSection}>
        <div className={styles.sectionLabel}>The allocation</div>
        <div className={styles.recipeIntro}>
          <h2>Measure the architecture before deciding where to cut.</h2>
          <p>
            One precision rule would have spent bytes on the wrong components. The final recipe follows measured traffic, output effect, tensor width, and edit exactness.
          </p>
        </div>
        <ol className={styles.steps}>
          {decisions.map(([number, title, text]) => (
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
          <div><h3>Compact</h3><p>72.04 GiB overall and 45.22 GiB GPU-resident, with expert gate and up projections at IQ2_XXS and expert down projections at IQ4_NL.</p></div>
          <div><h3>Mini</h3><p>61.5 GiB overall and 34.67 GiB GPU-resident. Range-searched Q2_0 down projections cut another 10.55 GiB from the GPU side.</p></div>
          <div><h3>Engram</h3><p>A 320-million-row lookup table where the tested pruning route lost most measured effect, while all-row low precision stayed close to the shipped build.</p></div>
          <div><h3>Exact edits</h3><p>Per-channel scale migration remains exact through SwiGLU and the gated residual read. General rotation does not commute with the input-dependent gates.</p></div>
        </div>
      </section>

      <section className={styles.downloads}>
        <p className={styles.kicker}>Read the paper</p>
        <h2>The complete report is available as a PDF.</h2>
        <p>
          The paper includes the byte ledger, held-out engram ablations, exactness derivations, private retention checks, speed measurements, kernel cross-checks, limitations, and both final artifact sizes.
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

import Link from "next/link";
import styles from "../behavior-before-perplexity/paper.module.css";

const PDF = "/papers/behaviour-relearned-quantization/paper.pdf";

const ledger = [
  ["Paper length", "11 pages"],
  ["OLMoE recovery", "49.38%"],
  ["Binary expert rate", "1.125 bpw"],
  ["Release status", "Not promoted"],
];

const recipe = [
  ["01", "Reserve structure", "Keep the MoE spine stable by rule: routing, attention, embeddings, norms, and interfaces are not where the one-bit risk is priced."],
  ["02", "Binarize experts", "Store routed expert weights as group-128 signs plus scales, while keeping floating latents only during recovery training."],
  ["03", "Relearn the codes", "Train through the hard binary forward pass with windowed STE-KD instead of treating one-bit compression as nearest rounding."],
  ["04", "Read generations", "Teacher-forced top-1 recovered from 3.81% to 49.38%, but free-running outputs remained degenerate, so the result did not promote."],
  ["05", "Gate before scale", "V1b must prove behavior, receipts, and a packed artifact before any 35B or K3-class spend is justified."],
];

export default function BehaviourRelearnedQuantizationPage() {
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
          <p className={styles.kicker}>Technical report · August 2026</p>
          <h1>Behaviour-Relearned<br />Quantization</h1>
          <p className={styles.deck}>
            Recovering one-bit mixture-of-experts weights by reserving structure and relearning expert codes.
          </p>
          <p className={styles.byline}>BTL, Lagos</p>
          <div className={styles.actions}>
            <a className={styles.primary} href={PDF}>Read the paper</a>
            <Link href="/papers">All papers</Link>
          </div>
        </div>

        <aside className={styles.abstract}>
          <span>Abstract</span>
          <p>
            BRQ is BTL's under-2-bit MoE recovery lane. The paper records why static post-training quantization hit a floor, then tests binary routed-expert recovery on OLMoE-1B-7B.
          </p>
          <p>
            The strongest result is real but bounded: teacher-forced agreement recovered from 3.81% to 49.38%. Free-running generations remained repetitive or incoherent, so this is not a promoted one-bit release claim.
          </p>
        </aside>
      </header>

      <section className={styles.ledger} aria-label="BRQ paper facts">
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
          <h2>BRQ is the main under-2-bit paper, but not a release victory lap.</h2>
          <p>
            The paper shows why one-bit MoE compression has to move from static range selection to recovery training. On OLMoE, binary expert weights were nearly dead at the floor and then recovered substantial teacher-forced structure under hard-forward STE-KD.
          </p>
          <p>
            The same receipts also block overclaiming. The saved generations still looped or fragmented, V1a did not produce a packed artifact, and the run did not meet the 80% behavior-promotion gate.
          </p>
          <div className={styles.boundary}>
            <strong>Claim boundary</strong>
            <p>
              BRQ supports the research lane: reserve MoE structure and relearn binary expert codes. It does not claim a released one-bit model, 90% behavior retention, or reproduction of Bonsai's proprietary transformation.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.recipeSection}>
        <div className={styles.sectionLabel}>The BRQ ladder</div>
        <div className={styles.recipeIntro}>
          <h2>The paper is built around receipts.</h2>
          <p>
            It includes the OLMoE V0 and V1a curves, Qwen dense controls, free-generation failure analysis, and the minimum V1b receipt schema required before scale-up.
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

      <section className={styles.downloads}>
        <p className={styles.kicker}>Read the paper</p>
        <h2>The BRQ report is the detailed version.</h2>
        <p>
          This is the artifact that separates BRQ from RBR: RBR explains the stock-format two-bit BTL-4 release; BRQ explains the one-bit recovery lane and why it has not promoted yet.
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

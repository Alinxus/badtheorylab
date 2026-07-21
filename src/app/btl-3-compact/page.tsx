import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import styles from "../btl-3/release.module.css";
import { compactHash, compactRetention, compactSupport, links } from "../btl-3/release-data";

const server = `BTL3_MODEL="$PWD/model/BTL-3-Compact-AVQ2.gguf" \\
BTL3_CTX_SIZE=4096 \\
  runtimes/supported/BTL-3-Compact-macos-arm64/bin/btl3-server`;

const request = `curl http://127.0.0.1:8080/v1/chat/completions \\
  -H 'Content-Type: application/json' \\
  -d '{
    "model": "BTL-3",
    "messages": [{
      "role": "user",
      "content": "Write a retrying fetch helper with tests."
    }],
    "stream": true
  }'`;

export default function CompactPage() {
  return (
    <main className={styles.page}>
      <SiteNav />

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Native local edition · One complete GGUF</p>
          <h1>8.39<span>GB</span></h1>
          <p className={styles.heroLead}>BTL-3 Compact puts the complete 27B text model in one native artifact.</p>
          <p className={styles.heroBody}>Decoder, vocabulary matrices, output correction, and behavior repair are all packed. The runtime consumes the representation directly—without downloading or reconstructing the BF16 checkpoint.</p>
          <div className={styles.actions}>
            <a className={styles.primary} href={links.compact} target="_blank" rel="noreferrer">Download Compact ↗</a>
            <Link className={styles.secondary} href="/btl-3">View full BTL-3</Link>
            <a className={styles.secondary} href={links.github} target="_blank" rel="noreferrer">Runtime source</a>
          </div>
        </div>
        <div className={styles.readout}>
          <div className={styles.readoutHead}><span />ARTIFACT MANIFEST <b>AVQ2</b></div>
          <div className={styles.bigResult}><strong>27</strong><span>B</span><small>Complete text model · 7.82 GiB</small></div>
          <dl>
            <div><dt>Exact bytes</dt><dd>8,392,369,600</dd></div>
            <div><dt>Packed tensors</dt><dd>2,416 verified</dd></div>
            <div><dt>Representation</dt><dd>AVQ2 / UniSVQ</dd></div>
            <div><dt>Native backends</dt><dd>CUDA + Metal</dd></div>
            <div><dt>Original BF16 required</dt><dd>No</dd></div>
          </dl>
        </div>
      </section>

      <section className={styles.metrics}>
        <div><strong>8.39 GB</strong><span>Complete artifact</span><small>7.82 GiB on disk</small></div>
        <div><strong>92.2%</strong><span>Conditional retention</span><small>83 / 90 teacher-correct</small></div>
        <div><strong>43.16 t/s</strong><span>Native generation</span><small>RTX PRO 6000</small></div>
        <div><strong>84.70 t/s</strong><span>Prompt processing</span><small>512-token probe</small></div>
      </section>

      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <div><p className={styles.label}>Measured retention</p><h2>What survived<br /><em>the packing.</em></h2></div>
          <p>A fresh private 100-turn tool-contract gate was authored after representation choices froze. The full model scored 90/100; Compact retained 83 of those 90 teacher-correct cases.</p>
        </header>
        <div className={styles.scoreTable}>
          {compactRetention.map((row) => (
            <div key={row.name}>
              <span>{row.name}</span><span>Teacher-correct retained</span><b>{row.value}</b>
              <i><span style={{ width: `${row.pct}%` }} /></i>
            </div>
          ))}
          <div className={styles.total}><span>Overall</span><span>Conditional retention</span><b>83 / 90 · 92.2%</b><i><span style={{ width: "92.2%" }} /></i></div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.dark}`}>
        <header className={styles.sectionHead}>
          <div><p className={styles.label}>Representation</p><h2>Small on disk.<br /><em>Native in memory.</em></h2></div>
          <p>The release is a mixed representation chosen against behavioral gates—not a stock scalar quant with a new label.</p>
        </header>
        <div className={styles.changeGrid}>
          <article><span>Decoder</span><strong>64 layers</strong><p>Packed AVQ2 decoder tensors with affine INT4 tensors and measured higher-precision islands.</p></article>
          <article><span>Vocabulary path</span><strong>Complete</strong><p>Packed embeddings and output matrices plus a rank-32 output correction.</p></article>
          <article><span>Behavior path</span><strong>Repaired</strong><p>A compact behavior adapter protects tool names, structure, stopping, and abstention.</p></article>
        </div>
      </section>

      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <div><p className={styles.label}>Runtime support</p><h2>One model.<br /><em>Its own runner.</em></h2></div>
          <p>Stock Ollama and the stock LM Studio GGUF engine do not decode AVQ2. The release includes a native OpenAI-compatible server and bridges for familiar client workflows.</p>
        </header>
        <div className={styles.scoreTable}>
          {compactSupport.map(([target, status, packageName]) => <div key={target}><span>{target}</span><span>{packageName}</span><b>{status}</b><i><span style={{ width: status === "Verified" ? "100%" : "62%" }} /></i></div>)}
        </div>
      </section>

      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <div><p className={styles.label}>Quickstart</p><h2>Serve locally.<br /><em>Call it normally.</em></h2></div>
          <p>The verified macOS arm64 package starts an OpenAI-compatible endpoint. Device memory, KV cache, and runtime workspace determine usable context.</p>
        </header>
        <div className={styles.codeGrid}>
          <div><span>Start the native server</span><pre>{server}</pre></div>
          <div><span>OpenAI-compatible request</span><pre>{request}</pre></div>
        </div>
      </section>

      <section className={styles.editionCallout}>
        <div><p className={styles.label}>Measured performance</p><h2>43.16 tok/s<br /><em>on RTX PRO 6000.</em></h2><p>Exact GGUF, full CUDA offload, 128 generated tokens, mean of three runs with 0.29 tok/s standard deviation. Apple M2 compatibility smoke measured 2.48 tok/s generation.</p></div>
        <a className={styles.lightButton} href={links.compact} target="_blank" rel="noreferrer">Get the 8.39 GB model ↗</a>
      </section>

      <section className={styles.integrity}>
        <div><p className={styles.label}>Artifact integrity</p><h2>One file.<br />One identity.</h2></div>
        <div><span>BTL-3-Compact-AVQ2.gguf · SHA-256</span><code>{compactHash}</code><small>8,392,369,600 bytes · 2,416 tensor payloads byte-verified</small></div>
      </section>

      <section className={styles.boundaries}>
        <h2>Deployment boundaries</h2>
        <div>
          <p><b>Parallel-multiple:</b> retained 3/10 teacher-correct cases. Overall retention is not uniform across categories.</p>
          <p><b>Runtime:</b> AVQ2 needs BTL&apos;s packed runner. Stock Ollama and LM Studio do not load it directly.</p>
          <p><b>Hardware:</b> RTX 4090, RTX 5090, DGX Spark, Windows, and newer Apple devices remain device-specific gates.</p>
          <p><b>Context:</b> 262K is architectural. Begin at 4K–32K according to device memory and increase after measuring headroom.</p>
        </div>
      </section>

      <footer className={styles.footer}><strong>BTL-3 Compact · 8.39 GB</strong><div><Link href="/">Bad Theory Labs</Link><Link href="/btl-3">Full model</Link><a href={links.compact}>Hugging Face</a><a href={links.github}>GitHub</a></div></footer>
    </main>
  );
}

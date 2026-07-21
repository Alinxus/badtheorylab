import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import styles from "./release.module.css";
import { benchmarks, bfcl, fullHash, links } from "./release-data";

const vllm = `vllm serve Qwen/Qwen3.6-27B \\
  --revision 6a9e13bd6fc8f0983b9b99948120bc37f49c13e9 \\
  --served-model-name BTL-3 \\
  --enable-lora --max-lora-rank 32 \\
  --lora-modules BTL-3=/path/to/BTL-3 \\
  --reasoning-parser qwen3 \\
  --language-model-only --max-model-len 32768`;

const transformers = `from peft import PeftModel
from transformers import AutoModelForCausalLM, AutoTokenizer

base = "Qwen/Qwen3.6-27B"
revision = "6a9e13bd6fc8f0983b9b99948120bc37f49c13e9"
adapter = "badtheorylabs/BTL-3"

tokenizer = AutoTokenizer.from_pretrained(adapter)
model = AutoModelForCausalLM.from_pretrained(
    base, revision=revision, device_map="auto")
model = PeftModel.from_pretrained(model, adapter)`;

export default function Btl3Page() {
  return (
    <main className={styles.page}>
      <SiteNav />

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Open weights · Frozen release RL-0013</p>
          <h1>BTL<span>–</span>3</h1>
          <p className={styles.heroLead}>A 27B agentic coding and tool-use model trained to act, inspect, recover, and stop when no action is needed.</p>
          <p className={styles.heroBody}>Post-trained from a pinned Qwen3.6-27B revision. Every result below belongs to the frozen RL-0013 adapter and carries its actual protocol and denominator.</p>
          <div className={styles.actions}>
            <a className={styles.primary} href={links.full} target="_blank" rel="noreferrer">Download weights ↗</a>
            <Link className={styles.secondary} href="/btl-3-compact">Explore Compact</Link>
            <a className={styles.secondary} href={links.github} target="_blank" rel="noreferrer">Runtime source</a>
          </div>
        </div>
        <div className={styles.readout}>
          <div className={styles.readoutHead}><span />RELEASE MANIFEST <b>RL-0013</b></div>
          <div className={styles.bigResult}><strong>88.5</strong><span>%</span><small>BFCL v4 AST · full set</small></div>
          <dl>
            <div><dt>Parameters</dt><dd>27B dense</dd></div>
            <div><dt>Adapter</dt><dd>LoRA r32 / α64</dd></div>
            <div><dt>Architecture</dt><dd>262,144 tokens</dd></div>
            <div><dt>RL sequence</dt><dd>Up to 65,536</dd></div>
            <div><dt>License</dt><dd>Apache-2.0</dd></div>
          </dl>
        </div>
      </section>

      <section className={styles.metrics}>
        {benchmarks.map((item) => <div key={item.metric}><strong>{item.value}</strong><span>{item.metric}</span><small>{item.note}</small></div>)}
      </section>

      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <div><p className={styles.label}>Tool use</p><h2>The full BFCL<br /><em>category profile.</em></h2></div>
          <p>The official 1,240-case BFCL v4 AST evaluation. This is the model&apos;s strongest verified public capability and the complete category table—not a selected subset.</p>
        </header>
        <div className={styles.scoreTable}>
          {bfcl.map((row) => (
            <div key={row.name} className={row.name === "Overall" ? styles.total : ""}>
              <span>{row.name}</span><span>{row.cases}</span><b>{row.score}</b>
              <i><span style={{ width: `${row.value}%` }} /></i>
            </div>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.dark}`}>
        <header className={styles.sectionHead}>
          <div><p className={styles.label}>What RL changed</p><h2>A major repair.<br /><em>Not a free lunch.</em></h2></div>
          <p>RL-0013 fixed the launch checkpoint&apos;s tendency to call tools when it should abstain. The category profile also shows the regression we do not hide.</p>
        </header>
        <div className={styles.changeGrid}>
          <article><span>Irrelevance</span><strong>43.8 → 91.2</strong><p>The principal launch repair: the model learned when no tool call is relevant.</p></article>
          <article><span>Overall BFCL</span><strong>82.7 → 88.5</strong><p>Full-set AST accuracy after the RL stage.</p></article>
          <article className={styles.warning}><span>Parallel-multiple</span><strong>93.0 → 70.0</strong><p>Complex composition fell. RL changed the capability profile rather than improving every axis.</p></article>
        </div>
      </section>

      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <div><p className={styles.label}>Deploy</p><h2>Full quality.<br /><em>Standard tooling.</em></h2></div>
          <p>Serve the pinned base plus adapter through vLLM, or load it with Transformers and PEFT. Thinking mode is recommended for coding.</p>
        </header>
        <div className={styles.codeGrid}>
          <div><span>vLLM</span><pre>{vllm}</pre></div>
          <div><span>Transformers + PEFT</span><pre>{transformers}</pre></div>
        </div>
      </section>

      <section className={styles.editionCallout}>
        <div><p className={styles.label}>Local edition</p><h2>Need the whole 27B model<br />in <em>8.39 GB?</em></h2><p>BTL-3 Compact is a separate native artifact with its own runtime, retention profile, speed measurements, and deployment contract.</p></div>
        <Link className={styles.lightButton} href="/btl-3-compact">Open the Compact dossier ↗</Link>
      </section>

      <section className={styles.integrity}>
        <div><p className={styles.label}>Frozen identity</p><h2>Verify the release.</h2></div>
        <div><span>adapter_model.safetensors · SHA-256</span><code>{fullHash}</code><small>933,974,032 bytes · Qwen3.6-27B revision 6a9e13bd6fc8f0983b9b99948120bc37f49c13e9</small></div>
      </section>

      <section className={styles.boundaries}>
        <h2>Reporting boundaries</h2>
        <div>
          <p><b>LiveCodeBench:</b> 88.08% is a completion-time-biased 193-of-442-case run, not a full leaderboard score.</p>
          <p><b>HumanEval:</b> saturated compatibility check; base Qwen3.6-27B scored 95.7% on the same harness.</p>
          <p><b>Context:</b> 262K is architectural. Launch benchmarks used 32K; RL sequences reached 65K.</p>
          <p><b>Repository autonomy:</b> no publishable SWE-bench or Terminal-Bench score is claimed.</p>
        </div>
      </section>

      <footer className={styles.footer}><strong>BTL-3 · RL-0013 · 27B</strong><div><Link href="/">Bad Theory Labs</Link><a href={links.full}>Hugging Face</a><a href={links.github}>GitHub</a><a href={links.discord}>Discord</a></div></footer>
    </main>
  );
}

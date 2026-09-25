import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import styles from "./investors.module.css";
import { releases, research, searchRows, tinfieldRows } from "./data";

const PAPER = "/papers/interference-search";
const CODE = "https://github.com/Badtheorylabs/interference-search";

export default function Investors() {
  return (
    <main className={styles.page}>
      <SiteNav />

      <div className={styles.wrap}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}><span />Investors · Pre-seed</p>
          <h1>Open models that do more <em>with less.</em></h1>
        </header>

        <div className={styles.body}>
          <div className={styles.rail}>
            BTL<br />
            Lagos<br />
            Sep 2026
          </div>

          <article className={styles.prose}>
            <p>
              Bad Theory Labs trains open models and does the research that lets them do more with less
              compute, fewer bits and fewer tokens. We&apos;re raising a $1.5M pre-seed.
            </p>
            <p>
              I run the lab from Lagos. We&apos;ve had no institutional money and no permanent compute, so
              every result below came from rented GPUs and one laptop. The newest one, Interference Search,
              is the reason this page exists.
            </p>

            <h2>Interference Search</h2>
            <p>
              Language models think in a line. They write one token after another, and when an idea fails
              they back up in text and try again.
            </p>
            <p>
              I watched Qwen3-1.7B fail at Countdown, the puzzle where you combine a few numbers to hit a
              target. It wasn&apos;t getting the arithmetic wrong. 45% of its failed attempts repeated an
              expression it had already ruled out itself.
            </p>
            <p>
              On one problem it wrote the correct answer at token 1,313. Then it checked it nine more times,
              drifted into other ideas and ran out of budget without answering.
            </p>
            <p>
              So I built Interference Search, which reasons over explicit states. Every live branch expands
              at once and the environment executes the moves. Branches that land on the same state merge
              into one, and a small trained judge drops the ones that can no longer reach the goal. The
              survivors move forward together, one level at a time.
            </p>
            <p>On 30 hard Countdown problems:</p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr><th>System</th><th>Solved</th><th>Sequential steps</th></tr>
                </thead>
                <tbody>
                  {searchRows.map(([sys, solved, steps], i) => (
                    <tr key={sys} className={i === searchRows.length - 1 ? styles.win : undefined}>
                      <td>{sys}</td>
                      <td className={styles.num}>{solved}</td>
                      <td>{steps}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Given 1,500 judged positions, the single line also solves all 30, but it needs 23.7
              sequential steps on average against 3.
            </p>
            <p>
              When I replaced the trained judge with a linear probe on the 1.7B model&apos;s own hidden
              states, the search solved 15 of 30. The model generated zero tokens to get there. All of this
              ran on one M2 laptop with 16 GB of memory.
            </p>

            <h2>Why it goes past puzzles</h2>
            <p>
              Most of what a line of thought does is repeated work, and the share grows with the problem. At
              six numbers, 831,176 paths collapse into 13,229 distinct states. The ratio grew 3.2 times from
              four numbers to five, then 5.5 times from five to six.
            </p>
            <p>
              The judge was trained on four- and five-number problems. On ten seven-number problems it cut
              the search 12.6 times without losing a solution.
            </p>
            <p>
              I&apos;ll be straight about the limits. Everything is one seed. Countdown has an exact solver,
              which makes it a clean lab and nothing more.
            </p>
            <p>
              On code, 30 MBPP problems the model had already failed, Interference Search solved 9 and
              best-of-N solved 8. That&apos;s noise. The real work now is making states and merging hold up
              where equivalence is harder to check, starting with code and terminal tasks.
            </p>
            <p>
              I open-sourced the code, the trained judge, every raw result and the experiments that failed.
              Read <Link href={PAPER}>the paper</Link> or get <a href={CODE}>the code</a>.
            </p>

            <h2>The models</h2>
            <p>Our releases have passed 210,000 downloads on Hugging Face, 192,760 of them for BTL-4 Compact.</p>
            <p>
              <a href="https://huggingface.co/badtheorylabs/Tinfield-1">Tinfield 1</a>{" "}is our newest release,
              an agentic model for terminal and software work built on Qwen3.8-Flash-Next. It has 177B
              parameters with 6.6B active per token, and our quantized builds run on a single 64 GB machine.
            </p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr><th>Benchmark</th><th>Tinfield 1</th><th>Qwen3.8-Flash-Next (base)</th><th>Claude Opus 4.8</th></tr>
                </thead>
                <tbody>
                  {tinfieldRows.map(([bench, ours, base, opus]) => (
                    <tr key={bench}>
                      <td>{bench}</td>
                      <td className={styles.num}><strong>{ours}</strong></td>
                      <td className={styles.num}>{base}</td>
                      <td className={styles.num}>{opus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Those scores are for the full weights. I haven&apos;t run the quantized builds on those
              benchmarks yet.
            </p>
            <p>
              <a href="https://huggingface.co/badtheorylabs/BTL-4-Compact">BTL-4 Compact</a>{" "}put a 35B model
              into 9.96 GB at 2.30 bits per weight. It kept 94.1% of the full model&apos;s behaviour on our
              retention gate, 111 of 118 cases.
            </p>
            <p>
              The finding behind it surprised me. I expected the damage at two bits to come from the output
              head, and it didn&apos;t. Almost all of it came from how the value range of each small group of
              weights was chosen.
            </p>
            <p>
              Searching for a better range took false-premise rejection from 64.1% to 97.4%. It cost 12
              seconds of GPU time.
            </p>

            <h2>Everything we shipped before that</h2>
            <p>
              We shipped our first model on June 22 and Tinfield 1 on September 21. These are the releases
              in between, plus the first one.
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.wide}>
                <thead>
                  <tr><th>Released</th><th>Model</th><th>What it is</th><th>Result</th><th>Downloads</th></tr>
                </thead>
                <tbody>
                  {releases.map((r) => (
                    <tr key={r.name}>
                      <td className={styles.num}>{r.when}</td>
                      <td className={styles.name}><a href={r.href}>{r.name}</a></td>
                      <td>{r.what}</td>
                      <td>{r.result}</td>
                      <td className={styles.num}>{r.downloads}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.note}>
              Downloads are all-time counts from Hugging Face as of September 25, 2026. BFCL and
              LiveCodeBench were run in-house with the official scorers on full splits.
            </p>
            <p>
              Our own SWE-bench runs on BTL-4 scored far lower, and the cause turned out to be our harness,
              which was broken. So I stopped trusting it for that benchmark and had an outside lab run
              BTL-4 instead. Their run came back at 78.4%.
            </p>

            <h2>Other research in progress</h2>
            <p>
              These are earlier-stage. I&apos;ve written down where each one actually stands, because some
              of them aren&apos;t ready to claim.
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.wide}>
                <thead>
                  <tr><th>Project</th><th>What it does</th><th>Where it stands</th></tr>
                </thead>
                <tbody>
                  {research.map(([name, what, where]) => (
                    <tr key={name}>
                      <td className={styles.name}>{name}</td>
                      <td>{what}</td>
                      <td>{where}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2>What I believe, and the business</h2>
            <p>
              Every result here came from spending less and checking that the model kept what mattered. I
              think the next big gains in reasoning will come from how models search. Interference Search is
              my first hard evidence for that.
            </p>
            <p>
              Revenue today is close to nothing. Our products have made less than $200 in their lifetime,
              because almost all of my time has gone into the research and the models.
            </p>
            <p>The plan has three parts:</p>
            <ul>
              <li>Open weights, so people find and run our models.</li>
              <li>Paid hosted access to the latest BTL models.</li>
              <li>Paid private deployments for teams that need to run them on their own hardware.</li>
            </ul>

            <h2>Team and the raise</h2>
            <p>
              There are four of us: me as founder and research lead, a senior ML researcher, a research
              intern and one person running community and releases.
            </p>
            <p>
              I&apos;m raising a $1.5M pre-seed. It pays for compute for the next model and the first
              full-time hires. It also pays for taking Interference Search from Countdown into code and agent
              tasks, with the goal of a model that thinks in states from the start.
            </p>
            <p className={styles.lift}>
              If this is interesting, I&apos;d like 30 minutes with you. I&apos;ll walk you through the paper
              and run the search live.
            </p>
            <p className={styles.sign}>
              Al-Ameen, Bad Theory Labs ·{" "}
              <a href="mailto:hello@badtheorylabs.com">hello@badtheorylabs.com</a>
            </p>
          </article>
        </div>

        <section className={styles.after}>
          <p>$1.5M pre-seed</p>
          <a className={styles.btn} href="mailto:hello@badtheorylabs.com?subject=BTL%20pre-seed">Talk to the founder</a>
          <Link className={styles.btnGhost} href={PAPER}>Read the paper</Link>
        </section>
      </div>
    </main>
  );
}

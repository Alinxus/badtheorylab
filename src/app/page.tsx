import Link from "next/link";
import CapacityField from "@/components/CapacityField";
import HeroTrace from "@/components/HeroTrace";
import HeroRail from "@/components/HeroRail";
import AudienceRouter from "@/components/AudienceRouter";
import ContainmentField from "@/components/ContainmentField";
import SignalRail from "@/components/SignalRail";
import SiteNav from "@/components/SiteNav";
import SystemDeck from "@/components/SystemDeck";
import WeightInstrument from "@/components/WeightInstrument";
import shellStyles from "./home.module.css";
import instrumentStyles from "./home-instrument.module.css";
import sectionStyles from "./home-sections.module.css";
import footerStyles from "./home-footer.module.css";
import experimentStyles from "./home-experiment.module.css";
import audienceStyles from "./home-audience.module.css";
import signalStyles from "./home-signal.module.css";
import systemStyles from "./home-systems.module.css";

const styles = {
  ...shellStyles,
  ...instrumentStyles,
  ...sectionStyles,
  ...footerStyles,
  ...experimentStyles,
  ...audienceStyles,
  ...signalStyles,
  ...systemStyles,
};

const githubUrl = "https://github.com/Badtheorylabs";
const discordUrl = "https://discord.gg/QJBCcB7bF";

const forms = [
  {
    name: "Representation",
    question: "How many bits are actually necessary to preserve behaviour?",
    status: "Measured",
    body: "The first form we measured. Selecting the numerical range before choosing the representation moved behavioural retention from 77.1% to 95.8% at an identical byte budget.",
    meta: ["artifact", "Range Before Representation", "cost", "twelve GPU-seconds"],
  },
  {
    name: "Architecture",
    question: "How much parameter capacity does a behaviour require?",
    status: "Measured",
    body: "Small individually recoverable expert matrices regained more behaviour after compression than much larger dense matrices. The organisation of capacity changed how cheaply capability could be repaired.",
    meta: ["artifact", "BRQ", "result", "49.4% vs 23% recovery"],
  },
  {
    name: "Learning",
    question: "How much data and optimisation are required to acquire it?",
    status: "Open · next",
    body: "This is where the cost of training is set. The question is whether behaviour-conditioned data selection can teach the same capability with fewer tokens and updates.",
    meta: ["instrument", "not built", "status", "dossier opened"],
  },
  {
    name: "Modification",
    question: "How much of the system must change to alter one capability?",
    status: "Open",
    body: "A capability that can be located should be repairable, replaceable, or addable without a full backward pass. The experiment has not been built yet.",
    meta: ["instrument", "not built", "status", "stage three design"],
  },
  {
    name: "Inference",
    question: "How much compute must activate to execute it?",
    status: "Evidence only",
    body: "BTL-4 Compact activates roughly 2.1B of 35.1B parameters per token. That is an architectural fact, not yet a measurement of the minimum compute a behaviour requires.",
    meta: ["observation", "2.1B active of 35.1B", "status", "unstudied"],
  },
  {
    name: "Knowledge",
    question: "What belongs in weights, and what belongs in external memory?",
    status: "Dossier opened",
    body: "Retrieval has reached a large parameter reduction in published work. The open question is where external memory becomes the more efficient representation for a real system.",
    meta: ["adjacent system", "RetainDB", "status", "open"],
  },
  {
    name: "Deployment",
    question: "What hardware is actually necessary to serve it?",
    status: "Evidence only",
    body: "A 35.1B model in a 9.96 GB artifact decoding at 31.9 tokens per second on a laptop says something about the floor. Nobody has measured where that floor is.",
    meta: ["observation", "31.9 tok/s on an M4", "status", "unstudied"],
  },
] as const;

const evidence = [
  {
    index: "Fig. 02",
    tag: "Representation",
    title: "Range Before Representation",
    body: "Choosing the range before the representation changed the result while the byte budget stayed fixed.",
    facts: ["77.1% → 95.8% retained", "same bytes", "no calibration corpus"],
    href: "/papers/range-before-representation",
    action: "Read the paper",
  },
  {
    index: "Fig. 03",
    tag: "Architecture",
    title: "Behaviour Relearned Quantization",
    body: "The size of a matrix was a poor guide to repairability. The granularity of the capacity mattered more.",
    facts: ["3M experts → 49.4%", "190M dense → 23%", "published ablation"],
    href: "/papers/behaviour-relearned-quantization",
    action: "Read the paper",
  },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  return (
    <main className={styles.page}>
      <SiteNav />

      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroStage} data-hero-stage>
        <div className={styles.heroGrid}>
          {/* top left: the claim, bottom-aligned and tight to the edge */}
          <div className={styles.qClaim}>
            <div className={styles.stamp}>
              <span>AI research + deployment</span>
              <i />
              <span>Built for ownership</span>
            </div>
            <h1 id="hero-title">Frontier AI. <em>Efficient enough to own.</em></h1>
          </div>

          {/* right rail: two panels, walked through by the scroll */}
          <HeroRail>
            <p className={styles.lede}>
              We build frontier models and systems around capability efficiency, for organizations
              that need to run advanced intelligence on infrastructure they control.
            </p>

            <div className={styles.railLatest}>
              <p className={styles.newsLabel}>BTL-4 Compact</p>
              <a className={styles.newsCard} href="#stack">
                <span className={styles.newsThumb} aria-hidden="true" />
                <span className={styles.newsText}>
                  35.1B parameters in 9.96 GB, holding 111 of 118 measured behaviours
                </span>
                <span className={styles.newsGo} aria-hidden="true">&#8599;</span>
              </a>
            </div>
          </HeroRail>

          {/* bottom left: the trace, full bleed */}
          <div className={styles.qField}>
            <HeroTrace />
          </div>
        </div>
        </div>

        <WeightInstrument />
      </section>

      <SignalRail />

      <section className={styles.audience} id="why-btl" aria-labelledby="audience-title">
        <AudienceRouter>
          <div className={styles.audienceIntro}>
            <p className={styles.label}>Why BTL</p>
            <h2 id="audience-title">One company. <em>Four ways in.</em></h2>
            <p>
              Four groups ask different questions of the same work.
            </p>
            <span className={styles.routerSource} data-router-source aria-hidden="true" />
          </div>
          <div className={styles.audienceGrid}>
            <article className={styles.audienceCard} data-door="0">
              <span>01 / Organizations</span>
              <h3>Deploy AI you can control.</h3>
              <p>Run capable models with your data, infrastructure and operating constraints in view.</p>
              <Link href="/contact">Talk to BTL <Arrow /></Link>
            </article>
            <article className={styles.audienceCard} data-door="1">
              <span>02 / Developers</span>
              <h3>Build on models you can inspect.</h3>
              <p>Open-weight releases, native inference and systems that expose how the work gets done.</p>
              <Link href="/btl-3">Explore the models <Arrow /></Link>
            </article>
            <article className={styles.audienceCard} data-door="2">
              <span>03 / Investors</span>
              <h3>Back the efficiency layer.</h3>
              <p>A research programme with published measurements, and a commercial arm that funds it by taking harder problems.</p>
              <Link href="/thesis">Read the thesis <Arrow /></Link>
            </article>
            <article className={styles.audienceCard} data-door="3">
              <span>04 / Researchers</span>
              <h3>Measure what scale leaves out.</h3>
              <p>Measurements you can reproduce, the conditions they were taken under, and the runs that failed.</p>
              <Link href="/papers">See the research <Arrow /></Link>
            </article>
          </div>
        </AudienceRouter>
      </section>

      <section className={styles.commercial} id="private-frontier" aria-labelledby="commercial-title">
        <div className={styles.commercialHead}>
          <div>
            <p className={styles.label}>BTL Commercial</p>
            <h2 id="commercial-title">Private Frontier <em>Intelligence.</em></h2>
          </div>
          <p>
            Contracted access to the lab. An institution brings a problem, and what comes back is a
            research result, a model built for their conditions, or a system running inside their
            walls. Every contract names the bar it has to clear.
          </p>
        </div>
        <div className={styles.commercialGrid}>
          <article className={styles.commercialCard}>
            <ContainmentField count={26} speed={0.72}>
              <span>01 / Sovereign AI</span>
              <h3>Research and systems for institutions that carry public responsibility.</h3>
              <p>Models trained for local conditions, intelligence deployed on infrastructure you control, and the measurement to show what it actually does.</p>
              <small>Governments · ministries · agencies</small>
              <Link href="/contact">Talk to BTL <Arrow /></Link>
            </ContainmentField>
          </article>
          <article className={styles.commercialCard}>
            <ContainmentField count={44} speed={1.25}>
              <span>02 / Enterprise Intelligence</span>
              <h3>Research and systems for companies where knowledge is the work.</h3>
              <p>Capability built against your data and your constraints, with a baseline, a target and an acceptance test agreed before anything starts.</p>
              <small>Banks · telcos · insurers · large companies</small>
              <Link href="/contact">Talk to BTL <Arrow /></Link>
            </ContainmentField>
          </article>
        </div>
      </section>

      <div className={styles.scale} aria-hidden="true" />

      <section className={styles.experiment} aria-labelledby="experiment-title">
        <div className={styles.experimentCopy}>
          <p className={styles.label}>One measured result</p>
          <h2 id="experiment-title">Same capacity. <em>Better allocation.</em></h2>
          <p>
            On a real model weight tensor containing 1.05 million values, we changed only how the
            available numerical range was allocated.
          </p>
          <p>
            The model did not get larger. The byte budget did not change. No calibration dataset
            was used. The intervention took twelve GPU-seconds.
          </p>
          <p>
            Behavioural retention moved from 77.1% to 95.8%. The companion instrument above lets
            you inspect the same failure directly in the tensor.
          </p>
          <Link href="/papers/range-before-representation" className={styles.cardLink + " " + styles.experimentLink}>
            Read Range Before Representation <Arrow />
          </Link>
        </div>
        <div className={styles.proofCard}>
          <div className={styles.figureLabel}>
            <b>Fig. 01A</b>
            <i />
            <span>conditions attached</span>
          </div>
          <div className={styles.proofLarge}>
            <span>Behaviour retention</span>
            <strong>77.1 → 95.8</strong>
            <span>identical byte budget</span>
          </div>
          <div className={styles.proofFacts}>
            <div><span>Tensor</span><b>1.05M values</b></div>
            <div><span>Intervention</span><b>12 GPU-seconds</b></div>
            <div><span>Calibration</span><b>none</b></div>
            <div><span>Error reduction</span><b>82.3%</b></div>
          </div>
        </div>
      </section>

      <section className={styles.section} id="forms" aria-labelledby="forms-title">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.label}>The research map</p>
            <h2 id="forms-title">We study <em>capability efficiency.</em></h2>
          </div>
          <p>
            It has seven forms. Each asks how much capacity a behaviour needs at a different point
            in the system. Two are measured. Five are not.
          </p>
        </div>

        <div className={styles.forms}>
          {forms.map((form, index) => (
            <details className={styles.form} key={form.name} open={index === 0}>
              <summary>
                <span className={styles.formIndex}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.formName}>{form.name}</span>
                <span className={styles.formQuestion}>{form.question}</span>
                <span className={styles.formStatus + (form.status.startsWith("Measured") ? " " + styles.measured : "")}>
                  <i />
                  {form.status}
                </span>
              </summary>
              <div className={styles.formBody}>
                <p>{form.body}</p>
                <div className={styles.formMeta}>
                  {form.meta.map((item, itemIndex) => (
                    <span key={item}>
                      {itemIndex % 2 === 0 ? item + " " : <b>{item}</b>}
                    </span>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>

        <p className={styles.densityLine}>
          Capability density is efficiency across <em>all seven</em>, measured in behaviour per unit spent.
        </p>
      </section>

      <section className={styles.densitySection} aria-labelledby="density-title">
        <div>
          <p className={styles.label}>The common measure</p>
          <h2 id="density-title">More behaviour per <em>unit spent.</em></h2>
        </div>
        <div>
          <p>
            Capability density is the useful behaviour a model returns per unit of what it spends.
            A model spends bits to represent weights, parameters to store behaviour, tokens to learn,
            compute to reason, memory to retain information and hardware to run. Money is downstream
            of all of them.
          </p>
          <CapacityField />
          <div className={styles.densityUnits}>
            <div className={styles.densityUnit}><strong>behaviour / bit</strong><span>representation</span></div>
            <div className={styles.densityUnit}><strong>behaviour / token</strong><span>learning</span></div>
            <div className={styles.densityUnit}><strong>behaviour / FLOP</strong><span>inference</span></div>
            <div className={styles.densityUnit}><strong>behaviour / joule</strong><span>deployment</span></div>
            <div className={styles.densityUnit}><strong>behaviour / parameter</strong><span>architecture</span></div>
            <div className={styles.densityUnit}><strong>behaviour / change</strong><span>modification</span></div>
          </div>
        </div>
      </section>

      <section className={styles.section} id="evidence" aria-labelledby="evidence-title">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.label}>Receipts</p>
            <h2 id="evidence-title">What we have <em>actually</em> measured.</h2>
          </div>
          <p>
            The thesis is larger than the evidence. These are the two results that exist today,
            with their conditions attached.
          </p>
        </div>

        <div className={styles.evidenceGrid}>
          {evidence.map((item) => (
            <article className={styles.evidenceCard} key={item.title}>
              <div className={styles.figureLabel}>
                <b>{item.index}</b>
                <i />
                <span>{item.tag}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <ul>
                {item.facts.map((fact) => <li key={fact}>{fact}</li>)}
              </ul>
              <Link href={item.href} className={styles.cardLink}>{item.action} <Arrow /></Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} id="stack" aria-labelledby="stack-title">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.label}>The stack</p>
            <h2 id="stack-title">Research should leave <em>systems behind.</em></h2>
          </div>
          <p>
            BTL Commercial contracts the lab out to institutions. The systems below are what the research has produced so far,
            infrastructure, memory and private frontier intelligence.
          </p>
        </div>

        <SystemDeck />
      </section>

      <section className={styles.closing} aria-labelledby="closing-title">
        <p className={styles.label}>The operating principle</p>
        <h2 id="closing-title">Spend capacity where <em>behaviour needs it.</em></h2>
        <p>
          The scaling era asks how much more capability we can obtain by spending more. BTL asks
          how much was necessary in the first place. If the measurements survive, intelligence gets
          cheaper, smaller, more local and easier to change. If they do not, we will know where the
          floor begins.
        </p>
        <div className={styles.closingActions}>
          <Link className={styles.primaryButton} href="/papers">Read the research <Arrow /></Link>
          <a className={styles.secondaryButton} href={githubUrl} target="_blank" rel="noreferrer">See the work <Arrow /></a>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div>
            <strong>BTL</strong>
            <p>Capability accounting for neural networks.</p>
            <small>Bad Theory Labs · built in Lagos</small>
          </div>
          <div className={styles.footerLinks}>
            <div>
              <span>Research</span>
              <Link href="/thesis">Thesis</Link>
              <Link href="/papers">Papers</Link>
              <Link href="/context-integrity">Benchmarks</Link>
            </div>
            <div>
              <span>Platform</span>
              <Link href="/runtime">Runtime</Link>
              <a href="https://retaindb.com" target="_blank" rel="noreferrer">RetainDB</a>
              <Link href="/btl-3">Models</Link>
            </div>
            <div>
              <span>Lab</span>
              <a href={githubUrl} target="_blank" rel="noreferrer">GitHub</a>
              <a href={discordUrl} target="_blank" rel="noreferrer">Discord</a>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© 2026 Bad Theory Labs</span>
          <span>Capability efficiency · measured, published, and applied</span>
        </div>
      </footer>
    </main>
  );
}

import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import styles from "./thesis.module.css";

export default function Thesis() {
  return (
    <main className={styles.page}>
      <SiteNav />

      <div className={styles.wrap}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}><span />The thesis</p>
          <h1>Every technology that mattered started out <em>too big to own.</em></h1>
        </header>

        <div className={styles.body}>
          <div className={styles.rail}>
            BTL<br />
            Lagos<br />
            2026
          </div>

          <article className={styles.prose}>
            <p>Computing was a room you booked time in. Then it became a box on a desk.</p>

            <p>
              The box was not more powerful than the room. For years, it was not even close. What mattered
              was that it became small enough to belong to one person. You could use it without permission,
              change it without filing a request, and build things its manufacturer never anticipated.
            </p>

            <p>Everything that followed came from that shift in ownership.</p>

            <p className={styles.beat}>Intelligence is still at the room stage.</p>

            <p>
              The models that can reliably finish difficult work run inside datacentres. You reach them
              through a meter. You build on a roadmap you do not set, at a price you do not control, on a
              system you cannot inspect. Your data crosses someone else&apos;s perimeter. When the model
              changes, you find out after your product changes with it.
            </p>

            <p>This arrangement is useful, but it is not the final form of computing.</p>

            <p>
              We do not think intelligence will remain something most people rent from a handful of
              companies. We also do not think physics is the main reason it is concentrated there today.
            </p>

            <p>
              The industry has spent enormous effort making models more capable. It has spent far less
              effort making that capability efficient enough to own. Models carry redundant capacity.
              Inference systems are designed around fleets of accelerators. Training rewards the best answer
              a datacentre can produce, even when reaching that answer requires an uneconomical amount of
              computation. Benchmarks celebrate the highest score and rarely ask what it cost, where it ran,
              or whether the result survived compression.
            </p>

            <p className={styles.lift}>Those are engineering choices. Engineering choices can change.</p>

            <p>
              The personal computer did not replace the mainframe by becoming a smaller mainframe. It
              created a different relationship between people and computation. Local intelligence will do
              the same.
            </p>

            <p>
              The first locally owned systems will not beat the largest datacentre models at every task.
              They do not need to. They need to cross a more important threshold: capable enough to finish
              valuable work, affordable enough to run continuously, and open enough for their owner to
              shape.
            </p>

            <p>
              Once that threshold is crossed, the economics change. A company can adapt its intelligence to
              its own work without sending every request through an external API. A developer can build
              against a model that will not disappear next quarter. A hospital, school, laboratory, or
              government can keep sensitive knowledge within its own boundary. People can continue using the
              system when the network is unavailable, the provider changes its terms, or the meter becomes
              too expensive.
            </p>

            <p>Ownership also changes what gets built.</p>

            <p>
              Rented intelligence must serve the average customer. Owned intelligence can become deeply
              specific. It can learn how one team writes software, how one factory fails, how one researcher
              tests a hypothesis, or how one person works across years. Its memory can remain with its
              owner. Its behaviour can be measured against the work that actually matters there.
            </p>

            <p>
              This is why making models smaller is only part of the problem. A compressed model that becomes
              unreliable is not progress. Neither is a cheap model whose failures are hidden by a benchmark
              average.
            </p>

            <p>
              We need better ways to decide what a model can lose, what it must preserve, and what it can
              learn after it becomes smaller. We need evaluations built around behaviour, not only
              perplexity. We need inference systems that treat memory, tools, routing, and recovery as parts
              of intelligence rather than expensive additions around it. We need models designed for the
              hardware people can realistically own.
            </p>

            <p><strong>That is the work of BTL.</strong></p>

            <p>
              We are working across models, evaluation, inference, memory, and agent systems because no
              single compression trick completes this transition. The objective is broader: move useful
              intelligence down the cost curve without losing the behaviour that made it worth having.
            </p>

            <p>
              Datacentre intelligence will continue to exist, just as mainframes and supercomputers still
              exist. Some problems should use the largest machine available. But most computation no longer
              requires a trip to a central facility, and intelligence will not either.
            </p>

            <p className={styles.close}>
              The next era begins when intelligence stops being somewhere you visit and becomes something
              you keep.
            </p>
          </article>
        </div>

        <section className={styles.after}>
          <p>Intelligence efficient enough to own</p>
          <Link className={styles.btn} href="/papers">Read the research</Link>
          <Link className={styles.btnGhost} href="/">See what we ship</Link>
        </section>
      </div>
    </main>
  );
}

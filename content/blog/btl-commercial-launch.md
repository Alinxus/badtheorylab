---
title: "BTL Commercial is open"
date: 2026-09-12
tag: Company
author: Bad Theory Labs
excerpt: "Governments and enterprises can now contract us directly. We write the bar down before the work starts, and we will tell you when your problem is not ready for one."
---

We have opened BTL Commercial. Governments, enterprises and institutions can now contract us
directly instead of waiting on whatever we decide to publish.

The shape of the work changes every time. Sometimes what comes back is a research finding and the
measurements behind it. Sometimes it is a model trained against a constraint nobody else has reason
to care about, or a system running on hardware the client owns and we never touch again. We have
also taken briefs where the thing being asked for does not exist yet and somebody has to go and make
it. That last kind is the one we want most.

What stays the same is that we write the bar down first. Four things go in writing before serious
work starts: what happens today, measured before we change anything; what has to become true, as a
number or a behaviour or an operating condition; how both sides will tell whether it happened; and
what counts as finished. If we cannot agree those with you, your problem is not ready for a research
contract, and we would rather say so than bill you while we find out.

That is a measurement lab talking. We study capability efficiency, which means working out how much
compute, memory and data a behaviour actually needs and then not spending the rest. We think capacity
gets wasted in seven places. Two of them are now measured and published. In the first, choosing the
numerical range before choosing the representation moved behavioural retention from 77.1% to 95.8%
on an identical byte budget, and cost twelve GPU-seconds. In the second, small recoverable expert
matrices got back to 49.4% of their behaviour after aggressive compression while much larger dense
matrices stalled near 23%.

We are taking commercial work because the hard version of those questions is already sitting inside
banks, ministries and infrastructure operators, attached to hardware we do not own and to failure
conditions we would never have thought to write down ourselves. A lab can invent a constraint. It
cannot invent the one an operator has been living with for six years.

Everything we learn on contract goes back into the same body of work. Our models are open weight,
and the methods behind them are published with the runs that failed. BTL-4 is a 35.1B-parameter
mixture-of-experts model scoring 78.4% on SWE-bench Verified. BTL-4 Compact is the same model in a
9.96 GB artifact that holds 94.1% of measured behaviour, activates about 2.1B parameters per token,
and decodes at 31.9 tokens per second on an M4 laptop.

We are a small team and we would rather talk than exchange documents. Bring the problem to
[hello@badtheorylabs.com](mailto:hello@badtheorylabs.com), or book a call at
[badtheorylabs.com/contact](/contact). Tell us what you are trying to change, what cannot move, and
how you would know it had worked.

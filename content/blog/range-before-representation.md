---
title: "Same bytes, more behaviour: what range selection bought us"
date: 2026-08-14
tag: Research
author: Bad Theory Labs
excerpt: "Choosing the numerical range before choosing the representation moved behavioural retention from 77.1% to 95.8% on an identical byte budget, in twelve GPU-seconds."
---

Quantization papers usually report an average and move on. We kept finding that the average was the
part that lied. A model would post healthy aggregate numbers after compression and then quietly stop
calling tools correctly, and nothing in the average showed it.

So we measured named behaviours before and after instead, under stated conditions, and ran the same
byte budget two ways.

## What we changed

Nothing about the format, and nothing about the size. The only variable was where the numerical
range came from.

The usual approach takes the range from the minimum and maximum weight in the tensor. That sounds
neutral until you look at the distribution. In the layer we studied, the full range is 1.89 times
wider than the range covering the first to the ninety-ninth percentile. Roughly half the available
levels get spent on the tails, where almost none of the weights live.

Taking the range from the distribution instead, and clipping what falls outside it, puts those levels
where the mass actually is.

## What it bought

| Bit depth | Range from min and max | Range from the distribution | Error cut |
| --- | --- | --- | --- |
| 4 bits | 0.00248 | 0.00177 | 28.6% |
| 3 bits | 0.00493 | 0.00287 | 41.9% |
| 2.3 bits | 0.00981 | 0.00533 | 45.7% |
| 1.6 bits | 0.01493 | 0.01032 | 30.9% |

At the depth we ship, the error roughly halves. The byte budget is identical in both columns. No
calibration corpus was used, and the intervention cost twelve GPU-seconds.

On the behavioural evaluation that matters to us, retention moved from **77.1% to 95.8%**.

## Why it matters beyond this layer

This is one of seven questions we are working through about where a model's capacity goes.
Representation is the first, and it is now measured. The finding generalises in an uncomfortable
direction: if half the representational budget can be misallocated by a default nobody questions,
the same is probably true elsewhere in the stack.

That is the thesis. Most models are paying for capacity their behaviour never asked for, and the
waste is recoverable without buying anything.

The paper, the method and the failed runs are published. The weights are on Hugging Face.

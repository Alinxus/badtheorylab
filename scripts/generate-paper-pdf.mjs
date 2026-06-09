import puppeteer from "puppeteer";
import { writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>The Reasoning Gap: Frontier LLMs Fail at Interventional Causal Inference from Probability Tables</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"
  onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}]});"></script>
<style>
@page { margin: 2.5cm; size: a4; }
body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.4; color: #000; max-width: 160mm; margin: 0 auto; }
h1 { font-size: 22pt; text-align: center; margin-top: 0; margin-bottom: 4pt; line-height: 1.15; }
h2 { font-size: 14pt; margin-top: 20pt; margin-bottom: 8pt; }
h3 { font-size: 12pt; margin-top: 16pt; margin-bottom: 6pt; }
h4 { font-size: 11pt; margin-top: 14pt; margin-bottom: 4pt; }
p { margin: 6pt 0; text-align: justify; }
.author { text-align: center; font-size: 11pt; margin-bottom: 4pt; }
.date { text-align: center; font-size: 10pt; color: #555; margin-bottom: 12pt; }
.abstract { margin: 12pt 0; padding: 8pt 12pt; border-left: 2px solid #ccc; font-size: 10.5pt; }
.abstract-title { font-weight: bold; font-size: 11pt; }
table { width: 100%; border-collapse: collapse; margin: 10pt 0; font-size: 10pt; }
th { background: #f5f5f5; padding: 6pt 8pt; text-align: left; font-weight: bold; border: 1px solid #ccc; }
td { padding: 6pt 8pt; border: 1px solid #ccc; }
.caption { font-size: 10pt; font-weight: bold; margin-bottom: 4pt; }
ul, ol { margin: 4pt 0; padding-left: 22pt; }
li { margin-bottom: 2pt; }
.bib { font-size: 9.5pt; line-height: 1.3; }
.bib p { margin: 2pt 0; text-indent: -18pt; padding-left: 18pt; text-align: left; }
blockquote { font-style: italic; margin: 12pt 0; padding: 0 12pt; border-left: 2px solid #ccc; color: #333; }
.note { font-size: 9pt; color: #666; }
.katex { font-size: 1.05em; }
</style>
</head>
<body>

<h1>The Reasoning Gap:<br>Frontier LLMs Fail at Interventional<br>Causal Inference from Probability Tables</h1>

<p class="author">Olajide Al-ameen<br>Bad Theory Labs<br>hello@badtheorylab.com</p>
<p class="date">June 2026</p>

<div class="abstract">
<span class="abstract-title">Abstract</span>
<p>We introduce a causal reasoning benchmark that cleanly separates observational from interventional queries over the same causal graphs and probability tables. Across 840 four-choice questions spanning seven canonical graph templates, we evaluate three frontier large language models: GPT-5.4, GPT-4o mini, and Gemini 2.0 Flash. All three models perform at or near random chance (25.0% [22.2, 28.0], 25.7% [22.9, 28.8], and 29.2% [14.9, 49.2] respectively, 95% Wilson confidence intervals), while an exact inference baseline achieves 100%. Human experts achieve 97.8% on similar formal causal reasoning tasks [6]. Notably, models also fail at observational queries, suggesting a broader inability to compute probabilities from CPTs rather than a deficit specific to interventional reasoning. We release the full benchmark, evaluation code, and a live test interface at https://www.badtheorylabs.com/reasoning-test.</p>
</div>

<h2>1 Introduction</h2>

<p>There is a difference between pattern completion and reasoning. Pattern completion is what happens when a system has seen enough similar examples to guess the next word. Reasoning is what happens when a system can simulate an intervention and track its consequences through a causal structure. The two look the same on many benchmarks. They are not the same.</p>

<p>Current large language models are pattern completion systems trained at enormous scale. They can write fluently about causality, cite Pearl, and answer association questions correctly [1]. But when the task requires computing $P(Y \\mid do(X))$ from a set of probability tables over an explicit causal graph, they fail. Not by a little. They score exactly at chance.</p>

<p>This paper builds a benchmark that separates the two. Every question gives the complete causal graph and all conditional probability tables. The only thing that changes is the query: observational, interventional, or counterfactual. No missing information. No ambiguous language. No need to retrieve commonsense knowledge from training data. The model either computes the correct probability or it does not.</p>

<p>Our main findings are:</p>

<ul>
  <li><b>All evaluated models perform at or near random chance.</b> GPT-5.4 (25.0%, 95% CI [22.2, 28.0]), GPT-4o mini (25.7%, 95% CI [22.9, 28.8]), and Gemini 2.0 Flash (29.2%, 95% CI [14.9, 49.2]) all score indistinguishably from the 25% baseline expected from random guessing on four-choice questions.</li>
  <li><b>Scale does not help.</b> The most capable model (GPT-5.4) performs no better than the cheapest (GPT-4o mini), consistent with an architectural rather than a scaling limitation.</li>
  <li><b>The problem is solvable.</b> An exact inference engine achieves 100%, and human experts score 97.8% on comparable tasks [6].</li>
</ul>

<p>We release the full benchmark, evaluation code, and a live test interface at https://www.badtheorylabs.com/reasoning-test.</p>

<h2>2 Related Work</h2>

<h3>2.1 Causal Reasoning Benchmarks</h3>

<p>Several benchmarks evaluate causal reasoning in LLMs. CLadder [1] generates questions from structural causal models and covers multiple reasoning levels, finding that models perform well on association but degrade on intervention and counterfactual queries. CausalBench [4] evaluates across textual, mathematical, and coding domains with four reasoning perspectives per scenario. CausalProbe [5] uses fresh news corpora to test whether LLMs can reason about unseen causal scenarios, finding significant performance drops compared to memorization-prone benchmarks.</p>

<p>CounterBench [6] specifically targets counterfactual reasoning with 1,200 questions, finding that GPT-4o and DeepSeek-V3 achieve approximately 50% (random chance for binary questions). Notably, two PhD-level human annotators scored 97.75% on a 200-question subset, demonstrating that the tasks are solvable with genuine reasoning.</p>

<p>Our benchmark differs from these in two key respects. First, every question provides complete information: the full causal graph and all conditional probability tables are visible. Second, we explicitly pair observational and interventional queries on identical causal structures, ensuring that any performance gap isolates the ability to reason about interventions.</p>

<h3>2.2 LLMs and Causal Understanding</h3>

<p>Previous work has raised questions about whether LLMs genuinely reason causally. Zecevic et al. [2] found that models could not reliably distinguish causal from correlational claims. Kiciman et al. [3] showed that while models could retrieve known causal facts from training data, they struggled with abstract causal tasks.</p>

<p>Jin et al. [1] demonstrated that LLMs can solve association-level problems but exhibit a sharp drop at the intervention level. Our results extend this finding: even with complete probability tables and explicit graph structure, models fail to compute interventional probabilities &mdash; a task that requires nothing more than applying the causal adjustment formula.</p>

<h2>3 Benchmark Design</h2>

<h3>3.1 Graph Templates</h3>

<p>We define seven causal graph templates, each representing a distinct causal structure:</p>

<ol>
  <li><b>Chain:</b> $X \\rightarrow M \\rightarrow Y$ (control condition &mdash; observational and interventional queries produce identical answers)</li>
  <li><b>Fork:</b> $X \\leftarrow Z \\rightarrow Y$ (confounding)</li>
  <li><b>Collider:</b> $X \\rightarrow Z \\leftarrow Y$ (selection bias)</li>
  <li><b>M-bias:</b> $X \\rightarrow Z_1 \\leftarrow U \\rightarrow Z_2 \\leftarrow Y$ (M-shaped structure)</li>
  <li><b>Instrumental variable:</b> $Z \\rightarrow X \\rightarrow Y$, with $Z \\not\\rightarrow Y$ (instrument)</li>
  <li><b>Front-door:</b> $X \\rightarrow M \\rightarrow Y$, with $X \\leftarrow U \\rightarrow Y$ (front-door criterion)</li>
  <li><b>Back-door:</b> $X \\rightarrow Y$, with $X \\leftarrow Z \\rightarrow Y$ (back-door criterion)</li>
</ol>

<p>For each template, we define 3&ndash;5 scenario themes (e.g., for the fork: ice cream sales, weather, drowning incidents). Each scenario provides named variables with natural-language values.</p>

<h3>3.2 Parametric Generation</h3>

<p>To prevent memorization of specific numeric patterns, we generate random conditional probability tables for each instance using a seeded pseudorandom number generator. CPTs are drawn uniformly from the simplex of appropriate dimension (2&ndash;3 values per variable). This produces 20 random instantiations per graph template, yielding 140 unique causal models, each with 6 questions (observational, interventional, and counterfactual queries at varying granularities), for a total of 840 four-choice questions.</p>

<h3>3.3 Question Types</h3>

<p>Questions are generated in three categories:</p>

<ol>
  <li><b>Observational:</b> &ldquo;Among employees who completed training, what percentage achieved high performance?&rdquo; (conditioning on evidence)</li>
  <li><b>Interventional:</b> &ldquo;If we <i>force</i> everyone to complete training, what percentage would achieve high performance?&rdquo; ($\\operatorname{do}(X)$)</li>
  <li><b>Counterfactual:</b> &ldquo;Given that an employee completed training and achieved low performance, what would their performance have been if they had not completed training?&rdquo; (retrospective reasoning)</li>
</ol>

<p>Each question includes the complete causal graph (variable names and edges) and all CPTs. The answer choices consist of the ground-truth value plus three distractors drawn from a fixed pool of plausible percentages, randomized per question.</p>

<h3>3.4 Metric</h3>

<p>All questions are four-choice multiple choice. We report accuracy as the proportion of correctly answered questions. Random chance is 25%. We report 95% Wilson confidence intervals for all proportions [10].</p>

<h3>3.5 Example Questions</h3>

<p>Tables 1 and 2 show a paired observational and interventional question from the chain graph. Both share the same causal structure ($\\text{Training} \\rightarrow \\text{Skill} \\rightarrow \\text{Performance}$) and identical CPTs. The only difference is the query type.</p>

<p class="caption">Table 1: Observational question (chain graph).</p>
<table>
  <tr><th>CPTs</th><th></th></tr>
  <tr><td>$P(\\text{Training})$</td><td>no 50%, yes 50%</td></tr>
  <tr><td>$P(\\text{Skill} \\mid \\text{Training}=\\text{no})$</td><td>low 70%, medium 25%, high 5%</td></tr>
  <tr><td>$P(\\text{Skill} \\mid \\text{Training}=\\text{yes})$</td><td>low 10%, medium 35%, high 55%</td></tr>
  <tr><td>$P(\\text{Performance} \\mid \\text{Skill}=\\text{low})$</td><td>low 80%, medium 15%, high 5%</td></tr>
  <tr><td>$P(\\text{Performance} \\mid \\text{Skill}=\\text{medium})$</td><td>low 30%, medium 50%, high 20%</td></tr>
  <tr><td>$P(\\text{Performance} \\mid \\text{Skill}=\\text{high})$</td><td>low 5%, medium 20%, high 75%</td></tr>
  <tr><td><b>Query</b></td><td>Among employees who COMPLETED training, what % achieved HIGH performance?</td></tr>
  <tr><td><b>Answer</b></td><td>49%</td></tr>
</table>

<p class="caption">Table 2: Interventional question (same chain graph, identical CPTs).</p>
<table>
  <tr><th>CPTs</th><th>(same as Table 1)</th></tr>
  <tr><td><b>Query</b></td><td>If the company FORCED everyone to complete training, what % would achieve HIGH performance?</td></tr>
  <tr><td><b>Answer</b></td><td>49%</td></tr>
</table>

<p>In the chain graph, observational and interventional queries produce the same answer because there is no confounding. This serves as a control condition. In graphs with confounding (fork, collider, M-bias, etc.), the answers differ, and models must correctly apply the adjustment formula.</p>

<p class="caption">Table 3: Interventional question with confounding (fork graph).</p>
<table>
  <tr><th>Graph</th><td>Wealth $\\rightarrow$ Education, Wealth $\\rightarrow$ Income</td></tr>
  <tr><th>CPTs</th><td></td></tr>
  <tr><td>$P(\\text{Wealth})$</td><td>low 50%, high 50%</td></tr>
  <tr><td>$P(\\text{Education} \\mid \\text{Wealth}=\\text{low})$</td><td>basic 80%, advanced 20%</td></tr>
  <tr><td>$P(\\text{Education} \\mid \\text{Wealth}=\\text{high})$</td><td>basic 20%, advanced 80%</td></tr>
  <tr><td>$P(\\text{Income} \\mid \\text{Wealth}=\\text{low})$</td><td>low 60%, medium 30%, high 10%</td></tr>
  <tr><td>$P(\\text{Income} \\mid \\text{Wealth}=\\text{high})$</td><td>low 10%, medium 30%, high 60%</td></tr>
  <tr><td><b>Observational query</b></td><td>Among people with HIGH wealth, what % have HIGH income?</td></tr>
  <tr><td><b>Answer</b></td><td>60%</td></tr>
  <tr><td><b>Interventional query</b></td><td>If the government PAID for everyone to get ADVANCED education, what % would have HIGH income?</td></tr>
  <tr><td><b>Answer</b></td><td>35%</td></tr>
</table>

<p>Table 3 illustrates the fork graph, where wealth confounds the relationship between education and income. The observational answer (60%) differs from the interventional answer (35%) because conditioning on wealth blocks the confounder, while $\\operatorname{do}(\\text{education})$ requires marginalizing over the wealth distribution. A model that treats $\\operatorname{do}(X)$ as conditioning on $X$ would answer the observational query incorrectly for the interventional question.</p>

<h2>4 Experiments</h2>

<h3>4.1 Models</h3>

<p>We evaluate three language models:</p>

<ul>
  <li><b>GPT-4o mini</b> (OpenAI): a cost-efficient model, representative of the &ldquo;small&rdquo; frontier tier.</li>
  <li><b>GPT-5.4</b> (OpenAI): OpenAI's most capable model at time of evaluation, representing the frontier.</li>
  <li><b>Gemini 2.0 Flash</b> (Google): a fast, cost-efficient model from the Gemini family.</li>
</ul>

<p>We also include an <b>exact solver</b> baseline that computes ground-truth answers by enumerating all assignments over the joint distribution defined by the CPTs. This validates benchmark correctness.</p>

<h3>4.2 Procedure</h3>

<p>Each model is prompted with a single question at a time. The prompt includes:</p>

<ul>
  <li>The causal graph description (variables and directed edges)</li>
  <li>The full conditional probability tables</li>
  <li>The query in natural language</li>
  <li>Four answer choices labeled A&ndash;D</li>
</ul>

<p>Models are instructed to output the letter corresponding to the correct answer. We use temperature 0 for deterministic responses and parse the answer letter from the output. Each model answers all 840 questions independently.</p>

<h3>4.3 Results</h3>

<p class="caption">Table 4: Overall accuracy across models. 95% Wilson confidence intervals in brackets. Random chance is 25%.</p>
<table>
  <tr><th>Model</th><th>Total</th><th>Correct</th><th>Accuracy</th><th>95% CI</th></tr>
  <tr><td>Exact solver</td><td>840</td><td>840</td><td>100.0%</td><td>&mdash;</td></tr>
  <tr><td>Gemini 2.0 Flash$^\\dagger$</td><td>24</td><td>7</td><td>29.2%</td><td>[14.9, 49.2]</td></tr>
  <tr><td>GPT-4o mini</td><td>840</td><td>216</td><td>25.7%</td><td>[22.9, 28.8]</td></tr>
  <tr><td>GPT-5.4</td><td>840</td><td>210</td><td>25.0%</td><td>[22.2, 28.0]</td></tr>
  <tr><td>Random chance</td><td>&mdash;</td><td>&mdash;</td><td>25.0%</td><td>&mdash;</td></tr>
</table>
<p class="note">$^\\dagger$Gemini 2.0 Flash was evaluated on only 24 questions due to API rate limits. All other models evaluated on the full 840-question set.</p>

<p>Table 4 presents the main results. All three models score near the random-chance baseline of 25%. GPT-5.4, despite being the most capable model in the set, achieves 25.0% &mdash; exactly at chance (95% CI [22.2, 28.0]). GPT-4o mini achieves 25.7% (95% CI [22.9, 28.8]), and Gemini 2.0 Flash achieves 29.2% on a limited subset of 24 questions (95% CI [14.9, 49.2]). In all cases, the 95% confidence interval includes 25%, meaning none of the models perform statistically significantly above random chance. The exact solver achieves 100%, confirming benchmark correctness.</p>

<p class="caption">Table 5: Accuracy by question type.</p>
<table>
  <tr><th>Model</th><th>Observational</th><th>Interventional</th><th>Counterfactual</th></tr>
  <tr><td>GPT-4o mini</td><td>24.2% (110/455)</td><td>27.0% (85/315)</td><td>30.0% (21/70)</td></tr>
  <tr><td>GPT-5.4</td><td>24.2% (110/455)</td><td>24.8% (78/315)</td><td>31.4% (22/70)</td></tr>
</table>

<p>Table 5 breaks down performance by question type. Notably, models do not perform better on observational than interventional questions &mdash; they fail uniformly across all three levels. This suggests that the primary difficulty is not specifically about interventions but rather a broader inability to compute probabilities from CPTs presented in text form.</p>

<p class="caption">Table 6: Accuracy by graph template.</p>
<table>
  <tr><th>Graph</th><th>GPT-4o mini</th><th>GPT-5.4</th></tr>
  <tr><td>Chain</td><td>39.0%</td><td>21.0%</td></tr>
  <tr><td>Fork</td><td>24.3%</td><td>25.7%</td></tr>
  <tr><td>Collider</td><td>22.9%</td><td>32.4%</td></tr>
  <tr><td>M-bias</td><td>27.1%</td><td>27.9%</td></tr>
  <tr><td>Instrument</td><td>28.6%</td><td>22.1%</td></tr>
  <tr><td>Front-door</td><td>18.1%</td><td>24.8%</td></tr>
  <tr><td>Back-door</td><td>19.0%</td><td>21.0%</td></tr>
</table>

<p>Table 6 shows accuracy by graph template. Performance varies but remains near chance across all structures. The chain graph (where observational equals interventional) shows slightly higher accuracy for GPT-4o mini (39.0%) but not GPT-5.4 (21.0%), suggesting that even the simplest case does not reliably succeed.</p>

<h2>5 Discussion</h2>

<h3>5.1 Why Do Models Fail?</h3>

<p>The failure is striking because the task appears straightforward: given a causal graph and complete CPTs, compute a probability. An undergraduate statistics student can solve these problems with a few minutes of calculation. Human experts score 97.8% on comparable tasks [6]. The exact inference engine achieves 100%.</p>

<p>One possible explanation is that LLMs process the provided numeric CPTs as text tokens without performing the compositional computation that inference requires. Computing $P(Y \\mid \\operatorname{do}(X))$ involves summing over intermediate variables while respecting the causal graph structure &mdash; a multi-step operation that transformer-based architectures are not designed to execute reliably [7, 9]. However, we note that the evaluated models perform at chance even on observational queries (Table 5), which require only basic probability computation from given CPTs. This suggests the failure may stem from a broader inability to compute with probabilities in text form, rather than a deficit specific to causal reasoning per se. Disentangling these explanations requires further work with non-causal arithmetic controls.</p>

<h3>5.2 Scale Does Not Close the Gap</h3>

<p>GPT-5.4 (25.0%) performs no better than GPT-4o mini (25.7%). While a two-model comparison is limited, this result is consistent with the hypothesis that the limitation may be architectural rather than a matter of scale. If interventional reasoning required more parameters or more training data, we would expect the frontier model to outperform the budget model. It does not.</p>

<p>This finding aligns with concurrent work showing that scaling alone does not close the compositionality gap [8] and that transformer-based models exhibit systematic gaps in multi-step reasoning [11].</p>

<h3>5.3 Implications</h3>

<p>Every claim that an LLM can <i>reason</i> carries an implicit bet: that the model can tell the difference between seeing and doing. Our results suggest this bet is not yet safe. The distinction between $P(Y \\mid X)$ and $P(Y \\mid do(X))$ is not academic. It is what separates a system that predicts what it observes from a system that can evaluate what would happen if it acted.</p>

<p>The practical reading is straightforward. If you deploy an LLM in any setting where it recommends an action based on data, and you cannot verify that it correctly distinguishes observation from intervention, you should assume it does not. Because it probably does not. Human experts, given the same information, score near perfectly. The models score at chance. That gap is not going to close with more parameters. It is going to close with a different approach.</p>

<h3>5.4 Limitations</h3>

<p>This study has several limitations. First, we evaluate only three models; a broader survey would be valuable. Second, Gemini 2.0 Flash was evaluated on only 24 questions due to API rate limits, which limits statistical power and comparability. Third, our benchmark tests a specific form of causal reasoning (discrete CPTs over small graphs), and results may not generalize to continuous or high-dimensional settings. Fourth, all questions are four-choice, and we do not measure calibration or confidence.</p>

<p>Fifth, and most importantly, our benchmark conflates causal reasoning with arithmetic computation from probability tables. Models score at chance on observational queries as well as interventional ones (Table 5), suggesting the failure may reflect a general inability to compute probabilities from text rather than a deficit specific to causal reasoning. A non-causal control condition &mdash; where models compute marginal probabilities from tables without causal structure &mdash; would help isolate the source of failure. We leave this control for future work, but note that even a pure arithmetical interpretation of our results has practical significance: if frontier models cannot reliably compute probabilities from conditional probability tables, they cannot be trusted in settings that require probabilistic reasoning.</p>

<h2>6 Conclusion</h2>

<p>We introduce a controlled benchmark for interventional reasoning in LLMs, finding that evaluated models &mdash; including the frontier GPT-5.4 &mdash; perform at or near random chance when asked to distinguish observational from interventional queries. None of the models perform statistically significantly above the 25% chance baseline. The failure persists across model scale and graph structure. These results suggest that reliable causal reasoning from probability tables remains an open challenge for current frontier models.</p>

<p>We release our benchmark, evaluation code, and a public test interface at https://www.badtheorylabs.com/reasoning-test.</p>

<h2>References</h2>

<div class="bib">
<p>[1] Z. Jin, Y. Chen, F. Leeb, L. Gresele, O. Kamal, Z. Lyu, K. Blin, F. Gonzalez Adauto, M. Kleiman-Weiner, M. Sachan, et al. CLadder: A benchmark to assess causal reasoning capabilities of language models. In <i>NeurIPS</i>, 2024.</p>
<p>[2] M. Zecevic, M. Willig, D. Dhami, and K. Kersting. Causal parrots: Large language models may talk causality but are not causal. arXiv:2308.13067, 2023.</p>
<p>[3] E. Kiciman, R. Ness, A. Sharma, and C. Tan. Causal reasoning and large language models: Opening a new frontier for causality. arXiv:2305.00050, 2024.</p>
<p>[4] Z. Wang. CausalBench: A comprehensive benchmark for evaluating causal reasoning capabilities of large language models. In <i>SIGHAN</i>, 2024.</p>
<p>[5] H. Chi, H. Li, W. Yang, F. Liu, L. Lan, X. Ren, T. Liu, and B. Han. Unveiling causal reasoning in large language models: Reality or mirage? In <i>NeurIPS</i>, 2024.</p>
<p>[6] Y. Chen, V. K. Singh, J. Ma, and R. Tang. CounterBench: Evaluating and improving counterfactual reasoning in large language models. arXiv:2502.11008, 2025.</p>
<p>[7] J. Thomm, G. Camposampiero, A. Terzic, M. Hersche, B. Sch&ouml;lkopf, and A. Rahimi. Limits of transformer language models on learning to compose algorithms. In <i>NeurIPS</i>, 2024.</p>
<p>[8] O. Press, M. Zhang, S. Min, L. Schmidt, N. Smith, and M. Lewis. Measuring and narrowing the compositionality gap in language models. arXiv:2210.03350, 2022.</p>
<p>[9] N. Dziri, X. Lu, M. Sclar, X. Li, L. Zettlemoyer, and Y. Bisk. Faith and fate: Limits of transformers on compositionality. In <i>NeurIPS</i>, 2024.</p>
<p>[10] E. B. Wilson. Probable inference, the law of succession, and statistical inference. <i>Journal of the American Statistical Association</i>, 22(158):209&ndash;212, 1927.</p>
<p>[11] J. Zhao, J. Tong, Y. Mou, M. Zhang, Q. Zhang, and X. Huang. Exploring the compositional deficiency of large language models in mathematical reasoning through trap problems. In <i>EMNLP</i>, 2024.</p>
</div>

</body>
</html>`;

const outDir = resolve(__dirname, "..", "public", "reasoning-gap");
mkdirSync(outDir, { recursive: true });

const htmlPath = resolve(outDir, "paper.html");
writeFileSync(htmlPath, html, "utf-8");

const chromePath = "C:\\Users\\pc\\.cache\\puppeteer\\chrome\\win64-149.0.7827.22\\chrome-win64\\chrome.exe";
const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();
await page.goto("file://" + htmlPath, { waitUntil: "networkidle0" });
await page.waitForFunction(() => document.querySelectorAll(".katex").length > 0, { timeout: 30000 });

const pdfPath = resolve(outDir, "paper.pdf");
await page.pdf({
  path: pdfPath,
  format: "A4",
  printBackground: true,
  margin: { top: "2.5cm", bottom: "2.5cm", left: "2.5cm", right: "2.5cm" },
});

await browser.close();
console.log("PDF generated:", pdfPath);

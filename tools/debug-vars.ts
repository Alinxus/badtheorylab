import { chainGraph } from "../src/bench/graphs/chain";
import { forkGraph } from "../src/bench/graphs/fork";
import { instrumentGraph } from "../src/bench/graphs/instrument";
import { frontdoorGraph } from "../src/bench/graphs/frontdoor";
import { backdoorGraph } from "../src/bench/graphs/backdoor";

console.log("chain:", JSON.stringify(chainGraph.variables.map(v=>v.id)));
console.log("fork:", JSON.stringify(forkGraph.variables.map(v=>v.id)));
console.log("instrument:", JSON.stringify(instrumentGraph.variables.map(v=>v.id)));
console.log("frontdoor:", JSON.stringify(frontdoorGraph.variables.map(v=>v.id)));
console.log("backdoor:", JSON.stringify(backdoorGraph.variables.map(v=>v.id)));

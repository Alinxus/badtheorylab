import { mbiasGraph } from "../src/bench/graphs/mbias";
import { marginalProb } from "../src/lib/inference";

console.log("Variables:", JSON.stringify(mbiasGraph.variables));
console.log("CPTs:", JSON.stringify(mbiasGraph.cpts));
try {
  const r = marginalProb(mbiasGraph, "Y", "full", { X: "drug", M: "positive" });
  console.log("Result:", r);
} catch(e) {
  console.error("Error:", e);
}

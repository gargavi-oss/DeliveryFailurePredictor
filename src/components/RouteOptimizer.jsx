import { useState } from "react";

export default function RouteOptimizer({ stops, setStops, setBeforeRoute }) {

    const optimizeRoute = () => {
      if (!stops || stops.length === 0) return;
  
      // ✅ STEP 1: Save original route
      const original = stops.map(s => ({ ...s }));
      setBeforeRoute(original);
  
      // ✅ STEP 2: Sort by highest risk first
      const optimized = [...stops].sort((a, b) => b.prob - a.prob);
  
      // ✅ STEP 3: Simulate improvement (IMPORTANT)
      const improved = optimized.map((s, index) => {
        let newProb = s.prob;
  
        // earlier stops = less delay → reduce risk
        if (index < 2) newProb *= 0.7;
        else if (index < 4) newProb *= 0.85;
  
        // recalculate risk level
        let newRisk = "LOW";
        if (newProb > 0.7) newRisk = "HIGH";
        else if (newProb > 0.45) newRisk = "MEDIUM";
  
        return {
          ...s,
          prob: newProb,
          risk: newRisk
        };
      });
  
      // ✅ STEP 4: Update stops
      setStops(improved);
    };
  
    return (
      <button
        onClick={optimizeRoute}
        className="card p-3 w-full text-xs font-semibold"
      >
        🚀 Optimize Route
      </button>
    );
  }
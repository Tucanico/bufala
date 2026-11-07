import {
  VERDICTS,
  WARNING_SIGNS,
  type SenderType,
  type Verdict,
  type WarningSign,
} from "./schema";

export type ModelRun = { verdict: Verdict; signs: WarningSign[]; sender: SenderType };
export type Combined = { verdict: Verdict; reasons: WarningSign[]; sender: SenderType };

// The model doesn't give the same message the same answer every time, even at
// temperature 0: in testing, normal messages flipped to 🟠, and once to 🔴, in
// one run of three. So a check asks several times and goes with the majority.
// Without one, the answer is 🟠: a warning, without claiming a scam.
function majorityVerdict(verdicts: Verdict[]): Verdict {
  for (const verdict of VERDICTS) {
    if (verdicts.filter((v) => v === verdict).length * 2 > verdicts.length) return verdict;
  }
  return "suspicious";
}

function mostCommon<T>(values: T[]): T {
  let best = values[0];
  let bestCount = 0;
  for (const value of values) {
    const count = values.filter((v) => v === value).length;
    if (count > bestCount) [best, bestCount] = [value, count];
  }
  return best;
}

// `runs` must not be empty.
export function combineRuns(runs: ModelRun[]): Combined {
  const verdict = majorityVerdict(runs.map((run) => run.verdict));
  // Reasons and sender come from the runs that reached the final colour, so the
  // reasons shown are ones that actually led to it.
  const agreeing = runs.filter((run) => run.verdict === verdict);
  const pool = agreeing.length > 0 ? agreeing : runs;
  const shared = WARNING_SIGNS.filter(
    (sign) => pool.filter((run) => run.signs.includes(sign)).length * 2 > pool.length,
  );
  return {
    verdict,
    reasons: (shared.length > 0 ? shared : pool[0].signs).slice(0, 2),
    sender: mostCommon(pool.map((run) => run.sender)),
  };
}

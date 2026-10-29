import React, { useState } from 'react';
import {
  Sliders,
  CheckCircle,
  AlertTriangle,
  Award,
  BarChart2,
  TrendingUp,
  Percent,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { Course, ProgramOutcome, ProgramSpecificOutcome } from '../types/curriculum';

interface AttainmentSimulatorProps {
  course: Course;
  programOutcomes: ProgramOutcome[];
  programSpecificOutcomes: ProgramSpecificOutcome[];
}

export const AttainmentSimulator: React.FC<AttainmentSimulatorProps> = ({
  course,
  programOutcomes,
  programSpecificOutcomes,
}) => {
  const [cohortPerformanceFactor, setCohortPerformanceFactor] = useState<number>(75); // 50 to 95%
  const [targetThresholdMarks, setTargetThresholdMarks] = useState<number>(60); // % marks to meet target
  const [directWeightPct, setDirectWeightPct] = useState<number>(80); // 80% direct, 20% indirect
  const [targetAttainmentLevel, setTargetAttainmentLevel] = useState<number>(2.2); // Level 1 to 3

  const allColumns = [
    ...programOutcomes.map((po) => ({ id: po.id, title: po.title, isPso: false })),
    ...programSpecificOutcomes.map((pso) => ({ id: pso.id, title: pso.title, isPso: true })),
  ];

  // Calculate simulated CO attainment level (1.0 to 3.0)
  const getCoAttainment = (coId: string, index: number) => {
    // Cognitive complexity factor based on CO index and bloom
    const baseDifficulty = 1.0 - index * 0.04;
    const effectivePct = (cohortPerformanceFactor * baseDifficulty);
    
    let attainmentLevel = 1.0;
    if (effectivePct >= 70) attainmentLevel = 3.0;
    else if (effectivePct >= 60) attainmentLevel = 2.0;
    else if (effectivePct >= 50) attainmentLevel = 1.0;
    else attainmentLevel = 0.5;

    // Direct assessment calculation with slight realistic variance
    const directScore = Math.min(3.0, Math.max(0.5, attainmentLevel * (effectivePct / 70)));
    const indirectScore = Math.min(3.0, (cohortPerformanceFactor / 100) * 2.8 + 0.2); // course end survey
    const combined = (directScore * (directWeightPct / 100)) + (indirectScore * ((100 - directWeightPct) / 100));

    return {
      directScore: directScore.toFixed(2),
      indirectScore: indirectScore.toFixed(2),
      combinedScore: parseFloat(combined.toFixed(2)),
      effectivePct: Math.round(effectivePct),
    };
  };

  // Calculate PO attainment based on formula:
  // PO Attainment = Sum(CO Attainment * Correlation Weight) / Sum(Correlation Weight)
  const getPoAttainment = (poId: string) => {
    let weightedSum = 0;
    let totalWeight = 0;

    course.outcomes.forEach((co, idx) => {
      const weight = course.matrixMapping[co.id]?.[poId]?.weight ?? 0;
      if (weight > 0) {
        const coAttainment = getCoAttainment(co.id, idx).combinedScore;
        weightedSum += coAttainment * weight;
        totalWeight += weight;
      }
    });

    if (totalWeight === 0) return { attained: 0, totalWeight: 0, status: 'NOT_MAPPED' };

    const attained = parseFloat((weightedSum / totalWeight).toFixed(2));
    const status = attained >= targetAttainmentLevel ? 'ACHIEVED' : 'GAP';
    return { attained, totalWeight, status };
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#090d16] overflow-y-auto select-none">
      {/* Simulator Toolbar */}
      <div className="bg-[#0f172a] border-b border-[#222a3d] px-6 py-3 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-sm font-semibold text-[#dae2fd] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#06b6d4]" />
            <span>Direct & Indirect Attainment Simulator</span>
          </h1>
          <p className="text-[11px] text-[#908fa0] font-mono">
            Continuous Internal Evaluation (CIE) + Semester End Exam (SEE) question level outcome attainment
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-[#908fa0]">Course Target Benchmark:</span>
          <span className="text-[#4cd7f6] font-bold px-2 py-0.5 bg-[#131b2e] rounded border border-[#222a3d]">
            Level {targetAttainmentLevel.toFixed(1)} / 3.0
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Interactive Simulation Controls */}
        <div className="bg-[#0f172a] border border-[#222a3d] rounded-lg p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#dae2fd] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#6366f1]" />
              <span>Cohort Performance Simulator Parameters</span>
            </h3>
            <span className="text-[11px] text-[#908fa0] font-mono">
              Simulates direct mark distribution across {course.outcomes.length} COs
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Slider 1: Cohort Marks Average */}
            <div className="bg-[#131b2e] border border-[#222a3d] rounded p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#c7c4d7]">Class Performance Index</span>
                <span className="font-bold text-[#4cd7f6] text-sm tabular-nums">
                  {cohortPerformanceFactor}%
                </span>
              </div>
              <input
                type="range"
                min="45"
                max="95"
                value={cohortPerformanceFactor}
                onChange={(e) => setCohortPerformanceFactor(parseInt(e.target.value, 10))}
                className="w-full accent-[#6366f1] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#908fa0] font-mono">
                <span>Lower Cohort (45%)</span>
                <span>Honor Cohort (95%)</span>
              </div>
            </div>

            {/* Slider 2: Target Threshold */}
            <div className="bg-[#131b2e] border border-[#222a3d] rounded p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#c7c4d7]">Target Passing Threshold</span>
                <span className="font-bold text-[#c0c1ff] text-sm tabular-nums">
                  {targetThresholdMarks}% Marks
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="75"
                value={targetThresholdMarks}
                onChange={(e) => setTargetThresholdMarks(parseInt(e.target.value, 10))}
                className="w-full accent-[#8b5cf6] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#908fa0] font-mono">
                <span>Standard (40%)</span>
                <span>Honors (75%)</span>
              </div>
            </div>

            {/* Slider 3: Direct vs Indirect Ratio */}
            <div className="bg-[#131b2e] border border-[#222a3d] rounded p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#c7c4d7]">Direct vs Survey Ratio</span>
                <span className="font-bold text-[#10b981] text-sm tabular-nums">
                  {directWeightPct}% / {100 - directWeightPct}%
                </span>
              </div>
              <input
                type="range"
                min="70"
                max="90"
                value={directWeightPct}
                onChange={(e) => setDirectWeightPct(parseInt(e.target.value, 10))}
                className="w-full accent-[#10b981] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#908fa0] font-mono">
                <span>70% Direct / 30% Survey</span>
                <span>90% Direct / 10% Survey</span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Outcomes Attainment Table */}
        <div className="bg-[#0f172a] border border-[#222a3d] rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-[#222a3d] bg-[#131b2e]/50 flex items-center justify-between">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#dae2fd]">
              Course Outcome (CO) Attainment Calculations
            </h3>
            <span className="text-[11px] font-mono text-[#908fa0]">
              Scale: 0.0 to 3.0 Attainment Level
            </span>
          </div>

          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-[#131b2e] border-b border-[#222a3d] text-[11px] text-[#908fa0]">
                <th className="px-4 py-2.5">CO_ID</th>
                <th className="px-4 py-2.5 font-sans">Statement</th>
                <th className="px-3 py-2.5 text-center">Bloom</th>
                <th className="px-3 py-2.5 text-center">Threshold Met</th>
                <th className="px-3 py-2.5 text-center">Direct Score</th>
                <th className="px-3 py-2.5 text-center">Survey Score</th>
                <th className="px-3 py-2.5 text-center">Combined Attainment</th>
                <th className="px-4 py-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222a3d]">
              {course.outcomes.map((co, idx) => {
                const att = getCoAttainment(co.id, idx);
                const isSuccess = att.combinedScore >= targetAttainmentLevel;
                return (
                  <tr key={co.id} className="hover:bg-[#131b2e]/40 transition-colors">
                    <td className="px-4 py-3 font-bold text-[#c0c1ff]">{co.id}</td>
                    <td className="px-4 py-3 font-sans text-[#c7c4d7] max-w-md truncate">
                      {co.statement}
                    </td>
                    <td className="px-3 py-3 text-center text-[#908fa0]">{co.bloomLevel}</td>
                    <td className="px-3 py-3 text-center text-[#4cd7f6] font-bold">
                      {att.effectivePct}%
                    </td>
                    <td className="px-3 py-3 text-center text-[#dae2fd]">{att.directScore}</td>
                    <td className="px-3 py-3 text-center text-[#908fa0]">{att.indirectScore}</td>
                    <td className="px-3 py-3 text-center font-bold text-sm text-[#dae2fd]">
                      {att.combinedScore}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isSuccess ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#10b981]">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Attained</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#f59e0b]">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Gap</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Program Outcome Attainment Grid */}
        <div className="bg-[#0f172a] border border-[#222a3d] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#dae2fd] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#4cd7f6]" />
              <span>Program Outcome (PO1–12 & PSO1–3) Attainment Yield</span>
            </h3>
            <span className="text-[11px] font-mono text-[#908fa0]">
              Formula: ∑(CO × Weight) / ∑(Weight)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {allColumns.map((col) => {
              const res = getPoAttainment(col.id);
              const isAchieved = res.status === 'ACHIEVED';
              const isNotMapped = res.status === 'NOT_MAPPED';

              return (
                <div
                  key={col.id}
                  className={`p-3 rounded-lg border transition-all ${
                    isNotMapped
                      ? 'bg-[#131b2e]/40 border-[#222a3d] opacity-50'
                      : isAchieved
                      ? 'bg-[#131b2e] border-[#10b981]/40'
                      : 'bg-[#131b2e] border-[#f59e0b]/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span
                      className={`font-bold ${
                        col.isPso ? 'text-[#d0bcff]' : 'text-[#4cd7f6]'
                      }`}
                    >
                      {col.id}
                    </span>
                    <span className="text-[10px] text-[#908fa0]">
                      W={res.totalWeight}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#c7c4d7] truncate mb-2" title={col.title}>
                    {col.title}
                  </p>

                  <div className="flex items-baseline justify-between font-mono">
                    <span className="text-base font-bold text-[#dae2fd] tabular-nums">
                      {isNotMapped ? '—' : res.attained.toFixed(2)}
                    </span>
                    <span
                      className={`text-[10px] font-semibold ${
                        isNotMapped
                          ? 'text-[#64748b]'
                          : isAchieved
                          ? 'text-[#10b981]'
                          : 'text-[#f59e0b]'
                      }`}
                    >
                      {isNotMapped ? 'Unmapped' : isAchieved ? '✓ Target Met' : '⚠ Remediate'}
                    </span>
                  </div>

                  {/* Attainment progress bar */}
                  {!isNotMapped && (
                    <div className="w-full bg-[#171f33] h-1.5 rounded mt-2 overflow-hidden">
                      <div
                        className="h-full rounded transition-all duration-300"
                        style={{
                          width: `${Math.min(100, (res.attained / 3.0) * 100)}%`,
                          backgroundColor: isAchieved ? '#10b981' : '#f59e0b',
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

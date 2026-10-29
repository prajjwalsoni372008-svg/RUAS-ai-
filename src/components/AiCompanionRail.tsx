import React, { useState } from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  CheckCircle2,
  Brain,
  Wand2,
  FileCheck,
  ShieldAlert,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { Course, ProgramOutcome, ProgramSpecificOutcome } from '../types/curriculum';

interface AiCompanionRailProps {
  course: Course;
  isOpen: boolean;
  onToggle: () => void;
  onAutoMap: () => void;
  isAiProcessing: boolean;
  onRefineWeakVerbs: () => void;
  onRunGapAnalysis: () => void;
}

export const AiCompanionRail: React.FC<AiCompanionRailProps> = ({
  course,
  isOpen,
  onToggle,
  onAutoMap,
  isAiProcessing,
  onRefineWeakVerbs,
  onRunGapAnalysis,
}) => {
  // Audit for weak verbs in course outcomes
  const weakVerbs = ['understand', 'learn', 'know', 'familiarize', 'study', 'be aware of'];
  const outcomesWithWeakVerbs = course.outcomes.filter((co) =>
    weakVerbs.some((v) => co.statement.toLowerCase().startsWith(v) || co.statement.toLowerCase().includes(` ${v} `))
  );

  return (
    <aside
      className={`bg-[#0f172a] border-l border-[#222a3d] flex flex-col shrink-0 transition-all duration-200 select-none ${
        isOpen ? 'w-80' : 'w-12'
      }`}
    >
      {/* Collapsed Rail Button */}
      {!isOpen ? (
        <div className="flex flex-col items-center py-4 space-y-4">
          <button
            onClick={onToggle}
            className="p-2 rounded hover:bg-[#1e293b] text-[#c0c1ff] transition-colors cursor-pointer"
            title="Expand AI Companion Rail"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onToggle}
            className="p-2 rounded bg-[#1e293b] text-[#8b5cf6] hover:bg-[#2d3449] transition-colors cursor-pointer"
            title="AI Accreditation Tools"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
          </button>
          <div className="writing-mode-vertical text-[10px] font-mono text-[#908fa0] uppercase tracking-widest pt-4">
            AI Companion
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col h-full overflow-y-auto">
          {/* Header */}
          <div className="p-4 border-b border-[#222a3d] bg-[#131b2e] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8b5cf6]" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#dae2fd]">
                Curriculum AI Rail
              </h3>
            </div>
            <button
              onClick={onToggle}
              className="p-1 rounded text-[#908fa0] hover:text-[#dae2fd] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-5 text-xs">
            {/* Quick Diagnostic Card */}
            <div className="bg-[#131b2e] border border-[#222a3d] rounded-lg p-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#908fa0] uppercase">Accreditation Health</span>
                <span className="text-[#10b981] font-bold">ABET EAC Compliant</span>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex items-center justify-between text-[#c7c4d7]">
                  <span>Total Course Outcomes</span>
                  <span className="font-mono font-bold text-[#dae2fd]">{course.outcomes.length}</span>
                </div>
                <div className="flex items-center justify-between text-[#c7c4d7]">
                  <span>Higher Order Cognitive</span>
                  <span className="font-mono font-bold text-[#4cd7f6]">
                    {course.outcomes.filter((c) => ['BT4', 'BT5', 'BT6'].includes(c.bloomLevel)).length} of{' '}
                    {course.outcomes.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#c7c4d7]">
                  <span>Weak Action Verbs</span>
                  <span
                    className={`font-mono font-bold ${
                      outcomesWithWeakVerbs.length > 0 ? 'text-[#f59e0b]' : 'text-[#10b981]'
                    }`}
                  >
                    {outcomesWithWeakVerbs.length} detected
                  </span>
                </div>
              </div>
            </div>

            {/* Action 1: Auto-Align Matrix */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-[#908fa0] uppercase tracking-wider block">
                Primary Automation
              </span>
              <button
                onClick={onAutoMap}
                disabled={isAiProcessing}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-[#131b2e] hover:bg-[#171f33] border border-[#6366f1]/30 hover:border-[#6366f1] transition-all text-left cursor-pointer disabled:opacity-50 group"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded bg-[#6366f1]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Wand2 className="w-3.5 h-3.5 text-[#6366f1]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#dae2fd] group-hover:text-[#c0c1ff]">
                      Auto-Map CO-PO Matrix
                    </h4>
                    <p className="text-[10px] text-[#908fa0] mt-0.5">
                      Synthesizes 0–3 weights and academic rationales using Gemini
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Action 2: Bloom's Verb Quality Audit */}
            <div className="space-y-1.5">
              <button
                onClick={onRefineWeakVerbs}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-[#131b2e] hover:bg-[#171f33] border border-[#222a3d] hover:border-[#8b5cf6]/50 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded bg-[#8b5cf6]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <FileCheck className="w-3.5 h-3.5 text-[#8b5cf6]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#dae2fd] group-hover:text-[#d0bcff]">
                      Audit Measurable Verbs
                    </h4>
                    <p className="text-[10px] text-[#908fa0] mt-0.5">
                      Replaces non-measurable verbs with action-based OBE verbs
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Action 3: Gap Analysis */}
            <div className="space-y-1.5">
              <button
                onClick={onRunGapAnalysis}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-[#131b2e] hover:bg-[#171f33] border border-[#222a3d] hover:border-[#06b6d4]/50 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded bg-[#06b6d4]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-[#06b6d4]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#dae2fd] group-hover:text-[#4cd7f6]">
                      Accreditation Gap Detector
                    </h4>
                    <p className="text-[10px] text-[#908fa0] mt-0.5">
                      Identifies under-mapped POs (Ethics, Environment, Projects)
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Pedagogical Guidance Tip */}
            <div className="bg-[#171f33] border border-[#222a3d] rounded-lg p-3 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#c0c1ff]">
                <Lightbulb className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span>ABET Evaluator Tip</span>
              </div>
              <p className="text-[11px] text-[#c7c4d7] leading-relaxed">
                Evaluators scrutinize PO6 (Society), PO7 (Environment), and PO8 (Ethics). Ensure your capstone or project modules feature documented case studies or rubrics addressing these outcomes.
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

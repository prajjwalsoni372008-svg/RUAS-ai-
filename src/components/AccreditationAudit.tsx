import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  FileText,
  Printer,
  Download,
  Sparkles,
  Award,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Course, AccreditationAuditItem, AccreditationStandard } from '../types/curriculum';
import { AUDIT_CHECKLIST_DATA } from '../data/mockCurriculum';

interface AccreditationAuditProps {
  course: Course;
  allCourses: Course[];
  standard: AccreditationStandard;
}

export const AccreditationAudit: React.FC<AccreditationAuditProps> = ({
  course,
  allCourses,
  standard,
}) => {
  const [auditItems, setAuditItems] = useState<AccreditationAuditItem[]>(AUDIT_CHECKLIST_DATA);
  const [expandedCriterion, setExpandedCriterion] = useState<string | null>('CRIT_3');
  const [isAnalyzingGaps, setIsAnalyzingGaps] = useState(false);
  const [aiGapReport, setAiGapReport] = useState<{
    gaps: { poId: string; severity: string; issue: string; recommendation: string }[];
    actionPlan: string;
  } | null>(null);

  // Compute overall score
  const totalScore = auditItems.reduce((acc, item) => acc + item.score, 0);
  const averageScore = Math.round(totalScore / auditItems.length);
  const compliantCount = auditItems.filter((i) => i.status === 'COMPLIANT').length;
  const attentionCount = auditItems.filter((i) => i.status === 'NEEDS_ATTENTION').length;

  // Toggle item status
  const handleToggleStatus = (id: string) => {
    setAuditItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextStatus =
          item.status === 'COMPLIANT'
            ? 'NEEDS_ATTENTION'
            : item.status === 'NEEDS_ATTENTION'
            ? 'NON_COMPLIANT'
            : 'COMPLIANT';
        return { ...item, status: nextStatus };
      })
    );
  };

  // Run AI Gap Analysis
  const handleRunGapAnalysis = async () => {
    setIsAnalyzingGaps(true);
    try {
      const undermapped = ['PO6', 'PO7', 'PO8', 'PO11'];
      const res = await fetch('/api/gemini/gap-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseTitle: `${course.code}: ${course.title}`,
          undermappedList: undermapped,
          matrixAverages: {
            PO1: 2.8,
            PO2: 2.7,
            PO3: 2.5,
            PO4: 2.1,
            PO5: 2.3,
            PO6: 0.8,
            PO7: 0.7,
            PO8: 1.1,
            PO9: 2.0,
            PO10: 2.2,
            PO11: 1.0,
            PO12: 2.6,
          },
        }),
      });
      const data = await res.json();
      setAiGapReport(data);
    } catch (err) {
      console.error('Gap analysis error:', err);
    } finally {
      setIsAnalyzingGaps(false);
    }
  };

  // Export JSON dossier
  const handleExportJson = () => {
    const exportData = {
      specForgeVersion: '2.4.0',
      exportedAt: new Date().toISOString(),
      standard,
      department: 'Computer Science & Engineering',
      curriculumCatalog: allCourses.map((c) => ({
        code: c.code,
        title: c.title,
        credits: c.credits,
        semester: c.semester,
        outcomes: c.outcomes,
        matrixMapping: c.matrixMapping,
      })),
      accreditationAudit: auditItems,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SpecForge_Accreditation_Dossier_${standard}.json`;
    link.click();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#090d16] overflow-y-auto select-none">
      {/* Subheader Toolbar */}
      <div className="bg-[#0f172a] border-b border-[#222a3d] px-6 py-3 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-sm font-semibold text-[#dae2fd] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#10b981]" />
            <span>Accreditation Compliance Audit & Self-Assessment Dossier</span>
          </h1>
          <p className="text-[11px] text-[#908fa0] font-mono">
            {standard === 'ABET_EAC_2026' ? 'ABET EAC Criterion 1–8 Criteria Matrix' : 'NBA Tier-I Washington Accord Graduate Attributes'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRunGapAnalysis}
            disabled={isAnalyzingGaps}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#1e293b] hover:bg-[#2d3449] text-[#c0c1ff] border border-[#6366f1]/30 rounded transition-colors cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 text-[#8b5cf6] ${isAnalyzingGaps ? 'animate-spin' : ''}`} />
            <span>{isAnalyzingGaps ? 'Auditing...' : 'AI Continuous Improvement Audit'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#131b2e] hover:bg-[#171f33] text-[#dae2fd] border border-[#222a3d] rounded transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#4cd7f6]" />
            <span>Print Dossier</span>
          </button>

          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-[#6366f1] hover:bg-[#4f52e0] text-white rounded shadow transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON Spec</span>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Compliance Readiness Scorecard */}
        <div className="bg-[#0f172a] border border-[#222a3d] rounded-lg p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xl font-bold text-[#10b981] tabular-nums">
                  {averageScore}%
                </span>
                <span className="text-sm font-semibold text-[#dae2fd]">
                  Program Readiness Index
                </span>
              </div>
              <p className="text-xs text-[#908fa0] mt-1">
                {compliantCount} Criteria Verified Compliant · {attentionCount} Remedial Notice Pending
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="bg-[#131b2e] border border-[#222a3d] px-3 py-2 rounded text-center">
                <span className="block text-[10px] text-[#908fa0] uppercase">Accreditation Cycle</span>
                <span className="font-bold text-[#dae2fd]">2026–2032 (6-Yr Full)</span>
              </div>
              <div className="bg-[#131b2e] border border-[#222a3d] px-3 py-2 rounded text-center">
                <span className="block text-[10px] text-[#908fa0] uppercase">Curriculum Body</span>
                <span className="font-bold text-[#4cd7f6]">EAC Commission</span>
              </div>
            </div>
          </div>

          <div className="w-full bg-[#171f33] h-2 rounded mt-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#10b981] via-[#06b6d4] to-[#6366f1] rounded"
              style={{ width: `${averageScore}%` }}
            />
          </div>
        </div>

        {/* AI Gap Analysis Report (if triggered) */}
        {aiGapReport && (
          <div className="bg-[#0f172a] border border-[#8b5cf6]/40 rounded-lg p-5 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8b5cf6]" />
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#d0bcff]">
                  Continuous Quality Improvement (CQI) AI Analysis
                </h3>
              </div>
              <button
                onClick={() => setAiGapReport(null)}
                className="text-xs text-[#908fa0] hover:text-[#dae2fd]"
              >
                Dismiss
              </button>
            </div>

            <p className="text-xs text-[#dae2fd] leading-relaxed font-medium bg-[#131b2e] p-3 rounded border border-[#222a3d]">
              Executive Action Plan: {aiGapReport.actionPlan}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {aiGapReport.gaps.map((gap, gIdx) => (
                <div
                  key={gIdx}
                  className="bg-[#131b2e] border border-[#222a3d] rounded p-3 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-[#4cd7f6]">{gap.poId}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        gap.severity === 'High'
                          ? 'bg-[#ef4444]/20 text-[#ef4444]'
                          : 'bg-[#f59e0b]/20 text-[#f59e0b]'
                      }`}
                    >
                      {gap.severity} Priority
                    </span>
                  </div>
                  <p className="text-[#c7c4d7] font-medium">{gap.issue}</p>
                  <p className="text-[11px] text-[#908fa0] italic">
                    Action: {gap.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Criteria Checklist */}
        <div className="space-y-3">
          {auditItems.map((item) => {
            const isExpanded = expandedCriterion === item.id;
            const isCompliant = item.status === 'COMPLIANT';
            const isAttention = item.status === 'NEEDS_ATTENTION';

            return (
              <div
                key={item.id}
                className="bg-[#0f172a] border border-[#222a3d] rounded-lg overflow-hidden transition-all"
              >
                <div
                  onClick={() => setExpandedCriterion(isExpanded ? null : item.id)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#131b2e]/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(item.id);
                      }}
                      className="shrink-0 cursor-pointer"
                      title="Click to cycle status: Compliant / Needs Attention / Non-Compliant"
                    >
                      {isCompliant ? (
                        <CheckCircle className="w-4 h-4 text-[#10b981]" />
                      ) : isAttention ? (
                        <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#c0c1ff]">
                          {item.criterionNumber}
                        </span>
                        <span className="text-xs font-semibold text-[#dae2fd]">
                          {item.title}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                        isCompliant
                          ? 'bg-[#10b981]/15 text-[#10b981]'
                          : isAttention
                          ? 'bg-[#f59e0b]/15 text-[#f59e0b]'
                          : 'bg-[#ef4444]/15 text-[#ef4444]'
                      }`}
                    >
                      {item.status.replace('_', ' ')} ({item.score}/100)
                    </span>

                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-[#908fa0]" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#908fa0]" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-[#222a3d] bg-[#131b2e]/30 space-y-3 text-xs">
                    <div>
                      <div className="text-[11px] font-mono text-[#908fa0] uppercase tracking-wider mb-1">
                        Required Accreditation Evidence
                      </div>
                      <p className="text-[#c7c4d7] leading-relaxed">
                        {item.evidenceRequired}
                      </p>
                    </div>

                    <div>
                      <div className="text-[11px] font-mono text-[#908fa0] uppercase tracking-wider mb-1">
                        Current Documented Evidence
                      </div>
                      <div className="bg-[#131b2e] p-3 rounded border border-[#222a3d] text-[#dae2fd]">
                        {item.currentEvidence}
                      </div>
                    </div>

                    {item.remedialAction && (
                      <div>
                        <div className="text-[11px] font-mono text-[#f59e0b] uppercase tracking-wider mb-1">
                          Continuous Improvement Remedial Action
                        </div>
                        <p className="text-[#f59e0b] text-[11px] italic">
                          {item.remedialAction}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

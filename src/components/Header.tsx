import React from 'react';
import {
  Sparkles,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  Layers,
  FileText,
  Sliders,
  ShieldCheck,
} from 'lucide-react';
import { WorkbenchView, Course, AccreditationStandard } from '../types/curriculum';

interface HeaderProps {
  activeView: WorkbenchView;
  setActiveView: (view: WorkbenchView) => void;
  activeCourse: Course;
  courses: Course[];
  onSelectCourse: (courseId: string) => void;
  accreditationStandard: AccreditationStandard;
  setAccreditationStandard: (standard: AccreditationStandard) => void;
  onAutoMapClick: () => void;
  isAiProcessing: boolean;
  onOpenAudit: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  activeCourse,
  courses,
  onSelectCourse,
  accreditationStandard,
  setAccreditationStandard,
  onAutoMapClick,
  isAiProcessing,
  onOpenAudit,
}) => {
  return (
    <header className="bg-[#0b1326] border-b border-[#222a3d] px-6 py-3 shrink-0 flex items-center justify-between gap-6 select-none">
      {/* Zone 1: Single Brand Wordmark + Course Context */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-[#6366f1] via-[#8b5cf6] to-[#06b6d4] flex items-center justify-center shadow-sm">
            <span className="font-mono text-xs font-bold text-white tracking-wider">SF</span>
          </div>
          <div>
            <span className="text-base font-semibold tracking-tight text-[#dae2fd]">
              SpecForge
            </span>
          </div>
        </div>

        <div className="h-4 w-px bg-[#222a3d]" />

        {/* Course quick switcher */}
        <div className="flex items-center gap-2">
          <select
            value={activeCourse.id}
            onChange={(e) => onSelectCourse(e.target.value)}
            className="bg-[#131b2e] border border-[#222a3d] text-xs font-medium text-[#dae2fd] rounded px-2.5 py-1.5 hover:border-[#6366f1]/50 focus:outline-none focus:border-[#6366f1] cursor-pointer"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} · {c.title} ({c.credits})
              </option>
            ))}
          </select>

          <span className="text-[11px] font-mono text-[#908fa0] px-2 py-0.5 bg-[#171f33] rounded border border-[#222a3d]">
            Sem {activeCourse.semester}
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden lg:flex items-center gap-1 bg-[#131b2e] p-1 rounded-md border border-[#222a3d]">
        <button
          onClick={() => setActiveView('matrix')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'matrix'
              ? 'bg-[#1e293b] text-[#c0c1ff] shadow-sm font-semibold'
              : 'text-[#908fa0] hover:text-[#dae2fd]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>CO-PO Matrix</span>
        </button>

        <button
          onClick={() => setActiveView('syllabus')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'syllabus'
              ? 'bg-[#1e293b] text-[#c0c1ff] shadow-sm font-semibold'
              : 'text-[#908fa0] hover:text-[#dae2fd]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Outcomes & Syllabus</span>
        </button>

        <button
          onClick={() => setActiveView('attainment')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'attainment'
              ? 'bg-[#1e293b] text-[#c0c1ff] shadow-sm font-semibold'
              : 'text-[#908fa0] hover:text-[#dae2fd]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Attainment Simulator</span>
        </button>

        <button
          onClick={() => setActiveView('audit')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'audit'
              ? 'bg-[#1e293b] text-[#c0c1ff] shadow-sm font-semibold'
              : 'text-[#908fa0] hover:text-[#dae2fd]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
          <span>Accreditation Audit</span>
        </button>
      </nav>

      {/* Zone 3: Actions & Regulation Target */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#c7c4d7] bg-[#171f33] px-2.5 py-1 rounded border border-[#222a3d]">
          <span className="text-[#908fa0]">Standard:</span>
          <button
            onClick={() =>
              setAccreditationStandard(
                accreditationStandard === 'ABET_EAC_2026'
                  ? 'NBA_TIER_1_WA'
                  : 'ABET_EAC_2026'
              )
            }
            className="text-[#4cd7f6] hover:underline cursor-pointer font-medium"
            title="Click to toggle accreditation criteria set"
          >
            {accreditationStandard === 'ABET_EAC_2026' ? 'ABET EAC-2026' : 'NBA Tier-I WA'}
          </button>
        </div>

        <button
          onClick={onAutoMapClick}
          disabled={isAiProcessing}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#1e293b] hover:bg-[#2d3449] text-[#c0c1ff] border border-[#6366f1]/30 rounded transition-colors whitespace-nowrap disabled:opacity-50 cursor-pointer"
        >
          <Sparkles className={`w-3.5 h-3.5 text-[#8b5cf6] ${isAiProcessing ? 'animate-spin' : ''}`} />
          <span>{isAiProcessing ? 'Aligning...' : 'AI Auto-Align'}</span>
        </button>

        <button
          onClick={onOpenAudit}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-[#6366f1] hover:bg-[#4f52e0] text-white rounded shadow transition-colors whitespace-nowrap cursor-pointer"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Audit & Export</span>
        </button>
      </div>
    </header>
  );
};

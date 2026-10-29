import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  ChevronDown,
  ChevronRight,
  Info,
  Check,
  AlertCircle,
  Award,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { Course, ProgramOutcome, ProgramSpecificOutcome } from '../types/curriculum';
import { BLOOM_TAXONOMY_CATALOG } from '../data/mockCurriculum';

interface SidebarProps {
  courses: Course[];
  activeCourse: Course;
  onSelectCourse: (courseId: string) => void;
  onNewCourseClick: () => void;
  programOutcomes: ProgramOutcome[];
  programSpecificOutcomes: ProgramSpecificOutcome[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  courses,
  activeCourse,
  onSelectCourse,
  onNewCourseClick,
  programOutcomes,
  programSpecificOutcomes,
}) => {
  const [showPOReference, setShowPOReference] = useState(false);
  const [showPSOReference, setShowPSOReference] = useState(false);
  const [selectedPO, setSelectedPO] = useState<string | null>(null);

  // Compute status for active course
  const totalCells = activeCourse.outcomes.length * (programOutcomes.length + programSpecificOutcomes.length);
  let mappedCells = 0;
  Object.values(activeCourse.matrixMapping).forEach((row) => {
    Object.values(row).forEach((cell) => {
      if (cell.weight > 0) mappedCells++;
    });
  });

  return (
    <aside className="w-72 bg-[#0f172a] border-r border-[#222a3d] flex flex-col shrink-0 overflow-y-auto select-none">
      {/* Program Header */}
      <div className="p-4 border-b border-[#222a3d] bg-[#131b2e]/60">
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap className="w-4 h-4 text-[#4cd7f6]" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#4cd7f6]">
            Department Workbench
          </span>
        </div>
        <h2 className="text-sm font-semibold text-[#dae2fd] truncate">
          Computer Science & Engineering
        </h2>
        <div className="flex items-center gap-2 mt-2 text-[11px] text-[#908fa0] font-mono">
          <span>Regulation 2026-R</span>
          <span>·</span>
          <span>Tier-I / EAC</span>
        </div>
      </div>

      {/* Course Catalog Tree */}
      <div className="p-3 border-b border-[#222a3d]">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#908fa0] uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-[#6366f1]" />
            <span>Course Catalog</span>
          </div>
          <button
            onClick={onNewCourseClick}
            className="p-1 rounded hover:bg-[#1e293b] text-[#c0c1ff] transition-colors"
            title="Create new course curriculum"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-1">
          {courses.map((course) => {
            const isSelected = course.id === activeCourse.id;
            return (
              <button
                key={course.id}
                onClick={() => onSelectCourse(course.id)}
                className={`w-full text-left p-2.5 rounded transition-all flex items-start gap-2.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1e293b] border border-[#6366f1]/40 shadow-sm'
                    : 'hover:bg-[#171f33] border border-transparent'
                }`}
              >
                <div
                  className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                    isSelected ? 'bg-[#6366f1]' : 'bg-[#334155]'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-xs font-semibold text-[#c0c1ff]">
                      {course.code}
                    </span>
                    <span className="font-mono text-[10px] text-[#908fa0]">
                      Sem {course.semester}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-[#dae2fd] truncate mt-0.5">
                    {course.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-[#908fa0]">
                    <span>{course.outcomes.length} COs</span>
                    <span>·</span>
                    <span>{course.credits}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Course Metadata & Cognitive Profile */}
      <div className="p-3 border-b border-[#222a3d] space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-mono font-semibold text-[#908fa0] uppercase tracking-wider">
            Curriculum Depth
          </span>
          <span className="text-[10px] font-mono text-[#10b981]">
            {Math.round((mappedCells / Math.max(1, totalCells)) * 100)}% Mapped
          </span>
        </div>

        {/* Bloom's distribution miniature bar */}
        <div className="space-y-1.5 px-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#c7c4d7]">Bloom’s Spectrum</span>
            <span className="font-mono text-[10px] text-[#908fa0]">
              {activeCourse.outcomes.length} Outcomes
            </span>
          </div>
          <div className="flex h-2 rounded overflow-hidden bg-[#171f33] border border-[#222a3d]">
            {activeCourse.outcomes.map((co, idx) => {
              const info = BLOOM_TAXONOMY_CATALOG[co.bloomLevel] || BLOOM_TAXONOMY_CATALOG.BT3;
              return (
                <div
                  key={co.id || idx}
                  className="h-full flex-1 transition-all"
                  style={{ backgroundColor: info.badgeColor }}
                  title={`${co.id}: ${co.bloomLevel} (${info.name})`}
                />
              );
            })}
          </div>
          <div className="flex items-center justify-between text-[9px] font-mono text-[#908fa0] pt-0.5">
            <span>BT1 Remember</span>
            <span>BT6 Create</span>
          </div>
        </div>

        {/* Course Modules preview */}
        <div className="px-1 pt-1">
          <div className="text-[11px] text-[#908fa0] font-mono uppercase tracking-wider mb-1.5">
            Syllabus Units ({activeCourse.modules.length})
          </div>
          <div className="space-y-1">
            {activeCourse.modules.map((m) => (
              <div
                key={m.unit}
                className="text-[11px] text-[#c7c4d7] bg-[#131b2e] p-1.5 rounded border border-[#222a3d] flex items-center justify-between"
              >
                <span className="truncate pr-2">
                  U{m.unit}: {m.title}
                </span>
                <span className="font-mono text-[10px] text-[#908fa0] shrink-0">
                  {m.lectureHours}h
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Program Outcomes Reference Dropdown */}
      <div className="p-3 border-b border-[#222a3d]">
        <button
          onClick={() => setShowPOReference(!showPOReference)}
          className="w-full flex items-center justify-between px-1 py-1 text-xs font-mono font-semibold text-[#908fa0] uppercase tracking-wider hover:text-[#dae2fd] cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#06b6d4]" />
            <span>PO Reference (PO1–12)</span>
          </div>
          {showPOReference ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </button>

        {showPOReference && (
          <div className="mt-2 space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {programOutcomes.map((po) => {
              const isSelected = selectedPO === po.id;
              return (
                <div
                  key={po.id}
                  onClick={() => setSelectedPO(isSelected ? null : po.id)}
                  className="p-2 rounded bg-[#131b2e] hover:bg-[#171f33] border border-[#222a3d] cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-[#4cd7f6]">{po.id}</span>
                    <span className="text-[10px] text-[#908fa0]">{po.abetCriterion}</span>
                  </div>
                  <p className="text-[11px] font-medium text-[#dae2fd] mt-0.5">
                    {po.title}
                  </p>
                  {isSelected && (
                    <p className="text-[10px] text-[#c7c4d7] mt-1.5 leading-relaxed border-t border-[#222a3d] pt-1">
                      {po.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Program Specific Outcomes Reference Dropdown */}
      <div className="p-3 mt-auto border-t border-[#222a3d] bg-[#131b2e]/40">
        <button
          onClick={() => setShowPSOReference(!showPSOReference)}
          className="w-full flex items-center justify-between px-1 py-1 text-xs font-mono font-semibold text-[#908fa0] uppercase tracking-wider hover:text-[#dae2fd] cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#8b5cf6]" />
            <span>PSO Reference (PSO1–3)</span>
          </div>
          {showPSOReference ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </button>

        {showPSOReference && (
          <div className="mt-2 space-y-1.5">
            {programSpecificOutcomes.map((pso) => (
              <div
                key={pso.id}
                className="p-2 rounded bg-[#131b2e] border border-[#222a3d] text-xs"
              >
                <span className="font-mono font-bold text-[#d0bcff]">{pso.id}:</span>{' '}
                <span className="font-medium text-[#dae2fd]">{pso.title}</span>
                <p className="text-[10px] text-[#908fa0] mt-1 leading-relaxed">
                  {pso.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

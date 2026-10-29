import React, { useState } from 'react';
import { X, Check, BookOpen, Layers, Award, FileText } from 'lucide-react';
import { Course, MatrixCellData, ProgramOutcome, ProgramSpecificOutcome } from '../types/curriculum';

interface CellJustificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  coId: string;
  poId: string;
  course: Course;
  cellData: MatrixCellData;
  programOutcomes: ProgramOutcome[];
  programSpecificOutcomes: ProgramSpecificOutcome[];
  onSave: (coId: string, poId: string, updated: MatrixCellData) => void;
}

export const CellJustificationModal: React.FC<CellJustificationModalProps> = ({
  isOpen,
  onClose,
  coId,
  poId,
  course,
  cellData,
  programOutcomes,
  programSpecificOutcomes,
  onSave,
}) => {
  if (!isOpen) return null;

  const co = course.outcomes.find((o) => o.id === coId);
  const po =
    programOutcomes.find((p) => p.id === poId) ||
    programSpecificOutcomes.find((p) => p.id === poId);

  const [weight, setWeight] = useState<number>(cellData.weight ?? 0);
  const [rationale, setRationale] = useState<string>(cellData.rationale || '');
  const [moduleRef, setModuleRef] = useState<string>(cellData.moduleRef || '');

  const handleSave = () => {
    onSave(coId, poId, {
      ...cellData,
      weight,
      rationale: rationale.trim(),
      moduleRef: moduleRef || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none">
      <div className="bg-[#0f172a] border border-[#222a3d] rounded-xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#222a3d] bg-[#131b2e] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#1e293b] border border-[#6366f1]/40 flex items-center justify-center font-mono font-bold text-xs text-[#c0c1ff]">
              {coId}➔{poId}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#dae2fd]">
                Correlation Rationale & Evidence Inspector
              </h3>
              <p className="text-[11px] text-[#908fa0] font-mono">
                ABET Criterion 3 Substantive Mapping Justification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#908fa0] hover:text-[#dae2fd] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Target Reference Info */}
          <div className="grid grid-cols-2 gap-3 bg-[#131b2e] p-3 rounded-lg border border-[#222a3d]">
            <div>
              <span className="font-mono text-[10px] text-[#908fa0] uppercase tracking-wider block mb-1">
                Course Outcome ({coId} · {co?.bloomLevel})
              </span>
              <p className="text-[11px] text-[#dae2fd] line-clamp-3 leading-relaxed">
                {co?.statement}
              </p>
            </div>
            <div>
              <span className="font-mono text-[10px] text-[#908fa0] uppercase tracking-wider block mb-1">
                Program Outcome ({poId})
              </span>
              <p className="text-[11px] font-semibold text-[#4cd7f6] mb-0.5">
                {po?.title}
              </p>
              <p className="text-[10px] text-[#c7c4d7] line-clamp-3 leading-relaxed">
                {po?.description}
              </p>
            </div>
          </div>

          {/* Weight Selection Buttons */}
          <div>
            <label className="block text-[11px] font-mono text-[#908fa0] uppercase tracking-wider mb-2">
              Correlation Weight Level
            </label>
            <div className="grid grid-cols-4 gap-2 font-mono">
              {[
                { val: 0, label: '0: None', desc: 'No correlation' },
                { val: 1, label: '1: Low', desc: 'Slight mention' },
                { val: 2, label: '2: Medium', desc: 'Active practice' },
                { val: 3, label: '3: High', desc: 'Substantial mastery' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setWeight(opt.val)}
                  className={`p-2 rounded border text-left transition-all cursor-pointer ${
                    weight === opt.val
                      ? 'bg-[#1e293b] border-[#6366f1] text-white shadow-sm ring-1 ring-[#6366f1]'
                      : 'bg-[#131b2e] border-[#222a3d] text-[#908fa0] hover:text-[#dae2fd]'
                  }`}
                >
                  <span className="font-bold block text-xs">{opt.label}</span>
                  <span className="text-[9px] text-[#908fa0]">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Justification Rationale Input */}
          <div>
            <label className="block text-[11px] font-mono text-[#908fa0] uppercase tracking-wider mb-1.5">
              Academic & Pedagogical Justification
            </label>
            <textarea
              rows={3}
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              className="w-full bg-[#131b2e] border border-[#222a3d] rounded p-3 text-xs text-[#dae2fd] leading-relaxed focus:outline-none focus:border-[#6366f1]"
              placeholder="Provide verifiable justification explaining how this course outcome directly develops or measures this program outcome..."
            />
          </div>

          {/* Linked Syllabus Module */}
          <div>
            <label className="block text-[11px] font-mono text-[#908fa0] uppercase tracking-wider mb-1.5">
              Primary Supporting Syllabus Module
            </label>
            <select
              value={moduleRef}
              onChange={(e) => setModuleRef(e.target.value)}
              className="w-full bg-[#131b2e] border border-[#222a3d] rounded px-3 py-2 text-xs text-[#dae2fd] focus:outline-none focus:border-[#6366f1] cursor-pointer"
            >
              <option value="">Select supporting unit module...</option>
              {course.modules.map((m) => (
                <option key={m.unit} value={`Unit ${m.unit}`}>
                  Unit {m.unit}: {m.title} ({m.lectureHours} hrs)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#222a3d] bg-[#131b2e] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs text-[#908fa0] hover:text-[#dae2fd] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-[#6366f1] hover:bg-[#4f52e0] text-white rounded transition-colors shadow cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Justification</span>
          </button>
        </div>
      </div>
    </div>
  );
};

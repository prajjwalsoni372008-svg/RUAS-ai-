import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Check,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Clock,
  Layers,
  BookOpen,
  PieChart,
} from 'lucide-react';
import { Course, CourseOutcome, BloomLevel, SyllabusModule } from '../types/curriculum';
import { BLOOM_TAXONOMY_CATALOG } from '../data/mockCurriculum';

interface SyllabusWorkbenchProps {
  course: Course;
  onUpdateCourse: (updated: Course) => void;
}

export const SyllabusWorkbench: React.FC<SyllabusWorkbenchProps> = ({
  course,
  onUpdateCourse,
}) => {
  const [activeTab, setActiveTab] = useState<'outcomes' | 'modules' | 'generator'>('outcomes');
  const [editingCoId, setEditingCoId] = useState<string | null>(null);
  const [refiningCoId, setRefiningCoId] = useState<string | null>(null);
  const [refinementResult, setRefinementResult] = useState<{
    refinedStatement: string;
    actionVerb: string;
    rationale: string;
  } | null>(null);
  const [generatorText, setGeneratorText] = useState(
    course.modules.map((m) => `Unit ${m.unit}: ${m.title}\n${m.topics.join(', ')}`).join('\n\n')
  );
  const [isGenerating, setIsGenerating] = useState(false);

  // Bloom level distribution calculation
  const bloomDistribution: Record<BloomLevel, number> = {
    BT1: 0,
    BT2: 0,
    BT3: 0,
    BT4: 0,
    BT5: 0,
    BT6: 0,
  };
  course.outcomes.forEach((co) => {
    bloomDistribution[co.bloomLevel] = (bloomDistribution[co.bloomLevel] || 0) + 1;
  });

  const totalLectureHours = course.modules.reduce((acc, m) => acc + (m.lectureHours || 0), 0);

  // Handle outcome edits
  const handleUpdateOutcome = (coId: string, updates: Partial<CourseOutcome>) => {
    const updatedOutcomes = course.outcomes.map((co) =>
      co.id === coId ? { ...co, ...updates } : co
    );
    onUpdateCourse({ ...course, outcomes: updatedOutcomes });
  };

  const handleAddOutcome = () => {
    const nextNum = course.outcomes.length + 1;
    const newId = `CO${nextNum}`;
    const newCo: CourseOutcome = {
      id: newId,
      statement: `Analyze and design components to satisfy engineering specifications for ${course.title}.`,
      bloomLevel: 'BT4',
      targetAttainmentPercentage: 65,
      assessmentTools: ['Internal Test 2', 'Lab Evaluation', 'SEE Exam'],
    };
    onUpdateCourse({ ...course, outcomes: [...course.outcomes, newCo] });
  };

  const handleDeleteOutcome = (coId: string) => {
    if (course.outcomes.length <= 1) return;
    const filtered = course.outcomes.filter((co) => co.id !== coId);
    onUpdateCourse({ ...course, outcomes: filtered });
  };

  // AI Refine outcome statement
  const handleRefineWithAi = async (co: CourseOutcome) => {
    setRefiningCoId(co.id);
    setRefinementResult(null);
    try {
      const res = await fetch('/api/gemini/refine-co', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentStatement: co.statement,
          targetBloomLevel: co.bloomLevel,
          courseTitle: course.title,
        }),
      });
      const data = await res.json();
      if (data.refinedStatement) {
        setRefinementResult(data);
      }
    } catch (err) {
      console.error('Refine failed:', err);
    } finally {
      setRefiningCoId(null);
    }
  };

  const handleApplyRefinement = (coId: string) => {
    if (!refinementResult) return;
    handleUpdateOutcome(coId, { statement: refinementResult.refinedStatement });
    setRefinementResult(null);
  };

  // AI Generate COs from syllabus
  const handleGenerateCos = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini/generate-cos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseTitle: course.title,
          courseCode: course.code,
          syllabusTopics: generatorText,
          targetCount: 6,
        }),
      });
      const data = await res.json();
      if (data.courseOutcomes && Array.isArray(data.courseOutcomes)) {
        onUpdateCourse({
          ...course,
          outcomes: data.courseOutcomes.map((co: any, idx: number) => ({
            ...co,
            id: `CO${idx + 1}`,
            assessmentTools: ['CIE Tests', 'SEE Exam'],
          })),
        });
        setActiveTab('outcomes');
      }
    } catch (err) {
      console.error('Generate COs failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#090d16] overflow-y-auto select-none">
      {/* Subheader Toolbar */}
      <div className="bg-[#0f172a] border-b border-[#222a3d] px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-sm font-semibold text-[#dae2fd]">
              Curriculum & Syllabus Spec Workbench
            </h1>
            <p className="text-[11px] text-[#908fa0] font-mono">
              Outcome-Based Education (OBE) course definitions, Bloom’s verbs & module distribution
            </p>
          </div>

          <div className="h-5 w-px bg-[#222a3d]" />

          {/* Sub Navigation */}
          <div className="flex items-center gap-1 bg-[#131b2e] p-1 rounded border border-[#222a3d] text-xs font-mono">
            <button
              onClick={() => setActiveTab('outcomes')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                activeTab === 'outcomes'
                  ? 'bg-[#1e293b] text-[#c0c1ff] font-bold'
                  : 'text-[#908fa0] hover:text-[#dae2fd]'
              }`}
            >
              Course Outcomes ({course.outcomes.length})
            </button>
            <button
              onClick={() => setActiveTab('modules')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                activeTab === 'modules'
                  ? 'bg-[#1e293b] text-[#c0c1ff] font-bold'
                  : 'text-[#908fa0] hover:text-[#dae2fd]'
              }`}
            >
              Syllabus Units ({course.modules.length})
            </button>
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === 'generator'
                  ? 'bg-[#1e293b] text-[#c0c1ff] font-bold'
                  : 'text-[#908fa0] hover:text-[#dae2fd]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#8b5cf6]" />
              <span>Syllabus AI Synthesizer</span>
            </button>
          </div>
        </div>

        {activeTab === 'outcomes' && (
          <button
            onClick={handleAddOutcome}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#6366f1] hover:bg-[#4f52e0] text-white rounded shadow transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Course Outcome</span>
          </button>
        )}
      </div>

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Cognitive Balance Banner */}
        <div className="bg-[#0f172a] border border-[#222a3d] rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#6366f1]" />
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#dae2fd]">
                Bloom’s Taxonomy Cognitive Rigor Profile
              </h3>
            </div>
            <div className="text-[11px] font-mono text-[#908fa0]">
              Higher Order Thinking Skills (BT4–BT6):{' '}
              <strong className="text-[#10b981]">
                {Math.round(
                  (((bloomDistribution.BT4 + bloomDistribution.BT5 + bloomDistribution.BT6) || 0) /
                    Math.max(1, course.outcomes.length)) *
                    100
                )}
                %
              </strong>{' '}
              (Target ≥ 50%)
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {(['BT1', 'BT2', 'BT3', 'BT4', 'BT5', 'BT6'] as BloomLevel[]).map((level) => {
              const info = BLOOM_TAXONOMY_CATALOG[level];
              const count = bloomDistribution[level] || 0;
              const pct = Math.round((count / Math.max(1, course.outcomes.length)) * 100);
              return (
                <div
                  key={level}
                  className="bg-[#131b2e] border border-[#222a3d] rounded p-2.5 text-center"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#908fa0] mb-1">
                    <span>{level}</span>
                    <span className="font-bold text-[#dae2fd]">{count} COs</span>
                  </div>
                  <div className="text-xs font-bold" style={{ color: info.badgeColor }}>
                    {info.name}
                  </div>
                  <div className="w-full bg-[#171f33] h-1.5 rounded mt-2 overflow-hidden">
                    <div
                      className="h-full rounded"
                      style={{ width: `${pct}%`, backgroundColor: info.badgeColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Course Outcomes Editor */}
        {activeTab === 'outcomes' && (
          <div className="space-y-4">
            {course.outcomes.map((co, index) => {
              const bloomInfo = BLOOM_TAXONOMY_CATALOG[co.bloomLevel] || BLOOM_TAXONOMY_CATALOG.BT3;
              const isRefiningThis = refiningCoId === co.id;
              const isShowingRefinement = refinementResult && editingCoId === co.id;

              return (
                <div
                  key={co.id}
                  className="bg-[#0f172a] border border-[#222a3d] rounded-lg p-5 hover:border-[#334155] transition-all space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-[#c0c1ff] px-2.5 py-1 bg-[#1e293b] rounded border border-[#222a3d]">
                        {co.id}
                      </span>

                      {/* Bloom level selector */}
                      <select
                        value={co.bloomLevel}
                        onChange={(e) =>
                          handleUpdateOutcome(co.id, {
                            bloomLevel: e.target.value as BloomLevel,
                          })
                        }
                        className="bg-[#131b2e] border border-[#222a3d] text-xs font-mono font-semibold rounded px-2.5 py-1 text-[#dae2fd] focus:outline-none focus:border-[#6366f1] cursor-pointer"
                        style={{ color: bloomInfo.badgeColor }}
                      >
                        {Object.values(BLOOM_TAXONOMY_CATALOG).map((b) => (
                          <option key={b.level} value={b.level}>
                            {b.level}: {b.name}
                          </option>
                        ))}
                      </select>

                      <span className="text-[11px] text-[#908fa0] font-mono hidden md:inline">
                        Recommended verbs: {bloomInfo.verbs.slice(0, 4).join(', ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-xs font-mono text-[#908fa0]">
                        <span>Target Attainment:</span>
                        <input
                          type="number"
                          min="40"
                          max="100"
                          value={co.targetAttainmentPercentage}
                          onChange={(e) =>
                            handleUpdateOutcome(co.id, {
                              targetAttainmentPercentage: parseInt(e.target.value, 10) || 60,
                            })
                          }
                          className="w-14 bg-[#131b2e] border border-[#222a3d] rounded px-1.5 py-0.5 text-center text-[#4cd7f6] font-bold focus:outline-none focus:border-[#6366f1]"
                        />
                        <span>%</span>
                      </div>

                      <button
                        onClick={() => {
                          setEditingCoId(co.id);
                          handleRefineWithAi(co);
                        }}
                        disabled={isRefiningThis}
                        className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-[#1e293b] hover:bg-[#2d3449] text-[#c0c1ff] border border-[#6366f1]/30 rounded transition-colors cursor-pointer disabled:opacity-50"
                        title="AI rewrites outcome statement using measurable Bloom's action verbs"
                      >
                        <Sparkles className={`w-3 h-3 text-[#8b5cf6] ${isRefiningThis ? 'animate-spin' : ''}`} />
                        <span>{isRefiningThis ? 'Refining...' : 'AI Refine'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteOutcome(co.id)}
                        disabled={course.outcomes.length <= 1}
                        className="p-1 rounded text-[#908fa0] hover:text-[#ef4444] transition-colors disabled:opacity-30 cursor-pointer"
                        title="Delete Course Outcome"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Statement Input */}
                  <div>
                    <label className="block text-[11px] font-mono text-[#908fa0] mb-1 uppercase tracking-wider">
                      Outcome Statement
                    </label>
                    <textarea
                      rows={2}
                      value={co.statement}
                      onChange={(e) =>
                        handleUpdateOutcome(co.id, { statement: e.target.value })
                      }
                      className="w-full bg-[#131b2e] border border-[#222a3d] rounded p-3 text-xs text-[#dae2fd] leading-relaxed focus:outline-none focus:border-[#6366f1] transition-colors"
                      placeholder="Enter measurable course outcome statement starting with an active Bloom verb..."
                    />
                  </div>

                  {/* AI Refinement Proposal Box */}
                  {isShowingRefinement && refinementResult && (
                    <div className="bg-[#171f33] border border-[#8b5cf6]/40 rounded-lg p-3.5 space-y-2.5 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#d0bcff]">
                          <Sparkles className="w-3.5 h-3.5 text-[#8b5cf6]" />
                          <span>AI Refined Proposal (Verb: {refinementResult.actionVerb})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApplyRefinement(co.id)}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-[#8b5cf6] hover:bg-[#7c4ee0] text-white rounded transition-colors cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                            <span>Apply Suggestion</span>
                          </button>
                          <button
                            onClick={() => setRefinementResult(null)}
                            className="px-2 py-1 text-xs text-[#908fa0] hover:text-[#dae2fd] transition-colors cursor-pointer"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-[#dae2fd] leading-relaxed font-medium">
                        &ldquo;{refinementResult.refinedStatement}&rdquo;
                      </p>

                      <p className="text-[11px] text-[#908fa0] italic">
                        Pedagogical rationale: {refinementResult.rationale}
                      </p>
                    </div>
                  )}

                  {/* Assessment Tools Tags */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-[11px] font-mono text-[#908fa0]">Assessment Instruments:</span>
                    {co.assessmentTools.map((tool, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] font-mono text-[#c7c4d7] bg-[#131b2e] px-2 py-0.5 rounded border border-[#222a3d]"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Syllabus Modules */}
        {activeTab === 'modules' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#908fa0] px-1">
              <span>Total Lecture Breakdown: {totalLectureHours} Hours</span>
              <span>Credits: {course.credits}</span>
            </div>

            {course.modules.map((mod) => (
              <div
                key={mod.unit}
                className="bg-[#0f172a] border border-[#222a3d] rounded-lg p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#4cd7f6] px-2.5 py-1 bg-[#131b2e] rounded border border-[#222a3d]">
                      UNIT {mod.unit}
                    </span>
                    <h4 className="text-sm font-semibold text-[#dae2fd]">{mod.title}</h4>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs text-[#908fa0]">
                    <Clock className="w-3.5 h-3.5 text-[#6366f1]" />
                    <span>{mod.lectureHours} Lecture Hours</span>
                  </div>
                </div>

                {/* Topics list */}
                <div>
                  <div className="text-[11px] font-mono text-[#908fa0] uppercase tracking-wider mb-1.5">
                    Instructional Topics
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {mod.topics.map((topic, tIdx) => (
                      <div
                        key={tIdx}
                        className="text-xs text-[#c7c4d7] bg-[#131b2e] p-2 rounded border border-[#222a3d] flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mapped COs */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#222a3d] text-xs font-mono">
                  <span className="text-[#908fa0]">Addresses Outcomes:</span>
                  {mod.cosAddressed.map((coId) => (
                    <span
                      key={coId}
                      className="px-2 py-0.5 rounded bg-[#1e293b] text-[#c0c1ff] border border-[#6366f1]/30 font-bold"
                    >
                      {coId}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: AI Syllabus Synthesizer */}
        {activeTab === 'generator' && (
          <div className="bg-[#0f172a] border border-[#222a3d] rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-[#dae2fd] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8b5cf6]" />
                <span>AI Course Outcome Synthesizer</span>
              </h3>
              <p className="text-xs text-[#908fa0] mt-1">
                Paste your raw course syllabus, module topics, or curriculum draft below. Gemini will synthesize 5-6 formal Course Outcomes spanning Bloom’s cognitive spectrum (BT2 Understand to BT6 Create) with measurable action verbs.
              </p>
            </div>

            <textarea
              rows={10}
              value={generatorText}
              onChange={(e) => setGeneratorText(e.target.value)}
              className="w-full bg-[#131b2e] border border-[#222a3d] rounded p-4 text-xs font-mono text-[#dae2fd] leading-relaxed focus:outline-none focus:border-[#6366f1]"
              placeholder="Paste syllabus modules and topics here..."
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#908fa0]">
                Target: 6 ABET-compliant outcome statements
              </span>
              <button
                onClick={handleGenerateCos}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[#6366f1] hover:bg-[#4f52e0] text-white rounded shadow transition-colors cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Synthesizing Outcomes...' : 'Synthesize Course Outcomes'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

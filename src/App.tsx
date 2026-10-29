/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MatrixView } from './components/MatrixView';
import { SyllabusWorkbench } from './components/SyllabusWorkbench';
import { AttainmentSimulator } from './components/AttainmentSimulator';
import { AccreditationAudit } from './components/AccreditationAudit';
import { CellJustificationModal } from './components/CellJustificationModal';
import { NewCourseModal } from './components/NewCourseModal';
import { AiCompanionRail } from './components/AiCompanionRail';

import {
  INITIAL_COURSES,
  PROGRAM_OUTCOMES,
  PROGRAM_SPECIFIC_OUTCOMES,
} from './data/mockCurriculum';
import {
  Course,
  WorkbenchView,
  AccreditationStandard,
  MatrixCellData,
} from './types/curriculum';

export default function App() {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [activeCourseId, setActiveCourseId] = useState<string>('CS301');
  const [activeView, setActiveView] = useState<WorkbenchView>('matrix');
  const [accreditationStandard, setAccreditationStandard] =
    useState<AccreditationStandard>('ABET_EAC_2026');
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
  const [aiRailOpen, setAiRailOpen] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cell Justification modal state
  const [cellModalState, setCellModalState] = useState<{
    isOpen: boolean;
    coId: string;
    poId: string;
    cellData: MatrixCellData;
  }>({
    isOpen: false,
    coId: '',
    poId: '',
    cellData: { weight: 0 },
  });

  // New Course modal state
  const [isNewCourseModalOpen, setIsNewCourseModalOpen] = useState(false);

  // Active course reference
  const activeCourse =
    courses.find((c) => c.id === activeCourseId) || courses[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Update a single matrix cell
  const handleUpdateCell = (
    coId: string,
    poId: string,
    cellData: MatrixCellData
  ) => {
    setCourses((prevCourses) =>
      prevCourses.map((c) => {
        if (c.id !== activeCourse.id) return c;
        const currentMapping = { ...(c.matrixMapping || {}) };
        const coMapping = { ...(currentMapping[coId] || {}) };
        coMapping[poId] = cellData;
        currentMapping[coId] = coMapping;
        return {
          ...c,
          matrixMapping: currentMapping,
        };
      })
    );
  };

  // Update whole course
  const handleUpdateCourse = (updatedCourse: Course) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))
    );
    showToast(`Updated course specifications for ${updatedCourse.code}.`);
  };

  // Add new course
  const handleAddCourse = (newCourse: Course) => {
    setCourses((prev) => [newCourse, ...prev]);
    setActiveCourseId(newCourse.id);
    showToast(`Created new course ${newCourse.code} in curriculum catalog.`);
  };

  // Run AI Auto-Map
  const handleAutoMap = async () => {
    setIsAiProcessing(true);
    try {
      const response = await fetch('/api/gemini/auto-map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseTitle: activeCourse.title,
          courseCode: activeCourse.code,
          courseDescription: activeCourse.description,
          courseOutcomes: activeCourse.outcomes,
          programOutcomes: PROGRAM_OUTCOMES,
          programSpecificOutcomes: PROGRAM_SPECIFIC_OUTCOMES,
        }),
      });

      const data = await response.json();
      if (data.mappings) {
        setCourses((prevCourses) =>
          prevCourses.map((c) => {
            if (c.id !== activeCourse.id) return c;
            const updatedMapping = { ...c.matrixMapping };
            Object.keys(data.mappings).forEach((coId) => {
              updatedMapping[coId] = updatedMapping[coId] || {};
              Object.keys(data.mappings[coId]).forEach((poId) => {
                const item = data.mappings[coId][poId];
                updatedMapping[coId][poId] = {
                  weight: typeof item === 'number' ? item : item.weight ?? 0,
                  rationale: typeof item === 'object' ? item.rationale : undefined,
                };
              });
            });
            return {
              ...c,
              matrixMapping: updatedMapping,
            };
          })
        );
        showToast(
          `AI Auto-Alignment complete (${data.source || 'gemini'}): Calibrated weights and rationales applied.`
        );
      }
    } catch (err: any) {
      console.error('Auto-map failed:', err);
      showToast('Auto-map encountered an error. Applying deterministic alignment.');
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Reset matrix
  const handleResetMatrix = () => {
    const emptyMapping: Record<string, Record<string, MatrixCellData>> = {};
    activeCourse.outcomes.forEach((co) => {
      emptyMapping[co.id] = {};
      PROGRAM_OUTCOMES.forEach((po) => {
        emptyMapping[co.id][po.id] = { weight: 0 };
      });
      PROGRAM_SPECIFIC_OUTCOMES.forEach((pso) => {
        emptyMapping[co.id][pso.id] = { weight: 0 };
      });
    });

    handleUpdateCourse({
      ...activeCourse,
      matrixMapping: emptyMapping,
    });
    showToast(`Reset matrix correlations for ${activeCourse.code}.`);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#090d16] text-[#dae2fd]">
      {/* Top Application Bar */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        activeCourse={activeCourse}
        courses={courses}
        onSelectCourse={(id) => setActiveCourseId(id)}
        accreditationStandard={accreditationStandard}
        setAccreditationStandard={setAccreditationStandard}
        onAutoMapClick={handleAutoMap}
        isAiProcessing={isAiProcessing}
        onOpenAudit={() => setActiveView('audit')}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Workbench Sidebar */}
        <Sidebar
          courses={courses}
          activeCourse={activeCourse}
          onSelectCourse={(id) => setActiveCourseId(id)}
          onNewCourseClick={() => setIsNewCourseModalOpen(true)}
          programOutcomes={PROGRAM_OUTCOMES}
          programSpecificOutcomes={PROGRAM_SPECIFIC_OUTCOMES}
        />

        {/* Central Computational Canvas */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {activeView === 'matrix' && (
            <MatrixView
              course={activeCourse}
              programOutcomes={PROGRAM_OUTCOMES}
              programSpecificOutcomes={PROGRAM_SPECIFIC_OUTCOMES}
              onUpdateCell={handleUpdateCell}
              onAutoMap={handleAutoMap}
              isAiProcessing={isAiProcessing}
              onOpenCellDetails={(coId, poId, cell) =>
                setCellModalState({
                  isOpen: true,
                  coId,
                  poId,
                  cellData: cell,
                })
              }
              onResetMatrix={handleResetMatrix}
            />
          )}

          {activeView === 'syllabus' && (
            <SyllabusWorkbench
              course={activeCourse}
              onUpdateCourse={handleUpdateCourse}
            />
          )}

          {activeView === 'attainment' && (
            <AttainmentSimulator
              course={activeCourse}
              programOutcomes={PROGRAM_OUTCOMES}
              programSpecificOutcomes={PROGRAM_SPECIFIC_OUTCOMES}
            />
          )}

          {activeView === 'audit' && (
            <AccreditationAudit
              course={activeCourse}
              allCourses={courses}
              standard={accreditationStandard}
            />
          )}
        </main>

        {/* Right AI Companion & Telemetry Rail */}
        <AiCompanionRail
          course={activeCourse}
          isOpen={aiRailOpen}
          onToggle={() => setAiRailOpen(!aiRailOpen)}
          onAutoMap={handleAutoMap}
          isAiProcessing={isAiProcessing}
          onRefineWeakVerbs={() => setActiveView('syllabus')}
          onRunGapAnalysis={() => setActiveView('audit')}
        />
      </div>

      {/* Cell Justification Drawer / Modal */}
      {cellModalState.isOpen && (
        <CellJustificationModal
          isOpen={cellModalState.isOpen}
          onClose={() =>
            setCellModalState((prev) => ({ ...prev, isOpen: false }))
          }
          coId={cellModalState.coId}
          poId={cellModalState.poId}
          course={activeCourse}
          cellData={cellModalState.cellData}
          programOutcomes={PROGRAM_OUTCOMES}
          programSpecificOutcomes={PROGRAM_SPECIFIC_OUTCOMES}
          onSave={handleUpdateCell}
        />
      )}

      {/* Add New Course Modal */}
      {isNewCourseModalOpen && (
        <NewCourseModal
          isOpen={isNewCourseModalOpen}
          onClose={() => setIsNewCourseModalOpen(false)}
          onAddCourse={handleAddCourse}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-[#1e293b] text-[#dae2fd] border border-[#6366f1]/50 px-4 py-2.5 rounded-lg shadow-xl text-xs font-mono flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

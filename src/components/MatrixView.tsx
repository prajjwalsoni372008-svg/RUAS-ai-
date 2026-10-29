import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  RotateCcw,
  SlidersHorizontal,
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileSpreadsheet,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import {
  Course,
  ProgramOutcome,
  ProgramSpecificOutcome,
  MatrixCellData,
} from '../types/curriculum';
import { BLOOM_TAXONOMY_CATALOG } from '../data/mockCurriculum';

interface MatrixViewProps {
  course: Course;
  programOutcomes: ProgramOutcome[];
  programSpecificOutcomes: ProgramSpecificOutcome[];
  onUpdateCell: (coId: string, poId: string, cellData: MatrixCellData) => void;
  onAutoMap: () => void;
  isAiProcessing: boolean;
  onOpenCellDetails: (coId: string, poId: string, cell: MatrixCellData) => void;
  onResetMatrix: () => void;
}

export const MatrixView: React.FC<MatrixViewProps> = ({
  course,
  programOutcomes,
  programSpecificOutcomes,
  onUpdateCell,
  onAutoMap,
  isAiProcessing,
  onOpenCellDetails,
  onResetMatrix,
}) => {
  const [filterWeight, setFilterWeight] = useState<number | 'ALL'>('ALL');
  const [hoveredCell, setHoveredCell] = useState<{ coId: string; poId: string } | null>(null);

  const allColumns = [
    ...programOutcomes.map((po) => ({ id: po.id, title: po.title, isPso: false })),
    ...programSpecificOutcomes.map((pso) => ({ id: pso.id, title: pso.title, isPso: true })),
  ];

  // Cycle weights: 0 -> 1 -> 2 -> 3 -> 0
  const handleCellClick = (coId: string, poId: string) => {
    const current = course.matrixMapping[coId]?.[poId]?.weight ?? 0;
    const nextWeight = (current + 1) % 4;
    const existing = course.matrixMapping[coId]?.[poId] || { weight: 0 };
    onUpdateCell(coId, poId, {
      ...existing,
      weight: nextWeight,
    });
  };

  // Compute row statistics
  const getRowStats = (coId: string) => {
    const mapping = course.matrixMapping[coId] || {};
    let sum = 0;
    let count = 0;
    allColumns.forEach((col) => {
      const val = mapping[col.id]?.weight ?? 0;
      if (val > 0) {
        sum += val;
        count++;
      }
    });
    const avg = count > 0 ? (sum / count).toFixed(2) : '0.00';
    let status: 'VALID' | 'WARNING' | 'ERROR' = 'VALID';
    if (count === 0) status = 'ERROR';
    else if (count < 3 || parseFloat(avg) < 1.4) status = 'WARNING';

    return { avg, count, status };
  };

  // Compute column statistics
  const getColStats = (poId: string) => {
    let sum = 0;
    let count = 0;
    course.outcomes.forEach((co) => {
      const val = course.matrixMapping[co.id]?.[poId]?.weight ?? 0;
      if (val > 0) {
        sum += val;
        count++;
      }
    });
    const avg = count > 0 ? (sum / course.outcomes.length).toFixed(2) : '0.00';
    const isUnderMapped = parseFloat(avg) < 1.0;
    return { avg, count, isUnderMapped };
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['CO_ID', 'Bloom_Level', 'Course_Outcome_Statement', ...allColumns.map((c) => c.id), 'Avg_Correlation'];
    const rows = course.outcomes.map((co) => {
      const rowStats = getRowStats(co.id);
      const cells = allColumns.map((c) => course.matrixMapping[co.id]?.[c.id]?.weight ?? 0);
      return [
        co.id,
        co.bloomLevel,
        `"${co.statement.replace(/"/g, '""')}"`,
        ...cells,
        rowStats.avg,
      ];
    });

    // Column averages row
    const avgRow = [
      'AVERAGE',
      '',
      'Program Outcome Correlation Strength',
      ...allColumns.map((c) => getColStats(c.id).avg),
      '',
    ];

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(',')), avgRow.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${course.code}_CO_PO_Matrix.csv`;
    link.click();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#090d16] overflow-hidden select-none">
      {/* Matrix Toolbar */}
      <div className="bg-[#0f172a] border-b border-[#222a3d] px-6 py-3 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-sm font-semibold text-[#dae2fd] flex items-center gap-2">
              <span>CO-PO Correlation Matrix</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1e293b] text-[#4cd7f6] border border-[#222a3d]">
                {course.code}
              </span>
            </h1>
            <p className="text-[11px] text-[#908fa0] mt-0.5 font-mono">
              2D computational matrix · PO1–PO12 (Washington Accord) + PSO1–PSO3
            </p>
          </div>

          <div className="h-5 w-px bg-[#222a3d]" />

          {/* Correlation Legend */}
          <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-[#c7c4d7]">
            <span className="text-[10px] text-[#908fa0] uppercase tracking-wider">Scale:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-[#131b2e] border border-[#222a3d] text-[10px] font-bold text-[#908fa0] flex items-center justify-center">
                0
              </span>
              <span className="text-[11px] text-[#908fa0]">None</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-[#172554] border border-[#1e40af] text-[10px] font-bold text-[#60a5fa] flex items-center justify-center">
                1
              </span>
              <span className="text-[11px] text-[#908fa0]">Low</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-[#312e81] border border-[#4338ca] text-[10px] font-bold text-[#a5b4fc] flex items-center justify-center">
                2
              </span>
              <span className="text-[11px] text-[#908fa0]">Medium</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-[#4f46e5] border border-[#818cf8] text-[10px] font-bold text-white flex items-center justify-center shadow-sm">
                3
              </span>
              <span className="text-[11px] text-[#908fa0]">High</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2.5">
          {/* Filter weight */}
          <div className="flex items-center gap-1 bg-[#131b2e] p-1 rounded border border-[#222a3d] text-xs font-mono">
            <span className="text-[10px] text-[#908fa0] px-1.5">Filter:</span>
            {(['ALL', 3, 2, 1, 0] as const).map((w) => (
              <button
                key={String(w)}
                onClick={() => setFilterWeight(w)}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                  filterWeight === w
                    ? 'bg-[#1e293b] text-[#c0c1ff] font-bold'
                    : 'text-[#908fa0] hover:text-[#dae2fd]'
                }`}
              >
                {w === 'ALL' ? 'All' : `=${w}`}
              </button>
            ))}
          </div>

          <button
            onClick={onAutoMap}
            disabled={isAiProcessing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#1e293b] hover:bg-[#2d3449] text-[#c0c1ff] border border-[#6366f1]/40 rounded transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
            title="Auto-calculate correlation matrix using Gemini model and syllabus topics"
          >
            <Sparkles className={`w-3.5 h-3.5 text-[#8b5cf6] ${isAiProcessing ? 'animate-spin' : ''}`} />
            <span>AI Auto-Map</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#131b2e] hover:bg-[#171f33] text-[#dae2fd] border border-[#222a3d] rounded transition-colors whitespace-nowrap cursor-pointer"
            title="Export CSV matrix for official documentation"
          >
            <Download className="w-3.5 h-3.5 text-[#4cd7f6]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onResetMatrix}
            className="p-1.5 rounded bg-[#131b2e] hover:bg-[#171f33] text-[#908fa0] hover:text-[#dae2fd] border border-[#222a3d] transition-colors cursor-pointer"
            title="Reset matrix to default mappings"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Matrix Computational Canvas */}
      <div className="flex-1 overflow-auto relative p-4">
        <div className="inline-block min-w-full align-middle border border-[#222a3d] rounded-lg shadow-2xl bg-[#0f172a] overflow-hidden">
          <table className="min-w-full border-collapse text-left">
            <thead>
              {/* Main Column Header Row */}
              <tr className="bg-[#131b2e] border-b border-[#222a3d]">
                {/* Frozen column 1: CO ID */}
                <th
                  scope="col"
                  className="sticky left-0 z-20 bg-[#131b2e] px-3 py-3 w-16 text-center font-mono text-[11px] font-bold text-[#c0c1ff] tracking-wider border-r border-[#222a3d]"
                >
                  CO_ID
                </th>

                {/* Frozen column 2: Bloom's Level */}
                <th
                  scope="col"
                  className="sticky left-16 z-20 bg-[#131b2e] px-3 py-3 w-28 text-center font-mono text-[11px] font-bold text-[#908fa0] tracking-wider border-r border-[#222a3d]"
                >
                  BLOOM
                </th>

                {/* Frozen column 3: Outcome Statement */}
                <th
                  scope="col"
                  className="sticky left-44 z-20 bg-[#131b2e] px-4 py-3 min-w-[280px] max-w-[340px] font-mono text-[11px] font-bold text-[#908fa0] tracking-wider border-r border-[#222a3d]"
                >
                  COURSE OUTCOME STATEMENT
                </th>

                {/* Program Outcomes PO1 - PO12 */}
                {programOutcomes.map((po) => (
                  <th
                    key={po.id}
                    scope="col"
                    className="px-2 py-3 w-16 text-center font-mono text-[11px] font-bold text-[#4cd7f6] tracking-wider border-r border-[#222a3d] hover:bg-[#1e293b] transition-colors cursor-help group"
                    title={`${po.id}: ${po.title} (${po.abetCriterion})\n${po.description}`}
                  >
                    <div className="flex flex-col items-center">
                      <span>{po.id}</span>
                      <span className="text-[9px] font-normal text-[#908fa0] uppercase tracking-tighter truncate max-w-[50px]">
                        {po.shortCode}
                      </span>
                    </div>
                  </th>
                ))}

                {/* Program Specific Outcomes PSO1 - PSO3 */}
                {programSpecificOutcomes.map((pso) => (
                  <th
                    key={pso.id}
                    scope="col"
                    className="px-2 py-3 w-16 text-center font-mono text-[11px] font-bold text-[#d0bcff] tracking-wider border-r border-[#222a3d] hover:bg-[#1e293b] transition-colors cursor-help"
                    title={`${pso.id}: ${pso.title}\n${pso.description}`}
                  >
                    <div className="flex flex-col items-center">
                      <span>{pso.id}</span>
                      <span className="text-[9px] font-normal text-[#908fa0] uppercase tracking-tighter truncate max-w-[50px]">
                        {pso.shortCode}
                      </span>
                    </div>
                  </th>
                ))}

                {/* Analytics Columns */}
                <th
                  scope="col"
                  className="px-3 py-3 w-20 text-center font-mono text-[11px] font-bold text-[#dae2fd] tracking-wider border-r border-[#222a3d]"
                >
                  AVG_PO
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 w-24 text-center font-mono text-[11px] font-bold text-[#dae2fd] tracking-wider"
                >
                  STATUS
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#222a3d] font-mono text-xs">
              {course.outcomes.map((co, index) => {
                const bloomInfo = BLOOM_TAXONOMY_CATALOG[co.bloomLevel] || BLOOM_TAXONOMY_CATALOG.BT3;
                const rowStats = getRowStats(co.id);

                return (
                  <tr
                    key={co.id}
                    className="hover:bg-[#131b2e]/60 transition-colors group"
                  >
                    {/* Frozen CO ID */}
                    <td className="sticky left-0 z-10 bg-[#0f172a] group-hover:bg-[#131b2e] px-3 py-3 text-center font-bold text-[#c0c1ff] border-r border-[#222a3d]">
                      {co.id}
                    </td>

                    {/* Frozen Bloom's Level */}
                    <td className="sticky left-16 z-10 bg-[#0f172a] group-hover:bg-[#131b2e] px-3 py-3 text-center border-r border-[#222a3d]">
                      <span
                        className="inline-block px-2 py-0.5 rounded text-[10px] font-bold"
                        style={{
                          backgroundColor: `${bloomInfo.badgeColor}25`,
                          color: bloomInfo.badgeColor,
                          border: `1px solid ${bloomInfo.badgeColor}40`,
                        }}
                        title={bloomInfo.description}
                      >
                        {co.bloomLevel} · {bloomInfo.name}
                      </span>
                    </td>

                    {/* Frozen Outcome Statement */}
                    <td className="sticky left-44 z-10 bg-[#0f172a] group-hover:bg-[#131b2e] px-4 py-3 font-sans text-xs text-[#c7c4d7] border-r border-[#222a3d] max-w-[340px]">
                      <p className="line-clamp-2 text-[12px] leading-relaxed" title={co.statement}>
                        {co.statement}
                      </p>
                    </td>

                    {/* Data Cells: PO1 - PO12 & PSO1 - PSO3 */}
                    {allColumns.map((col) => {
                      const cell = course.matrixMapping[co.id]?.[col.id] || { weight: 0 };
                      const weight = cell.weight;
                      const matchesFilter = filterWeight === 'ALL' || weight === filterWeight;

                      let cellBg = 'bg-transparent text-[#64748b]';
                      if (weight === 1) cellBg = 'bg-[#172554]/60 text-[#60a5fa] border border-[#1e40af]/60';
                      else if (weight === 2) cellBg = 'bg-[#312e81]/60 text-[#a5b4fc] border border-[#4338ca]/60';
                      else if (weight === 3) cellBg = 'bg-[#4f46e5] text-white border border-[#818cf8] font-bold shadow-sm';

                      return (
                        <td
                          key={col.id}
                          className={`px-1 py-1.5 text-center border-r border-[#222a3d] transition-colors ${
                            !matchesFilter ? 'opacity-25' : ''
                          }`}
                          onMouseEnter={() => setHoveredCell({ coId: co.id, poId: col.id })}
                          onMouseLeave={() => setHoveredCell(null)}
                        >
                          <div className="relative group/cell flex items-center justify-center">
                            <button
                              onClick={() => handleCellClick(co.id, col.id)}
                              className={`w-9 h-8 rounded flex items-center justify-center text-xs tabular-nums cursor-pointer transition-all hover:scale-105 ${cellBg}`}
                              title={`Click to cycle 0->1->2->3\n${co.id} -> ${col.id}: ${weight}\n${cell.rationale || 'Click info to add rationale'}`}
                            >
                              {weight === 0 ? '—' : weight}
                            </button>

                            {/* Info rationale trigger button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenCellDetails(co.id, col.id, cell);
                              }}
                              className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#1e293b] border border-[#6366f1]/40 text-[#c0c1ff] opacity-0 group-hover/cell:opacity-100 transition-opacity flex items-center justify-center hover:bg-[#6366f1] hover:text-white"
                              title="Inspect & edit justification rationale"
                            >
                              <Info className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </td>
                      );
                    })}

                    {/* Row Statistics: Average */}
                    <td className="px-3 py-3 text-center border-r border-[#222a3d] font-bold text-[#dae2fd] tabular-nums">
                      {rowStats.avg}
                    </td>

                    {/* Row Statistics: Validation Status */}
                    <td className="px-3 py-3 text-center">
                      {rowStats.status === 'VALID' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#10b981]">
                          <CheckCircle className="w-3 h-3" />
                          <span>Mapped</span>
                        </span>
                      )}
                      {rowStats.status === 'WARNING' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#f59e0b]">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Low</span>
                        </span>
                      )}
                      {rowStats.status === 'ERROR' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#ef4444]">
                          <XCircle className="w-3 h-3" />
                          <span>Orphan</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Matrix Analytical Summary Footers */}
            <tfoot>
              {/* Average Contribution Row */}
              <tr className="bg-[#131b2e] border-t-2 border-[#222a3d] font-mono text-xs">
                <td
                  colSpan={3}
                  className="sticky left-0 z-10 bg-[#131b2e] px-4 py-3 text-right font-bold text-[#c0c1ff] border-r border-[#222a3d]"
                >
                  PROGRAM OUTCOME CORRELATION (AVERAGE)
                </td>

                {allColumns.map((col) => {
                  const colStats = getColStats(col.id);
                  return (
                    <td
                      key={col.id}
                      className={`px-2 py-3 text-center font-bold border-r border-[#222a3d] tabular-nums ${
                        colStats.isUnderMapped
                          ? 'text-[#f59e0b] bg-[#f59e0b]/10'
                          : 'text-[#4cd7f6]'
                      }`}
                      title={`${col.id} Average Correlation: ${colStats.avg}\n${colStats.count} of ${course.outcomes.length} COs mapped.`}
                    >
                      {colStats.avg}
                    </td>
                  );
                })}

                <td
                  colSpan={2}
                  className="px-3 py-3 text-center font-semibold text-[#908fa0] text-[11px]"
                >
                  ABET Baseline ≥ 1.00
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Dynamic Contextual Hint Bar */}
        {hoveredCell && (
          <div className="mt-3 p-3 rounded-lg bg-[#131b2e] border border-[#222a3d] flex items-center justify-between text-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-[#c0c1ff]">
                {hoveredCell.coId} ➔ {hoveredCell.poId}
              </span>
              <span className="text-[#908fa0]">·</span>
              <span className="text-[#dae2fd]">
                Weight:{' '}
                <strong className="text-[#4cd7f6]">
                  {course.matrixMapping[hoveredCell.coId]?.[hoveredCell.poId]?.weight ?? 0}
                </strong>{' '}
                (
                {
                  ['None', 'Low / Slight', 'Medium / Moderate', 'High / Substantial'][
                    course.matrixMapping[hoveredCell.coId]?.[hoveredCell.poId]?.weight ?? 0
                  ]
                }
                )
              </span>
              {course.matrixMapping[hoveredCell.coId]?.[hoveredCell.poId]?.rationale && (
                <>
                  <span className="text-[#908fa0]">·</span>
                  <span className="text-[#c7c4d7] italic truncate max-w-xl">
                    &ldquo;{course.matrixMapping[hoveredCell.coId][hoveredCell.poId].rationale}&rdquo;
                  </span>
                </>
              )}
            </div>
            <button
              onClick={() => {
                const cell = course.matrixMapping[hoveredCell.coId]?.[hoveredCell.poId] || { weight: 0 };
                onOpenCellDetails(hoveredCell.coId, hoveredCell.poId, cell);
              }}
              className="text-[#6366f1] hover:underline font-medium text-[11px] shrink-0"
            >
              Edit Justification
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

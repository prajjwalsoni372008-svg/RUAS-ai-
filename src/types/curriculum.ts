export type BloomLevel = 'BT1' | 'BT2' | 'BT3' | 'BT4' | 'BT5' | 'BT6';

export interface BloomInfo {
  level: BloomLevel;
  name: string;
  badgeColor: string;
  verbs: string[];
  description: string;
}

export interface CourseOutcome {
  id: string; // e.g. "CO1"
  statement: string;
  bloomLevel: BloomLevel;
  targetAttainmentPercentage: number; // e.g. 70
  assessmentTools: string[];
}

export interface ProgramOutcome {
  id: string; // "PO1" to "PO12"
  shortCode: string;
  title: string;
  abetCriterion: string; // e.g. "Criterion 3.1"
  description: string;
}

export interface ProgramSpecificOutcome {
  id: string; // "PSO1" to "PSO3"
  shortCode: string;
  title: string;
  description: string;
}

export interface SyllabusModule {
  unit: number;
  title: string;
  lectureHours: number;
  topics: string[];
  cosAddressed: string[];
}

export interface MatrixCellData {
  weight: number; // 0 (None), 1 (Low/Slight), 2 (Medium/Moderate), 3 (High/Substantial)
  rationale?: string;
  evidenceTags?: string[];
  moduleRef?: string;
}

export interface AssessmentQuestion {
  id: string;
  number: string;
  coId: string;
  maxMarks: number;
  bloomLevel: BloomLevel;
  avgStudentScore: number;
}

export interface AssessmentComponent {
  id: string;
  name: string;
  category: 'CIE' | 'SEE';
  weightagePct: number;
  questions: AssessmentQuestion[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  credits: string; // "3-0-2-4"
  semester: number;
  department: string;
  academicYear: string;
  instructor: string;
  description: string;
  prerequisites: string[];
  modules: SyllabusModule[];
  outcomes: CourseOutcome[];
  matrixMapping: Record<string, Record<string, MatrixCellData>>; // coId -> poId -> MatrixCellData
  assessments: AssessmentComponent[];
}

export interface AccreditationAuditItem {
  id: string;
  criterionNumber: string;
  title: string;
  standard: 'ABET_EAC' | 'NBA_TIER_1';
  status: 'COMPLIANT' | 'NEEDS_ATTENTION' | 'NON_COMPLIANT';
  score: number; // e.g. 90/100
  evidenceRequired: string;
  currentEvidence: string;
  remedialAction?: string;
}

export type WorkbenchView = 'matrix' | 'syllabus' | 'attainment' | 'audit' | 'export';
export type AccreditationStandard = 'ABET_EAC_2026' | 'NBA_TIER_1_WA';

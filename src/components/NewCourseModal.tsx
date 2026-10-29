import React, { useState } from 'react';
import { X, Plus, BookOpen, Layers } from 'lucide-react';
import { Course } from '../types/curriculum';

interface NewCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCourse: (newCourse: Course) => void;
}

export const NewCourseModal: React.FC<NewCourseModalProps> = ({
  isOpen,
  onClose,
  onAddCourse,
}) => {
  if (!isOpen) return null;

  const [code, setCode] = useState('CS410');
  const [title, setTitle] = useState('Cloud Computing & Distributed Systems');
  const [credits, setCredits] = useState('3-0-2-4');
  const [semester, setSemester] = useState(7);
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [instructor, setInstructor] = useState('Dr. Marcus Sterling');
  const [description, setDescription] = useState(
    'Architectural models of distributed computing, virtualization, consensus protocols (Raft/Paxos), and serverless architectures.'
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim()) return;

    const newCourse: Course = {
      id: code.trim().toUpperCase(),
      code: code.trim().toUpperCase(),
      title: title.trim(),
      credits: credits.trim() || '3-0-0-3',
      semester: Number(semester) || 1,
      department: department.trim(),
      academicYear: '2026-2027',
      instructor: instructor.trim() || 'Faculty Assigned',
      description: description.trim(),
      prerequisites: ['CS301 Data Structures', 'CS304 Operating Systems'],
      modules: [
        {
          unit: 1,
          title: 'Distributed System Foundations & RPC',
          lectureHours: 8,
          topics: ['Network transparency', 'gRPC and Protocol Buffers', 'Clock synchronization'],
          cosAddressed: ['CO1'],
        },
        {
          unit: 2,
          title: 'Distributed Consensus & Fault Tolerance',
          lectureHours: 10,
          topics: ['Paxos & Raft state machine replication', 'Byzantine Fault Tolerance'],
          cosAddressed: ['CO2', 'CO3'],
        },
        {
          unit: 3,
          title: 'Cloud Virtualization & Container Orchestration',
          lectureHours: 9,
          topics: ['KVM hypervisors', 'Kubernetes control plane', 'Service meshes'],
          cosAddressed: ['CO3', 'CO4'],
        },
        {
          unit: 4,
          title: 'Distributed Storage & Consistency Models',
          lectureHours: 9,
          topics: ['CAP Theorem & PACELC', 'DynamoDB consistent hashing', 'SSTables'],
          cosAddressed: ['CO4', 'CO5'],
        },
        {
          unit: 5,
          title: 'Cloud Security, FinOps & Scalability',
          lectureHours: 9,
          topics: ['Zero Trust IAM', 'Elastic autoscaling', 'FinOps cost allocation'],
          cosAddressed: ['CO5', 'CO6'],
        },
      ],
      outcomes: [
        {
          id: 'CO1',
          statement: `Explain fundamental models of distributed coordination and remote procedure invocation in ${title}.`,
          bloomLevel: 'BT2',
          targetAttainmentPercentage: 70,
          assessmentTools: ['Internal Test 1', 'Exam'],
        },
        {
          id: 'CO2',
          statement: `Implement fault-tolerant state machine replication algorithms including Raft consensus.`,
          bloomLevel: 'BT3',
          targetAttainmentPercentage: 65,
          assessmentTools: ['Lab Assignment 2', 'Exam'],
        },
        {
          id: 'CO3',
          statement: `Analyze trade-offs between consistency, availability, and latency across distributed storage systems.`,
          bloomLevel: 'BT4',
          targetAttainmentPercentage: 65,
          assessmentTools: ['Test 2', 'Exam'],
        },
        {
          id: 'CO4',
          statement: `Design cloud-native microservices utilizing container orchestration and declarative infrastructure.`,
          bloomLevel: 'BT6',
          targetAttainmentPercentage: 65,
          assessmentTools: ['Course Capstone Project'],
        },
        {
          id: 'CO5',
          statement: `Evaluate system resiliency and simulate node failure recovery under adversarial network partitioning.`,
          bloomLevel: 'BT5',
          targetAttainmentPercentage: 60,
          assessmentTools: ['Exam', 'Lab Defense'],
        },
      ],
      matrixMapping: {
        CO1: { PO1: { weight: 3 }, PO2: { weight: 2 }, PO3: { weight: 1 }, PO4: { weight: 1 }, PO5: { weight: 2 }, PO6: { weight: 0 }, PO7: { weight: 0 }, PO8: { weight: 0 }, PO9: { weight: 1 }, PO10: { weight: 1 }, PO11: { weight: 0 }, PO12: { weight: 2 }, PSO1: { weight: 3 }, PSO2: { weight: 3 }, PSO3: { weight: 1 } },
        CO2: { PO1: { weight: 3 }, PO2: { weight: 3 }, PO3: { weight: 3 }, PO4: { weight: 2 }, PO5: { weight: 3 }, PO6: { weight: 0 }, PO7: { weight: 0 }, PO8: { weight: 1 }, PO9: { weight: 2 }, PO10: { weight: 2 }, PO11: { weight: 1 }, PO12: { weight: 3 }, PSO1: { weight: 3 }, PSO2: { weight: 3 }, PSO3: { weight: 1 } },
        CO3: { PO1: { weight: 3 }, PO2: { weight: 3 }, PO3: { weight: 2 }, PO4: { weight: 3 }, PO5: { weight: 2 }, PO6: { weight: 0 }, PO7: { weight: 1 }, PO8: { weight: 0 }, PO9: { weight: 1 }, PO10: { weight: 2 }, PO11: { weight: 1 }, PO12: { weight: 2 }, PSO1: { weight: 3 }, PSO2: { weight: 3 }, PSO3: { weight: 1 } },
        CO4: { PO1: { weight: 3 }, PO2: { weight: 3 }, PO3: { weight: 3 }, PO4: { weight: 2 }, PO5: { weight: 3 }, PO6: { weight: 1 }, PO7: { weight: 1 }, PO8: { weight: 2 }, PO9: { weight: 3 }, PO10: { weight: 3 }, PO11: { weight: 2 }, PO12: { weight: 3 }, PSO1: { weight: 3 }, PSO2: { weight: 3 }, PSO3: { weight: 2 } },
        CO5: { PO1: { weight: 3 }, PO2: { weight: 3 }, PO3: { weight: 2 }, PO4: { weight: 3 }, PO5: { weight: 3 }, PO6: { weight: 1 }, PO7: { weight: 1 }, PO8: { weight: 1 }, PO9: { weight: 2 }, PO10: { weight: 2 }, PO11: { weight: 1 }, PO12: { weight: 3 }, PSO1: { weight: 3 }, PSO2: { weight: 3 }, PSO3: { weight: 2 } },
      },
      assessments: [],
    };

    onAddCourse(newCourse);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none">
      <div className="bg-[#0f172a] border border-[#222a3d] rounded-xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-[#222a3d] bg-[#131b2e] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#6366f1]" />
            <h3 className="text-sm font-semibold text-[#dae2fd]">
              Add Course to Curriculum Catalog
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#908fa0] hover:text-[#dae2fd] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-[#908fa0] uppercase tracking-wider mb-1">
                Course Code
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-[#131b2e] border border-[#222a3d] rounded p-2 text-xs font-mono font-bold text-[#c0c1ff] focus:outline-none focus:border-[#6366f1]"
                placeholder="e.g. CS410"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#908fa0] uppercase tracking-wider mb-1">
                Credits (L-T-P-C)
              </label>
              <input
                type="text"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                className="w-full bg-[#131b2e] border border-[#222a3d] rounded p-2 text-xs font-mono text-[#dae2fd] focus:outline-none focus:border-[#6366f1]"
                placeholder="3-0-2-4"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#908fa0] uppercase tracking-wider mb-1">
              Course Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#131b2e] border border-[#222a3d] rounded p-2 text-xs text-[#dae2fd] font-semibold focus:outline-none focus:border-[#6366f1]"
              placeholder="e.g. Distributed Operating Systems"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-[#908fa0] uppercase tracking-wider mb-1">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full bg-[#131b2e] border border-[#222a3d] rounded p-2 text-xs text-[#dae2fd] focus:outline-none focus:border-[#6366f1] cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#908fa0] uppercase tracking-wider mb-1">
                Course Lead / Instructor
              </label>
              <input
                type="text"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                className="w-full bg-[#131b2e] border border-[#222a3d] rounded p-2 text-xs text-[#dae2fd] focus:outline-none focus:border-[#6366f1]"
                placeholder="Prof. Name, Ph.D."
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#908fa0] uppercase tracking-wider mb-1">
              Description & Objectives
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#131b2e] border border-[#222a3d] rounded p-2 text-xs text-[#dae2fd] focus:outline-none focus:border-[#6366f1]"
            />
          </div>

          <div className="pt-2 border-t border-[#222a3d] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-[#908fa0] hover:text-[#dae2fd] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-[#6366f1] hover:bg-[#4f52e0] text-white rounded transition-colors shadow cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Course Specification</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

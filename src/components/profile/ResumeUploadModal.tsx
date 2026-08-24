import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Sparkles,
  Check,
  AlertCircle,
  X,
  RefreshCw,
  Building,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Mail,
  Phone,
  ArrowRight,
  ClipboardPaste,
  Eye,
} from 'lucide-react';
import { Button } from '../common/Button';
import { User, SkillCategory, WorkExperienceItem, ProjectItem } from '../../types';

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyProfile: (extracted: Partial<User>) => void;
}

export const ResumeUploadModal: React.FC<ResumeUploadModalProps> = ({
  isOpen,
  onClose,
  onApplyProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [rawText, setRawText] = useState<string>('');
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<Partial<User> | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    setParseError(null);
    setExtractedData(null);

    const reader = new FileReader();
    reader.onload = () => {
      setFileBase64(reader.result as string);
    };
    reader.onerror = () => {
      setParseError('Failed to read file. Please try again or paste text directly.');
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileChange(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleParseResume = async () => {
    if (activeTab === 'upload' && !file && !fileBase64) {
      setParseError('Please upload a resume file (PDF, TXT, DOCX, or Image).');
      return;
    }
    if (activeTab === 'paste' && !rawText.trim()) {
      setParseError('Please paste your resume text into the box.');
      return;
    }

    setIsParsing(true);
    setParseError(null);

    try {
      const payload: { text?: string; fileData?: string; mimeType?: string } = {};

      if (activeTab === 'paste') {
        payload.text = rawText;
      } else if (fileBase64 && file) {
        payload.fileData = fileBase64;
        payload.mimeType = file.type || 'application/pdf';
        if (file.name) {
          payload.text = `Filename: ${file.name}`;
        }
      }

      const response = await fetch('/api/resume/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: Failed to parse resume.`);
      }

      const result = await response.json();
      if (result.data) {
        setExtractedData(result.data);
      } else {
        throw new Error(result.error || 'Failed to extract resume data.');
      }
    } catch (err: any) {
      console.error('Resume Parse Error:', err);
      setParseError(
        err.message || 'An error occurred while parsing the resume. Please check your text or file.'
      );
    } finally {
      setIsParsing(false);
    }
  };

  const handleApply = () => {
    if (!extractedData) return;
    onApplyProfile(extractedData);
    onClose();
  };

  const loadSampleResume = () => {
    setActiveTab('paste');
    setRawText(`JORDAN JADE D. PONDARIO
Manila, Philippines | 09074394731 | pondariojordan@gmail.com
GitHub: https://github.com/od4ng | LinkedIn: https://linkedin.com/in/jordan-pondario

PROFESSIONAL SUMMARY
Fresh Bachelor of Science in Information Technology (BSIT) graduate from Systems Plus Computer College with hands-on experience in Web Development, IT Support, and Network Configuration. Skilled in PHP, MySQL, JavaScript, HTML, CSS, Bootstrap, router administration, network troubleshooting, and technical support. Eager to contribute technical expertise, problem-solving skills, and a continuous learning mindset in an entry-level IT or software development role.

TECHNICAL SKILLS
Web Development: PHP, MySQL, JavaScript, HTML5, CSS3, Bootstrap
IT Support & Systems: Hardware Troubleshooting, Software Installation, Desktop Support, Router & Wi-Fi Configuration, LAN Cable Termination (RJ45), Network Troubleshooting, TCP/IP Fundamentals
Developer & IT Tools: Git, GitHub, XAMPP, phpMyAdmin, Chrome DevTools, Composer

EXPERIENCE
IT Intern | Oriental Service Manpower Inc. (OSMI)
Kalaw, Manila, Philippines | 2026 (450 Internship Hours)
• Contributed to the development and maintenance of a web-based HR system used for applicant processing and document compliance monitoring.
• Designed and implemented responsive forms, user dashboards, and backend database functionalities using PHP and MySQL.
• Improved document compliance tracking and applicant record processing efficiency across departments.
• Conducted systematic application testing, bug fixes, and continuous feature enhancements.
• Delivered hands-on IT support, hardware troubleshooting, software setup, and technical assistance to office staff.

Freelance IT Support & Network Technician
Manila, Philippines | 2025–Present
• Installed and configured home internet and wireless network devices for residential users.
• Performed LAN cable termination and crimping using RJ45 straight-through wiring standards.
• Configured routers through web-based administration interfaces, including Wi-Fi setup, password management, and user account configuration.
• Diagnosed and resolved internet connectivity, network access, and device connection issues.

PROJECTS
OSMI Applicant & Document Monitoring System
Student Research Project / Oriental Service Manpower Inc.
• Developed responsive forms, applicant management modules, and document monitoring features using PHP, JavaScript, HTML5, CSS3, and Bootstrap.
• Built administrative monitoring dashboards and structured relational database tables in MySQL using phpMyAdmin.
• Enhanced data validation and processing workflows, reducing manual paperwork management time.

Whiteland Express Logistics Website
Student Research Project
• Developed as an academic project focused on logistics and transportation services.
• Implemented navigation structures and page components optimized for usability and accessibility.
• Created front-end page layouts, responsive UI structures, and cross-browser compatible CSS styling.

EDUCATION
Bachelor of Science in Information Technology (BSIT)
Systems Plus Computer College | Caloocan City, Philippines | 2022 – 2026`);
    setParseError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                AI Resume & Profile Sync
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload your resume or paste its text to automatically fill your profile
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {!extractedData ? (
            <>
              {/* Method Switcher */}
              <div className="flex items-center justify-between">
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('upload');
                      setParseError(null);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'upload'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload File</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('paste');
                      setParseError(null);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'paste'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                    }`}
                  >
                    <ClipboardPaste className="w-3.5 h-3.5" />
                    <span>Paste Text</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={loadSampleResume}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Use Sample Text</span>
                </button>
              </div>

              {activeTab === 'upload' ? (
                /* File Upload Zone */
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                    isDragOver
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
                      : file
                      ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.txt,image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileChange(e.target.files[0]);
                      }
                    }}
                  />

                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
                    {file ? <FileText className="w-6 h-6 text-emerald-600" /> : <UploadCloud className="w-6 h-6" />}
                  </div>

                  {file ? (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {(file.size / 1024).toFixed(1)} KB • Ready to extract
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        Click to browse or drag & drop your resume
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Supports PDF, Word (.docx), Plain Text (.txt), or Resume screenshots
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Paste Resume Text */
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Paste Resume / CV Content:
                  </label>
                  <textarea
                    rows={8}
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="Paste the raw text of your resume here (Contact info, Education, Experience, Projects, Skills)..."
                    className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-hidden leading-relaxed"
                  />
                </div>
              )}

              {parseError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{parseError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-[11px] text-slate-400">
                  ⚡ AI safely parses contact info, skills, experience, & projects.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={onClose} disabled={isParsing}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleParseResume}
                    disabled={isParsing || (activeTab === 'upload' && !file) || (activeTab === 'paste' && !rawText.trim())}
                    icon={
                      isParsing ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )
                    }
                  >
                    {isParsing ? 'Extracting Resume...' : 'Parse & Sync Profile'}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* Review Extracted Data Mode */
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                    Resume successfully parsed! Review extracted candidate information below:
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setExtractedData(null)}
                  className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:underline"
                >
                  Try another
                </button>
              </div>

              {/* Extracted Card Preview */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 max-h-[380px] overflow-y-auto">
                {/* Candidate basic info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-700/80 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {extractedData.name || 'Candidate Name'}
                    </h3>
                    <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                      {extractedData.preferredRole || 'Entry-Level Professional'}
                    </p>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
                    {extractedData.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{extractedData.phone}</span>
                      </div>
                    )}
                    {extractedData.email && (
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{extractedData.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Education */}
                {extractedData.school && (
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      <span>Education</span>
                    </p>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      {extractedData.course || 'Degree Program'}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {extractedData.school}{' '}
                      {extractedData.graduationYear ? `(${extractedData.graduationYear})` : ''}
                    </p>
                  </div>
                )}

                {/* Skills tags */}
                {extractedData.skills && extractedData.skills.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Extracted Skills ({extractedData.skills.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {extractedData.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Work Experience Count */}
                {extractedData.experiences && extractedData.experiences.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      <span>Work Experience & Internships ({extractedData.experiences.length})</span>
                    </p>
                    <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-300">
                      {extractedData.experiences.map((exp: WorkExperienceItem, eIdx: number) => (
                        <li key={eIdx} className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {exp.role}
                          </span>
                          <span className="text-slate-400">@</span>
                          <span>{exp.company}</span>
                          {exp.period && <span className="text-slate-400">({exp.period})</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Projects Count */}
                {extractedData.projects && extractedData.projects.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <FolderGit2 className="w-3 h-3" />
                      <span>Projects & Research ({extractedData.projects.length})</span>
                    </p>
                    <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-300">
                      {extractedData.projects.map((proj: ProjectItem, pIdx: number) => (
                        <li key={pIdx} className="truncate">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {proj.title}
                          </span>
                          {proj.techStack && (
                            <span className="text-indigo-600 dark:text-indigo-400 text-[11px] ml-1.5">
                              [{proj.techStack.join(', ')}]
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bottom apply actions */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExtractedData(null)}
                >
                  Back
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleApply}
                  icon={<Check className="w-4 h-4" />}
                >
                  Apply to My Profile
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

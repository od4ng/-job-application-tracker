import React, { useState } from 'react';
import {
  X,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Cpu,
  Copy,
  Check,
  Printer,
  UploadCloud,
  Edit3,
  Sparkles,
  Save,
  Plus,
  Trash2,
} from 'lucide-react';
import { User, SkillCategory, WorkExperienceItem, ProjectItem } from '../../types';
import { Button } from '../common/Button';
import { useNotifications } from '../../context/NotificationContext';

interface ResumeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdateUser?: (updated: Partial<User>) => void;
  onOpenUploadModal?: () => void;
}

export const ResumeDetailsModal: React.FC<ResumeDetailsModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onOpenUploadModal,
}) => {
  const { addToast } = useNotifications();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Editable state
  const [bio, setBio] = useState(user.bio || '');
  const [preferredRole, setPreferredRole] = useState(user.preferredRole || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [location, setLocation] = useState(user.location || '');
  const [githubUrl, setGithubUrl] = useState(user.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(user.linkedinUrl || '');
  const [course, setCourse] = useState(user.course || '');
  const [school, setSchool] = useState(user.school || '');
  const [schoolLocation, setSchoolLocation] = useState(user.schoolLocation || '');
  const [graduationYear, setGraduationYear] = useState(String(user.graduationYear || ''));

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast(`${label} copied to clipboard!`, 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveEdits = () => {
    if (onUpdateUser) {
      onUpdateUser({
        bio,
        preferredRole,
        phone,
        location,
        githubUrl,
        linkedinUrl,
        course,
        school,
        schoolLocation,
        graduationYear,
      });
      addToast('Resume details updated successfully!', 'success');
    }
    setIsEditMode(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const skillCategories: SkillCategory[] = user.skillCategories || [
    {
      category: 'Web Development',
      skills: ['PHP', 'MySQL', 'JavaScript', 'HTML5', 'CSS3', 'Bootstrap'],
    },
    {
      category: 'IT Support & Systems',
      skills: [
        'Hardware Troubleshooting',
        'Software Installation',
        'Desktop Support',
        'Router & Wi-Fi Configuration',
        'LAN Cable Termination (RJ45)',
        'Network Troubleshooting',
        'TCP/IP Fundamentals',
      ],
    },
    {
      category: 'Developer & IT Tools',
      skills: ['Git', 'GitHub', 'XAMPP', 'phpMyAdmin', 'Chrome DevTools', 'Composer'],
    },
  ];

  const experiences: WorkExperienceItem[] = user.experiences || [
    {
      id: 'exp-1',
      role: 'IT Intern',
      company: 'Oriental Service Manpower Inc. (OSMI)',
      location: 'Kalaw, Manila, Philippines',
      period: '2026 (450 Internship Hours)',
      details: [
        'Contributed to the development and maintenance of a web-based HR system used for applicant processing and document compliance monitoring.',
        'Designed and implemented responsive forms, user dashboards, and backend database functionalities using PHP and MySQL.',
        'Improved document compliance tracking and applicant record processing efficiency across departments.',
        'Conducted systematic application testing, bug fixes, and continuous feature enhancements.',
        'Delivered hands-on IT support, hardware troubleshooting, software setup, and technical assistance to office staff.',
      ],
    },
    {
      id: 'exp-2',
      role: 'Freelance IT Support & Network Technician',
      company: 'Freelance / Self-Employed',
      location: 'Manila, Philippines',
      period: '2025 – Present',
      details: [
        'Installed and configured home internet and wireless network devices for residential users.',
        'Performed LAN cable termination and crimping using RJ45 straight-through wiring standards.',
        'Configured routers through web-based administration interfaces, including Wi-Fi setup, password management, and user account configuration.',
        'Diagnosed and resolved internet connectivity, network access, and device connection issues.',
        'Assisted users with network troubleshooting, hardware setup, and basic technical support.',
        'Provided recommendations to improve network performance, wireless coverage, and security settings.',
      ],
    },
  ];

  const projects: ProjectItem[] = user.projects || [
    {
      id: 'proj-1',
      title: 'OSMI Applicant & Document Monitoring System',
      subtitle: 'Student Research Project / Oriental Service Manpower Inc.',
      description:
        'A centralized web application designed to improve applicant management, document monitoring, and recruitment workflow efficiency for Oriental Service Manpower Inc. (OSMI).',
      techStack: ['PHP', 'MySQL', 'JavaScript', 'HTML5', 'CSS3', 'Bootstrap', 'phpMyAdmin'],
      highlights: [
        'Developed responsive forms, applicant management modules, and document monitoring features using PHP, JavaScript, HTML5, CSS3, and Bootstrap.',
        'Built administrative monitoring dashboards and structured relational database tables in MySQL using phpMyAdmin.',
        'Enhanced data validation and processing workflows, reducing manual paperwork management time.',
      ],
    },
    {
      id: 'proj-2',
      title: 'Whiteland Express Logistics Website',
      subtitle: 'Student Research Project',
      description:
        'A multi-page website developed as part of a student research project related to the logistics and transportation industry.',
      techStack: ['HTML5', 'CSS3', 'JavaScript', 'Responsive UI'],
      highlights: [
        'Developed as an academic project focused on logistics and transportation services.',
        'Implemented navigation structures and page components optimized for usability and accessibility.',
        'Created front-end page layouts, responsive UI structures, and cross-browser compatible CSS styling.',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header & Quick Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              CV
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Candidate Resume & Credentials
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                View your complete profile, technical skills, experience, and education
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenUploadModal && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenUploadModal();
                }}
                className="hidden sm:inline-flex text-xs"
                icon={<UploadCloud className="w-3.5 h-3.5" />}
              >
                Upload / Replace
              </Button>
            )}

            <button
              onClick={handlePrint}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Print Resume"
              aria-label="Print resume"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Candidate Card Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 dark:from-slate-800/80 dark:via-slate-900 dark:to-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-800 shadow-xs shrink-0">
                  <UserIcon className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {user.name}
                  </h1>
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={preferredRole}
                        onChange={(e) => setPreferredRole(e.target.value)}
                        className="px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs w-full"
                        placeholder="Target Role / Headline"
                      />
                    ) : (
                      user.preferredRole || 'Job Applicant'
                    )}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {user.school} ({user.graduationYear}) • {user.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isEditMode ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveEdits}
                    icon={<Save className="w-3.5 h-3.5" />}
                  >
                    Save Changes
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditMode(true)}
                    icon={<Edit3 className="w-3.5 h-3.5" />}
                  >
                    Quick Edit
                  </Button>
                )}
              </div>
            </div>

            {/* Contact Pills */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/70 dark:border-slate-800/80 text-xs">
              {user.email && (
                <button
                  type="button"
                  onClick={() => handleCopy(user.email, 'email', 'Email address')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{user.email}</span>
                  {copiedKey === 'email' ? (
                    <Check className="w-3 h-3 text-emerald-500 ml-1" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-400 ml-1 opacity-60" />
                  )}
                </button>
              )}

              {user.phone && (
                <button
                  type="button"
                  onClick={() => handleCopy(user.phone || '', 'phone', 'Phone number')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{user.phone}</span>
                  {copiedKey === 'phone' ? (
                    <Check className="w-3 h-3 text-emerald-500 ml-1" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-400 ml-1 opacity-60" />
                  )}
                </button>
              )}

              {user.location && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{user.location}</span>
                </div>
              )}

              {user.githubUrl && (
                <a
                  href={user.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}

              {user.linkedinUrl && (
                <a
                  href={user.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5 text-blue-500" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>

          {/* Section: Professional Summary */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Professional Summary
              </h3>
              <button
                type="button"
                onClick={() => handleCopy(user.bio || bio, 'bio', 'Summary')}
                className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 inline-flex items-center gap-1"
              >
                {copiedKey === 'bio' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>Copy Summary</span>
              </button>
            </div>
            {isEditMode ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            ) : (
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {user.bio ||
                  'Passionate professional with hands-on technical skills and proven problem-solving abilities, ready to contribute to high-impact projects.'}
              </p>
            )}
          </div>

          {/* Section: Technical Skills */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Technical Skills & Competencies
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {skillCategories.map((cat) => (
                <div
                  key={cat.category}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 space-y-2"
                >
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {cat.category}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300 shadow-2xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Work Experience */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Work Experience & Internships ({experiences.length})
              </h3>
            </div>

            <div className="space-y-4">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {exp.role}
                      </h4>
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {exp.company}
                      </p>
                    </div>
                    <div className="text-right text-[11px] text-slate-500 dark:text-slate-400">
                      <div>{exp.period}</div>
                      <div>{exp.location}</div>
                    </div>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {exp.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-indigo-500 dark:text-indigo-400 font-bold shrink-0 mt-0.5">
                          •
                        </span>
                        <span className="leading-relaxed">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Projects & Academic Research */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Projects & Research ({projects.length})
              </h3>
            </div>

            <div className="space-y-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 space-y-2.5"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {proj.title}
                    </h4>
                    {proj.subtitle && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {proj.subtitle}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {proj.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[10px] font-semibold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    {proj.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-cyan-500 font-bold shrink-0 mt-0.5">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Education */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Education
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {user.course || 'Bachelor of Science in Information Technology'}
                </h4>
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {user.school || 'Systems Plus Computer College'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {user.schoolLocation || 'Caloocan City, Philippines'}
                </p>
              </div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 sm:text-right">
                Class of {user.graduationYear || '2026'}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Stored locally in your browser
          </span>
          <Button variant="primary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

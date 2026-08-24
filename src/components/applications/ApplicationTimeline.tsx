import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Calendar,
  FileText,
  Plus,
  Send,
} from 'lucide-react';
import { TimelineEvent } from '../../types';
import { formatDateTime } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../context/AuthContext';
import { useApplications } from '../../context/ApplicationContext';

interface ApplicationTimelineProps {
  applicationId: string;
  timeline: TimelineEvent[];
}

export const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({
  applicationId,
  timeline,
}) => {
  const { user } = useAuth();
  const { refreshApplications } = useApplications();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim() || !user) return;

    applicationService.addTimelineEvent({
      applicationId,
      userId: user.id,
      title: 'Note Logged',
      description: noteContent.trim(),
      date: new Date().toISOString(),
      type: 'note_added',
    });

    setNoteContent('');
    setIsAddingNote(false);
    refreshApplications();
  };

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'created':
        return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      case 'status_change':
        return <Clock className="w-4 h-4 text-indigo-500" />;
      case 'interview_scheduled':
        return <Calendar className="w-4 h-4 text-emerald-500" />;
      case 'assessment_scheduled':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'note_added':
        return <FileText className="w-4 h-4 text-amber-500" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Custom Note Action */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Activity Trail ({timeline.length})
        </h4>
        <button
          onClick={() => setIsAddingNote(!isAddingNote)}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Activity Note</span>
        </button>
      </div>

      {/* Note Input Box */}
      {isAddingNote && (
        <form
          onSubmit={handleAddNote}
          className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 animate-in fade-in duration-150"
        >
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="e.g., HR mentioned they will send assessment results by Friday..."
            rows={2}
            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingNote(false)}
              className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!noteContent.trim()}
              className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-medium flex items-center gap-1"
            >
              <Send className="w-3 h-3" />
              <span>Log Note</span>
            </button>
          </div>
        </form>
      )}

      {/* Timeline List */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {timeline.length === 0 ? (
          <div className="text-xs text-slate-400 py-4">No activity history recorded yet.</div>
        ) : (
          timeline.map((event) => (
            <div key={event.id} className="relative group">
              {/* Node Bullet */}
              <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xs">
                {getEventIcon(event.type)}
              </div>

              {/* Event Content */}
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{event.title}</span>
                    {event.newStatus && (
                      <StatusBadge status={event.newStatus} size="sm" showDot={false} />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                    {formatDateTime(event.date)}
                  </span>
                </div>

                {event.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/70 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/80">
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

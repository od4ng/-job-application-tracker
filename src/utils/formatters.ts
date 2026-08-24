export function formatDate(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateShort(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function getRelativeTime(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

export function getDaysRemaining(targetDateString?: string): {
  days: number;
  label: string;
  isOverdue: boolean;
  isToday: boolean;
} {
  if (!targetDateString) {
    return { days: 0, label: 'No date', isOverdue: false, isToday: false };
  }
  const target = new Date(targetDateString);
  target.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { days: 0, label: 'Today', isOverdue: false, isToday: true };
  } else if (diffDays === 1) {
    return { days: 1, label: 'Tomorrow', isOverdue: false, isToday: false };
  } else if (diffDays > 1) {
    return { days: diffDays, label: `In ${diffDays} days`, isOverdue: false, isToday: false };
  } else {
    const overdueDays = Math.abs(diffDays);
    return {
      days: diffDays,
      label: `${overdueDays} ${overdueDays === 1 ? 'day' : 'days'} overdue`,
      isOverdue: true,
      isToday: false,
    };
  }
}

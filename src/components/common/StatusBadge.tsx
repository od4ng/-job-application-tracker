import React from 'react';
import { ApplicationStatus } from '../../types';
import { STATUS_CONFIG } from '../../utils/constants';

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true,
}) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Applied;

  const sizeClass =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs'
      : 'px-2.5 py-1 text-xs sm:text-sm font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClass} ${config.bgLight} ${config.textLight} ${config.borderLight} ${config.bgDark} ${config.textDark} ${config.borderDark} whitespace-nowrap`}
    >
      {showDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${config.dotColor} animate-pulse`}
        />
      )}
      <span>{config.label}</span>
    </span>
  );
};

// ─── Notification Domain Type ──────────────────────────────────────────────────

export type NotificationType = 'warranty' | 'maintenance' | 'assignment' | 'department' | 'system';

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  isUnread: boolean;
  type: NotificationType;
  badgeBg: string;
  iconColor: string;
}

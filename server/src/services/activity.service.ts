import { ActivityLog, type ActivityKind } from '../models/ActivityLog';

/** Best-effort audit trail: a logging problem must never fail the change itself. */
export async function logActivity(text: string, kind: ActivityKind, actor = 'System') {
  try {
    await ActivityLog.create({ text, kind, actor });
  } catch (error) {
    console.error('[activity] could not write log entry:', error instanceof Error ? error.message : error);
  }
}

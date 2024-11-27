import dayjs from 'dayjs';

export function getTimeAgoUtil(dateStr: string | Date | null): string {
  if (!dateStr) return 'Not Connected Yet';

  const date = dayjs(dateStr);
  if (!date.isValid()) return 'Invalid Date';

  return date.fromNow();
}

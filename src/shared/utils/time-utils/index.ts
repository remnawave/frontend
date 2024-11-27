import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(duration);

export * from './get-time-ago/get-time-ago.util';
export * from './get-expiration-text/get-expiration-text.util';
export * from './get-connection-status-color/get-connection-status-color.util';

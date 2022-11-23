import { language, timeZone } from '../config';

export const toDate = (dateStr, dateStyle = 'short', timeStyle = 'medium') => {
  return new Date(dateStr).toLocaleString(language, {
    dateStyle,
    timeStyle,
    timeZone,
  });
};

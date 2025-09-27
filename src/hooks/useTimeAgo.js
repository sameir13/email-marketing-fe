import { format } from 'timeago.js';

export function useTimeAgo(date) {
  var formatedDate = new Date(date).toDateString();
  return format(formatedDate, 'en_US');
}

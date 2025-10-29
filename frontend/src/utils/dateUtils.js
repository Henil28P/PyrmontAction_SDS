
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString([], {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function timeRange(start, end) {
    const startTime = new Date(start).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    const endTime = new Date(end).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    return startTime + ' - ' + endTime;
};

export function validTimes(startTime, endTime) {
    return new Date('1970-01-01T' + startTime) < new Date('1970-01-01T' + endTime);
}

export function getLocalOffset() {
  const offsetInMinutes = new Date().getTimezoneOffset();
  const sign = offsetInMinutes > 0 ? '-' : '+';
  const hours = String(Math.abs(Math.floor(offsetInMinutes / 60))).padStart(2, '0');
  const minutes = String(Math.abs(offsetInMinutes % 60)).padStart(2, '0');
  return `${sign}${hours}:${minutes}`;
}

//combine date and time for local time
export function dateTimeStr(date, time) {
    const offset = getLocalOffset();
    console.log('Local Offset:', offset);
    return `${date}T${time}:00${offset}`;
}

export function getLocalDate(date) { // date in ISO format
    const localDate = new Date(date);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function getLocalTime(date) { // date in ISO format
    const localDate = new Date(date);
    const hours = String(localDate.getHours()).padStart(2, '0');
    const minutes = String(localDate.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

export function today() {
    const today = new Date().toISOString();
    console.log('Today in ISO:', getLocalDate(today));
    return getLocalDate(today);
}
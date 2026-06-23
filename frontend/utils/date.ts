type DateTimeParts = {
  year: string;
  month: string;
  day: string;
  hours: string;
  minutes: string;
  seconds: string;
};

const DATE_TIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?/;

function getDateTimeParts(value: string): DateTimeParts | null {
  const match = value.match(DATE_TIME_PATTERN);
  if (!match) {
    return null;
  }

  const [, year, month, day, hours, minutes, seconds = '00'] = match;

  return {
    year,
    month,
    day,
    hours,
    minutes,
    seconds,
  };
}

export function toDateTimeLocal(value: string) {
  const parts = getDateTimeParts(value);
  if (parts) {
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hours}:${parts.minutes}`;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function formatSqlDate(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  const hours = String(value.getHours()).padStart(2, '0');
  const minutes = String(value.getMinutes()).padStart(2, '0');
  const seconds = String(value.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function toSqlDateTime(value: string) {
  if (!value) {
    return '';
  }

  const parts = getDateTimeParts(value);
  if (parts) {
    return `${parts.year}-${parts.month}-${parts.day} ${parts.hours}:${parts.minutes}:${parts.seconds}`;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return formatSqlDate(date);
}

export function compareDateTimeValues(left: string, right: string) {
  const leftValue = toSqlDateTime(left);
  const rightValue = toSqlDateTime(right);

  if (leftValue && rightValue) {
    return leftValue.localeCompare(rightValue);
  }

  return new Date(left).getTime() - new Date(right).getTime();
}

export function formatTrainDateTime(value: string) {
  const parts = getDateTimeParts(value);
  if (parts) {
    return `${parts.day}/${parts.month}/${parts.year}, ${parts.hours}:${parts.minutes}:${parts.seconds}`;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
}

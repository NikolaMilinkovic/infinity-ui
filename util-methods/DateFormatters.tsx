export function getFormattedDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(/\//g, '.');;
}

/**
 * @param separator - String value that separates the date, like '-' or '.' | Defaults to '.'
 * @returns - Current date in DD.MM.YYYY
 */
export function getCurrentDate(separator:string = '.'): string {
  return new Date().toLocaleDateString("en-UK").replace(/\//g, separator);
}

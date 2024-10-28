export function getFormattedDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(/\//g, '.');;
}

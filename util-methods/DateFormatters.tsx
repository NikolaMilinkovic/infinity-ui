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

export const createdAtIntoDateFormatter = (date: Date) => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const d = new Date(date); // Ensure the input is a Date object
  const day = String(d.getDate()).padStart(2, '0'); // Get day, ensure two digits
  const month = months[d.getMonth()]; // Get month name from the array
  const year = d.getFullYear(); // Get year

  return `${day}.${month}.${year}`;
};

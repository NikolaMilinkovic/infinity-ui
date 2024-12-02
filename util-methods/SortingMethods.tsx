export function sortByProperty(array: any[], property:string) {
  return array.sort((a, b) => {
    const propA = a[property]?.toLowerCase(); // Ensure case-insensitive comparison
    const propB = b[property]?.toLowerCase();
    if (propA < propB) return -1; // Sort `a` before `b`
    if (propA > propB) return 1;  // Sort `b` before `a`
    return 0;
  });
}
export function updateNestedValue<T extends object>(obj: T, path: string, value: any): T {
  const keys = path.split('.');
  const updated = { ...obj };
  let current: any = updated;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] = { ...current[key] };
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
  return updated;
}

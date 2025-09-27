export function setAllPermissionsToValue(obj: any, value: any): any {
  const newObj: any = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      newObj[key] = setAllPermissionsToValue(obj[key], value);
    } else if (typeof obj[key] === 'boolean') {
      newObj[key] = value;
    } else {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

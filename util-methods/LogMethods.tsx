export function betterConsoleLog(message: string, log: any) {
  if (log instanceof Map) {
    console.log(message, JSON.stringify(Object.fromEntries(log), null, 2));
  } else {
    console.log(message, JSON.stringify(log, null, 2));
  }
}
export function betterErrorLog(message: string, log: any) {
  console.error(message, JSON.stringify(log, null, 2));
  console.error(log);
}

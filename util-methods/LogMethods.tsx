export function betterConsoleLog(message, log){
  console.log(message, JSON.stringify(log, null, 2));
}
export function betterErrorLog(message, log){
  console.error(message, JSON.stringify(log, null, 2));
  console.error(log)
}


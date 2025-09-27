import { createContext, ReactNode, useState } from 'react';

interface StartupLogsType {
  text: string;
  success: boolean;
}

interface LogContextType {
  startupLogs: { [key: string]: StartupLogsType };
  add_new_startup_log: (name: string, log_object: StartupLogsType) => void;
  update_startup_log: (name: string, log_object: StartupLogsType) => void;
}

export const LogContext = createContext<LogContextType>({
  startupLogs: {},
  add_new_startup_log: () => {},
  update_startup_log: () => {},
});

interface LogContextProviderType {
  children: ReactNode;
}
function LogContextProvider({ children }: LogContextProviderType) {
  const [startupLogs, setStartupLogs] = useState<{ [key: string]: StartupLogsType }>({});

  // Add new log
  function add_new_startup_log(name: string, log_object: StartupLogsType) {
    setStartupLogs((prev) => ({ ...prev, [name]: log_object }));
  }
  // Update log
  function update_startup_log(name: string, log_object: StartupLogsType) {
    setStartupLogs((prev) => ({ ...prev, [name]: log_object }));
  }

  const value: LogContextType = {
    startupLogs,
    add_new_startup_log,
    update_startup_log,
  };

  return <LogContext.Provider value={value}>{children}</LogContext.Provider>;
}

export default LogContextProvider;

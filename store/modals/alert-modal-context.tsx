import React, { createContext, ReactNode, useContext, useState } from 'react';
import AlertModal from '../../components/modals/AlertModal';

interface AlertModalContextType {
  showAlert: (message: string) => void;
}

const AlertModalContext = createContext<AlertModalContextType | undefined>(undefined);

export function useAlertModal() {
  const context = useContext(AlertModalContext);
  if (!context) {
    throw new Error('useAlertModal must be used within AlertModalProvider');
  }
  return context;
}

export const AlertModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');

  const showAlert = (msg: string) => {
    setMessage(msg);
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
    setMessage('');
  };

  return (
    <AlertModalContext.Provider value={{ showAlert }}>
      {children}
      <AlertModal isVisible={isVisible} message={message} onClose={hideModal} />
    </AlertModalContext.Provider>
  );
};

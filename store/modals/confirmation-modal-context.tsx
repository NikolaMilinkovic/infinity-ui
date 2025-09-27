import React, { createContext, ReactNode, useContext, useState } from 'react';
import ConfirmationModal from '../../components/modals/ConfirmationModal';

type ConfirmCallback = () => void | Promise<void>;
type CancelCallback = () => void | Promise<void>;

interface ConfirmationModalContextType {
  showConfirmation: (callback: ConfirmCallback, message?: string, cancelCallback?: CancelCallback) => void;
}

const ConfirmationModalContext = createContext<ConfirmationModalContextType | undefined>(undefined);

export function useConfirmationModal() {
  const context = useContext(ConfirmationModalContext);
  if (!context) throw new Error('useConfirmation must be used within ConfirmationModalProvider');
  return context;
}

export const ConfirmationModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [onConfirm, setOnConfirm] = useState<ConfirmCallback | null>(null);
  const [onCancel, setOnCancel] = useState<CancelCallback | null>(null);
  const [message, setMessage] = useState<string | undefined>();

  const showConfirmation = (callback: ConfirmCallback, msg?: string, cancelCallback?: CancelCallback) => {
    setOnConfirm(() => callback);
    setOnCancel(() => cancelCallback || null);
    setMessage(msg);
    setIsModalVisible(true);
  };

  const cancelAction = async () => {
    if (onCancel) await onCancel();
    hideModal();
  };

  const hideModal = () => {
    setIsModalVisible(false);
    setOnConfirm(null);
    setOnCancel(null);
    setMessage(undefined);
  };

  const confirmAction = async () => {
    if (onConfirm) await onConfirm();
    hideModal();
  };

  return (
    <ConfirmationModalContext.Provider value={{ showConfirmation }}>
      {children}
      <ConfirmationModal
        isVisible={isModalVisible}
        onConfirm={confirmAction}
        onCancel={cancelAction}
        message={message || ''}
      />
    </ConfirmationModalContext.Provider>
  );
};

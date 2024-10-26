import { useState } from 'react';

function useConfirmationModal() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [onConfirm, setOnConfirm] = useState(null);

  const showModal = (confirmCallback) => {
    setOnConfirm(() => confirmCallback);
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
    setOnConfirm(null);
  };

  const confirmAction = async () => {
    if (onConfirm) await onConfirm();
    hideModal();
  };

  return { isModalVisible, showModal, hideModal, confirmAction };
}

export default useConfirmationModal;

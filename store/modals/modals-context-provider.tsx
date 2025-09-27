import { AlertModalProvider } from './alert-modal-context';
import { ConfirmationModalProvider } from './confirmation-modal-context';
import { DrawerModalProvider } from './drawer-modal-contex';
// import { ConfirmationModalProvider } from './confirmation-modal-context';
// import { DrawerModalProvider } from './drawer-modal-contex';
// import { EditProductModalProvider } from './edit-product-modal-context';
// import { ImagePreviewModalProvider } from './image-preview-modal-context';

export const ModalsContextProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <DrawerModalProvider>
      <AlertModalProvider>
        <ConfirmationModalProvider>{children}</ConfirmationModalProvider>
      </AlertModalProvider>
    </DrawerModalProvider>
  );
};

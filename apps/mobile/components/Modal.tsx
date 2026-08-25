import React from "react";
import ReactNativeModal, { ModalProps } from "react-native-modal";

export type { ModalProps };

// React 19 type compatibility adapter for react-native-modal
export const Modal = ReactNativeModal as unknown as React.ComponentType<
  Partial<ModalProps> & {
    isVisible: boolean;
    children?: React.ReactNode;
  }
>;

export default Modal;

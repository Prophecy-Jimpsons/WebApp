declare module "@anyalt/widget" {
  import React from "react";

  export const WidgetProvider: React.FC<{
    children: React.ReactNode;
    theme: any;
  }>;

  export const defaultTheme: any;

  export enum ChainType {
    EVM = "EVM",
    SOLANA = "SOLANA",
    // Add other chain types as needed
  }

  export const useModal: () => {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  };

  export const AnyaltWidget: React.FC<any>;

  // Add other exports as needed
}

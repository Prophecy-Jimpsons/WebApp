import { AnyaltWidget, ChainType, useModal } from "@anyalt/widget";
import "@rainbow-me/rainbowkit/styles.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { forwardRef, useImperativeHandle } from "react";

// Define the ref type for the Widget component
export interface WidgetRef {
  openWidget: () => void;
}

interface WidgetProps {
  tokenAddress: string;
}

const Widget = forwardRef<WidgetRef, WidgetProps>(({ tokenAddress }, ref) => {
  // useModal hook provides control over the widget's modal state
  const { isOpen, onOpen, onClose } = useModal();

  // Expose the openWidget method to parent components
  useImperativeHandle(ref, () => ({
    openWidget: onOpen,
  }));

  // Define a callback to estimate transaction details before execution
  const estimateCallback = async (params: any) => {
    console.log("Estimate params:", params);
    console.log("Token address:", tokenAddress);
    return {
      success: true,
      amountOut: "100",
      priceInUSD: "1.00",
      data: {
        estimatedAmount: "100",
        fees: "0.01",
        totalCost: params.amount,
      },
    };
  };

  // Define a callback to execute the last-mile transaction
  const executeCallBack = async (params: any) => {
    console.log("Execute params:", params);
    return {
      success: true,
      amountOut: "100",
      data: {
        txHash: "0x1234567890abcdef",
        amount: "100",
        token: "JIMP",
      },
    };
  };

  return (
    <AnyaltWidget
      inputToken={{
        symbol: "USDT",
        address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
        chainId: 42161,
        name: "USDT",
        chainType: ChainType.EVM,
        logoUrl: "https://example.com/static/logo-only.svg",
      }}
      apiKey="pk_a96c68b5d6cc63b0bb431761a41dacd8eea00617e3089c57" // Your API key
      widgetTemplate="TOKEN_BUY"
      isOpen={isOpen}
      onClose={onClose}
      estimateCallback={estimateCallback}
      executeCallBack={executeCallBack}
      minDepositAmount={0.01}
    />
  );
});

Widget.displayName = "AnyaltWidget";

export default Widget;

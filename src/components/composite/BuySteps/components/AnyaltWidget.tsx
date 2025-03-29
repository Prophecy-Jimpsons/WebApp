import { AnyaltWidget, ChainType, useModal } from "@anyalt/widget";
import { forwardRef, useImperativeHandle } from "react";

import { useGetJimpPriceUSD } from "@/hooks/useJimpPrice";
import "@rainbow-me/rainbowkit/styles.css";
import "@solana/wallet-adapter-react-ui/styles.css";

import { jimpTokenLogo } from "@/assets/images/Logo";

// Define the ref type for the Widget component

interface Token {
  name: string;
  symbol: string;
  address: string;
  chainId?: number;
  decimals?: number;
  amount?: string;
  chainType: ChainType;
  logoUrl?: string;
}

interface EstimateResponse {
  amountOut: string;
  priceInUSD: string;
  estimatedTimeInSeconds?: number;
  estimatedFeeInUSD?: string;
}

interface ExecuteResponse {
  approvalTxHash?: string;
  executeTxHash?: string;
  amountOut: string;
}
export interface WidgetRef {
  openWidget: () => void;
}

const jimpToken: Token = {
  name: "Prophecy Jimpsons",
  symbol: "JIMP",
  address: "D86WEcSeM4YkQKqP6LLLt8bRypbJnaQcPUxHAVsopump",
  chainType: ChainType.SOLANA,
  logoUrl:
    jimpTokenLogo ||
    "https://dd.dexscreener.com/ds-data/tokens/solana/D86WEcSeM4YkQKqP6LLLt8bRypbJnaQcPUxHAVsopump.png?size=lg&key=a7a59d",
};

const Widget = forwardRef<WidgetRef, {}>((_, ref) => {
  // useModal hook provides control over the widget's modal state
  const { isOpen, onOpen, onClose } = useModal();
  const { jimpPriceUSD } = useGetJimpPriceUSD();
  const isTokenBuyTemplate = true;

  const estimateCallback = async (token: Token): Promise<EstimateResponse> => {
    if (!jimpPriceUSD) throw new Error("Price data not available");

    const amount = parseFloat(token.amount || "0");
    return {
      amountOut: amount.toFixed(2),
      priceInUSD: (jimpPriceUSD * parseFloat(token.amount ?? "0")).toFixed(4),
    };
  };

  const executeCallBack = async (token: Token): Promise<ExecuteResponse> => {
    console.log({ token });
    return {
      // executeTxHash: txHash,
      amountOut: token.amount ?? "0",
    };
  };

  // Expose the openWidget method to parent components
  useImperativeHandle(ref, () => ({
    openWidget: onOpen,
  }));

  return (
    <AnyaltWidget
      swapResultToken={jimpToken}
      isTokenBuyTemplate={isTokenBuyTemplate}
      apiKey="pk_a96c68b5d6cc63b0bb431761a41dacd8eea00617e3089c57" // needs to be placed in .env file
      widgetTemplate="TOKEN_BUY"
      isOpen={isOpen}
      onClose={onClose}
      estimateCallback={estimateCallback}
      executeCallBack={executeCallBack}
      minDepositAmount={0}
    />
  );
});

Widget.displayName = "AnyaltWidget";

export default Widget;

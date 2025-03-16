import { forwardRef, useImperativeHandle } from "react";
import { AnyaltWidget, ChainType, useModal } from "@anyalt/widget";

import "@rainbow-me/rainbowkit/styles.css";
import "@solana/wallet-adapter-react-ui/styles.css";

// Define the ref type for the Widget component

export interface Token {
  name: string;
  symbol: string;
  address: string;
  chainId?: number;
  decimals?: number;
  amount?: string;
  chainType: ChainType;
  logoUrl?: string;
}

export interface EstimateResponse {
  amountOut: string;
  priceInUSD: string;
  estimatedTimeInSeconds?: number;
  estimatedFeeInUSD?: string;
}

export interface ExecuteResponse {
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
    "https://dd.dexscreener.com/ds-data/tokens/solana/D86WEcSeM4YkQKqP6LLLt8bRypbJnaQcPUxHAVsopump.png?size=lg&key=a7a59d",
};

const Widget = forwardRef<WidgetRef, {}>((_, ref) => {
  // useModal hook provides control over the widget's modal state
  const { isOpen, onOpen, onClose } = useModal();
  const isTokenBuyTemplate = true;

  const estimateCallback = async (token: Token): Promise<EstimateResponse> => {
    try {
      // Fetch real-time prices for the JIMP
      const jimpResponse = await fetch(
        "https://api.geckoterminal.com/api/v2/networks/solana/tokens/D86WEcSeM4YkQKqP6LLLt8bRypbJnaQcPUxHAVsopump",
      );

      // const inputPriceData = await inputPriceResponse.json();
      const jimpJson = await jimpResponse.json();
      const jimpPriceUSD = jimpJson?.data?.attributes?.price_usd || 0;

      if (!jimpPriceUSD) {
        throw new Error("Failed to fetch token prices.");
      }

      // Calculate the estimated output amount in JIMP tokens
      return {
        amountOut: parseFloat(token.amount ?? "0").toFixed(2),
        priceInUSD: (jimpPriceUSD * parseFloat(token.amount ?? "0")).toFixed(4),
      };
    } catch (error) {
      console.error("Error in estimateCallback:", error);
      return {
        amountOut: "0.00",
        priceInUSD: "0.00",
      };
    }
  };

  const executeCallBack = async (token: Token): Promise<ExecuteResponse> => {
    return {
      // executeTxHash: txHash,
      amountOut: token.amount ?? "0.00",
    };
  };

  // Expose the openWidget method to parent components
  useImperativeHandle(ref, () => ({
    openWidget: onOpen,
  }));

  return (
    <AnyaltWidget
      inputToken={jimpToken}
      isTokenBuyTemplate={isTokenBuyTemplate}
      apiKey="pk_a96c68b5d6cc63b0bb431761a41dacd8eea00617e3089c57"
      widgetTemplate="TOKEN_BUY"
      isOpen={isOpen}
      onClose={onClose}
      estimateCallback={estimateCallback}
      executeCallBack={executeCallBack}
      minDepositAmount={0} // Minimum deposit amount in selected input token
    />
  );
});

Widget.displayName = "AnyaltWidget";

export default Widget;

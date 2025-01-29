import {
  LAMPORTS_PER_SOL,
  ParsedTransactionWithMeta,
  PublicKey,
  VersionedTransactionResponse,
} from "@solana/web3.js";

import {
  useGetATA,
  useGetBalance,
  useGetTokenInfo,
  useGetTxs,
} from "@/hooks/useAccount";
import styles from "./AccountUI.module.css";

import { AccountTransactions } from "./AccountTransactions";
import { OverviewCard } from "./OverviewCard";
import TierLevel from "./TierLevel";

export function AccountDetail({ address }: { address: PublicKey }) {
  const { data: solBalance, isLoading: solLoading } = useGetBalance({
    address,
  });

  const convertedSolBalance = solBalance
    ? (Math.round((solBalance / LAMPORTS_PER_SOL) * 100000) / 100000).toFixed(5)
    : 0;
  const { data: tokenInfo, isLoading: tokenInfoLoading } = useGetTokenInfo({
    address,
  });

  const {
    mint = "",
    owner = "",
    tokenAmount: { uiAmount = 0 } = {},
    state = "",
  } = tokenInfo?.value?.[0]?.account?.data?.parsed?.info ?? {};

  const { data: ata, isLoading: ataLoading } = useGetATA(mint, address);

  const {
    data: txs,
    isLoading: txsLoading,
    refetch,
    isError: txsError,
  } = useGetTxs({
    ata: ata ?? "",
  });

  const filteredTxs = txs?.filter(
    (tx): tx is VersionedTransactionResponse => tx !== null,
  ) as ParsedTransactionWithMeta[] | undefined;

  const isLoading = solLoading || tokenInfoLoading || txsLoading || ataLoading;

  return (
    <div className={styles.titleSection}>
      <h1 className={styles.mainTitle}>ACCOUNT DETAILS</h1>
      <div className={styles.detailsSection}>
        <OverviewCard
          token={ata ?? ""}
          solBalance={convertedSolBalance}
          jimpBalance={uiAmount.toFixed(5)}
          owner={owner}
          mint={mint}
          state={state}
          isLoading={isLoading}
        />
        <TierLevel
          address={address}
          transactions={filteredTxs ?? []}
          jimpBalance={uiAmount}
          isLoading={isLoading}
        />
        <AccountTransactions
          isLoading={isLoading}
          transactions={filteredTxs ?? []}
          refetch={refetch}
          isError={txsError}
        />
      </div>
    </div>
  );
}

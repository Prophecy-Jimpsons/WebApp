'use client'

import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { IconRefresh } from '@tabler/icons-react'
import { useMemo, useState } from 'react'
import { useGetBalance, useGetTokenAccounts, useGetSignatures } from './AccountDataAccess'
import styles from './AccountUI.module.css'

const JIMP_TOKEN_MINT = '8x1VMnPCSFn2TJGCTu96KufcLbbZq6XCK1XqpYH5pump'

export function AccountBalance({ address }: { address: PublicKey }) {
  const solQuery = useGetBalance({ address })
  const tokenQuery = useGetTokenAccounts({ address })
  
  const jimpBalance = useMemo(() => {
    return tokenQuery.data?.find(
      item => item.account.data.parsed.info.mint === JIMP_TOKEN_MINT
    )?.account.data.parsed.info.tokenAmount.uiAmount ?? 0
  }, [tokenQuery.data])

  return (
    <div className={styles.balanceSection}>
      <div className={styles.balanceItem}>
        <h2 className={styles.balanceLabel}>SOL Balance</h2>
        <h1 className={styles.balanceTitle} onClick={() => solQuery.refetch()}>
          {solQuery.isLoading ? (
            <span className={styles.loadingState}>Loading...</span>
          ) : (
            <>{solQuery.data ? <BalanceSol balance={solQuery.data} /> : '0'} SOL</>
          )}
        </h1>
      </div>
      <div className={styles.balanceItem}>
        <h2 className={styles.balanceLabel}>JIMP Balance</h2>
        <h1 className={styles.balanceTitle}>
          {tokenQuery.isLoading ? (
            <span className={styles.loadingState}>Loading...</span>
          ) : (
            <>{jimpBalance} JIMP</>
          )}
        </h1>
      </div>
    </div>
  )
}

export function AccountTransactions({ address }: { address: PublicKey }) {
  const query = useGetSignatures({ address })
  const [showAll, setShowAll] = useState(false)

  const items = useMemo(() => {
    if (!query.data) return []
    return query.data
      .slice(0, showAll ? undefined : 5)
      .map(item => ({
        signature: item.signature,
        slot: item.slot,
        time: new Date((item.blockTime ?? 0) * 1000).toLocaleString(),
        status: item.err ? 'Failed' : 'Success'
      }))
  }, [query.data, showAll])

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Transaction History</h2>
        <div className="space-x-2">
          {query.isLoading ? (
            <div className={styles.loadingState}>Loading...</div>
          ) : (
            <button className={styles.refreshButton} onClick={() => query.refetch()}>
              <IconRefresh size={16} />
            </button>
          )}
        </div>
      </div>

      {query.isError ? (
        <div className={styles.errorState}>
          Error: {(query.error as Error)?.message || 'An error occurred'}
        </div>
      ) : items.length === 0 ? (
        <div className={styles.emptyState}>No transactions found</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Signature</th>
              <th>Slot</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.signature}>
                <td className="font-mono">
                  {item.signature.slice(0, 8)}...
                </td>
                <td>{item.slot}</td>
                <td>{item.time}</td>
                <td className={item.status === 'Success' ? styles.statusSuccess : styles.statusFailed}>
                  {item.status}
                </td>
              </tr>
            ))}
            {query.data && query.data.length > 5 && (
              <tr>
                <td colSpan={4} className="text-center">
                  <button 
                    className={styles.refreshButton} 
                    onClick={() => setShowAll(!showAll)}
                  >
                    {showAll ? 'Show Less' : 'Show All'}
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}


function BalanceSol({ balance }: { balance: number }) {
  return <span>{Math.round((balance / LAMPORTS_PER_SOL) * 100000) / 100000}</span>
}

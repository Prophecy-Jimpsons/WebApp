// src/components/wallet/wallet-provider.tsx
'use client'

import { WalletError } from '@solana/wallet-adapter-base'
import {
  ConnectionProvider,
  WalletProvider as BaseWalletProvider
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  LedgerWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { ReactNode, useCallback, useMemo } from 'react'

import '@solana/wallet-adapter-react-ui/styles.css'


interface Props {
  children: ReactNode
}

const MAINNET_ENDPOINT = "https://api.mainnet-beta.solana.com"

export function SolanaWalletProvider({ children }: Props) {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    []
  )

  const onError = useCallback((error: WalletError) => {
    console.error('Wallet error:', error)
  }, [])

  return (
    <ConnectionProvider endpoint={MAINNET_ENDPOINT}>
      <BaseWalletProvider 
        wallets={wallets} 
        onError={onError} 
        autoConnect={true}
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </BaseWalletProvider>
    </ConnectionProvider>
  )
}

import { Suspense, lazy } from 'react'

const WalletMultiButton = lazy(() => 
  import('@solana/wallet-adapter-react-ui').then(module => ({
    default: module.WalletMultiButton
  }))
)

export function ConnectWalletButton() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WalletMultiButton />
    </Suspense>
  )
}

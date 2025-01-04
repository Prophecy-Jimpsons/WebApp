'use client'

import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';

// Use Alchemy endpoint for better reliability
const connection = new Connection("https://solana-mainnet.g.alchemy.com/v2/Q9hG9amWf8wxM9S8od2WfcsqF9TvhIn1", 'confirmed')

export function useGetBalance({ address }: { address: PublicKey }) {
  return useQuery({
    queryKey: ['get-balance', address.toString()],
    queryFn: async () => {
      try {

        return await connection.getBalance(address)
      } catch (error) {
        console.error('Error fetching balance:', error)
        throw error
      }
    },
    enabled: !!address,
    refetchInterval: 10000
  })
}

export function useGetTokenAccounts({ address }: { address: PublicKey }) {
  return useQuery({
    queryKey: ['get-token-accounts', address.toString()],
    queryFn: async () => {
      try {
        const [tokenAccounts, token2022Accounts] = await Promise.all([
          connection.getParsedTokenAccountsByOwner(address, {
            programId: TOKEN_PROGRAM_ID,
          }),
          connection.getParsedTokenAccountsByOwner(address, {
            programId: TOKEN_2022_PROGRAM_ID,
          }),
        ])
        return [...tokenAccounts.value, ...token2022Accounts.value]
      } catch (error) {
        console.error('Error fetching token accounts:', error)
        throw error
      }
    },
    enabled: !!address,
    refetchInterval: 10000
  })
}

export function useGetSignatures({ address }: { address: PublicKey }) {
  return useQuery({
    queryKey: ['get-signatures', address.toString()],
    queryFn: async () => {
      try {
        return await connection.getSignaturesForAddress(address)
      } catch (error) {
        console.error('Error fetching signatures:', error)
        throw error
      }
    },
    enabled: !!address,
    refetchInterval: 10000
  })
}
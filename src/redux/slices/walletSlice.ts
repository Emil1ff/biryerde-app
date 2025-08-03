import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Wallet, Transaction } from "../../Types/data"

interface WalletState {
  wallet: Wallet | null
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
}

const initialState: WalletState = {
  wallet: { balance: 0, currency: "$" }, // Default wallet balance
  transactions: [],
  isLoading: false,
  error: null,
}

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    fetchWalletStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchWalletSuccess: (state, action: PayloadAction<{ wallet: Wallet; transactions: Transaction[] }>) => {
      state.isLoading = false
      state.wallet = action.payload.wallet
      state.transactions = action.payload.transactions
    },
    fetchWalletFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    addMoney: (state, action: PayloadAction<number>) => {
      if (state.wallet) {
        state.wallet.balance += action.payload
        state.transactions.unshift({
          id: `txn-${Date.now()}`,
          type: "income",
          amount: action.payload,
          description: "Money added to wallet",
          date: new Date().toISOString().split("T")[0],
        })
      }
    },
    deductMoney: (state, action: PayloadAction<number>) => {
      if (state.wallet) {
        state.wallet.balance -= action.payload
        state.transactions.unshift({
          id: `txn-${Date.now()}`,
          type: "expense",
          amount: action.payload,
          description: "Payment for service",
          date: new Date().toISOString().split("T")[0],
        })
      }
    },
  },
})

export const { fetchWalletStart, fetchWalletSuccess, fetchWalletFailure, addMoney, deductMoney } = walletSlice.actions
export default walletSlice.reducer

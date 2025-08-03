import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { Transaction } from "../../Types/data"

interface TransactionState {
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
}

const initialState: TransactionState = {
  transactions: [],
  isLoading: false,
  error: null,
}

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    fetchTransactionsStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchTransactionsSuccess: (state, action: PayloadAction<Transaction[]>) => {
      state.isLoading = false
      state.transactions = action.payload
    },
    fetchTransactionsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload) // Add new transaction to the beginning
    },
  },
})

export const { fetchTransactionsStart, fetchTransactionsSuccess, fetchTransactionsFailure, addTransaction } =
  transactionSlice.actions
export default transactionSlice.reducer

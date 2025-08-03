import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { PaymentMethod } from "../../Types/data"

interface PaymentMethodState {
  paymentMethods: PaymentMethod[]
  isLoading: boolean
  error: string | null
}

const initialState: PaymentMethodState = {
  paymentMethods: [],
  isLoading: false,
  error: null,
}

const paymentMethodSlice = createSlice({
  name: "paymentMethods",
  initialState,
  reducers: {
    fetchPaymentMethodsStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchPaymentMethodsSuccess: (state, action: PayloadAction<PaymentMethod[]>) => {
      state.isLoading = false
      state.paymentMethods = action.payload
    },
    fetchPaymentMethodsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    addPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      state.paymentMethods.push(action.payload)
    },
    removePaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethods = state.paymentMethods.filter((method) => method.id !== action.payload)
    },
    setDefaultPaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethods = state.paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === action.payload,
      }))
    },
  },
})

export const {
  fetchPaymentMethodsStart,
  fetchPaymentMethodsSuccess,
  fetchPaymentMethodsFailure,
  addPaymentMethod,
  removePaymentMethod,
  setDefaultPaymentMethod,
} = paymentMethodSlice.actions
export default paymentMethodSlice.reducer

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ServiceCategory } from "../../Types/data"

interface ServiceState {
  categories: ServiceCategory[]
  // popularServices: PopularService[]
  // specialOffers: OfferItem[]
  isLoading: boolean
  error: string | null
}

const initialState: ServiceState = {
  categories: [],
  // popularServices: [],
  // specialOffers: [],
  isLoading: false,
  error: null,
}

const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    fetchServicesStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchServicesSuccess: (
      state,
      action: PayloadAction<{
        categories: ServiceCategory[]
        // popularServices: PopularService[]
        // specialOffers: OfferItem[]
      }>,
    ) => {
      state.isLoading = false
      state.categories = action.payload.categories
      // state.popularServices = action.payload.popularServices
      // state.specialOffers = action.payload.specialOffers
    },
    fetchServicesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
})

export const { fetchServicesStart, fetchServicesSuccess, fetchServicesFailure } = serviceSlice.actions
export default serviceSlice.reducer

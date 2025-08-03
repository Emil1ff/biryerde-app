import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { Booking, LatLng } from "../../Types/data"

interface BookingState {
  bookings: Booking[]
  isLoading: boolean
  error: string | null
  currentBookingAddress: {
    address: string
    details: string
    coords: LatLng
  } | null
}

const initialState: BookingState = {
  bookings: [],
  isLoading: false,
  error: null,
  currentBookingAddress: null,
}

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    fetchBookingsStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchBookingsSuccess: (state, action: PayloadAction<Booking[]>) => {
      state.isLoading = false
      state.bookings = action.payload
    },
    fetchBookingsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.bookings.push(action.payload)
    },
    updateBooking: (state, action: PayloadAction<Booking>) => {
      const index = state.bookings.findIndex((b) => b.id === action.payload.id)
      if (index !== -1) {
        state.bookings[index] = action.payload
      }
    },
    cancelBooking: (state, action: PayloadAction<string>) => {
      const index = state.bookings.findIndex((b) => b.id === action.payload)
      if (index !== -1) {
        state.bookings[index].status = "cancelled" // Update status to cancelled
      }
    },
    updateBookingAddress: (state, action: PayloadAction<{ address: string; details: string; coords: LatLng }>) => {
      state.currentBookingAddress = action.payload
    },
  },
})

export const {
  fetchBookingsStart,
  fetchBookingsSuccess,
  fetchBookingsFailure,
  addBooking,
  updateBooking,
  cancelBooking,
  updateBookingAddress,
} = bookingSlice.actions
export default bookingSlice.reducer

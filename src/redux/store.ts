import { configureStore } from "@reduxjs/toolkit"
import rootReducer from "./rootReducer"
import bookingReducer from './slices/bookingSlice'
import serviceReducer from './slices/serviceSlice'

export const store = configureStore({
  reducer: {
    ...rootReducer, 
    booking: bookingReducer,
    services: serviceReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

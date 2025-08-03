import { combineReducers } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import bookingReducer from "./slices/bookingSlice"
import profileReducer from "./slices/profileSlice"
import serviceReducer from "./slices/serviceSlice"
import walletReducer from "./slices/walletSlice" 
import transactionReducer from "./slices/transactionSlice" 
import paymentMethodReducer from "./slices/paymentMethodSlice" 

const rootReducer = combineReducers({
  auth: authReducer,
  booking: bookingReducer,
  profile: profileReducer,
  services: serviceReducer,
  wallet: walletReducer,
  transactions: transactionReducer,
  paymentMethods: paymentMethodReducer,
})

export default rootReducer

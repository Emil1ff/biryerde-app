import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "../../Types/data"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  token: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.isAuthenticated = true
      state.token = action.payload.token
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.token = null
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
  },
})

export const { loginSuccess, logout, updateUserProfile } = authSlice.actions
export default authSlice.reducer

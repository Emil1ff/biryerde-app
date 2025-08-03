import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { UserProfile } from "../../Types/data"

interface ProfileState {
  userProfile: UserProfile | null
  isLoading: boolean
  error: string | null
}

const initialState: ProfileState = {
  userProfile: null,
  isLoading: false,
  error: null,
}

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    fetchProfileStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchProfileSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.isLoading = false
      state.userProfile = action.payload
    },
    fetchProfileFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.userProfile) {
        state.userProfile = { ...state.userProfile, ...action.payload }
      }
    },
  },
})

export const { fetchProfileStart, fetchProfileSuccess, fetchProfileFailure, updateProfile } = profileSlice.actions
export default profileSlice.reducer

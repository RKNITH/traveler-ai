import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import toast from 'react-hot-toast'

const user = JSON.parse(localStorage.getItem('user'))
const token = localStorage.getItem('token')

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', data)
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed')
  }
})

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', data)
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/me')
    localStorage.setItem('user', JSON.stringify(res.data.user))
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to get user')
  }
})

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put('/auth/profile', data)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Update failed')
  }
})

export const toggleWishlist = createAsyncThunk('auth/toggleWishlist', async (packageId, { rejectWithValue }) => {
  try {
    const res = await api.post(`/auth/wishlist/${packageId}`)
    const updated = JSON.parse(localStorage.getItem('user'))
    updated.wishlist = res.data.wishlist
    localStorage.setItem('user', JSON.stringify(updated))
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: user || null,
    token: token || null,
    isAuthenticated: !!token,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      toast.success('Logged out successfully')
    },
    clearError: (state) => { state.error = null },
    updateUserLocal: (state, action) => {
      state.user = { ...state.user, ...action.payload }
    }
  },
  extraReducers: (builder) => {
    const handlePending = (state) => { state.loading = true; state.error = null }
    const handleRejected = (state, action) => {
      state.loading = false
      state.error = action.payload
      toast.error(action.payload)
    }

    builder
      .addCase(register.pending, handlePending)
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        toast.success(action.payload.message || 'Welcome!')
      })
      .addCase(register.rejected, handleRejected)

      .addCase(login.pending, handlePending)
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        toast.success(action.payload.message || 'Welcome back!')
      })
      .addCase(login.rejected, handleRejected)

      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(getMe.rejected, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      })

      .addCase(updateProfile.pending, handlePending)
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        toast.success('Profile updated!')
      })
      .addCase(updateProfile.rejected, handleRejected)

      .addCase(toggleWishlist.fulfilled, (state, action) => {
        if (state.user) state.user.wishlist = action.payload.wishlist
        toast.success(action.payload.message)
      })
  }
})

export const { logout, clearError, updateUserLocal } = authSlice.actions
export default authSlice.reducer

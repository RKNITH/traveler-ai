import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchPackages = createAsyncThunk('packages/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/packages', { params })
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const fetchFeaturedPackages = createAsyncThunk('packages/featured', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/packages/featured')
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const fetchPopularPackages = createAsyncThunk('packages/popular', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/packages/popular')
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const fetchPackage = createAsyncThunk('packages/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/packages/${id}`)
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const createPackage = createAsyncThunk('packages/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/packages', data)
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const updatePackage = createAsyncThunk('packages/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/packages/${id}`, data)
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const deletePackage = createAsyncThunk('packages/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/packages/${id}`)
    return id
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

const packageSlice = createSlice({
  name: 'packages',
  initialState: {
    packages: [], featured: [], popular: [], current: null,
    loading: false, error: null, total: 0, pages: 1, currentPage: 1,
    filters: { category: '', minPrice: '', maxPrice: '', duration: '', search: '', sort: '-createdAt' }
  },
  reducers: {
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload } },
    clearFilters: (state) => { state.filters = { category: '', minPrice: '', maxPrice: '', duration: '', search: '', sort: '-createdAt' } },
    clearCurrent: (state) => { state.current = null }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackages.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.loading = false
        state.packages = action.payload.packages
        state.total = action.payload.total
        state.pages = action.payload.pages
        state.currentPage = action.payload.currentPage
      })
      .addCase(fetchPackages.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchFeaturedPackages.fulfilled, (state, action) => { state.featured = action.payload.packages })
      .addCase(fetchPopularPackages.fulfilled, (state, action) => { state.popular = action.payload.packages })
      .addCase(fetchPackage.pending, (state) => { state.loading = true })
      .addCase(fetchPackage.fulfilled, (state, action) => { state.loading = false; state.current = action.payload.package })
      .addCase(fetchPackage.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(createPackage.fulfilled, (state, action) => { state.packages.unshift(action.payload.package) })
      .addCase(updatePackage.fulfilled, (state, action) => {
        const idx = state.packages.findIndex(p => p._id === action.payload.package._id)
        if (idx !== -1) state.packages[idx] = action.payload.package
        if (state.current?._id === action.payload.package._id) state.current = action.payload.package
      })
      .addCase(deletePackage.fulfilled, (state, action) => {
        state.packages = state.packages.filter(p => p._id !== action.payload)
      })
  }
})

export const { setFilters, clearFilters, clearCurrent: clearCurrentPackage } = packageSlice.actions
export default packageSlice.reducer

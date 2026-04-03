// destinationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchDestinations = createAsyncThunk('destinations/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/destinations', { params })
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const createDestination = createAsyncThunk('destinations/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/destinations', data)
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const updateDestination = createAsyncThunk('destinations/update', async ({ id, ...data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/destinations/${id}`, data)
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const deleteDestination = createAsyncThunk('destinations/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/destinations/${id}`)
    return id
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const fetchFeaturedDestinations = createAsyncThunk('destinations/featured', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/destinations/featured')
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const fetchDestination = createAsyncThunk('destinations/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/destinations/${id}`)
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

const destinationSlice = createSlice({
  name: 'destinations',
  initialState: {
    destinations: [], featured: [], current: null,
    loading: false, error: null, total: 0, pages: 1, currentPage: 1
  },
  reducers: { clearCurrent: (state) => { state.current = null } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDestinations.pending, (state) => { state.loading = true })
      .addCase(fetchDestinations.fulfilled, (state, action) => {
        state.loading = false
        state.destinations = action.payload.destinations
        state.total = action.payload.total
        state.pages = action.payload.pages
        state.currentPage = action.payload.currentPage
      })
      .addCase(fetchDestinations.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchFeaturedDestinations.fulfilled, (state, action) => { state.featured = action.payload.destinations })
      .addCase(fetchDestination.pending, (state) => { state.loading = true })
      .addCase(fetchDestination.fulfilled, (state, action) => { state.loading = false; state.current = action.payload.destination })
      .addCase(fetchDestination.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(createDestination.fulfilled, (state, action) => { state.destinations.unshift(action.payload.destination) })
      .addCase(updateDestination.fulfilled, (state, action) => {
        const idx = state.destinations.findIndex(d => d._id === action.payload.destination._id)
        if (idx !== -1) state.destinations[idx] = action.payload.destination
      })
      .addCase(deleteDestination.fulfilled, (state, action) => {
        state.destinations = state.destinations.filter(d => d._id !== action.payload)
      })
  }
})

export const { clearCurrent: clearCurrentDestination } = destinationSlice.actions
export default destinationSlice.reducer

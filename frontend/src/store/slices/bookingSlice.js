import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import toast from 'react-hot-toast'

// =================== BOOKING SLICE ===================
export const createBooking = createAsyncThunk('bookings/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/bookings', data)
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const fetchUserBookings = createAsyncThunk('bookings/fetchUser', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/bookings/my', { params })
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const fetchBooking = createAsyncThunk('bookings/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/bookings/${id}`)
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const cancelBooking = createAsyncThunk('bookings/cancel', async ({ id, reason }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/bookings/${id}/cancel`, { reason })
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [], current: null, loading: false, error: null,
    total: 0, pages: 1,
    bookingData: { package: null, travelers: [], travelDates: {}, pricing: {} }
  },
  reducers: {
    setBookingData: (state, action) => { state.bookingData = { ...state.bookingData, ...action.payload } },
    clearBookingData: (state) => { state.bookingData = { package: null, travelers: [], travelDates: {}, pricing: {} } },
    clearCurrent: (state) => { state.current = null }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => { state.loading = true })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false
        state.current = action.payload.booking
        toast.success(action.payload.message)
      })
      .addCase(createBooking.rejected, (state, action) => { state.loading = false; toast.error(action.payload) })
      .addCase(fetchUserBookings.pending, (state) => { state.loading = true })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false; state.bookings = action.payload.bookings
        state.total = action.payload.total; state.pages = action.payload.pages
      })
      .addCase(fetchUserBookings.rejected, (state) => { state.loading = false })
      .addCase(fetchBooking.fulfilled, (state, action) => { state.current = action.payload.booking })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const idx = state.bookings.findIndex(b => b._id === action.payload.booking._id)
        if (idx !== -1) state.bookings[idx] = action.payload.booking
        toast.success(action.payload.message)
      })
      .addCase(cancelBooking.rejected, (state, action) => { toast.error(action.payload) })
  }
})

export const { setBookingData, clearBookingData, clearCurrent: clearCurrentBooking } = bookingSlice.actions
export const bookingReducer = bookingSlice.reducer

// =================== AI SLICE ===================
export const sendAIMessage = createAsyncThunk('ai/sendMessage', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/ai/chat', data)
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const generateAIItinerary = createAsyncThunk('ai/generateItinerary', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/ai/generate-itinerary', data)
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const fetchAIHistory = createAsyncThunk('ai/fetchHistory', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/ai/history')
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const fetchUserItineraries = createAsyncThunk('ai/fetchItineraries', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/ai/itineraries')
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

const aiSlice = createSlice({
  name: 'ai',
  initialState: {
    messages: [], sessionId: null, history: [], itineraries: [],
    currentItinerary: null, loading: false, generating: false, error: null,
    context: { destination: '', days: 5, budget: 50000, groupSize: 2, groupType: 'couple', preferences: [], season: '' }
  },
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({ role: 'user', content: action.payload, timestamp: new Date().toISOString() })
    },
    setContext: (state, action) => { state.context = { ...state.context, ...action.payload } },
    clearMessages: (state) => { state.messages = []; state.sessionId = null },
    setCurrentItinerary: (state, action) => { state.currentItinerary = action.payload }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendAIMessage.pending, (state) => { state.loading = true })
      .addCase(sendAIMessage.fulfilled, (state, action) => {
        state.loading = false
        state.sessionId = action.payload.sessionId
        state.messages.push({ role: 'model', content: action.payload.message, timestamp: new Date().toISOString() })
      })
      .addCase(sendAIMessage.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(generateAIItinerary.pending, (state) => { state.generating = true })
      .addCase(generateAIItinerary.fulfilled, (state, action) => {
        state.generating = false
        state.currentItinerary = action.payload.itinerary
        state.itineraries.unshift(action.payload.itinerary)
        toast.success('Itinerary generated successfully!')
      })
      .addCase(generateAIItinerary.rejected, (state, action) => { state.generating = false; toast.error(action.payload) })
      .addCase(fetchAIHistory.fulfilled, (state, action) => { state.history = action.payload.sessions })
      .addCase(fetchUserItineraries.fulfilled, (state, action) => { state.itineraries = action.payload.itineraries })
  }
})

export const { addUserMessage, setContext, clearMessages, setCurrentItinerary } = aiSlice.actions
export const aiReducer = aiSlice.reducer

// =================== ADMIN SLICE ===================
export const fetchDashboardStats = createAsyncThunk('admin/dashboardStats', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/admin/dashboard')
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const fetchAllUsers = createAsyncThunk('admin/users', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/admin/users', { params })
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const fetchAllBookings = createAsyncThunk('admin/bookings', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/bookings', { params })
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const updateBookingStatus = createAsyncThunk('admin/updateBookingStatus', async ({ id, status, notes }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/bookings/${id}/status`, { status, notes })
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: null, users: [], bookings: [], loading: false, error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => { state.loading = true })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => { state.loading = false; state.stats = action.payload })
      .addCase(fetchDashboardStats.rejected, (state) => { state.loading = false })
      .addCase(fetchAllUsers.fulfilled, (state, action) => { state.users = action.payload.users })
      .addCase(fetchAllBookings.fulfilled, (state, action) => { state.bookings = action.payload.bookings })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const idx = state.bookings.findIndex(b => b._id === action.payload.booking._id)
        if (idx !== -1) state.bookings[idx] = action.payload.booking
        toast.success('Booking status updated')
      })
  }
})

export const adminReducer = adminSlice.reducer

// =================== UI SLICE ===================
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode: localStorage.getItem('darkMode') === 'true',
    mobileMenuOpen: false,
    searchOpen: false,
    activeModal: null,
    notifications: []
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
      localStorage.setItem('darkMode', state.darkMode)
      document.documentElement.classList.toggle('dark', state.darkMode)
    },
    toggleMobileMenu: (state) => { state.mobileMenuOpen = !state.mobileMenuOpen },
    closeMobileMenu: (state) => { state.mobileMenuOpen = false },
    setActiveModal: (state, action) => { state.activeModal = action.payload },
    closeModal: (state) => { state.activeModal = null },
    addNotification: (state, action) => { state.notifications.unshift(action.payload) },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    }
  }
})

export const { toggleDarkMode, toggleMobileMenu, closeMobileMenu, setActiveModal, closeModal, addNotification, removeNotification } = uiSlice.actions
export const uiReducer = uiSlice.reducer

import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import destinationReducer from './slices/destinationSlice'
import packageReducer from './slices/packageSlice'
import { bookingReducer, aiReducer, adminReducer, uiReducer } from './slices/bookingSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    destinations: destinationReducer,
    packages: packageReducer,
    bookings: bookingReducer,
    ai: aiReducer,
    admin: adminReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})

export default store

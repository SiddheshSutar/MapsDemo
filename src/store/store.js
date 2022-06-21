import { configureStore } from '@reduxjs/toolkit'
import stateReducer from '../store/state'

export default configureStore({
  reducer: {
    state: stateReducer
  },
})
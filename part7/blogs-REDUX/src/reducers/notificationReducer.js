
import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'message',
  initialState: { text: null },
  reducers: {
    setMessage(state, action) {
      return action.payload
    }
  }
})

export const { setMessage } = notificationSlice.actions

export const initializeMessage = (text, type='info') => {
  return dispatch => {
    dispatch(setMessage({ text, type }))
    setTimeout(() => {
      dispatch(setMessage({ text: null }))
    }, 5000)
  }
}

export default notificationSlice.reducer







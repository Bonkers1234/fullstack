
import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        setMessage(state, action) {
            return action.payload 
        },
        resetMessage() {
            return null
        }
    }
})


export const { setMessage, resetMessage, voteMessage } = notificationSlice.actions

export const setNotification = (text, time) => {
    return async dispatch => {
        dispatch(setMessage(text))
        setTimeout(() => {
            dispatch(resetMessage())
        }, time * 1000);
    }
}

export default notificationSlice.reducer











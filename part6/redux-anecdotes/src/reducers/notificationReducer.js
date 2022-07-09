import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotification(state, action) {
            state = action.payload
            return state
        },
        removeNotification(state) {
            state = ''
            return state
        },
    }
})

export const { setNotification, removeNotification } = notificationSlice.actions

export const displayNotification = (notification, displayTime) => {
    return async dispatch => {
        dispatch(setNotification(notification))
        setTimeout(() => dispatch(removeNotification()), displayTime * 1000)
    }
}

export default notificationSlice.reducer
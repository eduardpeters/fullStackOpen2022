import { createSlice } from '@reduxjs/toolkit'

const initialState = ['', 0]

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotification(state, action) {
            state[0] = action.payload[0]
            state[1] = action.payload[1]
            return state
        },
        removeNotification(state) {
            state[0] = ''
            return state
        },
        cancelRemoval(state) {
            clearTimeout(state[1])
            state[1] = 0
            return state
        }
    }
})

export const { setNotification, removeNotification, cancelRemoval } = notificationSlice.actions

export const displayNotification = (notification, displayTime) => {
    return async dispatch => {
        dispatch(cancelRemoval())
        const TimeoutId = setTimeout(() => dispatch(removeNotification()), displayTime * 1000)
        dispatch(setNotification([notification, TimeoutId]))
    }
}

export default notificationSlice.reducer
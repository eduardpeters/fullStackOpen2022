import { createSlice } from '@reduxjs/toolkit'

const anecdoteSlice = createSlice({
    name: 'anecdotes',
    initialState: [],
    reducers: {
        createAnecdote(state, action) {
            state.push(action.payload)
        },
        setAnecdotes(state, action) {
            return action.payload
        },
        voteFor(state, action) {
            const id = action.payload
            const anecdoteToChange = state.find(a => a.id === id)
            const changedAnecdote = {
                ...anecdoteToChange,
                votes: anecdoteToChange.votes + 1
            }
            return state
                .map(anecdote => anecdote.id !== id ? anecdote : changedAnecdote)
                .sort((a, b) => b.votes - a.votes)
        }
    }
})

export const { createAnecdote, setAnecdotes, voteFor } = anecdoteSlice.actions
export default anecdoteSlice.reducer
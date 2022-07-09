import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
    name: 'anecdotes',
    initialState: [],
    reducers: {
        appendAnecdote(state, action) {
            state.push(action.payload)
        },
        setAnecdotes(state, action) {
            return action.payload
        },
        voteFor(state, action) {
            const changedAnecdote = action.payload
            return state
                .map(anecdote => anecdote.id !== changedAnecdote.id ? anecdote : changedAnecdote)
                .sort((a, b) => b.votes - a.votes)
        }
    }
})

export const { appendAnecdote, setAnecdotes, voteFor } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
    return async dispatch => {
        const anecdotes = await anecdoteService.getAll()
        dispatch(setAnecdotes(anecdotes))
    }
}

export const createAnecdote = content => {
    return async dispatch => {
        const newAnecdote = await anecdoteService.createNew(content)
        dispatch(appendAnecdote(newAnecdote))
    }
}

export const changeVotes = anecdote => {
    return async dispatch => {
        const changedAnecdote = await anecdoteService.changeVotes(anecdote)
        dispatch(voteFor(changedAnecdote))
    }
}

export default anecdoteSlice.reducer
import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { displayNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const addAnecdote = async (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        dispatch(createAnecdote(content))
        dispatch(displayNotification(`you created ${content}`, 3))
    }

    return (
        <form onSubmit={addAnecdote}>
            <div><input name='anecdote' /></div>
            <button type='submit'>create</button>
        </form>
    )
}

export default AnecdoteForm
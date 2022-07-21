import { connect } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { displayNotification } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {
    const addAnecdote = async (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        props.createAnecdote(content)
        props.displayNotification(`you created ${content}`, 3)
    }

    return (
        <form onSubmit={addAnecdote}>
            <div><input name='anecdote' /></div>
            <button type='submit'>create</button>
        </form>
    )
}

const mapDispatchToProps = {
    createAnecdote,
    displayNotification,
}

const ConnectedAnecdoteForm = connect(
    null,
    mapDispatchToProps
    )(AnecdoteForm)

export default ConnectedAnecdoteForm
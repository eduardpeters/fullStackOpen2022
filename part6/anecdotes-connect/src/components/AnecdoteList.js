import { useSelector, useDispatch } from 'react-redux'
import { changeVotes } from '../reducers/anecdoteReducer'
import { displayNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
    return (
        <div>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={handleClick}>vote</button>
            </div>
        </div>
    )
}

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector(state => state.filter)
    const anecdotesToShow = anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
    const dispatch = useDispatch()
    return (
        <div>
            {anecdotesToShow.map(anecdote =>
                    <Anecdote
                        key={anecdote.id}
                        anecdote={anecdote}
                        handleClick={() => {
                            dispatch(changeVotes(anecdote))
                            dispatch(displayNotification(`you voted ${anecdote.content}`, 3))
                        }}
                    />
                )
            }
        </div>
    )
}

export default AnecdoteList
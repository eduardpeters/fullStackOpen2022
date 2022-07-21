import AnecdoteList from './components/AnecdoteList'
import ConnectedAnecdoteForm from './components/AnecdoteForm'
import ConnectedNotification from './components/Notification'
import ConnectedFilter from './components/Filter'
import { initializeAnecdotes } from './reducers/anecdoteReducer'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'

const App = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(initializeAnecdotes())
    }, [dispatch])

    return (
        <div>
        <h2>Anecdotes</h2>
        <ConnectedNotification />
        <ConnectedFilter />
        <AnecdoteList />
        <h2>create new</h2>
        <ConnectedAnecdoteForm />
        </div>
    )
}

export default App
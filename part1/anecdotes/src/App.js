import { useState } from 'react'

const Header = ({ header }) => <div><h1>{header}</h1></div>

const Button = ({ onClick, text }) => {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const DisplayVotes = ({ votes }) => {
  return (
    <div>
      has {votes} votes
    </div>
  )
}

const getRandomInt = (max) => Math.floor(Math.random() * max)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(7).fill(0))
  const [mostVoted, setMostVoted] = useState(0)

  const handleNext = () => {
    setSelected(getRandomInt(7))
  }

  const findMostVoted = (copy) => {
    let currentMax = 0
    let indexOfMax = 0
    for (let i = 0; i < copy.length; i++) {
      if (copy[i] > currentMax) {
        currentMax = copy[i]
        indexOfMax = i
      }
    }
    return (indexOfMax)
  }

  const handleVote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
    setMostVoted(findMostVoted(copy))
  }

  return (
    <div>
      <Header header={'Anecdote of the day'} />
      {anecdotes[selected]}
      <DisplayVotes votes={votes[selected]} />
      <Button onClick={handleVote} text='vote' />
      <Button onClick={handleNext} text='next anecdote' />
      <Header header={'Anecdote with most votes'} />
      {anecdotes[mostVoted]}
      <DisplayVotes votes={votes[mostVoted]} />
    </div>
  )
}

export default App;

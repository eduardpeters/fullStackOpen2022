import { useState } from 'react'

const Header = ({ header }) => <div><h1>{header}</h1></div>

const Button = ({ onClick, text }) => {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const Statistics = ({ good, neutral, bad, allClicks }) => {
  if (allClicks === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  // calculate further statistics
  const average = (good * 1 + neutral * 0 + bad * -1)/allClicks
  const positive = good/allClicks * 100
  return (
    <div>
      <table>
        <tbody>
          <StatisticLine text='good' statistic={good} />
          <StatisticLine text='neutral' statistic={neutral} />
          <StatisticLine text='bad' statistic={bad} />
          <StatisticLine text='all' statistic={allClicks} />
          <StatisticLine text='average' statistic={average} />
          <StatisticPercent text='positive' statistic={positive} />
        </tbody>
      </table>
    </div>
  )
}

const StatisticLine = ({ text , statistic }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{statistic}</td>
    </tr>
  )
}

const StatisticPercent = ({ text , statistic }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{statistic}</td>
      <td>%</td>
    </tr>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [allClicks, setAll] = useState(0)

  // handle all three click events
  const handleGoodClick = () => {
    setGood(good + 1)
    setAll(allClicks + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
    setAll(allClicks + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
    setAll(allClicks + 1)
  }

  return (
    <div>
      <Header header='give feedback' />
      <Button onClick={handleGoodClick} text='good' />
      <Button onClick={handleNeutralClick} text='neutral' />
      <Button onClick={handleBadClick} text='bad' />
      <Header header='statistics' />
      <Statistics good={good} neutral={neutral} bad={bad} allClicks={allClicks} />
    </div>
  )
}

export default App;

import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Header = ({text}) => {
  return (
    <div>
      <h2>{text}</h2>
    </div>
  )
}

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>{text}</button>
)

const StatisticLine = ({text, value, unit}) => (
  <>
    <p>{text}: {value}{unit}</p>
  </>
)

const Statistics = ({good, neutral, bad}) => {
  const all = bad + neutral + good
  const avg = all/3
  const pos = 100*good/all

  if (all > 0) {
    return (
      <>
        <StatisticLine text='Good' value={good} />
        <StatisticLine text='Neutral' value={neutral} />
        <StatisticLine text='Bad' value={bad} />
        <StatisticLine text='All' value={all} />
        <StatisticLine text='Average' value={avg} />
        <StatisticLine text='Positive' value={pos} unit='%' />
      </>
    )
  } else {
    return (
      <><p>No feedback given</p></>
    )
  }
}

const StatisticRow = ({text, value, unit}) => (
  <>
    <tr><td>{text}</td><td>{value}{unit}</td></tr>
  </>
)

const StatsTable = ({good, neutral, bad}) => {
  const all = bad + neutral + good
  const avg = all/3
  const pos = 100*good/all

  if (all > 0) {
    return (
      <>
        <table>
          <tbody>
            <StatisticRow text='Good' value={good} />
            <StatisticRow text='Neutral' value={neutral} />
            <StatisticRow text='Bad' value={bad} />
            <StatisticRow text='All' value={all} />
            <StatisticRow text='Average' value={avg} />
            <StatisticRow text='Positive' value={pos} unit='%' />
          </tbody>
        </table>
      </>
    )
  } else {
    return (
      <><p>No feedback given</p></>
    )
  } 
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const incrementGood = () => setGood(good + 1)
  const incrementNeutral = () => setNeutral(neutral + 1)
  const incrementBad = () => setBad(bad + 1)

  return (
    <>
      <Header text="Give Feedback" />
      <Button handleClick={incrementGood} text="good" />
      <Button handleClick={incrementNeutral} text="neutral" />
      <Button handleClick={incrementBad} text="bad" />

      <Header text="Statistics:" />
      <Statistics good={good} neutral={neutral} bad={bad} />

      <Header text="Statistics table:" />
      <StatsTable good={good} neutral={neutral} bad={bad} />
    </>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)

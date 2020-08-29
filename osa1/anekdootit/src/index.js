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

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Array(props.anecdotes.length).fill(0))

  const selectRand = () => setSelected(Math.floor(Math.random()*props.anecdotes.length))
  const addPoints = () => {
    const copy = [...points]
    copy[selected] += 1
    setPoints(copy)
  }

  const argMax = (arr) => arr.indexOf(Math.max(...arr))

  return (
    <div>
      <Header text='Anecdote of the day' />
      <p>{props.anecdotes[selected]}</p>
      <p>has {points[selected]} votes</p>
      <Button handleClick={addPoints} text="vote" />
      <Button handleClick={selectRand} text="next anecdote" />

      <Header text='Anecdote with most votes' />
      <p>{props.anecdotes[argMax(points)]}</p>
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)
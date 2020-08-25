import React from 'react'
import ReactDOM from 'react-dom'

const Header = (props) => {
  return (
    <>
      <h1>{props.course}</h1>
    </>
  )
}

const Part = (props) => {
  return (
    <>
      <p>{props.part} {props.exercises}</p>
    </>
  )
}

const Content = (props) => {
  return (
    <>
      <Part part={props.parts[0]} exercises={props.exs[0]} />
      <Part part={props.parts[1]} exercises={props.exs[1]} />
      <Part part={props.parts[2]} exercises={props.exs[2]} />
    </>
  )
}

const Total = (props) => {
  const arrSum = arr => arr.reduce((a,b) => a + b, 0)
  return (
    <>
      <p>Number of exercises {arrSum(props.exs)}</p>
    </>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 16

  const parts = [part1, part2, part3]
  const exs = [exercises1, exercises2, exercises3]

  return (
    <>
      <Header course={course} />
      <Content parts={parts} exs={exs} />
      <Total exs={exs} />
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))

import React from 'react'

const Header = (props) => {
    return (
      <>
        <h2>{props.course.name}</h2>
      </>
    )
  }
  
  const Part = (props) => {
    return (
      <>
        <p>{props.part.name} {props.part.exercises}</p>
      </>
    )
  }
  
  const Content = (props) => {
    return (
      <>
        {
          props.course.parts.map(
            part => 
            <Part part={part} key={part.id} />
          )
        }
      </>
    )
  }
  
  const Total = (props) => {
    const arrSum = arr => arr.reduce((a,b) => a + b, 0)
    const nums = props.course.parts.map(p => p.exercises)
    return (
      <>
        <p><b>Total of {arrSum(nums)} exercises</b></p>
      </>
    )
  }
  
  const Course = ({course}) => (
    <>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </>
  )

  export default Course
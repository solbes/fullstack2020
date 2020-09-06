import React, { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({value, onChange}) => (
  <div>
    filter with: <input value={value} onChange={onChange} />
  </div>
)

const PersonForm = (props) => (
  <form onSubmit={props.onSubmit}>
    <div>
      name: <input value={props.newName} onChange={props.handleNameChange} />
    </div>
    <div>
      number: <input value={props.newNumber} onChange={props.handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({persons, filter, deleteName}) => (
    persons.filter(
      p => p.name.toLowerCase().includes(filter.toLowerCase())
    ).map(
      p => <p key={p.name}>{p.name} {p.number}  
        <button id={p.name} onClick={deleteName}>Delete</button>
      </p>
    )
)

const Notification = ({ message, style }) => {
  if (message === null) {
    return null
  }

  return (
    <div style={style}>
      {message}
    </div>
  )
}

const messageStyle = {
  fontSize: 16,
  background: 'lightgrey',
  borderStyle: 'solid',
  borderRadius: 5,
  padding: 10,
  marginTop: 10,
  marginBottom: 10
}

const App = () => {
  const [ persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilt, setNewFilt ] = useState('')
  const [ addMessage, setAddMessage] = useState(null)
  const [ delFailMessage, setDelFailMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setNewFilt(event.target.value)

  const addName = (event) => {
    event.preventDefault()
    const addedName = { name: newName, number: newNumber }

    if (persons.map(person => person.name).includes(newName)) {

      const id = persons.find(p => p.name === newName).id
      if (window.confirm(`${newName} is already added to phonebook, 
        replace the number with a new one?`)) {
          personService
            .update(id, addedName)
            .then(returnedPerson => {
              setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
            })
            .catch(error => {
              setDelFailMessage(
                `${addedName.name} was already removed from server`
              )
              setTimeout(() => {
                setDelFailMessage(null)
              }, 5000)
              setPersons(persons.filter(p => p.id !== id))
            })
        }
    } else {
      personService
        .create(addedName)
        .then(addedPerson => {
          setPersons(persons.concat(addedPerson))
          setNewName('')
          setNewNumber('')
          setAddMessage(`Added ${addedPerson.name} to database`)
          setTimeout(() => setAddMessage(null), 5000)
        })
    }
  }

  const deleteName = (event) => {
    const oldPerson = persons.find(person => person.name === event.target.id)
    if (window.confirm(`Delete ${oldPerson.name}?`)) {
      personService
        .remove(oldPerson)
        .then(() => setPersons(
          persons.filter(p => p.name !== oldPerson.name)
        ))
    }
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={newFilt} onChange={handleFilterChange} />
      <h3>Add new</h3>
      <PersonForm onSubmit={addName} 
                  newName={newName} 
                  handleNameChange={handleNameChange}
                  newNumber={newNumber}
                  handleNumberChange={handleNumberChange} />
      <Notification 
                  message={addMessage} 
                  style={{...messageStyle, color: 'green'}} />
      <h2>Numbers</h2>
      <Notification 
                  message={delFailMessage} 
                  style={{...messageStyle, color: 'red'}} />
      <Persons persons={persons} filter={newFilt} deleteName={deleteName} />
    </div>
  )

}

export default App
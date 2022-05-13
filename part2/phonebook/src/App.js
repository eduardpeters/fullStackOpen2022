import { useState, useEffect } from 'react'
import axios from 'axios'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import personServices from './services/persons'

const Notification = ({ message, success }) => {
  if (message === null) {
    return null
  }
  if (success) {
    return (
      <div className='success'>
        {message}
      </div>
    )
  }
  else {
    return (
      <div className='error'>
        {message}
      </div>
    )
  }
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [success, setSuccess] = useState(true)

  useEffect(() => {
    personServices
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  },[])
      
  console.log('render', persons.length, 'persons') 

  const addEntry = (event) => {
    event.preventDefault()
    
    // Determine if name is already in object array before adding & stop if needed
    const person = persons.find(p => p.name === newName)
    if (person) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one`)) {
        updateEntry(person)
      }
      return
    }

    const nameObject = {
      name: newName,
      number: newNumber,
    }

    personServices
      .create(nameObject)
      .then(returnedPersons => {
        setPersons(persons.concat(returnedPersons))
        setNewName('')
        setNewNumber('')
        setSuccess(true)
        setMessage(
          `Added ${newName}`
        )
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })
  }

  const updateEntry = person => {
    const changedPerson = { ...person, number: newNumber }
    personServices
      .update(person.id, changedPerson)
      .then(returnedPersons => {
        setPersons(persons.map(p => p.id !== person.id ? p : returnedPersons))
        setNewName('')
        setNewNumber('')
        setSuccess(true)
        setMessage(
          `Updated ${person.name}`
        )
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })
      .catch(error => {
        setSuccess(false)
        setMessage(
          `Information of ${person.name} has already been removed from server`
        )
        setTimeout(() => {
          setMessage(null)
        }, 3000)
        setPersons(persons.filter(p => p.id !== person.id))
      })
  }

  const deleteEntry = id => {
    const name = persons.filter(p => p.id === id)[0].name
    if (window.confirm(`Delete ${name} ?`)) {
      personServices
        .erase(id)
        .then(() => {
          setSuccess(true)
          setMessage(
            `Deleted ${name}`
          )
          setTimeout(() => {
            setMessage(null)
          }, 3000)
          setPersons(persons.filter(p => p.id !== id))
          })
        .catch(error => {
          setSuccess(false)
          setMessage(
            `Information of ${name} has already been removed from server`
          )
          setTimeout(() => {
            setMessage(null)
          }, 3000)
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }
  // Create a new array filtering for those names that include the string in filter
  // Use toLowerCase() to avoid case-sensitivity
  const entriesToShow = persons.filter(persons => persons.name.toLowerCase().includes(newFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} success={success} />
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm addEntry={addEntry} newName={newName} handleNameChange={handleNameChange} 
        newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons entries={entriesToShow} deleteEntry={deleteEntry} />
    </div>
  )
}

export default App

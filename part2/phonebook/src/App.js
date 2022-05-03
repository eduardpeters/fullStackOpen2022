import { useState } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 },
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

 const addEntry = (event) => {
    event.preventDefault()
    
    // Determine if name is already in object array before adding & stop if needed
    // Create an array with all the names
    const currentNames = persons.map(person => person.name)
    // Determine if said array contains newName, alert and return if so
    if (currentNames.includes(newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const nameObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    }
  
    setPersons(persons.concat(nameObject))
    setNewName('')
    setNewNumber('')
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
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm addEntry={addEntry} newName={newName} handleNameChange={handleNameChange} 
        newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons entries={entriesToShow} />
    </div>
  )
}

export default App

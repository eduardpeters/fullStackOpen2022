import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import ShowCountries from './components/ShowCountries'

const App = () => {
  const [newFilter, setNewFilter] = useState('')
  const [countries, setCountries] = useState([])

  const hook = () => {
    axios
    .get('https://restcountries.com/v3.1/all')
    .then(response => {
      setCountries(response.data)
    })
  }
  
  useEffect(hook,[])

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const handleShowButton = (country) => {
    setNewFilter(country)
  }

  const countriesToShow = countries.filter(countries => countries.name.common.toLowerCase().includes(newFilter.toLowerCase()))

  return (
    <div>
    <h1>Countries</h1>
    <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
    <ShowCountries countries={countriesToShow} handleShowButton={handleShowButton} />
    </div>
  );
}

export default App;

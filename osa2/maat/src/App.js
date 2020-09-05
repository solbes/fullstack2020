import React, { useState, useEffect } from 'react';
import axios from 'axios'
//import './App.css';

const Filter = ({value, onChange}) => (
  <div>
    Find countries: <input value={value} onChange={onChange} />
  </div>
)

const OneCountry = ({country}) => {

  const [ apiResponse, setApiResponse ] = useState({
    current: {
      temperature: '... loading from weatherstack ...'
    }
  })

  useEffect(() => {
    const params = {
      access_key: process.env.REACT_APP_WS_API_KEY,
      query: country.capital
    }
    axios
    .get('http://api.weatherstack.com/current', {params})
    .then(response => setApiResponse(response.data))
  }, [country])
  
  return (
    <div>
      <h2>{country.name}</h2>
      <p>Capital: {country.capital}</p>
      <p>Population: {country.population}</p>
      <h3>Languages</h3>
      <ul>
        {country.languages.map(
          lang => <li key={lang.name}>{lang.name}</li>
        )}
      </ul>
     <img src={country.flag} alt="flag" width={100}/>
        <p>Temperature: {apiResponse.current.temperature}</p>
    </div>
  )
}

const Countries = ({countries, filter, onClick}) => {
  
  const countries_filt = countries.filter(
    c => c.name.toLowerCase().includes(filter.toLowerCase())
  )  

  if ( countries_filt.length <= 10 & countries_filt.length > 1 ) {
    return (
      <div>
        {countries_filt.map(
          c => <p key={c.name}>{c.name}<button id={c.name} onClick={onClick}>show</button></p>
        )}
      </div>
    )
  } else if ( countries_filt.length === 1 ) {
    return <OneCountry country={countries_filt[0]} />
  } else if ( countries_filt.length === 0 ) {
    return <p>No matches, specify less</p>
  } else {
    return <p>Too many matches, specify more</p>
  } 
}


const App = () => {

  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])

  const handleFilterChange = (event) => setFilter(event.target.value)
  const handleButtonClick = (event) => setFilter(event.target.id)

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => setCountries(response.data))
  }, [])

  return (
    <div>
      <Filter value={filter} onChange={handleFilterChange}/>
      <Countries countries={countries} filter={filter} onClick={handleButtonClick} />
    </div>
  );
}

export default App;

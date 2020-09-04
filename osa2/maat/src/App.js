import React, { useState, useEffect } from 'react';
import axios from 'axios'
//import './App.css';

//<img src={logo} className="App-logo" alt="logo" />

const Filter = ({value, onChange}) => (
  <div>
    Find countries: <input value={value} onChange={onChange} />
  </div>
)

const OneCountry = ({country}) => (
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
  </div>
)

const Countries = ({countries, filter}) => {
  
  const countries_filt = countries.filter(
    c => c.name.toLowerCase().includes(filter.toLowerCase())
  )

  if ( countries_filt.length <= 10 & countries_filt.length > 1 ) {
    return (
      <div>
        {countries_filt.map(
          c => <p key={c.name}>{c.name}</p>
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

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => setCountries(response.data))
  }, [])

  return (
    <div>
      <Filter value={filter} onChange={handleFilterChange}/>
      <Countries countries={countries} filter={filter} />
    </div>
  );
}

export default App;

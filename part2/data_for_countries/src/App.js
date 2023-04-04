
import { useState, useEffect } from "react";
import axios from 'axios'

const Precise = ({ filteredCountries, api_key }) => {
  const [weather, setWeather] = useState(null)
  useEffect(() => {
    if (!weather) {
      const lat = filteredCountries.capitalInfo.latlng[0]
      const lng = filteredCountries.capitalInfo.latlng[1]

      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${api_key}&units=metric`)
      .then(response => {
        setWeather(response.data)
      })
    }
  }, [])
  
  if (!weather) {
    return null
  }

  return (
    <>
      <div>
        <h1>{filteredCountries.name.common}</h1><br></br>
        <div>capital {filteredCountries.capital[0]}</div>
        <div>area {filteredCountries.area}</div>
      </div>
      <div>
        <h2>languages:</h2>
        <ul>
          {Object.entries(filteredCountries.languages).map(language => <li key={language} >{language[1]}</li>)}
        </ul>
      </div>
      <div>
        <img src={filteredCountries.flags.png}></img>
      </div>
      <div>
        <h2>weather in {filteredCountries.capital[0]}</h2>
        <p>temperature {weather.main['temp']} Celcius</p>
        <img src={`https://openweathermap.org/img/wn/${weather.weather[0]['icon']}@2x.png`} />
        <p>wind {weather.wind['speed']} m/s</p>
      </div>
    </>
  )
 
}

const Specific = ({ filteredCountries, handleShow }) => {
  return (
    filteredCountries.map(country => <div key={country.name.common} >
      {country.name.common}
      <button onClick={() => handleShow(country.name.common)}>show</button>
      </div>)
  )
}

const Display = ({ countries, search, handleShow, api_key }) => {
  const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))

  if (filteredCountries.length > 10) {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  } else if (filteredCountries.length > 1) {
    return (
      <Specific filteredCountries={filteredCountries} handleShow={handleShow} />
    )
  } else if (filteredCountries.length === 1) {
    return (
      <Precise filteredCountries={filteredCountries[0]} api_key={api_key} />
    )
  }
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')

  const api_key = process.env.REACT_APP_API_KEY

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleChange = (event) => {
    setSearch(event.target.value)
  }

  const handleShow = (element) => {
    setSearch(element)
  }
  

  return (
    <div>
     <form>
      find countries <input value={search} onChange={handleChange} />
     </form>
     <Display countries={countries} search={search} handleShow={handleShow} api_key={api_key} />
    </div>
  );
}

export default App;

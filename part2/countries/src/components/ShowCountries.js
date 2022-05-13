import { useState, useEffect } from 'react';
import axios from 'axios'

const api_key = process.env.REACT_APP_API_KEY

const weatherHook = ( coordinates, setTemperature, setIconSource, setWind ) => {
    const request = 'https://api.openweathermap.org/data/2.5/weather?lat='+coordinates[0]+'&lon='+coordinates[1]+'&appid='+api_key+'&units=metric'
    axios
    .get(request)
    .then(response => {
        setTemperature(response.data.main.temp)
        setIconSource(response.data.weather[0].icon)
        setWind(response.data.wind.speed)
    })
}

const DisplayWeather = ( { coordinates, temperature, setTemperature, iconSource, setIconSource, wind, setWind }) => {
    useEffect(() => weatherHook(coordinates, setTemperature, setIconSource, setWind),coordinates)
    return (
        <div>
            <p>temperature: {temperature} Celsius</p>
            <img src={'http://openweathermap.org/img/wn/'+iconSource+'.png'} alt="Weather Icon" />
            <p>wind: {wind} m/s</p>
        </div>
    )
}

const ListCountries = ({ country, handleShowButton }) => {
    return (
        <div>
        {country}
        <button onClick={() => handleShowButton(country)}>
            show
        </button> 
        </div>
    )
  }

const ListLanguages = ({ language }) => {
    return (
      <li>{language}</li>
    )
  }

const ShowCountries = ({ countries, handleShowButton }) => {
    const [temperature, setTemperature] = useState(0)
    const [iconSource, setIconSource] = useState('01d')
    const [wind, setWind] = useState(0)

    if (countries.length > 10) {
        return (
            <div>
                Too many matches, specify another filter
            </div>
        )
    } else if (countries.length > 1) {
        return (
            countries.map(country =>
                <ListCountries key={country.cca2} country={country.name.common} handleShowButton={handleShowButton} />
            )
        )
    } else if (countries.length > 0) {
        const coordinates = [countries[0].latlng[0] , countries[0].latlng[1] ]
        return (
            <div>
                <h1>{countries[0].name.common}</h1>
                <p>region: {countries[0].region}</p>
                <p>capital: {countries[0].capital}</p>
                <p>area: {countries[0].area}</p>
                <h3>languages</h3>
                <ul>
                    {Object.values(countries[0].languages).map(language =>
                    <ListLanguages key={language} language={language} />
                    )}
                </ul>
                <img src={countries[0].flags.png} alt="Country Flag" width="200" height="200" />
                <h2>Weather in {countries[0].capital}</h2>
                <DisplayWeather coordinates={coordinates} 
                    temperature={temperature} setTemperature={setTemperature}
                    iconSource={iconSource} setIconSource={setIconSource}
                    wind={wind} setWind={setWind}
                />
            </div>
        )
    } else {
        return (
            <div>
                no countries match current filter
            </div>
        )
    }
}

export default ShowCountries
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [value, setValue] = useState("");
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState();
  const [weather, setWeather] = useState();

  const handleSelectCountry = (country) => setSelectedCountry(country);

  const handleChangeValue = (newValue) => {
    setValue(newValue);
    setSelectedCountry(null);

    if (newValue === "") {
      setFilteredCountries([]);
    }

    if (countries.length && newValue) {
      const filtered = countries.filter((country) =>
        country.name.common.toLowerCase().includes(newValue.toLowerCase())
      );

      setFilteredCountries(filtered);
      if (filtered.length === 1) {
        setSelectedCountry(filtered[0]);
        setWeather(null);
      } else {
        setSelectedCountry(null);
        setWeather(null);
      }
    }
  };

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        setCountries(response.data);
      });
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${
            selectedCountry.capital[0]
          }&appid=${import.meta.env.VITE_OPEN_WEATHER}&units=metric`
        )
        .then((response) => {
          setWeather(response.data);
        });
    }
  }, [selectedCountry]);

  console.log(selectedCountry);

  return (
    <div>
      <form>
        <div>
          <label htmlFor="country">find countries</label>
          <input
            type="text"
            name="country"
            id="country"
            value={value}
            onChange={(e) => handleChangeValue(e.target.value)}
          />
        </div>
      </form>

      {filteredCountries.length > 10 && (
        <p>Too many matches, specify another filter</p>
      )}

      {filteredCountries.length < 10 &&
        !selectedCountry &&
        filteredCountries.map((country) => (
          <div>
            <span key={country.name.common}>{country.name.common}</span>
            <button onClick={() => handleSelectCountry(country)}>Show</button>
          </div>
        ))}

      {selectedCountry && (
        <div>
          <h1>{selectedCountry.name.common}</h1>
          <p>capital: {selectedCountry.capital}</p>
          <p>area: {selectedCountry.area}</p>
          <h2>languages:</h2>
          <ul>
            {Object.values(selectedCountry.languages).map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
          <img
            src={selectedCountry.flags.png}
            alt={selectedCountry.name.common}
          />

          {weather && (
            <>
              <h1>Weather in {selectedCountry.capital[0]}</h1>
              <p>Temperature: {weather.main.temp}°C</p>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt=""
              />
              <p>Wind: {weather.wind.speed} m/s</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

import { useState, useEffect } from "react";
import axios from "axios";

const Weather = ({ country }) => {
  const [weather, setWeather] = useState([]);

  const api_key = process.env.REACT_APP_API_KEY;
  const weather_api = `https://api.openweathermap.org/data/3.0/onecall?&appid=${api_key}&lat=${country.latlng[0]}&lon=${country.latlng[1]}&units=metric`;

  // retrieve weather data only when country is shown
  useEffect(() => {
    axios.get(weather_api).then((response) => {
      setWeather(response.data.current);
    });
  }, [weather_api]);

  if (weather.length !== 0) {
    return (
      <div>
        <h2>Weather in {country.capital}</h2>
        <div>
          <b>temperature:</b> {weather.temp} Celsius
        </div>
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
          alt={weather.weather[0].description}
        />
        <div>
          <b>wind:</b> {weather.wind_speed} mph
        </div>
      </div>
    );
  } else {
    return <div>loading weather...</div>;
  }
};

export default Weather;

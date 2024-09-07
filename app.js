// SELECT ELEMENTS
const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const iconElement = document.getElementById("weather-icon");
const tempElement = document.getElementById("temperature");
const descElement = document.getElementById("description");
const humidityElement = document.getElementById("humidity");
const windSpeedElement = document.getElementById("wind-speed");
const sunriseElement = document.getElementById("sunrise");
const sunsetElement = document.getElementById("sunset");
const locationElement = document.getElementById("location");
const notificationElement = document.querySelector(".notification");
const notificationMessage = document.getElementById("notification-message");

// App data
const weather = {
  temperature: { unit: "celsius" }
};

// APP CONSTS AND VARS
const KELVIN = 273;
// API KEY
const key = "82005d27a116c2880c8f0fcb866998a0";

// Event listener for search button
searchButton.addEventListener("click", function() {
  const city = cityInput.value;
  if (city) {
    getWeatherByCity(city);
  }
});

// Function to fetch weather by city
function getWeatherByCity(city) {
  let api = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;
  
  fetch(api)
    .then(response => response.json())
    .then(data => {
      if (data.cod !== 200) {
        showError({ message: data.message });
        return;
      }
      
      weather.temperature.value = Math.floor(data.main.temp - KELVIN);
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
      weather.humidity = data.main.humidity;
      weather.windSpeed = data.wind.speed;
      weather.sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
      weather.sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

      displayWeather();
    });
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH API
function showError(error) {
  notificationElement.style.display = "block";
  notificationMessage.innerText = error.message;
}

// DISPLAY WEATHER TO UI
function displayWeather() {
  notificationElement.style.display = "none";
  iconElement.src = `http://openweathermap.org/img/wn/${weather.iconId}@2x.png`;
  tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city}, ${weather.country}`;
  humidityElement.innerHTML = weather.humidity;
  windSpeedElement.innerHTML = weather.windSpeed;
  sunriseElement.innerHTML = weather.sunrise;
  sunsetElement.innerHTML = weather.sunset;
}

// C to F conversion
function celsiusToFahrenheit(temperature) {
  return (temperature * 9/5) + 32;
}

// Toggle between Celsius and Fahrenheit
tempElement.addEventListener("click", function() {
  if (weather.temperature.value === undefined) return;
  
  if (weather.temperature.unit === "celsius") {
    let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
    fahrenheit = Math.floor(fahrenheit);
    
    tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
    weather.temperature.unit = "fahrenheit";
  } else {
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    weather.temperature.unit = "celsius";
  }
});

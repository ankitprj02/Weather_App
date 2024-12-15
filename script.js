const apiKey = "b20ee56d083b6d7d99c7d8a93b3e8f94"; // Replace with your actual OpenWeather API key
const getWeatherBtn = document.getElementById("get-weather-btn");
const cityInput = document.getElementById("city-input");
const weatherInfo = document.getElementById("weather-info");
let map;

getWeatherBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city === "") {
    alert("Please enter a city name!");
    return;
  }

  weatherInfo.innerHTML = "Loading..."; // Show loading message

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.cod === "404") {
        weatherInfo.innerHTML = "City not found!";
        console.log(data); // Log data for debugging
      } else {
        const { main, weather, wind, coord } = data;
        weatherInfo.innerHTML = `
          <h3>Weather in ${city}</h3>
          <p><strong>Temperature:</strong> ${main.temp}°C</p>
          <p><strong>Humidity:</strong> ${main.humidity}%</p>
          <p><strong>Wind Speed:</strong> ${wind.speed} m/s</p>
          <p><strong>Condition:</strong> ${weather[0].description}</p>
        `;
        // Initialize or update the map with the city coordinates (latitude, longitude)
        initMap(coord.lat, coord.lon, city, weather[0].description);
      }
    })
    .catch(error => {
      console.error('Error:', error);  // Log any error details
      weatherInfo.innerHTML = "Error fetching data!";
    });
});

// Function to initialize OpenStreetMap using Leaflet.js
function initMap(lat, lon, city, description) {
  if (map) {
    map.setView([lat, lon], 10); // If map already exists, update its center
  } else {
    map = L.map('map').setView([lat, lon], 10);  // Initialize map with city coordinates
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  }

  // Create a marker at the city location
  L.marker([lat, lon]).addTo(map)
    .bindPopup(`<b>${city}</b><br>Weather Condition: ${description}`)
    .openPopup();
}

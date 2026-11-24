const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const errorMessage = document.getElementById('errorMessage');
const weatherCard = document.getElementById('weatherCard');
const cityName = document.getElementById('cityName');
const temp = document.getElementById('temp');
const wind = document.getElementById('wind');
const condition = document.getElementById('condition');
const weatherIcon = document.getElementById('weatherIcon');
const forecastContainer = document.getElementById('forecastContainer');
const unitToggle = document.getElementById('unitToggle');

let isCelsius = true;
let currentWeatherData = null;

const weatherEmojis = {
    0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 45: '🌫️', 48: '🌫️',
    51: '🌧️', 53: '🌧️', 55: '🌧️', 61: '🌧️', 63: '🌧️', 65: '🌧️',
    71: '🌨️', 73: '🌨️', 75: '🌨️', 80: '🌦️', 81: '🌦️', 82: '🌦️',
    95: '⛈️', 96: '⛈️', 99: '⛈️'
};

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) fetchWeather(city);
    }
});

unitToggle.addEventListener('click', () => {
    if (!currentWeatherData) return;
    isCelsius = !isCelsius;
    unitToggle.textContent = isCelsius ? 'Switch to °F' : 'Switch to °C';
    updateUI(currentWeatherData);
});

async function fetchWeather(city) {
    try {
        errorMessage.classList.add('hidden');
        
        // 1. Geocoding: Get Lat/Lon from city name
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Please try again.");
        }

        const { latitude, longitude, name, country } = geoData.results[0];
        
        // 2. Weather API: Get weather using Lat/Lon
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`);
        const weatherData = await weatherRes.json();

        currentWeatherData = {
            name: `${name}, ${country}`,
            weather: weatherData.current_weather,
            daily: weatherData.daily
        };

        updateUI(currentWeatherData);
        weatherCard.classList.remove('hidden');

    } catch (error) {
        weatherCard.classList.add('hidden');
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
    }
}

function updateUI(data) {
    cityName.textContent = data.name;
    
    const tempC = data.weather.temperature;
    const tempF = (tempC * 9/5) + 32;
    temp.textContent = isCelsius ? `${tempC}°C` : `${tempF.toFixed(1)}°F`;
    
    wind.textContent = `${data.weather.windspeed} km/h`;
    condition.textContent = `Code: ${data.weather.weathercode}`;
    weatherIcon.textContent = weatherEmojis[data.weather.weathercode] || '🌡️';

    // Update Forecast
    forecastContainer.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const maxC = data.daily.temperature_2m_max[i];
        const minC = data.daily.temperature_2m_min[i];
        const maxF = (maxC * 9/5) + 32;
        const minF = (minC * 9/5) + 32;
        
        const date = new Date(data.daily.time[i]);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

        const div = document.createElement('div');
        div.className = 'forecast-item';
        div.innerHTML = `
            <p>${dayName}</p>
            <div class="icon">${weatherEmojis[data.daily.weathercode[i]] || '🌡️'}</div>
            <p>${isCelsius ? Math.round(maxC) + '°C' : Math.round(maxF) + '°F'}</p>
        `;
        forecastContainer.appendChild(div);
    }
}
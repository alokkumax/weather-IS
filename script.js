var apiKey = "e2f05c7c5c7b4ba78fe70311262604";

/**
 * Weather Dashboard - Script
 */

// getting weather data from API
async function getWeather(city) {
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const errorMessage = document.getElementById('errorMessage');
    const placeholderCard = document.getElementById('placeholderCard');
    const weatherCard = document.getElementById('weatherCard');

    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();
        console.log("Weather Data Received:", data);
        
        // UI Elements
        const cityName = document.getElementById('cityName');
        const temperature = document.getElementById('temperature');
        const condition = document.getElementById('condition');
        const humidity = document.getElementById('humidity');
        const wind = document.getElementById('wind');
        const dateTime = document.getElementById('dateTime');
        const weatherIcon = document.getElementById('weatherIcon');

        // Update Content
        cityName.innerText = data.location.name;
        dateTime.innerText = data.location.localtime;
        temperature.innerText = `${Math.round(data.current.temp_c)}°C`;
        condition.innerText = data.current.condition.text;
        humidity.innerText = `${data.current.humidity}%`;
        wind.innerText = `${data.current.wind_kph} km/h`;
        weatherIcon.src = `https:${data.current.condition.icon}`;
        weatherIcon.alt = data.current.condition.text;

        // Toggle Visibility
        errorMessage.classList.add('hidden');
        placeholderCard.classList.add('hidden');
        weatherCard.classList.remove('hidden');

    } catch (error) {
        console.error("Weather App Error:", error);
        
        // Reset UI on error
        weatherCard.classList.add('hidden');
        placeholderCard.classList.remove('hidden');
        
        // Show specific error message
        errorMessage.innerText = "City not found. Please try again.";
        errorMessage.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const locationBtn = document.getElementById('locationBtn');
    const cityInput = document.getElementById('cityInput');

    const errorMessage = document.getElementById('errorMessage');

    const handleSearch = () => {
        const city = cityInput.value.trim();
        if (city) {
            errorMessage.classList.add('hidden');
            getWeather(city);
        } else {
            errorMessage.innerText = "Please enter a city name";
            errorMessage.classList.remove('hidden');
        }
    };

    // Hide error when user starts typing
    cityInput.addEventListener('input', () => {
        errorMessage.classList.add('hidden');
    });

    searchBtn.addEventListener('click', handleSearch);

    locationBtn.addEventListener('click', () => {
        // Geolocation will be handled in a later step
        console.log("Location button clicked - API test only for now");
    });

    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
});


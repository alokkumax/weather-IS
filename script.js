var apiKey = "e2f05c7c5c7b4ba78fe70311262604";

/**
 * Weather Dashboard - Script
 */

// getting weather data from API
function getWeather(city) {
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("Weather Data Received:", data);
        })
        .catch(error => {
            console.error("Error fetching weather:", error);
        });
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


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
            
            // UI Elements
            const placeholderCard = document.getElementById('placeholderCard');
            const weatherCard = document.getElementById('weatherCard');
            const cityName = document.getElementById('cityName');
            const temperature = document.getElementById('temperature');
            const condition = document.getElementById('condition');
            const humidity = document.getElementById('humidity');
            const wind = document.getElementById('wind');
            const dateTime = document.getElementById('dateTime');

            // Update Text Content
            cityName.innerText = data.location.name;
            dateTime.innerText = data.location.localtime;
            temperature.innerText = `${Math.round(data.current.temp_c)}°C`;
            condition.innerText = data.current.condition.text;
            humidity.innerText = `${data.current.humidity}%`;
            wind.innerText = `${data.current.wind_kph} km/h`;

            // Toggle Visibility
            placeholderCard.classList.add('hidden');
            weatherCard.classList.remove('hidden');
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


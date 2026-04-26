var apiKey = "e2f05c7c5c7b4ba78fe70311262604";
let currentTempC = null;
let isCelsius = true;

/**
 * Weather Dashboard - Script
 */

function updateTemperatureUI() {
    const temperature = document.getElementById('temperature');
    const tempToggle = document.getElementById('tempToggle');
    
    if (isCelsius) {
        temperature.innerText = `${Math.round(currentTempC)}°C`;
        tempToggle.innerText = "Switch to °F";
    } else {
        const tempF = (currentTempC * 9/5) + 32;
        temperature.innerText = `${Math.round(tempF)}°F`;
        tempToggle.innerText = "Switch to °C";
    }
}

function updateWeatherTheme(condition) {
    const cardTop = document.querySelector('#weatherCard > div');
    const lowerCondition = condition.toLowerCase();
    
    // Default theme classes
    const defaultClasses = ['from-brand-primary', 'to-brand-secondary'];
    const rainClasses = ['from-blue-500', 'to-blue-700'];
    const sunnyClasses = ['from-orange-400', 'to-yellow-500'];
    const cloudClasses = ['from-slate-500', 'to-slate-700'];

    // Remove all possible theme classes
    cardTop.classList.remove(...defaultClasses, ...rainClasses, ...sunnyClasses, ...cloudClasses);
    
    if (lowerCondition.includes('rain')) {
        cardTop.classList.add(...rainClasses);
    } else if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) {
        cardTop.classList.add(...sunnyClasses);
    } else if (lowerCondition.includes('cloud')) {
        cardTop.classList.add(...cloudClasses);
    } else {
        cardTop.classList.add(...defaultClasses);
    }
}

function displayForecast(forecastData) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = ''; // Clear dummy cards

    forecastData.forEach(day => {
        const date = new Date(day.date);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const cardHTML = `
            <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-md animate-fade-in-up">
                <span class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">${dateStr}</span>
                <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" class="w-12 h-12 mb-2">
                <div class="text-xl font-bold text-brand-dark mb-3">${Math.round(day.day.avgtemp_c)}°C</div>
                
                <div class="w-full pt-3 border-t border-slate-50 flex flex-col gap-1 text-[10px] font-semibold uppercase tracking-tight">
                    <div class="flex justify-between text-slate-400">
                        <span>Wind</span>
                        <span class="text-slate-600">${day.day.maxwind_kph}km/h</span>
                    </div>
                    <div class="flex justify-between text-slate-400">
                        <span>Humidity</span>
                        <span class="text-slate-600">${day.day.avghumidity}%</span>
                    </div>
                </div>
            </div>
        `;
        forecastContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// saving recent searches
function saveRecentSearch(city) {
    let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    
    // Remove if already exists (avoid duplicates and update position)
    history = history.filter(item => item.toLowerCase() !== city.toLowerCase());
    
    // Add to start
    history.unshift(city);
    
    // Keep only last 5
    if (history.length > 5) {
        history = history.slice(0, 5);
    }
    
    localStorage.setItem('weatherHistory', JSON.stringify(history));
    displayRecentSearches();
}

function displayRecentSearches() {
    const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    const container = document.getElementById('recentSearches');
    const itemsList = container.querySelector('.flex-wrap');

    if (history.length === 0) {
        container.classList.add('hidden');
        return;
    }

    container.classList.remove('hidden');
    itemsList.innerHTML = history.map(city => `
        <button class="px-3 py-1 bg-slate-100 hover:bg-brand-primary/10 hover:text-brand-primary rounded-lg text-sm text-slate-600 transition-all font-medium border border-transparent hover:border-brand-primary/20" onclick="getWeather('${city}')">
            ${city}
        </button>
    `).join('');
}

// getting weather data from API
async function getWeather(city) {
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`;
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
        console.log("Forecast Data:", data.forecast.forecastday);
        
        // UI Elements
        const cityName = document.getElementById('cityName');
        const temperature = document.getElementById('temperature');
        const condition = document.getElementById('condition');
        const humidity = document.getElementById('humidity');
        const wind = document.getElementById('wind');
        const dateTime = document.getElementById('dateTime');
        const weatherIcon = document.getElementById('weatherIcon');
        const tempToggle = document.getElementById('tempToggle');

        // Update Content
        currentTempC = data.current.temp_c;
        updateTemperatureUI();
        
        cityName.innerText = data.location.name;
        dateTime.innerText = data.location.localtime;
        condition.innerText = data.current.condition.text;
        humidity.innerText = `${data.current.humidity}%`;
        wind.innerText = `${data.current.wind_kph} km/h`;
        weatherIcon.src = `https:${data.current.condition.icon}`;
        weatherIcon.alt = data.current.condition.text;

        updateWeatherTheme(data.current.condition.text);
        displayForecast(data.forecast.forecastday);

        saveRecentSearch(data.location.name);

        // Toggle Visibility
        errorMessage.classList.add('hidden');
        placeholderCard.classList.add('hidden');
        weatherCard.classList.remove('hidden');
        tempToggle.classList.remove('hidden');

        // Temperature Alert
        const tempAlert = document.getElementById('tempAlert');
        if (currentTempC > 40) {
            tempAlert.classList.remove('hidden');
            tempAlert.classList.add('flex');
        } else {
            tempAlert.classList.add('hidden');
            tempAlert.classList.remove('flex');
        }

    } catch (error) {
        console.error("Weather App Error:", error);
        
        // Reset UI on error
        weatherCard.classList.add('hidden');
        placeholderCard.classList.remove('hidden');
        document.getElementById('tempAlert').classList.add('hidden');
        
        // Show specific error message
        errorMessage.innerText = "Please enter a correct city name.";
        errorMessage.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const locationBtn = document.getElementById('locationBtn');
    const cityInput = document.getElementById('cityInput');

    const errorMessage = document.getElementById('errorMessage');

    displayRecentSearches();
    const tempToggle = document.getElementById('tempToggle');

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

    // Toggle Temperature Unit
    tempToggle.addEventListener('click', () => {
        if (currentTempC !== null) {
            isCelsius = !isCelsius;
            updateTemperatureUI();
        }
    });

    searchBtn.addEventListener('click', handleSearch);

    locationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    getWeather(`${latitude},${longitude}`);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    errorMessage.innerText = "Location access denied. Please search manually.";
                    errorMessage.classList.remove('hidden');
                }
            );
        } else {
            errorMessage.innerText = "Geolocation is not supported by your browser.";
            errorMessage.classList.remove('hidden');
        }
    });

    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
});


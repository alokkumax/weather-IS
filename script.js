/**
 * Weather Dashboard - Script
 * 
 * This file will handle:
 * 1. API calls to OpenWeatherMap
 * 2. DOM manipulation for weather cards
 * 3. Geolocation handling
 * 4. Search history management
 */

document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const locationBtn = document.getElementById('locationBtn');
    const cityInput = document.getElementById('cityInput');
    const weatherDisplay = document.getElementById('weatherDisplay');
    const forecastContainer = document.getElementById('forecastContainer');

    const iconMap = {
        Clear: '☀️',
        Clouds: '☁️',
        Rain: '🌧️',
        Drizzle: '🌦️',
        Thunderstorm: '⛈️',
        Snow: '❄️',
        Mist: '🌫️',
        Smoke: '🌫️',
        Haze: '🌫️',
        Fog: '🌫️'
    };

    const sampleForecast = [
        { day: 'Mon', temp: 24, condition: 'Clouds' },
        { day: 'Tue', temp: 27, condition: 'Clear' },
        { day: 'Wed', temp: 22, condition: 'Rain' },
        { day: 'Thu', temp: 25, condition: 'Clouds' },
        { day: 'Fri', temp: 26, condition: 'Clear' }
    ];

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    const getIcon = (condition) => iconMap[condition] || '🌤️';

    const renderForecast = (forecastData) => {
        forecastContainer.innerHTML = forecastData.map((item) => `
            <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-md">
                <span class="text-slate-500 font-medium mb-3">${item.day}</span>
                <div class="text-3xl mb-4">${getIcon(item.condition)}</div>
                <div class="text-xl font-bold text-brand-dark mb-1">${item.temp}&deg;C</div>
                <span class="text-xs text-slate-400 font-medium">${item.condition}</span>
            </div>
        `).join('');
    };

    const renderWeatherCard = (data) => {
        weatherDisplay.innerHTML = `
            <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in-up">
                <div class="bg-gradient-to-r from-brand-primary to-brand-secondary p-8 text-white relative">
                    <div class="flex justify-between items-start">
                        <div>
                            <h2 class="text-3xl font-bold mb-1">${data.city}</h2>
                            <p class="text-brand-light/80">${today}</p>
                        </div>
                        <div class="text-6xl">${getIcon(data.condition)}</div>
                    </div>
                    <div class="mt-12 flex items-end gap-4">
                        <span class="text-7xl font-bold">${data.temp}&deg;C</span>
                        <span class="text-xl pb-2">${data.condition}</span>
                    </div>
                </div>
                <div class="p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div class="flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl">
                        <span class="text-2xl mb-2">💧</span>
                        <span class="text-slate-400 text-xs uppercase font-semibold">Humidity</span>
                        <span class="text-lg font-bold">${data.humidity}%</span>
                    </div>
                    <div class="flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl">
                        <span class="text-2xl mb-2">🌬️</span>
                        <span class="text-slate-400 text-xs uppercase font-semibold">Wind</span>
                        <span class="text-lg font-bold">${data.wind} km/h</span>
                    </div>
                    <div class="flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl">
                        <span class="text-2xl mb-2">🌡️</span>
                        <span class="text-slate-400 text-xs uppercase font-semibold">Pressure</span>
                        <span class="text-lg font-bold">${data.pressure} hPa</span>
                    </div>
                    <div class="flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl">
                        <span class="text-2xl mb-2">👁️</span>
                        <span class="text-slate-400 text-xs uppercase font-semibold">Visibility</span>
                        <span class="text-lg font-bold">${data.visibility} km</span>
                    </div>
                </div>
            </div>
        `;
    };

    const setLoadingState = () => {
        weatherDisplay.innerHTML = `
            <div class="bg-white rounded-3xl border border-slate-100 min-h-[400px] flex items-center justify-center text-slate-500">
                Loading weather data...
            </div>
        `;
    };

    const showInputError = () => {
        weatherDisplay.innerHTML = `
            <div class="bg-red-50 rounded-3xl border border-red-200 min-h-[240px] flex items-center justify-center text-red-600 p-6 text-center">
                Please enter a city name to view weather details.
            </div>
        `;
    };

    const generateMockWeather = (cityName) => ({
        city: cityName,
        temp: 20 + Math.floor(Math.random() * 11),
        condition: sampleForecast[Math.floor(Math.random() * sampleForecast.length)].condition,
        humidity: 50 + Math.floor(Math.random() * 41),
        wind: 8 + Math.floor(Math.random() * 18),
        pressure: 1000 + Math.floor(Math.random() * 26),
        visibility: 5 + Math.floor(Math.random() * 6)
    });

    const handleSearch = () => {
        const city = cityInput.value.trim();
        if (!city) {
            showInputError();
            return;
        }

        setLoadingState();
        setTimeout(() => {
            const weather = generateMockWeather(city);
            renderWeatherCard(weather);
            renderForecast(sampleForecast);
        }, 500);
    };

    searchBtn.addEventListener('click', handleSearch);
    locationBtn.addEventListener('click', () => {
        setLoadingState();
        setTimeout(() => {
            const weather = generateMockWeather('Current Location');
            renderWeatherCard(weather);
            renderForecast(sampleForecast);
        }, 500);
    });

    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
});

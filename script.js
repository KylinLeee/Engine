document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsContainer = document.getElementById('results');
    const locationElement = document.querySelector('.location');
    const temperatureElement = document.querySelector('.temperature');
    const weatherDescriptionElement = document.querySelector('.weather-description');

    // Function to get weather data
    async function getWeather(latitude, longitude) {
        try {
            // First get location name using reverse geocoding
            const locationResponse = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const locationData = await locationResponse.json();
            
            // Then get weather data from Open-Meteo
            const weatherResponse = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
            );
            const weatherData = await weatherResponse.json();
            
            // Update the UI
            locationElement.textContent = locationData.address.city || locationData.address.town || locationData.address.village || 'Unknown Location';
            temperatureElement.textContent = `${Math.round(weatherData.current_weather.temperature)}°C`;
            
            // Get weather description based on weather code
            const weatherCode = weatherData.current_weather.weathercode;
            const weatherDescription = getWeatherDescription(weatherCode);
            weatherDescriptionElement.textContent = weatherDescription;
        } catch (error) {
            console.error('Error fetching weather:', error);
            locationElement.textContent = 'Error loading weather';
            temperatureElement.textContent = '--°C';
            weatherDescriptionElement.textContent = 'Please try again later';
        }
    }

    // Function to convert weather code to description
    function getWeatherDescription(code) {
        const descriptions = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Fog',
            48: 'Depositing rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            61: 'Light rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            71: 'Light snow',
            73: 'Moderate snow',
            75: 'Heavy snow',
            77: 'Snow grains',
            80: 'Light rain showers',
            81: 'Moderate rain showers',
            82: 'Violent rain showers',
            85: 'Light snow showers',
            86: 'Heavy snow showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm with light hail',
            99: 'Thunderstorm with heavy hail'
        };
        return descriptions[code] || 'Unknown weather condition';
    }

    // Function to get user's location
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    getWeather(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    locationElement.textContent = 'Location access denied';
                    temperatureElement.textContent = '--°C';
                    weatherDescriptionElement.textContent = 'Please enable location services';
                }
            );
        } else {
            locationElement.textContent = 'Geolocation not supported';
            temperatureElement.textContent = '--°C';
            weatherDescriptionElement.textContent = 'Please use a modern browser';
        }
    }

    // Get weather on page load
    getLocation();

    // Function to perform search
    async function performSearch(query) {
        try {
            // Using DuckDuckGo's API as it doesn't require an API key
            const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`);
            const data = await response.json();
            
            // Clear previous results
            resultsContainer.innerHTML = '';
            
            if (data.RelatedTopics && data.RelatedTopics.length > 0) {
                data.RelatedTopics.forEach(result => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'result-item';
                    
                    const title = document.createElement('a');
                    title.className = 'result-title';
                    title.href = result.FirstURL;
                    title.textContent = result.Text.split(' - ')[0];
                    title.target = '_blank';
                    
                    const url = document.createElement('div');
                    url.className = 'result-url';
                    url.textContent = result.FirstURL;
                    
                    const snippet = document.createElement('div');
                    snippet.className = 'result-snippet';
                    snippet.textContent = result.Text;
                    
                    resultItem.appendChild(title);
                    resultItem.appendChild(url);
                    resultItem.appendChild(snippet);
                    
                    resultsContainer.appendChild(resultItem);
                });
            } else {
                resultsContainer.innerHTML = '<div class="result-item">No results found</div>';
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
            resultsContainer.innerHTML = '<div class="result-item">Error fetching results. Please try again.</div>';
        }
    }

    // Event listeners
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            performSearch(query);
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                performSearch(query);
            }
        }
    });
}); 

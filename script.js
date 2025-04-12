document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsContainer = document.getElementById('results');
    const locationElement = document.querySelector('.location');
    const temperatureElement = document.querySelector('.temperature');
    const weatherDescriptionElement = document.querySelector('.weather-description');

    // OpenWeatherMap API key - Replace with your own API key
    const API_KEY = 'YOUR_API_KEY'; // You need to get this from OpenWeatherMap

    // Function to get weather data
    async function getWeather(latitude, longitude) {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
            );
            const data = await response.json();
            
            locationElement.textContent = data.name;
            temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
            weatherDescriptionElement.textContent = data.weather[0].description;
        } catch (error) {
            console.error('Error fetching weather:', error);
            locationElement.textContent = 'Error loading weather';
            temperatureElement.textContent = '--°C';
            weatherDescriptionElement.textContent = 'Please try again later';
        }
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

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsContainer = document.getElementById('results');

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
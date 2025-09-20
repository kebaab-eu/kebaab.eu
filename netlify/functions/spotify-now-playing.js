// Spotify Integration
let pollInterval;

// Check Spotify status using Netlify Function
async function checkSpotifyStatus() {
  try {
    const response = await fetch('/.netlify/functions/spotify-now-playing');
    
    // Check if response is HTML (error page) instead of JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('text/html') !== -1) {
      // This is an HTML error page, not JSON
      showError('Spotify function not available');
      clearInterval(pollInterval);
      return;
    }
    
    if (response.status === 401) {
      showError('Spotify authentication failed. Please check your credentials.');
      clearInterval(pollInterval);
      return;
    }
    
    const data = await response.json();
    
    if (response.ok) {
      if (data.is_playing) {
        updateWidget(data);
        spotifyWidget.style.display = 'block';
        spotifyError.style.display = 'none';
      } else {
        spotifyWidget.style.display = 'none';
      }
    } else {
      showError(data.error || 'Failed to fetch Spotify data');
    }
  } catch (error) {
    console.error('Error fetching Spotify status:', error);
    spotifyWidget.style.display = 'none';
    
    // More specific error handling
    if (error instanceof SyntaxError) {
      showError('Received invalid response from server');
    } else {
      showError('Network error - could not connect to Spotify service');
    }
  }
}

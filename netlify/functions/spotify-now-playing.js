const axios = require('axios');

exports.handler = async function(event, context) {
  // Get environment variables
  const { 
    SPOTIFY_CLIENT_ID, 
    SPOTIFY_CLIENT_SECRET, 
    SPOTIFY_REFRESH_TOKEN 
  } = process.env;
  
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing Spotify environment variables' })
    };
  }
  
  try {
    // Get access token using refresh token
    const authResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: SPOTIFY_REFRESH_TOKEN
      }),
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    const accessToken = authResponse.data.access_token;
    
    // Get current playback
    const playbackResponse = await axios.get(
      'https://api.spotify.com/v1/me/player/currently-playing',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    
    if (playbackResponse.status === 200) {
      return {
        statusCode: 200,
        body: JSON.stringify(playbackResponse.data)
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ is_playing: false })
      };
    }
  } catch (error) {
    console.error('Spotify API error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Authentication failed' })
      };
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch Spotify data' })
    };
  }
};

const axios = require('axios');

exports.handler = async function(event, context) {
  // Get environment variables
  const { 
    SPOTIFY_CLIENT_ID, 
    SPOTIFY_CLIENT_SECRET, 
    SPOTIFY_REFRESH_TOKEN 
  } = process.env;
  
  // Debug logging (will appear in Netlify function logs)
  console.log('Function invoked');
  console.log('Environment variables present:', {
    hasClientId: !!SPOTIFY_CLIENT_ID,
    hasClientSecret: !!SPOTIFY_CLIENT_SECRET,
    hasRefreshToken: !!SPOTIFY_REFRESH_TOKEN
  });
  
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    console.error('Missing Spotify environment variables');
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Missing Spotify environment variables',
        details: 'Check that all required environment variables are set in Netlify'
      })
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
      // Get additional context information if available
      let enhancedData = playbackResponse.data;
      
      if (enhancedData.context && enhancedData.context.type === 'playlist') {
        try {
          // Extract playlist ID from URI
          const playlistId = enhancedData.context.uri.split(':')[2];
          
          // Get playlist details
          const playlistResponse = await axios.get(
            `https://api.spotify.com/v1/playlists/${playlistId}`,
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`
              }
            }
          );
          
          // Add playlist info to response
          enhancedData.context.name = playlistResponse.data.name;
          enhancedData.context.public = playlistResponse.data.public;
          enhancedData.context.external_url = playlistResponse.data.external_urls.spotify;
        } catch (error) {
          console.error('Error fetching playlist details:', error.message);
          // Continue without playlist details if there's an error
        }
      }
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(enhancedData)
      };
    } else {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ is_playing: false })
      };
    }
  } catch (error) {
    console.error('Spotify API error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Authentication failed' })
      };
    }
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch Spotify data',
        details: error.message 
      })
    };
  }
};

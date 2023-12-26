document.getElementById('loginWithSpotify').addEventListener('click', function() {
    // Spotify authentication URL
    const clientId = 'YOUR_CLIENT_ID'; // get from spotify dev dashbaord
    const redirectUri = encodeURIComponent('https://yourwebsite.com/Dashboard.html'); // get from github pages hosting of website
    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=user-read-private%20user-read-email`;

    // Redirect the user to Spotify's authentication page
    window.location.href = spotifyAuthUrl;
});

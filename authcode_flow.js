// Attach event listener to the "Login with Spotify" button
const loginButton = document.getElementById('spotifyLoginButton');

loginButton.addEventListener('click', async function() {
    // 1. Generate codeVerifier and its hashed value
    const codeVerifier = generateRandomString(64);
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    // Store the codeVerifier for later use
    localStorage.setItem('code_verifier', codeVerifier);

    // 2. Redirect the user to Spotify for authorization
    const clientId = 'b5a00bbb23724ed3ab30250d5f01fc71';
    const redirectUri = 'https://cwm00004.github.io/simple-analytics/Dashboard.html';
    const scope = 'user-read-private user-read-email';
    const authUrl = new URL("https://accounts.spotify.com/authorize");

    const params = {
        response_type: 'code',
        client_id: clientId,
        scope,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: redirectUri,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
});

// When the user is redirected back to your application after granting permissions
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

if (code) {
    await getToken(code, clientId, redirectUri); // Pass clientId and redirectUri as arguments
}

async function getToken(code, clientId, redirectUri) { // Include clientId and redirectUri as parameters
    let codeVerifier = localStorage.getItem('code_verifier');
    const tokenEndpoint = 'https://accounts.spotify.com/api/token'; // Define the token endpoint

    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: clientId,
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
        }),
    };

    try {
        const body = await fetch(tokenEndpoint, payload);
        const response = await body.json();
        localStorage.setItem('access_token', response.access_token);
    } catch (error) {
        console.error('Error fetching the access token:', error);
    }
}

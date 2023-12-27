// Attach event listener to the "Login with Spotify" button
const loginButton = document.getElementById('spotifyLoginButton');

loginButton.addEventListener('click', async function() {
    // 1. Generate codeVerifier and its hashed value
    const codeVerifier = generateRandomString(64);
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    // Store the codeVerifier for later use (in real-world scenarios, you might consider more secure storage methods)
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
    // 3. Exchange the authorization code for an access token
    await getToken(code);
}

const getToken = async code => {

    // stored in the previous step
    let codeVerifier = localStorage.getItem('code_verifier');
  
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
    }
  
    const body = await fetch(url, payload);
    const response =await body.json();
  
    localStorage.setItem('access_token', response.access_token);
  }
  

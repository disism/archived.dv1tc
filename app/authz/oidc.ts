function generateCodeVerifier(): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const verifierLength = 43; // Minimum length required for PKCE
  let codeVerifier = '';

  for (let i = 0; i < verifierLength; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    codeVerifier += charset[randomIndex];
  }

  return codeVerifier;
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const codeChallenge = base64UrlEncode(hashBuffer);

  return codeChallenge;
}

function base64UrlEncode(buffer: ArrayBuffer): string {
  // @ts-ignore
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Usage
const codeVerifier = generateCodeVerifier();
generateCodeChallenge(codeVerifier).then((codeChallenge) => {
  console.log('Code Verifier:', codeVerifier);
  console.log('Code Challenge:', codeChallenge);
});


export const Oidc = async () => {
  const provider = "http://localhost:3033/auth"
  const clientID = "disism_client"
  const responseType = "code"
  const responseMode ="query"
  const redirectUri = "http://localhost:3000/authz"
  const scope = "openid profile email"
  const codeChallengeMethod = "S256"



  const codeVerifier = generateCodeVerifier();
  const g = await generateCodeChallenge(codeVerifier)
  const url = `${provider}?
client_id=${clientID}&
redirect_uri=${redirectUri}&
response_type=${responseType}&
response_mode=${responseMode}&
code_challenge=${g}&
code_challenge_method=${codeChallengeMethod}&
scope=${scope}
`
  localStorage.setItem("codeVerifier", codeVerifier)
  return url
}

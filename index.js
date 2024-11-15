function base_64_url_encode(arr) {
  return btoa(arr)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}
function random_base_64_url_text() {
  const arr = new Uint8Array(32)
  crypto.getRandomValues(arr)
  return base_64_url_encode(arr)
}
function hash(str) {
  return window.crypto.subtle.digest("SHA-256", str)
}

const foo = document.getElementById("foo")
if (foo != null) {
  foo.innerHTML = window.location.search
}

const query = new URLSearchParams(window.location.search.substring(1))
const fragment = new URLSearchParams(window.location.hash.substring(1))

const state = random_base_64_url_text()

const code_verifier = random_base_64_url_text()
const code_challenge = base_64_url_encode(hash(random_base_64_url_text()))
const code_challenge_method = "S256"

sessionStorage.setItem("state", state)
sessionStorage.setItem("code_verifier", code_verifier)

const base_url_user_validation = "https://accounts.google.com/o/oauth2/v2/auth"
const redirect_uri = "http://localhost:8080"
const scope = "https://www.googleapis.com/auth/youtube"
const response_type = "code"
const client_id = "623899498445-7l9tb7rptb3canrce5ttegnps5ondraq.apps.googleusercontent.com"
const url_user_validation = new URL(base_url_user_validation)
url_user_validation.searchParams.append("redirect_uri", redirect_uri)
url_user_validation.searchParams.append("scope", scope)
url_user_validation.searchParams.append("response_type", response_type)
url_user_validation.searchParams.append("client_id", client_id)
url_user_validation.searchParams.append("state", state)
url_user_validation.searchParams.append("code_challenge", code_challenge)
url_user_validation.searchParams.append("code_challenge_method", code_challenge_method)


document.getElementById("bar").href = url_user_validation.href

const base_url_token = "https://oauth2.googleapis.com/token"
const request = new Request(base_url_token, {
  method: "POST",
  body: JSON.stringify({
    client_id: client_id,
    code: query.get("code"),
    grant_type: "authorization_code",
    redirect_uri: redirect_uri,
  })
});
console.log(JSON.stringify({
  client_id: client_id,
  code: query.get("code"),
  grant_type: "authorization_code",
  redirect_uri: redirect_uri,
}))
const response = fetch(request)
console.log(response)
console.log(response.then((response) => response.json()))
console.log(5)

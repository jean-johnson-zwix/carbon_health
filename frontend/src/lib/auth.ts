// Add the "export" keyword before the function
export function setAuth(token: string, username: string) {
  localStorage.setItem('authToken', token);
  localStorage.setItem('username', username);
}

// You might have other related functions here too
export function getAuthToken() {
  return localStorage.getItem('authToken');
}
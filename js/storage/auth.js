const AUTH_KEY = 'isAuth';
const ROLE_KEY = 'userRole';

export function isAuthed() {
  return localStorage.getItem(AUTH_KEY) === 'true';
}

export function setAuthed(value) {
  localStorage.setItem(AUTH_KEY, value ? 'true' : 'false');
}

export function setUserRole(role) {
  localStorage.setItem(ROLE_KEY, role);
}

export function getUserRole() {
  return localStorage.getItem(ROLE_KEY) || 'user';
}

export function isSeller() {
  return getUserRole() === 'seller';
}

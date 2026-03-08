const KEY = 'isAuth';

export function isAuthed() {
  return localStorage.getItem(KEY) === 'true';
}

export function setAuthed(value) {
  localStorage.setItem(KEY, value ? 'true' : 'false');
}

/* eslint-disable @typescript-eslint/no-explicit-any */
// Utility functions for authentication localStorage management

export const saveAuth = (user: any, token: string) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
};

export const getAuth = () => {
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  return {
    user: user ? JSON.parse(user) : null,
    token: token || null,
  };
};

export const clearAuth = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('checkInData');
}; 
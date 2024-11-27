import axios from 'axios';

let authorizationToken = '';

export const instance = axios.create({
  baseURL: __DOMAIN_BACKEND__,
  headers: {
    'Content-type': 'application/json',
    Accept: 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  config.headers.set('Authorization', `Bearer ${authorizationToken}`);
  return config;
});

export const setAuthorizationToken = (token: string) => {
  authorizationToken = token;
};

instance.interceptors.response.use((response) => {
  return response;
});

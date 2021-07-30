import axios from 'axios';
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});


// Add a request interceptor
instance.interceptors.request.use(config => {
      
  config.headers['Authorization'] = `Basic c3ByaW5nLXNlY3VyaXR5LW9hdXRoMi1yZWFkLXdyaXRlLWNsaWVudDpzcHJpbmctc2VjdXJpdHktb2F1dGgyLXJlYWQtd3JpdGUtY2xpZW50LXBhc3N3b3JkMTIzNA==`;
  
  return config;
}, error => {
  return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use( response => {
    return response;
}, error => {
    return Promise.reject(error.response);
});

export default instance;

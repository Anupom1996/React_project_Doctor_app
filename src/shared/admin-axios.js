import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

const access_token = localStorage.getItem('access_token');
const refresh_token = localStorage.getItem('refresh_token');
console.log(access_token);

if (refresh_token !== null && access_token !== null) {
    //console.log("base url+++++>", process.env)

    // Add a request interceptor
    instance.interceptors.request.use(config => {
        
        // Insert authorization token on request call
        // const access_token = localStorage.getItem('access_token');

        config.headers['Authorization'] = `Bearer ${access_token}`;
        
        return config;
    }, error => {
        return Promise.reject(error);
    });
}  else {
    instance.interceptors.request.use(config => {
      
        config.headers['Authorization'] = `Basic c3ByaW5nLXNlY3VyaXR5LW9hdXRoMi1yZWFkLXdyaXRlLWNsaWVudDpzcHJpbmctc2VjdXJpdHktb2F1dGgyLXJlYWQtd3JpdGUtY2xpZW50LXBhc3N3b3JkMTIzNA==`;
        
        return config;
    }, error => {
        return Promise.reject(error);
    });
}

// Add a response interceptor
instance.interceptors.response.use( response => {
    return response;
},error => {
    // console.log('in error');
    // if(error.response.status === 400 || error.response.status === 401){
    //     localStorage.removeItem('access_token');
    //     const ref_token = localStorage.getItem('refresh_token');
    //     console.log(ref_token);
    //     instance.post('/auth/generate/token', {grant_type: "refresh_token",refresh_token: ref_token})
    //         .then( res => {
    //             if(res.status === 200){
    //                 localStorage.setItem('access_token', res.data.access_token);
    //                 console.log(res.data.access_token);
    //                 window.location.reload(true);    
    //             }
    //         }).catch(err =>{ 
    //             // action.setErrors(err.data.errors)
    //             console.log("Token expired");
    //             // window.location.href = "/"
    //         });
    // }else{
    //     return Promise.reject(error.response);
    // }
    // if(error.response.status !== 401 && error.response.status !== 400){
        return Promise.reject(error.response);
    // }
});

export default instance;

import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    withCredentials: true,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        // const token = Cookies.get('auth_token');
        
        const token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRiZjRjMGMwLTA1ZjctNGIwYy1hYTAyLTczOTZmZjU3Mjk4YiIsIm5hbWUiOm51bGwsImVtYWlsIjoic2FtZWVyYWFkaWwueEBnbWFpbC5jb20iLCJwcm9maWxlX3Bob3RvIjpudWxsLCJwYXNzd29yZCI6IiQyYiQxMCRJVnkyL290M2ZmOEJQWGl0bm41U3pla1RQbHd1NGFWY2RZOXlKRjFPQXhaekx5bDFxeTRwTyIsImlzQWRtaW4iOmZhbHNlLCJ0aW1lem9uZSI6IkFzaWEvS2FyYWNoaSIsInN0YXR1cyI6ImFjdGl2ZSIsImxhc3RfbG9naW4iOiIyMDI1LTEwLTE1VDIwOjU0OjEwLjk1NVoiLCJjcmVhdGVkQXQiOiIyMDI1LTA5LTIyVDE4OjIxOjAyLjE3OFoiLCJ1cGRhdGVkQXQiOiIyMDI1LTEwLTE1VDIwOjU0OjEwLjk1OFoiLCJpYXQiOjE3NjEwNzE1NDUsImV4cCI6MTc2MTY3NjM0NX0.U8gWMUV0PTtEW5YD4BJES5xYl_nIRMWmQH20JkaIEMk';

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            Cookies.remove('auth_token');
        }

        return Promise.reject(error);
    },
);

export default api;

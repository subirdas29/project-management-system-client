import axios, { InternalAxiosRequestConfig } from 'axios';
import { cookieUtils } from '@/utils/cookie';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;
const _signature = process.env.NEXT_PUBLIC_SIGN || '';
const prefix = '/api/v1';

const $axios = axios.create({
  baseURL: `${BASE_URL}${prefix}`,
  timeout: 30000,
});


$axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = cookieUtils.getToken();

    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// global custom header
$axios.defaults.headers.common['x-client-sign'] = _signature;

export default $axios;

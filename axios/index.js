import axios from 'axios';
import { store } from '@/store';
import router from '@/routes/router';

const addTokenInterceptor = config => {
  const token = JSON.parse(sessionStorage.getItem('accessToken'));
  
  if (token) config.headers['Authorization'] = `Bearer ${token.value}`;
  return config;
};

const refreshTokenInterceptor = async (error, instance) => {
  const originalRequest = error.config;
  const isAccessTokenValid = await store.dispatch('CHECK_USER_ACCESS_TOKEN');
  const isRefreshTokenValid = await store.dispatch('CHECK_USER_REFRESH_TOKEN');

  if (error.response.status === 401 && isRefreshTokenValid && !isAccessTokenValid && !originalRequest._retry) {
    try {
      originalRequest._retry = true;
      await store.dispatch('REFRESH_TOKEN');
      return instance(originalRequest);
    } catch (e) {
      router.push('/login');
      return Promise.reject(error);
    }
  }
  
  return Promise.reject(error);
};


const supplyChainAxios = axios.create({ baseURL: `${ process.env.VUE_APP_SERVICES_HOST }/v1/supply-chain` });
const entityServiceAxios = axios.create({ baseURL: `${ process.env.VUE_APP_SERVICES_HOST }/v1/entity` });
const authServiceAxios = axios.create({ baseURL: `${ process.env.VUE_APP_SERVICES_HOST }/v1/auth` });
const templateServiceAxios = axios.create({ baseURL: `${ process.env.VUE_APP_SERVICES_HOST }/v1/template` });
const blockExplorerServiceAxios = axios.create({ baseURL: process.env.VUE_APP_BLOCK_EXPLORER_HOST });

supplyChainAxios.interceptors.request.use(addTokenInterceptor);
supplyChainAxios.interceptors.response.use(response => response, error => refreshTokenInterceptor(error, supplyChainAxios));

entityServiceAxios.interceptors.request.use(addTokenInterceptor);
entityServiceAxios.interceptors.response.use(response => response, error => refreshTokenInterceptor(error, entityServiceAxios));

authServiceAxios.interceptors.request.use(addTokenInterceptor);
authServiceAxios.interceptors.response.use(response => response, error => refreshTokenInterceptor(error, authServiceAxios));

templateServiceAxios.interceptors.request.use(addTokenInterceptor);
templateServiceAxios.interceptors.response.use(response => response, error => refreshTokenInterceptor(error, authServiceAxios));

export {
  supplyChainAxios,
  entityServiceAxios,
  authServiceAxios,
  templateServiceAxios,
  blockExplorerServiceAxios
};

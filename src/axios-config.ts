import axios from 'axios';
import { Router } from 'vue-router';

// Configuración global de Axios
axios.defaults.baseURL = 'http://localhost:8081'; // URL del backend
axios.defaults.withCredentials = true;

export function setupAxiosInterceptors(router: Router | string[]) {
    // Interceptor para añadir el token a las solicitudes
    axios.interceptors.request.use(config => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    }, error => {
        return Promise.reject(error);
    });

    // Interceptor para manejar errores de respuesta
    axios.interceptors.response.use(
        response => response,
        error => {
            if (error.response && error.response.status === 401) {
                // Token inválido o expirado
                localStorage.removeItem('authToken');
                localStorage.removeItem('username');
                router.push('/'); // Redirige al usuario a la página de login
            }
            return Promise.reject(error);
        }
    );
}

export default axios;



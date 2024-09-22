import axios from 'axios';

// Configuración global de Axios
axios.defaults.baseURL = 'http://localhost:8081'; // URL del backend
axios.defaults.withCredentials = true;

export default axios;

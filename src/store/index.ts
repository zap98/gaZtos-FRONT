import { createStore } from 'vuex';
import axios from '@/axios-config'; // Importa la configuración de Axios

export default createStore({
  state: {
    user: null,
    authError: null,
    profileImageUrl: '',
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    getUser: (state) => state.user,
    getAuthError: (state) => state.authError,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_PROFILE_IMAGE(state, profileImageUrl) {
      state.profileImageUrl = profileImageUrl;
    },
    SET_AUTH_ERROR(state: any, error: string | null) {
      state.authError = error;
    },
  },
  actions: {

    async login({ commit }, userData: {
      username: string;
      password: string;
    }) {
      try {
        const response = await axios.post<LoginResponse>('/api/auth/login', userData);

        const {token, user} = response.data;

        localStorage.setItem('username', user.username);
        localStorage.setItem('authToken', token);

        commit('SET_USER', user); // Asume que el backend devuelve un objeto de usuario
        commit('SET_AUTH_ERROR', null); // Clear any previous errors

        return response;
        
      } catch (error) {
        if (axios.isAxiosError(error)) {
          commit('SET_USER', null);
          commit('SET_AUTH_ERROR', error.response?.data?.message || 'Login failed');

          // Limpiar localStorage en caso de error
          localStorage.removeItem('authToken');
          localStorage.removeItem('username');

        } else {
          commit('SET_USER', null);
          commit('SET_AUTH_ERROR', 'An unexpected error occurred');

          // Limpiar localStorage en caso de error
          localStorage.removeItem('authToken');
          localStorage.removeItem('username');
        }
      }
    },

    async getProfileImg({ commit }, username: string) {
      try {
        const response = await axios.get(`/api/user/getProfileImg`, {
          params: { username }
        });
    
        console.log('Imagen de perfil obtenida:', response.data);
    
        // Suponiendo que la respuesta tiene un campo 'profileImageUrl' con la URL de la imagen
        commit('SET_PROFILE_IMAGE', response.data);
        commit('SET_AUTH_ERROR', null);  // Limpia los errores anteriores si la solicitud es exitosa
    
        return response;
    
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // El error es de Axios, por lo que tiene un objeto `response`
          console.error('Error al obtener la imagen de perfil:', error.response ? error.response.data : error.message);
          commit('SET_AUTH_ERROR', error.response?.data?.message || 'Error al obtener la imagen de perfil');
        } else {
          // Otro tipo de error
          console.error('Error inesperado:', error);
          commit('SET_AUTH_ERROR', 'Ocurrió un error inesperado');
        }
      }
    },

    async logout({ commit }) {
      try {
        await axios.post('/api/auth/logout');
        localStorage.removeItem('authToken');
        commit('SET_USER', null);
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },

    async register({ commit }, userData: {
      firstName: string;
      lastName: string;
      username: string;
      email: string;
      password: string;
    }) {
      try {
        const response = await axios.post('/api/auth/register', userData);
        console.log('Registro exitoso:', response.data);

        commit('SET_USER', response.data);
        commit('SET_AUTH_ERROR', null);

        return response;
        
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // El error es de Axios, por lo que tiene un objeto `response`
          console.error('Error en el registro:', error.response ? error.response.data : error.message);
          commit('SET_AUTH_ERROR', error.response?.data?.message || 'Registro fallido');
        } else {
          // Otro tipo de error
          console.error('Error inesperado:', error);
          commit('SET_AUTH_ERROR', 'Ocurrió un error inesperado');
        }
      }
    }
  },
  modules: {},
});

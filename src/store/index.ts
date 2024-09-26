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
        
      } catch (error: any) {
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

    async getProfileImg({ }, userData) {
      try {
          const response = await axios.get('/api/user/getProfileImg', {
              params: { username: userData.username },
              responseType: 'arraybuffer'
          });
  
          // Convertir el arraybuffer a una URL de datos
          const base64 = btoa(
              new Uint8Array(response.data).reduce(
                  (data, byte) => data + String.fromCharCode(byte),
                  ''
              )
          );
          const contentType = response.headers['content-type'];
          return `data:${contentType};base64,${base64}`;
      } catch (error) {
          console.error('Error en getProfileImg:', error);
          throw error;
      }
    },  

    // Action para recuperar la contraseña
    async recoveryPassword({ commit }, userData: { email: string }) {
      try {
        const response = await axios.post(`/api/auth/forgot-password`, userData);

        const token = response.data.token;
        const user = response.data.username;

        localStorage.setItem('username', user);
        localStorage.setItem('authToken', token);        
    
        commit('SET_USER', response.data);
        commit('SET_AUTH_ERROR', null);
    
        return response;
    
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          // El error es de Axios, por lo que tiene un objeto `response`
          console.error('Error en la recuperación de la contraseña:', error.response ? error.response.data : error.message);
          commit('SET_AUTH_ERROR', error.response?.data?.message || 'Error al recuperar la contraseña');
        } else {
          // Otro tipo de error
          console.error('Error inesperado:', error);
          commit('SET_AUTH_ERROR', 'Ocurrió un error inesperado');
        }
      }
    },

    // Action para el cambio de la contraseña desde la url enviada al correo
    async changePasswordRecovery({ commit }, userData: { 
      password: string, 
      username: string, 
      token: string 
    }) {
      try {
        const response = await axios.post(`/api/auth/recoveryPassword`, userData);    
   
        commit('SET_USER', response.data);
        commit('SET_AUTH_ERROR', null);
    
        return response;
    
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          // El error es de Axios, por lo que tiene un objeto `response`
          console.error('Error en la recuperación de la contraseña:', error.response ? error.response.data : error.message);
          commit('SET_AUTH_ERROR', error.response?.data?.message || 'Error al recuperar la contraseña');
        } else {
          // Otro tipo de error
          console.error('Error inesperado:', error);
          commit('SET_AUTH_ERROR', 'Ocurrió un error inesperado');
        }
      }
    },

    // Action para modificar la contraseña
    async changePassword({ commit }, userData: { password: string, username: string }) {
      try {
        const response = await axios.post(`/api/user/changePassword`, userData);
    
        commit('SET_USER', response.data);
        commit('SET_AUTH_ERROR', null);
    
        return response;
    
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          // El error es de Axios, por lo que tiene un objeto `response`
          console.error('Error en la modificación de la contraseña:', error.response ? error.response.data : error.message);
          commit('SET_AUTH_ERROR', error.response?.data?.message || 'Error al modificar la contraseña');
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

    async prueba({ commit }) {
      try {
        const response = await axios.post('/api/auth/prueba');
        console.log('Response:', response.data);
        commit('SET_USER', null);
      } catch (error) {
        console.error('failed:', error);
      }
    },

    async register({ commit }, userData: {
      firstName: string;
      lastName: string;
      username: string;
      email: string;
      password: string;
      profilePicture?: File; // Asegúrate de que el tipo de File es opcional
    }) {
      try {    
        const response = await axios.post(`/api/auth/register`, userData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Especifica que se está enviando FormData
          },
        });
    
        console.log('Registro exitoso:', response.data);
        commit('SET_USER', response.data);
        commit('SET_AUTH_ERROR', null);
    
        return response;
        
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error en el registro:', error.response ? error.response.data : error.message);
          // @ts-ignore
          commit('SET_AUTH_ERROR', error.response?.data?.message || 'Registro fallido');
        } else {
          console.error('Error inesperado:', error);
          commit('SET_AUTH_ERROR', 'Ocurrió un error inesperado');
        }
      }
    }    
  },
  modules: {},
});

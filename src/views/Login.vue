<template>
  <v-container fluid fill-height>
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card>
          <v-card-title>
            <span class="headline">Login</span>
          </v-card-title>
          <v-card-text>
            <AlertComponent
                :typeMsg="typeMsg"
                :message="alertMessage"
                :msgShow="msgShow"
            />
            <LoadingComponent :visible="loading" />
            <v-form @submit.prevent="login">
              <v-text-field
                v-model="user"
                label="User"
                required
                outlined
                dense
                class="mb-4"
              />
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                required
                outlined
                dense
                class="mb-4"
              />
              <v-row class="mt-4" align="center" justify="center">
                <v-col cols="3">
                  <v-btn @click="login" class="blue-dark" block>Acceder</v-btn>
                </v-col>
                <v-col cols="3">
                  <v-btn @click="register" class="blue-dark space_btns" block>Registrar</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/axios-config';
import { useStore } from 'vuex';
import AlertComponent from '../components/AlertComponent.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import { AlertType } from '@/types/types';

const user = ref('');
const password = ref('');
const loading = ref<boolean>(false);
const typeMsg = ref<AlertType>();
const alertMessage = ref('');
const msgShow = ref<boolean>(false);

const router = useRouter();
const store = useStore();

const login = async () => {
  if (user.value === '' || password.value === '') {
    typeMsg.value = 'warning';
    msgShow.value = true;
    alertMessage.value = 'Por favor, complete todos los campos.';

  } else {

    const userData = {
        username: user.value,
        password: password.value
    };

    try {
      loading.value = true;
      const response = await store.dispatch('login', userData);

      if (response?.status === 200) {
        typeMsg.value = 'success';
        msgShow.value = true;
        alertMessage.value = 'Usuario logueado exitosamente';

        setTimeout(() => {
            msgShow.value = false;
            loading.value = false;
            router.push('/menu');
        }, 2000);

      } else {
        typeMsg.value = 'error';
        msgShow.value = true;
        alertMessage.value = 'Usuario o credenciales inválidas';
        loading.value = false;
      }

    } catch (error: any) {
      if (axios.isAxiosError(error)) {
          // El error es de Axios, por lo que tiene un objeto `response`
          console.error('Error en el login:', error.response ? error.response.data : error.message);
          alertMessage.value = 'Hubo un problema con el login. Intente nuevamente.';
      } else {
          // Otro tipo de error
          console.error('Error inesperado:', error);
          typeMsg.value = 'error';
          alertMessage.value = 'Ocurrió un error inesperado. Intente nuevamente.';
      }
    }
  } 
};

const register = async () => {
  router.push('/register');
};

</script>

<style scoped>
  .fill-height {
    height: 100vh;
    display: flex;
    align-items: center;
    margin-top: 300px; /* Centra verticalmente */
  }

  .blue-dark {
    background-color: #003366;
    color: white; /* Azul oscuro */
    max-width: 300px; /* Ancho máximo de los botones */
  }

  .space_btns {
    margin-left: 10px; /* Espacio entre los botones */
  }

  .alert-margin {
    margin-bottom: 20px;
  }

  /* Ajustes responsivos */
  @media (max-width: 600px) {
    .blue-dark {
      width: 100%; /* Hacer que los botones ocupen todo el ancho en pantallas pequeñas */
    }
  }
</style>

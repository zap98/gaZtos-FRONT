<template>
    <v-app>
      <!-- Header -->
      <v-app-bar class="blue-dark" dark>
        <v-spacer></v-spacer>
        <v-img
          src="@/assets/logo.png"
          contain
          max-width="100"
          class="logo"
        ></v-img>
        <v-spacer></v-spacer>
      </v-app-bar>
  
      <!-- Main Content -->
      <v-main class="home-background">
        <v-row align="center" justify="center" class="fill-height">
          <v-col cols="12" sm="10" md="8" lg="6" xl="4">
            <v-card>
              <v-card-text>
                <AlertComponent
                    :typeMsg="typeMsg"
                    :message="alertMessage"
                    :msgShow="msgShow"
                />
                <LoadingComponent :visible="loading" />
                <v-form @submit.prevent="changePassword">
                  <v-text-field
                    v-model="newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    label="Nueva Contraseña"
                    required
                    outlined
                    dense
                    class="mb-4"
                    :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="toggleShowNewPassword"
                  />
                  <v-text-field
                    v-model="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    label="Repetir Contraseña"
                    required
                    outlined
                    dense
                    class="mb-4"
                    :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="toggleShowConfirmPassword"
                  />
                  <v-row class="mt-4" align="center" justify="center">
                    <v-col cols="12">
                      <v-btn type="submit" class="blue-dark" block>
                        Cambiar Contraseña
                      </v-btn>
                    </v-col>
                  </v-row>                  
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-main>
    </v-app>
</template>
  
<script setup lang="ts">
  import { AlertType } from '@/types/types';
  import AlertComponent from '@/components/AlertComponent.vue';
  import LoadingComponent from '@/components/LoadingComponent.vue';
  import { ref } from 'vue';
import axios from 'axios';
import store from '@/store';
import { useRouter } from 'vue-router';
  
  const loading = ref<boolean>(false);
  const newPassword = ref('');
  const response = ref();
  const confirmPassword = ref('');
  const typeMsg = ref<AlertType>();
  const msgShow = ref<boolean>(false);
  const showNewPassword = ref(false); // Control para mostrar/ocultar nueva contraseña
  const showConfirmPassword = ref(false); // Control para mostrar/ocultar repetir contraseña
  const alertMessage = ref('');

  const router = useRouter();

  const toggleShowNewPassword = () => {
    showNewPassword.value = !showNewPassword.value;
  };
  
  const toggleShowConfirmPassword = () => {
    showConfirmPassword.value = !showConfirmPassword.value;
  };
  
  const changePassword = async () => {
      if (!newPassword.value || !confirmPassword.value) {
        typeMsg.value = 'warning';
        msgShow.value = true;
        alertMessage.value = 'Por favor, complete todos los campos.';
      } else {
        msgShow.value = false;

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userName = localStorage.getItem('username');

        if (validarPassword(newPassword.value, confirmPassword.value)) {
            const userData = {
                password: newPassword.value,
                username: userName,
                token: token
            }

            try {
              loading.value = true;
              
              response.value = await store.dispatch('changePasswordRecovery', userData); 
              
              if (response?.value.data.status == "success") {
                loading.value = false;
                msgShow.value = true;
                newPassword.value = "";
                confirmPassword.value = "";
                typeMsg.value = 'success';
                alertMessage.value = 'Contraseña modificada con éxito.';
                
                setTimeout(() => {
                  msgShow.value = false;
                  alertMessage.value = "";
                  router.push('/');
                }, 2000);

              } else {

                loading.value = false;
                msgShow.value = true;
                typeMsg.value = 'error';
                alertMessage.value = 'La contraseña no se ha podido modificar. Intentelo nuevamente.';
                newPassword.value = "";
                confirmPassword.value = "";

                setTimeout(() => {
                  msgShow.value = false;
                  alertMessage.value = "";
                  router.push('/');
                }, 2000);
              }

            } catch (error) {
              if (axios.isAxiosError(error)) {
                  // El error es de Axios, por lo que tiene un objeto `response`
                  console.error('Error en la restauración de la contraseña:', error.response ? error.response.data : error.message);
                  alertMessage.value = 'Hubo un problema con el cambio de contraseña. Intente nuevamente.';
                  loading.value = false;
              } else {
                  // Otro tipo de error
                  console.error('Error inesperado:', error);
                  typeMsg.value = 'error';
                  alertMessage.value = 'Ocurrió un error inesperado. Intente nuevamente.';
                  loading.value = false;
              }
              msgShow.value = true;
            }
        }
      }
  };

  function validarPassword(password: string, confirmPassword: string) {
    const regex = /^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])(?=.{8,})/;
    let validPassword = false;

    // Comprobar si la contraseña cumple con los requisitos
    if (regex.test(password) && password === confirmPassword) {
        validPassword = true
    } else if (!regex.test(password)) {
        typeMsg.value = 'warning';
        msgShow.value = true;
        alertMessage.value = 'La contraseña no es válida. Debe tener al menos 8 caracteres y un carácter especial.';
    } else if (password !== confirmPassword) {
        typeMsg.value = 'warning';
        msgShow.value = true;
        alertMessage.value = 'Las contraseñas no son iguales. Por favor, revise la contraseña';
    } 

    return validPassword
    };
</script>
  
  <style scoped>
  .fill-height {
    height: 100vh;
  }
  
  .blue-dark {
    background-color: #003366; /* Azul oscuro */
    color: white;
  }
  
  .logo {
    max-width: 100px; /* Ajusta el tamaño de la imagen si es necesario */
  }
  
  .home-background {
    background-image: url('@/assets/background.jpg');
    background-size: cover;      /* Asegura que la imagen cubra toda el área */
    background-position: center; /* Centra la imagen */
    background-repeat: no-repeat; /* Evita que la imagen se repita */
    min-height: 100vh;           /* Asegura que el fondo cubra toda la altura de la pantalla */
  }
  </style>
  
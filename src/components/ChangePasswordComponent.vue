<template>
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card>
          <v-card-actions class="custom-actions">
            <v-btn icon @click="closeChangePassword">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-actions>
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
  </template>
  
  <script setup lang="ts">
  import { AlertType } from '@/types/types';
  import AlertComponent from '@/components/AlertComponent.vue';
  import LoadingComponent from '@/components/LoadingComponent.vue';
  import { ref, defineEmits } from 'vue';
  import axios from 'axios';
  import store from '@/store';
  import { defineProps } from 'vue';
  
  const loading = ref<boolean>(false);
  const newPassword = ref('');
  const response = ref();
  const confirmPassword = ref('');
  const typeMsg = ref<AlertType>();
  const msgShow = ref<boolean>(false);
  const showNewPassword = ref(false); // Control para mostrar/ocultar nueva contraseña
  const showConfirmPassword = ref(false); // Control para mostrar/ocultar repetir contraseña
  const alertMessage = ref('');
  
  const props = defineProps({
    showChangePassword: {
      type: Boolean,
      required: true,
    },
  });
  
  const emit = defineEmits();  
  
  const toggleShowNewPassword = () => {
    showNewPassword.value = !showNewPassword.value;
  };
  
  const toggleShowConfirmPassword = () => {
    showConfirmPassword.value = !showConfirmPassword.value;
  };
  
  // Método para cerrar el componente y emitir el evento al padre
  const closeChangePassword = () => {
    emit('update-show-change-password', false); // Emitir evento para cerrar el componente
  };
  
  const changePassword = async () => {
    if (!newPassword.value || !confirmPassword.value) {
      typeMsg.value = 'warning';
      msgShow.value = true;
      alertMessage.value = 'Por favor, complete todos los campos.';
    } else {
      msgShow.value = false;
  
      const userName = localStorage.getItem('username');
  
      if (validarPassword(newPassword.value, confirmPassword.value)) {
        const userData = {
          password: newPassword.value,
          username: userName
        }
  
        try {
          loading.value = true;            
          response.value = await store.dispatch('changePassword', userData);
          
          if (response?.value.data.status == "success") {
            loading.value = false;
            msgShow.value = true;
            typeMsg.value = 'success';
            alertMessage.value = 'Contraseña modificada con éxito.';
  
            setTimeout(() => {
              msgShow.value = false;
              alertMessage.value = "";
              closeChangePassword(); // Llama a la función para cerrar
            }, 2000);
  
          } else if (response?.value.data.status == "warning") {
            loading.value = false;
            msgShow.value = true;
            typeMsg.value = 'warning';
            alertMessage.value = 'Introduce una contraseña diferente a la actual';
            newPassword.value = "";
            confirmPassword.value = "";
          } else {
            loading.value = false;
            msgShow.value = true;
            typeMsg.value = 'error';
            alertMessage.value = 'Error en la restauración de la contraseña. Intente nuevamente.';
            newPassword.value = "";
            confirmPassword.value = "";
          }
  
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error('Error en la restauración de la contraseña:', error.response ? error.response.data : error.message);
            alertMessage.value = 'Hubo un problema con el cambio de contraseña. Intente nuevamente.';
            loading.value = false;
          } else {
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
  
    return validPassword;
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
  
  .custom-actions {
    padding: 0; /* Quitar padding */
    min-height: auto; /* Quitar altura mínima */
    justify-content: flex-end; /* Alinear a la derecha */
  }
  </style>
  
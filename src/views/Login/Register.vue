<template>
    <div class="register-background">
      <v-container>
        <v-row>
          <v-col cols="12" md="6" offset-md="3">
            <v-card>
              <v-card-title>
                <span class="headline">Register</span>
              </v-card-title>
              <v-card-text>
                <AlertComponent
                  :typeMsg="typeMsg"
                  :message="alertMessage"
                  :msgShow="msgShow"
                />
                <LoadingComponent :visible="loading" />
                <v-form @submit.prevent="register">
                  <div style="display: flex; justify-content: center;">
                    <div class="profile-picture-container" @click="uploadImage">
                      <v-img v-if="profilePicture" :src="profilePictureUrl" class="profile-picture" contain />
                      <v-icon v-else class="add-icon">mdi-plus</v-icon>
                    </div>
                    <input
                      type="file"
                      ref="fileInput"
                      accept="image/*"
                      @change="onFileChange"
                      style="display: none;"
                    />
                  </div>
                  <v-text-field
                    v-model="firstName"
                    label="First Name"
                    required
                    outlined
                    maxlength="20"
                    dense
                  />
                  <v-text-field
                    v-model="lastName"
                    label="Last Name"
                    required
                    maxlength="30"
                    outlined
                    dense
                  />
                  <v-text-field
                    v-model="username"
                    label="Username"
                    required
                    outlined
                    maxlength="20"
                    dense
                  />
                  <v-text-field
                    v-model="email"
                    label="Email"
                    type="email"
                    required
                    outlined
                    dense
                  />
                  <v-text-field
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    label="Password"
                    required
                    outlined
                    dense
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="toggleShowPassword"
                  />
                  <v-text-field
                    v-model="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    label="Confirm Password"
                    required
                    outlined
                    dense
                    :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="toggleShowConfirmPassword"
                  />
                  <v-btn @click="register" class="blue-dark mt-4" block>Registrarse</v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </template>
  
  <script setup lang="ts">
  import axios from '@/axios-config';
  import { ref, computed } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import AlertComponent from '@/components/AlertComponent.vue';
  import LoadingComponent from '@/components/LoadingComponent.vue';
  import { AlertType } from '@/types/types';
  
  const profilePicture = ref<File | null>(null);
  const loading = ref<boolean>(false);
  const firstName = ref('');
  const lastName = ref('');
  const username = ref('');
  const email = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const showPassword = ref(false);
  const showConfirmPassword = ref(false);
  const alertMessage = ref('');
  const msgShow = ref<boolean>(false);
  const fileInput = ref<HTMLInputElement | null>(null);
  const typeMsg = ref<AlertType>();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  const router = useRouter();
  const store = useStore();
  
  const toggleShowPassword = () => {
    showPassword.value = !showPassword.value;
  };
  
  const toggleShowConfirmPassword = () => {
    showConfirmPassword.value = !showConfirmPassword.value;
  };
  
  const uploadImage = () => {
    fileInput.value?.click();
  };
  
  const profilePictureUrl = computed(() => {
    return profilePicture.value ? URL.createObjectURL(profilePicture.value) : '';
  });
  
  const onFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      profilePicture.value = file;
    } else {
      profilePicture.value = null;
    }
  };
  
  const register = async () => {
    if (!firstName.value || !lastName.value || !username.value || !email.value || !password.value || !confirmPassword.value) {
      typeMsg.value = 'warning';
      msgShow.value = true;
      alertMessage.value = 'Por favor, complete todos los campos.';
    } else {
      msgShow.value = false;
  
      if (!regex.test(email.value)) {
        typeMsg.value = 'error';
        msgShow.value = true;
        alertMessage.value = 'Formato del email no válido';
      } else {
        if (validarPassword(password.value, confirmPassword.value)) {
          const formData = new FormData(); // Crea un nuevo objeto FormData
          formData.append('firstName', firstName.value);
          formData.append('lastName', lastName.value);
          formData.append('username', username.value);
          formData.append('email', email.value);
          formData.append('password', password.value);
          if (profilePicture.value) {
            formData.append('profilePicture', profilePicture.value); // Agrega la imagen
          }
  
          try {
            loading.value = true;
            const response = await store.dispatch('register', formData); // Envía FormData
  
            if (response.data.status == 'error') {
              typeMsg.value = 'warning';
              msgShow.value = true;
              alertMessage.value = response.data;
              loading.value = false;
            } else if (response.data.status == 'success') {
              typeMsg.value = 'success';
              msgShow.value = true;
              alertMessage.value = 'Usuario registrado exitosamente';
  
              setTimeout(() => {
                msgShow.value = false;
                loading.value = false;
                router.push('/'); // Redirige al login
              }, 2000);
            } else {
              typeMsg.value = 'error';
              msgShow.value = true;
              alertMessage.value = response.data;
              loading.value = false;
            }
          } catch (error) {
            if (axios.isAxiosError(error)) {
              console.error('Error en el registro:', error.response ? error.response.data : error.message);
              alertMessage.value = 'Hubo un problema con el registro. Intente nuevamente.';
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
  
    return validPassword;
  };
  </script>
  
  <style scoped>
  .blue-dark {
    background-color: #003366;
    color: white;
  }
  
  .register-background {
    background-image: url('@/assets/background.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .profile-picture-container {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
    margin-bottom: 20px;
  }
  
  .profile-picture {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .add-icon {
    font-size: 36px; /* Tamaño del icono */
    color: #003366; /* Color del icono */
  }
  
  .alert-margin {
    margin-bottom: 20px;
  }
  </style>
  
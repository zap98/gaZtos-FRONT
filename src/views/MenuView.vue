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
  
        <!-- Mostrar la imagen de perfil si está disponible, sino mostrar una imagen por defecto -->
         <!-- "//profileImage || defaultProfileImage" -->
        <v-avatar size="40" class="mr-4">
          <v-img
            :src="profileImage || defaultProfileImage"
            alt="Foto de perfil"
          ></v-img>
        </v-avatar>
  
        <v-btn
          icon
          @click="logout"
          class="mr-2 btn-exit"
          title="Cerrar sesión"
        >
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-app-bar>
  
      <!-- Main Content -->
      <v-main class="home-background">
        <h1>PANTALLA DEL MENU INICIAL</h1>
      </v-main>
    </v-app>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';

  const defaultProfileImage = require('@/assets/defaultProfile.png');
  const store = useStore();
  
  const profileImage = ref<string>(''); // Guardar la URL de la imagen de perfil
  const router = useRouter();
  
  // Obtener la imagen de perfil del usuario
  const getProfileImage = async () => {
    try {
      const username = localStorage.getItem('username');
      if (username) {
        const response = await store.dispatch('getProfileImg', username);
        profileImage.value = require(response?.data) || defaultProfileImage;
      }
    } catch (error) {
      console.error('Error al obtener la imagen de perfil:', error);
    }
  };
  
  onMounted(() => {
    getProfileImage(); 
  });
  
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    router.push('/');
  };
  </script>
  
  <style scoped>
    .blue-dark {
      background-color: #003366; /* Azul oscuro */
    }
  
    .logo {
      max-width: 100px; /* Ajusta el tamaño de la imagen si es necesario */
    }
  
    .btn-exit {
      color: white;
    }
  
    .home-background {
      background-image: url('@/assets/background.jpg');
      background-size: cover;      /* Asegura que la imagen cubra toda el área */
      background-position: center; /* Centra la imagen */
      background-repeat: no-repeat; /* Evita que la imagen se repita */
      min-height: 100vh;           /* Asegura que el fondo cubra toda la altura de la pantalla */
    }
  
    .mr-4 {
      margin-right: 16px; /* Añade espacio entre el avatar y el botón de logout */
    }
  </style>
  
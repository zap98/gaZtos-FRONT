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
      <Login />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Login from './Login.vue'; // Asegúrate de la ruta correcta
</script>

<style scoped>
.blue-dark {
  background-color: #003366; /* Azul oscuro */
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

<template>
  <v-app>
    <!-- Header con animación -->
    <v-app-bar class="blue-dark" dark>
      <v-spacer></v-spacer>

      <!-- Logo que se moverá hacia la izquierda cuando esté logueado -->
      <v-img
        :class="{'move-left': isLoggedIn}"
        src="@/assets/logo.png"
        contain
        max-width="100"
        class="logo"
      ></v-img>

      <!-- Si está logueado, aparecen las opciones del menú en el centro -->
      <v-spacer v-if="isLoggedIn"></v-spacer>

      <div v-if="isLoggedIn" class="menu-options">
        <!-- Opciones de navegación -->
        <v-btn variant="text" to="/option1" class="white--text">Opción 1</v-btn>
        <v-btn variant="text" to="/option2" class="white--text">Opción 2</v-btn>
        <v-btn variant="text" to="/option3" class="white--text">Opción 3</v-btn>
      </div>

      <v-spacer></v-spacer>

      <!-- Avatar y botón de logout -->
      <v-avatar size="40" class="mr-4 profile-avatar" @click="openProfileDialog">
        <v-img
          :src="profileImage || defaultProfileImage"
          alt="Foto de perfil"
        ></v-img>
      </v-avatar>

      <v-btn icon @click="logout" class="mr-2 btn-exit" title="Cerrar sesión">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Contenido principal con router-view para cargar las vistas -->
    <v-main class="home-background">
      <router-view></router-view>
      <ChangePasswordComponent 
        v-if="showChangePassword" 
        :showChangePassword="showChangePassword"
        @update-show-change-password="handleShowChangePasswordUpdate" 
      />
      <!--<v-btn icon @click="prueba" text="Prueba"></v-btn> -->
    </v-main>

    <!-- Diálogo para editar datos del usuario -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-actions class="custom-actions">
          <v-btn icon @click="closeProfileDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>
        <v-card-title>
          <span class="headline">Opciones de Usuario</span>
        </v-card-title>
        <v-card-text>
          <v-btn @click="editProfile" block class="blue-dark mb-2">Editar Perfil</v-btn>
          <v-btn @click="changePassword" block class="blue-dark">Cambiar Contraseña</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import ChangePasswordComponent from '@/components/ChangePasswordComponent.vue';

const defaultProfileImage = require('@/assets/defaultProfile.png');
const store = useStore();
const profileImage = ref<string>(''); // Guardar la URL de la imagen de perfil
const isLoggedIn = ref<boolean>(false); // Controla si el usuario está logueado
const dialog = ref(false); // Control para abrir/cerrar el diálogo
const showChangePassword = ref(false);

const router = useRouter();

// Función para abrir el diálogo de perfil
const openProfileDialog = () => {
  dialog.value = true; 
};

const editProfile = () => {
  closeProfileDialog();
  router.push('/edit-profile');
};

const handleShowChangePasswordUpdate = (value: boolean) => {
  showChangePassword.value = value; // Actualizar el valor en el padre
};

const changePassword = () => {
  closeProfileDialog();
  showChangePassword.value = true;
};

const prueba = async () => {
  const response = await store.dispatch('prueba');
}

const closeProfileDialog = () => {
  dialog.value = false;
};

// Cargar la imagen de perfil
const getProfileImage = async () => {
  try {
    const username = localStorage.getItem('username');
    const userData = { username };
    const imageUrl = await store.dispatch('getProfileImg', userData);

    profileImage.value = imageUrl || defaultProfileImage;
  } catch (error) {
    profileImage.value = defaultProfileImage; // Imagen por defecto en caso de error
  }
};

// Función para desloguear al usuario
const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('username');
  isLoggedIn.value = false; // Cambia el estado al salir
  router.push('/');
};

// Ejecutar al montar la vista
onMounted(() => {
  // Si el usuario está logueado, actualizar el estado
  const authToken = localStorage.getItem('authToken');
  if (authToken) {
    isLoggedIn.value = true; // Muestra las opciones y activa la animación del logo
    getProfileImage();
  }
});
</script>


<style scoped>
.blue-dark {
  background-color: #003366;
  color: white;
}

.logo {
  transition: transform 0.5s ease, margin-left 0.5s ease; /* Transición para la animación */
  margin-right: auto;
}

.move-left {
  transform: translateX(-100%); /* Mueve el logo a la izquierda */
  margin-left: 16px; /* Añade margen después del movimiento */
}

.menu-options {
  display: flex;
  gap: 20px; /* Espacio entre los botones del menú */
}

.white--text {
  color: white;
}

.btn-exit {
  color: white;
}

.home-background {
  background-image: url('@/assets/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
}

.profile-avatar:hover {
  transform: scale(1.1);
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
}

.mr-4 {
  margin-right: 16px;
}

.mb-2 {
  margin-bottom: 16px;
}
</style>


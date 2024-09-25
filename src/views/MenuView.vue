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
      <v-avatar size="40" class="mr-4 profile-avatar" @click="openProfileDialog">
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
      <v-btn @click="prueba">Llamar a Prueba</v-btn>
      <ChangePassword 
        v-if="showChangePassword" 
        :showChangePassword="showChangePassword"
        @update-show-change-password="handleShowChangePasswordUpdate" 
      />
    </v-main>

    <!-- Diálogo para editar datos del usuario -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-actions class="custom-actions">
          <v-btn icon @click="closeProfileDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>

        <v-card-title class="d-flex align-center justify-space-between">
          <span class="headline">Opciones de Usuario</span>
        </v-card-title>
        
        <v-card-text>
          <v-btn 
            @click="editProfile" 
            block 
            class="blue-dark mb-2"
          >
            Editar Perfil
          </v-btn>
          <v-btn 
            @click="changePassword" 
            block 
            class="blue-dark"
          >
            Cambiar Contraseña
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import ChangePassword from '@/components/ChangePassword.vue';
 
const defaultProfileImage = require('@/assets/defaultProfile.png');
const store = useStore();

const profileImage = ref<string>(''); // Guardar la URL de la imagen de perfil
const showChangePassword = ref(false);
const router = useRouter();
const dialog = ref(false); // Control para abrir/cerrar el diálogo

const openProfileDialog = () => {
  dialog.value = true; // Abrir el diálogo
};

const closeProfileDialog = () => {
  dialog.value = false; // Cerrar el diálogo
};

const handleShowChangePasswordUpdate = (value: boolean) => {
  showChangePassword.value = value; // Actualizar el valor en el padre
};

const editProfile = () => {
  closeProfileDialog();
  router.push('/edit-profile');
};

const changePassword = () => {
  closeProfileDialog();
  showChangePassword.value = true;
};

const prueba = async () => {
  const response = await store.dispatch('prueba');
};

const getProfileImage = async () => {
  try {
    const username = localStorage.getItem('username');

    const userData = { username };
    const imageUrl = await store.dispatch('getProfileImg', userData);

    if (!username || imageUrl.includes(undefined)) {
      profileImage.value = defaultProfileImage; // URL de la imagen por defecto
    } else {
      profileImage.value = imageUrl;
    }    
  } catch (error) {
    console.error('Error al obtener la imagen de perfil:', error);
    profileImage.value = 'defaultProfileImageURL'; // URL de la imagen por defecto
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
  background-color: #003366;
  color: white;
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

.profile-avatar {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-avatar:hover {
  transform: scale(1.1); /* Agranda la imagen un 10% */
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2); /* Añade una sombra para destacar */
}

.mr-4 {
  margin-right: 16px; /* Añade espacio entre el avatar y el botón de logout */
}

.mb-2 {
  margin-bottom: 16px; /* Espacio inferior para separar los botones */
}

.custom-actions {
  padding: 0; /* Quitar padding */
  min-height: auto; /* Quitar altura mínima */
}

.d-flex {
  display: flex; /* Activar flexbox para el título */
}

.align-center {
  align-items: center; /* Centrar verticalmente */
}

.justify-space-between {
  justify-content: space-between; /* Espaciar elementos en línea */
}

.headline {
  margin: 0; /* Eliminar márgenes en el título */
  line-height: 40px; /* Alinear la altura de línea con el botón de cerrar */
}
</style>

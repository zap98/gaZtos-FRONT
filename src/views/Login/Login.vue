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
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                required
                outlined
                dense
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="toggleShowPassword"
                class="mb-4"
              />
              <v-row class="mt-4" align="center" justify="center">
                <v-col cols="3">
                  <v-btn @click="login" class="blue-dark" block>Acceder</v-btn>
                </v-col>
                <v-col cols="3">
                  <v-btn
                    @click="register"
                    class="blue-dark space_btns"
                    block
                  >Registrar</v-btn>
                </v-col>
              </v-row>
              <!-- Enlace de Recuperar Contraseña alineado a la derecha -->
              <v-row class="mt-2" align="end" justify="end">
                <v-col cols="12" class="text-right">
                  <a @click.prevent="dialog = true" class="recover-link">
                    ¿Olvidaste tu contraseña?
                  </a>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Popup para recuperar la contraseña -->
    <v-dialog v-model="dialog" max-width="500px" @click:outside="closeDialog">
      <v-card>
        <!-- Botón de cerrar en la esquina superior derecha -->
        <v-card-actions class="small-actions">
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>

        <v-card-title>
          <span class="headline">Recuperar Contraseña</span>
        </v-card-title>
        <v-card-text>
          <AlertComponent
            :typeMsg="typeMsg"
            :message="alertMessage"
            :msgShow="msgShowRecovery"
          />
          <LoadingComponent :visible="loadingRecovery" />
          <v-form @submit.prevent="recoveryPassword">
            <v-text-field
              v-model="email"
              label="Email"
              required
              outlined
              dense
              class="mb-4"
              type="email"
            />
            <v-row class="mt-4" align="center" justify="center">
              <v-col cols="12">
                <v-btn type="submit" class="blue-dark" block>
                  Recuperar
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/axios-config';
import { useStore } from 'vuex';
import AlertComponent from '@/components/AlertComponent.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import { AlertType } from '@/types/types';

const user = ref('');
const password = ref('');
const email = ref('');
const loading = ref<boolean>(false);
const loadingRecovery = ref<boolean>(false);
const typeMsg = ref<AlertType>();
const showPassword = ref(false);
const alertMessage = ref('');
const msgShow = ref<boolean>(false);
const msgShowRecovery = ref<boolean>(false);
const dialog = ref(false); // Controla el popup
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const router = useRouter();
const store = useStore();

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const login = async () => {
  if (user.value === '' || password.value === '') {
    typeMsg.value = 'warning';
    msgShow.value = true;
    alertMessage.value = 'Por favor, complete todos los campos.';
  } else {
    const userData = {
      username: user.value,
      password: password.value,
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
        console.error(
          'Error en el login:',
          error.response ? error.response.data : error.message
        );
        alertMessage.value = 'Hubo un problema con el login. Intente nuevamente.';
      } else {
        console.error('Error inesperado:', error);
        typeMsg.value = 'error';
        alertMessage.value = 'Ocurrió un error inesperado. Intente nuevamente.';
      }
    }
  }
};

const closeDialog = () => {
  dialog.value = false;
  msgShow.value = false;
  email.value = '';
  msgShowRecovery.value = false;
  alertMessage.value = '';
};

const register = async () => {
  router.push('/register');
};

const recoveryPassword = async () => {
  // Lógica para la recuperación de contraseña con el email ingresado
  if (email.value === '') {
    alertMessage.value = 'Por favor, ingrese su email.';
    typeMsg.value = 'warning';
    msgShowRecovery.value = true;
  } else {
    msgShowRecovery.value = false;

    if (!regex.test(email.value)) {
      typeMsg.value = 'warning';
      msgShowRecovery.value = true;
      alertMessage.value = 'Formato del email no válido';
    } else {
      msgShowRecovery.value = false;

      try {
                
        const userData = {
          email: email.value
        };

        loadingRecovery.value = true;
        const response = await store.dispatch('recoveryPassword', userData);

        if (response.data.token == null && response.data.username == null) {
          loadingRecovery.value = false;
          typeMsg.value = 'error';
          msgShowRecovery.value = true;
          alertMessage.value = 'El email introducido no corresponde a ningún usuario registrado. Intente nuevamente.';
        } else if (response.data.token !== null && response.data.username !== null) {
          typeMsg.value = 'success';
          msgShowRecovery.value = true;
          alertMessage.value = 'Instrucciones enviadas a su email.';

          setTimeout(() => {
            msgShowRecovery.value = false;
            alertMessage.value = "";
            email.value = "";
            loadingRecovery.value = false;
          }, 2000);

          dialog.value = false;
          email.value = "";
        } else {
          typeMsg.value = 'error';
          msgShowRecovery.value = true;
          loadingRecovery.value = false;
          alertMessage.value = 'No se pudo enviar el email. Intente nuevamente.';
        }
      } catch (error) {
        console.error('Error en la recuperación de contraseña:', error);
        typeMsg.value = 'error';
        alertMessage.value = 'Ocurrió un error. Intente nuevamente.';
      } finally {
        loading.value = false;
      }
      
    }

  }
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

.recover-link {
  color: #003366;
  cursor: pointer;
  text-decoration: underline;
}

.small-actions {
  padding: 0 16px; /* Reducir el padding horizontal */
  height: 40px; /* Fija una altura más pequeña */
}

.text-right {
  text-align: right;
}

/* Ajustes responsivos */
@media (max-width: 600px) {
  .blue-dark {
    width: 100%; /* Hacer que los botones ocupen todo el ancho en pantallas pequeñas */
  }
}
</style>

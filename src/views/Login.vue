<template>
    <v-container fluid fill-height>
      <v-row align="center" justify="center" class="fill-height">
        <v-col cols="12" sm="10" md="8" lg="6" xl="4">
          <v-card>
            <v-card-title>
              <span class="headline">Login</span>
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="submitForm">
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
                  label="Password"
                  type="password"
                  required
                  outlined
                  dense
                />
                <v-btn type="submit" class="mt-4 blue-dark" block>Acceder</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  // Form data
  const email = ref('');
  const password = ref('');
  
  // Form submission handler
  const submitForm = () => {
    alert(`Email: ${email.value}\nPassword: ${password.value}`);
  };
  </script>
  
  <style scoped>
    .fill-height {
        height: 100vh;
        margin-top: 400px;
    }

    .blue-dark {
        background-color: #003366;
        color: white; /* Azul oscuro */
    }
  </style>
  
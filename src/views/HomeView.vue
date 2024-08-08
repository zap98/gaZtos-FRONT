<template>
  <v-app>
    <!-- Header -->
    <v-app-bar color="blue" dark>
      <v-toolbar-title>Login Page</v-toolbar-title>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container fluid fill-height>
        <v-row
          align="center"
          justify="center"
          class="fill-height"
        >
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
                  <v-btn type="submit" color="blue" class="mt-4" block>Login</v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
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
</style>

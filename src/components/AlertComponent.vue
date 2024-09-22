<template>
    <v-alert
        v-if="props.msgShow"
        :type="props.typeMsg"
        dismissible
        class="alert-margin"
    >
        {{ props.message }}
    </v-alert>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { AlertType } from '@/types/types';


const props = defineProps<{
  typeMsg: AlertType;
  message: string;
  msgShow: boolean;
}>();

</script>

<style scoped>
    .alert-margin {
        margin-bottom: 20px;
    }    
</style>
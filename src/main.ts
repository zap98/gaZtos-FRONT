import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { setupAxiosInterceptors } from "./axios-config";

loadFonts();
setupAxiosInterceptors(router);

createApp(App).use(router).use(store).use(vuetify).mount("#app");

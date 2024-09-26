import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Menu from "@/views/MenuView.vue";
import RecoveryPassword from "@/views/Login/RecoveryPassword.vue";
import Register from "@/views/Login/Register.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },

  {
    path: "/register",
    name: "register",
    component: Register,
  },

  {
    path: "/menu",
    name: "menu",
    component: Menu,
  },

  {
    path: "/reset-password",
    name: "recoveryPassword",
    component: RecoveryPassword,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

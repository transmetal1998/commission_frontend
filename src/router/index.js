import { createRouter, createWebHistory } from "vue-router";
import { generateRoutes } from "./routes";
import { useAuthStore } from "@/stores/auth/authStore";
import { useModuleStore } from "@/stores/general/moduleStore";
import { createPinia } from "pinia";

const pinia = createPinia(); // Initialize Pinia first
const moduleStore = useModuleStore(pinia); // Ensure store has access to Pinia
const routes = generateRoutes(moduleStore); // Generate routes after Pinia is active

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {

  console.log('Navigating to:', to.fullPath);
  next();

});


export default router;
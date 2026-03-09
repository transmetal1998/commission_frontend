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
  // const authTokenLocal = sessionStorage.getItem('authToken');
  // console.log('get the authtoken: ' + authTokenLocal);
  // const authStore = useAuthStore();

  // const isAuthenticated = authStore.isAuthenticated;
  // const checkValidProfile = await authStore.fetchProfile();
  // console.log(checkValidProfile);
     
  // if (authTokenLocal && !checkValidProfile) {
  //   console.log('invalid token, logging out');
  //   return next('/');
  // }
  
  // if (to.path === '/' && isAuthenticated) {
  //   console.log('already authenticated, redirecting to dashboard');
  //   return next('/dashboard');
  // } else if (!isAuthenticated && to.meta.requiresAuth) {
  //   console.log('not authenticated, redirecting to login');
  //   return next('/');
  // } else if (to.path === '/' && authTokenLocal) {
  //   console.log('has token, validating profile');
  //   authStore.logout();
  //   return next();
  // }

  return next();

});


export default router;
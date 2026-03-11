<template>
  <div class="login-container">
    <div 
      class="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed"
      :style="{ backgroundImage: `url(${BackgroundImage})` }"
    >
      <div class="absolute inset-0 bg-black/50 backdrop-blur-[2px] z-0"></div>

      <Toast position="top-right" />

      <div class="relative z-10 flex flex-col lg:flex-row items-stretch justify-center w-full max-w-4xl shadow-[0_50px_100px_rgba(0,0,0,0.5)] rounded-[40px] overflow-hidden fade-in-up">
        
        <div 
          class="w-full lg:w-1/2 bg-white/95 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 xl:p-16 border-r border-gray-100"
          style="border-top-right-radius: 0; border-bottom-right-radius: 0;"
        >
          <div class="flex flex-col items-center space-y-4 sm:space-y-6 lg:space-y-8 xl:space-y-10">
            <img :src="FdcLogo" alt="First Datacorp" class="w-full h-auto max-w-[120px] sm:max-w-[150px] lg:max-w-[180px] xl:max-w-[220px] object-contain" />
            
            <div class="w-12 sm:w-16 h-[1px] bg-gray-200"></div>
            
            <div class="flex flex-col items-center space-y-2 sm:space-y-3 lg:space-y-4">
              <img :src="CfiLogo" alt="Commerce First" class="w-full h-auto max-w-[100px] sm:max-w-[130px] lg:max-w-[160px] xl:max-w-[200px] object-contain" />
              <p class="text-gray-400 font-black tracking-[0.2em] uppercase text-[8px] sm:text-[9px] lg:text-[10px] text-center">
                Enterprise Commission Management
              </p>
            </div>
          </div>
        </div>

        <div 
          class="w-full lg:w-1/2 bg-white flex flex-col"
          :class="{ 'shake': triggerShake }"
          style="border-top-left-radius: 0; border-bottom-left-radius: 0;"
        >
          <div class="bg-[#1A1A1A] pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8 px-6 sm:px-8 lg:px-10 text-center relative overflow-hidden flex flex-col items-center justify-center">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 sm:w-40 lg:w-48 h-32 sm:h-40 lg:h-48 bg-[#C6011F] opacity-20 blur-[40px] sm:blur-[50px] lg:blur-[60px] rounded-full"></div>
            <img :src="CsLogo" alt="Commission System" class="relative z-10 h-10 sm:h-12 lg:h-14 xl:h-16 w-auto object-contain brightness-0 invert" />
          </div>

          <div class="p-6 sm:p-8 lg:p-10 flex-grow">
            <div class="text-center mb-6 sm:mb-8">
              <h2 class="text-lg sm:text-xl font-black text-gray-900 tracking-wider uppercase">Portal Login</h2>
              <div class="w-8 sm:w-10 h-1 bg-[#C6011F] mx-auto mt-2 rounded-full"></div>
            </div>

            <form @submit.prevent="submitLogin" class="space-y-4 sm:space-y-5">
              <FloatLabel>
                <InputText id="username" v-model="loginForm.username" class="w-full custom-input" :disabled="isLocked" />
                <label for="username" class="font-bold text-gray-400 ml-2 text-sm">Username</label>
              </FloatLabel>

              <FloatLabel>
                <Password id="password" v-model="loginForm.password" toggleMask :feedback="false" class="w-full" inputClass="w-full custom-input" :disabled="isLocked" />
                <label for="password" class="font-bold text-gray-400 ml-2 text-sm">Password</label>
              </FloatLabel>

              <Button
                type="submit"
                :label="isLocked ? `LOCKED` : 'Secure Sign In'"
                class="w-full py-3 sm:py-4 text-sm font-black tracking-widest shadow-lg rounded-xl border-none uppercase text-white transition-all active:scale-[0.98]"
                :style="isLocked ? 'background-color: #94a3b8;' : 'background-color: #C6011F;'"
                :loading="loading"
              />
            </form>

            <div class="mt-6 sm:mt-8 text-center">
              <button class="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#C6011F] transition-colors">
                Forgot Password?
              </button>
            </div>
          </div>
        </div>
      </div>

      <Dialog v-model:visible="showModal" modal :header="modalHeader" :style="{ width: '90vw', maxWidth: '380px' }" :closable="false" class="custom-dialog">
        <div class="flex flex-col items-center justify-center pt-6 sm:pt-8 pb-4 sm:pb-6 text-center px-4 sm:px-6">
          <div :class="statusClass" class="w-16 sm:w-20 h-16 sm:h-20 rounded-full flex items-center justify-center mb-4 sm:mb-5 shadow-inner">
            <i :class="statusIcon" class="text-3xl sm:text-4xl"></i>
          </div>
          <h3 class="text-lg sm:text-xl font-black text-gray-900 mb-2">{{ modalTitle }}</h3>
          <p class="text-gray-400 font-medium text-sm leading-relaxed">{{ modalMessage }}</p>
        </div>
        <template #footer>
          <div class="flex justify-center w-full pb-6 sm:pb-8 px-6 sm:px-8">
            <Button v-if="!isSuccess && !isLocked" label="Try Again" @click="showModal = false" class="w-full bg-[#1A1A1A] border-none py-3 sm:py-3.5 rounded-xl font-bold uppercase text-xs text-white" />
            <div v-if="isLocked" class="text-orange-600 font-black bg-orange-50 px-4 sm:px-6 py-3 sm:py-4 rounded-xl w-full text-center border-2 border-orange-100">
              Wait {{ lockdownTimer }}s
            </div>
          </div>
        </template>
      </Dialog>
    </div>
  </div>
</template>

<style scoped>
/* Ensure both cards take equal vertical space on desktop */
@media (min-width: 1024px) {
  .lg\:self-stretch {
    align-self: stretch !important;
  }
}

/* Custom Input Styling */
:deep(.custom-input) { 
  padding: 1rem 1rem 0.5rem 1rem !important; 
  border-radius: 12px !important;
  background-color: #F9FAFB !important;
  border: 2px solid #F3F4F6 !important;
  font-size: 0.9rem !important;
  font-weight: 600 !important;
}

:deep(.custom-input:focus) { 
  border-color: #C6011F33 !important;
  box-shadow: 0 10px 20px -5px rgba(198, 1, 31, 0.05) !important;
}

/* Animations */
.fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

.shake { animation: shake-horizontal 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both; }
@keyframes shake-horizontal {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
}

:deep(.custom-dialog) { border-radius: 30px; overflow: hidden; }

/* Additional responsive adjustments */
@media (max-width: 640px) {
  .max-w-4xl {
    max-width: 100%;
    margin: 0 1rem;
  }
  .rounded-[40px] {
    border-radius: 20px;
  }
}
</style>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth/authStore';

import BackgroundImage from '@/assets/bg.jpg';
import FdcLogo from '@/assets/fdc.png';
import CfiLogo from '@/assets/cfi.png';
import CsLogo from '@/assets/cs.png';

const router = useRouter();
const authStore = useAuthStore();

const loginForm = reactive({ username: '', password: '' });
const loading = ref(false);
const showModal = ref(false);
const isSuccess = ref(false);
const isLocked = ref(false);
const modalMessage = ref('');
const failedAttempts = ref(0);
const lockdownTimer = ref(0);
const triggerShake = ref(false);
let timerInterval = null;

const modalHeader = computed(() => isLocked.value ? 'Security Breach' : (isSuccess.value ? 'Access Granted' : 'Access Denied'));
const modalTitle = computed(() => isLocked.value ? 'Account Locked' : (isSuccess.value ? 'Welcome' : 'Error'));
const statusClass = computed(() => isLocked.value ? 'bg-orange-100 text-orange-600' : (isSuccess.value ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'));
const statusIcon = computed(() => isLocked.value ? 'pi pi-lock' : (isSuccess.value ? 'pi pi-check' : 'pi pi-times-circle'));

onMounted(() => {
  const unlockTime = localStorage.getItem('commission_unlock_time');
  if (unlockTime) {
    const remaining = Math.ceil((parseInt(unlockTime) - Date.now()) / 1000);
    if (remaining > 0) {
      lockdownTimer.value = remaining;
      startLockout();
    }
  }
});

onUnmounted(() => { if (timerInterval) clearInterval(timerInterval); });

const submitLogin = async () => {
  if (isLocked.value) return;
  loading.value = true;
  try {
    const response = await authStore.login(loginForm);
    if (response?.data?.token) {
      isSuccess.value = true;
      modalMessage.value = "Authenticating... Redirecting to dashboard.";
      showModal.value = true;
      setTimeout(() => router.push('/dashboard'), 1500);
    } else {
      handleFailure();
    }
  } catch (err) { handleFailure(); }
  finally { loading.value = false; }
};

const handleFailure = () => {
  failedAttempts.value++;
  triggerShake.value = true;
  setTimeout(() => triggerShake.value = false, 500);
  if (failedAttempts.value >= 3) {
    const unlockTime = Date.now() + (10 * 1000);
    localStorage.setItem('commission_unlock_time', unlockTime.toString());
    lockdownTimer.value = 10;
    startLockout();
  } else {
    isSuccess.value = false;
    modalMessage.value = `Access denied. ${3 - failedAttempts.value} attempts remaining.`;
    showModal.value = true;
  }
};

const startLockout = () => {
  isLocked.value = true;
  showModal.value = true;
  timerInterval = setInterval(() => {
    if (lockdownTimer.value > 0) {
      lockdownTimer.value--;
    } else {
      isLocked.value = false;
      showModal.value = false;
      localStorage.removeItem('commission_unlock_time');
      clearInterval(timerInterval);
    }
  }, 1000);
};
</script>,
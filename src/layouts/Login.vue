<template>
  <div class="min-h-screen flex items-center justify-center bg-[#FAF7F0] p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
    <div class="hidden sm:block absolute top-[-10%] left-[-10%] w-64 h-64 md:w-96 md:h-96 bg-[#C6011F] opacity-[0.03] rounded-full blur-3xl"></div>

    <Toast position="top-right" />

    <div 
      class="relative z-10 w-full max-w-[420px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden fade-in-up"
      :class="{ 'shake': triggerShake }"
    >
  

      <div class="bg-gray-50/50 border-b border-gray-100 py-8 px-6">
        <div class="flex flex-wrap justify-center items-center gap-6 sm:gap-10 mb-6">
          <img :src="FdcLogo" alt="FDC Logo" class="h-10 sm:h-14 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" />
          <div class="hidden xs:block w-[1.5px] h-10 bg-gray-300"></div>
          <img :src="CfiLogo" alt="CFI Logo" class="h-10 sm:h-14 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" />
        </div>
        
       
      <div class="bg-[#1A1A1A] py-6 px-4 sm:py-8 sm:px-8 text-center relative overflow-hidden">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#C6011F] opacity-20 blur-3xl rounded-full"></div>
        <h1 class="relative z-10 text-xl sm:text-2xl font-black text-white tracking-widest uppercase">
          COMMISSION <span class="text-[#fbbf24] font-medium ml-1">SYSTEM</span>
        </h1>
      </div>
         <div class="text-center" >
          <h2 class="text-xl sm:text-2xl font-gray text-gray-500 tracking-tight uppercase mt-3 " >
    Login
  </h2>
          <Transition name="fade">
            <div v-if="failedAttempts > 0" class="inline-flex items-center gap-1 mt-3 px-3 py-1 bg-red-50 text-red-600 rounded-full border border-red-100">
              <i class="pi pi-shield text-[10px]"></i>
              <p class="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                Attempt {{ failedAttempts }} of 3
              </p>
            </div>
          </Transition>
        </div>
      </div>

      <div class="p-6 sm:p-10 pt-8 sm:pt-8">
        <form @submit.prevent="submitLogin" class="space-y-5 sm:space-y-6">
          <div class="relative">
            <FloatLabel>
              <InputText
                id="username"
                v-model="loginForm.username"
                class="w-full p-inputtext-sm sm:p-inputtext-lg custom-input focus:ring-2 focus:ring-[#C6011F]/20" 
                :disabled="isLocked"
              />
              <label for="username" class="text-sm sm:text-base font-medium text-gray-500">Username</label>
            </FloatLabel>
          </div>

          <div class="relative">
            <FloatLabel>
              <Password
                id="password"
                v-model="loginForm.password"
                toggleMask
                :feedback="false"
                class="w-full"
                inputClass="w-full p-inputtext-sm sm:p-inputtext-lg custom-input focus:ring-2 focus:ring-[#C6011F]/20"
                :disabled="isLocked"
              />
              <label for="password" class="text-sm sm:text-base font-medium text-gray-500">Password</label>
            </FloatLabel>
          </div>

          <Button
            type="submit"
            :label="isLocked ? `LOCKED (${lockdownTimer}s)` : 'Sign In'"
            class="w-full py-3 sm:py-4 text-sm sm:text-base font-bold tracking-widest shadow-xl transition-all duration-200 active:scale-[0.98] rounded-xl border-none"
            :loading="loading"
            :disabled="loading || isLocked"
            :style="isLocked ? 'background-color: #9CA3AF;' : 'background-color: #C6011F;'"
          />
        </form>
      </div>
    </div>

    <Dialog 
      v-model:visible="showModal" 
      modal 
      :header="modalHeader" 
      :style="{ width: '90vw', maxWidth: '380px' }" 
      :closable="false"
      class="custom-dialog"
    >
      <div class="flex flex-col items-center justify-center pt-2 pb-4 text-center px-2">
        <div :class="statusClass" class="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-4 shadow-inner">
          <i :class="statusIcon" class="text-3xl sm:text-4xl"></i>
        </div>
        <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2">{{ modalTitle }}</h3>
        <p class="text-gray-500 text-xs sm:text-sm leading-relaxed px-2 sm:px-4">{{ modalMessage }}</p>
      </div>
      <template #footer>
        <div class="flex justify-center w-full pb-3 px-2 sm:px-4">
          <Button v-if="!isSuccess && !isLocked" label="Try Again" @click="showModal = false" class="w-full bg-[#1A1A1A] hover:bg-black border-none py-2 sm:py-3 rounded-xl font-bold text-sm sm:text-base" />
          <div v-if="isLocked" class="text-orange-600 font-bold bg-orange-50 px-4 py-2 sm:py-3 rounded-xl w-full text-center border border-orange-100 text-xs sm:text-sm">
            Unlocking in <span class="text-lg sm:text-xl mx-1">{{ lockdownTimer }}</span>s
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
/* Added w-auto and object-contain to ensure logos don't distort when larger */
img {
  max-width: 140px;
}

@media (max-width: 640px) {
  img {
    max-width: 100px;
  }
}

:deep(.custom-input) { 
  padding-top: 1.25rem; 
  padding-bottom: 0.4rem; 
  border-radius: 10px;
  background-color: #f9f9f9;
}

@media (min-width: 640px) {
  :deep(.custom-input) { 
    padding-top: 1.5rem; 
    padding-bottom: 0.5rem; 
    border-radius: 12px;
  }
}

.shake { 
  animation: shake-horizontal 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both; 
}
@keyframes shake-horizontal {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

.fade-in-up { 
  animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
  opacity: 0; 
  transform: translateY(30px); 
}
@keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

:deep(.custom-dialog) { border-radius: 20px; border: none; }
</style>

<script setup>
/* Logic (script setup) remains exactly as per your original provided code */
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth/authStore';
import FdcLogo from '@/assets/fdc.png';
import CfiLogo from '@/assets/cfi.png';

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

const modalHeader = computed(() => isLocked.value ? 'Access Restricted' : (isSuccess.value ? 'Success' : 'Authentication Failed'));
const modalTitle = computed(() => isLocked.value ? 'Temporary Lockout' : (isSuccess.value ? 'Welcome!' : 'Invalid Credentials'));
const statusClass = computed(() => isLocked.value ? 'bg-orange-100' : (isSuccess.value ? 'bg-green-100' : 'bg-red-100'));
const statusIcon = computed(() => isLocked.value ? 'pi pi-lock text-orange-600' : (isSuccess.value ? 'pi pi-check text-green-600' : 'pi pi-exclamation-triangle text-[#C6011F]'));

onMounted(() => { checkExistingLockout(); });
onUnmounted(() => { if (timerInterval) clearInterval(timerInterval); });

const checkExistingLockout = () => {
  const unlockTime = localStorage.getItem('commission_unlock_time');
  if (unlockTime) {
    const remaining = Math.ceil((parseInt(unlockTime) - Date.now()) / 1000);
    if (remaining > 0) {
      lockdownTimer.value = remaining;
      startCountdown();
    } else {
      localStorage.removeItem('commission_unlock_time');
    }
  }
};

const submitLogin = async () => {
  if (isLocked.value) return;
  loading.value = true;
  try {
    const response = await authStore.login(loginForm);
    if (response?.data?.token) {
      failedAttempts.value = 0;
      showFeedback(true, "Successfully authenticated. Redirecting...");
      setTimeout(() => router.push('/dashboard'), 2000);
    } else {
      handleFailure();
    }
  } catch (err) {
    handleFailure();
  } finally {
    loading.value = false;
  }
};

const handleFailure = () => {
  failedAttempts.value++;
  applyShake();
  if (failedAttempts.value >= 3) {
    const unlockTime = Date.now() + (10 * 1000);
    localStorage.setItem('commission_unlock_time', unlockTime.toString());
    lockdownTimer.value = 10; 
    startLockout();
  } else {
    showFeedback(false, `Wrong credentials. You have ${3 - failedAttempts.value} attempt(s) left.`);
  }
};

const startLockout = () => {
  isLocked.value = true;
  modalMessage.value = "Too many attempts. Your session is locked for 10 seconds.";
  showModal.value = true;
  startCountdown();
};

const startCountdown = () => {
  isLocked.value = true;
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (lockdownTimer.value > 0) {
      lockdownTimer.value--;
    } else {
      unlockAccount();
    }
  }, 1000);
};

const unlockAccount = () => {
  if (timerInterval) clearInterval(timerInterval);
  isLocked.value = false;
  failedAttempts.value = 0;
  showModal.value = false;
  localStorage.removeItem('commission_unlock_time');
};

const showFeedback = (success, msg) => {
  isSuccess.value = success;
  modalMessage.value = msg;
  showModal.value = true;
};

const applyShake = () => {
  triggerShake.value = true;
  setTimeout(() => { triggerShake.value = false; }, 500);
};
</script>

<style scoped>
:deep(.custom-input) { 
  padding-top: 1.25rem; 
  padding-bottom: 0.4rem; 
  border-radius: 10px;
  background-color: #f9f9f9;
}

@media (min-width: 640px) {
  :deep(.custom-input) { 
    padding-top: 1.5rem; 
    padding-bottom: 0.5rem; 
    border-radius: 12px;
  }
}

.shake { 
  animation: shake-horizontal 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both; 
}

@keyframes shake-horizontal {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

.fade-in-up { 
  animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
  opacity: 0; 
  transform: translateY(30px); 
}

@keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

:deep(.custom-dialog) { 
  border-radius: 20px; 
  border: none; 
}
</style>
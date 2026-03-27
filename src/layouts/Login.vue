<template>
  <div class="login-container">
    <div 
      class="min-h-screen w-full flex items-center justify-center p-4 font-sans relative overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed"
      :style="{ backgroundImage: `url(${BackgroundImage})` }"
    >
      <div class="absolute inset-0 bg-black/50 backdrop-blur-[2px] z-0"></div>

      <Toast position="top-right" />

      <div class="relative z-10 flex flex-col md:flex-row items-stretch justify-center w-full max-w-[650px] shadow-[0_30px_60px_rgba(0,0,0,0.5)] rounded-[24px] overflow-hidden fade-in-up bg-white">
        
        <div class="w-full md:w-5/12 bg-white/95 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-gray-100">
          <div class="flex flex-col items-center space-y-4">
            <img :src="FdcLogo" alt="First Datacorp" class="" style="width: 145px; height: auto;"/>
            <div class="w-8 h-[1px] bg-gray-200"></div>
            <div class="flex flex-col items-center space-y-2 text-center">
              <img :src="CfiLogo" alt="Commerce First" class="" style="width: 155px; height: auto;" />
            </div>
          </div>
        </div>

        <div 
          class="w-full md:w-7/12 flex flex-col bg-white"
          :class="{ 'shake': triggerShake }"
        >
          <div class="p-6 md:p-8 flex-grow">
            <div class="text-center mb-8">
              <h2 class="text-[22px] font-black text-gray-900 tracking-wider uppercase">Commission System</h2>
              <div class="w-6 h-0.5 bg-[#C6011F] mx-auto mt-1 rounded-full"></div>
            </div>

            <form @submit.prevent="submitLogin" class="space-y-6">
              <FloatLabel>
                <InputText id="username" v-model="loginForm.username" class="w-full custom-input" :disabled="isLocked" />
                <label for="username" class="font-bold text-gray-400 ml-1 text-xs">Username</label>
              </FloatLabel>

              <FloatLabel>
                <Password id="password" v-model="loginForm.password" toggleMask :feedback="false" class="w-full" inputClass="w-full custom-input" :disabled="isLocked" />
                <label for="password" class="font-bold text-gray-400 ml-1 text-xs">Password</label>
              </FloatLabel>

              <Button
                type="submit"
                :label="isLocked ? `LOCKED` : 'Login'"
                class="w-full py-3 text-xs font-black tracking-widest shadow-md rounded-lg border-none uppercase text-white transition-all active:scale-[0.98]"
                :style="isLocked ? 'background-color: #94a3b8;' : 'background-color: #C6011F;'"
                :loading="loading"
              />
            </form>

            
          </div>
        </div>
      </div>

      <Dialog 
        v-model:visible="showModal" 
        modal 
        :header="modalHeader" 
        :style="{ width: '85vw', maxWidth: '340px' }" 
        :closable="!isLocked" 
        class="custom-dialog"
      >
        <div class="flex flex-col items-center justify-center pt-6 pb-4 text-center px-4">
          <div :class="statusClass" class="w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <i :class="statusIcon" class="text-2xl"></i>
          </div>
          <h3 class="text-base md:text-lg font-black text-gray-900 mb-1.5">{{ modalTitle }}</h3>
          <p class="text-gray-400 font-medium text-[11px] md:text-xs leading-relaxed px-2">{{ modalMessage }}</p>
        </div>
        <template #footer>
          <div class="flex justify-center w-full pb-6 px-6">
            <Button v-if="!isSuccess && !isLocked" label="Try Again" @click="showModal = false" class="w-full bg-[#1A1A1A] border-none py-2.5 rounded-lg font-bold uppercase text-[10px] text-white" />
            <div v-if="isLocked" class="text-orange-600 font-black bg-orange-50 px-4 py-3 rounded-lg w-full text-center border border-orange-100 text-xs">
              Wait {{ lockdownTimer }}s
            </div>
          </div>
        </template>
      </Dialog>
    </div>
  </div>
</template>

<style scoped>
/* Improved FloatLabel Fix */
:deep(.p-float-label) {
  display: block;
  position: relative;
}

/* Base input styling */
:deep(.custom-input) { 
  padding: 1.2rem 0.8rem 0.5rem 0.8rem !important; /* Increased top padding to make room for label */
  border-radius: 10px !important;
  background-color: #F9FAFB !important;
  border: 1px solid #E5E7EB !important;
  font-size: 0.85rem !important;
  width: 100%;
}

:deep(.custom-input:focus) { 
  border-color: #C6011F !important;
  background-color: #fff !important;
  box-shadow: 0 0 0 2px rgba(198, 1, 31, 0.1) !important;
}

/* Force label positioning to prevent overlapping */
:deep(.p-float-label label) {
  left: 0.8rem;
  transition: all 0.2s ease;
  pointer-events: none;
}

/* Position when floating (focused or has value) */
:deep(.p-float-label input:focus ~ label),
:deep(.p-float-label input.p-filled ~ label),
:deep(.p-float-label .p-inputwrapper-focus ~ label),
:deep(.p-float-label .p-inputwrapper-filled ~ label) {
  top: 0.45rem !important; /* Moves label up into the top padding area */
  font-size: 0.65rem !important;
  color: #C6011F !important;
  font-weight: 800 !important;
}

/* Password wrapper adjustments */
:deep(.p-password) {
  width: 100%;
}

/* Animations */
.fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

.shake { animation: shake-horizontal 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both; }
@keyframes shake-horizontal {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
}

:deep(.custom-dialog) { border-radius: 20px; overflow: hidden; border: none; }
</style>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth/authStore';

// Assets
import BackgroundImage from '@/assets/bg.jpg';
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
    } else { handleFailure(); }
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
</script>
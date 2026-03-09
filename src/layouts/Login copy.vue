<template>
  <div class="min-h-screen flex items-center justify-center bg-[#FAF7F0] px-4 font-sans">
    <Toast position="top-right" />

    <div 
      class="w-full max-w-[400px] bg-white rounded-xl shadow-2xl border border-[#E2DFD2] overflow-hidden fade-in-up"
      :class="{ 'shake': triggerShake }"
    >
      <div class="bg-[#212121] p-6 text-center relative overflow-hidden">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#C6011F] opacity-20 blur-3xl rounded-full"></div>
        <h1 class="relative z-10 text-2xl font-bold text-white tracking-wider">
          COMMISSION <span class="text-[#fbbf24]">SYSTEM</span>
        </h1>
      </div>

      <div class="p-8">
        <div class="mb-6 text-center">
          <h2 class="text-xl font-semibold text-gray-800">Welcome Back</h2>
          <p class="text-gray-500 text-sm mt-1">Please enter your credentials</p>
          <p v-if="failedAttempts > 0" class="text-xs text-red-500 mt-2 font-bold uppercase tracking-tighter">
            Attempt {{ failedAttempts }} of 3
          </p>
        </div>

        <form @submit.prevent="submitLogin">
          <div class="mb-6">
            <FloatLabel>
              <InputText
                id="username"
                v-model="loginForm.username"
                class="w-full p-inputtext-md custom-input" 
                :disabled="isLocked"
              />
              <label for="username">Username</label>
            </FloatLabel>
          </div>

          <div class="mb-6">
            <FloatLabel>
              <Password
                id="password"
                v-model="loginForm.password"
                toggleMask
                :feedback="false"
                class="w-full"
                inputClass="w-full p-inputtext-md custom-input"
                :disabled="isLocked"
              />
              <label for="password">Password</label>
            </FloatLabel>
          </div>

          <Button
            type="submit"
            :label="isLocked ? `LOCKED (${lockdownTimer}s)` : 'Login as Microsoft Account'"
            class="w-full py-3 text-md font-bold tracking-wide shadow-lg"
            :loading="loading"
            :disabled="loading || isLocked"
            :style="isLocked ? 'background-color: #6b7280; border-color: #6b7280;' : 'background-color: #C6011F; border-color: #C6011F;'"
          />
        </form>
      </div>
    </div>

    <Dialog 
      v-model:visible="showModal" 
      modal 
      :header="modalHeader" 
      :style="{ width: '360px' }" 
      :closable="false"
      class="custom-dialog"
    >
      <div class="flex flex-col items-center justify-center p-6 text-center">
        <div :class="statusClass" class="w-20 h-20 rounded-full flex items-center justify-center mb-4">
          <i :class="statusIcon" class="text-4xl"></i>
        </div>
        
        <h3 class="text-lg font-bold text-gray-800 mb-2">{{ modalTitle }}</h3>
        <p class="text-gray-600 text-sm leading-relaxed">{{ modalMessage }}</p>
      </div>
      
      <template #footer>
        <div class="flex justify-center w-full pb-2">
          <Button 
            v-if="!isSuccess && !isLocked"
            label="Try Again" 
            @click="showModal = false" 
            class="w-full bg-[#212121] border-none"
          />
          <div v-if="isLocked" class="text-red-600 font-bold">
            Please wait {{ lockdownTimer }} seconds
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import { mapActions } from 'pinia';
import { useAuthStore } from '@/stores/auth/authStore';

export default {
  data() {
    return {
      loginForm: { username: '', password: '' },
      loading: false,
      showModal: false,
      isSuccess: false,
      isLocked: false,
      modalMessage: '',
      failedAttempts: 0,
      lockdownTimer: 180, // 3 minutes in seconds
      triggerShake: false,
      timerInterval: null
    };
  },
  computed: {
    modalHeader() { return this.isLocked ? 'System Locked' : (this.isSuccess ? 'Success' : 'Authentication Failed'); },
    modalTitle() { return this.isLocked ? 'Too Many Attempts' : (this.isSuccess ? 'Welcome!' : 'Access Denied'); },
    statusClass() { return this.isLocked ? 'bg-orange-100' : (this.isSuccess ? 'bg-green-100' : 'bg-red-100'); },
    statusIcon() { return this.isLocked ? 'pi pi-clock text-orange-600' : (this.isSuccess ? 'pi pi-check text-green-600' : 'pi pi-lock text-[#C6011F]'); }
  },
  methods: {
    ...mapActions(useAuthStore, ['login']),
    
    async submitLogin() {
      if (this.isLocked) return;

      this.loading = true;
      try {
        const response = await this.login(this.loginForm);

        if (response.data?.token) {
          this.failedAttempts = 0;
          this.showFeedback(true, "Redirecting to dashboard...");
          setTimeout(() => this.$router.push('/dashboard'), 2000);
        } else {
          this.handleFailure();
        }
      } catch (err) {
        this.handleFailure();
      } finally {
        this.loading = false;
      }
    },

    handleFailure() {
      this.failedAttempts++;
      this.applyShake();
      
      if (this.failedAttempts >= ) {
        this.startLockout();
      } else {
        this.showFeedback(false, `Invalid AD credentials. You have ${5 - this.failedAttempts} attempts remaining.`);
      }
    },

    showFeedback(success, msg) {
      this.isSuccess = success;
      this.modalMessage = msg;
      this.showModal = true;
    },

    startLockout() {
      this.isLocked = true;
      this.isSuccess = false;
      this.modalMessage = "Your account has been temporarily locked for 3 minutes due to multiple failed login attempts.";
      this.showModal = true;
      
      this.timerInterval = setInterval(() => {
        if (this.lockdownTimer > 0) {
          this.lockdownTimer--;
        } else {
          this.unlockAccount();
        }
      }, 1000);
    },

    unlockAccount() {
      clearInterval(this.timerInterval);
      this.isLocked = false;
      this.failedAttempts = 0;
      this.lockdownTimer = 180;
      this.showModal = false;
      this.$toast.add({ severity: 'info', summary: 'Unlocked', detail: 'You may try logging in again.', life: 3000 });
    },

    applyShake() {
      this.triggerShake = true;
      setTimeout(() => { this.triggerShake = false; }, 500);
    }
  }
};
</script>

<style scoped>
.shake { animation: shake-horizontal 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both; }
@keyframes shake-horizontal {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

.fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; transform: translateY(20px); }
@keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }

:deep(.custom-input) { padding-top: 1.2rem; padding-bottom: 0.4rem; border-radius: 8px; }
:deep(.custom-dialog) { border-radius: 16px; border: none; }
</style>
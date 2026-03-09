<template>
  <div class="h-screen flex overflow-hidden bg-white relative">
    
    <transition name="slide-side">
      <aside 
        v-if="!isToggled" 
        class="w-72 h-full side-panel flex flex-col overflow-y-auto fixed `left`-0 top-0 z-20 shadow-xl"
      >
        <LeftDrawer />
      </aside>
    </transition>

    <div 
      class="flex flex-1 flex-col h-full overflow-hidden transition-all duration-300 ease-in-out" 
      :class="isToggled ? 'ml-0' : 'ml-72'"
    >
      <Menubar class="w-full header-custom"> 
        <template #start>
          <i 
            class="pi pi-bars cursor-pointer hover:text-[#C6011F] transition-colors duration-200" 
            @click="toggleSidebar()"
          ></i> 
          <span class="ml-4 font-semibold text-lg">Dashboard</span>
        </template>
        <template #end>
          <Header />
        </template>
      </Menubar>

      <main class="flex-1 overflow-y-auto p-8 bg-[#F7F9FC]">
        <div class="w-full min-h-full">
          <router-view v-slot="{ Component }">
            <transition name="fade-page" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  
  </div>
</template>

<script>
import LeftDrawer from '../components/partials/LeftDrawer.vue';
import Header from '../components/partials/Header.vue';
import LeftDrawerIcon from '../components/partials/LeftDrawerIcon.vue';
export default {
  name: 'Main',
  components: {
    LeftDrawer,
    Header,LeftDrawerIcon
  },
  data() {
    return {
      isToggled: false,
    }
  },
  methods: {
    toggleSidebar() {
      this.isToggled = !this.isToggled;
    },
  }
};
</script>

<style scoped>
/* 1. Sidebar Slide Animation */
.slide-side-enter-active,
.slide-side-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-side-enter-from,
.slide-side-leave-to {
  transform: translateX(-100%);
}

/* 2. Page Content Fade (Optional but recommended) */
.fade-page-enter-active,
.fade-page-leave-active {
  transition: opacity 0.2s ease;
}

.fade-page-enter-from,
.fade-page-leave-to {
  opacity: 0;
}

/* Ensure the side-panel has its specific color from your screenshots */
.side-panel {
  background-color: #2a2a2a; /* Dark gray from your sidebar screenshot */
}

/* Custom Header styling to match your previous UI */
.header-custom {
  border-bottom: 1px solid #E2DFD2;
  background: white;
  padding: 0.5rem 1.5rem;
}
</style>
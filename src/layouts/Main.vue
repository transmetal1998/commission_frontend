<template>
  <div class="h-screen flex overflow-hidden bg-white relative">
    
<aside 
  class="h-full side-panel flex flex-col fixed left-0 top-0 z-20 shadow-xl transition-all duration-300 overflow-hidden"
  :class="isToggled ? 'w-20' : 'w-72'"
>
  <component :is="isToggled ? 'LeftDrawerIcon' : 'LeftDrawer'" />
</aside>

    <div 
      class="flex flex-1 flex-col h-full overflow-hidden transition-all duration-300 ease-in-out" 
      :class="isToggled ? 'ml-20' : 'ml-72'"
    >
      <Menubar class="w-full header-custom"> 
        <template #start>
          <i 
            class="pi pi-bars cursor-pointer hover:text-[#C6011F] transition-colors duration-200" 
            @click="toggleSidebar()"
          ></i> 
          <!-- <span class="ml-4 font-semibold text-lg">Dashboard</span> -->
        </template>
        <template #end>
          <Header />
        </template>
      </Menubar>

      <main class="flex-1 overflow-y-auto p-8 bg-[#F7F9FC]">
        <div class="w-full min-h-full">
          <router-view v-slot="{ Component }">
              <component :is="Component" />
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
.slide-side-enter-active,
.slide-side-leave-active {
  transition: all 0.3s ease;
}

.slide-side-enter-from,
.slide-side-leave-to {
  opacity: 0;
  transform: translateX(-10px);
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
  background-color: #334155; /* Dark gray from your sidebar screenshot */
}

/* Custom Header styling to match your previous UI */
.header-custom {
  border-bottom: 1px solid #E2DFD2;
  background: white;
  padding: 0.5rem 1.5rem;
}
</style>
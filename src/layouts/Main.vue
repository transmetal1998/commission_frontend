<template>

  <div class="h-screen flex overflow-hidden bg-white">
 
    <aside v-if="!isToggled" class="w-72 h-full side-panel  flex-col overflow-y-auto fixed left-0 top-0 hidden md:flex">
      <LeftDrawer></LeftDrawer>
    </aside>

    <div class="flex flex-1 flex-col h-full overflow-hidden" :class="isToggled ? 'ml-0' : 'ml-72'">
      <!-- Header -->
      <Menubar class="w-full header-custom" > 
        <template #start>
          <i class="pi pi-bars cursor-pointer" @click="toggleSidebar()"></i> 
          <span class="ml-2 font-semibold">
            Management Information System
          </span>
        </template>
        <template #end>
          <Header></Header>
        </template>
      </Menubar>

      <!-- Scrollable Main Content -->
      <main class="flex-1 overflow-y-auto p-[32px] gap-[32px] bg-[#F7F9FC]">
        <div class="w-full overflow-x-auto">
          <router-view></router-view>
        </div>
      </main>
    </div>
  
  </div>
</template>

  
  <script>
  import NewUserLogin from '@/components/partials/NewUserLogin.vue';
  import LeftDrawer from '../components/partials/LeftDrawer.vue';
  import Header from '../components/partials/Header.vue';
  
  export default {
    name: 'Main',
    components: {
      LeftDrawer,
      Header,
      NewUserLogin
    },
    data() {
      return {
        visible: false,
        isToggled: false,
      }
    },
    async mounted() {

    },
    computed: {
        
    },
    methods: {
      toggleSidebar() {
        this.isToggled = !this.isToggled;
        
      },
    }
  };
  </script>
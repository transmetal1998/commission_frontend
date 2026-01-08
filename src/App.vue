<template>
    <Toast />
    <router-view />
</template>
<script>
import { mapActions } from 'pinia';
import { useModuleStore } from '@/stores/general/moduleStore';
export default {
  name: 'App',
  computed: {

  },
  methods: {
    ...mapActions(useModuleStore, {
        setModuleLoading: 'setModuleLoading'
    }),
  },
  mounted() {
    this.setModuleLoading(true); 
    setTimeout(() => {
      this.setModuleLoading(false);
    }, 600);
  },
  
}
</script>

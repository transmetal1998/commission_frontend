
<template>
        <div class="grid justify-end">
            <div class="flex place-items-center pl-2 gap-3 cursor-pointer" @click="toggle" style="border-left: 2px solid #E0E3E8;">
                <!-- <Divider layout="vertical" /> -->
                <Avatar label="M" class="mr-2" size="medium" shape="circle"/>
                <TieredMenu ref="menu" id="overlay_tmenu" :model="items" popup />
                <!-- <span class="font-bold"> {{ this.profile.fullName }} </span> -->
                <span class="pi pi-angle-down"></span>
            </div>
        </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '@/stores/auth/authStore'; 
export default {
    computed: {
        
    },
    data() {
        return {
            items: [
                {
                    label: 'Logout',
                    icon: 'pi pi-sign-out',
                    command: () => this.handleItemClick({ label: 'Logout', route: '/' })
                }
            ]
        };
    },
    beforeMount() {

        this.fetchProfile();

    },
    computed: {
      ...mapState(useAuthStore, {
        profile: 'profile'
      }),  
    },
    methods: {
        ...mapActions(useAuthStore, { 
            postLogout: 'logout',
            fetchProfile: 'fetchProfile'
        }),
        async handleItemClick(item) {
                
            if (item.label == 'Logout' && item.route == '/') {        
                await this.postLogout();
            }

        },
        getAcronym(data) {
            const first_name = (data.first_name || '').trim();
            const last_name = (data.last_name || '').trim();

            const first = first_name.charAt(0).toUpperCase();
            const second = last_name.charAt(0).toUpperCase();

            return first + second || 'N/A';
        },
        toggle(event) {
            this.$refs.menu.toggle(event);
        }
    }
    
};
</script>
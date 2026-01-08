import { defineStore } from 'pinia';
import { api } from '@/boot/axios';

export const useUserStore = defineStore('userStore', {
    state: () => ({
        profiles: [],
        response: [],
        permissions: [],
        is_system_admin: false,
        loading: false,
    }),
    getters: {
        getProfile (state) {
            return state.profiles;
        },
        getResponse (state) {
            return state.response;
        },
        getPermission(state) {
            return state.permissions;
        },
        isSystemAdmin(state) {
            return state.is_system_admin
        },
        isLoading(state) {
            return state.loading;
        }
    },
    actions: {
        setLoading(value) {
            this.loading = value;
        },
        setSystemAdmin(value) {
            this.is_system_admin = value
        },
        async fetchProfile() {
            try {

                const response = await api.get('/auth/profile');
                this.profiles = response.data.data
                this.permissions = this.profiles.role.permissions;

                return response.data.data;

            } catch (error) {

                throw error;

            }
        },
        async updatePassword(data, res) {
            try {

                const response = await api.post('/profile/password/update', {
                    password: data.password,
                    password_confirmation: data.password_confirmation
                });

                return response.data;

            } catch (err) {

                this.error = err.response?.data?.message || 'An error occurred';
                console.error(this.error);
                return err.response?.data;
            
            }
        }
    }
});

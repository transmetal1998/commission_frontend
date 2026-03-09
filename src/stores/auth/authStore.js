import { defineStore } from 'pinia';
import { api } from '@/boot/axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: sessionStorage.getItem('authToken') || null,
        loading: false,
        profile: null,
        users: [],
        user_list: []
    }),
    getters: {
        isAuthenticated (state) {
            return !!state.token; // Return true if there's a valid token
        },
        isUsers(state) {
            return state.users;
        }
    },
    actions: {
        setLoading(value) {
            this.loading = value;
        },
        async fetchProfile() {
            try {
                if (!this.token) {
                    return false;
                }
                const response = await api.get('/user/profile');
                this.profile = response.data;
                return true;

            } catch (err) {
                
                this.token = null;
                sessionStorage.clear();
                return false;
            
            }
        },
        async fetchUserList() {
            try {

                const response = await api.get('/Ad/users');
                this.user_list = response.data;
                return true;

            } catch (err) {
                
                this.token = null;
                return false;
            
            }
        },
        async login(data) {
            try {
                /** For API login and set the auth token */
                const response = await api.post('/Auth/login', {
                    username: data.username,
                    password: data.password,
                });

                const token = response.data.token;
  
                sessionStorage.setItem('authToken', token);
                this.token = token;

                return response.data;

            } catch (err) {

                if (err.response) {
                    const status = err.response.status; // 400, 401, 500, etc.
                    const message = err.response.data?.message || 'An error occurred';

                    console.error(`HTTP ${status}: ${message}`);
                    this.error = message;

                    // You can handle different statuses differently
                    if (status === 400) {
                        // Bad Request
                        console.warn('Bad request: probably invalid input');
                    } else if (status === 401) {
                        // Unauthorized
                        console.warn('Unauthorized: invalid credentials');
                    }

                    return { status, message };
                } else {
                    // Network error or no response
                    this.error = 'Network error';
                    console.error(this.error);
                    return { status: null, message: this.error };
                }
            }
        },
        async logout() {
            try {

                /** Call the API Logout and remove the authentication from local storage */
                // const response = await api.post('/auth/logout');
                sessionStorage.clear();
                location.href = '/'
                
                return response.data;

            } catch (err) {
                return err.response?.data;
            }            
        },
        async forgotPassword(data, res) {
            try {

                /** For API login and set the auth token and tenant id */
                const response = await api.post('/forgot-password', {
                    email: data.email
                });

                return response.data;

            } catch (err) {

                this.error = err.response?.data?.message || 'An error occurred';
                console.error(this.error);
                return err.response?.data;

            }
        },
        async verifyToken(data, res) {
            try {

                /** For API login and set the auth token and tenant id */
                const response = await api.post('/verify-token', {
                    token: data.token,
                    email: data.email
                });

                return response.data;

            } catch (err) {

                this.error = err.response?.data?.message || 'An error occurred';
                console.error(this.error);
                return err.response?.data;

            }          
        },
        async resetPassword(data, res) {
            try {

                /** Reset a password */
                const response = await api.post('/reset-password', {
                    token: data.token,
                    email: data.email,
                    password: data.password,
                    password_confirmation: data.password_confirmation
                });

                return response.data;

            } catch (err) {

                this.error = err.response?.data?.message || 'An error occurred';
                console.error(this.error);
                return err.response?.data;

            }
        },
        async postUser(data, res) {
            try {
                const response = await api.post('/user', {
                    Username: data.Username,
                    PasswordHash: data.PasswordHash,
                    Fullname: data.Fullname,
                    Role: data.Role
                });

                return response.data;

            } catch (err) {

                this.error = err.response?.data?.message || 'An error occurred';
                console.error(this.error);
                return err.response?.data;

            }
        },
        async putUser(data, res) {
            try {
                const response = await api.post(`/user/${data.id}`, {
                    Username: data.Username,
                    PasswordHash: data.PasswordHash,
                    Fullname: data.Fullname,
                    Role: data.Role
                });

                return response.data;

            } catch (err) {

                this.error = err.response?.data?.message || 'An error occurred';
                console.error(this.error);
                return err.response?.data;

            }
        },
        async fetchUser() {
            try {
                const response = await api.get('/user');
                this.users = response.data;
                return true;

            } catch (err) {
                this.error = err.response?.data?.message || 'An error occurred';
                console.error(this.error);
                return false;
            
            }
        },
    }
});

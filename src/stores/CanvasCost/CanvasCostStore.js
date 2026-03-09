import { defineStore } from 'pinia';
import { api } from '@/boot/axios';

export const useAuthStore = defineStore('canvascost', {
    state: () => ({
        canvascost_list:{
        }
          
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
       
        async fetchCanvas() {
            try {
                if (!this.token) {
                    return false;
                }
                const response = await api.get('/CanvasCostSummary');
                this.canvascost_list = response.data;
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
        async postCanvasCost(data) {
            try {
                /** For API login and set the auth token */
                const response = await api.post('/CanvasCostSummary', {
                    salesOrderNo : data.salesOrderNo,
                    customerRefNo: data.customerRefNo,
                    customerName : data.customerName,
                    customerName: data.customerName, 
                    businesUnit : data.businesUnit,
                    pdexRate: data.pdexRate,   
                    corporate : data.corporate,
                    yearCategory: data.yearCategory


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
    }
});

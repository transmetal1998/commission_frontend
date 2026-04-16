import { defineStore } from 'pinia';
import { api } from '@/boot/axios';

export const useHurdle = defineStore('hurdle', {
    state: () => ({
        hurdleList: [],
          
    }),
    getters: {
        gethurdleList(state) {
            return state.hurdleList;
        },
        
    },
    actions: {
       async fetchHurdleList() {
            try {
                
                const response = await api.get('/HurdleRate');
                this.hurdleList = response.data;
                return true;

            } catch (err) {
                
                console.log('Error fetching hurdle list:', err);
                return false;
            
            }
        },
        
        async fetchhurdleAddonsChargesByHeader(id) {
            try {
                
                const response = await api.get(`/hurdleAddonsCharges/header/${id}`);
                this.hurdleAddonsCharges = response.data;
                return true;

            } catch (err) {
                
                console.log('Error fetching canvas cost addons charges:', err);
                return false;
            
            }
        },

        async postHurdle(data) {
            try {
                /** For API login and set the auth token */
                const response = await api.post('/HurdleRate', {
                    userCode : data.userCode,
                    hurdleBasis: data.hurdleBasis,
                    targetAmount : data.targetAmount,
                    hurdlePercent: data.hurdlePercent,
                    targetYear: data.targetYear,
                });

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
        async updatehurdle(data, id) {
            try {
                /** For API login and set the auth token */
                const response = await api.put(`/hurdleRate/${id}`, {
                    id: id,
                    userCode : data.userCode,
                    hurdleBasis: data.hurdleBasis,
                    targetAmount : data.targetAmount,
                    hurdlePercent: data.hurdlePercent,
                    targetYear: data.targetYear,
                });

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
        
        async deletehurdleDetail(data) {
            try {
                /** For API login and set the auth token */
                const response = await api.post('/hurdleDetails/bulk-delete', data);
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

import { defineStore } from 'pinia';
import { api } from '@/boot/axios';

export const useSalesQuota = defineStore('salesQuota', {
    state: () => ({
        salesQuotaList: [],
          
    }),
    getters: {
        getSalesQuotaList(state) {
            return state.salesQuotaList;
        },
        
    },
    actions: {
       async fetchSalesQuota() {
            try {
                
                const response = await api.get('/SalesQuota');
                this.salesQuotaList = response.data;
                return true;

            } catch (err) {
                
                console.log('Error fetching salesQuota list:', err);
                return false;
            
            }
        },
        
        async postSalesQuota(data) {
            try {
                /** For API login and set the auth token */
                const response = await api.post('/SalesQuota', {
                    businessUnit : data.businessUnit,
                    quota: data.quota,
                    targetYear : data.targetYear                    
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
        async updateSalesQuota(data, id) {
            try {
                /** For API login and set the auth token */
                const response = await api.put(`/SalesQuota/${id}`, {
                    id: id,
                    businessUnit : data.businessUnit,
                    quota: data.quota,
                    targetYear : data.targetYear
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
        
        async deletesalesQuotaDetail(data) {
            try {
                /** For API login and set the auth token */
                const response = await api.post('/salesQuotaDetails/bulk-delete', data);
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

import { defineStore } from 'pinia';
import { api } from '@/boot/axios';

export const useSalesCommissionRateServices = defineStore('salesCommissionRateServices', {
    state: () => ({
        salesCommissionRateServicesList: [],          
    }),
    getters: {
        getsalesCommissionRateServicesList(state) {
            return state.salesCommissionRateServicesList;
        },        
    },
    actions: {
        async fetchSalesCommissionRateServicesList() {
            try {
                
                const response = await api.get('/SalesCommissionRateServices');
                this.salesCommissionRateServicesList = response.data;
                return true;

            } catch (err) {
                
                console.log('Error fetching sales commission rate list:', err);
                return false;
            
            }
        },

        async postSalesCommissionRateServices(data) {
            try {
                /** For API login and set the auth token */
                const response = await api.post('/SalesCommissionRateServices', {
                    businessUnit : data.businessUnit,
                    rateCommissionOnBilling: data.rateCommissionOnBilling,
                    type: data.typeYear,
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

        async updateSalesCommissionRateServices(data, id) {
            try {
                /** For API login and set the auth token */
                const response = await api.put(`/SalesCommissionRateServices/${id}`, {
                    id: id,
                    businessUnit: data.businessUnit,
                    rateCommissionOnBilling: data.rateCommissionOnBilling,
                    type: data.typeYear,
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
        
        async deleteSalesCommissionRate(data) {
            try {
                /** For API login and set the auth token */
                const response = await api.post('/SalesCommissionRateServices/bulk-delete', data);
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

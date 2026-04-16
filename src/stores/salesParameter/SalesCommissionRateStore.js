import { defineStore } from 'pinia';
import { api } from '@/boot/axios';

export const useSalesCommissionRate = defineStore('salesCommissionRate', {
    state: () => ({
        salesCommissionRateList: [],
          
    }),
    getters: {
        getSalesCommissionRateList(state) {
            return state.salesCommissionRateList;
        },
        
    },
    actions: {
       async fetchSalesCommissionRateList() {
            try {
                
                const response = await api.get('/SalesCommissionRate');
                this.salesCommissionRateList = response.data;
                return true;

            } catch (err) {
                
                console.log('Error fetching sales commission rate list:', err);
                return false;
            
            }
        },
        
        async postSalesCommissionRate(data) {
            try {
                /** For API login and set the auth token */
                const response = await api.post('/SalesCommissionRate', {
                    marginFrom : data.marginFrom,
                    marginTo: data.marginTo,
                    rateCommissionMargin : data.rateCommissionMargin,
                    typeYear: data.typeYear,
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
        async updateSalesCommissionRate(data, id) {
            try {
                /** For API login and set the auth token */
                const response = await api.put(`/SalesCommissionRate/${id}`, {
                    id: id,
                    marginFrom : data.marginFrom,
                    marginTo: data.marginTo,
                    rateCommissionMargin : data.rateCommissionMargin,
                    typeYear: data.typeYear,
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
                const response = await api.post('/SalesCommissionRate/bulk-delete', data);
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

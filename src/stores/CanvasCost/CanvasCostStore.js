import { defineStore } from 'pinia';
import { api } from '@/boot/axios';

export const useCanvasCost = defineStore('canvasCost', {
    state: () => ({
        canvasCostList: [],
        canvasCostHeaderDetails: [],
        canvassCostDetails: [],
        productCodeList: []
          
    }),
    getters: {
        getCanvasCostList(state) {
            return state.canvasCostList;
        },
        getCanvassCostDetails(state) {
            return state.canvassCostDetails;
        },
        getCanvasCostHeaderDetails(state) {
            return state.canvasCostHeaderDetails;
        },
        getProductCodeList(state) {
            return state.productCodeList;
        }
    },
    actions: {
       async fetchProductList() {
            try {
                
                const response = await api.get('/ItemSap');
                this.productCodeList = response.data;
                return true;

            } catch (err) {
                
                console.log('Error fetching product list:', err);
                return false;
            
            }
        },
        async fetchCanvas() {
            try {
                
                const response = await api.get('/CanvasCostSummary');
                this.canvasCostList = response.data;
                return true;

            } catch (err) {
                
                return false;
            
            }
        },
        async fetchCanvasHeaderDetails(id) {
            try {
                
                const response = await api.get(`/CanvasCostSummary/${id}`);
                this.canvasCostHeaderDetails = response.data;
                return true;

            } catch (err) {
                
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
                    yearCategory: data.yearCategory,
                    status: data.status,
                    createdSalesAgentBy: data.createdSalesAgentBy
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
        async postCanvasCostDetail(data) {
            try {
                /** For API login and set the auth token */
                const response = await api.post('/CanvasCostDetails', [{
                    canvasCostHeaderId: data.canvasCostHeaderId,
                    productCode: data.productCode,
                    description: data.description,
                    category: data.category,
                    quantity: data.quantity,  
                    spUnitVat: data.spUnitVat,
                    spQtyVat: data.spQtyVat,
                    spUnitWoVat: data.spUnitWoVat,
                    spQtyWoVat: data.spQtyWoVat,
                    poRefDate: data.poRefDate,
                    recommendedSupplier: data.recommendedSupplier,
                    costUnitVat: data.costUnitVat,
                    costQuantityVat: data.costQuantityVat,
                    costUnitWoVat: data.costUnitWoVat,
                    costQuantityWoVat: data.costQuantityWoVat,
                    profitMarginWoVat: data.profitMarginWoVat,
                    profitMargin: data.profitMargin,
                    targetSellingPriceVat: data.targetSellingPriceVat
                }]);

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
        async fetchCanvassDetails(id) {
            try {
                console.log('Fetching details for ID:', id);
                const response = await api.get(`/CanvasCostDetails/header/${id}`);
                this.canvassCostDetails = response.data;
                return true;

            } catch (err) {
                
                this.token = null;
                return false;
            
            }
        },
    }
});

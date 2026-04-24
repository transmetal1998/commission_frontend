import { defineStore } from 'pinia';
import { api } from '@/boot/axios';

export const useCanvasCost = defineStore('canvasCost', {
    state: () => ({
        canvasCostList: [],
        canvasCostHeaderDetails: [],
        canvassCostDetails: [],
        productCodeList: [],
        addonsListByCategory: [],
        addonsListByType: [],
        canvasCostAddonsCharges: [],
        synchingSAP: [],
        assignAmPmList: [],
          
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
        },
        getAddonsListByCategory(state) { 
            return state.addonsListByCategory;            
        },
        getAddonsListByType(state) {
            return state.addonsListByType;
        },
        getCanvasCostAddonsCharges(state) {
            return state.canvasCostAddonsCharges;
        },
        getSynchingSAP(state){
            return state.synchingSAP;
        },
        getAssignAmPmList(state) {
            return state.assignAmPmList;
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
        async fetchProductSynchingSAP() {
            try {
                
                const response = await api.post('/ItemSap/sync');
                this.synchingSAP = response.data;
                return true;

            } catch (err) {
                
                console.log('Error fetching synching SAP data:', err);
                return false;
            
            }
        },
        async fetchCanvasCostAddonsChargesByHeader(id) {
            try {
                
                const response = await api.get(`/CanvasCostAddonsCharges/header/${id}`);
                this.canvasCostAddonsCharges = response.data;
                return true;

            } catch (err) {
                
                console.log('Error fetching canvas cost addons charges:', err);
                return false;
            
            }
        },
        async fetchAddonsListByCategory() {
            try {
                
                const response = await api.get('/AddonsList/categories');
                this.addonsListByCategory = response.data;
                return true;

            } catch (err) {
                
                console.log('Error fetching addons list:', err);
                return false;
            
            }
        },
        async fetchAddonsListByType(selectedCategory) {
            try {
                const response = await api.get(`/AddonsList/types?category=${selectedCategory}`);
                this.addonsListByType = response.data;
                return true;

            } catch (err) {
                
                console.log('Error fetching addons list:', err);
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
                    salesOrderDate: data.salesOrderDate,
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
        async updateCanvasCost(data, id) {
            try {
                /** For API login and set the auth token */
                const response = await api.put(`/CanvasCostSummary/${id}`, {
                    id: id,
                    salesOrderNo : data.salesOrderNo,
                    customerRefNo: data.customerRefNo,
                    customerName : data.customerName,
                    customerName: data.customerName, 
                    businesUnit : data.businesUnit,
                    salesOrderDate: data.salesOrderDate,
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
        async updateCanvasCostAssignAmPm(data, id) {
            try {
                /** For API login and set the auth token */
                const response = await api.put(`/CanvasCostSummary/assignAmPm/${id}`, {
                    id: id,
                    assignAm : data.assignAm,
                    assignPm: data.assignPm
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
                    itemCategory: data.itemCategory,
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

         async updateCanvasCostDetail(data, id) {
            try {
                /** For API login and set the auth token */
                const response = await api.put(`/CanvasCostDetails/${id}`, {
                    id: id,
                    canvasCostHeaderId: data.canvasCostHeaderId,
                    productCode: data.productCode,
                    description: data.description,
                    itemCategory: data.itemCategory,
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


        async postCanvasCostAddons(data) {
            try {
                /** For API login and set the auth token */
                const response = await api.post('/CanvasCostAddonsCharges', [{
                    canvasCostHeaderId: data.canvasCostHeaderId,
                    category: data.category,
                    type: data.type,
                    quantity: data.quantity,  
                    spUnitVat: data.spUnitVat,
                    spQtyVat: 0.00,
                    spUnitWoVat: 0.00,
                    spQtyWoVat: 0.00,
                    costUnitVat: data.costUnitVat,
                    costQuantityVat: 0.00,
                    costUnitWoVat: 0.00,
                    costQuantityWoVat: 0.00,
                    profitMarginWoVat: 0.00,
                    profitMargin: 0.00
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
        async deleteCanvasCostDetail(data) {
            try {
                /** For API login and set the auth token */
                const response = await api.post('/CanvasCostDetails/bulk-delete', data);
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
        
        async exportFunction(id, data) {
        try {
            const response = await api.get(`/CanvasCostSummary/exportExcel/${id}`, {
            responseType: "blob" // ✅ IMPORTANT
            });

            // ✅ Get filename (if backend sends Content-Disposition)
            const disposition = response.headers?.["content-disposition"];
            let filename = `CCS_${data.salesOrderNo}_${data.customerName}.xlsx`;

            if (disposition && disposition.includes("filename=")) {
            filename = disposition.split("filename=")[1].replace(/"/g, "").trim();
            }

            // ✅ Create blob and trigger download
            const contentType =
            response.headers?.["content-type"] ||
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

            const blob = new Blob([response.data], { type: contentType });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();

            a.remove();
            window.URL.revokeObjectURL(url);

            return true;
        } catch (err) {
            console.log("Error exporting canvas cost:", err);
            throw err; // better than return false so your .catch works properly
        }
        }

    }
});

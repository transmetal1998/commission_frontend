import { defineStore } from 'pinia';
import { api } from '@/boot/axios';

export const useSalesCommission = defineStore('salesCommission', {
    state: () => ({
        salesCommissionHeader: [],
        salesCommissionDetail: [],
          
    }),
    getters: {
        getSalesCommissionHeader(state) {
            return state.salesCommissionHeader;
        },
        getSalesCommissionDetail(state) {
            return state.salesCommissionDetail;
        }
        
    },
    actions: {
       async fetchSalesCommissionHeader(data) {
            try {
                
                const response = await api.post('/ProfitabilityReport/summary-by-salesperson',
                    {
                        fromDate: data.fromDate,
                        toDate: data.toDate,
                    }
                );
                this.salesCommissionHeader = response.data;
                return true;

            } catch (err) {
                
                console.log('Error fetching sales commission header:', err);
                return false;
            
            }
        },
        async fetchSalesCommissionDetail(data) {
            try {
                
                const response = await api.get(`/ProfitabilityReport?fromDate=${data.fromDate}&toDate=${data.toDate}&salesPerson=${data.salesPersonUser}`);
                this.salesCommissionDetail = response.data;
                return true;

            } catch (err) {
                
                console.log('Error fetching sales commission detail:', err);
                return false;
            
            }
        },
                
        
       
    }
});

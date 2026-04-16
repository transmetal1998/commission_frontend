import { defineStore } from 'pinia';
import { api } from '@/boot/axios';

export const useAssociateSales = defineStore('associateSales', {
    state: () => ({
        associateSalesList: [],
          
    }),
    getters: {
        getAssociateSalesList(state) {
            return state.associateSalesList;
        },
        
    },
    actions: {
       async fetchAssociateSalesList() {
            try {
                
                const response = await api.get('/Ad/get-all-associates-sales');
                this.associateSalesList = response.data;
                return true;

            } catch (err) {
                
                console.log('Error fetching associate sales list:', err);
                return false;
            
            }
        },
        
       
    }
});

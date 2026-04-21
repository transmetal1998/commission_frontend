import { defineStore } from 'pinia';
import { api } from '@/boot/axios';

export const useBusinessUnit = defineStore('businessUnit', {
    state: () => ({
        businessUnitList: [],
          
    }),
    getters: {
        getBusinessUnitList(state) {
            return state.businessUnitList;
        },
        
    },
    actions: {
       async fetchBusinessUnitList() {
            try {
                
                const response = await api.get('/Ad/get-business-unit');
                this.businessUnitList = response.data;
                return true;

            } catch (err) {
                
                console.log('Error fetching business unit list:', err);
                return false;
            
            }
        },
        
       
    }
});

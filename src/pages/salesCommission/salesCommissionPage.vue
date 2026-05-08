<template>
    <div>
        <div class="mb-4">
            <h1 class="text-2xl text-gray-400">Sales Commission</h1>
        </div>
    </div>
   <div class="flex flex-row gap-4">
       <div class="w-full">
            <Card>
                <template #content>   

                <!-- Header -->
                <div class="flex justify-between items-center mb-4">

                    <!-- <Button 
                        icon="pi pi-plus" 
                        severity="primary"  
                        size="small"
                        @click="showHurdleRateModal()"  
                    /> -->

                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>

                        <InputText 
                            size="small" 
                            v-model="search"
                            placeholder="Search"
                        />
                    </IconField>

                </div>

                <!-- Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-3 gap-4">

                    <div
  v-for="item in filteredSalesCommissionHeader"
  :key="item.salesPerson"
  class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer"
  @click="goToDetail(item.salesPerson)"
>
  <!-- Top -->
  <div class="flex justify-between items-start mb-4">
    <div>
      <h2 class="text-base font-bold text-gray-800 leading-tight">
        {{ item.salesPersonFullname || 'No Name' }}
      </h2>
      <p class="text-xs text-gray-400 mt-1">
        {{ item.salesPerson }}
      </p>
    </div>
  </div>

  <div class="border-t border-gray-100 mb-4"></div>

  <div class="mb-3">
    <div class="text-xs text-gray-400 mb-1">Gross Profit</div>
    <div class="text-[#334155] text-xl font-bold">
      ₱ {{ Number(item.totalGrossProfit).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
    </div>
  </div>

  <div class="mb-4">
    <div class="text-xs text-gray-400 mb-1">Total Cost</div>
    <div class="text-red-500 text-lg font-semibold">
      ₱ {{ Number(item.totalCost).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
    </div>
  </div>
</div>

                </div>


                </template>
            </Card>


       </div>
      
   </div>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useHurdle } from '@/stores/salesParameter/HurdleStore';
import { useSalesCommission } from '@/stores/salesCommission/salesCommissionStore';
import moment from "moment";

export default {
  data() {
    return {
      
        localHurdleList: [],

        fromDate: '',
        toDate: '',
        localSalesCommissionHeader: [],

        selectedAssociate: null,
        selectedTarget: '',
        selectedTargetAmount: null,
        selectedTargetYear: null,
        yearOptions: [],

        hurdleRateFilters: {
          global: { value: null, matchMode: 'contains' },
          category: { value: null, matchMode: 'contains' },
          type: { value: null, matchMode: 'contains' }
        },

        SalesCommissionFilters: {
          global: { value: null, matchMode: 'contains' },
          category: { value: null, matchMode: 'contains' },
          type: { value: null, matchMode: 'contains' }
        },

        visible: false,
        isForUpdate: false,
        selectedId: null,

    }
  },
  computed: {
    ...mapState(useHurdle, {
            hurdleList: 'hurdleList'
        }),
    ...mapState(useSalesCommission, {
            salesCommissionHeader: 'salesCommissionHeader'
        }),
      filteredSalesCommissionHeader() {

        if (!this.search) {
            return this.localSalesCommissionHeader;
        }

        return this.localSalesCommissionHeader.filter(x =>
            (x.salesPersonFullname || '')
                .toLowerCase()
                .includes(this.search.toLowerCase())
        );
    }
  },
  async mounted() {

    const today = new Date();

    // First day of current year
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

    // Format YYYY-MM-DD
    this.fromDate = firstDayOfYear.toISOString().split('T')[0];
    this.toDate = today.toISOString().split('T')[0];
  
    await this.fetchHurdleList();
    this.localHurdleList = this.hurdleList;
    
    await this.fetchSalesCommissionHeader({ fromDate: this.fromDate, toDate: this.toDate });
    this.localSalesCommissionHeader = this.salesCommissionHeader;
      
  

  },
  methods: {
    ...mapActions(useHurdle, {
            fetchHurdleList: 'fetchHurdleList',   
            postHurdle: 'postHurdle',
            updatehurdle: 'updatehurdle'
        }),
    ...mapActions(useSalesCommission, {
            fetchSalesCommissionHeader: 'fetchSalesCommissionHeader'
        }),

        
    goToDetail(salesPersonUser) {
      this.$router.push({
        name: "SalesCoreDetail",
        params: { salesPersonUser: encodeURIComponent(salesPersonUser) },
      });
    },

    
  }
}
</script>
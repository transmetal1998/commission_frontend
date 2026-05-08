<template>
    <div>
        <div class="mb-4">
            <h1 class="text-2xl text-gray-400">Sales Commission - {{ $route.params.salesPersonUser }}</h1>
        </div>
    </div>
   <div class="flex flex-row gap-4">
       <div class="w-full">
            <Card>
                <template #content>   

                    <DataTable 
                            showGridlines 
                            v-model:filters="SalesCommissionDetailFilters"
                            :value="localSalesCommissionDetail" 
                            paginator 
                            :rows="50" 
                            :rowsPerPageOptions="[50, 100, 200]"
                            size="small"
                            dataKey="id"
                            filterDisplay="row"
                            :globalFilterFields="['fullName']"
                            responsiveLayout="scroll"
                            >

                            <!-- Header -->
                            <template #header>
                                <div class="flex justify-end">

                                <Button 
                                    icon="pi pi-plus" 
                                    severity="primary"  
                                    size="small" 
                                    class="mr-2"
                                    @click="showHurdleRateModal()"  
                                />

                                <IconField>
                                    <InputIcon>
                                    <i class="pi pi-search" />
                                    </InputIcon>
                                    <InputText 
                                    size="small" 
                                    v-model="SalesCommissionDetailFilters['global'].value" 
                                    placeholder="Search" 
                                    />
                                </IconField>
                                </div>
                            </template>

                            <!-- Empty -->
                            <template #empty>
                                <div class="py-4 text-center text-gray-500 italic">
                                No Hurdle Rates Found.
                                </div>
                            </template>

                            <Column header="Item" bodyClass="text-sm">
                                <template #body="slotProps">
                                    <div >
                                        {{ slotProps.data.itemCode }}
                                    </div>
                                </template>
                            </Column>
                            <Column header="Item Name" bodyClass="text-sm">
                                <template #body="slotProps">
                                    <div >
                                        {{ slotProps.data.itemName }}
                                    </div>
                                </template>
                            </Column>
                            <Column header="Item Name" bodyClass="text-sm">
                                <template #body="slotProps">
                                    <div >
                                        {{ slotProps.data.productType }}
                                    </div>
                                </template>
                            </Column>
                            <Column header="QTY" bodyClass="text-sm">
                                <template #body="slotProps">
                                    <div >
                                        {{ slotProps.data.quantity }}
                                    </div>
                                </template>
                            </Column>
                            <Column header="Gross Profit" bodyClass="text-sm">
                                <template #body="slotProps">
                                    <div >
                                        {{ slotProps.data.grossProfit }}
                                    </div>
                                </template>
                            </Column>
                            <Column header="BSS IDate" bodyClass="text-sm">
                                <template #body="slotProps">
                                    <div >
                                        {{ slotProps.data.bssIdate }}
                                    </div>
                                </template>
                            </Column>
                            
                        </DataTable>

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
        localSalesCommissionDetail: [],

        selectedAssociate: '',
        selectedTarget: '',
        selectedTargetAmount: null,
        selectedTargetYear: null,
        yearOptions: [],

        hurdleRateFilters: {
          global: { value: null, matchMode: 'contains' },
          category: { value: null, matchMode: 'contains' },
          type: { value: null, matchMode: 'contains' }
        },

        SalesCommissionDetailFilters: {
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
            salesCommissionHeader: 'salesCommissionHeader',
            salesCommissionDetail: 'salesCommissionDetail'
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
    
    await this.fetchSalesCommissionDetail({ fromDate: this.fromDate, toDate: this.toDate, salesPersonUser: this.$route.params.salesPersonUser });
    this.localSalesCommissionDetail = this.salesCommissionDetail;

  },
  methods: {
    ...mapActions(useHurdle, {
            fetchHurdleList: 'fetchHurdleList',   
            postHurdle: 'postHurdle',
            updatehurdle: 'updatehurdle'
        }),
    ...mapActions(useSalesCommission, {
            fetchSalesCommissionHeader: 'fetchSalesCommissionHeader',
            fetchSalesCommissionDetail: 'fetchSalesCommissionDetail'
        }),
    
  }
}
</script>
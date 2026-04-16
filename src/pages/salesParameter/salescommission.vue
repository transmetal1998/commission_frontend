<template>
    <div>
        <div class="mb-4">
            <h1 class="text-2xl text-gray-400">Sales Commission Rate</h1>
            <!-- <p class="text-gray-600">Manage hurdle rates for sales associates.</p> -->
        </div>
    </div>
   <div class="flex flex-row gap-4">
       <div class="w-full">
            <Card>
                <template #content>   
                         <DataTable 
                            showGridlines 
                            v-model:filters="salesCommissionFilters"
                            :value="localSalesCommissionRateList" 
                            paginator 
                            :rows="10" 
                            :rowsPerPageOptions="[10,25,50]"
                            size="small"
                            dataKey="id"
                            filterDisplay="row"
                            :globalFilterFields="['marginFrom', 'marginTo', 'rateCommissionMargin', 'typeYear', 'targetYear']"
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
                                    @click="showSalesCommissionModal()"  
                                />

                                <IconField>
                                    <InputIcon>
                                    <i class="pi pi-search" />
                                    </InputIcon>
                                    <InputText 
                                    size="small" 
                                    v-model="salesCommissionFilters['global'].value" 
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

                            <Column field="marginFrom" header="Margin From" sortable></Column>
                            <Column field="marginTo" header="Margin To"></Column>
                            <Column field="rateCommissionMargin" header="Margin"></Column>
                            <Column field="typeYear" header="Type"></Column>
                            <Column field="targetYear" header="Year" sortable></Column>

                            <!-- DELETE COLUMN -->
                            <Column header="" style="width: 3rem; text-align: center">
                                <template #body="slotProps">
                                <Button 
                                    icon="pi pi-pencil"
                                    severity="info"
                                    
                                    size="small"
                                    @click="editAddonRow(slotProps.data)"
                                />
                                </template>
                            </Column>
                            </DataTable>
                </template>
            </Card>

            <Dialog v-model:visible="visible" modal :header="isForUpdate ? 'Edit Hurdle Rate' : 'Add Hurdle Rate'" size="small">
            
            <div class="flex  gap-4 mb-4">
                <div class="flex flex-col gap-2 w-full">
                        <div class="">
                            <small>Margin From</small>
                            <InputNumber v-model="selectedMarginFrom" :minFractionDigits="2" type="text" class="w-full" size="small" />
                        </div>
                        <div class="">
                            <small>Margin To</small>
                            <InputNumber v-model="selectedMarginTo" :minFractionDigits="2" type="text" class="w-full" size="small" />
                        </div>
                        <div class="">
                            <small>Rate Commission Margin</small>
                            <InputNumber v-model="selectedRateCommissionMargin" :minFractionDigits="2" type="text" class="w-full" size="small" />
                        </div>
                        <div class="">
                            <small>Type Year</small>
                            <InputText v-model="selectedTypeYear" type="text" class="w-full" size="small" />
                        </div>
                        <div class="">
                            <small>Year</small>
                            <Select
                                v-model="selectedTargetYear"
                                :options="yearOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Select Year"
                                class="w-full"
                                size="small"
                            />
                        </div>
                        <div class="flex flex-row gap-2 mt-3">
                            <!-- <Button label="Clear" class="w-full" size="small" severity="secondary" /> -->
                            <Button label="Save" class="w-full" size="small" severity="primary" @click="proceedToSave()" />
                        </div>
                    </div>
            </div>
        </Dialog>

       </div>
      
   </div>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useSalesCommissionRate } from '@/stores/salesParameter/SalesCommissionRateStore';
import { useAssociateSales } from '@/stores/systemSettings/AssociateSalesStore';
import moment from "moment";

export default {
  data() {
    return {
      
        localSalesCommissionRateList: [],
        localAssociateSalesList: [],
        selectedAssociate: null,
        selectedMarginFrom: '',
        selectedMarginTo: '',
        selectedRateCommissionMargin: '',
        selectedTypeYear: '',
        selectedTargetYear: null,
        yearOptions: [],

        salesCommissionFilters: {
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
    ...mapState(useSalesCommissionRate, {
            salesCommissionRateList: 'salesCommissionRateList'
        }),
    ...mapState(useAssociateSales, {
            associateSalesList: 'associateSalesList'
        }),
  },
  async mounted() {
  
    await this.fetchSalesCommissionRateList();
    this.localSalesCommissionRateList = this.salesCommissionRateList;
    
    await this.fetchAssociateSalesList();
    this.localAssociateSalesList = this.associateSalesList;
      
    const currentYear = new Date().getFullYear()
    this.yearOptions = Array.from({ length: 3 }, (_, i) => {
      const year = currentYear - i
      return { label: year.toString(), value: year }
    })

  },
  methods: {
    ...mapActions(useSalesCommissionRate, {
            fetchSalesCommissionRateList: 'fetchSalesCommissionRateList',   
            postSalesCommissionRate: 'postSalesCommissionRate',
            updateSalesCommissionRate: 'updateSalesCommissionRate'
        }),
    ...mapActions(useAssociateSales, {
            fetchAssociateSalesList: 'fetchAssociateSalesList',
            
        }),
    async proceedToSave() {

        if(this.isForUpdate) {
            
            await this.updateSalesCommissionRate({
                marginFrom: this.selectedMarginFrom,
                marginTo: this.selectedMarginTo,
                rateCommissionMargin: this.selectedRateCommissionMargin,
                typeYear: this.selectedTypeYear,
                targetYear: this.selectedTargetYear
            }, this.selectedId);

        } else {
        
            await this.postSalesCommissionRate({
                marginFrom: this.selectedMarginFrom,
                marginTo: this.selectedMarginTo,
                rateCommissionMargin: this.selectedRateCommissionMargin,
                typeYear: this.selectedTypeYear,
                targetYear: this.selectedTargetYear
            });

        }

        this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Hurdle saved successfully', life: 3000 });

        this.selectedMarginFrom = null;
        this.selectedMarginTo = null;
        this.selectedRateCommissionMargin = null;
        this.selectedTypeYear = null;
        this.selectedTargetYear = null;

        await this.fetchSalesCommissionRateList();
        this.localSalesCommissionRateList = this.salesCommissionRateList;

        this.visible = false;

    },
    showSalesCommissionModal() {
        this.visible = true;
        this.isForUpdate = false;
        this.selectedMarginFrom = null;
        this.selectedMarginTo = null;
        this.selectedRateCommissionMargin = null;
        this.selectedTypeYear = null;
        this.selectedTargetYear = null;
    },
    editAddonRow(rowData) {
        // Implement edit functionality here
      
        this.visible = true;
        this.selectedMarginFrom = rowData.marginFrom;
        this.selectedMarginTo = rowData.marginTo;
        this.selectedRateCommissionMargin = rowData.rateCommissionMargin;
        this.selectedTypeYear = rowData.typeYear;
        this.selectedTargetYear = rowData.targetYear;
        this.selectedId = rowData.id;

        this.isForUpdate = true;
        

    }
  }
}
</script>
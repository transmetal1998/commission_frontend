<template>
    <div>
        <div class="mb-4">
            <h1 class="text-2xl text-gray-400">Sales Quota</h1>
            <!-- <p class="text-gray-600">Manage hurdle rates for sales associates.</p> -->
        </div>
    </div>
   <div class="flex flex-row gap-4">
       <div class="w-full">
            <Card>
                <template #content>   
                        <DataTable 
                            showGridlines
                            stripedRows 
                            v-model:filters="salesQuotaFilters"
                            :value="localSalesQuotaList" 
                            paginator 
                            :rows="10" 
                            :rowsPerPageOptions="[10,25,50]"
                            size="small"
                            dataKey="id"
                            filterDisplay="row"
                            :globalFilterFields="['BusinessUnit', 'quota', 'targetYear']"
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
                                    @click="showSalesQuoteModal()"  
                                />


                                <IconField>
                                    <InputIcon>
                                    <i class="pi pi-search" />
                                    </InputIcon>
                                    <InputText 
                                    size="small" 
                                    v-model="salesQuotaFilters['global'].value" 
                                    placeholder="Search" 
                                    />
                                </IconField>
                                </div>
                            </template>

                            <!-- Empty -->
                            <template #empty>
                                <div class="py-4 text-center text-gray-500 italic">
                                No Sales Quota Found.
                                </div>
                            </template>

                            <Column field="businessUnit" header="Business Unit" bodyClass="text-sm" sortable></Column>
                            <Column field="quota" header="Quota" bodyClass="text-sm">
                                <template #body="slotProps">
                                    {{ formatNumber(slotProps.data.quota) }}
                                </template>
                            </Column>
                            <Column field="targetYear" header="Year" sortable bodyClass="text-sm"></Column>

                            <!-- DELETE COLUMN -->
                            <Column header="" style="width: 3rem; text-align: center">
                                <template #body="slotProps">
                                <i class="pi pi-pencil text-gray-500" @click="editAddonRow(slotProps.data)" style="cursor: pointer"></i>
                                </template>
                            </Column>
                            </DataTable>
                </template>
            </Card>

            <Dialog v-model:visible="visible" modal :header="isForUpdate ? 'Edit Sales Quota' : 'Add Sales Quota'" size="small"  :style="{ width: '25rem' }">
            
            <div class="flex  gap-4 mb-4">
                <div class="flex flex-col gap-2 w-full">
                        <div class="">
                            <small>Business Unit</small>
                            <Select v-model="selectedBusinessUnit" size="small" :options="localBusinessUnitList" filter optionLabel="Description" placeholder="Select a Business Unit" class="w-full mt-2">
                                <template #value="slotProps">
                                    <div v-if="slotProps.value" class="flex items-center">
                                        <div>
                                            {{ slotProps.value.description }}
                                        </div>
                                    </div>
                                    <span v-else>
                                        {{ slotProps.placeholder }}
                                    </span>
                                </template>
                                <template #option="slotProps">
                                    <div class="flex items-center">
                                        <div>
                                            {{ slotProps.option.description }}
                                        </div>
                                    </div>
                                </template>
                            </Select>
                        </div>
                        <div>
                            <small>Quota</small>
                            <InputNumber v-model="selectedQuota" :minFractionDigits="2" type="text" class="w-full" size="small" />
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
import { useSalesQuota } from '@/stores/salesParameter/SalesQuotaStore';
import { useBusinessUnit } from '@/stores/systemSettings/BusinessUnitStore';
import moment from "moment";

export default {
  data() {
    const currentYear = new Date().getFullYear();
    return {
      
        localSalesQuotaList: [],
        localBusinessUnitList: [],
        selectedBusinessUnit: null,
        selectedQuota: null,
        selectedTarget: '',
        selectedTargetAmount: null,
        selectedTargetYear: currentYear,
        yearOptions: [
            { label: currentYear.toString(), value: currentYear },
            { label: (currentYear - 1).toString(), value: currentYear - 1 },
            { label: (currentYear - 2).toString(), value: currentYear - 2 }
        ],

        salesQuotaFilters: {
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
    ...mapState(useSalesQuota, {
            salesQuotaList: 'salesQuotaList'
        }),
    ...mapState(useBusinessUnit, {
            businessUnitList: 'businessUnitList'
        }),
  },
  async mounted() {
  
    await this.fetchSalesQuota();
    this.localSalesQuotaList = this.salesQuotaList;

    await this.fetchBusinessUnitList();
    this.localBusinessUnitList = this.businessUnitList;
      
  },
  methods: {
    ...mapActions(useSalesQuota, {
            fetchSalesQuota: 'fetchSalesQuota',   
            postSalesQuota: 'postSalesQuota',
            updateSalesQuota: 'updateSalesQuota'
        }),
    ...mapActions(useBusinessUnit, {
            fetchBusinessUnitList: 'fetchBusinessUnitList'
        }),
    async proceedToSave() {

        if(this.selectedBusinessUnit === null || this.selectedQuota === null || this.selectedTargetYear === null) {
            this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields', life: 3000 });
            return;
        }

        if(this.isForUpdate) {
            
            await this.updateSalesQuota({
                businessUnit : this.selectedBusinessUnit.description,
                quota: this.selectedQuota,
                targetYear: this.selectedTargetYear
            }, this.selectedId);

        } else {

            
            await this.postSalesQuota({
                businessUnit : this.selectedBusinessUnit.description,
                quota: this.selectedQuota,
                targetYear: this.selectedTargetYear
            });

        }

        this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Sales Quota saved successfully', life: 3000 });

        this.selectedBusinessUnit = '';
        this.selectedTarget = '';
        this.selectedTargetAmount = null;
        this.selectedHurdlePercent = null;
        this.selectedTargetYear = null;

        await this.fetchSalesQuota();
        this.localSalesQuotaList = this.salesQuotaList;

        this.visible = false;

    },
    showSalesQuoteModal() {
        this.visible = true;
        this.isForUpdate = false;
        this.selectedBusinessUnit = null;
        this.selectedQuota = null;
        this.selectedTargetYear = null;
        
    },
    editAddonRow(rowData) {
        // Implement edit functionality here
      
        this.visible = true;
        this.selectedBusinessUnit = this.localBusinessUnitList.find(unit => unit.description === rowData.businessUnit) || null;
        this.selectedQuota = rowData.quota;
        this.selectedTargetYear = rowData.targetYear;
        this.selectedId = rowData.id;

        this.isForUpdate = true;
        

    },
    formatNumber(value) {
        if (value === null || value === undefined) return '';

        return Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
        });
    }
  }
}
</script>
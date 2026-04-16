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

                            <Column field="businessUnit" header="Business Unit" sortable></Column>
                            <Column field="quota" header="Quota"></Column>
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

            <Dialog v-model:visible="visible" modal :header="isForUpdate ? 'Edit Hurdle Rate' : 'Add Sales Quota'" size="small">
            
            <div class="flex  gap-4 mb-4">
                <div class="flex flex-col gap-2 w-full">
                        <div class="">
                            <small>Business Unit</small>
                            <!-- <Select v-model="selectedAssociate" size="small" :options="localAssociateSalesList" filter optionLabel="fullName" placeholder="Select a Sales" class="w-full mt-2">
                                <template #value="slotProps">
                                    <div v-if="slotProps.value" class="flex items-center">
                                        <div>
                                            {{ slotProps.value.fullName }}
                                            <br>
                                            <small class="text-gray-500"> {{ slotProps.value.department }} </small>
                                        </div>
                                    </div>
                                    <span v-else>
                                        {{ slotProps.placeholder }}
                                    </span>
                                </template>
                                <template #option="slotProps">
                                    <div class="flex items-center">
                                        <div>
                                            {{ slotProps.option.fullName }}
                                            <br>
                                            <small class="text-gray-500"> {{ slotProps.option.department }} </small>
                                        </div>
                                    </div>
                                </template>
                            </Select> -->
                            <InputText v-model="selectedBusinessUnit" type="text" class="w-full" size="small" />
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
import { useAssociateSales } from '@/stores/systemSettings/AssociateSalesStore';
import moment from "moment";

export default {
  data() {
    return {
      
        localSalesQuotaList: [],
        localAssociateSalesList: [],
        // selectedAssociate: null,
        selectedBusinessUnit: '',
        selectedQuota: null,
        selectedTarget: '',
        selectedTargetAmount: null,
        selectedTargetYear: null,
        yearOptions: [],

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
    ...mapState(useAssociateSales, {
            associateSalesList: 'associateSalesList'
        }),
  },
  async mounted() {
  
    await this.fetchSalesQuota();
    this.localSalesQuotaList = this.salesQuotaList;
      
    const currentYear = new Date().getFullYear()
    this.yearOptions = Array.from({ length: 3 }, (_, i) => {
      const year = currentYear - i
      return { label: year.toString(), value: year }
    })

  },
  methods: {
    ...mapActions(useSalesQuota, {
            fetchSalesQuota: 'fetchSalesQuota',   
            postSalesQuota: 'postSalesQuota',
            updateSalesQuota: 'updateSalesQuota'
        }),
    ...mapActions(useAssociateSales, {
            fetchAssociateSalesList: 'fetchAssociateSalesList',
            
        }),
    async proceedToSave() {

        if(this.selectedBusinessUnit.trim() === '' || this.selectedQuota === null || this.selectedTargetYear === null) {
            this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields', life: 3000 });
            return;
        }

        if(this.isForUpdate) {
            
            await this.updateSalesQuota({
                businessUnit : this.selectedBusinessUnit,
                quota: this.selectedQuota,
                targetYear: this.selectedTargetYear
            }, this.selectedId);

        } else {
        
            await this.postSalesQuota({
                businessUnit : this.selectedBusinessUnit,
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
        this.selectedAssociate = null;
        this.selectedTarget = '';
        this.selectedTargetAmount = null;
        this.selectedHurdlePercent = null;
        this.selectedTargetYear = null;
    },
    editAddonRow(rowData) {
        // Implement edit functionality here
      
        this.visible = true;
        // this.selectedAssociate = this.localAssociateSalesList.find(associate => associate.username === rowData.username) || null;
        this.selectedBusinessUnit = rowData.businessUnit;
        this.selectedQuota = rowData.quota;
        this.selectedTargetYear = rowData.targetYear;
        this.selectedId = rowData.id;

        this.isForUpdate = true;
        

    }
  }
}
</script>
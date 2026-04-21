<template>
    <div>
        <div class="flex justify-between mb-4">
            <h1 class="text-2xl text-gray-400">Sales Commission Rate</h1>
            <h5>Switch to Services</h5>
            <!-- <p class="text-gray-600">Manage hurdle rates for sales associates.</p> -->
        </div>
    </div>
   <div class="flex flex-row gap-4">
       <div class="w-full">

            <Tabs value="1">
            <TabList>
                <Tab value="0">Year</Tab>
                <Tab value="1">Multi-Year</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    <DataTable 
                            showGridlines 
                            v-model:filters="salesCommissionYearFilters"
                            :value="localSalesCommissionRateYearList" 
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
                                    @click="showSalesCommissionYearModal()"  
                                />

                                <IconField>
                                    <InputIcon>
                                    <i class="pi pi-search" />
                                    </InputIcon>
                                    <InputText 
                                    size="small" 
                                    v-model="salesCommissionYearFilters['global'].value" 
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

                            
                            <Column field="businessUnit" header="Business Unit" sortable></Column>
                            <Column header="% Rate Comm. on Billing" sortable>
                                <template #body="{ data }">
                                    {{ data.rateCommissionOnBilling }}%
                                </template>
                            </Column>

                            <!-- DELETE COLUMN -->
                            <Column header="" style="width: 3rem; text-align: center">
                                <template #body="slotProps">
                                <Button 
                                    icon="pi pi-pencil"
                                    severity="info"
                                    
                                    size="small"
                                    @click="editAddonRowYear(slotProps.data)"
                                />
                                </template>
                            </Column>
                        </DataTable>
                </TabPanel>
                <TabPanel value="1">
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

                            <Column header="Margin Range" sortable :sortField="'marginFrom'">
                                <template #body="{ data }">
                                    <div>
                                    > {{ data.marginFrom }}% - {{ data.marginTo }}%
                                    </div>
                                </template>
                            </Column>

                            <Column header="% Rate Comm. on Margin" sortable>
                                <template #body="{ data }">
                                    {{ data.rateCommissionMargin }}%
                                </template>
                            </Column>

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
                </TabPanel>
            </TabPanels>
        </Tabs>

        <Dialog v-model:visible="visible" modal :header="isForUpdate ? 'Edit Sales Rate' : 'Add Sales Rate'" size="small"  :style="{ width: '25rem' }">
            
            <div class="flex gap-4 mb-4">
                <div class="flex flex-col gap-2 w-full">
                    <div class="flex gap-2 w-full">
                        <div class="flex flex-col gap-1 flex-1">
                            <small>Margin From</small>
                            <InputNumber
                            v-model="selectedMarginFrom"
                            :minFractionDigits="2"
                            class="w-full"
                            inputClass="w-full"
                            size="small"
                            />
                        </div>
                        <div class="flex flex-col gap-1 flex-1">
                            <small>Margin To</small>
                            <InputNumber
                            v-model="selectedMarginTo"
                            :minFractionDigits="2"
                            class="w-full"
                            inputClass="w-full"
                            size="small"
                            />
                        </div>
                    </div>
                    <div class="">
                        <small>Rate Commission Margin</small>
                        <InputNumber v-model="selectedRateCommissionMargin" :minFractionDigits="2" type="text" class="w-full" size="small" />
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


        <Dialog v-model:visible="visibleYearCSR" modal :header="isForUpdate ? 'Edit Sales Rate' : 'Add Sales Rate'" size="small"  :style="{ width: '25rem' }">
            
            <div class="flex gap-4 mb-4">
                <div class="flex flex-col gap-2 w-full">
                    <div class="">
                        <small>Business Unit</small>
                            <Select v-model="selectedBusinessUnit" size="small" :options="localBusinessUnitList" filter optionLabel="description" placeholder="Select a Business Unit" class="w-full mt-2">
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
                    <div class="">
                        <small>Rate Commission on Billing</small>
                        <InputNumber v-model="yearRCBilling" :minFractionDigits="2" type="text" class="w-full" size="small" />
                    </div>
                    <div class="flex flex-row gap-2 mt-3">
                        <Button label="Save" class="w-full" size="small" severity="primary" @click="proceedToSaveYear()" />
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
import { useBusinessUnit } from '@/stores/systemSettings/BusinessUnitStore';
import moment from "moment";

export default {
  data() {
    return {
      
        localSalesCommissionRateList: [],
        localSalesCommissionRateYearList: [],
        localAssociateSalesList: [],
        selectedAssociate: null,
        selectedMarginFrom: '',
        selectedMarginTo: '',
        selectedRateCommissionMargin: '',
        selectedTypeYear: 'Multi-Year',
        selectedTargetYear: null,
        yearOptions: [],

        salesCommissionFilters: {
          global: { value: null, matchMode: 'contains' },
          category: { value: null, matchMode: 'contains' },
          type: { value: null, matchMode: 'contains' }
        },

        salesCommissionYearFilters: {
          global: { value: null, matchMode: 'contains' },
          category: { value: null, matchMode: 'contains' },
          type: { value: null, matchMode: 'contains' }
        },

        visible: false,
        visibleYearCSR: false,
        isForUpdate: false,
        selectedId: null,

        localBusinessUnitList: [],

        selectedBusinessUnit: null,
        yearRCBilling: null,
        scrYearselectedId: null,
        isForUpdateScrYear: false,

    }
  },
  computed: {
    ...mapState(useSalesCommissionRate, {
            salesCommissionRateList: 'salesCommissionRateList',
            salesCommissionRateYearList: 'salesCommissionRateYearList'
        }),
    ...mapState(useAssociateSales, {
            associateSalesList: 'associateSalesList'
        }),
    ...mapState(useBusinessUnit, {
            businessUnitList: 'businessUnitList'
        }),
  },
  async mounted() {
  
    await this.fetchSalesCommissionRateList();
    this.localSalesCommissionRateList = this.salesCommissionRateList;

    await this.fetchSalesCommissionRateYearList();
    this.localSalesCommissionRateYearList = this.salesCommissionRateYearList;
    
    await this.fetchAssociateSalesList();
    this.localAssociateSalesList = this.associateSalesList;

    await this.fetchBusinessUnitList();
    this.localBusinessUnitList = this.businessUnitList;
      
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
            updateSalesCommissionRate: 'updateSalesCommissionRate',
            fetchSalesCommissionRateYearList: 'fetchSalesCommissionRateYearList',
            postSalesCommissionRateYear: 'postSalesCommissionRateYear',
            updateSalesCommissionRateYear: 'updateSalesCommissionRateYear'
        }),
    ...mapActions(useAssociateSales, {
            fetchAssociateSalesList: 'fetchAssociateSalesList',
        }),
    ...mapActions(useBusinessUnit, {
            fetchBusinessUnitList: 'fetchBusinessUnitList'
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

    async proceedToSaveYear() {

        if(this.isForUpdateScrYear) {
            
            await this.updateSalesCommissionRateYear({
                businessUnit: this.selectedBusinessUnit.description,
                rateCommissionOnBilling: this.yearRCBilling,
                targetYear: this.scrYearTargetYear
            }, this.selectedId);

        } else {
        
            await this.postSalesCommissionRateYear({
                businessUnit: this.selectedBusinessUnit.description,
                rateCommissionOnBilling: this.yearRCBilling,
                targetYear: this.scrYearTargetYear
            });

        }

        this.$toast.add({ severity: 'success', summary: 'Success', detail: 'SCR Year saved successfully', life: 3000 });

        this.selectedBusinessUnit = null;
        this.yearRCBilling = null;
        this.scrYearTargetYear = null;
        
        await this.fetchSalesCommissionRateYearList();
        this.localSalesCommissionRateYearList = this.salesCommissionRateYearList;

        this.visibleYearCSR = false;

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
        
    },
    editAddonRowYear(rowData) {
        // Implement edit functionality here
      
        this.visibleYearCSR = true;
        this.scrYearBusinessUnit = rowData.businessUnit;
        this.scrYearRateCommissionOnBilling = rowData.selectedRateCommissionOnBilling;
        this.scrYearTargetYear = rowData.targetYear;
        this.scrYearselectedId = rowData.id;

        this.isForUpdateScrYear = true;
        
    },
    showSalesCommissionYearModal() {
        this.visibleYearCSR = true;
        this.isForUpdate = false;
        this.selectedMarginFrom = null;
        this.selectedMarginTo = null;
        this.selectedRateCommissionMargin = null;
        this.selectedTypeYear = null;
        this.selectedTargetYear = null;
    }

  }
}
</script>
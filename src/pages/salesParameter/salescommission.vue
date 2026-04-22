<template>
    <div>
        <div class="flex justify-between mb-4">
            <h1 class="text-2xl text-gray-400">Sales Commission Rate</h1>
            <!-- <Button :label="isForProductAndSolution ? 'Switch to Services' : 'Switch to Products And Solutions'" rounded size="small" @click="switchModule()" variant="text"/> -->
            <!-- <p class="text-gray-600">Manage hurdle rates for sales associates.</p> -->
        </div>
    </div>

   <div class="flex flex-row gap-4">
       <div class="w-full">

            <Tabs value="0">
            <TabList>
                <Tab value="0">Product and Solutions</Tab>
                <Tab value="1">Services</Tab>
            </TabList>
            <TabPanels>

                <!-- Product and Solutions -->
                <TabPanel value="0">
                    <DataTable 
                            showGridlines 
                            stripedRows
                            v-model:filters="salesCommissionProductSolutionsFilters"
                            :value="localSalesCommissionRateProductSolutionsList" 
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
                                    v-model="salesCommissionProductSolutionsFilters['global'].value" 
                                    placeholder="Search" 
                                    />
                                </IconField>
                                </div>
                            </template>

                            <!-- Empty -->
                            <template #empty>
                                <div class="py-4 text-center text-gray-500 italic">
                                No Product and Solutions Found.
                                </div>
                            </template>

                            <Column header="Margin From" bodyClass="text-sm">
                                <template #body="{ data }">
                                    {{ data.marginFrom }}%
                                </template>
                            </Column>

                            <Column header="Margin To" bodyClass="text-sm">
                                <template #body="{ data }">
                                    {{ data.marginTo }}%
                                </template>
                            </Column>
                            
                            <Column header="% Rate Comm. on Margin" bodyClass="text-sm">
                                <template #body="{ data }">
                                    {{ data.rateCommissionMargin }}%
                                </template>
                            </Column>

                            <Column header="Type" bodyClass="text-sm">
                                <template #body="{ data }">
                                    <Tag :severity="data.type == 'Single-Year' ? 'info' : 'danger'" :value="data.type"></Tag>
                                </template>
                            </Column>

                            <Column field="targetYear" header="Year" bodyClass="text-sm"></Column>


                            <!-- DELETE COLUMN -->
                            <Column header="" style="width: 3rem; text-align: center">
                                <template #body="slotProps">
                                <i class="pi pi-pencil text-gray-500" @click="editAddonRow(slotProps.data)" style="cursor: pointer"></i>
                                </template>
                            </Column>
                        </DataTable>
                </TabPanel>
                
                <!-- Services -->
                <TabPanel value="1">
                    <DataTable 
                            showGridlines 
                            stripedRows
                            v-model:filters="salesCommissionServicesFilters"
                            :value="localSalesCommissionRateServicesList" 
                            paginator 
                            :rows="10" 
                            :rowsPerPageOptions="[10,25,50]"
                            size="small"
                            dataKey="id"
                            filterDisplay="row"
                            :globalFilterFields="['businessUnit', 'rateCommissionOnBilling', 'type', 'targetYear']"
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
                                    @click="showSalesCommissionServicesModal()"  
                                />

                                <IconField>
                                    <InputIcon>
                                    <i class="pi pi-search" />
                                    </InputIcon>
                                    <InputText 
                                    size="small" 
                                    v-model="salesCommissionServicesFilters['global'].value" 
                                    placeholder="Search" 
                                    />
                                </IconField>
                                </div>
                            </template>

                            <!-- Empty -->
                            <template #empty>
                                <div class="py-4 text-center text-gray-500 italic">
                                No Services Rates Found.
                                </div>
                            </template>

                            <Column field="businessUnit" header="Business Unit" ></Column>
                            <Column header="% Rate Comm. on Billing" >
                                <template #body="{ data }">
                                    {{ data.rateCommissionOnBilling }}%
                                </template>
                            </Column>

                            <Column field="targetYear" header="Year" ></Column>
                            <!-- <Column field="type" header="Type" ></Column> -->

                            <Column header="Type" >
                                <template #body="{ data }">
                                    <!-- {{ data.rateCommissionOnBilling }}% -->
                                    <Tag :severity="data.type == 'Single-Year' ? 'info' : 'danger'" :value="data.type"></Tag>
                                </template>
                            </Column>

                            <!-- DELETE COLUMN -->
                            <Column header="" style="width: 3rem; text-align: center">
                                <template #body="slotProps">
                                <i class="pi pi-pencil text-gray-500" @click="editAddonRowServices(slotProps.data)" style="cursor: pointer"></i>
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
                    <div>
                            <small>Rate Commission Margin</small>
                            <InputNumber v-model="selectedRateCommissionMargin" :minFractionDigits="2" type="text" class="w-full" size="small" />                    
                    </div>
                    <div class="flex flex-row items-start gap-2">
                    <div class="flex-1">
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

                    <div class="flex-1">
                        <small>Type</small>
                        <Select
                        v-model="selectedTypeYear"
                        :options="[{ label: 'Single-Year', value: 'Single-Year' }, { label: 'Multi-Year', value: 'Multi-Year' }]"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select Type"
                        class="w-full"
                        size="small"
                        />
                    </div>
                    </div>

                    <div class="flex flex-row gap-2 mt-3">
                        <Button label="Save" class="w-full" size="small" severity="primary" @click="proceedToSave()" />
                    </div>
                </div>
            </div>
        </Dialog>


        <Dialog v-model:visible="visibleServices" modal :header="isForUpdate ? 'Edit Sales Rate' : 'Add Sales Rate'" size="small"  :style="{ width: '25rem' }">
            
            <div class="flex gap-4 mb-4">
                <div class="flex flex-col gap-2 w-full">
                    <div class="">
                        <small>Business Unit</small>
                            <Select v-model="businessUnitServices" size="small" :options="localBusinessUnitList" filter optionLabel="description" placeholder="Select a Business Unit" class="w-full mt-2">
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
                        <InputNumber v-model="rateCommissionOnBillingServices" :minFractionDigits="2" type="text" class="w-full" size="small" />
                    </div>
                    <div class="flex flex-row items-start gap-2">
                    <div class="flex-1">
                        <small>Year</small>
                        <Select
                        v-model="selectedTargetYearServices"
                        :options="yearOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select Year"
                        class="w-full"
                        size="small"
                        />
                    </div>

                    <div class="flex-1">
                        <small>Type</small>
                        <Select
                        v-model="selectedTypeYearServices"
                        :options="[{ label: 'Single-Year', value: 'Single-Year' }, { label: 'Multi-Year', value: 'Multi-Year' }]"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select Type"
                        class="w-full"
                        size="small"
                        />
                    </div>
                    </div>
                   
                    <div class="flex flex-row gap-2 mt-3">
                        <Button label="Save" class="w-full" size="small" severity="primary" @click="proceedToSaveServices()" />
                    </div>
                </div>
            </div>
        </Dialog>

       </div>
   </div>


</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useSalesCommissionRateProductSolutions } from '@/stores/salesParameter/SalesCommissionRateProductSolutionsStore';
import { useSalesCommissionRateServices } from '@/stores/salesParameter/SalesCommissionRateServicesStore';
import { useAssociateSales } from '@/stores/systemSettings/AssociateSalesStore';
import { useBusinessUnit } from '@/stores/systemSettings/BusinessUnitStore';
import ServicesComponent from '@/components/salesParameter/ServicesComponent.vue';
import moment from "moment";

export default {
  data() {
    return {
      
        localSalesCommissionRateProductSolutionsList: [],
        localSalesCommissionRateServicesList: [],
        
        localAssociateSalesList: [],


        selectedAssociate: null,
        selectedMarginFrom: '',
        selectedMarginTo: '',
        selectedRateCommissionMargin: '',
        selectedTypeYear: 'Multi-Year',
        selectedTargetYear: null,
        yearOptions: [],

        salesCommissionProductSolutionsFilters: {
          global: { value: null, matchMode: 'contains' },
          category: { value: null, matchMode: 'contains' },
          type: { value: null, matchMode: 'contains' }
        },

        salesCommissionServicesFilters: {
          global: { value: null, matchMode: 'contains' },
          category: { value: null, matchMode: 'contains' },
          type: { value: null, matchMode: 'contains' }
        },

        visible: false,
        visibleServices: false,
        isForUpdate: false,
        selectedId: null,

        localBusinessUnitList: [],

        businessUnitServices: null,
        rateCommissionOnBillingServices: null,
        selectedTypeYearServices: null,
        selectedTargetYearServices: null,
        selectedIdServices: null,
        isForUpdateServices: false,

    }
  },
  computed: {
    ...mapState(useSalesCommissionRateProductSolutions, {
            salesCommissionRateProductSolutionsList: 'salesCommissionRateProductSolutionsList',
        }),
    ...mapState(useSalesCommissionRateServices, {
            salesCommissionRateServicesList: 'salesCommissionRateServicesList',
        }),
    ...mapState(useAssociateSales, {
            associateSalesList: 'associateSalesList'
        }),
    ...mapState(useBusinessUnit, {
            businessUnitList: 'businessUnitList'
        }),
  },
  async mounted() {
  
    await this.fetchsalesCommissionRateProductSolutionsList();
    this.localSalesCommissionRateProductSolutionsList = this.salesCommissionRateProductSolutionsList;

    await this.fetchSalesCommissionRateServicesList();
    this.localSalesCommissionRateServicesList = this.salesCommissionRateServicesList;

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
    ...mapActions(useSalesCommissionRateProductSolutions, {
            fetchsalesCommissionRateProductSolutionsList: 'fetchsalesCommissionRateProductSolutionsList',   
            postSalesCommissionRate: 'postSalesCommissionRate',
            updateSalesCommissionRate: 'updateSalesCommissionRate',
        }),
    ...mapActions(useSalesCommissionRateServices, {
            fetchSalesCommissionRateServicesList: 'fetchSalesCommissionRateServicesList',   
            postSalesCommissionRateServices: 'postSalesCommissionRateServices',
            updateSalesCommissionRateServices: 'updateSalesCommissionRateServices',
        }),
    ...mapActions(useAssociateSales, {
            fetchAssociateSalesList: 'fetchAssociateSalesList',
        }),
    ...mapActions(useBusinessUnit, {
            fetchBusinessUnitList: 'fetchBusinessUnitList'
        }),
    async proceedToSave() {

        if(this.isForUpdate) {
            
            await this.updateSalesCommissionRateProductSolutions({
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

        await this.fetchsalesCommissionRateProductSolutionsList();
        this.localSalesCommissionRateProductSolutionsList = this.salesCommissionRateProductSolutionsList;

        this.visible = false;

    },

    async proceedToSaveServices() {

        if(this.isForUpdateServices) {
            
            await this.updateSalesCommissionRateYear({
                id: this.selectedIdServices,
                businessUnit: this.businessUnitServices.description,
                rateCommissionOnBilling: this.rateCommissionOnBillingServices,
                typeYear: this.selectedTypeYearServices,
                targetYear: this.selectedTargetYearServices
            }, this.selectedIdServices);

        } else {
        
            await this.postSalesCommissionRateServices({
                businessUnit: this.businessUnitServices.description,
                rateCommissionOnBilling: this.rateCommissionOnBillingServices,
                typeYear: this.selectedTypeYearServices,
                targetYear: this.selectedTargetYearServices
            });

        }

        this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Services saved successfully', life: 3000 });

        this.businessUnitServices = null;
        this.rateCommissionOnBillingServices = null;
        this.targetYearServices = null;
        
        await this.fetchSalesCommissionRateServicesList();
        this.localSalesCommissionRateServicesList = this.salesCommissionRateServicesList;

        this.visibleServices = false;

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
        this.selectedTypeYear = rowData.type;
        this.selectedTargetYear = rowData.targetYear;
        this.selectedId = rowData.id;

        this.isForUpdate = true;
        
    },
    editAddonRowServices(rowData) {
        // Implement edit functionality here
      
        this.visibleServices = true;
        this.businessUnitServices = this.localBusinessUnitList.find(unit => unit.description === rowData.businessUnit) || null;
        this.rateCommissionOnBillingServices = rowData.rateCommissionOnBilling;
        this.selectedTargetYearServices = rowData.targetYear;
        this.selectedTypeYearServices = rowData.type
        this.selectedIdServices = rowData.id;

        this.isForUpdateServices = true;
        
    },
    showSalesCommissionServicesModal() {
        this.visibleServices = true;
        this.isForUpdate = false;
        this.selectedMarginFrom = null;
        this.selectedMarginTo = null;
        this.selectedRateCommissionMargin = null;
        this.selectedTypeYear = null;
        this.selectedTargetYear = null;
    },


  }
}
</script>
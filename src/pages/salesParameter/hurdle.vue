<template>
    <div>
        <div class="mb-4">
            <h1 class="text-2xl text-gray-400">Hurdle Rate</h1>
            <!-- <p class="text-gray-600">Manage hurdle rates for sales associates.</p> -->
        </div>
    </div>
   <div class="flex flex-row gap-4">
       <div class="w-full">
            <Card>
                <template #content>   
                         <DataTable 
                            showGridlines 
                            v-model:filters="hurdleRateFilters"
                            :value="localHurdleList" 
                            paginator 
                            :rows="10" 
                            :rowsPerPageOptions="[10,25,50]"
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
                                    v-model="hurdleRateFilters['global'].value" 
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

                            <Column field="fullName" header="Associate" sortable></Column>
                            <Column field="hurdleBasis" header="Hurdle Basis"></Column>
                            <Column field="targetAmount" header="Target"></Column>
                            <Column field="hurdlePercent" header="Hurdle (%)"></Column>
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
                            <small>Associate Name</small>
                            <Select v-model="selectedAssociate" size="small" :options="localAssociateSalesList" filter optionLabel="fullName" placeholder="Select a Sales" class="w-full mt-2">
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
                            </Select>
                        </div>
                        <div>
                            <small>Target</small>
                            <div class="flex flex-row gap-3 mt-2">
                                <div class="flex items-center gap-2">
                                    <RadioButton v-model="selectedTarget" inputId="target1" name="selectedTarget" value="Gross Profit" />
                                    <label for="target1">Gross Profit</label>
                                </div>
                                <div class="flex items-center gap-2">
                                    <RadioButton v-model="selectedTarget" inputId="target2" name="selectedTarget" value="Revenue" />
                                    <label for="target1">Revenue</label>
                                </div>
                            </div>
                        </div>
                        <div class="">
                            <small>Target Amount</small>
                            <InputNumber v-model="selectedTargetAmount" :minFractionDigits="2" type="text" class="w-full" size="small" />
                        </div>
                        <div class="">
                            <small>Hurdle (%)</small>
                            <InputNumber v-model="selectedHurdlePercent" :minFractionDigits="2" type="text" class="w-full" size="small" />
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
import { useHurdle } from '@/stores/salesParameter/HurdleStore';
import { useAssociateSales } from '@/stores/systemSettings/AssociateSalesStore';
import moment from "moment";

export default {
  data() {
    return {
      
        localHurdleList: [],
        localAssociateSalesList: [],
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

        visible: false,
        isForUpdate: false,
        selectedId: null,

    }
  },
  computed: {
    ...mapState(useHurdle, {
            hurdleList: 'hurdleList'
        }),
    ...mapState(useAssociateSales, {
            associateSalesList: 'associateSalesList'
        }),
  },
  async mounted() {
  
    await this.fetchHurdleList();
    this.localHurdleList = this.hurdleList;
    
    await this.fetchAssociateSalesList();
    this.localAssociateSalesList = this.associateSalesList;
      
    const currentYear = new Date().getFullYear()
    this.yearOptions = Array.from({ length: 3 }, (_, i) => {
      const year = currentYear - i
      return { label: year.toString(), value: year }
    })

  },
  methods: {
    ...mapActions(useHurdle, {
            fetchHurdleList: 'fetchHurdleList',   
            postHurdle: 'postHurdle',
            updatehurdle: 'updatehurdle'
        }),
    ...mapActions(useAssociateSales, {
            fetchAssociateSalesList: 'fetchAssociateSalesList',
            
        }),
    async proceedToSave() {

        if(this.selectedAssociate === null || this.selectedTarget === '' || this.selectedTargetAmount === null || this.selectedHurdlePercent === null || this.selectedTargetYear === null) {
            this.$toast.add({ severity: 'warn', summary: 'Validation Error', detail: 'Please fill in all fields before saving.', life: 3000 });
            return;
        }

        if(this.isForUpdate) {
            
            await this.updatehurdle({
                userCode: this.selectedAssociate.username,
                hurdleBasis: this.selectedTarget,
                targetAmount: this.selectedTargetAmount,
                hurdlePercent: this.selectedHurdlePercent,
                targetYear: this.selectedTargetYear
            }, this.selectedId);

        } else {
        
            await this.postHurdle({
                userCode: this.selectedAssociate.username,
                hurdleBasis: this.selectedTarget,
                targetAmount: this.selectedTargetAmount,
                hurdlePercent: this.selectedHurdlePercent,
                targetYear: this.selectedTargetYear
            });

        }

        this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Hurdle saved successfully', life: 3000 });

        this.selectedAssociate = null;
        this.selectedTarget = '';
        this.selectedTargetAmount = null;
        this.selectedHurdlePercent = null;
        this.selectedTargetYear = null;

        await this.fetchHurdleList();
        this.localHurdleList = this.hurdleList;

        this.visible = false;

    },
    showHurdleRateModal() {
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
        this.selectedAssociate = this.localAssociateSalesList.find(associate => associate.username === rowData.username) || null;
        this.selectedTarget = rowData.hurdleBasis;
        this.selectedTargetAmount = rowData.targetAmount;
        this.selectedHurdlePercent = rowData.hurdlePercent;
        this.selectedTargetYear = rowData.targetYear;
        this.selectedId = rowData.id;

        this.isForUpdate = true;
        

    }
  }
}
</script>
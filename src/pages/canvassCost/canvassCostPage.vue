<template>
  <Toast/>
  <div class=" bg-[#F8F9FA] font-sans">
    
    <div class="flex gap-2">

  <div class="w-1/4">
    <h1 class="text-2xl text-gray-400">Canvass Cost</h1>
  </div>

      <div class="flex-1 flex gap-2">
        <Button label="Export" size="small" @click="exportData()" severity="secondary" icon="pi pi-file-excel"></Button> 

      </div>

    </div>
    <!-- Main content: left and right panels -->
    <div class="flex mt-2 gap-2">
    <!-- Left side: card with vertical scrolling -->
    <div class="w-1/4">
        <ScrollPanel
            style="width: 100%; height: 430px"
            :dt="{
                bar: {
                    background: '#cccccc'
                }
            }"
        >
          <DataTable

            :value="canvassCostData"
            paginator
            :rows="5"
            dataKey="id"
            :pageLinkSize="2"
            :showGridlines="false"
            size="small"
            v-model:filters="salesOrderFilters"
            :globalFilterFields="['salesOrderNo', 'customerRefNo', 'customerName']"
            class="overflow-auto"
          >
            <!-- HEADER (Search) -->
            <template #header>
              <div class="flex justify-end gap-2">
                <Button size="small" v-tooltip.bottom="'Create Canvass Cost'" severity="primary" @click="openModal('Create')" icon="pi pi-plus  " />
                <Button size="small" v-tooltip.bottom="'Update Canvass Cost'" severity="secondary" @click="openModal('Update')" icon="pi pi-pen-to-square" />
                <IconField>
                  <InputIcon>
                    <i class="pi pi-search" />
                  </InputIcon>
                  <InputText 
                    v-model="salesOrderFilters['global'].value" 
                    placeholder="Search Sales Order" 
                    size="small"
                    class="w-full"
                  />
                </IconField>
              </div>
            </template>

            <!-- EMPTY -->
            <template #empty>
              <div class="text-center py-4 text-gray-500">
                No data available
              </div>
            </template>

            <!-- CUSTOM CARD TEMPLATE -->
            <Column>
              <template #body="{ data }">
         
                <div
                  class="mb-2 p-3 rounded-md cursor-pointer border transition"
                  :class="isActive && selectedOrderId === data.id
                    ? 'border-[#b6142c] bg-red-50'
                    : 'border-gray-300 hover:border-gray-400'"
                  @click="selectedOrderMethod(data)"
                >
                  <!-- Header -->
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-[#b6142c] leading-tight">
                        {{ data.salesOrderNo }}
                      </p>
                    </div>

                    <span
                      :class="data.status === 'Posted' ? 'px-2 py-1 rounded-md text-xs font-semibold bg-[#b6142c] text-white' : 'px-2 py-1 rounded-md text-xs font-semibold bg-red-100 text-[#b6142c]'"
                    >
                      {{ data.status }}
                    </span>
                  </div>

                  <div class="my-2 border-t border-gray-200"></div>

                  <!-- Details -->
                  <div class="gap-x-4 gap-y-2 text-sm">

                    <!-- Value (wrap) -->
                    <div class="text-left text-gray-900 whitespace-normal break-words">
                      CRN: {{ data.customerRefNo }}
                    </div>

                    
                    <div class="text-left text-gray-900 whitespace-normal break-words">
                      Customer: {{ data.customerName }}
                    </div>

                    
                    <div class="text-left text-gray-900 whitespace-normal break-words">
                      SO Date:{{ formatDate(data.salesOrderDate) }}
                    </div>
                  </div>
                </div>

              </template>
            </Column>
          </DataTable>
        </ScrollPanel>
    </div>

    <!-- Right side: content for selected item -->
    <div class="flex-1 min-w-0 bg-white rounded shadow p-4 flex flex-col h-[430px]" >
  <div v-if="isActive" class="flex flex-col h-full">
    
    <div class="grid grid-cols-4 gap-4 mb-4">
      <div><small class="text-xs text-gray-500">Customer Reference No:<br><span class="text-black font-medium">{{ canvassCostHeaderDetails.customerRefNo }}</span></small></div>
      <div><small class="text-xs text-gray-500">Customer Name: <br> <span class="text-black font-medium">{{ canvassCostHeaderDetails.customerName }}</span></small></div>
      <div><small class="text-xs text-gray-500">BU: <br> <span class="text-black font-medium">{{ canvassCostHeaderDetails.businesUnit }}</span></small> </div>
      <div><small class="text-xs text-gray-500">SO Number: <br> <span class="text-black font-medium">{{ canvassCostHeaderDetails.salesOrderNo }}</span></small></div>
      <div><small class="text-xs text-gray-500">SO Date: <br> <span class="text-black font-medium">{{ formatDate(canvassCostHeaderDetails.salesOrderDate) }}</span></small></div>
      <div><small class="text-xs text-gray-500">PDEX Rate: <br> <span class="text-black font-medium">{{ canvassCostHeaderDetails.pdexRate }}</span></small></div>
      <div><small class="text-xs text-gray-500">Corporate: <br> <span class="text-black font-medium">{{ canvassCostHeaderDetails.corporate }}</span></small></div>
      <div><small class="text-xs text-gray-500">Period: <br> <span class="text-black font-medium">{{ canvassCostHeaderDetails.yearCategory }}</span></small></div>
    
    </div>

    <div class="bg-gray-200 h-[8px] mb-4 -mx-4"></div>

    <div class="flex gap-1 justify-end mb-4">
      
          <Button size="small" severity="secondary" @click="showDrawerDetail" label="Add Product" icon="pi pi-plus" />
          <Button size="small" severity="secondary" @click="showAddons()" label="Charges" icon="pi pi-credit-card" />
          <Button size="small" severity="secondary" @click="assignAmPM()" label="Assign AM/ PM" icon="pi pi-user" />
          <Button size="small" v-if="this.isForDraft" severity="secondary"  @click="deleteRowDetail()"  label="Remove" icon="pi pi-trash" />
          <Button size="small" v-if="this.isForDraft" severity="secondary"  @click="postedRecord()"  label="Post" icon="pi pi-unlock" />
        



    </div>

    <Dialog 
      v-model:visible="visibleRight" 
      modal 
      header="Charges" 
      :style="{ width: '60rem' }"
    >

      <!-- FORM SECTION -->
      <div class="p-3">
        <p class="text-sm text-gray-500 mb-3">All fields are required</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">

          <div>
            <small class="text-gray-500">Type</small>
            <Select 
              v-model="addonsForm.selectedType"
              size="small"
              :options="types"
              placeholder="Select"
              class="w-full"
            />
          </div>

          <div>
            <small class="text-gray-500">Quantity</small>
            <InputNumber 
              size="small" 
              :minFractionDigits="2" 
              class="w-full" 
              v-model="addonsForm.quantity" 
              variant="filled" 
            />
          </div>

          <div>
            <small class="text-gray-500">Cost Unit (VAT)</small>
            <InputNumber 
              size="small" 
              :minFractionDigits="2" 
              class="w-full" 
              v-model="addonsForm.costUnitVat" 
              variant="filled" 
            />
          </div>

          <div>
            <!-- <small class="text-gray-500">Save this Charges?</small> -->
            <Button 
            v-if="this.isForDraft"
            severity="primary" 
            @click="saveToAddons()" 
            label="Save Charges" 
            class="w-full mt-6"  
            size="small" 
          />
          </div>

        </div>

      </div>

      <!-- TABLE SECTION -->
      <div class="px-3 pb-3">
        <div class="overflow-x-auto">

          <DataTable 
          showGridlines 
          stripedRows
          v-model:filters="addonsChargesFilters"
          :value="addonsChargesList" 
          paginator 
          :rows="5" 
          :rowsPerPageOptions="[5,10,25]"
          size="small"
          dataKey="id"
          filterDisplay="row"
          :globalFilterFields="['category', 'type']"
          responsiveLayout="scroll"
        >

      <!-- Header -->
      <template #header>
        <div class="flex justify-end items-center">
          
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText 
              size="small" 
              v-model="addonsChargesFilters['global'].value" 
              placeholder="Search" 
            />
          </IconField>
        </div>
      </template>

      <!-- Empty -->
      <template #empty>
        <div class="py-4 text-center text-gray-500 italic">
          No Charges Found.
        </div>
      </template>

      <!-- Columns -->
      <Column field="type" header="Type" sortable  bodyClass="text-sm"/>
      <Column field="quantity" header="Qty" sortable bodyClass="text-sm"/>
      <Column field="costUnitVat" header="Unit (VAT)" sortable bodyClass="text-sm"/>
      <Column field="costQuantityVat" header="Qty (VAT)" sortable bodyClass="text-sm"/>
      <Column field="costUnitWoVat" header="Unit (w/o VAT)" sortable bodyClass="text-sm"/>
      <Column field="costQuantityWoVat" header="Qty (w/o VAT)" sortable bodyClass="text-sm"/>

      <!-- DELETE COLUMN -->
      <Column header="" style="width: 3rem; text-align: center">
        <template #body="slotProps">
          <div class="flex flex-row">
            <Button 
            icon="pi pi-pencil"
            severity="secondary"
            text
            rounded
            size="small"
            @click="updateData(slotProps.data)"
          />
          <Button 
            icon="pi pi-trash"
            severity="secondary"
            text
            rounded
            size="small"
            @click="deleteChargeAddOns(slotProps.data)"
          />
          </div>
        </template>
      </Column>

          </DataTable>

        </div>
      </div>

    </Dialog>
    <div class="flex-1 min-h-0">
      <DataTable
      stripedRows
        v-model:selection="selectedDetails"
        :value="canvassDetailList"
        dataKey="id"
        scrollable
        responsiveLayout="scroll"
        class="p-datatable-sm"
      >
        <Column selectionMode="multiple"></Column>
        <Column field="productCode" header="Part Number" style="min-width: 120px; font-size: 12px"></Column>
        <!-- <Column field="description" header="Description" style="min-width: 260px; font-size: 12px"></Column> -->
        <Column header="Description" style="min-width: 260px; font-size: 12px">
            <template #body="{ data }">
              <div class="hover:cursor-pointer hover:text-[#c52b42] hover:font-semibold" @click="openDetailModal(data)">
                {{ data.description }}%
              </div>
            </template>
        </Column>
        <Column field="itemCategory" header="Category" style="min-width: 120px; font-size: 12px"></Column>
        <Column field="spUnitVat" header="Unit Vat" style="min-width: 120px; font-size: 12px"></Column>
        <Column field="spQtyVat" header="Qty VAT" style="min-width: 120px; font-size: 12px"></Column>
        <Column field="spUnitWoVat" header="Unit w/o VAT" style="min-width: 120px; font-size: 12px"></Column>
        <Column field="spQtyWoVat" header="Qty w/o VAT" style="min-width: 120px; font-size: 12px"></Column>
        <Column field="poRefDate" header="PO Ref Date" style="min-width: 120px; font-size: 12px"></Column>
        <Column field="recommendedSupplier" header="Supplier" style="min-width: 120px; font-size: 12px"></Column>
        <Column field="costUnitVat" header="Unit VAT" style="min-width: 120px; font-size: 12px"></Column>
        <Column field="costQuantityVat" header="Qty VAT" style="min-width: 120px; font-size: 12px"></Column>
        <Column field="costUnitWoVat" header="Unit w/o VAT" style="min-width: 120px; font-size: 12px"></Column>
        <Column field="costQuantityWoVat" header="Qty w/o VAT" style="min-width: 120px; font-size: 12px"></Column>
        <Column field="profitMarginWoVat" header="Profit Margin w/o VAT" style="min-width: 120px; font-size: 12px"></Column>
        <Column field="profitMargin" header="Profit Margin" style="min-width: 120px; font-size: 12px"></Column>
        <Column field="targetSellingPriceVat" header="Target Price VAT" style="min-width: 120px; font-size: 12px"></Column>
        </DataTable>
    </div>
  </div>

  <div v-else class="text-gray-500 p-4">Select Purchase Order/ Customer.</div>
  </div>
    </div>

    <ComputationModal
      v-model:visible="visibleComputation"
      :actionType="isForInsert"
      :form="formData"
      :headerForm="canvassCostHeaderDetails"
      :selectedID="selectedOrderId"
      :propsProductListRaw="productCodeListRaw"
      @saved="loadTableData"
    />

    <Dialog 
        v-model:visible="modalVisible" 
        modal 
        :header="modalTitle" 
        :breakpoints="{'960px': '75vw', '641px': '95vw'}"
        :style="{ width: '550px' }"
        class="custom-order-modal"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 pt-4 px-1">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-gray-600">Customer Reference No.</label>
            <InputText v-model="form.customerRefNo" size="small" class="p-inputtext-md border-gray-300" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-gray-600">Customer Name</label>
            <InputText v-model="form.customerName" size="small" class="p-inputtext-md border-gray-300" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-gray-600">Transaction</label>
            <div class="flex gap-4 items-center h-10">
              <div class="flex items-center">
                <RadioButton v-model="form.businesUnit" size="small" inputId="buFDC" value="FDC" />
                <label for="buFDC" class="ml-2 text-sm text-gray-700">FDC</label>
              </div>
              <div class="flex items-center">
                <RadioButton v-model="form.businesUnit" size="small" inputId="buMSU" value="MSU" />
                <label for="buMSU" class="ml-2 text-sm text-gray-700">MSU</label>
              </div>
              <div class="flex items-center">
                <RadioButton v-model="form.businesUnit" size="small" inputId="buCFI" value="CFI" />
                <label for="buCFI" class="ml-2 text-sm text-gray-700">CFI</label>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-gray-600">SO Number</label>
            <InputText v-model="form.salesOrderNo" size="small" class="p-inputtext-md border-gray-300" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-gray-600">SO Date</label>
            <DatePicker v-model="form.salesOrderDate" size="small" class="w-full p-inputtext-md border-gray-300" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-gray-600">PDEX Rate</label>
            <InputText v-model="form.pdexRate" size="small" class="p-inputtext-md border-gray-300" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-gray-600">Corporate</label>
            <div class="flex items-center h-10">
              <Checkbox v-model="form.isCorporate" size="small" :binary="true" inputId="corp" />
              <label for="corp" class="ml-2 text-sm text-gray-700">In-House</label>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-gray-600">Period</label>
            <Select v-model="form.yearCategory" size="small" :options="['One Year', 'Multi-Year']" class="w-full" />
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3 pt-6 pb-2">
            <Button 
              size="small"
              severity="secondary"
              label="Cancel" 
              @click="modalVisible = false" 
            />
            <Button 
              :label="modalTitle.split(' ')[0]" 
              @click="saveOrder"  
            />
          </div>
        </template>
    </Dialog>

    <Dialog v-model:visible="visibleDeleteConfirmation" modal header="Delete Confirmation" :style="{ width: '25rem' }">
        <span class="text-surface-500 dark:text-surface-400 block mb-8">Are you sure you want to delete the selected records?</span>
        
        <div class="flex justify-end gap-2">
            <Button type="button" label="Confirm" @click="confirmDelete"></Button>
        </div>
    </Dialog>

    <Dialog v-model:visible="visibleAssignAmPm" modal header="Assign AM/PM" :style="{ width: '25rem' }">
     
      <div class="flex flex-col gap-y-5">
        <div class="gap-4">
            <small>Account Manager</small>
             <Select v-model="assignAm" size="small" :options="localAssociateSalesList" filter optionLabel="fullName" placeholder="Select a Account Manager" class="w-full">
                <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex items-center">
                        <div>
                            {{ slotProps.value.fullName }}
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
                        </div>
                    </div>
                </template>
            </Select>
        </div>
        <div class="gap-4">
            <small>Product Manager</small>
            <Select v-model="assignPm" size="small" :options="localAssociateSalesList" filter optionLabel="fullName" placeholder="Select a Product Manager" class="w-full">
                <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex items-center">
                        <div>
                            {{ slotProps.value.fullName }}
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
                        </div>
                    </div>
                </template>
            </Select>
        </div>
      
      <div class="flex gap-2">
          <Button type="button" class="w-full" size="small" label="Cancel" severity="secondary" @click="visibleAssignAmPm = false"></Button>
          <Button type="button" class="w-full"  v-if="this.isForDraft" size="small" label="Save" @click="saveAssignAmPm()"></Button>
      </div>
      </div>
    </Dialog>

    <Dialog v-model:visible="visibleConfirmationToPost" modal header="Confirmation" :style="{ width: '25rem' }">
        <div class="flex items-center gap-4 mb-4">
            <small>
              Are you sure you want to post this record? <br>
              <span class="font-semibold text-[#c52b42]">[SO Number: {{ this.canvasCostHeaderDetails.salesOrderNo }}]</span> <br><br>
              Once posted, this record can no longer be edited or deleted. Please confirm to proceed.
            </small>
        </div>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Cancel" size="small" severity="secondary" @click="visibleConfirmationToPost = false"></Button>
            <Button type="button" label="Confirm" size="small" @click="confirmToPostThis()" ></Button>
        </div>
    </Dialog>

  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useCanvasCost } from '@/stores/canvasCost/CanvasCostStore';
import { useAssociateSales } from '@/stores/systemSettings/AssociateSalesStore';
import ComputationModal from '@/components/canvassCost/computationModal.vue';
import moment from "moment";


export default {
  data() {
    return {
      visibleAssignAmPm: false,
      localAssociateSalesList: [],
      isActive: false,
      selectedOrderId: '',
      visibleRight: false,
      modalVisible: false,
      visibleComputation: false,
      modalTitle: 'Create Sales Order',
      searchQuery: '',
      selectedStatus: 'All',
      form: {
        salesOrderNo: '',
        customerRefNo: '',
        customerName: '',
        salesOrderDate: '',
        businesUnit: '',
        pdexRate: '',
        isCorporate: '',
        yearCategory: '',
        status: 'Draft',
        createdSalesAgentBy: '',
        accountManager: '',
        productManager: ''
      },
      // Summary
      canvassCostData: [],
      canvassCostHeaderDetails: [],
      // Details
      canvassDetailList: [],
      selectedDetails: null,

      // Product Code
      productList: [],

      addonsListByCategoryData: [],
      selectedCategory: '',
      selectedType: null,
      types: [],

      formData: {
        productCode: '',
        description: '',
        itemCategory: '',
        quantity: 0.00,
        spUnitVat: 0.00,
        spQtyVat: 0.00,
        spUnitWoVat: 0.00,
        spQtyWoVat: 0.00,
        poRefDate: '',
        recommendedSupplier: '',
        costUnitVat: 0.00,
        costRawUnitVat: 0.00,
        costQuantityVat: 0.00,
        costUnitWoVat: 0.00,
        costQuantityWoVat: 0.00,
        profitMarginWoVat: 0.00,
        profitMargin: 0.00,
        targetSellingPriceVat: 0.00
      },

      addonsForm: {
        id: null,
        selectedCategory: '',
        selectedType: '',
        quantity: 0.00,
        spUnitVat: 0.00,
        costUnitVat: 0.00
      },

      assignAm: null,
      assignPm: null,

      productCodeListRaw: [],
      searchSalesOrder: '',
      visibleDeleteConfirmation: false,
      isForUpdate: false,

      addonsChargesList: [],
      addonsChargesFilters: {
          global: { value: null, matchMode: 'contains' },
          category: { value: null, matchMode: 'contains' },
          type: { value: null, matchMode: 'contains' }
      },

      salesOrderFilters: {
        global: { value: null, matchMode: 'contains' },
      },
      isForInsert: true,
      isForInsertAddons: true,
      isForDraft : true,

      visibleConfirmationToPost: false,

    }
  },
  computed: {
    ...mapState(useCanvasCost, {
            canvasCostList: 'canvasCostList',
            canvasCostHeaderDetails: 'canvasCostHeaderDetails',
            canvassCostDetails: 'canvassCostDetails',
            productCodeList: 'productCodeList',
            addonsListByCategory: 'addonsListByCategory',
            addonsListByType: 'addonsListByType',
            canvasCostAddonsCharges: 'canvasCostAddonsCharges',
        }),
      ...mapState(useAssociateSales, {
            associateSalesList: 'associateSalesList'
        }),
  },
  async mounted() {
  
    await this.fetchCanvas();
    this.canvassCostData = this.canvasCostList; 

    await this.fetchProductList();
    this.productCodeListRaw = this.productCodeList.data;

    await this.fetchAddonsListByCategory();
    this.addonsListByCategoryData = this.addonsListByCategory;

    await this.fetchAssociateSalesList();
    this.localAssociateSalesList = this.associateSalesList; 
      
  },
  methods: {
    ...mapActions(useCanvasCost, {
          fetchCanvas: 'fetchCanvas',
          fetchCanvasHeaderDetails: 'fetchCanvasHeaderDetails',
          fetchProductList: 'fetchProductList',
          postCanvasCost: 'postCanvasCost',
          updateCanvasCost: 'updateCanvasCost',
          fetchCanvassDetails: 'fetchCanvassDetails',
          deleteCanvasCostDetail: 'deleteCanvasCostDetail',
          fetchAddonsListByCategory: 'fetchAddonsListByCategory',
          fetchAddonsListByType: 'fetchAddonsListByType',
          postCanvasCostAddons: 'postCanvasCostAddons',
          fetchCanvasCostAddonsChargesByHeader: 'fetchCanvasCostAddonsChargesByHeader',
          updateCanvasCostAssignAmPm: 'updateCanvasCostAssignAmPm',   
          exportFunction: 'exportFunction',
          updateCanvasCostAddons: 'updateCanvasCostAddons',
          deleteCanvasCostAddonsCharges: 'deleteCanvasCostAddonsCharges',
          updateCanvasCostStatus: 'updateCanvasCostStatus'
      }),
    ...mapActions(useAssociateSales, {
          fetchAssociateSalesList: 'fetchAssociateSalesList',
          
      }),
    async showAddons() {

      if(!this.selectedOrderId) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Please select a sales order to view add-ons.',
          life: 1500
        });
        return;
      }

      await this.fetchCanvasCostAddonsChargesByHeader(this.selectedOrderId).then(() => {
        this.addonsChargesList = this.canvasCostAddonsCharges;
      });

      await this.fetchAddonsListByType('Charges');
      this.types = this.addonsListByType;

      this.visibleRight = true;
    }, 
    async saveToAddons() {

        if(!this.addonsForm.selectedType || !this.addonsForm.quantity) {
          this.$toast.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Please fill in all required fields.',
            life: 1500
          });
          return;
        }

        const payload = {
          canvasCostHeaderId: this.selectedOrderId,
          category: this.addonsForm.selectedCategory,
          type: this.addonsForm.selectedType,
          quantity: this.addonsForm.quantity,
          spUnitVat: this.addonsForm.spUnitVat,
          costUnitVat: this.addonsForm.costUnitVat
        };

        if (this.isForInsertAddons) {
        

        await this.postCanvasCostAddons(payload)
          .then(() => {
            this.$toast.add({
              severity: 'success',
              summary: 'Added',
              detail: 'Add-on charge added successfully.',
              life: 1500
            });
          })
          .catch(err => {
            console.error('Error adding add-on charge:', err);
            alert('Failed to add add-on charge. Please try again.');
          }); 

            
        } else {

            await this.updateCanvasCostAddons(payload, this.addonsForm.id)
            .then(() => {
              this.$toast.add({
                severity: 'success',
                summary: 'Added',
                detail: 'Add-on charge update successfully.',
                life: 1500
              });
            })
            .catch(err => {
              console.error('Error adding add-on charge:', err);
              alert('Failed to add add-on charge. Please try again.');
            }); 

        }

          await this.fetchCanvasCostAddonsChargesByHeader(this.selectedOrderId).then(() => {
            this.addonsChargesList = this.canvasCostAddonsCharges;
          });


          this.addonsForm = {
            selectedCategory: '',
            selectedType: '',
            quantity: 0.00,
            spUnitVat: 0.00,
            costUnitVat: 0.00
          };

          this.isForInsertAddons = true;

    },   
    async showDrawerDetail() {
      this.isForInsert = true
      this.formData = {
        productCode: '',
        description: '',
        itemCategory: '',        
        quantity: 0.00,
        spUnitVat: 0.00,
        spQtyVat: 0.00,
        spUnitWoVat: 0.00,
        spQtyWoVat: 0.00,
        poRefDate: '',
        recommendedSupplier: '',
        costUnitVat: 0.00,
        costRawUnitVat: 0.00,
        costQuantityVat: 0.00,
        costUnitWoVat: 0.00,
        costQuantityWoVat: 0.00,
        profitMarginWoVat: 0.00,
        profitMargin: 0.00,
        targetSellingPriceVat: 0.00
      };

      this.visibleComputation = true;
  
    },      
    async loadTableData() {

      await this.fetchCanvassDetails(this.selectedOrderId).then(() => {
        this.canvassDetailList = this.canvassCostDetails;
      });
      this.visibleComputation = false;

      await this.fetchProductList();
      this.productCodeListRaw = this.productCodeList.data;

    },
    deleteAddonRow(data) {
      console.log(data.id);
    },
    async confirmDelete() {
    
      const idsToDelete = this.selectedDetails.map(item => item.id);

      this.deleteCanvasCostDetail(idsToDelete)
        .then(() => {
          this.$toast.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Selected records deleted successfully.',
            life: 1500
          });
          this.loadTableData();
          this.selectedDetails = [];
        })
        .catch(err => {
          console.error('Error deleting records:', err);
          alert('Failed to delete records. Please try again.');
        })
        .finally(() => {
          this.visibleDeleteConfirmation = false;
        });
    },
    async deleteRowDetail() {
       if (!this.selectedDetails || !this.selectedDetails.length) {
        this.$toast.add({
          severity: 'error',
          summary: 'Warning',
          detail: 'Please select at least one row to remove the Product.',
          life: 1500
        });
        return;
      }
      this.visibleDeleteConfirmation = true;
    },
    async selectedOrderMethod(item) {

      this.isActive = true;
      this.selectedOrderId = item.id;

      await this.fetchCanvasHeaderDetails(this.selectedOrderId);
      this.canvassCostHeaderDetails = this.canvasCostHeaderDetails;

      await this.fetchCanvassDetails(this.selectedOrderId);
      this.canvassDetailList = this.canvassCostDetails;

      this.assignAm = this.localAssociateSalesList.find(agent => agent.username === this.canvassCostHeaderDetails.assignAm) || null;
      this.assignPm = this.localAssociateSalesList.find(agent => agent.username === this.canvassCostHeaderDetails.assignPm) || null;

      this.isForDraft = this.canvassCostHeaderDetails.status === 'Draft' ? true : false;

    },
    openModal(type) {
    
      if (type === 'Create') {
        this.modalTitle = `Create Sales Order`;

        this.resetForm();
      } else {
        this.modalTitle = `Update Sales Order`;

        if(!this.selectedOrderId) {
          this.$toast.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Please select a sales order to update.',
            life: 1500
          });
          return;
        }

        // For Update, you can pre-fill the form with selected order details
        this.form = {         
          salesOrderNo: this.canvassCostHeaderDetails.salesOrderNo,
          customerRefNo: this.canvassCostHeaderDetails.customerRefNo,
          customerName: this.canvassCostHeaderDetails.customerName,
          salesOrderDate: this.canvassCostHeaderDetails.salesOrderDate,
          businesUnit: this.canvassCostHeaderDetails.businesUnit,
          pdexRate: this.canvassCostHeaderDetails.pdexRate,
          isCorporate: this.canvassCostHeaderDetails.corporate === 'In-House',
          yearCategory: this.canvassCostHeaderDetails.yearCategory,
          status: this.canvassCostHeaderDetails.status,
          createdSalesAgentBy: this.canvassCostHeaderDetails.createdSalesAgentBy
        } 

        this.isForUpdate = true;

      }
      this.modalVisible = true;
    },
    resetForm() {
      this.form = {         
        salesOrderNo: '',
        customerRefNo: '',
        customerName: '',
        salesOrderDate: '',
        businesUnit: '',
        pdexRate: '',
        corporate: '',
        yearCategory: '',
        status: 'Draft',
        createdSalesAgentBy: '' 
      };
    },
    formatDate(dateString) {
      if (!dateString) return '';
      // Extract date part before 'T'
      return dateString.split('T')[0];
    },
    async saveOrder() {

        const payload = {
            id: this.isForUpdate ? this.selectedOrderId : undefined,
            salesOrderNo: this.form.salesOrderNo,
            customerRefNo: this.form.customerRefNo,
            customerName: this.form.customerName,
            salesOrderDate: moment(this.form.salesOrderDate).format("YYYY-MM-DD"),
            businesUnit: this.form.businesUnit,
            pdexRate: this.form.pdexRate,
            corporate: this.form.isCorporate ? 'In-House' : 'Third-Party',
            yearCategory: this.form.yearCategory,
            status: 'Draft',
            createdSalesAgentBy: 'John Paul' 
          };
  
          if(this.isForUpdate) {

            await this.updateCanvasCost(payload, this.selectedOrderId)
            .then(() => {
              this.modalVisible = false;
              this.resetForm();
              this.$toast.add({ severity: 'info', summary: 'Updated', detail: 'You have updated the sales order', life: 3000 });
            })

            await this.fetchCanvasHeaderDetails(this.selectedOrderId);
            this.canvassCostHeaderDetails = this.canvasCostHeaderDetails;

          } else {

          await this.postCanvasCost(payload)
            .then(() => {
              
              this.modalVisible = false;
              this.resetForm();
              this.$toast.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
            })
            .catch(err => {
              console.error('Error saving order:', err);
              alert('Failed to save order. Please try again.');
            });


          }

            await this.fetchCanvas(); 
            this.canvassCostData = this.canvasCostList; 

    },
    assignAmPM() {
      
      this.visibleAssignAmPm = true;
     
    },
    async saveAssignAmPm() {

      await this.updateCanvasCostAssignAmPm({
        assignAm: this.assignAm.username,
        assignPm: this.assignPm.username
      }, this.selectedOrderId).then(() => {
        this.$toast.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Account Manager and Product Manager assigned successfully.',
          life: 1500
        });
      });

        this.visibleAssignAmPm = false;
        await this.fetchCanvasHeaderDetails(this.selectedOrderId);
        this.canvassCostHeaderDetails = this.canvasCostHeaderDetails;

    },
    openDetailModal(data) {
      this.formData = { ...data };
      this.visibleComputation = true; 
      this.isForInsert = false;
    },
    exportData() {

        if (!this.selectedOrderId) {
            this.$toast.add({
              severity: "warn",
              summary: "No Selection",
              detail: "Please select a sales order to export.",
              life: 3000
            });
            return;
          }

      this.exportFunction(this.selectedOrderId, this.canvassCostHeaderDetails)
        .catch((err) => {
          console.error("Error exporting data:", err);
          this.$toast.add({
            severity: "error",
            summary: "Export Failed",
            detail: "Failed to export data. Please try again.",
            life: 2000
          });
        });
    },
    updateData(data) {

      this.addonsForm.id = data.id;
      this.addonsForm.selectedType = data.type;
      this.addonsForm.quantity = data.quantity;
      this.addonsForm.spUnitVat = data.spUnitVat;
      this.addonsForm.costUnitVat = data.costUnitVat;

      this.isForInsertAddons = false;

    },
    async deleteChargeAddOns(data) {

      await this.deleteCanvasCostAddonsCharges(data.id)
        .then(() => {
          this.$toast.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Selected charge deleted successfully.',
            life: 1500
          });
          this.fetchCanvasCostAddonsChargesByHeader(this.selectedOrderId).then(() => {
            this.addonsChargesList = this.canvasCostAddonsCharges;
          });
        })
        .catch(err => {
          console.error('Error deleting charge:', err);
          alert('Failed to delete charge. Please try again.');
        });

    },
    postedRecord() {
      this.visibleConfirmationToPost = true;
    },
    async confirmToPostThis(){
      await this.updateCanvasCostStatus({ status: 'Posted' }, this.selectedOrderId)
        .then(() => {
          this.$toast.add({
            severity: 'success',
            summary: 'Posted',
            detail: 'The selected sales order has been posted.',
            life: 1500
          });
          this.visibleConfirmationToPost = false;

         

        })
        .catch(err => {
          console.error('Error posting record:', err);
          alert('Failed to post record. Please try again.');
        });

        await this.fetchCanvas();
        this.canvassCostData = this.canvasCostList; 

        await this.fetchCanvasHeaderDetails(this.selectedOrderId);
        this.canvassCostHeaderDetails = this.canvasCostHeaderDetails;

        this.isForDraft = this.canvassCostHeaderDetails.status === 'Draft' ? true : false;
       
      }

  }
  
}
</script>

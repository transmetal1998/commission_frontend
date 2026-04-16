<template>
  <Toast/>
  <div class=" bg-[#F8F9FA] font-sans">
    
    <div class="flex gap-2">

  <div class="w-1/4">
    <h1 class="text-2xl text-gray-400">Canvass Cost</h1>
  </div>

      <div class="flex-1 flex">
        
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
                <Button size="small" severity="primary" @click="openModal('Create')" icon="pi pi-plus  " />
                <Button size="small" severity="secondary" @click="openModal('Update')" icon="pi pi-pen-to-square" />
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
                  class="mb-2 p-2 rounded cursor-pointer hover:text-white hover:bg-[#c52b42]"
                  :class="isActive && selectedOrderId === data.id ? 'bg-[#c52b42] text-white' : 'border border-gray-300'"
                  style="border: 2px solid #E8E6DE"
                  @click="selectedOrderMethod(data)"
                >
                  <p class="font-medium hover:text-white hover:bg-[#c52b42]">{{ data.salesOrderNo }}</p>

                  <!-- <small>Customer Ref No:</small> -->
                  <p class="text-xs hover:text-white hover:bg-[#c52b42]">Customer Ref No: {{ data.customerRefNo }}</p>

                  <!-- <small>Customer Name:</small> -->
                  <p class="text-xs hover:text-white hover:bg-[#c52b42]">Customer Name: {{ data.customerName }}</p>

                  <!-- <small>Date:</small> -->
                  <p class="text-xs hover:text-white hover:bg-[#c52b42]">Date: 
                    {{ formatDate(data.salesOrderDate) }}
                  </p>
                </div>
              </template>
            </Column>
          </DataTable>
        </ScrollPanel>


        



    </div>

    <!-- Right side: content for selected item -->
    <div class="flex-1 min-w-0 bg-white rounded shadow p-4 flex flex-col h-[430px]" >
  <div v-if="isActive" class="flex flex-col h-full">
    
    <div class="grid grid-cols-3 gap-4 mb-4">
      <div><small class="text-xs text-gray-500">Customer Reference No:<br><span class="text-black font-medium">{{ canvassCostHeaderDetails.customerRefNo }}</span></small></div>
      <div><small class="text-xs text-gray-500">Customer Name: <br> <span class="text-black font-medium">{{ canvassCostHeaderDetails.customerName }}</span></small></div>
      <div><small class="text-xs text-gray-500">BU: <br> <span class="text-black font-medium">{{ canvassCostHeaderDetails.businesUnit }}</span></small> </div>
      <div><small class="text-xs text-gray-500">SO Number: <br> <span class="text-black font-medium">{{ canvassCostHeaderDetails.salesOrderNo }}</span></small></div>
      <div><small class="text-xs text-gray-500">SO Date: <br> <span class="text-black font-medium">{{ formatDate(canvassCostHeaderDetails.salesOrderDate) }}</span></small></div>
      <div><small class="text-xs text-gray-500">PDEX Rate: <br> <span class="text-black font-medium">{{ canvassCostHeaderDetails.pdexRate }}</span></small></div>
    </div>

    <div class="bg-gray-200 h-[8px] mb-4 -mx-4"></div>

    <div class="flex gap-2 justify-end mb-4">

      <ButtonGroup>
          <Button size="small" severity="secondary" @click="showDrawerDetail" label="Add Product" icon="pi pi-plus" />
          <Button size="small" severity="secondary" @click="showAddons()" label="Charges" icon="pi pi-credit-card" />
          <Button size="small" severity="primary"  @click="deleteRowDetail()"  label="Remove" icon="pi pi-trash" />
        </ButtonGroup>

    </div>

<Dialog 
  v-model:visible="visibleRight" 
  modal 
  header="Charges" 
  :style="{ width: '40rem' }"
>

  <!-- FORM SECTION -->
  <div class="p-3">
    <p class="text-sm text-gray-500 mb-3">All fields are required</p>

    <!-- Responsive Grid -->
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

      <div class="sm:col-span-2">
        <small class="text-gray-500">Cost Unit (VAT)</small>
        <InputNumber 
          size="small" 
          :minFractionDigits="2" 
          class="w-full" 
          v-model="addonsForm.costUnitVat" 
          variant="filled" 
        />
      </div>

    </div>

    <!-- Action Button -->
    <div class="mt-4">
      <Button 
        severity="primary" 
        @click="saveToAddons()" 
        label="Add" 
        class="w-full"  
        size="small" 
      />
    </div>
  </div>

  <!-- TABLE SECTION -->
  <div class="px-3 pb-3">
    <div class="overflow-x-auto">

      <DataTable 
  showGridlines 
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
    <div class="flex justify-between items-center">
      <span class="text-sm font-medium">Charges List</span>

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
      No Add-ons Found.
    </div>
  </template>

  <!-- Columns -->
  <Column field="type" header="Type" sortable />
  <Column field="quantity" header="Qty" sortable />
  <Column field="costUnitVat" header="Unit (VAT)" sortable />
  <Column field="costQuantityVat" header="Qty (VAT)" sortable />
  <Column field="costUnitWoVat" header="Unit (w/o VAT)" sortable />
  <Column field="costQuantityWoVat" header="Qty (w/o VAT)" sortable />

  <!-- DELETE COLUMN -->
  <Column header="" style="width: 3rem; text-align: center">
    <template #body="slotProps">
      <Button 
        icon="pi pi-trash"
        severity="danger"
        text
        rounded
        size="small"
        @click="deleteAddonRow(slotProps.data)"
      />
    </template>
  </Column>

</DataTable>

    </div>
  </div>

</Dialog>



    <div class="flex-1 min-h-0">
      <DataTable
        v-model:selection="selectedDetails"
        :value="canvassDetailList"
        dataKey="id"
        scrollable
        responsiveLayout="scroll"
        class="p-datatable-sm"
      >
        <Column selectionMode="multiple"></Column>
        <Column field="productCode" header="Product Code" style="min-width: 120px; font-size: 12px"></Column>
        <Column field="description" header="Description" style="min-width: 260px; font-size: 12px"></Column>
        <Column field="category" header="Category" style="min-width: 120px; font-size: 12px"></Column>
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
            <InputText v-model="form.customerRefNo" class="p-inputtext-md border-gray-300" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-gray-600">Customer Name</label>
            <InputText v-model="form.customerName" class="p-inputtext-md border-gray-300" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-gray-600">Transaction</label>
            <div class="flex gap-4 items-center h-10">
              <div class="flex items-center">
                <RadioButton v-model="form.businesUnit" inputId="buFDC" value="FDC" />
                <label for="buFDC" class="ml-2 text-sm text-gray-700">FDC</label>
              </div>
              <div class="flex items-center">
                <RadioButton v-model="form.businesUnit" inputId="buMSU" value="MSU" />
                <label for="buMSU" class="ml-2 text-sm text-gray-700">MSU</label>
              </div>
              <div class="flex items-center">
                <RadioButton v-model="form.businesUnit" inputId="buCFI" value="CFI" />
                <label for="buCFI" class="ml-2 text-sm text-gray-700">CFI</label>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-gray-600">SO Number</label>
            <InputText v-model="form.salesOrderNo" class="p-inputtext-md border-gray-300" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-gray-600">SO Date</label>
            <DatePicker v-model="form.salesOrderDate" class="w-full p-inputtext-md border-gray-300" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-gray-600">PDEX Rate</label>
            <InputText v-model="form.pdexRate" class="p-inputtext-md border-gray-300" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-gray-600">Corporate</label>
            <div class="flex items-center h-10">
              <Checkbox v-model="form.isCorporate" :binary="true" inputId="corp" />
              <label for="corp" class="ml-2 text-sm text-gray-700">In-House</label>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-gray-600">Period</label>
            <Select v-model="form.yearCategory" :options="['One Year', 'Multi-Year']" class="w-full" />
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

  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useCanvasCost } from '@/stores/canvasCost/CanvasCostStore';
import ComputationModal from '@/components/canvassCost/computationModal.vue';
import moment from "moment";


export default {
  data() {
    return {
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
        createdSalesAgentBy: ''
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
        category: '',
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
        selectedCategory: '',
        selectedType: '',
        quantity: 0.00,
        spUnitVat: 0.00,
        costUnitVat: 0.00
      },


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
      }

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
            canvasCostAddonsCharges: 'canvasCostAddonsCharges'
        }),
  },
  async mounted() {
  
    await this.fetchCanvas();
    this.canvassCostData = this.canvasCostList; 

    await this.fetchProductList();
    this.productCodeListRaw = this.productCodeList.data;

    // if(this.canvassCostData.businesUnit == 'FDC') {

      await this.fetchAddonsListByCategory();
      this.addonsListByCategoryData = this.addonsListByCategory;
      // console.log(this.addonsListByCategoryData);

    // } else {

    //   await this.fetchAddonsListByCategory();
    //   this.addonsListByCategoryData = ['Charges'];

    // }
    
      
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
            fetchCanvasCostAddonsChargesByHeader: 'fetchCanvasCostAddonsChargesByHeader'   
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

          await this.postCanvasCostAddons(payload)
            .then(() => {
              this.$toast.add({
                severity: 'success',
                summary: 'Added',
                detail: 'Add-on charge added successfully.',
                life: 1500
              });
              // Optionally, refresh the add-ons list here
            })
            .catch(err => {
              console.error('Error adding add-on charge:', err);
              alert('Failed to add add-on charge. Please try again.');
            }); 

            await this.fetchCanvasCostAddonsChargesByHeader(this.selectedOrderId).then(() => {
              this.addonsChargesList = this.canvasCostAddonsCharges;
            });

            // this.visibleRight = false;

            this.addonsForm = {
              selectedCategory: '',
              selectedType: '',
              quantity: 0.00,
              spUnitVat: 0.00,
              costUnitVat: 0.00
            };

      },
      // async onCategoryChange() {
      
      //     this.selectedType = null; // reset type
      //     if (!this.addonsForm.selectedCategory) {
      //       this.types = [];
      //       return;
      //     }

      //     await this.fetchAddonsListByType('Charges');
      //     this.types = this.addonsListByType;

        
      // },

    async showDrawerDetail() {
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

      // var addonId[] = data.id;

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

    }
  }
}
</script>

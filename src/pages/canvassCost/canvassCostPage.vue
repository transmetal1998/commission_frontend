<template>
  <Toast/>
  <div class="min-h-screen bg-[#F8F9FA] font-sans">
    
    <div class="flex gap-2">

  <div class="w-1/4">
    <InputText type="text" v-model="searchSalesOrder" size="small" class="w-full" placeholder="Search Sales Order" />
  </div>

      <div class="flex-1 flex items-center justify-between">
        <h1 class="text-2xl text-gray-400">Canvass Cost</h1>

        <div class="flex gap-2">
          <Button severity="primary" size="small" @click="openModal('Create')">
            Create Sales Order
          </Button>
          <Button severity="secondary" size="small" @click="openModal('Update')">
            Update
          </Button>
        </div>
      </div>

    </div>
    <!-- Main content: left and right panels -->
    <div class="flex mt-2 gap-2">
    <!-- Left side: card with vertical scrolling -->
    <div class="w-1/4">
      <!-- fixed-height card: adjust h-[600px] as needed -->
      <div class="bg-white rounded shadow p-4 h-[800px] flex flex-col">
        <h2 class="text-lg font-semibold mb-2">MY CANVAS</h2>
        <div class="overflow-y-auto custom-scrollbar flex-1">
          <template v-if="canvassCostData && canvassCostData.length">
            <div v-for="(item, index) in canvassCostData" :key="index" class="mb-2 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100" style="border: 5px solid #e5e7eb" @click="selectedOrderMethod(item)">
              
              <p class="font-medium text-[#c52b42]">{{ item.salesOrderNo }}</p>
              <small>Customer Ref No:</small>
              <p class="text-xs text-gray-500">{{ item.customerRefNo }}</p>
              <small>Customer Name:</small>
              <p class="text-xs text-gray-500">{{ item.customerName }}</p>
              <small>Date:</small>
              <p class="text-xs text-gray-500">{{ formatDate(item.salesOrderDate) }}</p>


            </div>
          </template>
          <div v-else class="text-gray-500">No data available</div>
        </div>
      </div>
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

    <div class="flex gap-2 mb-4">
      <Button severity="secondary" icon="pi pi-trash" size="small" @click="deleteRowDetail()" />
      <Button severity="primary" @click="showDrawerDetail" icon="pi pi-plus" size="small" />

      <div class="ml-auto">
        <Button label="FDC Services" severity="danger" variant="text" />
        <Button label="Charges" severity="danger" variant="text" />
      </div>
    </div>

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
        <Column field="productCode" header="Product Code" style="min-width: 120px"></Column>
        <Column field="description" header="Description" style="min-width: 190px"></Column>
        <Column field="category" header="Category" style="min-width: 120px"></Column>
        <Column field="spUnitVat" header="Unit Vat" style="min-width: 120px"></Column>
        <Column field="spQtyVat" header="Qty VAT" style="min-width: 120px"></Column>
        <Column field="spUnitWoVat" header="Unit w/o VAT" style="min-width: 120px"></Column>
        <Column field="spQtyWoVat" header="Qty w/o VAT" style="min-width: 120px"></Column>
        <Column field="poRefDate" header="PO Ref Date" style="min-width: 120px"></Column>
        <Column field="recommendedSupplier" header="Supplier" style="min-width: 120px"></Column>
        <Column field="costUnitVat" header="Unit VAT" style="min-width: 120px"></Column>
        <Column field="costQuantityVat" header="Qty VAT" style="min-width: 120px"></Column>
        <Column field="costUnitWoVat" header="Unit w/o VAT" style="min-width: 120px"></Column>
        <Column field="costQuantityWoVat" header="Qty w/o VAT" style="min-width: 120px"></Column>
        <Column field="profitMarginWoVat" header="Profit Margin w/o VAT" style="min-width: 120px"></Column>
        <Column field="profitMargin" header="Profit Margin" style="min-width: 120px"></Column>
        <Column field="targetSellingPriceVat" header="Target Price VAT" style="min-width: 120px"></Column>
        </DataTable>
    </div>
  </div>

  <div v-else class="text-gray-500 p-4">Select Purchase Order/ Customer.</div>
  </div>
    </div>

    <ComputationModal
      v-model:visible="visibleComputation"
      :form="formData"
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
            <label class="text-sm font-bold text-gray-600">Business Unit</label>
            <div class="flex gap-4 items-center h-10">
              <div class="flex items-center">
                <RadioButton v-model="form.businesUnit" inputId="buFDC" value="FDC" />
                <label for="buFDC" class="ml-2 text-sm text-gray-700">FDC</label>
              </div>
              <div class="flex items-center">
                <RadioButton v-model="form.businesUnit" inputId="buMSU" value="MSU" />
                <label for="buMSU" class="ml-2 text-sm text-gray-700">MSU</label>
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
            <Dropdown v-model="form.yearCategory" :options="['One Year', 'Multi-Year']" class="w-full p-inputtext-md border-gray-300" />
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

    <Dialog v-model:visible="visibleDeleteConfirmation" modal header="Edit Profile" :style="{ width: '25rem' }">
        <span class="text-surface-500 dark:text-surface-400 block mb-8">Update your information.</span>
        <div class="flex items-center gap-4 mb-4">
            <label for="username" class="font-semibold w-24">Username</label>
            <InputText id="username" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex items-center gap-4 mb-8">
            <label for="email" class="font-semibold w-24">Email</label>
            <InputText id="email" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
            <Button type="button" label="Save" @click="visible = false"></Button>
        </div>
    </Dialog>

  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useCanvasCost } from '@/stores/CanvasCost/CanvasCostStore';
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
      productCodeListRaw: [],
      searchSalesOrder: '',
      visibleDeleteConfirmation: false

    }
  },
  computed: {
    ...mapState(useCanvasCost, {
            canvasCostList: 'canvasCostList',
            canvasCostHeaderDetails: 'canvasCostHeaderDetails',
            canvassCostDetails: 'canvassCostDetails',
            productCodeList: 'productCodeList'
        }),
  },
  async mounted() {
  
    await this.fetchCanvas();
    this.canvassCostData = this.canvasCostList; 

    await this.fetchProductList();
    this.productCodeListRaw = this.productCodeList.data;
  
      
  },
  methods: {
    ...mapActions(useCanvasCost, {
            fetchCanvas: 'fetchCanvas',
            fetchCanvasHeaderDetails: 'fetchCanvasHeaderDetails',
            fetchProductList: 'fetchProductList',
            postCanvasCost: 'postCanvasCost',
            fetchCanvassDetails: 'fetchCanvassDetails',
            deleteCanvasCostDetail: 'deleteCanvasCostDetail'
        }),
    
    async showDrawerDetail() {
      this.visibleComputation = true;
    },      
    
    async loadTableData() {
      await this.fetchCanvassDetails(this.selectedOrderId).then(() => {
        this.canvassDetailList = this.canvassCostDetails;
      });
      this.visibleComputation = false;
    },
    async deleteRowDetail() {
       
      this.visibleDeleteConfirmation = false;

       if (!this.selectedDetails.length) {
          this.$toast.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Please select at least one row.',
            life: 1500
          });
          return;
        }

        // extract IDs
        const ids = this.selectedDetails.map(item => item.id);

        try {
          await this.deleteCanvasCostDetail(ids);

          this.$toast.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Selected records deleted successfully.',
            life: 1500
          });

          // refresh table
          this.loadTableData();

          // clear selection
          this.selectedDetails = [];

        } catch (err) {
          console.error(err);
        }
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
      this.modalTitle = `${type} Sales Order`;
      if (type === 'Create') {
        this.resetForm();
      } else {

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
  
          console.log(payload);

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

            await this.fetchCanvas(); 
            this.canvassCostData = this.canvasCostList; 

    }
  }
}
</script>

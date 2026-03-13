<template>
  <Toast/>
  <div class="min-h-screen bg-[#F8F9FA] font-sans">
    <!-- Top buttons section -->
    <div class="flex justify-end gap-2 p-2">
      <Button severity="primary" size="small" @click="openModal('Create')">Create Sales Order</Button>
      <Button severity="secondary" size="small">Update</Button>
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
            <div v-for="(item, index) in canvassCostData" :key="index" class="mb-2 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100" @click="selectedOrderMethod(item)">
              <!-- <small>Sales Order No:</small> -->
              <p class="font-medium text-[#c52b42]">{{ item.salesOrderNo }}</p>

              <small>Customer Ref No:</small>
              <p class="text-xs text-gray-500">{{ item.customerRefNo }}</p>

              <small>Customer Name:</small>
              <p class="text-xs text-gray-500">{{ item.customerName }}</p>

              <small>Date:</small>
              <p class="text-xs text-gray-500">{{ item.salesOrderDate }}</p>


            </div>
          </template>
          <div v-else class="text-gray-500">No data available</div>
        </div>
      </div>
    </div>

    <!-- Right side: content for selected item -->
    <div class="flex-1 min-w-0 bg-white rounded shadow p-4 flex flex-col h-[430px]">
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
      <Button severity="secondary" icon="pi pi-trash" size="small" />
      <Button severity="primary" @click="showDrawerDetail" icon="pi pi-plus" size="small" />
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

    <Drawer v-model:visible="visibleRight" header="Product Details" position="right">
      <div>
        <div class="card flex flex-col gap-1">

          <div>
            <small>Product Code</small>
            <InputGroup>
                <InputText placeholder="Enter Item Number" 
                v-model="productCode" 
                type="text" 
                class="w-full" 
                size="small"/>
                <InputGroupAddon>
                    <Button icon="pi pi-search" @click="checkProductCode" size="small" severity="secondary" variant="text"/>
                </InputGroupAddon>
            </InputGroup>
          </div>

          <div>
            <small>Description</small>
            <!-- <InputText  disabled ref="nextTextbox" type="text"  /> -->
            <Textarea v-model="description" class="w-full" disabled rows="5" cols="30" />


          </div>

          <div>
            <small>Category</small>
            <InputText v-model="category" type="text" class="w-full" size="small" />
          </div>

          <div>
            <small>Quantity</small>
            <InputText v-model="quantity" type="text" class="w-full" size="small" />
          </div>

          <div class="mt-2">
            <label for="" class="font-bold text-[#c52b42]">Selling Price</label>
          </div>

          <div>
            <small>Unit VAT</small>
            <InputText v-model="spUnitVat" type="text" class="w-full" size="small" />
          </div>

          <div>
            <small>Quantity VAT</small>
            <InputText v-model="spQtyVat" disabled type="text" class="w-full" size="small" />
          </div>

          <div>
            <small>Unit w/o VAT</small>
            <InputText v-model="spUnitWoVat" disabled type="text" class="w-full" size="small" />
          </div>

          <div>
            <small>Quantity w/o VAT</small>
            <InputText v-model="spQtyWoVat" disabled type="text" class="w-full" size="small" />
          </div>

          <div>
            <small>PO Reference Date</small>
            <DatePicker v-model="poRefDate" class="w-full" size="small" />
          </div>

          <div>
            <small>Recommended Supplier</small>
            <InputText v-model="recommendedSupplier" type="text" class="w-full" size="small" />
          </div>

          <div class="mt-2">
            <label for="" class="font-bold text-[#c52b42]">Cost</label>
          </div>

          <div>
            <small>Unit VAT</small>
            <InputText v-model="costUnitVat" type="text" class="w-full" size="small" />
          </div>

          <div>
            <small>Quantity VAT</small>
            <InputText v-model="costQuantityVat" disabled type="text" class="w-full" size="small" />
          </div>

          <div>
            <small>Unit w/o VAT</small>
            <InputText v-model="costUnitWoVat" disabled type="text" class="w-full" size="small" />
          </div>

          <div>
            <small>Quantity w/o VAT</small>
            <InputText v-model="costQuantityWoVat" disabled type="text" class="w-full" size="small" />
          </div>

          <div>
            <small>Profit Margin w/o VAT</small>
            <InputText v-model="profitMarginWoVat" disabled type="text" class="w-full" size="small" />
          </div>

           <div>
            <small>Profit Margin VAT</small>
            <InputText v-model="profitMargin" disabled type="text" class="w-full" size="small" />
          </div>

           <div>
            <small>Target Selling Price VAT</small>
            <InputText v-model="targetSellingPriceVat" disabled type="text" class="w-full" size="small" />
          </div>

         </div>
      </div>
      <template #footer>
       <div class="flex gap-2">
        <Button label="Sync SAP" class="w-1/2" severity="secondary" />
        <Button label="Save" class="w-1/2" @click="saveCanvassDetail()" severity="primary" />
    </div>
    </template>
    </Drawer>

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
            <InputText v-model="form.refNo" class="p-inputtext-md border-gray-300" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-gray-600">Customer Name</label>
            <InputText v-model="form.customerName" class="p-inputtext-md border-gray-300" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-gray-600">Business Unit</label>
            <div class="flex gap-4 items-center h-10">
              <div class="flex items-center">
                <RadioButton v-model="form.bu" inputId="buFDC" value="FDC" />
                <label for="buFDC" class="ml-2 text-sm text-gray-700">FDC</label>
              </div>
              <div class="flex items-center">
                <RadioButton v-model="form.bu" inputId="buMSU" value="MSU" />
                <label for="buMSU" class="ml-2 text-sm text-gray-700">MSU</label>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-gray-600">SO Number</label>
            <InputText v-model="form.soNumber" class="p-inputtext-md border-gray-300" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-gray-600">SO Date</label>
            <Calendar v-model="form.date" dateFormat="yy-mm-dd" placeholder="yyyy-mm-dd" class="w-full p-inputtext-md" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-gray-600">PDEX Rate</label>
            <InputText v-model="form.pdex" class="p-inputtext-md border-gray-300" />
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
            <Dropdown v-model="form.period" :options="['One Year', 'Multi-Year']" class="w-full p-inputtext-md border-gray-300" />
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3 pt-6 pb-2">
            <Button 
              size="small"
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

  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useCanvasCost } from '@/stores/CanvasCost/CanvasCostStore';


export default {
  data() {
    return {
      isActive: false,
      selectedOrderId: null,
      visibleRight: false,
      modalVisible: false,
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
        corporate: '',
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

      productCodeListRaw: [],
      selectedCode: null,
      productCode: '',
      description: '',
      category: '',
      quantity: '',
      spUnitVat: '',
      spQtyVat: 0.00,
      spUnitWoVat: 0.00,
      spQtyWoVat: 0.00,
      poRefDate: '',
      recommendedSupplier: '',
      costUnitVat: '',
      costQuantityVat: 0.00,
      costUnitWoVat: 0.00,
      costQuantityWoVat: 0.00,
      profitMarginWoVat: 0.00,
      profitMargin: 0.00,
      targetSellingPriceVat: 0.00


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
            postCanvasCostDetail: 'postCanvasCostDetail'
            
        }),
    async showDrawerDetail() {
      
      console.log('Selected Order ID:', this.selectedOrderId);
      this.visibleRight = true;

    },      
    checkProductCode() {
      const exists = this.productCodeListRaw.some(
        item => item.itemNumber === this.productCode
      );

      if (exists) {
        this.$toast.add({ severity: 'success', summary: 'Success', detail: 'The entered product code is valid.', life: 1500 });

        this.description = this.productCodeListRaw.find(item => item.itemNumber === this.productCode).itemDescription;

      } else {
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'The entered product code was not found in the database. If the product exists in SAP, please click "Sync SAP" to retrieve the latest records.', life: 1500 });
        this.productCode = "";
      }
    },
    async saveCanvassDetail() {
        await this.postCanvasCostDetail({
          canvasCostHeaderId: this.selectedOrderId,
          productCode: this.productCode,
          description: this.description,
          category: this.category,
          quantity: this.quantity,
          spUnitVat: this.spUnitVat,
          spQtyVat: this.spQtyVat,
          spUnitWoVat: this.spUnitWoVat,
          spQtyWoVat: this.spQtyWoVat,
          poRefDate: this.poRefDate ? this.poRefDate.toISOString() : null,
          recommendedSupplier: this.recommendedSupplier,
          costUnitVat: this.costUnitVat,
          costQuantityVat: this.costQuantityVat,
          costUnitWoVat: this.costUnitWoVat,
          costQuantityWoVat: this.costQuantityWoVat,
          profitMarginWoVat: this.profitMarginWoVat,
          profitMargin: this.profitMargin,
          targetSellingPriceVat: this.targetSellingPriceVat
        })


        this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Canvass detail saved successfully.', life: 1500 });

        await this.fetchCanvassDetails(this.selectedOrderId);
        this.canvassDetailList = this.canvassCostDetails;

        this.productCode = '';
        this.description = '';
        this.category = '';
        this.quantity = '';
        this.spUnitVat = '';
        this.spQtyVat = 0.00;
        this.spUnitWoVat = 0.00;
        this.spQtyWoVat = 0.00;
        this.poRefDate = '';
        this.recommendedSupplier = '';
        this.costUnitVat = '';
        this.costQuantityVat = 0.00;
        this.costUnitWoVat = 0.00;
        this.costQuantityWoVat = 0.00;
        this.profitMarginWoVat = '';
        this.profitMargin = '';
        this.targetSellingPriceVat = '';

        this.visibleRight = false;

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
      } else if (this.activeOrder) {
        this.form = {
          refNo: this.activeOrder.refNo,
          customerName: this.activeOrder.customer,
          bu: 'FDC',
          soNumber: this.activeOrder.soNumber,
          date: new Date(),
          pdex: '56.20',
          isCorporate: false,
          period: 'One Year'
        };
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
            salesOrderNo: this.form.soNumber,
            customerRefNo: this.form.refNo,
            customerName: this.form.customerName,
            salesOrderDate: this.form.date ? this.form.date.toISOString() : null,
            businesUnit: this.form.bu,
            pdexRate: this.form.pdex,
            corporate: this.form.isCorporate ? 'In-House' : 'Third-Party',
            yearCategory: this.form.period,
            status: 'Draft',
            createdSalesAgentBy: 'John Paul' 
          };
  
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

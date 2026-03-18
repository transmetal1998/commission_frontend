<template>
  <Toast/>
  <div class="min-h-screen bg-[#F8F9FA] font-sans">
    
    <div class="flex gap-2">

  <div class="w-1/4">
    <InputText type="text" v-model="value" size="small" class="w-full" placeholder="Search Sales Order" />
  </div>

      <div class="flex-1 flex items-center justify-between">
        <h1 class="text-2xl text-gray-400">Canvass Cost</h1>

        <div class="flex gap-2">
          <Button severity="primary" size="small" @click="openModal('Create')">
            Create Sales Order
          </Button>
          <Button severity="secondary" size="small">
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
              <!-- <small>Sales Order No:</small> -->
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
      <Button severity="secondary" icon="pi pi-trash" size="small" />
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

    <Dialog v-model:visible="visibleComputation" modal header="Product Details" :style="{ width: '60vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        
        <div class="flex gap-4">
        <div class="w-2/3">
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
                    <small>Category</small>
                    <InputText v-model="category" type="text" class="w-full" size="small" />
                  </div>

                  <div>
                    <small>Quantity</small>
                    <InputNumber v-model="quantity" :minFractionDigits="2" @blur="computeRaw()" type="text" class="w-full" size="small" />
                  </div>

                  <div>
                    <small>Selling Price Unit VAT</small>
                    <InputNumber v-model="spUnitVat" :minFractionDigits="2" @blur="computeRaw()" type="text" class="w-full" size="small" />
                  </div>

                  <div>
                  <small>Cost Unit VAT</small>
                      <InputNumber 
                        v-model="costRawUnitVat" 
                        :minFractionDigits="2"
                        @blur="computeRaw()"
                        type="text" 
                        size="small" 
                        class="w-full"
                      />
                  </div>
                <div class="flex gap-2 mt-2">
                    <Button 
                      icon="pi pi-calculator"
                      
                      size="small" 
                      severity="info" 
                      @click="computeRaw()" 
                    />
                    <Button 
                      icon="pi pi-sync"
                      
                      size="small" 
                      severity="info" 
                    />
                    <Button 
                      label="Save" 
                      class="w-full"
                      size="small" 
                      severity="primary" 
                      @click="saveCanvassDetail()" 
                    />
                  </div>
                  
            </div>
            <div class="w-full">

                  <div class="flex gap-2">
                    <div class="w-1/3">
                      <small  class="text-[#c52b42] font-bold">Description</small>
                    </div>
                    <div class="flex-1">
                    <small>: {{ this.description }}</small>
                    </div>
                  </div>

                  <div class="flex gap-2 mt-2">
                    <div class="w-1/3">
                      <small class="text-[#c52b42] font-bold">Selling Price</small>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <div class="w-1/3">
                      <small>Quantity VAT</small>
                    </div>
                    <div class="flex-1">
                    <small>: {{ this.spQtyVat }}</small>
                    </div>
                  </div>
                  
                  <div class="flex gap-2">
                    <div class="w-1/3">
                      <small>Unit w/o VAT</small>
                    </div>
                    <div class="flex-1">
                    <small>: {{ this.spUnitWoVat }}</small>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <div class="w-1/3">
                      <small>Quantity w/o VAT</small>
                    </div>
                    <div class="flex-1">
                      <small>: {{ this.spQtyWoVat }}</small>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <div class="w-1/3">
                      <small class="text-[#c52b42] font-bold">Cost</small>
                    </div>
                  </div>
          
                  <div class="flex gap-2">
                    <div class="w-1/3">
                      <small>Unit VAT x 12 months</small>
                    </div>
                    <div class="flex-1">
                    <small>: {{ this.costUnitVat }}</small>
                    </div>
                  </div>

                <div class="flex gap-2">
                    <div class="w-1/3">
                      <small>Quantity VAT</small>
                    </div>
                    <div class="flex-1">
                    <small>: {{ this.costQuantityVat }}</small>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <div class="w-1/3">
                      <small>Unit w/o VAT</small>
                    </div>
                    <div class="flex-1">
                    <small>: {{ this.costUnitWoVat }}</small>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <div class="w-1/3">
                      <small>Quantity w/o VAT</small>
                    </div>
                    <div class="flex-1">
                    <small>: {{ this.costQuantityWoVat }}</small>
                    </div>
                  </div>

                  <div class="flex gap-2 mt-2">
                    <div class="w-1/3">
                      <small class="text-[#c52b42] font-bold">Others</small>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <div class="w-1/3">
                      <small>Profit Margin w/o VAT</small>
                    </div>
                    <div class="flex-1">
                    <small>: {{ this.profitMarginWoVat }}</small>
                    </div>
                  </div>


                  <div class="flex gap-2">
                    <div class="w-1/3">
                      <small>Profit Margin VAT</small>
                    </div>
                    <div class="flex-1">
                    <small>: {{ this.profitMargin }}</small>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <div class="w-1/3">
                      <small>Target Selling Price VAT</small>
                    </div>
                    <div class="flex-1">
                    <small>: {{ this.targetSellingPriceVat }}</small>
                    </div>
                  </div>

            </div>
        </div>
      
      
    </Dialog>

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
            <DatePicker v-model="form.date" class="w-full p-inputtext-md border-gray-300" />
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
import { parse } from 'vue/compiler-sfc';
import moment from "moment";


export default {
  data() {
    return {
      isActive: false,
      selectedOrderId: null,
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

      productCodeListRaw: [],
      selectedCode: null,
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
      targetSellingPriceVat: 0.00,
      isValidProductCode: false,


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
    computeRaw() {


        let _Quantity = parseFloat(this.quantity);

        let _SPQtyVat = parseFloat(this.spUnitVat) * parseFloat(_Quantity);
        this.spQtyVat = _SPQtyVat.toFixed(2);

        let _SPUnitWoVat = parseFloat(this.spUnitVat) / 1.12;
        this.spUnitWoVat = _SPUnitWoVat.toFixed(2);

        let _SPQtyWoVat = parseFloat(_SPUnitWoVat) * parseFloat(_Quantity);
        this.spQtyWoVat = _SPQtyWoVat.toFixed(2);

        let _costUnitVat = ( parseFloat(this.costRawUnitVat) * 12 ) * 1.12;
        this.costUnitVat = _costUnitVat.toFixed(2);

        let _costQuantityVat = parseFloat(_Quantity) * _costUnitVat;
        this.costQuantityVat = _costQuantityVat.toFixed(2);

        let _costUnitWoVat = parseFloat(_costUnitVat) / 1.12;
        this.costUnitWoVat = _costUnitWoVat.toFixed(2);
        
        let _CostQuantityWoVat = parseFloat(_costUnitWoVat) * parseFloat(_Quantity);
        this.costQuantityWoVat = _CostQuantityWoVat.toFixed(2);

        let _profitMarginWoVat = (_SPUnitWoVat * parseFloat(_Quantity)) - (_costUnitWoVat * parseFloat(_Quantity));
        this.profitMarginWoVat = _profitMarginWoVat.toFixed(2);

        let _profitMargin = _profitMarginWoVat != 0 ? (_profitMarginWoVat / _SPQtyWoVat) * 100 : 0;
        this.profitMargin = _profitMargin.toFixed(2);

        let _targetSellingPriceVat = _costQuantityVat / ( 1 - 0)
        this.targetSellingPriceVat = _targetSellingPriceVat.toFixed(2);


    },
    async showDrawerDetail() {
      
      console.log('Selected Order ID:', this.selectedOrderId);
      this.visibleComputation = true;
      // this.visibleRight = true;

    },      
    checkProductCode() {
      const exists = this.productCodeListRaw.some(
        item => item.itemNumber === this.productCode
      );

      if (exists) {
        this.$toast.add({ severity: 'success', summary: 'Success', detail: 'The entered product code is valid.', life: 1500 });

        this.description = this.productCodeListRaw.find(item => item.itemNumber === this.productCode).itemDescription;

        this.isValidProductCode = true;

      } else {
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'The entered product code was not found in the database. If the product exists in SAP, please click "Sync SAP" to retrieve the latest records.', life: 1500 });
        this.productCode = "";
        this.isValidProductCode = false;
      }
    },
    async saveCanvassDetail() {

      if(this.isValidProductCode) {

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
          costUnitVat: this.costRawUnitVat, //raw unit vat
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
        this.quantity = 0.00;
        this.spUnitVat = 0.00;
        this.spQtyVat = 0.00;
        this.spUnitWoVat = 0.00;
        this.spQtyWoVat = 0.00;
        this.poRefDate = '';
        this.recommendedSupplier = '';
        this.costUnitVat = 0.00;
        this.costQuantityVat = 0.00;
        this.costUnitWoVat = 0.00;
        this.costQuantityWoVat = 0.00;
        this.profitMarginWoVat = 0.00;
        this.profitMargin = 0.00;
        this.targetSellingPriceVat = 0.00;

        this.visibleComputation = false;
        this.isValidProductCode = false;

        } else {
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Please enter a valid product code before saving.', life: 1500 });
          this.isValidProductCode = false;
          this.productCode = '';
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
            salesOrderDate: moment(this.form.date).format("YYYY-MM-DD"),
            businesUnit: this.form.bu,
            pdexRate: this.form.pdex,
            corporate: this.form.isCorporate ? 'In-House' : 'Third-Party',
            yearCategory: this.form.period,
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

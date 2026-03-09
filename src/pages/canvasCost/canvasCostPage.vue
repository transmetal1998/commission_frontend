<template>
  <div class="min-h-screen bg-[#F8F9FA] font-sans flex flex-col">
    <div class="flex flex-col lg:flex-row flex-1 overflow-hidden p-3 md:p-4 gap-4 lg:gap-6">
      
      <aside class="w-full lg:w-[320px] flex flex-col flex-shrink-0 h-full max-h-[50vh] lg:max-h-full">
        <div class="flex flex-col gap-2 mb-4">
          <InputText 
            v-model="searchQuery" 
            placeholder="Search Sales Order" 
            class="w-full p-inputtext-md border-gray-300 rounded shadow-sm"
          />
          <div class="flex items-center gap-2">
            <Dropdown 
              v-model="selectedStatus" 
              :options="['All', 'Completed', 'Draft']" 
              placeholder="Select Sales Order Status" 
              class="w-full p-inputtext-md border-gray-300 shadow-sm"
            />
            <Button 
              icon="pi pi-folder-open" 
              class="p-button-outlined p-button-secondary bg-white w-12 h-12 p-0 flex items-center justify-center border-gray-300 shadow-sm" 
            />
          </div>
        </div>

        <h3 class="font-bold text-lg text-gray-800 mb-3 uppercase tracking-wide">MY CANVAS</h3>

        <div class="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          <ul class="flex flex-col gap-3 md:gap-4">
            <li 
              v-for="order in filteredOrders" 
              :key="order.id"
              @click="selectedOrderId = order.id"
              class="relative p-4 rounded-lg border shadow-sm cursor-pointer transition-all duration-200"
              :class="[
                order.status === 'Draft' ? 'bg-[#C6011F] text-white border-[#C6011F]' : 'bg-white text-gray-700 border-gray-200',
                selectedOrderId === order.id ? 'active-selection' : ''
              ]"
            >
              <span 
                class="absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm"
                :class="order.status === 'Draft' ? 'bg-white text-[#C6011F]' : 'bg-[#10b981] text-white'"
              >
                {{ order.status }}
              </span>

              <div class="text-sm md:text-base leading-relaxed mt-2">
                <p><strong>Sales Order No.:</strong> {{ order.soNumber }}</p>
                <p><strong>Customer Ref. No.:</strong> {{ order.refNo }}</p>
                <div class="h-3 md:h-4"></div>
                <p><strong>Customer Name:</strong> {{ order.customer }}</p>
                <p><strong>Date:</strong> {{ order.date }}</p>
              </div>
            </li>
          </ul>
        </div>
      </aside>

      <main class="flex-1 flex flex-col min-w-0 mt-4 lg:mt-0">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 px-1 gap-3">
          <h1 class="text-2xl md:text-3xl lg:text-4xl font-light text-gray-400 tracking-tight">Canvas Cost</h1>
          <div class="flex gap-2 w-full sm:w-auto">
            <Button 
              label="Create Sales Order" 
              @click="openModal('Create')"
              class="flex-1 sm:flex-none text-sm px-5 py-3 font-bold shadow-md text-white border-none rounded"
              style="background-color: #C6011F;"
            />
            <Button 
              label="Update" 
              @click="openModal('Update')"
              :disabled="!selectedOrderId"
              class="flex-1 sm:flex-none text-sm px-6 py-3 font-bold bg-[#E9ECEF] text-gray-600 border border-gray-300 rounded hover:bg-gray-200 disabled:opacity-50"
            />
          </div>
        </div>

        <div class="flex-1 border-2 border-[#8193f9] bg-white rounded-sm flex items-center justify-center p-6 md:p-10 shadow-sm overflow-y-auto">
          <div v-if="activeOrder" class="w-full h-full text-left animate-fade-in">
             <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Order #{{ activeOrder.soNumber }}</h2>
             <p class="text-sm md:text-base text-gray-500 mb-6 italic">Viewing details for {{ activeOrder.customer }}</p>
             <hr class="mb-6 border-gray-100">
             
             <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-2xl">
                <div class="space-y-1">
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest">Customer Reference</label>
                  <p class="text-lg md:text-xl font-medium text-gray-700">{{ activeOrder.refNo }}</p>
                </div>
                <div class="space-y-1">
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest">Submission Date</label>
                  <p class="text-lg md:text-xl font-medium text-gray-700">{{ activeOrder.date }}</p>
                </div>
             </div>
          </div>
          <div v-else class="text-gray-400 text-base italic text-center">
            Select Purchase Order/ Customer.
          </div>
        </div>
      </main>

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
              label="Cancel" 
              @click="modalVisible = false" 
              class="bg-[#CED4DA] text-gray-800 border-none px-6 py-2 text-base font-bold rounded shadow-sm" 
            />
            <Button 
              :label="modalTitle.split(' ')[0]" 
              @click="saveOrder" 
              class="border-none px-8 py-2 text-base font-bold text-white rounded shadow-sm" 
              style="background-color: #C6011F;" 
            />
          </div>
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'pinia';
import { useAuthStore } from '@/stores/auth/authStore';


export default {
  data() {
    return {
      selectedOrderId: null,
      modalVisible: false,
      modalTitle: 'Create Sales Order',
      searchQuery: '',
      selectedStatus: 'All',
      form: {
        refNo: '',
        customerName: '',
        bu: 'FDC',
        soNumber: '',
        date: null,
        pdex: '',
        isCorporate: false,
        period: 'One Year'
      },
      salesOrders: [
        { id: 1, soNumber: 'CS00001', refNo: 'AA202500101', customer: 'Vista Land', date: 'Jan. 05, 2026', status: 'Completed' },
        { id: 2, soNumber: 'CS00002', refNo: 'BB202500101', customer: 'Ayala Mall', date: 'Dec. 25, 2022', status: 'Completed' },
        { id: 3, soNumber: 'CS00003', refNo: 'CB992928281', customer: 'Axios Javascript', date: 'Jan. 30, 2026', status: 'Draft' },
        { id: 4, soNumber: 'CS00004', refNo: 'AA202308888', customer: 'Vista Land', date: 'Mar. 01, 2026', status: 'Completed' }
      ]
    }
  },
  computed: {
    filteredOrders() {
      let filtered = this.salesOrders;
      if (this.selectedStatus !== 'All') {
        filtered = filtered.filter(o => o.status === this.selectedStatus);
      }
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(o => 
          o.soNumber.toLowerCase().includes(query) || 
          o.customer.toLowerCase().includes(query)
        );
      }
      return filtered;
    },
    activeOrder() {
      return this.salesOrders.find(o => o.id === this.selectedOrderId);
    }
  },
  methods: {
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
      this.form = { refNo: '', customerName: '', bu: 'FDC', soNumber: '', date: null, pdex: '', isCorporate: false, period: 'One Year' };
    },
    saveOrder() {
      this.modalVisible = false;
    }
  }
}
</script>

<style scoped>
/* Indicator Style */
.active-selection {
  outline: 3px solid #8193f9 !important;
  outline-offset: 2px;
  z-index: 10;
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #dee2e6; border-radius: 10px; }

/* Responsive Adjustments */
@media (max-width: 1024px) {
  .active-selection {
    outline-width: 2px;
  }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
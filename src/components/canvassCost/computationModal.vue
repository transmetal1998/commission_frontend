<template>
    <Dialog 
        :visible="visible"
         @update:visible="$emit('update:visible', $event)" 
        modal 
        :header="synching ? 'Fetching latest data from SAP...' : 'Canvass Cost Detail'" 
        :style="{ width: '60vw' }" 
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">

        <div class="flex gap-4" v-if="synching">
          <div class="w-2/3">

                  <div>
                      <Skeleton width="5rem" borderRadius="4px" class="mb-2"></Skeleton>
                      <Skeleton height="2rem" class="mb-2" borderRadius="8px"></Skeleton>
                  </div>
                  <div>
                      <Skeleton width="5rem" borderRadius="4px" class="mb-2"></Skeleton>
                      <Skeleton height="2rem" class="mb-2" borderRadius="8px"></Skeleton>
                    </div>

                    <div>
                      <Skeleton width="5rem" borderRadius="4px" class="mb-2"></Skeleton>
                      <Skeleton height="2rem" class="mb-2" borderRadius="8px"></Skeleton>
                    </div>

                    <div>
                      <Skeleton width="5rem" borderRadius="4px" class="mb-2"></Skeleton>
                      <Skeleton height="2rem" class="mb-2" borderRadius="8px"></Skeleton>
                    </div>

                    <div>
                        <Skeleton width="5rem" borderRadius="4px" class="mb-2"></Skeleton>
                        <Skeleton height="2rem" class="mb-2" borderRadius="8px"></Skeleton>
                    </div>
                  <div class="flex gap-2 mt-2">
                      <Skeleton width="3rem" height="2rem" borderRadius="4px" class="mb-2"></Skeleton>
                      <Skeleton width="3rem" height="2rem" borderRadius="4px" class="mb-2"></Skeleton>
                      <Skeleton width="100%" height="2rem" borderRadius="4px" class="mb-2"></Skeleton>

                    </div>
                    
          </div>
          <div class="w-full">

                <div class="flex gap-2">
                  <div class="w-1/3">
                    <Skeleton width="5rem" borderRadius="4px" class="mb-2"></Skeleton>
                  </div>
                  <div class="flex-1">
                  <Skeleton width="15rem" borderRadius="4px" class="mb-2"></Skeleton>
                  </div>
                </div>

                <div class="flex gap-2 mt-2">
                  <div class="w-1/3">
                    <Skeleton width="5rem" borderRadius="4px" class="mb-2"></Skeleton>
                  </div>
                  <div class="flex-1">
                    <Skeleton width="5rem" borderRadius="4px" class="mb-2"></Skeleton>
                  </div>
                </div>

                <div class="flex gap-2">
                  <Skeleton width="100%" height="4rem" borderRadius="8px"></Skeleton>
                </div>

                <div class="flex gap-2 mt-2">
                  <div class="w-1/3">
                    <Skeleton width="5rem" borderRadius="4px" class="mb-2"></Skeleton>
                  </div>
                </div>
        
                <div class="flex gap-2">
                  <Skeleton width="100%" height="4rem" borderRadius="8px"></Skeleton>
                </div>

                <div class="flex gap-2 mt-2">
                  <div class="w-1/3">
                    <Skeleton width="5rem" borderRadius="4px" class="mb-2"></Skeleton>
                  </div>
                </div>

                <div class="flex gap-2">
                  <Skeleton width="100%" height="4rem" borderRadius="8px"></Skeleton>
                </div>

          </div>
        </div>

        <div class="flex gap-4" v-else>
          <div class="w-2/3">
                  <div>
                      <small>Product Code</small>
                      <InputGroup>
                          <InputText placeholder="Enter Item Number" 
                          v-model="localForm.productCode" 
                          type="text" 
                          class="w-full" 
                          size="small"/>
                          <InputGroupAddon>
                              <Button icon="pi pi-search" v-tooltip.bottom="'Compute Raw'"  @click="checkProductCode" size="small" severity="primary"/>
                          </InputGroupAddon>
                      </InputGroup>
                  </div>
                  <div>
                      <small>Category</small>
                      <InputText v-model="localForm.itemCategory" :disabled="localHeaderForm.businesUnit == 'FDC'" type="text" class="w-full" size="small" />
                    </div>

                    <div>
                      <small>Quantity</small>
                      <InputNumber v-model="localForm.quantity" :minFractionDigits="2" type="text"  @update:modelValue="changeInput" class="w-full" size="small" />
                    </div>

                    <div>
                      <small>Selling Price with VAT per Unit</small>
                      <InputNumber v-model="localForm.spUnitVat"  @update:modelValue="changeInput" :minFractionDigits="2" type="text" class="w-full" size="small" />
                    </div>

                    <div>
                    <small>Cost Unit with VAT per Unit</small>
                        <InputNumber 
                          v-model="localForm.costUnitVat" 
                           @update:modelValue="changeInput"
                          :minFractionDigits="2"
                          type="text" 
                          size="small" 
                          class="w-full"
                        />
                    </div>
                  <div class="flex gap-2 mt-2">
                      <Button 
                        icon="pi pi-calculator"
                        v-tooltip.bottom="'Compute Raw'"
                        size="small" 
                        severity="secondary" 
                        @click="computeRaw()" 
                      />
                      <Button 
                        icon="pi pi-sync"
                        v-tooltip.bottom="'Sync SAP'"
                        @click="clickManualSync()"
                        size="small" 
                        severity="secondary" 
                      />
                      <Button 
                        icon="pi pi-eraser"
                        v-tooltip.bottom="'Clear Fields'"
                        @click="clearField()"
                        size="small" 
                        severity="secondary" 
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

                <div class="flex gap-2" v-if="localHeaderForm.businesUnit == 'FDC'">
                  <div class="w-1/3">
                    <small  class="text-[#c52b42] font-bold">Description</small>
                  </div>
                  <div class="flex-1">
                  <small>: {{ localForm.description }} </small>
                  </div>
                </div>

                <div class="flex gap-2" v-else>
                  <div class="w-1/3">
                    <small  class="text-[#c52b42] font-bold">Description</small>
                  </div>
                  <div class="flex-1">
                    <InputText v-model="localForm.description" type="text" class="w-full" size="small" />
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
                  <small>: {{ localForm.spQtyVat }}</small>
                  </div>
                </div>
                
                <div class="flex gap-2">
                  <div class="w-1/3">
                    <small>Unit w/o VAT</small>
                  </div>
                  <div class="flex-1">
                  <small>: {{ localForm.spUnitWoVat }}</small>
                  </div>
                </div>

                <div class="flex gap-2">
                  <div class="w-1/3">
                    <small>Quantity w/o VAT</small>
                  </div>
                  <div class="flex-1">
                    <small>: {{ localForm.spQtyWoVat }}</small>
                  </div>
                </div>

                <div class="flex gap-2">
                  <div class="w-1/3">
                    <small class="text-[#c52b42] font-bold">Cost</small>
                  </div>
                </div>
        

              <div class="flex gap-2">
                  <div class="w-1/3">
                    <small>Quantity VAT</small>
                  </div>
                  <div class="flex-1">
                  <small>: {{ localForm.costQuantityVat }}</small>
                  </div>
                </div>

                <div class="flex gap-2">
                  <div class="w-1/3">
                    <small>Unit w/o VAT</small>
                  </div>
                  <div class="flex-1">
                  <small>: {{ localForm.costUnitWoVat }}</small>
                  </div>
                </div>

                <div class="flex gap-2">
                  <div class="w-1/3">
                    <small>Quantity w/o VAT</small>
                  </div>
                  <div class="flex-1">
                  <small>: {{ localForm.costQuantityWoVat }}</small>
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
                  <small>: {{ localForm.profitMarginWoVat }}</small>
                  </div>
                </div>


                <div class="flex gap-2">
                  <div class="w-1/3">
                    <small>Profit Margin VAT</small>
                  </div>
                  <div class="flex-1">
                  <small>: {{ localForm.profitMargin }}</small>
                  </div>
                </div>

                <div class="flex gap-2">
                  <div class="w-1/3">
                    <small>Target Selling Price VAT</small>
                  </div>
                  <div class="flex-1">
                  <small>: {{ localForm.targetSellingPriceVat }}</small>
                  </div>
                </div>

          </div>
        </div>




    </Dialog>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useCanvasCost } from '@/stores/canvasCost/CanvasCostStore';
export default {
  props: {
    form: {
      type: Object,
      required: true
    },
    selectedID: {
      type: [String, Number],
      required: true
    },
    propsProductListRaw: {
      type: Object,
      required: true
    },
    headerForm: {
      type: Object,
      required: true
    },
    actionType: {
      type: Boolean,
      required: true
    }
  },
  emits: [
    "update:visible",
  ],
  data() {
    return {
        visible: false,
        isValidProductCode: false,
        localForm: { ...this.form },
        localProductCodeListRaw: [...this.propsProductListRaw],
        localHeaderForm: { ...this.headerForm },
        localActionType: this.actionType,
        synching: false,
        alreadyComputed: false
    };
},
computed: {
    ...mapState(useCanvasCost, {
            synchingSAP: 'synchingSAP'
        }),
  },
mounted() {
    
},
methods: {
    ...mapActions(useCanvasCost, {
            postCanvasCostDetail: 'postCanvasCostDetail',
            fetchProductSynchingSAP: 'fetchProductSynchingSAP',
            updateCanvasCostDetail: 'updateCanvasCostDetail'
        }),
     async saveCanvassDetail() {

      if(this.isValidProductCode) {

        if (this.localActionType) {
         
          await this.postCanvasCostDetail({
            canvasCostHeaderId: this.selectedID,
            productCode: this.localForm.productCode,
            description: this.localForm.description,
            itemCategory: this.localForm.itemCategory,
            quantity: this.localForm.quantity,
            spUnitVat: this.localForm.spUnitVat,
            spQtyVat: this.localForm.spQtyVat,
            spUnitWoVat: this.localForm.spUnitWoVat,
            spQtyWoVat: this.localForm.spQtyWoVat,
            poRefDate: this.localForm.poRefDate ? this.localForm.poRefDate.toISOString() : null,
            recommendedSupplier: this.localForm.recommendedSupplier,
            costUnitVat: this.localForm.costUnitVat,
            costQuantityVat: this.localForm.costQuantityVat,
            costUnitWoVat: this.localForm.costUnitWoVat,
            costQuantityWoVat: this.localForm.costQuantityWoVat,
            profitMarginWoVat: this.localForm.profitMarginWoVat,
            profitMargin: this.localForm.profitMargin,
            targetSellingPriceVat: this.localForm.targetSellingPriceVat

          })

        } else {

          await this.updateCanvasCostDetail({
            id: this.localForm.id,
            canvasCostHeaderId: this.selectedID,
            productCode: this.localForm.productCode,
            description: this.localForm.description,
            itemCategory: this.localForm.itemCategory,
            quantity: this.localForm.quantity,
            spUnitVat: this.localForm.spUnitVat,
            spQtyVat: this.localForm.spQtyVat,
            spUnitWoVat: this.localForm.spUnitWoVat,
            spQtyWoVat: this.localForm.spQtyWoVat,
            poRefDate: this.localForm.poRefDate ? this.localForm.poRefDate.toISOString() : null,
            recommendedSupplier: this.localForm.recommendedSupplier,
            costUnitVat: this.localForm.costUnitVat,
            costQuantityVat: this.localForm.costQuantityVat,
            costUnitWoVat: this.localForm.costUnitWoVat,
            costQuantityWoVat: this.localForm.costQuantityWoVat,
            profitMarginWoVat: this.localForm.profitMarginWoVat,
            profitMargin: this.localForm.profitMargin,
            targetSellingPriceVat: this.localForm.targetSellingPriceVat
          }, this.localForm.id)

        }


        this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Canvass detail saved successfully.', life: 1500 });


        this.localForm.productCode = '';
        this.localForm.description = '';
        this.localForm.itemCategory = '';
        this.localForm.quantity = 0.00;
        this.localForm.spUnitVat = 0.00;
        this.localForm.spQtyVat = 0.00;
        this.localForm.spUnitWoVat = 0.00;
        this.localForm.spQtyWoVat = 0.00;
        this.localForm.poRefDate = '';
        this.localForm.recommendedSupplier = '';
        this.localForm.costUnitVat = 0.00;
        this.localForm.costQuantityVat = 0.00;
        this.localForm.costUnitWoVat = 0.00;
        this.localForm.costQuantityWoVat = 0.00;
        this.localForm.profitMarginWoVat = 0.00;
        this.localForm.profitMargin = 0.00;
        this.localForm.targetSellingPriceVat = 0.00;

        this.visibleComputation = false;
        this.isValidProductCode = false;


        this.$emit('saved', this.localForm);

        } else {
         
        if(this.localActionType) {

          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'The entered product code was not found in the database. If the product exists in SAP, please click "Sync SAP" to retrieve the latest records.', life: 3000 });

        } else {

          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Please validate the entered product code again when editing.', life: 3000 });
        
        }


        }

    },
    clearField() {
        this.localForm.productCode = '';
        this.localForm.description = '';
        this.localForm.itemCategory = '';
        this.localForm.quantity = 0.00;
        this.localForm.spUnitVat = 0.00;
        this.localForm.spQtyVat = 0.00;
        this.localForm.spUnitWoVat = 0.00;
        this.localForm.spQtyWoVat = 0.00;
        this.localForm.poRefDate = '';
        this.localForm.recommendedSupplier = '';
        this.localForm.costUnitVat = 0.00;
        this.localForm.costQuantityVat = 0.00;
        this.localForm.costUnitWoVat = 0.00;
        this.localForm.costQuantityWoVat = 0.00;
        this.localForm.profitMarginWoVat = 0.00;
        this.localForm.profitMargin = 0.00;
        this.localForm.targetSellingPriceVat = 0.00;

        this.isValidProductCode = false;
    },
    clickManualSync() {
      this.synching = true;

      setTimeout(async () => {

          await this.fetchProductSynchingSAP().then(() => {
            this.synching = false;
            this.$toast.add({ severity: 'success', summary: 'Success', detail: `Synching has been successfully done. Inserted Record: ${this.synchingSAP.inserted} `, life: 6000 });
          }).catch(() => {
            this.synching = false;
            this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch data from SAP. Please try again.', life: 1500 });
          });

           this.$emit('saved', this.localForm);

      }, 6000); // Simulate a delay for the sync process

     

    },
    checkProductCode() {

      const exists = this.localProductCodeListRaw.some(
        item => item.itemNumber === this.localForm.productCode
      );

      if (exists) {
        this.$toast.add({ severity: 'success', summary: 'Success', detail: 'The entered product code is valid.', life: 1500 });

        this.localForm.description = this.localProductCodeListRaw.find(item => item.itemNumber === this.localForm.productCode).itemDescription;

        this.localForm.itemCategory = this.localProductCodeListRaw.find(item => item.itemNumber === this.localForm.productCode).itemCategory;

        this.isValidProductCode = true;

      } else {

        if(this.localActionType) {

        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'The entered product code was not found in the database. If the product exists in SAP, please click "Sync SAP" to retrieve the latest records.', life: 3000 });

        } else {

          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Please validate the entered product code again when editing.', life: 3000 });
        
        }


        this.localForm.productCode = "";
        this.isValidProductCode = false;
      
      }
    },
    computeRaw() {

        
        if(this.alreadyComputed) {
            this.$toast.add({ severity: 'info', summary: 'Info', detail: 'The values have already been computed. Please modify the input values to compute again.', life: 3000 });
            return;
        }

        let _Quantity = parseFloat(this.localForm.quantity);

        let _SPQtyVat = parseFloat(this.localForm.spUnitVat) * parseFloat(_Quantity);
        this.localForm.spQtyVat = _SPQtyVat.toFixed(2);

        let _SPUnitWoVat = parseFloat(this.localForm.spUnitVat) / 1.12;
        this.localForm.spUnitWoVat = _SPUnitWoVat.toFixed(2);

        let _SPQtyWoVat = parseFloat(_SPUnitWoVat) * parseFloat(_Quantity);
        this.localForm.spQtyWoVat = _SPQtyWoVat.toFixed(2);

        let _costUnitVat = parseFloat(this.localForm.costUnitVat) * 1.12;
        this.localForm.costUnitVat = _costUnitVat.toFixed(2);

        let _costQuantityVat = parseFloat(_Quantity) * _costUnitVat;
        this.localForm.costQuantityVat = _costQuantityVat.toFixed(2);

        let _costUnitWoVat = parseFloat(_costUnitVat) / 1.12;
        this.localForm.costUnitWoVat = _costUnitWoVat.toFixed(2);

        let _CostQuantityWoVat = parseFloat(_costUnitWoVat) * parseFloat(_Quantity);
        this.localForm.costQuantityWoVat = _CostQuantityWoVat.toFixed(2);

        let _profitMarginWoVat = (_SPUnitWoVat * parseFloat(_Quantity)) - (_costUnitWoVat * parseFloat(_Quantity));
        this.localForm.profitMarginWoVat = _profitMarginWoVat.toFixed(2);

        let _profitMargin = _profitMarginWoVat != 0 ? (_profitMarginWoVat / _SPQtyWoVat) * 100 : 0;
        this.localForm.profitMargin = _profitMargin.toFixed(2);

        let _targetSellingPriceVat = _costQuantityVat / ( 1 - 0)
        this.localForm.targetSellingPriceVat = _targetSellingPriceVat.toFixed(2);

        this.alreadyComputed = true;

        

    },
    changeInput() {
        this.alreadyComputed = false;
    }
},  
watch: {
    form: {
        handler(val) {
        this.localForm = { ...val };
        },
        deep: true
    },
    propsProductListRaw: {
        handler(val) {
        this.localProductCodeListRaw = [...val];
        },
        deep: true
    },
    headerForm: {
        handler(val) {
        this.localHeaderForm = { ...val };
        },
        deep: true
      },
    actionType: {
        handler(val) {
        this.localActionType = val;
      },
        deep: true
    }
  }
}
</script>
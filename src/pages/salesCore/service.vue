Based on your screenshot (image_646c24.png), the layout is distinctively horizontal: the "Service" label and "Add Item" button sit to the left, the table scrolls in the middle, and the Grand Total sits on the far right.

Here is the aligned code that restructures your existing component to match this specific layout.

Aligned Horizontal Service Component
Code snippet
<template>
  <div class="service-section beige-card">
    
    <div class="left-controls">
      <h3 class="section-title">Service</h3>
      <button @click="addRow" class="btn-add-square">
        <span class="plus-icon">+</span>
        <span class="btn-text">Add Item</span>
      </button>
    </div>
    
    <div class="table-wrapper horizontal-scroll">
      <table class="detail-table">
        <thead>
          <tr>
            <th class="sticky-col">Item Description</th>
            <th>SKU/Code</th>
            <th>Category</th>
            <th class="text-center">Qty</th>
            <th>Unit</th>
            <th class="text-right">Unit Price</th>
            <th class="text-right">Discount (%)</th>
            <th class="text-right">Tax (%)</th>
            <th class="text-right">Shipping</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td class="sticky-col bg-white">
              <input v-model="item.description" type="text" class="table-input" placeholder="Description" />
            </td>
            <td><input v-model="item.sku" type="text" class="table-input" /></td>
            <td>
              <select v-model="item.category" class="table-input">
                <option>Hardware</option>
                <option>Software</option>
                <option>Service</option>
              </select>
            </td>
            <td><input v-model.number="item.qty" type="number" class="table-input text-center w-16" /></td>
            <td><input v-model="item.unit" type="text" class="table-input w-16" /></td>
            <td><input v-model.number="item.price" type="number" class="table-input text-right" /></td>
            <td><input v-model.number="item.discount" type="number" class="table-input text-right w-16" /></td>
            <td><input v-model.number="item.tax" type="number" class="table-input text-right w-16" /></td>
            <td><input v-model.number="item.shipping" type="number" class="table-input text-right" /></td>
            <td class="font-bold text-red text-right">
              {{ calculateRowTotal(item).toLocaleString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="right-total">
      <p class="total-label">Grand Total:</p>
      <p class="total-amount">₱ {{ grandTotal.toLocaleString() }}</p>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { 
          description: 'Dell Latitude 5420 Laptop', 
          sku: 'DL-5420-X', 
          category: 'Hardware',
          qty: 2, 
          unit: 'pcs',
          price: 55000,
          discount: 5,
          tax: 12,
          shipping: 500
        }
      ]
    };
  },
  computed: {
    grandTotal() {
      return this.items.reduce((acc, item) => acc + this.calculateRowTotal(item), 0);
    }
  },
  methods: {
    calculateRowTotal(item) {
      const subtotal = (item.qty || 0) * (item.price || 0);
      const discounted = subtotal * (1 - (item.discount || 0) / 100);
      const taxed = discounted * (1 + (item.tax || 0) / 100);
      return taxed + (item.shipping || 0);
    },
    addRow() {
      this.items.push({ description: '', sku: '', category: 'Hardware', qty: 1, unit: 'pcs', price: 0, discount: 0, tax: 12, shipping: 0 });
    }
  }
};
</script>

<style scoped>
/* Main Container: Flex Row Layout */
.service-section {
  display: flex;
  align-items: center; /* Vertically align all items */
  gap: 20px;
  background-color: #FAF7F0; /* Beige Background */
  padding: 15px 25px;
  border-radius: 12px;
  border: 1px solid #eee;
  min-height: 120px;
}

/* 1. Left Controls: Stacked Title & Square Button */
.left-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  min-width: 80px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #000;
  margin: 0;
}

.btn-add-square {
  width: 70px;
  height: 70px;
  background-color: white;
  border: 1px solid #C6011F;
  border-radius: 8px;
  color: #C6011F;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.btn-add-square:hover {
  background-color: #fff5f5;
  transform: translateY(-1px);
}

.plus-icon {
  font-size: 24px;
  font-weight: bold;
  line-height: 1;
}

.btn-text {
  font-size: 10px;
  font-weight: bold;
  margin-top: 4px;
  text-transform: uppercase;
}

/* 2. Middle: Scrollable Table Wrapper */
.table-wrapper {
  flex: 1; /* Takes remaining space */
  width: 0; /* Critical for flexbox scrolling */
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  border: 1px solid #eee;
  box-shadow: inset 0 0 6px rgba(0,0,0,0.02);
}

.detail-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  min-width: 900px;
}

.detail-table th {
  background-color: #f1ede4; /* Beige Header */
  padding: 12px 10px;
  text-align: left;
  white-space: nowrap;
  font-weight: 600;
  color: #333;
}

.detail-table td {
  padding: 8px 10px;
  border-bottom: 1px solid #f5f5f5;
  white-space: nowrap;
}

/* Optional: Sticky First Column */
.sticky-col {
  position: sticky;
  left: 0;
  z-index: 10;
  border-right: 1px solid #eee;
}
.sticky-col.bg-white { background-color: white; }

/* 3. Right: Grand Total */
.right-total {
  min-width: 120px;
  text-align: right;
  padding-left: 15px;
  border-left: 1px solid #e0e0e0;
}

.total-label {
  font-size: 12px;
  color: #666;
  margin: 0 0 5px 0;
}

.total-amount {
  font-size: 18px;
  font-weight: bold;
  color: #C6011F;
  margin: 0;
}

/* Input Styling */
.table-input {
  width: 100%;
  border: 1px solid transparent;
  background: transparent;
  padding: 4px;
  font-size: 12px;
  border-radius: 4px;
}

.table-input:hover, .table-input:focus {
  background: white;
  border-color: #ddd;
  outline: none;
}

.text-center { text-align: center; }
.text-right { text-align: right; }
.text-red { color: #C6011F; }
.w-16 { width: 50px; }

/* Custom Scrollbar */
.horizontal-scroll::-webkit-scrollbar { height: 8px; }
.horizontal-scroll::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
</style>
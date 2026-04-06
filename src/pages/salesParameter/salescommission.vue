<template>
   <div>
        <div class="flex flex-col gap-4">
            <div class="flex flex-row">
                <div>
                    Sales Commission Rates
                </div>
                <div class="ml-auto">
                    <Button label="Create" severity="primary" size="small"></Button>
                </div>
            </div>
            <div>
                <DataTable :value="products" size="small" tableStyle="min-width: 50rem">
                    <Column field="code" header="% Margin"></Column>
                    <Column field="name" header="% Rate Commission on Margin"></Column>
                    <Column field="category" header="Year"></Column>
                </DataTable>
            </div>
        </div>
   </div>
</template>
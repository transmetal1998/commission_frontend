<template>
   <div>
        <div class="flex flex-col gap-4">
            <div class="flex flex-row">
                <div>
                    Sales Quota
                </div>
                <div class="ml-auto">
                    <Button label="Create" severity="primary" size="small"></Button>
                </div>
            </div>
            <div>
                <DataTable :value="products" size="small" tableStyle="min-width: 50rem">
                    <Column field="code" header="Business Unit"></Column>
                    <Column field="name" header="Sales Quota"></Column>
                </DataTable>
            </div>
        </div>
   </div>
</template>
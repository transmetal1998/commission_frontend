<template>
   <div>
        <div class="flex flex-col gap-4">
            <div class="flex flex-row">
                <div>
                    Hurdle Rate
                </div>
                <div class="ml-auto">
                    <Button label="Create" severity="primary" size="small"></Button>
                </div>
            </div>
            <div>
                <DataTable :value="products" size="small" tableStyle="min-width: 50rem">
                    <Column field="code" header="Associate"></Column>
                    <Column field="name" header="Target"></Column>
                    <Column field="category" header="Amount"></Column>
                    <Column field="quantity" header="Hurdle Rate (%)"></Column>
                </DataTable>
            </div>
        </div>
   </div>
</template>
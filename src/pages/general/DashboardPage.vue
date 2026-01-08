<template>
    <div>
        <label for="" class="text-xl">Dashboard View</label>
        <div class="py-2">

            <div class="card flex justify-start">

                <Chart type="bar" :data="chart_data" :options="chartOptions" class="w-full md:w-[30rem]"/>
            </div>

        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useArticle } from '@/stores/knowledgebase/ArticleStore';
export default {
    components: [],
    data() {
        return {
            loading: false,
             chartData: null,
            chartOptions: null
        }
    },
    created() {
        

    },
    async beforeMount() {

        const user_object = sessionStorage.getItem('user');
        if (user_object) {
            this.profile = JSON.parse(user_object);
        }
      
    },
    mounted() {
            this.fetchChartData();
            this.chartOptions = this.setChartOptions();
    },
    computed: {
        ...mapState(useArticle, {
            chart_data: 'chart_data'
        }),
    },
    methods: {
        ...mapActions(useArticle, {
            fetchChartData: 'fetchChartData'
        }),
        setChartOptions() {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--p-text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
            const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

            return {
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
                    }
                }
            };
        }
    }
}
</script>
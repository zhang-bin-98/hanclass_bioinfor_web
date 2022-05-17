<script setup>
import { ref, onMounted, defineProps, watch } from "vue"
import { useQuasar } from 'quasar'
import { geneExp } from '@/api/apis.js'
//  按需引入 echarts
import * as echarts from "echarts"

const $q = useQuasar()
const main = ref() // 使用ref创建虚拟DOM引用，使用时用main.value

const props = defineProps({
    genes: Array
})

// const genes = ["ENSG00000000003","ENSG00000000005"]
const samples =[
    "C_1","C_2","C_3","C_4",
    "P_1","P_2","P_3","P_4","P_5",
    "P_6","P_7","P_8","P_9","P_10",
    "P_11","P_12","P_13","P_14","P_15"
    ]

watch(
    () => props.genes,
    (newTitle, oldTitle) => getGeneExp()
);

const getGeneExp = () => {
    geneExp({
            ids: props.genes.join(",")
        })
            .then((res) => {
                console.log(res)

                let min_v = 100
                let max_v = 0

                const data = res.data.map(o => {

                    const _data = parseFloat(Number(o.data).toFixed(2))

                    min_v = Math.min(min_v, _data)
                    max_v = Math.max(max_v, _data)
                    
                    return [o.col, o.gene_id, _data]
                });

                console.log(min_v)
                console.log(max_v)
                console.log(data)

                init(min_v, max_v, data)
            })
            .catch((err) => {
                console.log(err)
                $q.notify({
                    message: '获取失败,请重试！',
                    color: 'negative',
                    position: 'top',
                    icon: 'announcement'
                })
            })
}

function init(min_v, max_v, data) {
    const option = {
        title: {
            text: "基因表达热图（rlog）",
            fontWeight: 'normal',
            left: 'center'
        },
        toolbox: {
            show: true
        },
        tooltip: {
            position: 'top'
        },
        grid: {
            left: '150px'
        },
        xAxis: {
            type: 'category',
            data: samples,
            splitArea: {
                show: true
            }
        },
        yAxis: {
            type: 'category',
            data: props.genes,
            splitArea: {
                show: true
                
            }
        },
        visualMap: {
            type: 'continuous', 
            min: min_v,
            max: max_v,
            calculable: true,
            orient: 'vertical',
            left: 'right',
            bottom: 'center'
        },
        series: [
            {
                name: 'rlog',
                type: 'heatmap',
                data: data,
                label: {
                    show: true
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    var myChart = echarts.init(main.value);
    myChart.setOption(option);
    window.onresize = function () {
        //自适应大小
        myChart.resize();
    };
}
</script>

<template>
    <h3 class="text-center text-grey" v-if="props.genes.length == 0">请选择基因</h3>
    <div v-else ref="main" style="width: 100%; height: 100%"></div>
</template>


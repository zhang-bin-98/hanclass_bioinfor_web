<script setup>
import { ref, onMounted, defineProps, watch } from "vue"
import { useQuasar } from 'quasar'
import { geneExp } from '@/api/apis.js'
//  按需引入 echarts
import * as echarts from "echarts"

const $q = useQuasar()
const main = ref() // 使用ref创建虚拟DOM引用，使用时用main.value

const props = defineProps({
    genes: Array,
    padj: Number,
    log2FoldChange: Number
})

watch(
    () => props,
    (newTitle, oldTitle) => getData(),
    {
        deep: true
    }
);

const getData = () => {

    const up = {
        name: 'up',
        type: 'scatter',
        emphasis: {
            focus: 'series'
        },
        data: []
    }
    const down = {
        name: 'down',
        type: 'scatter',
        emphasis: {
            focus: 'series'
        },
        data: []
    }
    const unchange = {
        name: 'unchange',
        type: 'scatter',
        emphasis: {
            focus: 'series'
        },
        data: [],
        markLine: {
            silent: true,
            data: [
                {
                    yAxis: -parseFloat(Number(Math.log10(props.padj)).toFixed(2))
                }, {
                    xAxis: -parseFloat(Number(props.log2FoldChange).toFixed(2))
                }, {
                    xAxis: parseFloat(Number(props.log2FoldChange).toFixed(2))
                }
            ],
            lineStyle: {
                normal: {
                    type: 'dashed',
                },
            },
        }
    }

    let x_max = 0;
    let y_max = 0;

    props.genes.forEach(e => {
        const _data = [
            parseFloat(Number(e.log2FoldChange).toFixed(2)),
            -parseFloat(Number(Math.log10(e.padj)).toFixed(2)),
            e.gene_name
        ]

        x_max = Math.max(x_max, Math.abs(_data[0]))
        if (_data[1] != Infinity)
            y_max = Math.max(y_max, _data[1])

        if (e.padj < props.padj && e.log2FoldChange > props.log2FoldChange) {
            up.data.push(_data)
        } else if (e.padj < props.padj && e.log2FoldChange < -props.log2FoldChange) {
            down.data.push(_data)
        } else {
            unchange.data.push(_data)
        }
    })

    const series = [up, down, unchange]

    x_max = Math.ceil(x_max)
    y_max = Math.ceil(y_max / 5 + 1) * 5

    console.log({
        series,
        x_max,
        y_max
    })


    init(series, x_max, y_max)
}

function init(series, x_max, y_max) {
    const option = {
        title: {
            text: '差异基因火山图',
            fontWeight: 'normal',
            left: 'center'
        },
        grid: {
            left: '3%',
            right: '7%',
            bottom: '7%',
            containLabel: true
        },
        tooltip: {
            // trigger: 'axis',
            showDelay: 0,
            formatter: function (params) {
                if (params.value.length > 1) {
                    return `${params.value[2]}<br/>-log10(padj): ${params.value[0]}<br/>log2FC: ${params.value[1]}`
                }
            },
            axisPointer: {
                show: true,
                type: 'cross',
                lineStyle: {
                    type: 'dashed',
                    width: 1
                }
            }
        },
        toolbox: {
            feature: {
                dataZoom: {},
                saveAsImage: {}
            }
        },
        color: [
            'red', 'blue', 'gray'
        ],
        legend: {
            data: ['up', 'down', 'unchange'],
            left: 'center',
            bottom: 10
        },
        xAxis: [
            {
                type: 'value',
                name: 'log2FC',
                nameLocation: 'center',
                min: -x_max,
                max: x_max,
                splitLine: {
                    show: false
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '-log10(padj)',
                min: 0,
                max: y_max,
                splitLine: {
                    show: false
                },
                axisLine: {
                    onZero: false
                } 
            }
        ],
        series: series,
        graphic: {
            type: 'text',
            style: {
                text: `up: ${series[0].data.length}, \ndown: ${series[1].data.length}`,
                x: 100,
                y: 100
            }
        }
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
    <div ref="main" style="width: 100%; height: 100%"></div>
</template>


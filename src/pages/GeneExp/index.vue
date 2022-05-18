<template>
    <q-page class="q-pa-md row items-start justify-center q-gutter-md bg-grey-2">

        <q-card flat class="col-5 q-pa-md">
            <q-table dense title="差异基因数据" :rows="rows" :columns="columns" :filter="filter" row-key="gene_id"
                :loading="loading" selection="multiple" :rows-per-page-options="[20, 5, 10, 50]"
                v-model:selected="selected">
                <template v-slot:top-right>
                    <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                </template>

                <template v-slot:body-cell-log2FoldChange="props">
                    <q-td :props="props" :class="
                        props.row.padj < padj && props.row.log2FoldChange > log2FoldChange
                            ? 'text-red'
                            : props.row.padj < padj && props.row.log2FoldChange < -log2FoldChange
                                ? 'text-green'
                                : 'text-grey'
                    ">
                        {{ Number(props.row.log2FoldChange).toFixed(2) }}
                    </q-td>
                </template>
            </q-table>

            <q-separator />

            <q-card-actions>
                <q-input filled lazy-rules type="number" label="padj" color="secondary" v-model.number="padj" />
                <q-input filled lazy-rules type="number" label="log2FoldChange" color="secondary"
                    v-model.number="log2FoldChange" />
                <q-space />
                <q-btn flat color="secondary" label="清空选择" sizze="xl" @click="selected = []" />
            </q-card-actions>
            <!-- {{ selected.map(p => p.gene_id) }} -->
        </q-card>

        <q-card flat class="col-6" style="height: 85vh;">
            <volcano-plot v-show="selected.length == 0" :genes="rows" :padj="padj" :log2FoldChange="log2FoldChange" />
            <heatmap v-show="selected.length != 0" :samples="samples" :genes="selected.map(p => p.gene_id).reverse()" />
        </q-card>
    </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { geneList } from '@/api/apis.js'
import { columns } from '@/assets/geneTitle.js'

import volcanoPlot from './components/volcanoPlot.vue'
import heatmap from './components/heatmap.vue'


const $q = useQuasar()

const rows = ref([])
const filter = ref(null)
const loading = ref(false)
const selected = ref([])

const padj = ref(0.05)
const log2FoldChange = ref(0.5)

onMounted(() => {
    loading.value = true
    geneList()
        .then((res) => {
            loading.value = false
            console.log(res)
            rows.value = res.data
        })
        .catch((err) => {
            loading.value = false
            console.log(err)
            $q.notify({
                message: '获取失败,请重试！',
                color: 'negative',
                position: 'top',
                icon: 'announcement'
            })
        })
})



const samples = [
    "1_control", "6_control", "11_control",
    "3_Nsp8", "8_Nsp8", "13_Nsp8"
]



</script>
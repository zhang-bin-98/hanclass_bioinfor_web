<template>
    <q-page class="q-pa-md row items-start justify-center q-gutter-md bg-grey-2">

        <q-card flat class="col-5 q-pa-md">
            <q-table
                dense
                title="差异基因数据"
                :rows="rows"
                :columns="columns"
                :filter="filter"
                row-key="gene_id"
                :loading="loading"
                selection="multiple"
                :rows-per-page-options="[20,5,10,50]"
                v-model:selected="selected"
            >
                <template v-slot:top-right>
                    <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                    </q-input>
                </template>
            </q-table>
            <!-- {{ selected.map(p => p.gene_id) }} -->
        </q-card>

        <q-card flat class="col-6" style="height: 85vh;">
            <heatmap :genes="selected.map(p => p.gene_id).reverse()"/>
        </q-card>
    </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { geneList } from '@/api/apis.js'
import { columns } from '@/assets/geneTitle.js'
import heatmap from './components/heatmap.vue'

const $q = useQuasar()

const rows = ref([])
const filter = ref(null)
const loading = ref(false)
const selected = ref([])

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



</script>
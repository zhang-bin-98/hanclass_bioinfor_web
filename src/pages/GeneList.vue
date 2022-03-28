<template>
    <q-page class="q-pa-md row items-start justify-center q-gutter-md bg-grey-2">
        <!-- 搜索框 -->
        <q-card flat class="col-2">
            <q-tabs
                v-model="tab"
                dense
                class="text-grey"
                active-color="secondary"
                indicator-color="secondary"
                align="justify"
                narrow-indicator
            >
                <q-tab name="query" label="搜索" />
                <q-tab name="advance" label="高级" />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="tab" animated>
                <!-- 全局搜索 -->
                <q-tab-panel name="query">
                    <q-input
                        filled
                        lazy-rules
                        clearable
                        clear-icon="close"
                        label="请输入查询内容"
                        class="full-width"
                        color="secondary"
                        v-model="filter"
                    />
                </q-tab-panel>

                <!-- 高级搜索 -->
                <q-tab-panel name="advance">
                    <q-form @submit="onSubmit" @reset="onReset">
                        <div
                            class="q-pb-sm"
                            v-for="k of columns
                            .filter(i => visibleColumns.includes(i.name))"
                        >
                            <q-input
                                v-if="k.type == 'text'"
                                dense
                                lazy-rules
                                clearable
                                clear-icon="close"
                                :label="k.label"
                                :type="k.type"
                                class="full-width"
                                color="secondary"
                                v-model="advace[k.name]"
                            />
                            <q-input
                                v-else-if="k.type == 'date'"
                                dense
                                lazy-rules
                                mask="####-##-##"
                                clearable
                                clear-icon="close"
                                color="secondary"
                                class="full-width"
                                :hint="k.label"
                                :type="k.type"
                                v-model="advace[k.name]"
                            />
                            <q-select
                                v-else-if="k.type == 'selection'"
                                dense
                                lazy-rules
                                clearable
                                color="secondary"
                                clear-icon="close"
                                v-model="advace[k.name]"
                                :options="selectItems[k.name]"
                                :label="k.label"
                            />
                        </div>
                        <!-- 按钮 -->
                        <q-btn-group class="justify-center" spread flat>
                            <q-btn
                                outline
                                label="检索"
                                type="submit"
                                color="secondary"
                                class="text-center"
                            />
                            <q-btn
                                outline
                                label="重置"
                                type="reset"
                                color="secondary"
                                class="text-center"
                            />
                        </q-btn-group>
                    </q-form>
                </q-tab-panel>
            </q-tab-panels>
        </q-card>

        <!-- 数据表 -->
        <q-card flat class="q-pa-md col-9">
            <q-table
                title="序列数据"
                class="my-sticky-dynamic"
                :rows="rows"
                :columns="columns"
                :filter="filter"
                row-key="gene_id"
                :visible-columns="visibleColumns"
                :loading="loading"
                :grid="gridView"
                selection="multiple"
                v-model:selected="selected"
                v-model:pagination="pagination"
                @request="onRequest"
            >
                <template v-slot:top="props">
                    <div class="col-2 q-table__title">序列数据</div>

                    <q-space />

                    <q-select
                        multiple
                        filled
                        :use-chips="$q.screen.gt.md"
                        dense
                        options-dense
                        color="secondary"
                        style="min-width: 150px; max-width: 50vw;"
                        emit-value
                        map-options
                        v-model="visibleColumns"
                        display-value="选择列"
                        :options="columns"
                        option-value="name"
                    />

                    <q-btn
                        flat
                        round
                        dense
                        :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                        @click="props.toggleFullscreen"
                        class="q-ml-md"
                    />
                </template>

                <template v-slot:body-cell-sequence_quality="props">
                    <q-td :props="props">
                        <div
                            :class="
                                props.value == 'High'
                                    ? 'text-deep-orange-13'
                                    : 'text-green-10'
                            "
                        >{{ props.value }}</div>
                    </q-td>
                </template>

                <template v-slot:body-cell-quality_assessment="props">
                    <q-td :props="props">
                        <div style="width: 8.5em;" />
                        <q-rating
                            readonly
                            v-model="rating"
                            size="1.5em"
                            :color="
                                props.value
                                    .split('/')
                                    .map(i => {
                                        switch (i) {
                                            case '0': return 'green-10';
                                            case '-': return 'deep-orange-13';
                                            default: return 'grey-5'
                                        }
                                    })
                            "
                        />
                    </q-td>
                </template>

                <template v-slot:body-cell-action="props">
                    <q-td :props="props">
                        <q-btn-group flat stretch>
                            <q-btn
                                flat
                                round
                                icon="assignment"
                                color="positive"
                                size="ms"
                                @click="showDetail(props.row.accession_id)"
                            >
                                <q-tooltip>详情</q-tooltip>
                            </q-btn>
                            <q-btn
                                flat
                                round
                                dense
                                icon="delete"
                                color="deep-orange-10"
                                size="ms"
                                v-if="user.value
                                    && (user.value.user_role == 0
                                        || user.value.user_id == props.row.user_id)
                                "
                                @click="removeGene(props)"
                            >
                                <q-tooltip>删除</q-tooltip>
                            </q-btn>
                        </q-btn-group>
                    </q-td>
                </template>

                <template v-slot:item="props">
                    <div
                        class="q-pa-xs col-12 col-lg-6 grid-style-transition"
                        :style="props.selected ? 'transform: scale(0.95);' : ''"
                    >
                        <q-card :class="props.selected ? 'bg-grey-2' : ''">
                            <q-card-section>
                                <q-checkbox
                                    dense
                                    v-model="props.selected"
                                    :label="props.row.accession_id"
                                />
                            </q-card-section>
                            <q-separator />
                            <q-list dense>
                                <q-item v-for="col in props.cols" :key="col.name">
                                    <q-item-section>
                                        <q-item-label>{{ col.label }}</q-item-label>
                                    </q-item-section>
                                    <q-item-section side style="max-width: 60%;">
                                        <q-item-label
                                            caption
                                            v-if="col.name != 'action'"
                                        >{{ col.value }}</q-item-label>
                                        <q-btn-group v-else flat stretch>
                                            <q-btn
                                                flat
                                                dense
                                                round
                                                icon="keyboard_return"
                                                color="positive"
                                                @click="hideDetail"
                                                label="返回列表"
                                            />
                                            <q-btn
                                                flat
                                                round
                                                dense
                                                icon="delete"
                                                color="deep-orange-10"
                                                label="删除"
                                                v-if="user.value
                                                    && (user.value.user_role == 0
                                                        || user.value.user_id == props.row.user_id)
                                                "
                                                @click="removeGene(props)"
                                            />
                                        </q-btn-group>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card>
                    </div>
                </template>
            </q-table>
            <!-- <pre>{{ JSON.stringify(visibleColumns, null, 2) }}</pre> -->
            <!-- <pre>{{ JSON.stringify(selectItems, null, 2) }}</pre> -->
            <!-- <pre>{{ JSON.stringify(advace, null, 2) }}</pre> -->
            <!-- <pre>{{ JSON.stringify(filter, null, 2) }}</pre> -->
        </q-card>
    </q-page>
</template>

<script setup>
import { ref, inject, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { geneList, geneDelete, geneSummary } from '@/api/apis.js'
import gnenTitle from '@/assets/geneTitle.json'

const user = inject('user')
const $q = useQuasar()
const router = useRouter()
const route = useRoute()

// 搜索框
const tab = ref('query')
const filter = ref(null)

// 高级检索
let selectItems = ref(null)
const advace = reactive((function () {
    let obj = new Object();
    gnenTitle
        .filter(i => i.type)
        .forEach(e => obj[e.name] = null);
    return obj
})())

// 重置检索
const onReset = () => {
    for (let i in advace) {
        advace[i] = null
    }
}

// 提交检索 
const onSubmit = () => {
    let obj = new Object()
    for (let i in advace) {
        if (advace[i])
            obj[i] = advace[i]
    }

    onRequest({
        pagination: pagination.value,
        filter: filter.value,
        advace: obj
    })
}


// 数据表
const columns = gnenTitle
const rows = ref([])
const selected = ref([])
const gridView = ref(false)
const loading = ref(false)
const visibleColumns = ref(
    columns
        .map(i => i.name)
        .filter(i => !(
            i == 'originating_lab' || i == 'submitting_lab'
        ))
)
const pagination = ref({
    sortBy: null,
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: null
})
const rating = 5

// 请求数据
function onRequest(props) {
    const { page, rowsPerPage, sortBy, descending } = props.pagination
    const filter = props.filter
    const advace = props.advace

    loading.value = true
    geneList({
        filter, advace, page, rowsPerPage, sortBy, descending
    })
        .then((res) => {
            // 
            console.log(res)
            rows.value.splice(0, rows.value.length, ...res.data.returnedData)
            //
            pagination.value.rowsNumber = res.data.rowsNumber
            pagination.value.page = page
            pagination.value.rowsPerPage = rowsPerPage
            pagination.value.sortBy = sortBy
            pagination.value.descending = descending
            // 
            loading.value = false
        }).catch((err) => {
            loading.value = false
            console.log(err)
            $q.notify({
                message: `数据获取失败！${err.msg}`,
                color: 'negative',
                position: 'top',
                icon: 'announcement'
            })
        })
}

// 基因详情
const showDetail = (id) => {
    gridView.value = true
    filter.value = id
}

// 返回列表
const hideDetail = () => {
    gridView.value = false
    filter.value = null
}

// 删除基因
const removeGene = (p) => {
    $q.dialog({
        title: '注意',
        message: `请确认删除: ${p.row.accession_id}`,
        cancel: true
    }).onOk(() => {
        loading.value = true
        console.log(p.key)
        geneDelete(p.key)
            .then((res) => {
                loading.value = false
                console.log(res)
                onRequest({
                    pagination: pagination.value,
                    filter: filter.value
                })
                $q.notify({
                    message: '删除成功',
                    color: 'primary',
                    position: 'top',
                    icon: 'announcement'
                })
            }).catch((err) => {
                loading.value = false
                console.log(err)
                $q.notify({
                    message: '删除失败,请重试！',
                    color: 'negative',
                    position: 'top',
                    icon: 'announcement'
                })
            })
    })
}

onMounted(() => {
    console.log(route.query)
    filter.value = route.query.q
    onRequest({
        pagination: pagination.value,
        filter: route.query.q
    })
    geneSummary()
        .then((res) => {
            console.log(res)
            selectItems.value = res.data
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
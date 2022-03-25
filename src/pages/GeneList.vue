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
                    <q-form @submit="onSearch" @reset="query = null" class="q-pt-md">
                        <q-input
                            filled
                            lazy-rules
                            label="请输入查询内容"
                            class="full-width"
                            color="secondary"
                            v-model="query"
                            :rules="[val => val && val.length > 0 || '请输入内容']"
                        />
                        <q-btn-group spread flat class="q-mt-md">
                            <q-btn outline type="submit" color="secondary" label="搜索" />
                            <q-btn outline type="reset" color="secondary" label="重置" />
                        </q-btn-group>
                    </q-form>
                </q-tab-panel>

                <!-- 高级搜索 -->
                <q-tab-panel name="advance">
                    <div class="text-h6">开发中</div>
                </q-tab-panel>
            </q-tab-panels>

            <q-separator />

            <q-card-section>
                <div class="text-body1 text-center">上传基因</div>
            </q-card-section>

            <q-btn-group spread flat class="q-mx-md q-mb-md">
                <q-btn outline color="secondary" label="上传" />
                <q-btn outline color="secondary" label="批量上传" />
            </q-btn-group>

            <!-- 其他 -->
            <q-card flat class="q-pa-md col-2">
                <pre>{{ JSON.stringify({ lastPage, nextPage, pagination }, null, 2) }}</pre>
            </q-card>
        </q-card>

        <!-- 数据表 -->
        <q-card flat class="q-pa-md col-9">
            <q-table
                title="基因数据"
                class="my-sticky-dynamic"
                :rows="rows"
                :columns="columns"
                row-key="gene_id"
                :visible-columns="visibleColumns"
                :loading="loading"
                virtual-scroll
                :virtual-scroll-item-size="48"
                :virtual-scroll-sticky-size-start="48"
                v-model:pagination="pagination"
                :rows-per-page-options="[0]"
                @virtual-scroll="onScroll"
            >
                <template v-slot:top="props">
                    <div class="col-2 q-table__title">基因数据</div>

                    <q-space />

                    <div v-if="$q.screen.gt.xs" class="col">
                        <q-toggle
                            size="xs"
                            color="secondary"
                            v-model="visibleColumns"
                            v-for="i in columns.filter(i => i.name != 'action')"
                            :val="i.name"
                            :label="i.label"
                        />
                    </div>
                    <q-select
                        v-else
                        multiple
                        borderless
                        dense
                        options-dense
                        color="secondary"
                        style="min-width: 150px"
                        emit-value
                        map-options
                        v-model="visibleColumns"
                        :display-value="$q.lang.table.columns"
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
                            <q-btn flat round icon="assignment" color="positive" size="ms">
                                <q-tooltip>详情</q-tooltip>
                            </q-btn>
                            <q-btn
                                flat
                                round
                                icon="delete"
                                color="deep-orange-10"
                                size="ms"
                                v-if="user.value
                                    && (user.value.user_role == 0
                                        || user.value.user_id == props.row.user_id)
                                "
                            >
                                <q-tooltip>删除</q-tooltip>
                            </q-btn>
                        </q-btn-group>
                    </q-td>
                </template>
            </q-table>
        </q-card>
    </q-page>
</template>

<script setup>
import { ref, inject, computed, nextTick } from 'vue'
import testImportJson from '/public/test.json'

const user = inject('user')

// 搜索框
const tab = ref('query')
const query = ref(null)
const onSearch = () => {
    console.log(query.value)
}


// 数据表
const columns = [
    { name: 'gene_id', label: 'ID', field: 'gene_id', align: 'left' },
    { name: 'virus_strain_same', label: '病毒株名', field: 'virus_strain_same', align: 'left' },
    { name: 'accession_id', label: '序列号', field: 'accession_id', align: 'left' },
    { name: 'data_source', label: '数据来源', field: 'data_source', align: 'left' },
    { name: 'related_id', label: '相关ID', field: 'related_id', align: 'left' },
    { name: 'lineage', label: '谱系', field: 'lineage', align: 'left' },
    { name: 'nuc_completeness', label: '序列完整度', field: 'nuc_completeness', align: 'left' },
    { name: 'sequence_length', label: '序列长度', field: 'sequence_length', align: 'left' },
    { name: 'sequence_quality', label: '序列质量', field: 'sequence_quality', align: 'left' },
    { name: 'quality_assessment', label: '质量评估', field: 'quality_assessment', align: 'left' },
    { name: 'host', label: '宿主', field: 'host', align: 'left' },
    { name: 'sample_collection_date', label: '采样日期', field: 'sample_collection_date', align: 'left' },
    { name: 'location', label: '采样地点', field: 'location', align: 'left' },
    { name: 'originating_lab', label: '样本提供单位', field: 'originating_lab', align: 'left' },
    { name: 'submission_date', label: '提交时间', field: 'submission_date', align: 'left' },
    { name: 'submitting_lab', label: '数据递交单位', field: 'submitting_lab', align: 'left' },
    { name: 'create_time', label: '发布时间', field: 'create_time', align: 'left' },
    { name: 'last_update_time', label: '更新时间', field: 'last_update_time', align: 'left' },
    { name: 'action', label: '操作', field: 'gene_id', align: 'center' }
]
const visibleColumns = ref(
    columns
        .map(i => i.name)
        .filter(i => !(
            i == 'originating_lab'
            || i == 'submitting_lab'
        ))
)

const pagination = ref({ rowsPerPage: 50 })
const rating = 5

let allRows = testImportJson
const pageSize = 10
const lastPage = Math.ceil(allRows.length / pageSize)

// const rows = testImportJson
const nextPage = ref(2)
const loading = ref(false)
const rows = computed(() => allRows.slice(0, pageSize * (nextPage.value - 1)))

const onScroll = ({ to, ref }) => {
    const lastIndex = rows.value.length - 1

    if (loading.value !== true && nextPage.value <= lastPage && to === lastIndex) {
        loading.value = true
        console.log(nextPage.value)

        setTimeout(() => {
            nextPage.value++
            nextTick(() => {
                ref.refresh()
                loading.value = false
            })
        }, 500)
    }
}



// 关联api
// 基因详情

</script>

<style lang="sass">

.my-sticky-dynamic
    /* height or max-height is important */
    height: 80vh

    /* bg color is important for th; just specify one */
    .q-table__top,
    .q-table__bottom,
    thead tr:first-child th
        background-color: #fff

    thead tr th
        position: sticky
        z-index: 1
    /* this will be the loading indicator */
    thead tr:last-child th
        /* height of all previous header rows */
        top: 48px
    thead tr:first-child th
        top: 0
</style>
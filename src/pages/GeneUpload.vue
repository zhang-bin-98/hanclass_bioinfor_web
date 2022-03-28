<template>
    <q-page class="q-pa-md row items-start justify-center q-gutter-md bg-grey-2">
        <q-card flat class="col-3">
            <q-card-section>
                <div class="text-h6 text-center">数据上传</div>
            </q-card-section>

            <q-separator />

            <!-- 单条上传 -->
            <q-card-actions class="q-pa-md">
                <q-item-section>
                    <div class="text-subtitle1">手动上传</div>
                </q-item-section>
                <q-item-section side>
                    <q-btn
                        outline
                        color="secondary"
                        icon="add_box"
                        label="添加一条"
                        :loading="isUploading"
                        @click="addItem"
                    />
                </q-item-section>
            </q-card-actions>

            <q-separator />

            <!-- 文件上传 -->
            <q-card-section>
                <div class="text-subtitle1 q-pb-sm">文件上传(选择文件后请刷新)</div>
                <q-file
                    filled
                    bottom-slots
                    counter
                    clearable
                    label="点击选择文件"
                    color="secondary"
                    accept=".csv, .tsv"
                    v-model="fmodel"
                >
                    <template v-slot:hint>文件大小</template>

                    <template v-slot:after>
                        <q-btn
                            color="secondary"
                            dense
                            icon="refresh"
                            round
                            @click="uploadFile"
                            :loading="isUploading"
                        />
                    </template>
                </q-file>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <div class="text-weight-light">待上传（行/条）：{{ upload?.length ?? "未加载" }}</div>
                <div class="text-weight-light">已上传（行/条）：{{ uploadedGeneNmber?.length ?? 0 }}</div>
                <q-btn
                    outline
                    class="full-width q-mt-md"
                    color="secondary"
                    icon="cloud_upload"
                    label="上传已选数据"
                    :disable="selected.length == 0"
                    :loading="isUploading"
                    @click="uploadGene"
                >
                    <q-tooltip>单次最多100条</q-tooltip>
                </q-btn>
            </q-card-section>
            <!-- <pre>{{ JSON.stringify(selected, null, 2) }}</pre> -->
            <!-- <pre class="overflow-hidden">{{ JSON.stringify(upload, null, 2) }}</pre> -->
        </q-card>
        <q-card flat class="col-8 q-pa-md">
            <!-- 待上传表格 -->
            <q-table
                dense
                title="数据信息(点击数据可编辑)"
                row-key="accession_id"
                selection="multiple"
                :rows="upload"
                :loading="loading"
                :grid="gridView"
                :columns="columns"
                :filter="filter"
                :pagination="initialPagination"
                v-model:selected="selected"
            >
                <template v-slot:top-right>
                    <q-input borderless dense debounce="300" v-model="filter" placeholder="搜索">
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                    <q-toggle v-show="user.value.user_role" v-model="gridView">
                        <q-tooltip>卡片/表格模式</q-tooltip>
                    </q-toggle>
                </template>

                <template v-slot:body="props">
                    <q-tr :props="props">
                        <q-td>
                            <q-checkbox v-model="props.selected" dense />
                        </q-td>
                        <q-td v-for="i in Object.keys(props.row)" :key="i" :props="props">
                            {{ props.row[i] }}
                            <q-popup-edit v-model="props.row[i]" v-slot="scope" buttons>
                                <q-input v-model="scope.value" dense autofocus counter />
                            </q-popup-edit>
                        </q-td>
                        <q-td :props="props" key="action">
                            <q-btn
                                flat
                                dense
                                size="sm"
                                icon="delete"
                                color="negative"
                                @click="removeData(props.key)"
                            >
                                <q-tooltip>删除</q-tooltip>
                            </q-btn>
                        </q-td>
                    </q-tr>
                    <q-tr v-show="props.row.err" :props="props">
                        <q-td colspan="100%">
                            <div class="q-ml-lg text-left">
                                <q-icon name="warning" class="text-red" style="md" />
                                {{ props.row.err }}.
                            </div>
                        </q-td>
                    </q-tr>
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
                                    :label="props.row.action ? '添加序列数据' : props.row.accession_id"
                                />
                            </q-card-section>
                            <q-separator />
                            <q-list dense>
                                <q-item v-for="col in props.cols" :key="col.name">
                                    <q-item-section>
                                        <q-item-label>{{ col.label }}</q-item-label>
                                    </q-item-section>
                                    <q-item-section side style="max-width: 60%;">
                                        <q-item-label caption v-if="col.name != 'action'">
                                            {{ col.value }}
                                            <q-popup-edit
                                                v-model="props.row[col.name]"
                                                v-slot="scope"
                                                buttons
                                            >
                                                <q-input
                                                    v-model="scope.value"
                                                    dense
                                                    autofocus
                                                    counter
                                                />
                                            </q-popup-edit>
                                        </q-item-label>
                                        <q-btn-group v-else flat stretch>
                                            <!-- 手动输入 -->
                                            <q-btn
                                                v-show="props.row.action"
                                                flat
                                                icon="keyboard_return"
                                                color="positive"
                                                @click="addGoback(props.key)"
                                            >
                                                <q-tooltip>返回</q-tooltip>
                                            </q-btn>
                                            <q-btn
                                                v-show="props.row.action"
                                                flat
                                                icon="save"
                                                color="positive"
                                                @click="addSave(props)"
                                            >
                                                <q-tooltip>保存</q-tooltip>
                                            </q-btn>
                                            <!-- 文件加载 -->
                                            <q-btn
                                                v-show="!props.row.action"
                                                flat
                                                icon="delete"
                                                color="negative"
                                                @click="removeData(props.key)"
                                            >
                                                <q-tooltip>删除</q-tooltip>
                                            </q-btn>
                                        </q-btn-group>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card>
                    </div>
                </template>
            </q-table>
        </q-card>
    </q-page>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useQuasar } from 'quasar'
import { txtToJson } from '@/util/txtToJson.js'
import { geneCreate } from '@/api/apis.js'
import gnenTitle from '@/assets/geneTitle.json'

const $q = useQuasar()
const user = inject('user')

// 待上传表格
const filter = ref(null)
const loading = ref(false)
const columns = gnenTitle
const upload = ref([])
const selected = ref([])
const gridView = ref(false)
const initialPagination = ref({
    sortBy: 'user_id',
    descending: false,
    page: 1,
    rowsPerPage: 20
})

// 单条添加
const addItem = () => {
    gridView.value = true
    let obj = new Object()
    columns
        .forEach(i => {
            obj[i.name] = (i.pattern ?? "text") + "(点击编辑)"
        })
    upload.value.push(obj)
    filter.value = 'action'
}
// 取消添加
const addGoback = (id) => {
    loading.value = true
    console.log(id)
    upload.value = upload.value.filter(
        ele => ele.accession_id != id
    )
    loading.value = false
    gridView.value = false
    filter.value = null
}
// 保存添加
const addSave = (p) => {
    delete p.row.action
    gridView.value = false
    filter.value = null
}

// 文件相关
const fmodel = ref(null)
const isUploading = ref(false)
const uploadedGeneNmber = ref(0)

// 加载文件
const uploadFile = (e) => {
    isUploading.value = true
    console.log(fmodel.value)
    txtToJson(fmodel.value)
        .then((res) => {
            isUploading.value = false
            console.log(res)
            // 加载表格
            loading.value = true
            upload.value = res.data
            uploadedGeneNmber.value = 0
            loading.value = false
        }).catch((err) => {
            isUploading.value = false
            console.log(err)
            $q.notify({
                message: `加载失败！${err.msg}`,
                color: 'negative',
                position: 'top'
            })
        })

}

// 更新表格
const updataTable = (failUpload) => {
    // 删除已上传
    const uploadSet = new Set(
        selected.value.map(
            e => Reflect.get(e, 'accession_id')
        ))
    selected.value = []
    upload.value = upload.value.filter(
        ele => !uploadSet.has(ele.accession_id)
    )
    // 补充失败的数据 含有err字段
    if (failUpload.length > 0) {
        // console.log(failUpload)
        upload.value.push(...failUpload)
    }
    uploadedGeneNmber.value += uploadSet.length - failUpload.length

}

// 上传数据
const uploadGene = () => {
    // 限制数量
    if (selected.value.length > 100) {
        selected.value = selected.value.slice(0, 100)
        $q.notify({
            message: `单词上传上限为100条。`,
            color: 'primary',
            position: 'top',
            icon: 'announcement'
        })
    }
    // 上传
    console.log(selected.value)
    isUploading.value = true
    geneCreate({ data: selected.value })
        .then((res) => {
            isUploading.value = false
            updataTable(res.data)
            // console.log(upload.value)
            console.log(res)
            $q.notify({
                message: `上传成功,${res.msg}`,
                color: 'primary',
                position: 'top',
                icon: 'announcement'
            })
        }).catch((err) => {
            isUploading.value = false
            updataTable(err.data)
            console.log(err)
            $q.notify({
                message: `上传失败！${err?.msg}`,
                color: 'negative',
                position: 'top',
                icon: 'announcement'
            })
        })
}

// 删除数据
const removeData = (id) => {
    $q.dialog({
        title: '注意',
        message: `请确删除: ${id}\n此操作不会修改源文件。`,
        cancel: true
    }).onOk(() => {
        loading.value = true
        console.log(id)
        upload.value = upload.value.filter(
            ele => ele.accession_id != id
        )
        loading.value = false
    })
}

</script>
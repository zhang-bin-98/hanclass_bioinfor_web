<template>
    <q-page class="q-pa-md bg-grey-1 row items-center justify-center">
        <q-card
            class="q-pa-md"
            :class="!user.value.user_role && $q.screen.gt.md ? 'col-4' : 'col-11'"
        >
            <q-table
                title="用户信息"
                row-key="user_id"
                selection="multiple"
                :grid="user.value.user_role ? gridView : true"
                :rows="rows"
                :loading="loading"
                :filter="filter"
                :columns="columns"
                :pagination="initialPagination"
                v-model:selected="selected"
            >
                <template v-slot:top-right>
                    <q-input
                        borderless
                        dense
                        debounce="300"
                        v-model="filter"
                        v-show="user.value.user_role"
                        placeholder="检索"
                    >
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                    <q-btn flat icon="refresh" @click="getUser">
                        <q-tooltip>刷新</q-tooltip>
                    </q-btn>
                    <q-toggle v-show="user.value.user_role" v-model="gridView">
                        <q-tooltip>卡片/表格模式</q-tooltip>
                    </q-toggle>
                </template>

                <template v-slot:body-cell-action="props">
                    <q-td :props="props">
                        <q-btn
                            :disable="props.row.user_role == 1"
                            flat
                            icon="delete"
                            color="negative"
                            @click="removeUser(props.value)"
                        >
                            <q-tooltip>删除</q-tooltip>
                        </q-btn>
                    </q-td>
                </template>

                <template v-slot:item="props">
                    <div
                        class="q-pa-xs col-xs-12 grid-style-transition"
                        :class="user.value.user_role ? 'col-md-4 col-lg-2' : ''"
                        :style="props.selected ? 'transform: scale(0.95);' : ''"
                    >
                        <q-card :class="props.selected ? 'bg-grey-2' : ''">
                            <q-card-section>
                                <q-checkbox
                                    dense
                                    v-model="props.selected"
                                    :label="props.row.username"
                                />
                            </q-card-section>
                            <q-separator />
                            <q-list dense>
                                <q-item
                                    v-for="col in props.cols.filter(col => col.name !== 'username')"
                                    :key="col.name"
                                >
                                    <q-item-section>
                                        <q-item-label>{{ col.label }}</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label
                                            caption
                                            v-if="col.name != 'action'"
                                        >{{ col.value }}</q-item-label>
                                        <q-btn
                                            v-else
                                            :disable="props.row.user_role == 1"
                                            flat
                                            icon="delete"
                                            color="negative"
                                            @click="removeUser(props.value)"
                                        >
                                            <q-tooltip>注销</q-tooltip>
                                        </q-btn>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card>
                    </div>
                </template>
            </q-table>

            <q-card-actions>
                <q-btn outline label="退出登录" color="negative" class="full-width" @click="alert" />
            </q-card-actions>
        </q-card>
        <!-- <per>{{ JSON.stringify(rows, null, 2) }}</per> -->
    </q-page>
</template>

<script setup>
import { ref, inject, onMounted, onBeforeMount } from 'vue'
import { userDelete, resetToken, userList } from '@/api/apis.js'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()
const user = inject('user')

const filter = ref(null)
const loading = ref(false)
const gridView = ref(true)
const selected = ref([])
const initialPagination = ref({
    sortBy: 'user_id',
    descending: false,
    page: 1,
    rowsPerPage: 10
})

const columns = [
    { name: 'user_id', label: 'ID', field: 'user_id', align: 'left', sortable: true },
    { name: 'username', label: '用户名', field: 'username', align: 'left', sortable: true },
    { name: 'email', label: '电子邮箱', field: 'email', align: 'left', sortable: true },
    { name: 'create_at', label: '注册时间', field: 'create_at', align: 'left', sortable: true }, // 需要格式化
    { name: 'user_role', label: '用户权限', field: 'user_role', align: 'left', sortable: true, format: val => val === 1 ? '管理员' : '普通用户' },
    { name: 'action', label: '操作', field: 'user_id', align: 'center' }
]
const rows = ref([])

const getUser = () => {
    console.log(user.value)
    loading.value = true
    userList(
        user.value.user_role == 1
            ? null
            : user.value.user_id)
        .then((res) => {
            loading.value = false
            console.log(res)
            rows.value = res.data
        }).catch((err) => {
            loading.value = false
            console.log(err)
            $q.notify({
                message: `获取数据失败！${err.msg}`,
                color: 'negative',
                position: 'top'
            })
        })
}

const removeUser = (id) => {
    $q.dialog({
        title: '注意',
        message: `请确删除用户: ${id}`,
        cancel: true
    }).onOk(() => {
        $q.loading.show()
        console.log(id)
        userDelete(id)
            .then((res) => {
                $q.loading.hide()
                console.log(res)
                $q.notify({
                    message: '删除成功',
                    color: 'primary',
                    position: 'top',
                    icon: 'announcement'
                })
                if (id == user.value.user_id) {
                    resetToken(null)
                    user.value = null
                    router.replace({ name: 'Home' })
                } else {
                    getUser()
                }
            }).catch((err) => {
                $q.loading.hide()
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

const alert = () => {
    $q.dialog({
        title: '注意',
        message: '请确认退出登录!',
        cancel: true
    }).onOk(() => {
        resetToken(null)
        user.value = null
        router.replace({ name: 'Home' })
    })
}

// 页面切换前请求数据
onMounted(() => {
    if (!user.value) {
        router.replace({ name: 'Home' })
    }
    getUser()
})

</script>

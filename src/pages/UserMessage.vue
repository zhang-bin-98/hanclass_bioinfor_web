<template>
    <q-page class="bg-grey-1">
        <q-card class="q-pa-md absolute-center">
            <q-table
                title="用户信息"
                row-key="user_id"
                :rows="rows"
                :loading="loading"
                :columns="columns"
                :pagination="initialPagination"
            >
                <template v-slot:top-right>
                    <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                    <q-btn flat icon="refresh" @click="getUser" />
                </template>

                <template v-slot:body-cell-action="props">
                    <q-td :props="props">
                        <q-btn
                            :disable="props.row.user_role == 1"
                            flat
                            icon="delete"
                            color="negative"
                            @click="removeUser(props.value) && getUser()"
                        >
                            <q-tooltip>删除</q-tooltip>
                        </q-btn>
                    </q-td>
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
import { ref, inject, onMounted } from 'vue'
import { userDelete, resetToken, userList } from '@/api/apis.js'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()
const user = inject('user')

const filter = ref(null)
const loading = ref(false)
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
                router.push({ name: 'Home' })
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
}

const alert = () => {
    $q.dialog({
        title: '注意',
        message: '请确认退出登录!',
        cancel: true
    }).onOk(() => {
        resetToken(null)
        user.value = null
        router.push({ name: 'Home' })
    })
}

// 页面切换前请求数据
onMounted(getUser)
</script>

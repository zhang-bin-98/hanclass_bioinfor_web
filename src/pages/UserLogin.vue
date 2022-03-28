<template>
    <q-page class="bg-grey-1">
        <q-card class="q-pa-md absolute-center" style="width: 40em">
            <q-splitter v-model="splitterModel">
                <template v-slot:before>
                    <q-tabs v-model="tab" vertical class="text-teal">
                        <q-tab name="login" icon="person" label="登录" />
                        <q-tab name="signup" icon="person_add" label="注册" />
                    </q-tabs>
                </template>

                <template v-slot:after>
                    <q-tab-panels
                        v-model="tab"
                        animated
                        swipeable
                        vertical
                    >
                        <q-tab-panel name="login">
                            <q-card-actions vertical >
                                <q-form @submit="onLogin" @reset="onReset" class="q-pt-md">
                                    <q-input
                                        outline
                                        v-model="username"
                                        label="用户名"
                                        color="secondary"
                                        :rules="[val => val && val.length > 0 || '请输入用户名']"
                                    />

                                    <q-input
                                        outline
                                        lazy-rules
                                        type="password"
                                        v-model="password"
                                        label="密码"
                                        color="secondary"
                                        :rules="[val => val && val.length > 0 || '请输入密码']"
                                    />

                                    <q-btn-group class="justify-center" spread flat>
                                        <q-btn
                                            label="提交"
                                            type="submit"
                                            flat
                                            color="secondary"
                                            class="text-center"
                                        />
                                        <q-btn
                                            label="重置"
                                            type="reset"
                                            flat
                                            color="secondary"
                                            class="text-center"
                                        />
                                    </q-btn-group>
                                </q-form>
                            </q-card-actions>
                        </q-tab-panel>

                        <q-tab-panel name="signup">
                            <q-card-actions vertical class="q-px-lg">
                                <q-form @submit="onSignup" @reset="onReset" class="q-pt-md">
                                    <q-input
                                        outline
                                        lazy-rules
                                        v-model="username"
                                        label="用户名"
                                        color="secondary"
                                        :rules="[val => val && val.length > 0 || '请输入用户名']"
                                    />

                                    <q-input
                                        outline
                                        lazy-rules
                                        v-model="email"
                                        label="邮箱"
                                        type="email"
                                        color="secondary"
                                        :rules="[val => val && val.length > 0 || '请输入邮箱']"
                                    />

                                    <q-input
                                        outline
                                        lazy-rules
                                        type="password"
                                        v-model="password"
                                        label="密码"
                                        color="secondary"
                                        :rules="[val => val && val.length > 0 || '请输入密码']"
                                    />

                                    <q-input
                                        outline
                                        lazy-rules
                                        type="password"
                                        v-model="repassword"
                                        label="再次输入密码"
                                        color="secondary"
                                        :rules="[val => val && password == val || '密码不一致']"
                                    />

                                    <q-btn-group class="justify-center" spread flat>
                                        <q-btn
                                            label="提交"
                                            type="submit"
                                            flat
                                            color="secondary"
                                            class="text-center"
                                        />
                                        <q-btn
                                            label="重置"
                                            type="reset"
                                            flat
                                            color="secondary"
                                            class="text-center"
                                        />
                                    </q-btn-group>
                                </q-form>

                            </q-card-actions>
                        </q-tab-panel>
                    </q-tab-panels>
                </template>
            </q-splitter>
            <!-- <pre>{{ JSON.stringify({ username, email, password, repassword }, null, 2) }}</pre>
            <pre>{{ JSON.stringify(user.value, null, 2) }}</pre> -->
        </q-card>
    </q-page>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { userLogin, userCreate } from '@/api/apis.js'
import { useQuasar } from 'quasar'

const splitterModel = ref('20')
const tab = ref('login')

const $q = useQuasar()
const user = inject('user')
const router = useRouter()

const username = ref(null)
const password = ref(null)
const repassword = ref(null)
const email = ref(null)

const onLogin = () => {
    $q.loading.show()
    userLogin({ 
        username: username.value,
        password: password.value 
    })
        .then((res) => {
            $q.loading.hide()
            console.log(res)
            user.value = res.data
            $q.notify({
                message: '登陆成功',
                color: 'primary',
                position: 'top',
                icon: 'announcement'
            })
            router.back()
        }).catch((err) => {
            $q.loading.hide()
            console.log(err)
            $q.notify({
                message: `登陆失败！${err.msg}`,
                color: 'negative',
                position: 'top',
                icon: 'announcement'
            })
        })
}

const onSignup = () => {
    $q.loading.show()
    userCreate({
        username: username.value,
        password: password.value,
        email: email.value,
    })
        .then((res) => {
            $q.loading.hide()
            console.log(res)
            user.value = res.data
            $q.notify({
                message: '注册成功!',
                color: 'positive',
                position: 'top'
            })
            router.push({ name: 'Home' })
        }).catch((err) => {
            $q.loading.hide()
            console.log(err)
            $q.notify({
                message: `注册失败！${err.msg}`,
                color: 'negative',
                position: 'top'
            })
        })
}

const onReset = () => {
    username.value = null
    password.value = null
    repassword.value = null
    email.value = null
}

</script>
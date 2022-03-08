<template>
    <n-form
        :model="modelRef"
        :rules="rules"
        label-placement="left"
        label-width="auto"
    >
        <n-form-item path="username" label="用户名">
            <n-input v-model:value="modelRef.username" />
        </n-form-item>
        <n-form-item path="password" label="密码">
            <n-input v-model:value="modelRef.password" type="password" />
        </n-form-item>
        <n-row :gutter="[0, 24]">
            <n-col :span="12">
                <div style="display: flex; justify-content: flex-end">
                    <n-button
                        :disabled="modelRef.username === null"
                        round
                        type="primary"
                        @click="handleValidateButtonClick"
                    >验证</n-button>
                </div>
            </n-col>
        </n-row>
    </n-form>

    <pre>{{ JSON.stringify(modelRef, null, 2) }}</pre>
    <pre>{{ JSON.stringify(user.value, null, 2) }}</pre>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { userLogin, resetToken } from '@/api/apis.js'

const user = inject('user')
const router = useRouter()
const modelRef = ref({
    username: null,
    password: null
});


function handleValidateButtonClick(e) {
    // resetToken(null)
    e.preventDefault();
    userLogin(modelRef.value)
    .then((res) => {
        // console.log(res)
        user.value = res.data
        window.$message.success("验证成功");
        router.push({name: 'Home'})
    }).catch((err) => {
        console.log(err)
        window.$message.error("验证失败");
    });
}

const rules = {
    username: {
        required: true,
        message: '请输入用户名',
        trigger: ["input", "blur"]
    },
    password: {
        required: true,
        message: "请输入密码"
    }
}

</script>
<template>
    <q-page class="bgp">
        <q-card class="absolute-center q-px-lg" style="opacity:0.7; width: 60em">
        
            <q-card-section>
                <div class="text-h3 text-center">2019中国新冠肺炎数据库</div>
            </q-card-section>

            <q-separator inset  />

            <q-card-actions class="q-px-lg">
                <q-input 
                    filled
                    clearable
                    clear-icon="clear"
                    label="请输入查询内容"
                    class="full-width"
                    color="secondary"
                    v-model="query"
                >
                    <template v-slot:after>
                        <q-btn icon="search" flat round />
                    </template>
                </q-input>
            </q-card-actions>

            <q-card-section>
                <div class="text-h6">简介</div>
                <div class="text-body1">XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</div>
            </q-card-section>

        </q-card>
    </q-page>
</template>

<script setup>

import { ref } from 'vue'

const query = ref('')

</script>

<style lang="sass" scoped>

.bgp
    background-image: url("bg3.jpeg")
    background-repeat: no-repeat
    background-size: 100% 100%
</style>
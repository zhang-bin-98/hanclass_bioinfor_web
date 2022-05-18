<template>
    <q-page class="q-pa-md row items-start justify-center q-gutter-md bg-grey-2">
        <q-card flat class="col-4">
            <q-card-section>
                <h2>BLAST</h2>
            </q-card-section>
            <q-separator />
            <q-card-actions>
                <q-input filled lazy-rules clearable type="textarea" clear-icon="close" label="请输入查询序列"
                    class="full-width" color="secondary" v-model="seq" />
                <q-input filled lazy-rules clearable type="number" clear-icon="close" label="word size"
                    class="full-width" color="secondary" v-model="word_size" />
                <q-input filled lazy-rules clearable type="number" clear-icon="close" label="evalue" class="full-width"
                    color="secondary" v-model="evalue" />
                <q-btn outline label="查询" color="secondary" class="full-width text-center" @click="callBlast" />
            </q-card-actions>
            <q-separator />
        </q-card>
        <q-card flat class="col-7 col-lg-5 scroll" style="max-height: 85vh;">
            <q-card-section>
                <pre v-html="blast_res" />
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { seqBlast } from '@/api/apis.js'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const seq = ref('ACCAATCTCTGATGAAGTCGATGCTACTCACTTTGGAACTTTTGGTGTAGCCGTAGAGGC')
const word_size = ref(null)
const evalue = ref(null)

const blast_res = ref(null)

const callBlast = () => {
    $q.loading.show()
    seqBlast({
        seq: seq.value,
        word_size: word_size.value,
        evalue: evalue.value
    }).then((res) => {
        $q.loading.hide()
        console.log(res)
        $q.notify({
            message: '成功',
            color: 'primary',
            position: 'top',
            icon: 'announcement'
        })
        console.log(res)
        blast_res.value = res.data.join('\n')

    }).catch((err) => {
        $q.loading.hide()
        console.log(err)
        $q.notify({
            message: '失败,请重试！',
            color: 'negative',
            position: 'top',
            icon: 'announcement'
        })
    })
}

</script>

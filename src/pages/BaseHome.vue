<template>
    <q-page class="bgp">
        <q-card class="absolute-center q-px-lg" style="opacity:0.7; width: 60em">
            <q-card-section>
                <div class="text-h3 text-center">新冠肺炎信息数据库</div>
            </q-card-section>

            <q-separator inset />

            <q-card-actions class="q-px-lg">
                <q-input
                    filled
                    clearable
                    clear-icon="clear"
                    label="序列相关信息查询"
                    class="full-width"
                    color="secondary"
                    v-model="query"
                >
                    <template v-slot:after>
                        <q-btn
                            icon="search"
                            flat
                            round
                            @click="
                                router.push({
                                    name: 'SeqList',
                                    query: { q: query }
                                })
                            "
                        />
                    </template>
                </q-input>
            </q-card-actions>

            <q-card-section>
                <div class="text-h6">简介</div>
                <div class="text-body1">
                    新型冠状病毒（2019-nCoV）作为新型冠状病毒肺炎疫情的致病源，
                    在出现至今的三年间一直是各个国家的研究热点。 
                    本网站主要搜集了国家生物信息中心（CNCB）/国家基因组科学数据中心（NGDC）
                    网站中2019年以来中国地区人类2019-nCoV（宿主为人类）的基因组信息， 
                    包含来自中国<span class="text-weight-bold tex-pink-10">{{ numberCount.city }}</span>个不同城市(地区)、 
                    <span class="text-weight-bold tex-pink-10">{{ numberCount.lineage }}</span>个不同谱系病毒的共计<span class="text-weight-bold tex-pink-10">{{ numberCount.items }}</span>条数据， 
                    其中完整序列的比列可达<span class="text-weight-bold tex-pink-10">{{ Number(numberCount.nuc_completeness_percent * 100).toFixed(2) }}%</span>。 
                    除提供病毒株名，序列号，ID，采样、递交和上传时间等常规信息外， 
                    本网站还提供了对序列完整度为“Complete”的基因组序列进行检测得到的质量评估结果。 
                    该结果从包未知碱基（N）、简并碱基（非ATGCN的碱基）数量、 
                    与参考序列（MN908947）比对后出现的gap（deletion、insertion、indel）数量、变异总数、变异密度 
                    （变异数/区间长度，区间长度&lt 20nt）5个维度反映了序列的整体质量， 对研究人员的选择和判断具有一定的参考价值。        
                    <br/>
                    <br/>
                    除研究病毒本身外，该病毒对人类的影响也是一大研究热点。
                    人类感染新型冠状病毒（2019-nCoV）后，多组织器官会受到不同程度的不良影响。
                    已有数据显示，新型冠状病毒会导致心脏受损。
                    为了探究感染病毒带来的基因表达差异，
                    挖掘新型冠状病毒基因诱导人类心脏异常的可能分子机制，
                    我们选取了一则新近相关研究中的RNA-seq数据并进行了blast、
                    差异表达基因计算等分析。
                    该组数据其来自于对人类多能干细胞衍生的心肌细胞进行的bulk测序，
                    GEO数据库序列号为GSE171742。
                </div>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { seqCount } from '@/api/apis.js'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const query = ref('')
const router = useRouter()
const numberCount = ref({
    city: 130,
    lineage: 218,
    nuc_completeness_percent: 0.92,
    items: 9588
})

onMounted(() => {
    seqCount()
        .then((res) => {
            console.log(res)
            numberCount.value = res.data
        })
        .catch((err) => {
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

<style lang="sass" scoped>
.bgp
    background-image: url("bg3.jpeg")
    background-repeat: no-repeat
    background-size: 100% 100%
</style>
<template>
    <q-page class="bg-grey-1">
        <q-card class="absolute-center q-pa-lg" style="opacity:0.7; width: 60em">

            <q-card-section>
                <div class="text-h3 text-center">404 资源不存在</div>
            </q-card-section>

            <q-separator inset />

            <q-card-actions class="q-pa-lg justify-center" vertical>
                <q-btn @click="$router.replace({ name: 'Home' })" label="回主页" color="positive"/>
            </q-card-actions>
            
        </q-card>
    </q-page>
</template>

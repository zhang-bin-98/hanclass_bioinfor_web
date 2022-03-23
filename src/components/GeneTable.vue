<template>
    <n-data-table :columns="columns" :data="data" :pagination="pagination" :bordered="false" />
</template>

<script setup>
import { h, inject } from "vue";
import { NButton } from "naive-ui";
import { geneCreate, geneDelete } from '@/api/apis.js'

const message = window.$message;
const user = inject('user')

const createColumns = () => {
    let header = [
        {
            title: "No",
            key: "no"
        },
        {
            title: "Title",
            key: "title"
        },
        {
            title: "Length",
            key: "length"
        }
    ];

    const add = (row) => {message.info(`Play ${row.title}`);}

    if (user.value) {
        header.push({
            title: "操作",
            key: "actions",
            render(row) {
                // 校验ID
                return h(NButton, {
                    strong: true,
                    tertiary: true,
                    size: "small",
                    onClick: () => add(row)
                }, {
                    default: () => "添加"
                });
            }
        })
    }

    return header
};

const data = [
    { no: 3, title: "Wonderwall", length: "4:18" },
    { no: 4, title: "Don't Look Back in Anger", length: "4:48" },
    { no: 12, title: "Champagne Supernova", length: "7:27" }
];

const columns = createColumns()
const pagination = false

</script>
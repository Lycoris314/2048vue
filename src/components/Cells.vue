<script setup lang="ts">
import { computed, inject, type Ref } from "vue"

const cellNum = inject("cellNum") as Ref<number>
const cellSize = inject("cellSize") as Ref<number>

const cellNumTotal = computed(() =>
    new Array(cellNum.value ** 2))

const cellStyle = computed(() => {

    return {
        width: `${cellSize.value}px`,
        height: `${cellSize.value}px`
    }
})
</script>

<template>
    <div class="cell" v-for="_ of cellNumTotal" :style="cellStyle"></div>
</template>

<style scoped>
.cell {
    background-color: darkgreen;
}
</style>
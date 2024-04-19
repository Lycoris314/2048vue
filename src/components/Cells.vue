<script setup lang="ts">
import { computed } from "vue"

const props = defineProps({ cellNum: Number }) as { cellNum: number }


const cellSize = computed(() => (690 - (props.cellNum - 1) * 10) / props.cellNum)

const cellNumTotal = computed(() =>
    new Array((props.cellNum) ** 2))

const cellStyle = {
    width: `${cellSize.value}px`,
    height: `${cellSize.value}px`
}
</script>

<template>
    <div class="cell" v-for="_ of cellNumTotal" :style="cellStyle"></div>
</template>

<style scoped>
.cell {
    background-color: darkgreen;
}
</style>
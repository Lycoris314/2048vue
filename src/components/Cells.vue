<script setup>
import { computed } from "vue"

const props = defineProps({ cellNum: Number })

const cellSize = computed(() => (690 - (props.cellNum - 1) * 10) / props.cellNum)

const cellNumTotal = computed(() => R.range(0, props.cellNum ** 2))

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
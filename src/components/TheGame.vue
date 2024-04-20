<script setup lang="ts">
import GameField from "./GameField.vue";
import H1 from "./H1.vue";
import { computed, inject, type Ref } from "vue"

const fieldSize = inject("fieldSize") as Ref<number>
const containerStyle = computed(() => {
    const h = fieldSize.value + 250;
    return { height: `max(100vh, ${h}px` }
})

const emit = defineEmits(["on-click"]);
const toStart = () => {
    emit("on-click")
}
const props = defineProps({ cellNum: Number, showingRule: Boolean })
</script>
<template>
    <div class="container" :style="containerStyle">
        <H1></H1>
        <GameField :cellNum="props.cellNum" :showingRule="props.showingRule"></GameField>
        <button class="toStart" @click="toStart">スタート<br>画面に戻る</button>
    </div>

</template>
<style scoped>
.container {
    /* height: max(100vh, calc(100vw + 100px)); */
    width: max-content;
    margin: 0 auto;
    padding: 0 30px;
    box-shadow: 0 0 10px 10px silver;
    background-color: antiquewhite;
}

button.toStart {
    background-color: darkgreen;
    color: white;
    font-size: 0.79rem;
    border-radius: 20px 20px 0 0;
    padding: 5px 20px;
    position: fixed;
    bottom: 0;
    right: calc(50% - min(40%, 350px) + 130px);
    z-index: 60;
}

button.toStart:hover {
    background-color: green;
}
</style>
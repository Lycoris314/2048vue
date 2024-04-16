<script setup lang="ts">
import GameField from "./GameField.vue";
import H1 from "./H1.vue";


const emit = defineEmits(["on-click"]);
const toStart = () => {
    emit("on-click")
}
const props = defineProps({ cellNum: Number })
</script>
<template>
    <div class="container">
        <H1></H1>
        <GameField :cellNum="props.cellNum"></GameField>
        <button class="toStart" @click="toStart">スタート<br>画面に戻る</button>
    </div>

</template>
<style scoped>
.container {
    height: 100vh;
    width: 800px;
    margin: 0 auto;
    padding: 0 30px;
    box-shadow: 0 0 10px 10px silver;
    background-color: antiquewhite;
}

button.toStart {
    background-color: darkgreen;
    color: white;
    font-size: 0.75rem;
    border-radius: 20px 20px 0 0;
    padding: 5px 20px;
    position: absolute;
    bottom: 0;
    right: calc(50% - 220px);
    z-index: 60;
}
</style>
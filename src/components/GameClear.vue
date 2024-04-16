<script setup>
const props = defineProps({ score: Number })
const emit = defineEmits(["on-click-restart, on-click-conti"]);

const restart = () => {
    emit('on-click-restart')
}
const conti = () => {
    emit("on-click-conti")
}
</script>
<template>
    <div class="cont">
        <p>ゲームクリア!</p>
        <p class="score">スコア：{{ props.score }}</p>
        <button @click="restart">リスタート</button>
        <button @click="conti">続ける</button>
    </div>
</template>
<style scoped>
.cont {
    position: absolute;
    z-index: 5;
    background-color: rgb(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

p {
    color: white;
}
</style>
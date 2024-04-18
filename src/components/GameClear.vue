<script setup lang="ts">
const props = defineProps({ score: Number })
const emit = defineEmits(["on-click-restart", "on-click-conti"]);

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
        <div class="btns">
            <button @click="restart">リスタート</button>
            <button @click="conti">そのまま続ける</button>
        </div>
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
    display: grid;
    place-content: center;
    gap: 50px;
}

p {
    color: white;
    text-align: center;
    font-size: 1.8rem;
}

.btns {
    display: flex;
    gap: 30px;
}

button {
    font-size: 1.3rem;
    color: darkgreen;
    background-color: white;
    border-radius: 15px;
    padding: 5px 25px;
}

button:hover {
    background-color: rgb(222, 255, 222);
}
</style>
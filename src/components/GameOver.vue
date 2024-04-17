<script setup lang="ts">
const props = defineProps({ score: Number })
const emit = defineEmits(["on-click"]);

const restart = () => {
    emit('on-click')
}
</script>
<template>
    <div class="cont">
        <p>ゲームオーバー!</p>
        <p class="score">スコア：{{ props.score }}</p>
        <button @click="restart">リスタート</button>
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
    gap: 50px;
    place-content: center;
}

p {
    color: white;
    text-align: center;
    font-size: 1.5rem;
}

button {
    background-color: white;
    border-radius: 15px;
    color: darkgreen;
    border: 1px solid darkgreen;
    padding: 5px 50px;
    font-size: 1.3rem;
    transition: 0.3s;
}

button:hover {
    background-color: rgb(206, 238, 206);
}
</style>
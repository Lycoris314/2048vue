<script setup lang="ts">
const emit = defineEmits(["on-click"]);

const ruleToggle = () => {
    emit("on-click")
}
</script>

<template>
    <button @click="ruleToggle">ルール</button>
</template>

<style scoped>
button {
    background-color: darkgreen;
    color: white;
    font-size: 1.2rem;
    border-radius: 20px 20px 0 0;
    padding: 10px 20px;
    position: fixed;
    bottom: 0;
    right: calc(50% - min(40%, 350px));
    z-index: 100;
}

button:hover {
    background-color: green;
}
</style>
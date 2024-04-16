<script setup></script>

<template>
    <div class="back">

    </div>
</template>

<style scoped>
.back {
    width: 100%;
    height: 100vw;
    position: fixed;
    top: 100%;
    left: 0;
    background-color: rgb(0, 0, 0, 0.5);
    z-index: 80;
    transition: 0.3s;
}

.back.show {
    top: 0
}
</style>
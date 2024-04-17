<script setup>
</script>

<template>
    <div class="scores">
        <div class="highScore">
            <p>ハイスコア</p>
            <p class="highScore">
                <slot name="highScore"></slot>
            </p>
        </div>
        <div class="score">
            <p>スコア</p>
            <p class="score">
                <slot name="score"></slot>
            </p>
        </div>
    </div>
</template>

<style scoped>
div.scores {
    position: absolute;
    display: flex;
    padding: 20px 0;
    gap: 10px;
    top: -100px;
    right: 0px;
}

div.highScore,
div.score {
    width: 120px;
    height: 60px;
    background-color: darkgreen;
    color: white;
    border-radius: 10px;
    display: grid;
    place-content: center;
}

div.scores p {
    text-align: center;
}
</style>
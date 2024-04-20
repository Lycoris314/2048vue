<script setup lang="ts">
import { ref, onMounted } from "vue";
import H1 from "./H1.vue";
import { getHighScore } from "./highScore.ts";

const checkBoxNum = ref(4);

const emit = defineEmits(["on-click"]);

const gameStart = () => {
    emit("on-click", Number(checkBoxNum.value));
}

onMounted(() => {
    const html = <HTMLHtmlElement>document.querySelector("html");
    html.style.overflowY = "auto";
})

</script>

<template>
    <div class="container">
        <H1></H1>

        <h2>サイズを選択</h2>
        <ul>
            <li v-for="i of ['3', '4', '5', '6']">
                <label :for=i>{{ i }}×{{ i }} </label> &ensp;
                <input type="radio" name="size" :id=i :value=i v-model="checkBoxNum">
            </li>
        </ul>

        <button class=" gameStart" @click="gameStart">スタート</button>

        <h2>ハイスコア</h2>
        <table>
            <tr v-for="  i of [3, 4, 5, 6]">
                <td>{{ i }}×{{ i }}</td>
                <td>{{ getHighScore(i) }}点</td>
            </tr>
        </table>
    </div>
</template>

<style scoped>
.container {
    min-height: 100vh;
    width: 80%;
    margin: 0 auto;
    padding: 0 30px;
    box-shadow: 0 0 10px 10px silver;
    background-color: antiquewhite;
}

li {
    font-size: 1.2rem;
    padding: 3px 0;
}

ul {
    list-style-type: none;
    padding: 20px;
}

input[type="radio"] {
    scale: 1.7
}

input[type="radio"]:hover {
    cursor: pointer;
}


button.gameStart {
    display: block;
    width: 70%;
    height: 40px;
    color: darkgreen;
    background-color: white;
    border: 2px solid darkgreen;
    border-radius: 20px;
    margin: 40px auto;
    transition: 0.3s;
}

button.gameStart:hover {
    background-color: rgb(226, 255, 179);
}

button.gameStart:active {
    background-color: rgb(192, 216, 152);
}

table {

    border-collapse: collapse;
    margin: 50px auto 0;
}

/* スクロール時の余白のため */
table::after {
    content: "";
    display: block;
    width: 100%;
    height: 20px;
}

td {
    width: 200px;
    text-align: center;
    font-size: 1.2rem;
    padding: 4px 0;
}

tr:nth-child(even) {
    background-color: rgb(161, 255, 224);
}

tr:nth-child(odd) {
    background-color: rgb(255, 220, 165);
}
</style>

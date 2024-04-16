<script setup lang="ts">
import { ref } from "vue";
//import { emit } from "process";
import H1 from "./H1.vue";

const checkBoxNum = ref(4);

const emit = defineEmits(["on-click"]);

const gameStart = () => {
    emit("on-click", Number(checkBoxNum.value));
}

</script>

<template>
    <div class="container">
        <H1></H1>
        {{ checkBoxNum }}
        <h2>サイズを選択</h2>
        <ul>
            <li><label for="33">3×3</label> <input type="radio" name="size" id="33" value="3" v-model="checkBoxNum">
            </li>
            <li><label for="44">4×4</label> <input type="radio" name="size" id="44" value="4" v-model="checkBoxNum"
                    checked></li>
            <li><label for="55">5×5</label> <input type="radio" name="size" id="55" value="5" v-model="checkBoxNum">
            </li>
            <li><label for="66">6×6</label> <input type="radio" name="size" id="66" value="6" v-model="checkBoxNum">
            </li>
        </ul>
        <button class=" gameStart" @click="gameStart">スタート</button>

        <h2>ハイスコア</h2>
        <table>
            <tr>
                <td>3×3</td>
                <td></td>
            </tr>
            <tr>
                <td>4×4</td>
                <td></td>
            </tr>
            <tr>
                <td>5×5</td>
                <td></td>
            </tr>
            <tr>
                <td>6×6</td>
                <td></td>
            </tr>
        </table>


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

ul {
    list-style-type: none;
    padding: 0;
}

.gameStart {
    width: 70%;
    height: 40px;
    background-color: white;
    border: 2px solid darkgreen;
    border-radius: 20px;

}
</style>

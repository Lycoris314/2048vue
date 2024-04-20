<script setup lang="ts">
import { ref, type Ref, computed, onMounted, inject } from "vue"
import { YX, yx } from "./class/YX.ts"
import { Panel } from "./class/panel.ts"
import { randomNum, emptyCells, randomSelect } from "./forPutPannel.ts"
import GameOver from "./GameOver.vue"
import GameClear from "./GameClear.vue"
import Scores from "./Scores.vue"
import Cells from "./Cells.vue"
import Panels from "./Panels.vue"
import { getHighScore, updateHighScore } from "./highScore.ts"
import { range, transpose } from "ramda"
import { forNextGene } from "./forNextGene.ts"


const props = defineProps({ showingRule: { default: false } })

const cellNum = inject("cellNum") as Ref<number>;
const fieldSize = inject("fieldSize") as Ref<number>;
const score = ref(0);
const highScore = ref(getHighScore(cellNum.value));

const gameOver = ref(false); //ゲームーバー画面の表示
const gameClear = ref(false); //ゲームクリア画面の表示
const afterClear = ref(false); //クリア後にはもうクリア画面が表示されないようにするのに使う

const panels: Ref<Panel[]> = ref([]);

const position = computed(() => {
    //初期化
    const mat = new Array(cellNum.value).fill(null).map(_ => new Array(cellNum.value).fill(null));

    panels.value.forEach((elm) => {
        mat[elm.vec.y][elm.vec.x] = elm;
    })
    return mat;
})

const transition = ref(false); //移動アニメーション中にtrue

const putPanel = () => {
    const vec = randomSelect(emptyCells(position.value))
    const panel = new Panel(vec, randomNum(cellNum.value))

    panels.value.push(panel);
}

putPanel();
putPanel();

const preventEventCondition = computed(() =>
    transition.value || props.showingRule || gameOver.value || gameClear.value)

onMounted(() => {
    const html = <HTMLHtmlElement>document.querySelector("html");

    let startX: number | null, endX: number | null, startY: number | null, endY: number | null

    html.addEventListener("touchstart", (e) => {
        if (preventEventCondition.value) return;
        startX = e.touches[0].pageX;
        startY = e.touches[0].pageY;
        console.log(startY, startX);
    })
    html.addEventListener("touchmove", (e) => {
        if (preventEventCondition.value) return;
        endX = e.changedTouches[0].pageX;
        endY = e.changedTouches[0].pageY;
    })
    html.addEventListener("touchend", (e) => {
        if (preventEventCondition.value) return;

        function calcDir(dY: number, dX: number) {

            //if (Math.abs(dX) + Math.abs(dY) < 10) return null
            if (dX == 0 && dY > 0) return yx(1, 0)
            if (dX == 0 && dY < 0) return yx(-1, 0)
            const tangent = dY / dX
            if (-0.5 < tangent && tangent < 0.5) {
                if (dX > 0) return yx(0, 1)
                else return yx(0, -1)
            }
            if (tangent > 2 || tangent < -2) {
                if (dY > 0) return yx(1, 0)
                else return yx(-1, 0)
            }
            return null
        }

        if (startY == null || startX == null || endY == null || endX == null) return
        const dir = calcDir(endY - startY, endX - startX)

        if (dir === null) return;
        DoAfterCalcDir(dir)

        startY = null; endY = null; startX = null; startY = null;
    })

    html.addEventListener("keydown", (e) => {

        if (preventEventCondition.value) return;

        function calcDir(key: string) {
            switch (key) {
                case "ArrowUp":
                case "w":
                    return yx(-1, 0);
                case "ArrowDown":
                case "s":
                    return yx(1, 0);
                case "ArrowLeft":
                case "a":
                    return yx(0, -1);
                case "ArrowRight":
                case "d":
                    return yx(0, 1);
                default:
                    return null;
            }
        }
        const dir = calcDir(e.key)
        if (dir === null) return;
        DoAfterCalcDir(dir)
    })
})

function DoAfterCalcDir(dir: YX) {

    const { nextGenePanels, growPanels, moveLengthArr } =
        forNextGene(dir, panels.value, position.value, cellNum.value)

    //１つも移動しないならここで中断(パネルは追加しない)
    if (moveLengthArr.every(elm => elm[1] === 0)) return;

    //以下移動アニメーション用
    transition.value = true;

    moveLengthArr.forEach(elm => {
        elm[0].slide(YX.scalar(elm[1], dir));
    })

    new Promise(resolve => {
        setTimeout(() => {
            resolve("");
        }, 300)
    }).then(() => {
        //移動アニメーション終わり
        transition.value = false;

        panels.value = nextGenePanels

        //衝突されたパネルをgrowさせる。
        growPanels.forEach((elm) => {
            const panel = panels.value.find(pa => {
                return pa.vec.y === elm.y && pa.vec.x === elm.x;
            })
            if (panel !== undefined) {
                panel.grow();
                //得点加算
                score.value += 2 ** (panel.num + 1)
            }
        })

        putPanel();

        //ゲームクリアの時
        if (isGameClear() && !afterClear.value) {
            gameClear.value = true;
            updateHighScore(cellNum.value, score.value);

        }
        //ゲームオーバーの時
        else if (isGameOver()) {
            gameOver.value = true;
            updateHighScore(cellNum.value, score.value);
        }
    })
}

function isGameClear() {
    const map = new Map([[3, 7], [4, 10], [5, 12], [6, 13]]);
    const c = map.get(cellNum.value) as number;
    return panels.value.map(elm => elm.num).includes(c)
}

function isGameOver() {
    return panels.value.length === (cellNum.value) ** 2
        && noMove(position.value)
}
function noMove(matrix: Panel[][]) {
    const f = (mat: Panel[][]) =>
        mat.every((arr) => {
            const row = arr.map((elm) => elm.num);
            return range(0, arr.length - 1).every(
                (n) => row[n] !== row[n + 1]
            );
        });
    return f(matrix) && f(transpose(matrix));
};

const renderKey = ref(0);
//リスタートボタンを押すと
const restart = () => {
    gameOver.value = false;
    gameClear.value = false;
    afterClear.value = false;
    score.value = 0;
    panels.value = [];

    transition.value = false;
    highScore.value = getHighScore(cellNum.value)

    putPanel();
    putPanel();

}
//そのまま続けるボタンを押すと
const conti = () => {
    gameClear.value = false;
    afterClear.value = true;
    //クリア後即ゲームオーバー
    if (isGameOver()) {
        gameOver.value = true;
    }
}

const fieldStyle = computed(() => {
    return {
        width: `${fieldSize.value}px`,
        height: `${fieldSize.value}px`
    }
})



</script>
<template>
    <div class="field" :style="fieldStyle">
        <GameOver :score="score" @on-click="restart" v-if="gameOver"></GameOver>
        <GameClear :score="score" v-if="gameClear" @on-click-restart="restart" @on-click-conti="conti"></GameClear>

        <Scores>
            <template #highScore>{{ highScore }}</template>
            <template #score>{{ score }}</template>
        </Scores>

        <Cells></Cells>

        <Panels :panels="panels" :transition="transition"></Panels>
        <!-- <button class="restart" @click="restart">リスタート</button> -->
    </div>

</template>


<style scoped>
.field {
    padding: 10px;
    margin: 0 auto;
    gap: 10px;
    background-color: green;
    display: flex;
    flex-wrap: wrap;
    position: relative;
}

/* button.restart {
    width: 70%;
    padding: 3px 0;
    font-size: 1.2rem;
    margin: 40px auto 0;
    background-color: white;
    color: darkgreen;
    border: 2px solid darkgreen;
    border-radius: 20px;
}

button.restart:hover {
    background-color: rgb(222, 255, 222);
} */
</style>
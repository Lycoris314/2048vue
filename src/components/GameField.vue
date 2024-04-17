<script setup>
import { ref, computed, onMounted } from "vue"
import { YX, yx } from "./class/YX.ts"
import { Panel } from "./class/panel.ts"
import { randomNum, emptyCells, randomSelect } from "./forPutPannel.ts"
import GameOver from "./GameOver.vue"
import GameClear from "./GameClear.vue"
import { getHighScore, updateHighScore } from "./highScore.ts"


const props = defineProps({ cellNum: Number, showingRule: Boolean })

const score = ref(0);
const highScore = ref(getHighScore(props.cellNum));

const gameOver = ref(false);
const gameClear = ref(false);
const afterClear = ref(false); //クリア後にはもうクリア画面が表示されないようにするための

const cellSize = computed(() => (690 - (props.cellNum - 1) * 10) / props.cellNum)
const cellNumTotal = computed(() => R.range(0, props.cellNum ** 2))

const cellStyle = {
    width: `${cellSize.value}px`,
    height: `${cellSize.value}px`
}

const panels = ref([]);

const position = computed(() => {
    //初期化
    const num = props.cellNum;
    const mat = new Array(num).fill(null).map(_ => new Array(num).fill(null));

    panels.value.forEach(elm => {
        mat[elm.vec.y][elm.vec.x] = elm;
    })
    return mat;
})

const transition = ref(false); //移動アニメーション中にtrue

const putPanel = () => {
    const vec = randomSelect(emptyCells(position.value))
    const panel = new Panel(vec, randomNum(props.cellNum))

    panels.value.push(panel);
}

const panelStyle = (panel) => {
    return {
        width: `${cellSize.value}px`,
        height: `${cellSize.value}px`,
        top: `${panel.vec.y * (cellSize.value + 10) + 10}px`,
        left: `${panel.vec.x * (cellSize.value + 10) + 10}px`,
        backgroundColor: Panel.COLORS[panel.num]
    }
}

putPanel();
putPanel();

onMounted(() => {

    const html = document.querySelector("html");
    html.addEventListener("keydown", (e) => {

        if (transition.value) return;
        if (props.showingRule) return;
        if (gameOver.value) return;
        if (gameClear.value) return;

        function dir_(key) {
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
        const dir = dir_(e.key)
        if (dir === null) return;

        let nextGenePanels = [];//衝突しない(消えない)パネルを入れていく
        let growPanels = [];//衝突されてgrowするパネルの位置を入れていく
        let moving = [];

        panels.value.forEach(elm => {

            const dCAC = disapCondAndCount(nRPtoNum(elm.vec), elm.num)

            const moveLength = dist(elm.vec) - nRPtoNum(elm.vec).length + dCAC[1];

            if (dCAC[0]) {
                growPanels.push(YX.add(elm.vec, YX.scalar(moveLength, dir)))

            } else {
                nextGenePanels.push(elm)
            }

            moving.push([elm, moveLength]);
        })
        //１つも移動しないならここで中断(パネルは追加しない)
        if (moving.every(elm => elm[1] === 0)) return;

        //以下移動アニメーション用
        transition.value = true;

        moving.forEach(elm => {
            elm[0].slide(YX.scalar(elm[1], dir));
        })

        new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 300)
        }).then(() => {
            //移動アニメーション終わり
            transition.value = false;

            panels.value = nextGenePanels

            growPanels.forEach((elm) => {
                const panel = panels.value.find(pa => {
                    return pa.vec.y === elm.y && pa.vec.x === elm.x;
                })
                //if (panel === undefined) console.log("grow panel not found");

                panel.grow();

                score.value += 2 ** (panel.num + 1)
            })

            putPanel();

            //ゲームクリア
            if (isGameClear() && !afterClear.value) {
                console.log("clear");
                gameClear.value = true;
                updateHighScore(props.cellNum, score.value);

            }
            //ゲームオーバー
            else if (panels.value.length === props.cellNum ** 2
                && noMove(position.value)
            ) {
                gameOver.value = true;
                updateHighScore(props.cellNum, score.value);
            }
            function noMove(matrix) {
                const f = (mat) =>
                    mat.every((arr) => {
                        const row = arr.map((elm) => elm.num);
                        return R.range(0, arr.length - 1).every(
                            (n) => row[n] !== row[n + 1]
                        );
                    });
                return f(matrix) && f(R.transpose(matrix));
            };
            function isGameClear() {
                //const table = { 3: 7, 4: 10, 5: 12, 6: 13 };
                //短縮版
                const table = { 3: 4, 4: 5, 5: 6, 6: 7 };
                const c = table[props.cellNum];
                return panels.value.map(elm => elm.num).includes(c)
            }

        })

        function dist(vec) {
            return dir.y === 1
                ? props.cellNum - vec.y - 1
                : dir.y === -1
                    ? vec.y
                    : dir.x === 1
                        ? props.cellNum - vec.x - 1
                        : dir.x === -1
                            ? vec.x
                            : null;
        }

        function path(vec) {
            const re = R.range(1, dist(vec) + 1).map(i => {
                const w = YX.add(vec, YX.scalar(i, dir));
                return position.value[w.y][w.x]
            })
            return re;
        }

        function nullRemovedPath(vec) {
            return path(vec).filter(elm => elm !== null)
        }
        function nRPtoNum(vec) {
            return nullRemovedPath(vec).map(elm => elm.num)
        }

        function disapCondAndCount(arr, n) {
            let count = 0;
            const disapCond = (arr, n) => {
                //基底部
                if (arr.length === 0) return false;

                if (arr.length === 1) {
                    if (arr[0] === n) {
                        count++;
                        return true;
                    } else {
                        return false;
                    }
                }
                //再帰部
                if (arr.at(-1) === arr.at(-2)) {
                    count++;
                    return disapCond(arr.slice(0, -2), n);
                } else {
                    return disapCond(arr.slice(0, -1), n);
                }
            };
            return [disapCond(arr, n), count];
        };
    })
})

const restart = () => {

    gameOver.value = false;
    gameClear.value = false;
    afterClear.value = false;
    score.value = 0;
    panels.value = [];
    transition.value = false;
    highScore.value = getHighScore(props.cellNum)
    putPanel();
    putPanel();
}

const conti = () => {
    gameClear.value = false;
    afterClear.value = true;
}

</script>
<template>
    <div class="field">
        <GameOver :score="score" @on-click="restart" v-if="gameOver"></GameOver>
        <GameClear :score="score" v-if="gameClear" @on-click-restart="restart" @on-click-conti="conti"></GameClear>

        <div class="scores">
            <div class="highScore">
                <p>ハイスコア</p>
                <p class="highScore">{{ highScore }}</p>
            </div>
            <div class="score">
                <p>スコア</p>
                <p class="score">{{ score }}</p>
            </div>
        </div>

        <div class="cell" v-for="_ of cellNumTotal" :style="cellStyle"></div>

        <div class="panel" v-for="panel of panels" :style="panelStyle(panel)" :class="{
            transition: transition,
            popAnimation: panel.popAnimation,
            growAnimation: panel.growAnimation
        }">
            {{ 2 ** (panel.num + 1) }}
        </div>

        <button class="restart" @click="restart">リスタート</button>
    </div>
</template>


<style scoped>
.field {
    width: 690px;
    height: 690px;
    padding: 10px;
    margin: 0 auto;
    gap: 10px;
    background-color: green;
    display: flex;
    flex-wrap: wrap;
    position: relative;
}

.cell {
    background-color: darkgreen;
}

.panel {
    background-color: gray;
    display: grid;
    font-size: 1.5rem;
    place-content: center;
    position: absolute;
}

.transition {
    transition: 0.3s;
}

.popAnimation {
    animation: 0.3s pop;
}

@keyframes pop {
    from {
        scale: 0
    }

    to {
        scale: 1
    }
}

.growAnimation {
    animation: 0.3s grow;
}

@keyframes grow {
    from {
        scale: 1;
    }

    50% {
        scale: 1.2;
    }

    to {
        scale: 1;
    }
}

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

button.restart {
    width: 70%;
    padding: 5px 0;
    font-size: 1.2rem;
    margin: 50px auto 0;
    background-color: white;
    color: darkgreen;
    border: 2px solid darkgreen;
    border-radius: 20px;
}

button.restart:hover {
    background-color: rgb(222, 255, 222);
}
</style>
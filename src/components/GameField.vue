<script setup lang="ts">
import { ref, type Ref, computed, onMounted } from "vue"
import { YX, yx } from "./class/YX.js"
import { Panel } from "./class/panel.js"
import { randomNum, emptyCells, randomSelect } from "./forPutPannel.ts"
import GameOver from "./GameOver.vue"
import GameClear from "./GameClear.vue"
import Scores from "./Scores.vue"
import Cells from "./Cells.vue"
import Panels from "./Panels.vue"
import { getHighScore, updateHighScore } from "./highScore.js"


const props = defineProps({ cellNum: Number, showingRule: Boolean })
const cellNum = <number>props.cellNum

const score = ref(0);
const highScore = ref(getHighScore(props.cellNum as number));

const gameOver = ref(false); //ゲームーバー画面の表示
const gameClear = ref(false); //ゲームクリア画面の表示
const afterClear = ref(false); //クリア後にはもうクリア画面が表示されないようにするのに使う

const panels: Ref<Panel[]> = ref([]);

const position = computed(() => {
    //初期化
    const num = props.cellNum;
    const mat = new Array(num).fill(null).map(_ => new Array(num).fill(null));

    panels.value.forEach((elm: Panel) => {
        mat[elm.vec.y][elm.vec.x] = elm;
    })
    return mat;
})

const transition = ref(false); //移動アニメーション中にtrue

const putPanel = () => {
    const vec = randomSelect(emptyCells(position.value))
    const panel = new Panel(vec, <number>randomNum(cellNum))

    panels.value.push(panel);
}

putPanel();
putPanel();

onMounted(() => {

    const html = document.querySelector("html");
    if (html === null) return;
    html.addEventListener("keydown", (e) => {

        if (transition.value) return;
        if (props.showingRule) return;
        if (gameOver.value) return;
        if (gameClear.value) return;

        function dir_(key: string) {
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
        const dir = dir_(e.key) as YX
        if (dir === null) return;

        let nextGenePanels: Panel[] = [];//衝突しない(消えない)パネルを入れていく
        let growPanels: YX[] = [];//衝突されてgrowするパネルの位置を入れていく
        let moving: [Panel, number][] = [];//各パネルの移動距離を記録

        panels.value.forEach((elm: Panel) => {

            const arr = toNum(path(elm.vec));

            //自身が消失するかどうか、さらに移動方向に向かってパネルが消失する数を返す(自身が消失するならそれも含む)。
            const i = info(elm.num, arr)

            //移動距離
            const moveLength = dist(elm.vec) - arr.length + i.disapCount;
            //自身が消える場合にgrowするパネルの位置を記録
            if (i.isDisap) {
                growPanels.push(YX.add(elm.vec, YX.scalar(moveLength, dir)))
                //消えない場合は次の世代へ
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
                updateHighScore(cellNum, score.value);

            }
            //ゲームオーバーの時
            else if (isGameOver()) {
                gameOver.value = true;
                updateHighScore(cellNum, score.value);
            }
        })


        //移動方向に向かってフィールド境界までの距離
        function dist(vec: YX) {
            return dir.y === 1
                ? cellNum - vec.y - 1
                : dir.y === -1
                    ? vec.y
                    : dir.x === 1
                        ? cellNum - vec.x - 1
                        : dir.x === -1
                            ? vec.x
                            : 0;
        }
        //境界までのパネルの列(null="空"も含む)
        function path(vec: YX) {
            const re = R.range(1, dist(vec) + 1).map((i: number) => {
                const w = YX.add(vec, YX.scalar(i, dir));
                return position.value[w.y][w.x]
            })
            return re;
        }
        //pathからnullを取り除いた後、panel.numの列に変換
        function toNum(path: (Panel | null)[]) {
            return path.filter(elm => elm !== null)
                .map(elm => (<Panel>elm).num)
        }

        //例 info(1,[1,2,2])=>{true,2}
        //info(1,[1,1,2,2,1]=>{false,2})
        function info(n: number, arr: number[]) {
            let count = 0;
            const isDisap = (n: number, arr: number[]): Object => {
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
                    return isDisap(n, arr.slice(0, -2));
                } else {
                    return isDisap(n, arr.slice(0, -1));
                }
            };
            return { isDisap: isDisap(n, arr), disapCount: count };
        };
    })
})

function isGameClear() {
    //const table = { 3: 7, 4: 10, 5: 12, 6: 13 };
    //短縮版
    const table = { 3: 4, 4: 5, 5: 6, 6: 7 };
    const c = table[cellNum];
    return panels.value.map(elm => elm.num).includes(c)
}

function isGameOver() {
    return panels.value.length === cellNum ** 2
        && noMove(position.value)
}
function noMove(matrix: Panel[][]) {
    const f = (mat: Panel[][]) =>
        mat.every((arr) => {
            const row = arr.map((elm) => elm.num);
            return R.range(0, arr.length - 1).every(
                (n: number) => row[n] !== row[n + 1]
            );
        });
    return f(matrix) && f(R.transpose(matrix));
};

//リスタートボタンを押すと
const restart = () => {

    gameOver.value = false;
    gameClear.value = false;
    afterClear.value = false;
    score.value = 0;
    panels.value = [];
    transition.value = false;
    highScore.value = getHighScore(cellNum)
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

</script>
<template>
    <div class="field">
        <GameOver :score="score" @on-click="restart" v-if="gameOver"></GameOver>
        <GameClear :score="score" v-if="gameClear" @on-click-restart="restart" @on-click-conti="conti"></GameClear>

        <Scores>
            <template #highScore>{{ highScore }}</template>
            <template #score>{{ score }}</template>
        </Scores>

        <Cells :cellNum="props.cellNum"></Cells>

        <Panels :panels="panels" :transition="transition" :cellNum="props.cellNum">
        </Panels>

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
</style>./class/YX.js
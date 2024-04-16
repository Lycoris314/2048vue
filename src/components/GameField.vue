<script setup>
import { ref, computed, onMounted } from "vue"
import { YX, yx } from "./class/YX.js"
import { Panel } from "./class/panel.ts"
import { randomNum, emptyCells, randomSelect } from "./forPutPannel.ts"


const props = defineProps({ cellNum: Number })

const cellSize = computed(() => (690 - (props.cellNum - 1) * 10) / props.cellNum)
const cellNumTotal = computed(() => R.range(0, props.cellNum ** 2))

const cellStyle = {
    width: `${cellSize.value}px`,
    height: `${cellSize.value}px`
}

const panels = ref([]);

const position = computed(() => {

    const num = props.cellNum;

    const mat = new Array(num).fill(null).map(_ => new Array(num).fill(null));

    panels.value.forEach(elm => {
        mat[elm.vec.y][elm.vec.x] = elm;
    })

    return mat;
})

// const positionn = ref(new Array(props.cellNum).fill(null).map(_ => new Array(props.cellNum).fill(null)));
// console.log(positionn.value);


const putPanel = () => {
    const vec = randomSelect(emptyCells(position.value))
    const panel = new Panel(vec, randomNum(props.cellNum))

    panels.value.push(panel);

    //positionn.value[vec.y][vec.x]=panel
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
putPanel();

onMounted(() => {

    const html = document.querySelector("html");
    html.addEventListener("keydown", (e) => {

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

        let nextGenePanels = [];
        let growPanels = [];

        panels.value.forEach(elm => {

            console.log("開始位置", elm.vec);

            const dCAC = disapCondAndCount(nRPtoNum(elm.vec), elm.num)

            // console.log("壁までの距離", dist(elm.vec));
            // console.log("間のパネル数", nRPtoNum(elm.vec).length);
            // console.log("間の消失パネル数", dCAC[1]);


            const moveLength = dist(elm.vec) - nRPtoNum(elm.vec).length + dCAC[1];
            console.log("移動距離", moveLength);

            if (dCAC[0]) {
                console.log("消失");
                growPanels.push(YX.add(elm.vec, YX.scalar(moveLength, dir)))


            } else {
                console.log("消えず");

                nextGenePanels.push([elm, YX.scalar(moveLength, dir)])
            }
        })
        console.log("..................");

        //panels.value = nextGenePanels;
        panels.value = [];
        nextGenePanels.forEach(elm => {
            elm[0].slide(elm[1])
            panels.value.push(elm[0]);
        })
        nextGenePanels = [];

        putPanel();

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

</script>
<template>
    <div class="field">
        <div class="cell" v-for="_ of cellNumTotal" :style="cellStyle"></div>
        <div class="panel" v-for="panel of panels" :style="panelStyle(panel)">
            {{ 2 ** (panel.num + 1) }}
        </div>
    </div>
</template>


<style scoped>
.field {
    width: 690px;
    height: 690px;
    padding: 10px;
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
    place-content: center;
    position: absolute;
    transition: 0.3s;
}
</style>
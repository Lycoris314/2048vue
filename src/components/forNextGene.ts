import { YX } from "./class/YX.ts";
import { Panel } from "./class/panel.ts";
import { range } from "ramda";

export const forNextGene = (
    dir: YX,
    panels: Panel[],
    position: any[][],
    cellNum: number
) => {
    let nextGenePanels: Panel[] = []; //衝突しない(消えない)パネルを入れていく
    let growPanels: YX[] = []; //衝突されてgrowするパネルの位置を入れていく
    let moveLengthArr: [Panel, number][] = []; //各パネルの移動距離を記録

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
        const re = range(1, dist(vec) + 1).map((i) => {
            const w = YX.add(vec, YX.scalar(i, dir));
            return position[w.y][w.x];
        });
        return re;
    }
    //pathからnullを取り除いた後、panel.numの列に変換
    function toNum(path: (Panel | null)[]) {
        return path
            .filter((elm) => elm !== null)
            .map((elm) => (elm as Panel).num);
    }

    //例 info(1,[1,2,2])=>{true,2}
    //info(1,[1,1,2,2,1]=>{false,2})
    function info(n: number, arr: number[]) {
        let count = 0;
        const isDisap = (n: number, arr: number[]): boolean => {
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
    }

    panels.forEach((elm) => {
        const arr = toNum(path(elm.vec));

        //自身が消失するかどうか、さらに移動方向に向かってパネルが消失する数を返す(自身が消失するならそれも含む)。
        const i = info(elm.num, arr);

        //移動距離
        const moveLength = dist(elm.vec) - arr.length + i.disapCount;
        //自身が消える場合にgrowするパネルの位置を記録
        if (i.isDisap) {
            growPanels.push(YX.add(elm.vec, YX.scalar(moveLength, dir)));
            //消えない場合は次の世代へ
        } else {
            nextGenePanels.push(elm);
        }

        moveLengthArr.push([elm, moveLength]);
    });

    return { nextGenePanels, growPanels, moveLengthArr };
};

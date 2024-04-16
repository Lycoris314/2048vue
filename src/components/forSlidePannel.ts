import { YX, yx } from "./class/YX.js";

export function dist(vec: YX, dir: YX, cellNum: number) {
    return dir.y === 1
        ? cellNum - vec.y - 1
        : dir.y === -1
        ? vec.y
        : dir.x === 1
        ? cellNum - vec.x - 1
        : dir.x === -1
        ? vec.x
        : null;
}

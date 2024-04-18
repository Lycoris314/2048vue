//putPanel関数を構成する関数たち

import { yx } from "./class/YX.js";

export const randomNum = (cellNum: number) => {
    const index = (r: number, arr: number[]) => arr.findIndex((elm) => r < elm);
    const r = Math.random();

    if (cellNum === 3 || cellNum === 4) {
        return index(r, [0.9, 1]);
    }
    if (cellNum == 5) {
        return index(r, [0.4, 0.7, 0.9, 1]);
    } else if (cellNum == 6) {
        return index(r, [0.3, 0.5, 0.7, 0.8, 0.9, 1]);
    }
};

export const emptyCells = (matrix: object[][]) =>
    matrix
        .map((arr, y) =>
            arr.map((cell, x) => (cell === null ? yx(y, x) : null))
        )
        .flat(1)
        .filter((elm) => elm !== null);

export const randomSelect = (arr: any[]) => {
    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
};

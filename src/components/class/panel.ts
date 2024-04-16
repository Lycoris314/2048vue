import { YX, yx } from "./YX.js";

export class Panel {
    vec: YX;
    num: number;

    static COLORS = [
        "silver", //num=0
        "orange",
        "skyblue",
        "pink",
        "aqua",
        "coral",
        "gold",
        "greenyellow",
        "lime",
        "salmon",
        "crimson", //num=10
        "royalblue",
        "purple",
        "indigo",
        "snow",
    ];

    constructor(vec: YX, num: number) {
        this.vec = vec;
        this.num = num;
    }

    // get vec() {
    //     return this.#vec;
    // }

    // get num() {
    //     return this.#num;
    // }

    grow() {
        this.num++;
    }

    slide(vec: YX) {
        this.vec = YX.add(this.vec, vec);
    }
}

import { YX, yx } from "./YX.js";

export class Panel {
    vec: YX;
    num: number;
    popAnimation: boolean;
    growAnimation: boolean;

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

        this.popAnimation = true;
        setTimeout(() => {
            this.popAnimation = false;
        }, 300);

        this.growAnimation = false;
    }

    // get vec() {
    //     return this.#vec;
    // }

    // get num() {
    //     return this.#num;
    // }

    grow() {
        this.num++;
        this.growAnimation = true;
        setTimeout(() => {
            this.growAnimation = false;
        }, 300);
    }

    slide(vec: YX) {
        this.vec = YX.add(this.vec, vec);
    }
}

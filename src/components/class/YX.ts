export class YX {
    y: number;
    x: number;

    constructor(y: number, x: number) {
        this.y = y;
        this.x = x;
    }

    static add(v: YX, w: YX) {
        return yx(v.y + w.y, v.x + w.x);
    }
    static scalar(a: number, v: YX) {
        return yx(a * v.y, a * v.x);
    }
}

export function yx(y: number, x: number) {
    return new YX(y, x);
}

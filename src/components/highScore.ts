export function getHighScore(num: number) {
    return Number(localStorage.getItem("highScore" + num));
}

export function updateHighScore(num: number, score: number) {
    if (score > getHighScore(num)) {
        localStorage.setItem("highScore" + num, String(score));
    }
}

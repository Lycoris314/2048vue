export function getHighScore(num: number) {
    return Number(localStorage.getItem("highScore" + num));
}

export function updateHighScore(num: number, score: number) {
    if (score > getHighScore(num)) {
        localStorage.setItem("highScore" + num, String(score));
    }
}
//ハイスコア表の掲載
export function updateHighScoreTable() {
    R.range(3, 7).forEach((i: number) => {
        //$(".score" + i).text(highScore(i) + "点");
    });
}

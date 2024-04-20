<script setup lang="ts">
const emit = defineEmits(["on-click"]);

</script>

<template>
    <div class="back" @click="emit('on-click')">
        <div class="content" @click.stop="">
            <h2>ルール</h2>
            <p>同じ数字のパネルを合体させて数字を大きくしよう</p>
            <p>目指せ 2048! (サイズ4×4の場合)</p>
            <hr />
            <h2>操作方法</h2>
            <p>※キーボード操作<span class="under">上下左右キー(またはWSADキー)</span>およびフリック操作を受け付けます。</p>

            <p>
                同じパネルが重なると合体して数値が２倍となり、合体した値がスコアに加算されます。クリア後もパネルを動かせなくなるまで続けることができます。
            </p>
            <hr />
            <h2>クリア条件</h2>
            <p>サイズ3×3：256のパネルをつくる</p>
            <p>サイズ4×4：2048のパネルをつくる</p>
            <p>サイズ5×5：8192のパネルをつくる</p>
            <p>サイズ6×6：16384のパネルをつくる</p>
            <hr />
            <h2>パネルの出現率</h2>
            <p>サイズ3×3：2 (90%) 4 (10%)</p>
            <p>サイズ4×4：2 (90%) 4 (10%)</p>
            <p>サイズ5×5：2 (40%) 4 (30%) 8 (20%) 16 (10%)</p>
            <p>
                サイズ6×6：2 (30%) 4 (20%) 8 (20%) 16 (10%) 32 (10%) 64
                (10%)
            </p>
        </div>
    </div>
</template>

<style scoped>
.back {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 100%;
    left: 0;
    background-color: rgb(0, 0, 0, 0.5);
    z-index: 80;
    transition: 0.3s;
    opacity: 0;
}

.back.show {
    top: 0;
    opacity: 1;
}

.content {
    background-color: white;
    width: 80%;
    height: calc(100vh - 60px);
    margin: 30px auto;
    padding: 15px;
    overflow-y: scroll;
}

h2 {
    padding: 10px 0;
}

p {
    line-height: 2;
    font-family: sans-serif;
}

.under {
    text-decoration: underline;
}
</style>
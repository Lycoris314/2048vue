<script setup lang="ts">
import { ref, computed, provide, onMounted } from "vue"
import TheStart from './components/TheStart.vue'
import TheGame from "./components/TheGame.vue"
import RuleBtn from "./components/RuleBtn.vue"
import RuleView from "./components/RuleView.vue"


const startView = ref(true);
const showingRule = ref(false);
const windowWidth = ref(window.innerWidth)
const cellNum = ref(4);
provide("cellNum", cellNum);

const fieldSize = computed(() => Math.min(windowWidth.value * 0.8, 700));
const cellSize = computed(() => (fieldSize.value - (cellNum.value - 1) * 10) / cellNum.value)

provide("cellSize", cellSize);
provide("fieldSize", fieldSize);

const startGame = (size: number) => {

  cellNum.value = size;
  startView.value = false;
}

const backToStart = () => {
  startView.value = true;
}

const toggleRule = () => {
  showingRule.value = !showingRule.value
}

onMounted(() => {
  window.addEventListener("resize", () => {
    windowWidth.value = window.innerWidth
  })
})

</script>

<template>
  <!-- スタート画面 -->
  <TheStart v-if="startView" @on-click="startGame"></TheStart>
  <!-- ゲーム画面 -->
  <TheGame v-else @on-click="backToStart" :showingRule="showingRule"></TheGame>

  <RuleBtn @on-click="toggleRule"></RuleBtn>
  <RuleView :class="{ show: showingRule }" @on-click="toggleRule"></RuleView>

</template>

<style scoped></style>

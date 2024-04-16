<script setup lang="ts">
import { ref } from "vue"
import TheStart from './components/TheStart.vue'
import TheGame from "./components/TheGame.vue"
import RuleBtn from "./components/RuleBtn.vue"
import RuleView from "./components/RuleView.vue"


const startView = ref(true);
const showingRule = ref(false);
const cellNum = ref(4);

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

</script>

<template>

  <TheStart v-if="startView" @on-click="startGame"></TheStart>

  <TheGame v-else @on-click="backToStart" :cellNum="cellNum"></TheGame>

  <RuleBtn @on-click="toggleRule"></RuleBtn>
  <RuleView :class="{ show: showingRule }"></RuleView>

</template>

<style scoped></style>

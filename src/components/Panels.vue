<script setup lang="ts">
import { inject, type Ref } from "vue"
import { Panel } from "./class/panel.ts"

const props = defineProps({ panels: Object, transition: Boolean })

const cellSize = inject("cellSize") as Ref<number>

const panelStyle = (panel: Panel) => {

    return {
        width: `${cellSize.value}px`,
        height: `${cellSize.value}px`,

        top: `${panel.vec.y * (cellSize.value + 10) + 10}px`,
        left: `${panel.vec.x * (cellSize.value + 10) + 10}px`,
        backgroundColor: Panel.COLORS[panel.num > 14 ? 14 : panel.num],

        fontSize: `${1.2 + (cellSize.value - 100) / 100}rem`,
    }
}


</script>

<template>
    <div class="panel" v-for="(panel, index) of props.panels" :key="index" :style="panelStyle(panel)" :class="{
        transition: props.transition,
        popAnimation: panel.popAnimation,
        growAnimation: panel.growAnimation
    }">
        {{ 2 ** (panel.num + 1) }}
    </div>
</template>

<style scoped>
.panel {
    background-color: gray;
    display: grid;
    font-size: 1.5rem;
    place-content: center;
    position: absolute;
}

.transition {
    transition: 0.25s;
}

.popAnimation {
    animation: 0.25s pop;
}

@keyframes pop {
    from {
        scale: 0
    }

    to {
        scale: 1
    }
}

.growAnimation {
    animation: 0.3s grow;
}

@keyframes grow {
    from {
        scale: 1;
    }

    50% {
        scale: 1.2;
    }

    to {
        scale: 1;
    }
}
</style>
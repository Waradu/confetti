<template>
  <div class="container">
    <h1 v-confetti="{ fade: true, fadeSpeed: 4 }">Surprise 🎉</h1>
    <h1 ref="test" @click="burstConfetti">Click me!</h1>
  </div>
</template>

<script lang="ts" setup>
const { $confetti } = useNuxtApp();
const test = useTemplateRef("test");

const burstConfetti = () => test.value && $confetti.burst(test.value, { destroyTarget: true });
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: sans-serif;
  user-select: none;
}


.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 20px;

  * {
    cursor: pointer;
  }
}
</style>

import { defineNuxtPlugin } from "nuxt/app";

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.directive('confetti', {});
});
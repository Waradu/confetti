## Nuxt Confetti

https://github.com/user-attachments/assets/b5281ba8-27ef-40f7-8475-c90a8830008e

## How to use it

```bash
bun install @waradu/confetti
```

```ts
export default defineNuxtConfig({
  modules: ["@waradu/confetti"],
});
```

You now have 2 ways to use it:

### Directive

```vue
<h1 v-confetti>Surprise 🎉</h1>
<h1 v-confetti="{ fade: true }">Surprise 🎉</h1>
<h1 v-confetti.destroy>Surprise 🎉</h1>
<h1 v-confetti.destroy="{ particleCount: 100 }">Surprise 🎉</h1>
```

> [!TIP]  
> You can define defaults in the nuxt.config.ts
> ```ts
> export default defineNuxtConfig({
> modules: ["@waradu/confetti"],
>   confetti: {
>     fade: true,
>   }
> });
> ```

### Plugin

```vue
<template>
  <div>
    <button ref="confetti" @click="burst">Surprise 🎉</button>
  </div>
</template>

<script lang="ts" setup>
const { $confetti } = useNuxtApp();
const confetti = useTemplateRef("confetti");

const burst = () => {
  if (!confetti.value) return;
  $confetti.burst(confetti.value, { destroyTarget: true });
};
</script>
```

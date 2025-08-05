## Nuxt Confetti

## How to use it

```bash
bun install @waradu/confetti
```

```ts
export default defineNuxtConfig({
  modules: ["@waradu/confetti"],
});
```

You now have 2 ways to use confetti.

```html
<h1 v-confetti>Surprise 🎉</h1>
<h1 v-confetti="{ fade: true }">Surprise 🎉</h1>
<h1 v-confetti.destroy>Surprise 🎉</h1>
<h1 v-confetti.destroy="{ particleCount: 100 }">Surprise 🎉</h1>
```

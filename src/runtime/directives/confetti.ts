import type { ConfigOptions } from '../../types';
import type { Directive } from 'vue';
import { useNuxtApp } from 'nuxt/app';

export const vConfetti: Directive<HTMLElement, ConfigOptions, "destroy"> = {
  mounted(el, binding) {
    const { $confetti } = useNuxtApp();
    const cfg = binding.value ?? {};
    cfg.destroyTarget = binding.modifiers.destroy ?? cfg.destroyTarget;
    el.addEventListener('click', () => {
      $confetti.burst(el, cfg);
    });
  },
};

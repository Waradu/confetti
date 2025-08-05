import type { ModuleOptions } from './index';
import type { ConfigOptions } from './types';
import type { vConfetti } from './runtime/directives/confetti';
import type { ConfettiService } from './runtime/plugins/confetti.client';

declare module 'nuxt/schema' {
  interface PublicRuntimeConfig {
    confetti: ModuleOptions;
  }
}

declare module 'vue' {
  interface GlobalDirectives {
    vConfetti: typeof vConfetti;
  }
}

declare module 'nuxt/app' {
  interface NuxtApp {
    $confetti: ConfettiService;
  }
}

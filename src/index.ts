/// <reference path="./types.d.ts" />

import type { ConfigOptions } from "./types";
import { name, version } from '../package.json';
import { defineNuxtModule, createResolver, addPlugin } from "@nuxt/kit";

export interface ModuleOptions extends ConfigOptions {
  enabled: boolean;
}

const defaultOptions: Required<ConfigOptions> & { enabled: boolean; } = {
  enabled: true,
  gravity: 10,
  particleCount: 75,
  particleSize: 1,
  explosionPower: 25,
  destroyTarget: false,
  fade: false,
  fadeSpeed: 1,
};

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: "confetti",
  },
  defaults: defaultOptions,
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    if (!options.enabled) return;

    const resolved: Required<ConfigOptions> & { enabled: boolean; } = {
      ...defaultOptions,
      ...options,
    };

    nuxt.options.runtimeConfig.public.confetti = resolved;

    nuxt.options.build.transpile.push(resolve('runtime'));

    addPlugin({
      src: resolve("runtime/plugins/confetti.client"),
      mode: "client"
    });
    addPlugin({
      src: resolve("runtime/plugins/confetti.server"),
      mode: "server"
    });
  },
});

export interface ConfigOptions {
  /**
   * Gravity strength that pulls particles down.
   * @default 10
   */
  gravity?: number;

  /**
   * How many particles should be spawned in one explosion.
   * @default 75
   */
  particleCount?: number;

  /**
   * Base size multiplier for each particle.
   * @default 1
   */
  particleSize?: number;

  /**
   * Power of the explosion (initial particle velocity).
   * @default 25
   */
  explosionPower?: number;

  /**
   * If true, the target element will be destroyed when confetti triggers.
   * @default false
   */
  destroyTarget?: boolean;

  /**
   * If true, particles will fade out over time.
   * @default false
   */
  fade?: boolean;

  /**
   * Speed at which particles fade out (only used if `fade` is true).
   * @default 1
   */
  fadeSpeed?: number;

  /**
   * z-index value of the canvas element rendering confetti.
   * @default 999999999
   */
  zIndex?: number;
}
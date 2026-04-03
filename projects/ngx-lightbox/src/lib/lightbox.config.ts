import { InjectionToken, makeEnvironmentProviders } from '@angular/core';

export interface LightboxI18n {
  /** aria-label for the close button */
  closeLabel: string;
  /** Hint text shown on desktop (mouse/trackpad) */
  hint: string;
  /** Hint text shown on touch devices */
  hintMobile: string;
}

export interface LightboxConfig {
  /** Show the zoom/pan hint below the image (default: true) */
  showHint: boolean;
  /** Maximum zoom scale (default: 5) */
  maxScale: number;
  /** z-index of the lightbox overlay (default: 1000) */
  zIndex: number;
}

export const LIGHTBOX_I18N = new InjectionToken<LightboxI18n>('LIGHTBOX_I18N', {
  factory: () => ({
    closeLabel: 'Close',
    hint: 'Double-click to zoom · Scroll to adjust · Drag to pan',
    hintMobile: 'Pinch to zoom · Drag to pan',
  }),
});

export const LIGHTBOX_CONFIG = new InjectionToken<LightboxConfig>('LIGHTBOX_CONFIG', {
  factory: () => ({
    showHint: true,
    maxScale: 5,
    zIndex: 1000,
  }),
});

export function provideNgxLightbox(config?: Partial<LightboxConfig>, i18n?: Partial<LightboxI18n>) {
  return makeEnvironmentProviders([
    ...(config
      ? [
          {
            provide: LIGHTBOX_CONFIG,
            useValue: {
              showHint: config.showHint ?? true,
              maxScale: config.maxScale ?? 5,
              zIndex: config.zIndex ?? 1000,
            } satisfies LightboxConfig,
          },
        ]
      : []),
    ...(i18n
      ? [
          {
            provide: LIGHTBOX_I18N,
            useValue: {
              closeLabel: i18n.closeLabel ?? 'Close',
              hint: i18n.hint ?? 'Double-click to zoom · Scroll to adjust · Drag to pan',
              hintMobile: i18n.hintMobile ?? 'Pinch to zoom · Drag to pan',
            } satisfies LightboxI18n,
          },
        ]
      : []),
  ]);
}

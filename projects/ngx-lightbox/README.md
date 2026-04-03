# @necraidan/ngx-lightbox

A lightweight, accessible lightbox component for Angular 21+.  
Zoom, pan, pinch-to-zoom, keyboard navigation — zero external dependencies.

[![npm](https://img.shields.io/npm/v/@necraidan/ngx-lightbox)](https://www.npmjs.com/package/@necraidan/ngx-lightbox)
[![license](https://img.shields.io/badge/license-MIT-blue)](https://github.com/necraidan/ngx-lightbox/blob/main/LICENSE)
[![Angular](https://img.shields.io/badge/Angular-21%2B-DD0031)](https://angular.dev)

## Features

- Standalone component, Signals API
- Double-click or scroll to zoom
- Drag to pan when zoomed
- Pinch-to-zoom on touch devices
- Keyboard navigation (Escape to close)
- i18n — fully customizable labels
- Configurable via `provideNgxLightbox()`
- Zero external dependencies

## Installation

```bash
npm install @necraidan/ngx-lightbox
```

## Basic usage

**app.config.ts**
```ts
import { provideNgxLightbox } from '@necraidan/ngx-lightbox';

export const appConfig: ApplicationConfig = {
  providers: [provideNgxLightbox()],
};
```

**your.component.ts**
```ts
import { LightboxComponent, LightboxService, LightboxImage } from '@necraidan/ngx-lightbox';

@Component({
  imports: [LightboxComponent],
  template: `
    <button (click)="open(img)">Open</button>
    <ngx-lightbox />
  `,
})
export class YourComponent {
  private lightbox = inject(LightboxService);

  open(img: LightboxImage) {
    this.lightbox.openLightbox(img);
  }
}
```

## i18n

```ts
import { provideNgxLightbox } from '@necraidan/ngx-lightbox';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNgxLightbox(
      { showHint: true },
      {
        closeLabel: 'Fermer',
        hint: 'Double-clic pour zoomer · Molette pour ajuster · Glisser pour déplacer',
        hintMobile: 'Pincez pour zoomer · Glisser pour déplacer',
      },
    ),
  ],
};
```

## Advanced

```ts
import { provideNgxLightbox, LightboxConfig, LightboxI18n } from '@necraidan/ngx-lightbox';

const config: Partial<LightboxConfig> = {
  showHint: false, // hide the zoom/pan hint
  maxScale: 8,     // allow up to 8x zoom (default: 5)
  zIndex: 9999,    // overlay z-index (default: 1000)
};

export const appConfig: ApplicationConfig = {
  providers: [provideNgxLightbox(config)],
};
```

CSS custom properties:
```css
:root {
  --ngx-lightbox-radius: 0;      /* image border-radius (default: 0.5rem) */
  --ngx-lightbox-spacing: 1.5rem; /* close button / hint spacing (default: 1rem) */
}
```

## API Reference

### `LightboxConfig`

| Property | Type | Default | Description |
|---|---|---|---|
| `showHint` | `boolean` | `true` | Show the zoom/pan hint |
| `maxScale` | `number` | `5` | Maximum zoom level |
| `zIndex` | `number` | `1000` | Overlay z-index |

### `LightboxI18n`

| Property | Type | Default | Description |
|---|---|---|---|
| `closeLabel` | `string` | `'Close'` | aria-label for the close button |
| `hint` | `string` | `'Double-click to zoom…'` | Hint text on desktop |
| `hintMobile` | `string` | `'Pinch to zoom…'` | Hint text on touch devices |

### `LightboxService`

| Member | Type | Description |
|---|---|---|
| `openLightbox(img)` | `void` | Open the lightbox with the given image |
| `closeLightbox()` | `void` | Close the lightbox |
| `lightboxImage` | `Signal<LightboxImage \| null>` | Currently displayed image |
| `isZoomed` | `Signal<boolean>` | Whether the image is zoomed in |
| `isDragging` | `Signal<boolean>` | Whether the user is dragging |

### `LightboxImage`

| Property | Type | Required | Description |
|---|---|---|---|
| `src` | `string` | yes | Full-size image URL |
| `alt` | `string` | yes | Alt text |
| `width` | `number` | yes | Natural image width |
| `height` | `number` | yes | Natural image height |

## License

MIT

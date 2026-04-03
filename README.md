# @necraidan/ngx-lightbox

A lightweight, accessible lightbox component for Angular 21+.  
Zoom, pan, pinch-to-zoom, keyboard navigation - zero external dependencies.

[![npm](https://img.shields.io/npm/v/@necraidan/ngx-lightbox)](https://www.npmjs.com/package/@necraidan/ngx-lightbox)
[![CI](https://github.com/necraidan/ngx-lightbox/actions/workflows/ci.yml/badge.svg)](https://github.com/necraidan/ngx-lightbox/actions/workflows/ci.yml)
[![license](https://img.shields.io/badge/license-MIT-blue)](https://github.com/necraidan/ngx-lightbox/blob/main/LICENSE)
[![Angular](https://img.shields.io/badge/Angular-21%2B-DD0031)](https://angular.dev)

## Features

- Standalone component, Signals API
- Double-click or scroll to zoom
- Drag to pan when zoomed
- Pinch-to-zoom on touch devices
- Keyboard navigation (Escape to close)
- i18n - fully customizable labels
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
    <button (click)="open(image)">Open</button>
    <ngx-lightbox />
  `,
})
export class YourComponent {
  private lightbox = inject(LightboxService);

  readonly image: LightboxImage = {
    src: 'https://example.com/photo.jpg',
    alt: 'A beautiful photo',
    width: 1200,
    height: 800,
  };

  open(img: LightboxImage): void {
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

## File / Blob

Pass a `File` or `Blob` directly - the lightbox handles `createObjectURL` / `revokeObjectURL` automatically:

```ts
onFileChange(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const img = new Image();
  const src = URL.createObjectURL(file);
  img.onload = () => {
    this.lightbox.openLightbox({
      src: file,              // File/Blob passed directly
      alt: file.name,
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
    URL.revokeObjectURL(src); // only needed for the temp img above
  };
  img.src = src;
}
```

## Advanced

```ts
import { provideNgxLightbox, LightboxConfig, LightboxI18n } from '@necraidan/ngx-lightbox';

const config: Partial<LightboxConfig> = {
  showHint: false, // hide the zoom/pan hint
  maxScale: 8, // allow up to 8x zoom (default: 5)
  zIndex: 9999, // overlay z-index (default: 1000)
};

export const appConfig: ApplicationConfig = {
  providers: [provideNgxLightbox(config)],
};
```

CSS custom properties:

```css
:root {
  --ngx-lightbox-radius: 0; /* image border-radius (default: 0.5rem) */
  --ngx-lightbox-spacing: 1.5rem; /* close button / hint spacing (default: 1rem) */
}
```

## API Reference

### `LightboxConfig`

| Property   | Type      | Default | Description            |
| ---------- | --------- | ------- | ---------------------- |
| `showHint` | `boolean` | `true`  | Show the zoom/pan hint |
| `maxScale` | `number`  | `5`     | Maximum zoom level     |
| `zIndex`   | `number`  | `1000`  | Overlay z-index        |

### `LightboxI18n`

| Property     | Type     | Default                   | Description                     |
| ------------ | -------- | ------------------------- | ------------------------------- |
| `closeLabel` | `string` | `'Close'`                 | aria-label for the close button |
| `hint`       | `string` | `'Double-click to zoom…'` | Hint text on desktop            |
| `hintMobile` | `string` | `'Pinch to zoom…'`        | Hint text on touch devices      |

### `LightboxService`

| Member                                   | Type                            | Description                                                             |
| ---------------------------------------- | ------------------------------- | ----------------------------------------------------------------------- |
| `openLightbox(img: LightboxImage): void` | `void`                          | Open the lightbox with the given image                                  |
| `closeLightbox()`                        | `void`                          | Close the lightbox                                                      |
| `lightboxImage()`                        | `Signal<LightboxImage \| null>` | Currently displayed image                                               |
| `resolvedSrc()`                          | `Signal<string \| null>`        | Resolved URL string - use this to bind `[src]` when `src` may be a Blob |
| `isZoomed()`                             | `Signal<boolean>`               | Whether the image is zoomed in                                          |
| `isDragging()`                           | `Signal<boolean>`               | Whether the user is dragging                                            |

### `LightboxImage`

| Property | Type             | Description                                                                                                                               |
| -------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `src`    | `string \| Blob` | Image source - URL string, blob URL, or a `Blob`/`File` object. The lightbox manages `createObjectURL` / `revokeObjectURL` automatically. |
| `alt`    | `string`         | Accessible description used as the `alt` attribute and `aria-label`.                                                                      |
| `width`  | `number`         | Intrinsic width in pixels, used to preserve the aspect ratio before the image loads.                                                      |
| `height` | `number`         | Intrinsic height in pixels, used to preserve the aspect ratio before the image loads.                                                     |

## License

MIT

## Development

```bash
npm install
npx ng build ngx-lightbox
npx ng serve demo
```

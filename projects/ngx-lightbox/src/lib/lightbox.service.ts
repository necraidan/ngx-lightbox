import { Injectable, Injector, afterNextRender, computed, inject, signal } from '@angular/core';
import { LIGHTBOX_CONFIG } from './lightbox.config';
import { LightboxImage } from './lightbox.types';

const MIN_SCALE = 1;
const ZOOM_STEP = 0.2;
const ZOOM_TOGGLE = 2.5;

@Injectable({ providedIn: 'root' })
export class LightboxService {
  private readonly config = inject(LIGHTBOX_CONFIG);
  private readonly injector = inject(Injector);

  private readonly _lightboxImage = signal<LightboxImage | null>(null);
  private readonly _objectUrl = signal<string | null>(null);

  readonly lightboxImage = this._lightboxImage.asReadonly();

  /** Resolved string URL ready to bind to `[src]`. Handles both string and Blob sources. */
  readonly resolvedSrc = computed<string | null>(() => {
    const img = this._lightboxImage();
    if (!img) {
      return null;
    }
    return img.src instanceof Blob ? this._objectUrl() : img.src;
  });

  private readonly _scale = signal(1);
  private readonly _tx = signal(0);
  private readonly _ty = signal(0);
  readonly isDragging = signal(false);

  readonly isZoomed = computed(() => this._scale() > 1);

  readonly imageTransform = computed(() => {
    const s = this._scale();
    const tx = this._tx();
    const ty = this._ty();
    return s === 1 && tx === 0 && ty === 0 ? 'none' : `translate(${tx}px, ${ty}px) scale(${s})`;
  });

  private _dragLastX = 0;
  private _dragLastY = 0;

  private readonly _activePointers = new Map<number, { x: number; y: number }>();
  private _pinchStartDistance = 0;
  private _pinchStartScale = 1;

  openLightbox(img: LightboxImage): void {
    this._revokeObjectUrl();
    if (img.src instanceof Blob) {
      this._objectUrl.set(URL.createObjectURL(img.src));
    }
    this._lightboxImage.set(img);
    this._resetZoom();
    afterNextRender(() => document.querySelector<HTMLElement>('.ngx-lightbox')?.focus(), {
      injector: this.injector,
    });
  }

  closeLightbox(): void {
    this._revokeObjectUrl();
    this._lightboxImage.set(null);
    this._resetZoom();
  }

  toggleZoom(): void {
    if (this._scale() > 1) {
      this._resetZoom();
    } else {
      this._scale.set(ZOOM_TOGGLE);
    }
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const delta = event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
    const newScale = Math.min(Math.max(this._scale() + delta, MIN_SCALE), this.config.maxScale);
    this._scale.set(newScale);
    if (newScale === MIN_SCALE) {
      this._tx.set(0);
      this._ty.set(0);
    }
  }

  startDrag(event: PointerEvent): void {
    this._activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    (event.target as HTMLElement).setPointerCapture(event.pointerId);

    if (this._activePointers.size === 2) {
      this.isDragging.set(false);
      const [p1, p2] = [...this._activePointers.values()];
      this._pinchStartDistance = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      this._pinchStartScale = this._scale();
      return;
    }

    if (!this.isZoomed()) {
      return;
    }
    event.preventDefault();
    this.isDragging.set(true);
    this._dragLastX = event.clientX;
    this._dragLastY = event.clientY;
  }

  onDrag(event: PointerEvent): void {
    if (!this._activePointers.has(event.pointerId)) {
      return;
    }
    this._activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (this._activePointers.size === 2) {
      const [p1, p2] = [...this._activePointers.values()];
      const distance = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      if (this._pinchStartDistance === 0) {
        return;
      }
      const newScale = Math.min(
        Math.max(this._pinchStartScale * (distance / this._pinchStartDistance), MIN_SCALE),
        this.config.maxScale,
      );
      this._scale.set(newScale);
      if (newScale === MIN_SCALE) {
        this._tx.set(0);
        this._ty.set(0);
      }
      return;
    }

    if (!this.isDragging()) {
      return;
    }
    const dx = event.clientX - this._dragLastX;
    const dy = event.clientY - this._dragLastY;
    this._dragLastX = event.clientX;
    this._dragLastY = event.clientY;
    this._tx.update((v) => v + dx);
    this._ty.update((v) => v + dy);
  }

  endDrag(event: PointerEvent): void {
    this._activePointers.delete(event.pointerId);
    this.isDragging.set(false);
  }

  private _revokeObjectUrl(): void {
    const url = this._objectUrl();
    if (url) {
      URL.revokeObjectURL(url);
      this._objectUrl.set(null);
    }
  }

  private _resetZoom(): void {
    this._scale.set(1);
    this._tx.set(0);
    this._ty.set(0);
    this.isDragging.set(false);
    this._activePointers.clear();
  }
}

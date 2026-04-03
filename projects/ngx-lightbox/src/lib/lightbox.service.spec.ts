import { TestBed } from '@angular/core/testing';
import { LightboxService } from './lightbox.service';
import { LightboxImage } from './lightbox.types';

const IMAGE: LightboxImage = { src: '/img.jpg', alt: 'Test image', width: 800, height: 600 };

function makePointerEvent(pointerId: number, x: number, y: number): PointerEvent {
  const target = document.createElement('div');
  target.setPointerCapture = vi.fn();
  const event = new PointerEvent('pointerdown', { pointerId, clientX: x, clientY: y });
  Object.defineProperty(event, 'target', { value: target, configurable: true });
  return event;
}

describe('LightboxService', () => {
  let service: LightboxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LightboxService);
  });

  describe('openLightbox', () => {
    it('sets lightboxImage', () => {
      service.openLightbox(IMAGE);
      expect(service.lightboxImage()).toEqual(IMAGE);
    });

    it('resets zoom state', () => {
      service.openLightbox(IMAGE);
      service.toggleZoom();
      service.openLightbox(IMAGE);
      expect(service.isZoomed()).toBe(false);
      expect(service.imageTransform()).toBe('none');
    });
  });

  describe('closeLightbox', () => {
    it('clears lightboxImage', () => {
      service.openLightbox(IMAGE);
      service.closeLightbox();
      expect(service.lightboxImage()).toBeNull();
    });

    it('resets zoom state', () => {
      service.openLightbox(IMAGE);
      service.toggleZoom();
      service.closeLightbox();
      expect(service.isZoomed()).toBe(false);
      expect(service.imageTransform()).toBe('none');
    });
  });

  describe('toggleZoom', () => {
    it('zooms in from scale 1', () => {
      service.openLightbox(IMAGE);
      service.toggleZoom();
      expect(service.isZoomed()).toBe(true);
    });

    it('resets zoom when already zoomed', () => {
      service.openLightbox(IMAGE);
      service.toggleZoom();
      service.toggleZoom();
      expect(service.isZoomed()).toBe(false);
      expect(service.imageTransform()).toBe('none');
    });
  });

  describe('imageTransform', () => {
    it('returns "none" at default state', () => {
      expect(service.imageTransform()).toBe('none');
    });

    it('returns transform string when zoomed', () => {
      service.openLightbox(IMAGE);
      service.toggleZoom();
      expect(service.imageTransform()).toMatch(/translate\(0px, 0px\) scale\(2\.5\)/);
    });
  });

  describe('resolvedSrc', () => {
    it('returns null when no image is open', () => {
      expect(service.resolvedSrc()).toBeNull();
    });

    it('returns the string src directly', () => {
      service.openLightbox(IMAGE);
      expect(service.resolvedSrc()).toBe('/img.jpg');
    });

    it('returns a blob URL when src is a Blob', () => {
      const blob = new Blob([''], { type: 'image/png' });
      vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
      service.openLightbox({ src: blob, alt: 'Blob image', width: 100, height: 100 });
      expect(service.resolvedSrc()).toBe('blob:mock-url');
      vi.restoreAllMocks();
    });

    it('revokes object URL on close', () => {
      const blob = new Blob([''], { type: 'image/png' });
      vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
      const revokeSpy = vi.spyOn(URL, 'revokeObjectURL');
      service.openLightbox({ src: blob, alt: 'Blob image', width: 100, height: 100 });
      service.closeLightbox();
      expect(revokeSpy).toHaveBeenCalledWith('blob:mock-url');
      expect(service.resolvedSrc()).toBeNull();
      vi.restoreAllMocks();
    });

    it('revokes previous object URL when opening a new image', () => {
      const blob = new Blob([''], { type: 'image/png' });
      vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
      const revokeSpy = vi.spyOn(URL, 'revokeObjectURL');
      service.openLightbox({ src: blob, alt: 'Blob image', width: 100, height: 100 });
      service.openLightbox(IMAGE);
      expect(revokeSpy).toHaveBeenCalledWith('blob:mock-url');
      vi.restoreAllMocks();
    });
  });

  describe('onWheel', () => {
    beforeEach(() => service.openLightbox(IMAGE));

    it('zooms in on scroll up (negative deltaY)', () => {
      const up = new WheelEvent('wheel', { deltaY: -1, cancelable: true });
      service.onWheel(up);
      expect(service.isZoomed()).toBe(true);
    });

    it('does not go below MIN_SCALE', () => {
      const down = new WheelEvent('wheel', { deltaY: 1, cancelable: true });
      service.onWheel(down);
      expect(service.imageTransform()).toBe('none');
    });

    it('does not exceed maxScale (default 5)', () => {
      const up = new WheelEvent('wheel', { deltaY: -1, cancelable: true });
      for (let i = 0; i < 30; i++) service.onWheel(up);
      expect(service.imageTransform()).toContain('scale(5)');
    });

    it('resets translation when scale returns to MIN_SCALE', () => {
      const up = new WheelEvent('wheel', { deltaY: -1, cancelable: true });
      service.onWheel(up);
      const down = new WheelEvent('wheel', { deltaY: 1, cancelable: true });
      for (let i = 0; i < 5; i++) service.onWheel(down);
      expect(service.imageTransform()).toBe('none');
    });
  });

  describe('drag', () => {
    beforeEach(() => {
      service.openLightbox(IMAGE);
      service.toggleZoom();
    });

    it('starts dragging when zoomed', () => {
      service.startDrag(makePointerEvent(1, 100, 100));
      expect(service.isDragging()).toBe(true);
    });

    it('does not start dragging when not zoomed', () => {
      service.toggleZoom();
      service.startDrag(makePointerEvent(1, 100, 100));
      expect(service.isDragging()).toBe(false);
    });

    it('translates image on drag', () => {
      service.startDrag(makePointerEvent(1, 100, 100));
      const move = new PointerEvent('pointermove', { pointerId: 1, clientX: 150, clientY: 120 });
      service.onDrag(move);
      expect(service.imageTransform()).toContain('translate(50px, 20px)');
    });

    it('stops dragging on endDrag', () => {
      service.startDrag(makePointerEvent(1, 100, 100));
      service.endDrag(new PointerEvent('pointerup', { pointerId: 1 }));
      expect(service.isDragging()).toBe(false);
    });

    it('ignores onDrag for unknown pointerId', () => {
      const move = new PointerEvent('pointermove', { pointerId: 99, clientX: 999, clientY: 999 });
      service.onDrag(move);
      expect(service.imageTransform()).toMatch(/scale\(2\.5\)/);
    });
  });

  describe('pinch', () => {
    beforeEach(() => service.openLightbox(IMAGE));

    it('zooms in when fingers spread apart', () => {
      service.startDrag(makePointerEvent(1, 0, 0));
      service.startDrag(makePointerEvent(2, 100, 0));
      service.onDrag(new PointerEvent('pointermove', { pointerId: 1, clientX: 0, clientY: 0 }));
      service.onDrag(new PointerEvent('pointermove', { pointerId: 2, clientX: 200, clientY: 0 }));
      expect(service.isZoomed()).toBe(true);
    });

    it('does not start single-finger drag during pinch', () => {
      service.startDrag(makePointerEvent(1, 0, 0));
      service.startDrag(makePointerEvent(2, 100, 0));
      expect(service.isDragging()).toBe(false);
    });
  });
});

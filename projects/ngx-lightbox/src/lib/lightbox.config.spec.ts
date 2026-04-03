import { TestBed } from '@angular/core/testing';
import { LIGHTBOX_CONFIG, LIGHTBOX_I18N, provideNgxLightbox } from './lightbox.config';

describe('LIGHTBOX_CONFIG default', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('provides showHint: true', () => {
    expect(TestBed.inject(LIGHTBOX_CONFIG).showHint).toBe(true);
  });

  it('provides maxScale: 5', () => {
    expect(TestBed.inject(LIGHTBOX_CONFIG).maxScale).toBe(5);
  });

  it('provides zIndex: 1000', () => {
    expect(TestBed.inject(LIGHTBOX_CONFIG).zIndex).toBe(1000);
  });
});

describe('LIGHTBOX_I18N default', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('provides closeLabel: "Close"', () => {
    expect(TestBed.inject(LIGHTBOX_I18N).closeLabel).toBe('Close');
  });

  it('provides desktop hint', () => {
    expect(TestBed.inject(LIGHTBOX_I18N).hint).toContain('Double-click');
  });

  it('provides mobile hint', () => {
    expect(TestBed.inject(LIGHTBOX_I18N).hintMobile).toContain('Pinch');
  });
});

describe('provideNgxLightbox', () => {
  it('uses all defaults when called with no arguments', () => {
    TestBed.configureTestingModule({ providers: [provideNgxLightbox()] });
    const config = TestBed.inject(LIGHTBOX_CONFIG);
    expect(config.showHint).toBe(true);
    expect(config.maxScale).toBe(5);
    expect(config.zIndex).toBe(1000);
  });

  it('merges partial config and keeps unspecified defaults', () => {
    TestBed.configureTestingModule({ providers: [provideNgxLightbox({ maxScale: 10, zIndex: 2000 })] });
    const config = TestBed.inject(LIGHTBOX_CONFIG);
    expect(config.maxScale).toBe(10);
    expect(config.zIndex).toBe(2000);
    expect(config.showHint).toBe(true);
  });

  it('merges partial i18n and keeps unspecified defaults', () => {
    TestBed.configureTestingModule({ providers: [provideNgxLightbox(undefined, { closeLabel: 'Fermer' })] });
    const i18n = TestBed.inject(LIGHTBOX_I18N);
    expect(i18n.closeLabel).toBe('Fermer');
    expect(i18n.hint).toContain('Double-click');
    expect(i18n.hintMobile).toContain('Pinch');
  });

  it('can override all config fields', () => {
    TestBed.configureTestingModule({
      providers: [provideNgxLightbox({ showHint: false, maxScale: 3, zIndex: 500 })],
    });
    const config = TestBed.inject(LIGHTBOX_CONFIG);
    expect(config.showHint).toBe(false);
    expect(config.maxScale).toBe(3);
    expect(config.zIndex).toBe(500);
  });
});

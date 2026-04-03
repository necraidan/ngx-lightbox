import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LightboxComponent } from './lightbox.component';
import { LightboxService } from './lightbox.service';
import { provideNgxLightbox } from './lightbox.config';

const IMAGE = { src: '/img.jpg', alt: 'Test image', width: 800, height: 600 };

describe('LightboxComponent', () => {
  let fixture: ComponentFixture<LightboxComponent>;
  let service: LightboxService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LightboxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LightboxComponent);
    service = TestBed.inject(LightboxService);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders no overlay when no image is open', () => {
    expect(fixture.nativeElement.querySelector('.ngx-lightbox')).toBeNull();
  });

  it('renders overlay when an image is open', () => {
    service.openLightbox(IMAGE);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.ngx-lightbox')).not.toBeNull();
  });

  it('binds image src and alt', () => {
    service.openLightbox(IMAGE);
    fixture.detectChanges();
    const img: HTMLImageElement = fixture.nativeElement.querySelector('.ngx-lightbox__img');
    expect(img.getAttribute('src')).toBe('/img.jpg');
    expect(img.alt).toBe('Test image');
  });

  it('shows hints by default', () => {
    service.openLightbox(IMAGE);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.ngx-lightbox__hint')).not.toBeNull();
  });

  it('close button has aria-label from i18n', () => {
    service.openLightbox(IMAGE);
    fixture.detectChanges();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.ngx-lightbox__close');
    expect(btn.getAttribute('aria-label')).toBe('Close');
  });

  it('overlay has role="dialog" and aria-modal', () => {
    service.openLightbox(IMAGE);
    fixture.detectChanges();
    const overlay: HTMLElement = fixture.nativeElement.querySelector('.ngx-lightbox');
    expect(overlay.getAttribute('role')).toBe('dialog');
    expect(overlay.getAttribute('aria-modal')).toBe('true');
  });

  it('clicking overlay closes lightbox', () => {
    service.openLightbox(IMAGE);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.ngx-lightbox').click();
    fixture.detectChanges();
    expect(service.lightboxImage()).toBeNull();
  });
});

describe('LightboxComponent with showHint: false', () => {
  let fixture: ComponentFixture<LightboxComponent>;
  let service: LightboxService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LightboxComponent],
      providers: [provideNgxLightbox({ showHint: false })],
    }).compileComponents();

    fixture = TestBed.createComponent(LightboxComponent);
    service = TestBed.inject(LightboxService);
    fixture.detectChanges();
  });

  it('hides hints when showHint is false', () => {
    service.openLightbox(IMAGE);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.ngx-lightbox__hint')).toBeNull();
  });
});

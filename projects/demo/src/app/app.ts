import { Component, inject, signal } from '@angular/core';
import { LightboxComponent, LightboxImage, LightboxService } from '@necraidan/ngx-lightbox';

const IMAGES: LightboxImage[] = [
  { src: 'https://picsum.photos/id/10/1200/800', alt: 'Forest path', width: 1200, height: 800 },
  { src: 'https://picsum.photos/id/15/1200/800', alt: 'Coffee cup', width: 1200, height: 800 },
  { src: 'https://picsum.photos/id/29/1200/800', alt: 'Mountain lake', width: 1200, height: 800 },
  { src: 'https://picsum.photos/id/37/1200/800', alt: 'Desert rocks', width: 1200, height: 800 },
  { src: 'https://picsum.photos/id/48/1200/800', alt: 'Sunset bridge', width: 1200, height: 800 },
  { src: 'https://picsum.photos/id/67/1200/800', alt: 'Snowy forest', width: 1200, height: 800 },
  { src: 'https://picsum.photos/id/76/1200/800', alt: 'City lights', width: 1200, height: 800 },
  { src: 'https://picsum.photos/id/83/1200/800', alt: 'Sandy beach', width: 1200, height: 800 },
  { src: 'https://picsum.photos/id/96/1200/800', alt: 'Autumn leaves', width: 1200, height: 800 },
];

type Tab = 'basic' | 'i18n' | 'advanced' | 'blob';

@Component({
  selector: 'app-root',
  imports: [LightboxComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly lightbox = inject(LightboxService);
  protected readonly images = IMAGES;
  protected readonly activeTab = signal<Tab>('basic');

  protected setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  protected open(img: LightboxImage): void {
    this.lightbox.openLightbox(img);
  }
}

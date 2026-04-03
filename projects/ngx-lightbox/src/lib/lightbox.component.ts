import { Component, inject } from '@angular/core';
import { LIGHTBOX_CONFIG, LIGHTBOX_I18N } from './lightbox.config';
import { LightboxService } from './lightbox.service';

@Component({
  selector: 'ngx-lightbox',
  templateUrl: './lightbox.component.html',
  styleUrl: './lightbox.component.scss',
})
export class LightboxComponent {
  protected readonly lightbox = inject(LightboxService);
  protected readonly i18n = inject(LIGHTBOX_I18N);
  protected readonly config = inject(LIGHTBOX_CONFIG);
}

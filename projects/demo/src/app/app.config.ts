import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideNgxLightbox } from '@necraidan/ngx-lightbox';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideNgxLightbox()],
};

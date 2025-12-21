import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { routes } from './app.routes';
import { errorHandlerInterceptor } from './services/error-handler.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorHandlerInterceptor])),
    provideEnvironmentNgxMask()
  ]
};

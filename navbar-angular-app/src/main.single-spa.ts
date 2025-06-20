import { enableProdMode, importProvidersFrom, NgZone } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import {
  singleSpaAngular,
  getSingleSpaExtraProviders,
} from 'single-spa-angular';
import { singleSpaPropsSubject } from './single-spa/single-spa-props';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { appConfig } from './app/app.config';
import { AppRoutingModule } from './app/app-routing.module';


if (environment.production) {
  enableProdMode();
}

const lifecycles = singleSpaAngular({
  bootstrapFunction: (singleSpaProps) => {
    singleSpaPropsSubject.next(singleSpaProps);
    return bootstrapApplication(AppComponent, {
      providers: [
        importProvidersFrom(AppRoutingModule),
        getSingleSpaExtraProviders(),
        ...appConfig.providers,
      ],
    });
  },
  template: '<navbar-angular-app/>',
  Router,
  NavigationStart,
  NgZone,
});

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;

import { registerApplication, start } from 'single-spa';

registerApplication({
  name: 'angular-app-1',
  app: () => System.import('main-angular-app-1'),
  activeWhen: ['/app1'],
});

// registerApplication({
//   name: 'angular-app-2',
//   app: () => System.import('angular-app-2'),
//   activeWhen: ['/app2'],
// });

start();
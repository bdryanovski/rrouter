import { RRouter } from '../../../src/internal/RRouter.js';

export class Application extends RRouter {
  public routes = [
    {
      path: '/',
      root: true,
      component: 'demo-home',
    },
    {
      path: '/about',
      component: 'demo-about',
    },
    {
      path: '/about/:id',
      component: 'demo-about',
    },
    {
      path: '*',
      component: 'demo-not-found',
    },
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-application': Application;
  }
}

window.customElements.define('demo-application', Application);

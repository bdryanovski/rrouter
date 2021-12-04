import { Route } from '../types.js';
import { match } from './utils.js';

/**
 * Extends HTMLElement we don't require any complex structure at the moment
 * so basic HTMLElement is enough.
 */
export class RRouter extends HTMLElement {
  /* List of routes */
  public routes: Route[] = [];

  public basePath: string = '/';

  public hashbang: boolean = true;

  private activeRoute?: Route;

  /**
   * Store after callback, in the case that we need to use it later
   */
  private afterCallback?: () => boolean = () => true;

  /**
   * Use the constructor to register the event listener and be ready
   * to handle events as soon as possible.
   */
  constructor() {
    super();

    // @ts-ignore
    window.addEventListener('router:navigate', this._handleNavigationRequest);
    // @ts-ignore
    window.addEventListener('popstate', this._handlePopstateChanges);
  }

  connectedCallback(): void {
    /**
     * In the case when no root is set try to navigate to
     * patname or just normal | (pipe)
     */
    this._navigate(window.location.hash.replace('#', '') || this.basePath);
  }

  /**
   * Cleanup after the router is removed from the DOM.
   */
  disconnectedCallback(): void {
    // @ts-ignore
    window.removeEventListener(
      'router:navigate',
      this._handleNavigationRequest
    );
    window.removeEventListener('popstate', this._handlePopstateChanges);
  }

  _handlePopstateChanges = (): void => {
    this._navigate(window.location.hash.replace('#', ''));
  };

  /**
   * Handle navigation request from outside world.
   *
   * @param eventData {Object}
   */
  _handleNavigationRequest = (eventData: CustomEvent): void => {
    this._navigate(eventData.detail.route);
  };

  /**
   * Navigate to the given route. This method must stay private and not be
   * call from outside.
   *
   * @param url {string} - url to navigate to
   */
  private _navigate(url: string) {
    const matchedRoute = match(this.routes, url);

    // update active route if there is a match
    if (matchedRoute !== null) {
      this.activeRoute = matchedRoute;
      // @ts-ignore
      window.history.pushState(null, null, `#${url}`);

      /**
       * Broadcast event to outside world to notify that the route has been
       * changed.
       */
      this.dispatchEvent(
        new CustomEvent('router:change', {
          bubbles: true,
          detail: {
            route: this.activeRoute,
          },
        })
      );

      this._render();
    }
  }

  /**
   * Render the current route.
   */
  private _render() {
    const {
      component,
      params = {},
      before = () => true,
      after = () => true,
    } = this.activeRoute || {};

    const outlet = this.querySelector('r-outlet');

    if (outlet) {
      if (component) {
        if (this.afterCallback && typeof this.afterCallback === 'function') {
          this.afterCallback();
        }

        const canContinue = before();

        if (canContinue === false || canContinue === null) {
          return;
        }

        // Store after after callback for later.
        this.afterCallback = after;

        // Remove all child nodes under outlet element
        while (outlet.firstChild) {
          outlet.removeChild(outlet.firstChild);
        }

        const view = document.createElement(component);
        // eslint-disable-next-line no-restricted-syntax
        for (const key in params) {
          /**
           * all dynamic param value will be passed
           * as the attribute to the newly created element
           * except * value.
           */
          if (key !== '*') view.setAttribute(key, params[key]);
        }

        outlet.appendChild(view);
      }
    }
  }
}


import { Route } from '../types.js';
import { match } from './utils.js';

/**
 * History class and implementation
 */
import { BrowserHistory, parsePath, Path } from './history.js'

/**
 * Extends HTMLElement we don't require any complex structure at the moment
 * so basic HTMLElement is enough.
 */
export class RRouter extends HTMLElement {
  /* List of routes */
  public routes: Route[] = [];

  public history: BrowserHistory;

  private activeRoute?: Route;

  private unlisten: () => void;

  /**
   * Take in mind the base URL if provided
   * @return string
   */
  private get base(): string {
    // To not make more if's that I wanted, i'm just stubing the method that I require to get
    // the information that I need
    return (document.querySelector('base') || { getAttribute: () => '/'}).getAttribute('href');
  }

  connectedCallback(): void {
    /**
     * Handle calls from outside and navigate to somewhere else
     */
    window.addEventListener('router:navigate', this._handleNavigationRequest);

    /**
     * Listen for changes from outside like url changes and more
     */
    this.unlisten = this.history.listen(({ location }) => {
      this._navigate(location)
    });

    // Initial route
    this._navigate(this.history.location)
  }

  /**
   * Cleanup after the router is removed from the DOM.
   * @return void
   */
  disconnectedCallback(): void {
    window.removeEventListener('router:navigate', this._handleNavigationRequest);
    this.unlisten();
  }

  /**
   * Handle navigation request from outside world.
   *
   * @param eventData {Object}
   * @return  void
   */
  _handleNavigationRequest = (eventData: CustomEvent): void => {
    // Parsing url is the only thing that we need here
    this._navigate(parsePath(eventData.detail.route));
  };

  /**
   * Calculate and address the base URL if provided
   *
   * @param url Path
   * @return Path
   */
  private calculateUrl(url: Partial<Path>): Partial<Path> {

    let virtualUrl = url.pathname.replace(this.base, '')

    // When we hit the case when there is nothing left - fallback to empty '/'
    if (virtualUrl === '') {
      virtualUrl = '/'
    }

    return {
      pathname: virtualUrl,
      hash: url.hash,
      search: url.search
    }
  }

  /**
   * Navigate to the given route. This method must stay private and not be
   * call from outside.
   *
   * @param url {string} - url to navigate to
   * @return void
   */
  private _navigate(url: Partial<Path>): void {

    const virtual = this.calculateUrl(url);

    const matchedRoute = match(this.routes, virtual.pathname);

    // update active route if there is a match
    if (matchedRoute !== null) {
      this.activeRoute = matchedRoute;
      this.activeRoute.request = virtual;

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
   *
   * @return void
   */
  private _render(): void {
    const {
      component,
      params = {},
      request = {},
      before = () => true,
      after = () => true,
    } = this.activeRoute || {};

    const outlet = this.querySelector('r-outlet');

    if (outlet) {
      if (component) {
        const canContinue = (before && typeof before === 'function') ? before() : () => { return true };

        /**
         * If before hook return false prevent the transition
         */
        if (canContinue === false || canContinue === null) {
          return;
        }
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

        if (request && request.search) {
          view.setAttribute('rRouterQuerySearch', request.search)
        }

        outlet.appendChild(view);

        /**
         * Call after callback and pass the activeRoute object
         */
        if (after && typeof after === 'function') {
          after({ route: this.activeRoute });
        }
      }
    }
  }
}


import { Route } from '../types.js';
import { match } from './utils.js';

/**
 * History class and implementation
 */
import { BrowserHistory, createBrowserHistory, parsePath, Path } from './history.js'

/**
 * Extends HTMLElement we don't require any complex structure at the moment
 * so basic HTMLElement is enough.
 */
export class RRouter extends HTMLElement {
  /* List of routes */
  public routes: Route[] = [];

  private activeRoute?: Route;

  private history: BrowserHistory = createBrowserHistory();
  private unlisten: () => void;

  /**
   * Use the constructor to register the event listener and be ready
   * to handle events as soon as possible.
   */
  constructor() {
    super();

    /**
     * Handle calls from outside and navigate to somewhere else
     */
    // @ts-ignore
    window.addEventListener('router:navigate', this._handleNavigationRequest);

    /**
     * Listen for changes from outside like url changes and more
     */
    this.unlisten = this.history.listen(({ location }) => {
      this._navigate(location)
    });

  }

  connectedCallback(): void {
    /**
     * Initial tick to load the history and run it.
     */
    this.history.go(0)
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
    this.unlisten();
  }

  /**
   * Handle navigation request from outside world.
   *
   * @param eventData {Object}
   */
  _handleNavigationRequest = (eventData: CustomEvent): void => {
    this._navigate(parsePath(eventData.detail.route));
  };

  /**
   * Navigate to the given route. This method must stay private and not be
   * call from outside.
   *
   * @param url {string} - url to navigate to
   */
  private _navigate(url: Partial<Path>) {
    const matchedRoute = match(this.routes, (url.hash || url.pathname).replace('#', ''));

    // update active route if there is a match
    if (matchedRoute !== null) {
      this.activeRoute = matchedRoute;
      this.activeRoute.request = url;

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
      request = {},
      before = () => true,
      after = () => true,
    } = this.activeRoute || {};

    const outlet = this.querySelector('r-outlet');

    if (outlet) {
      if (component) {
        const canContinue = (before && typeof before === 'function') ? before() : () => { return true };

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

        if (after && typeof after === 'function') {
          after({ route: this.activeRoute });
        }
      }
    }
  }
}

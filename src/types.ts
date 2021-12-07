/**
 * Define a single route and arguments for it
 */

import { Path } from './internal/history.js'

export type Route = {
  /**
   * Pathname
   */
  path: string;
  /**
   * Params to be innjected into the component
   */
  params?: { [key: string]: string };
  /*
   * Component name to load
   */
  component?: any;
  /**
   * Information related to the request that is made like pathname, hash and query params
   */
  request?: Partial<Path>;
  /**
   * Before component is inserted
   */
  before?: () => boolean;
  /*
   * After the component is inserted
   */
  after?: ({ route: Route }) => boolean;
};

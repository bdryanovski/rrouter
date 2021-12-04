/**
 * Define a single route and arguments for it
 */

export type Route = {
  path: string;
  params?: { [key: string]: string };
  component?: any;
  before?: () => boolean;
  after?: () => boolean;
};

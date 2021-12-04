export function segmentize(uri: string) {
  return uri.replace(/(^\/+|\/+$)/g, '').split('/');
}

const NOT_FOUND = {
  path: '/404',
  component: 'NotFound',
  params: {},
};

function isRootRoute(route: String): boolean {
  return route === '' || route === '/';
}

export function match2(routes: Record<string, any>[], testRoute: String): any {
  if (isRootRoute(testRoute)) {
    const root = routes.find(route => isRootRoute(route.path));
    if (root) {
      return {
        ...root,
        params: {},
      };
    }
    // else continue below...
  }

  const found = routes.find(
    route =>
      // @ts-ignore
      route.path === testRoute
  );

  if (found) {
    return { ...found, params: { id: '123' } };
  }

  return NOT_FOUND;
}

/**
 * The url matching function. Pass the route definitions and url to the match
 * and the method will return the matched definition or null if there is no
 * fallback scnario found is the definisions.
 *
 * Code is extracted from Reach router path match implementation
 * https://github.com/reach/router/blob/master/src/lib/utils.js
 *
 * @param {Array} routes - Route defenitions
 * @param {string} uri - Url to match
 */
export function match(routes: any, uri: any) {
  let _match;
  const [uriPathname] = uri.split('?');
  const uriSegments = segmentize(uriPathname);
  const isRootUri = uriSegments[0] === '/';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const routeSegments = segmentize(route.path);
    const max = Math.max(uriSegments.length, routeSegments.length);
    let index = 0;
    let missed = false;
    const params: any = {};
    // eslint-disable-next-line no-plusplus
    for (; index < max; index++) {
      const uriSegment = uriSegments[index];
      const routeSegment = routeSegments[index];

      if (routeSegment === '*') {
        params['*'] = uriSegments
          .slice(index)
          .map(decodeURIComponent)
          .join('/');
        break;
      }

      if (uriSegment === undefined) {
        missed = true;
        break;
      }

      const paramRe = /^:(.+)/;

      const dynamicMatch = paramRe.exec(routeSegment);

      if (dynamicMatch && !isRootUri) {
        const value = decodeURIComponent(uriSegment);
        params[dynamicMatch[1]] = value;
      } else if (routeSegment !== uriSegment) {
        missed = true;
        break;
      }
    }

    if (!missed) {
      _match = {
        params,
        ...route,
      };
      break;
    }
  }

  return _match || null;
}

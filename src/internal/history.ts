
export enum Action {
  Pop = 'POP',
  Push = 'PUSH',
  Replace = 'REPLACE'
}
export type Pathname = string;
export type Search = string;
export type Hash = string;
export type State = object | null;
export type Key = string;
export interface Path {
  pathname: Pathname;
  search: Search;
  hash: Hash;
}
export interface Location extends Path {
  state: any;
  key: Key;
}
export type PartialPath = Partial<Path>
export interface Update {
  action: Action;
  location: Location;
}
export interface Listener {
  (update: Update): void;
}
export type To = string | PartialPath;
export interface BrowserHistory {
  readonly action: Action;
  readonly location: Location;
  createHref(to: To): string;
  push(to: To, state?: any): void;
  replace(to: To, state?: any): void;
  go(delta: number): void;
  back(): void;
  forward(): void;
  listen(listener: Listener): () => void;
}
const readOnly: <T extends unknown>(obj: T) => T = (obj) => Object.freeze(obj);

type HistoryState = {
  usr: any;
  key?: string;
  idx: number;
};

const PopStateEventType = 'popstate';

export function createBrowserHistory(options: any = {}): BrowserHistory {

  let { window = document.defaultView} = options;
  let globalHistory = window.history;

  function getIndexAndLocation(): [number, Location] {
    let { pathname, search, hash } = window.location;
    let state = globalHistory.state || {};
    return [
      state.idx,
      readOnly<Location>({
        pathname,
        search,
        hash,
        state: state.usr || null,
        key: state.key || 'default'
      })
    ];
  }

  function handlePop() {
    let nextAction = Action.Pop;
    applyTx(nextAction);
  }


  window.addEventListener(PopStateEventType, handlePop);

  let action = Action.Pop;
  let [index, location] = getIndexAndLocation();
  let listeners = createEvents<Listener>();

  if (index == null) {
    index = 0;
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, '');
  }

  function createHref(to: To) {
    return typeof to === 'string' ? to : createPath(to);
  }

  function getNextLocation(to: To, state: any = null): Location {
    return readOnly<Location>({
      pathname: location.pathname,
      hash: '',
      search: '',
      ...(typeof to === 'string' ? parsePath(to) : to),
      state,
      key: createKey()
    });
  }

  function getHistoryStateAndUrl(
    nextLocation: Location,
    index: number
  ): [HistoryState, string] {
    return [
      {
        usr: nextLocation.state,
        key: nextLocation.key,
        idx: index
      },
      createHref(nextLocation)
    ];
  }

  function applyTx(nextAction: Action) {
    action = nextAction;
    [index, location] = getIndexAndLocation();
    listeners.call({ action, location });
  }

  function push(to: To, state?: any) {
    let nextAction = Action.Push;
    let nextLocation = getNextLocation(to, state);
    let [historyState, url] = getHistoryStateAndUrl(nextLocation, index + 1);

    // TODO: Support forced reloading
    // try...catch because iOS limits us to 100 pushState calls :/
    try {
      globalHistory.pushState(historyState, '', url);
    } catch (error) {
      // They are going to lose state here, but there is no real
      // way to warn them about it since the page will refresh...
      window.location.assign(url);
    }

    applyTx(nextAction);
  }

  function replace(to: To, state?: any) {
    let nextAction = Action.Replace;
    let nextLocation = getNextLocation(to, state);

    let [historyState, url] = getHistoryStateAndUrl(nextLocation, index);

    // TODO: Support forced reloading
    globalHistory.replaceState(historyState, '', url);

    applyTx(nextAction);
  }

  function go(delta: number) {
    globalHistory.go(delta);
  }

  const history: BrowserHistory = {
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    createHref,
    go,
    push,
    replace,
    back() { go(-1); },
    forward() { go(1); },
    listen(listener) {
      return listeners.push(listener)
    },
  }


  return history;

}

type Events<F> = {
  length: number;
  push: (fn: F) => () => void;
  call: (arg: any) => void;
};

function createEvents<F extends Function>(): Events<F> {
  let handlers: F[] = [];

  return {
    get length() {
      return handlers.length;
    },
    push(fn: F) {
      handlers.push(fn);
      return function () {
        handlers = handlers.filter((handler) => handler !== fn);
      };
    },
    call(arg) {
      handlers.forEach((fn) => fn && fn(arg));
    }
  };
}


function createKey() {
  return Math.random().toString(36).substr(2, 8);
}

export function createPath({
  pathname = '/',
  search = '',
  hash = ''
}: PartialPath) {
  return pathname + search + hash;
}

/**
 * Parses a string URL path into its separate pathname, search, and hash components.
 *
 * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#parsepath
 */
export function parsePath(path: string): PartialPath {
  let parsedPath: PartialPath = {};

  if (path) {
    let hashIndex = path.indexOf('#');
    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }

    let searchIndex = path.indexOf('?');
    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }

    if (path) {
      parsedPath.pathname = path;
    }
  }

  return parsedPath;
}


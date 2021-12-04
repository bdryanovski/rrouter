# R is for Router

Pretty simple and basic router that don't depend on any framework and could be used in any project. There is no external
dependencies and no need to install any library. Just import it and that's all.

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation

```bash
npm install r-router
```

## Usage

```html
  <script type="module">
    import { html, render } from 'lit';

    import { RRouter } from '../dist/src/index.js';
    import '../dist/src/r-link.j'

    class Home extends HTMLElement {
      connectedCallback() {
        this.innerHTML = '<h1>Home</h1>';
      }
    }
    window.customElements.define("page-home", Home);

    class Posts extends HTMLElement {
      connectedCallback() {
        this.innerHTML = '<h1>Posts</h1>';
      }
    }
    window.customElements.define("page-posts", Posts);

    class About extends HTMLElement {
      connectedCallback() {
        this.innerHTML = '<h1>About</h1>';
      }
    }
    window.customElements.define("page-about", About);

    class NotFound extends HTMLElement {
      connectedCallback() {
        this.innerHTML = '<h1>Page Not Found 404</h1>';
      }
    }
    window.customElements.define("page-not-found", NotFound);

    class Application extends RRouter {
      routes = [
        { path: '/', component: 'page-home' },
        { path: '/posts', component: 'page-posts' },
        { path: '/about', component: 'page-about' },
        { path: '*', component: 'page-not-found' },
      ];
    }
    window.customElements.define("my-application", Application);
  </script>

  <my-application>
  <div class="container">

    <h3>Navigation</h3>
    <div class="navigation">
      <ul>
        <li><r-link route="/">Home</r-link></li>
        <li><r-link route="/posts">Posts</r-link></li>
        <li><r-link route="/about">About</r-link></li>
      </ul>
    </div>

    <h3>Content: </h3>
    <div class="main">
      <!-- the content of the pages will be inserted here -->
      <r-outlet />
    </div>
  </div>
</my-application>
```

## Development

### Linting and formatting

To scan the project for linting and formatting errors, run

```bash
npm run lint
```

To automatically fix linting and formatting errors, run

```bash
npm run format
```

### Testing with Web Test Runner

To execute a single test run:

```bash
npm run test
```

To run the tests in interactive watch mode run:

```bash
npm run test:watch
```

### Demoing with Storybook

To run a local instance of Storybook for your component, run

```bash
npm run storybook
```

To build a production version of Storybook, run

```bash
npm run storybook:build
```

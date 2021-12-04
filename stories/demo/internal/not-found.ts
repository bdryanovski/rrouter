import { html, LitElement } from 'lit';

export class DemoNotFound extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    console.log('NotFound page is loaded');
  }

  render() {
    return html`<h1>Not Found</h1>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-not-found': DemoNotFound;
  }
}

window.customElements.define('demo-not-found', DemoNotFound);

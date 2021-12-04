import { html, LitElement } from 'lit';

export class DemoAbout extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    console.log('About page is loaded');
  }

  render() {
    return html`<h1>About</h1>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-about': DemoAbout;
  }
}

window.customElements.define('demo-about', DemoAbout);
